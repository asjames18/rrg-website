/**
 * Health Check API Route
 * Used to debug runtime environment and environment variables
 */
export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      PUBLIC_SUPABASE_URL: !!import.meta.env.PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY: !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    // Get runtime info
    const runtimeInfo = {
      nodeVersion: typeof process !== 'undefined' ? process.version : 'N/A',
      platform: typeof process !== 'undefined' ? process.platform : 'N/A',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    };

    return new Response(JSON.stringify({
      ok: true,
      status: 'healthy',
      environment: envCheck,
      runtime: runtimeInfo,
      message: 'Health check passed'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return new Response(JSON.stringify({
      ok: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}
