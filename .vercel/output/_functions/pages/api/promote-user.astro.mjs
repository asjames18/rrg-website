import { s as supabaseServer } from '../../chunks/supabase-server_ssb-PSP4.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.headers.get("cookie")?.match(/sb-.*-auth-token=([^;]+)/)?.[1];
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data: currentProfile } = await supabaseServer.from("profiles").select("role").eq("id", user.id).single();
    if (currentProfile?.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, error: "Insufficient permissions" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { userId, role } = body;
    if (!userId || !role || !["admin", "editor", "viewer"].includes(role)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid userId or role" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error: updateError } = await supabaseServer.from("profiles").update({ role }).eq("id", userId);
    if (updateError) {
      throw updateError;
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `User promoted to ${role}`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Promote user failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
