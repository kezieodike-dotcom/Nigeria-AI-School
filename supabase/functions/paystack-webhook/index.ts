import { createClient } from "npm:@supabase/supabase-js@2";
import { getPaystackSecretKey } from "../_shared/paystack.ts";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

async function verifySignature(rawBody: string, signature: string, secret: string) {
  if (!signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  return constantTimeEqual(toHex(digest), signature.toLowerCase());
}

async function failPayment(
  supabase: any,
  reference: string,
  rawResponse: Record<string, unknown>,
) {
  await supabase
    .from("payments")
    .update({
      status: "failed",
      raw_response: rawResponse,
      updated_at: new Date().toISOString(),
    })
    .eq("reference", reference);
}

async function enrollPaidCourses(supabase: any, payment: any) {
  const { data: items, error: itemsError } = await supabase
    .from("payment_items")
    .select("course_id, amount")
    .eq("payment_id", payment.id);

  if (itemsError) return itemsError;

  const enrollmentRows = (items && items.length > 0 ? items : [{
    course_id: payment.course_id,
    amount: payment.amount,
  }]).map((item: any) => ({
    course_id: item.course_id,
    student_id: payment.student_id,
    amount: item.amount,
    status: "active",
  }));

  const { error } = await supabase.from("enrollments").upsert(
    enrollmentRows,
    { onConflict: "course_id,student_id" },
  );

  return error;
}

function addOneMonth(date: Date) {
  const expiresAt = new Date(date);
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  return expiresAt;
}

async function activateMonthlySubscription(
  supabase: any,
  payment: any,
  rawResponse: Record<string, unknown>,
) {
  const startsAt = new Date();
  const expiresAt = addOneMonth(startsAt);

  const { error: subscriptionError } = await supabase.from("subscriptions").upsert({
    student_id: payment.student_id,
    payment_id: payment.id,
    reference: payment.reference,
    provider: "paystack",
    amount: payment.amount,
    currency: payment.currency,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    raw_response: rawResponse,
  }, {
    onConflict: "reference",
  });

  if (subscriptionError) return { error: subscriptionError };

  const { error: paymentError } = await supabase
    .from("payments")
    .update({
      subscription_starts_at: startsAt.toISOString(),
      subscription_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("reference", payment.reference);

  return { error: paymentError };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const { key: paystackSecretKey, error: paystackConfigError } = getPaystackSecretKey();
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (paystackConfigError || !paystackSecretKey || !supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: paystackConfigError ?? "Payment service is not configured" }, 500);
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (!(await verifySignature(rawBody, signature, paystackSecretKey))) {
    return jsonResponse({ error: "Invalid signature" }, 401);
  }

  let event: Record<string, any>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }
  const reference = event?.data?.reference as string | undefined;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  await supabase.from("payment_events").insert({
    provider: "paystack",
    event_type: event.event ?? "unknown",
    reference,
    payload: event,
  });

  if (event.event !== "charge.success" || !reference) {
    return jsonResponse({ received: true });
  }

  const verifyResponse = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
    },
  );
  const verifyPayload = await verifyResponse.json();

  if (!verifyResponse.ok || !verifyPayload.status || verifyPayload.data?.status !== "success") {
    await supabase
      .from("payments")
      .update({
        status: "failed",
        raw_response: verifyPayload,
        updated_at: new Date().toISOString(),
      })
      .eq("reference", reference);

    return jsonResponse({ received: true });
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, reference, course_id, student_id, amount, currency, status, payment_type")
    .eq("reference", reference)
    .single();

  if (!payment || payment.status === "success") {
    return jsonResponse({ received: true });
  }

  const paidAmount = Number(verifyPayload.data.amount ?? 0) / 100;
  const paidCurrency = String(verifyPayload.data.currency ?? "").toUpperCase();
  if (
    verifyPayload.data.reference !== payment.reference ||
    paidCurrency !== String(payment.currency).toUpperCase() ||
    paidAmount < Number(payment.amount)
  ) {
    await failPayment(supabase, reference, verifyPayload);
    return jsonResponse({ received: true });
  }

  const { error: updateError } = await supabase.from("payments").update({
    status: "success",
    provider_transaction_id: String(verifyPayload.data.id),
    paid_at: verifyPayload.data.paid_at ?? new Date().toISOString(),
    raw_response: verifyPayload,
    updated_at: new Date().toISOString(),
  }).eq("reference", reference);

  if (updateError) {
    return jsonResponse({ error: "Unable to update payment status" }, 500);
  }

  if (payment.payment_type === "subscription") {
    const { error } = await activateMonthlySubscription(supabase, payment, verifyPayload);
    if (error) {
      return jsonResponse({ error: "Payment confirmed, but subscription activation failed" }, 500);
    }
  } else {
    const enrollmentError = await enrollPaidCourses(supabase, payment);

    if (enrollmentError) {
      return jsonResponse({ error: "Payment confirmed, but enrollment failed" }, 500);
    }
  }

  return jsonResponse({ received: true });
});
