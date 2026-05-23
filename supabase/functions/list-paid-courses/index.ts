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

function getBearerToken(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  return authHeader.replace(/^Bearer\s+/i, "").trim();
}

function getCourseStoragePath(videoUrl?: string | null) {
  if (!videoUrl) return null;
  if (!/^https?:\/\//i.test(videoUrl)) return videoUrl.replace(/^\/+/, "");

  try {
    const url = new URL(videoUrl);
    const marker = "/storage/v1/object/public/courses/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
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

  let canAccessVideos = false;
  const bearerToken = getBearerToken(req);
  if (bearerToken) {
    const { data: { user } } = await supabase.auth.getUser(bearerToken);
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (["admin", "creator"].includes(profile?.role ?? "")) {
        canAccessVideos = true;
      } else {
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("student_id", user.id)
          .eq("status", "active")
          .gt("expires_at", new Date().toISOString())
          .limit(1)
          .maybeSingle();
        canAccessVideos = Boolean(subscription);
      }
    }
  }

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

  const secureCourses = await Promise.all((courses ?? []).map(async (course) => {
      const instructor = profilesById.get(course.instructor_id);
      const videoPath = canAccessVideos ? getCourseStoragePath(course.video_url) : null;
      const { data: signedVideo } = videoPath
        ? await supabase.storage.from("courses").createSignedUrl(videoPath, 60 * 10)
        : { data: null };

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
        videoUrl: signedVideo?.signedUrl,
        type: course.type || "video",
        instructor: {
          name: `${instructor?.first_name || "Expert"} ${instructor?.last_name || "Instructor"}`.trim(),
          role: "Course Creator",
          avatar: instructor?.avatar_url || "https://ui-avatars.com/api/?name=AI&background=00154d&color=fff",
        },
      };
    }));

  return jsonResponse({
    courses: secureCourses,
  });
});
