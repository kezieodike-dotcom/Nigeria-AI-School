import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RoleRequest = {
  user_id?: string;
  role?: "student" | "creator" | "admin";
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
    return jsonResponse({ error: "Role management service is not configured" }, 500);
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
    return jsonResponse({ error: "Only admins can manage user roles" }, 403);
  }

  const body = (await req.json().catch(() => ({}))) as RoleRequest;
  if (!body.user_id || !["student", "creator", "admin"].includes(body.role ?? "")) {
    return jsonResponse({ error: "user_id and a valid role are required" }, 400);
  }

  if (body.user_id === user.id && body.role !== "admin") {
    return jsonResponse({ error: "Admins cannot remove their own admin access" }, 400);
  }

  const { data: targetProfile, error: targetError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", body.user_id)
    .maybeSingle();

  if (targetError || !targetProfile) {
    return jsonResponse({ error: "User profile not found" }, 404);
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      role: body.role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.user_id)
    .select("id, role")
    .single();

  if (updateError) {
    return jsonResponse({ error: updateError.message || "Unable to update user role" }, 500);
  }

  return jsonResponse({ profile: updatedProfile });
});
