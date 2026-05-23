import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CheckoutRequest = {
  callback_url?: string;
};

function getBearerToken(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  return authHeader.replace(/^Bearer\s+/i, "").trim();
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function callbackUrlWithReference(baseUrl: string, reference: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("payment_reference", reference);
  return url.toString();
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

  const bearerToken = getBearerToken(req);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(bearerToken);

  if (userError || !user?.email) {
    return jsonResponse({ error: "You must be signed in to subscribe" }, 401);
  }

  const { data: activeSubscription } = await supabase
    .from("subscriptions")
    .select("id, expires_at")
    .eq("student_id", user.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeSubscription) {
    return jsonResponse({
      error: "You already have an active monthly subscription",
      expires_at: activeSubscription.expires_at,
    }, 409);
  }

  const body = (await req.json().catch(() => ({}))) as CheckoutRequest;
  const amount = 10000;
  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonResponse({ error: "Subscription price is invalid" }, 500);
  }

  const reference = `nais-sub-${crypto.randomUUID().replaceAll("-", "")}`;
  let callbackUrl: string;
  try {
    callbackUrl = callbackUrlWithReference(
      body.callback_url ?? `${req.headers.get("Origin") ?? ""}/dashboard`,
      reference,
    );
  } catch {
    return jsonResponse({ error: "callback_url is invalid" }, 400);
  }

  const initializeResponse = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: Math.round(amount * 100),
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata: {
        checkout_type: "subscription",
        plan: "monthly_all_access",
        student_id: user.id,
        access_period: "one_month",
      },
    }),
  });

  const initializePayload = await initializeResponse.json();
  if (!initializeResponse.ok || !initializePayload.status) {
    return jsonResponse(
      { error: initializePayload.message ?? "Unable to initialize subscription payment" },
      502,
    );
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    reference,
    course_id: null,
    student_id: user.id,
    amount,
    currency: "NGN",
    status: "pending",
    provider: "paystack",
    payment_type: "subscription",
    authorization_url: initializePayload.data.authorization_url,
    raw_response: initializePayload,
  });

  if (paymentError) {
    return jsonResponse({ error: "Unable to record subscription payment attempt" }, 500);
  }

  return jsonResponse({
    authorization_url: initializePayload.data.authorization_url,
    access_code: initializePayload.data.access_code,
    reference,
  });
});
