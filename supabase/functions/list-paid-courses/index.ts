import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

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

  if (!["GET", "POST"].includes(req.method)) {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Course service is not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, description, category, rating, price, thumbnail, video_url, type, duration, instructor_id")
    .eq("status", "published")
    .gt("price", 0)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const instructorIds = [...new Set((courses ?? []).map((course) => course.instructor_id).filter(Boolean))];
  const { data: profiles } = instructorIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .in("id", instructorIds)
    : { data: [] };

  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return jsonResponse({
    courses: (courses ?? []).map((course) => {
      const instructor = profilesById.get(course.instructor_id);
      return {
        id: course.id,
        title: course.title,
        description: course.description || "A practical paid course from Nigeria AI School.",
        category: course.category || "AI & ML",
        rating: course.rating || 0,
        reviewsCount: 0,
        price: Math.max(Number(course.price || 0), 15000),
        thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
        duration: course.duration || "Self-paced",
        videoUrl: course.video_url,
        type: course.type || "video",
        instructor: {
          name: `${instructor?.first_name || "Expert"} ${instructor?.last_name || "Instructor"}`.trim(),
          role: "Course Creator",
          avatar: instructor?.avatar_url || "https://ui-avatars.com/api/?name=AI&background=00154d&color=fff",
        },
      };
    }),
  });
});
