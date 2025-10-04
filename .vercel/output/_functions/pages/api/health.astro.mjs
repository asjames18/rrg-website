export { renderers } from '../../renderers.mjs';

async function GET() {
  try {
    const envCheck = {
      PUBLIC_SUPABASE_URL: true,
      PUBLIC_SUPABASE_ANON_KEY: true,
      SUPABASE_SERVICE_ROLE_KEY: true
    };
    const runtimeInfo = {
      nodeVersion: typeof process !== "undefined" ? process.version : "N/A",
      platform: typeof process !== "undefined" ? process.platform : "N/A",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A"
    };
    return new Response(JSON.stringify({
      ok: true,
      status: "healthy",
      environment: envCheck,
      runtime: runtimeInfo,
      message: "Health check passed"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return new Response(JSON.stringify({
      ok: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
