import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ReviewRequest = {
  application_id?: string;
  action?: "approve" | "reject";
  admin_note?: string;
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
    return jsonResponse({ error: "Creator review service is not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
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
    return jsonResponse({ error: "Only admins can review creator applications" }, 403);
  }

  const body = (await req.json().catch(() => ({}))) as ReviewRequest;
  if (!body.application_id || !["approve", "reject"].includes(body.action ?? "")) {
    return jsonResponse({ error: "application_id and action are required" }, 400);
  }

  const { data: application, error: applicationError } = await supabase
    .from("creator_applications")
    .select("id, applicant_id, status")
    .eq("id", body.application_id)
    .single();

  if (applicationError || !application) {
    return jsonResponse({ error: "Application not found" }, 404);
  }

  const nextStatus = body.action === "approve" ? "approved" : "rejected";

  const { error: updateApplicationError } = await supabase
    .from("creator_applications")
    .update({
      status: nextStatus,
      admin_note: body.admin_note ?? null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", application.id);

  if (updateApplicationError) {
    return jsonResponse({ error: "Unable to update application" }, 500);
  }

  if (body.action === "approve") {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        role: "creator",
        updated_at: new Date().toISOString(),
      })
      .eq("id", application.applicant_id);

    if (profileError) {
      return jsonResponse({ error: "Application approved, but creator role update failed" }, 500);
    }
  }

  return jsonResponse({
    status: nextStatus,
    applicant_id: application.applicant_id,
  });
});
