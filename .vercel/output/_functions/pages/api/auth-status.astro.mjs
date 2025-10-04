import { s as supabaseServer } from '../../chunks/supabase-server_DNXtBe2A.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.headers.get("cookie")?.match(/sb-.*-auth-token=([^;]+)/)?.[1];
    if (!token) {
      return new Response(
        JSON.stringify({
          authenticated: false,
          user: null,
          profile: null
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({
          authenticated: false,
          user: null,
          profile: null
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const { data: profile } = await supabaseServer.from("profiles").select("*").eq("id", user.id).single();
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        profile: profile || null
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Auth status check failed:", error);
    return new Response(
      JSON.stringify({
        authenticated: false,
        user: null,
        profile: null,
        error: "Internal server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
