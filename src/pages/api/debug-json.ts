/**
 * Debug API Route: Test JSON parsing
 * POST /api/debug-json
 * 
 * Simple endpoint to test JSON parsing and help debug issues
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Debug JSON API called');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Request method:', request.method);
    console.log('Request URL:', request.url);

    // Check if request has body
    const contentLength = request.headers.get('content-length');
    console.log('Content-Length:', contentLength);

    // Don't reject based on Content-Length alone - some requests might not have it set
    // We'll check the actual body content instead

    // Try to parse JSON
    let body;
    let rawText = '';
    try {
      rawText = await request.text();
      console.log('Raw request body:', rawText);
      
      if (!rawText || rawText.trim() === '') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Empty request body',
            debug: { rawBody: rawText }
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      body = JSON.parse(rawText);
      console.log('Parsed JSON body:', body);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body',
          debug: {
            jsonError: jsonError instanceof Error ? jsonError.message : 'Unknown error',
            rawBody: rawText
          }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'JSON parsed successfully',
        debug: {
          receivedBody: body,
          bodyType: typeof body,
          bodyKeys: Object.keys(body || {})
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Debug API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          errorType: typeof error,
          errorStack: error instanceof Error ? error.stack : undefined
        }
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Debug API is working',
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
