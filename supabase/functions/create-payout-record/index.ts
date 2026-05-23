import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PayoutRequest = {
  creator_id?: string;
  amount?: number;
  method?: string;
  status?: "pending" | "processing" | "completed" | "failed";
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Payout service is not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(getBearerToken(req));

  if (userError || !user) {
    return jsonResponse({ error: "You must be signed in as an admin" }, 401);
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminProfile?.role !== "admin") {
    return jsonResponse({ error: "Only admins can create payout records" }, 403);
  }

  const body = (await req.json().catch(() => ({}))) as PayoutRequest;
  const amount = Number(body.amount ?? 0);
  const status = body.status ?? "pending";

  if (!body.creator_id) {
    return jsonResponse({ error: "creator_id is required" }, 400);
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonResponse({ error: "amount must be greater than zero" }, 400);
  }

  if (!["pending", "processing", "completed", "failed"].includes(status)) {
    return jsonResponse({ error: "Invalid payout status" }, 400);
  }

  const { data: creator } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", body.creator_id)
    .maybeSingle();

  if (!creator || !["creator", "admin"].includes(creator.role)) {
    return jsonResponse({ error: "Payout recipient must be a creator or admin" }, 400);
  }

  const { data: payout, error: payoutError } = await supabase
    .from("payouts")
    .insert({
      creator_id: body.creator_id,
      amount,
      method: body.method?.trim() || "Bank Transfer",
      status,
    })
    .select("id, creator_id, amount, method, status, created_at")
    .single();

  if (payoutError) {
    return jsonResponse({ error: "Unable to create payout record" }, 500);
  }

  return jsonResponse({ payout }, 201);
});
