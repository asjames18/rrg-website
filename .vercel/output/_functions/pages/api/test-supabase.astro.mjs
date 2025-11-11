import { s as supabaseServer } from '../../chunks/supabase-server_CrvNcPIF.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    const { error, count } = await supabase.from("posts").select("*", { count: "exact", head: true });
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        hint: "Make sure you ran the SQL schema in Supabase dashboard"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "✅ Supabase connected successfully!",
      postsCount: count || 0,
      tip: "Add some test data in Supabase dashboard to see it here"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      hint: "Check your .env file has correct Supabase credentials"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
