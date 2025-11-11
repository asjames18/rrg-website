import { s as supabaseServer } from '../../chunks/supabase-server_CrvNcPIF.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { email, adminSecret } = body;
    if (adminSecret !== "rrg-admin-2024") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid admin secret" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data: users, error: userError } = await supabaseServer.auth.admin.listUsers();
    const user = users?.users?.find((u) => u.email === email);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error: updateError } = await supabaseServer.from("profiles").update({ role: "admin" }).eq("id", user.id);
    if (updateError) {
      throw updateError;
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${email} promoted to admin successfully`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error("Promote to admin failed:", error);
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
