import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

function sumAmounts(rows: Array<{ amount?: number | string | null }>) {
  return rows.reduce((total, row) => total + Number(row.amount ?? 0), 0);
}

function fullName(profile: any) {
  const name = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();
  return name || "Unnamed user";
}

function tableData<T>(label: string, result: { data?: T[] | null; error?: any }, warnings: string[]) {
  if (result.error) {
    warnings.push(`${label}: ${result.error.message ?? "Unable to load data"}`);
    return [];
  }

  return result.data ?? [];
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Admin dashboard service is not configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(getBearerToken(req));

    if (userError || !user) {
      return jsonResponse({ error: userError?.message || "You must be signed in as an admin" }, 401);
    }

    const { data: adminProfile, error: adminProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminProfileError) {
      return jsonResponse({ error: `Unable to verify admin role: ${adminProfileError.message}` }, 500);
    }

    if (adminProfile?.role !== "admin") {
      return jsonResponse({ error: "Only admins can view admin dashboard data" }, 403);
    }

    const now = new Date().toISOString();
    const warnings: string[] = [];

    const [
      profileResult,
      courseResult,
      paymentResult,
      subscriptionResult,
      enrollmentResult,
      payoutResult,
      progressResult,
      applicationResult,
      authUsersResult,
    ] = await Promise.all([
      supabase.from("profiles").select("id, first_name, last_name, avatar_url, role, updated_at"),
      supabase
        .from("courses")
        .select("id, title, thumbnail, status, category, type, price, students, revenue, views, rating, reviews_count, created_at, instructor_id")
        .order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("id, reference, amount, currency, status, provider, payment_type, created_at, paid_at, student_id")
        .order("created_at", { ascending: false }),
      supabase
        .from("subscriptions")
        .select("id, student_id, amount, currency, status, starts_at, expires_at, created_at, reference, provider")
        .order("created_at", { ascending: false }),
      supabase.from("enrollments").select("id, course_id, student_id, amount, status, created_at"),
      supabase.from("payouts").select("id, creator_id, amount, method, status, created_at").order("created_at", { ascending: false }),
      supabase.from("course_progress").select("id, student_id, course_id, progress_percent, completed, last_watched_at, updated_at"),
      supabase.from("creator_applications").select("id, applicant_id, status, created_at"),
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    const profiles = tableData("profiles", profileResult, warnings);
    const courses = tableData("courses", courseResult, warnings);
    const payments = tableData("payments", paymentResult, warnings);
    const subscriptions = tableData("subscriptions", subscriptionResult, warnings);
    const enrollments = tableData("enrollments", enrollmentResult, warnings);
    const payouts = tableData("payouts", payoutResult, warnings);
    const progressRows = tableData("course_progress", progressResult, warnings);
    const applications = tableData("creator_applications", applicationResult, warnings);
    const authUsers = authUsersResult.error ? [] : authUsersResult.data?.users ?? [];

    if (authUsersResult.error) {
      warnings.push(`auth users: ${authUsersResult.error.message ?? "Unable to load email addresses"}`);
    }

  const profilesById = new Map(profiles.map((profile: any) => [profile.id, profile]));
  const authUsersById = new Map(authUsers.map((authUser: any) => [authUser.id, authUser]));

  const successfulPayments = payments.filter((payment: any) => payment.status === "success");
  const activeSubscriptions = subscriptions.filter((subscription: any) => subscription.status === "active" && subscription.expires_at > now);
  const publishedCourses = courses.filter((course: any) => course.status === "published");
  const recentUsers = profiles
    .map((profile: any) => {
      const authUser = authUsersById.get(profile.id) as any;
      return {
        id: profile.id,
        name: fullName(profile),
        email: authUser?.email ?? "No email available",
        role: profile.role ?? "student",
        avatar_url: profile.avatar_url,
        created_at: authUser?.created_at ?? profile.updated_at,
        email_confirmed: Boolean(authUser?.email_confirmed_at),
      };
    })
      .sort((a: any, b: any) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 100);

  const recentPayments = payments.slice(0, 10).map((payment: any) => {
    const student = profilesById.get(payment.student_id);
    const authUser = authUsersById.get(payment.student_id) as any;
    return {
      ...payment,
      student_name: fullName(student),
      student_email: authUser?.email ?? "No email available",
    };
  });

  const recentSubscriptions = subscriptions.slice(0, 10).map((subscription: any) => {
    const student = profilesById.get(subscription.student_id);
    const authUser = authUsersById.get(subscription.student_id) as any;
    return {
      ...subscription,
      student_name: fullName(student),
      student_email: authUser?.email ?? "No email available",
    };
  });

  const courseRows = courses.map((course: any) => {
    const instructor = profilesById.get(course.instructor_id);
    const courseProgress = progressRows.filter((row: any) => row.course_id === course.id);
    const averageProgress = courseProgress.length
      ? Math.round(courseProgress.reduce((total: number, row: any) => total + Number(row.progress_percent ?? 0), 0) / courseProgress.length)
      : 0;

    return {
      ...course,
      instructor_name: fullName(instructor),
      progress_count: courseProgress.length,
      average_progress: averageProgress,
    };
  });

  const payoutRows = payouts.map((payout: any) => {
    const creator = profilesById.get(payout.creator_id);
    return {
      ...payout,
      creator_name: fullName(creator),
    };
  });

  const creatorRows = profiles
    .filter((profile: any) => ["creator", "admin"].includes(profile.role))
    .map((profile: any) => {
      const authUser = authUsersById.get(profile.id) as any;
      return {
        id: profile.id,
        name: fullName(profile),
        email: authUser?.email ?? "No email available",
        role: profile.role,
      };
    });

    return jsonResponse({
      generated_at: now,
      warnings,
      stats: {
        total_revenue: sumAmounts(successfulPayments),
        total_users: profiles.length,
        students: profiles.filter((profile: any) => profile.role === "student").length,
        creators: profiles.filter((profile: any) => profile.role === "creator").length,
        admins: profiles.filter((profile: any) => profile.role === "admin").length,
        published_courses: publishedCourses.length,
        total_courses: courses.length,
        active_subscriptions: activeSubscriptions.length,
        successful_payments: successfulPayments.length,
        pending_creator_applications: applications.filter((application: any) => application.status === "pending").length,
        active_enrollments: enrollments.filter((enrollment: any) => enrollment.status === "active").length,
        completed_lessons: progressRows.filter((row: any) => row.completed).length,
      },
      recent_users: recentUsers,
      courses: courseRows,
      payments: recentPayments,
      subscriptions: recentSubscriptions,
      payouts: payoutRows,
      creators: creatorRows,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected admin dashboard error";
    return jsonResponse({ error: message }, 500);
  }
});
