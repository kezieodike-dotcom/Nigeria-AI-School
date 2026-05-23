import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type VerifyRequest = {
  reference?: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getBearerToken(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  return authHeader.replace(/^Bearer\s+/i, "").trim();
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

  return { error: paymentError, expires_at: expiresAt.toISOString() };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!paystackSecretKey || !supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Payment service is not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(getBearerToken(req));

  if (userError || !user) {
    return jsonResponse({ error: "You must be signed in to verify a payment" }, 401);
  }

  const body = (await req.json().catch(() => ({}))) as VerifyRequest;
  if (!body.reference) {
    return jsonResponse({ error: "reference is required" }, 400);
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("id, reference, course_id, student_id, amount, currency, status, payment_type, subscription_expires_at")
    .eq("reference", body.reference)
    .single();

  if (paymentError || !payment) {
    return jsonResponse({ error: "Payment not found" }, 404);
  }

  if (payment.student_id !== user.id) {
    return jsonResponse({ error: "You can only verify your own payment" }, 403);
  }

  if (payment.status === "success") {
    return jsonResponse({
      status: "success",
      course_id: payment.course_id,
      payment_type: payment.payment_type,
      subscription_expires_at: payment.subscription_expires_at,
    });
  }

  const verifyResponse = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(payment.reference)}`,
    {
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
    },
  );
  const verifyPayload = await verifyResponse.json();

  if (!verifyResponse.ok || !verifyPayload.status || verifyPayload.data?.status !== "success") {
    await failPayment(supabase, payment.reference, verifyPayload);
    return jsonResponse({ status: "failed" });
  }

  const paidAmount = Number(verifyPayload.data.amount ?? 0) / 100;
  const paidCurrency = String(verifyPayload.data.currency ?? "").toUpperCase();
  if (
    verifyPayload.data.reference !== payment.reference ||
    paidCurrency !== String(payment.currency).toUpperCase() ||
    paidAmount < Number(payment.amount)
  ) {
    await failPayment(supabase, payment.reference, verifyPayload);
    return jsonResponse({ status: "failed" });
  }

  const { error: updateError } = await supabase
    .from("payments")
    .update({
      status: "success",
      provider_transaction_id: String(verifyPayload.data.id),
      paid_at: verifyPayload.data.paid_at ?? new Date().toISOString(),
      raw_response: verifyPayload,
      updated_at: new Date().toISOString(),
    })
    .eq("reference", payment.reference);

  if (updateError) {
    return jsonResponse({ error: "Unable to update payment status" }, 500);
  }

  if (payment.payment_type === "subscription") {
    const { error, expires_at } = await activateMonthlySubscription(supabase, payment, verifyPayload);
    if (error) {
      return jsonResponse({ error: "Payment confirmed, but subscription activation failed" }, 500);
    }

    return jsonResponse({
      status: "success",
      payment_type: "subscription",
      subscription_expires_at: expires_at,
    });
  } else {
    const enrollmentError = await enrollPaidCourses(supabase, payment);

    if (enrollmentError) {
      return jsonResponse({ error: "Payment confirmed, but enrollment failed" }, 500);
    }
  }

  return jsonResponse({
    status: "success",
    course_id: payment.course_id,
    payment_type: payment.payment_type,
  });
});
