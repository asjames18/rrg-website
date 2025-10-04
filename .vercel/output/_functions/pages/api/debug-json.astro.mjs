export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    console.log("Debug JSON API called");
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));
    console.log("Request method:", request.method);
    console.log("Request URL:", request.url);
    const contentLength = request.headers.get("content-length");
    console.log("Content-Length:", contentLength);
    let body;
    let rawText = "";
    try {
      rawText = await request.text();
      console.log("Raw request body:", rawText);
      if (!rawText || rawText.trim() === "") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Empty request body",
            debug: { rawBody: rawText }
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      body = JSON.parse(rawText);
      console.log("Parsed JSON body:", body);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
          debug: {
            jsonError: jsonError instanceof Error ? jsonError.message : "Unknown error",
            rawBody: rawText
          }
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "JSON parsed successfully",
        debug: {
          receivedBody: body,
          bodyType: typeof body,
          bodyKeys: Object.keys(body || {})
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Debug API error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        debug: {
          errorType: typeof error,
          errorStack: error instanceof Error ? error.stack : void 0
        }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      message: "Debug API is working",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
