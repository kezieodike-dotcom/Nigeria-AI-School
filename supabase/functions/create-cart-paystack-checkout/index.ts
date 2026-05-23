import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CartCheckoutRequest = {
  course_ids?: string[];
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

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(getBearerToken(req));

  if (userError || !user?.email) {
    return jsonResponse({ error: "You must be signed in to checkout" }, 401);
  }

  const body = (await req.json().catch(() => ({}))) as CartCheckoutRequest;
  const courseIds = [...new Set((body.course_ids ?? []).filter(Boolean))];

  if (courseIds.length === 0) {
    return jsonResponse({ error: "Add at least one course to checkout" }, 400);
  }

  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("id, title, price, instructor_id, status")
    .in("id", courseIds);

  if (courseError) {
    return jsonResponse({ error: "Unable to load cart courses" }, 500);
  }

  if (!courses || courses.length !== courseIds.length) {
    return jsonResponse({ error: "One or more cart courses could not be found" }, 404);
  }

  const unavailable = courses.find((course) => course.status !== "published");
  if (unavailable) {
    return jsonResponse({ error: `${unavailable.title} is not available for purchase` }, 400);
  }

  const ownCourse = courses.find((course) => course.instructor_id === user.id);
  if (ownCourse) {
    return jsonResponse({ error: `You cannot buy your own course: ${ownCourse.title}` }, 400);
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", user.id)
    .eq("status", "active")
    .in("course_id", courseIds);

  const enrolledIds = new Set((enrollments ?? []).map((enrollment) => enrollment.course_id));
  if (enrolledIds.size > 0) {
    const enrolledTitle = courses.find((course) => enrolledIds.has(course.id))?.title ?? "one selected course";
    return jsonResponse({ error: `You are already enrolled in ${enrolledTitle}` }, 409);
  }

  const amount = courses.reduce((total, course) => total + Number(course.price), 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonResponse({ error: "Cart total is invalid" }, 400);
  }

  const reference = `nais-cart-${crypto.randomUUID().replaceAll("-", "")}`;
  let callbackUrl: string;
  try {
    callbackUrl = callbackUrlWithReference(
      body.callback_url ?? `${req.headers.get("Origin") ?? ""}/cart`,
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
        checkout_type: "cart",
        course_ids: courseIds,
        course_titles: courses.map((course) => course.title),
        student_id: user.id,
      },
    }),
  });

  const initializePayload = await initializeResponse.json();
  if (!initializeResponse.ok || !initializePayload.status) {
    return jsonResponse(
      { error: initializePayload.message ?? "Unable to initialize cart checkout" },
      502,
    );
  }

  const firstCourse = courses[0];
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      reference,
      course_id: firstCourse.id,
      student_id: user.id,
      amount,
      currency: "NGN",
      status: "pending",
      provider: "paystack",
      authorization_url: initializePayload.data.authorization_url,
      raw_response: initializePayload,
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    return jsonResponse({ error: "Unable to record payment attempt" }, 500);
  }

  const { error: itemError } = await supabase.from("payment_items").insert(
    courses.map((course) => ({
      payment_id: payment.id,
      course_id: course.id,
      amount: Number(course.price),
    })),
  );

  if (itemError) {
    return jsonResponse({ error: "Unable to record cart items" }, 500);
  }

  return jsonResponse({
    authorization_url: initializePayload.data.authorization_url,
    access_code: initializePayload.data.access_code,
    reference,
  });
});
