import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const envVars = {
      // Check both process.env and import.meta.env
      PUBLIC_SUPABASE_URL: {
        process: process.env.PUBLIC_SUPABASE_URL,
        import: import.meta.env.PUBLIC_SUPABASE_URL,
        hasValue: !!(process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL)
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        process: process.env.SUPABASE_SERVICE_ROLE_KEY ? '***HIDDEN***' : undefined,
        import: import.meta.env.SUPABASE_SERVICE_ROLE_KEY ? '***HIDDEN***' : undefined,
        hasValue: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY)
      },
      // Check if we're in server context
      context: {
        hasProcess: typeof process !== 'undefined',
        hasImportMeta: typeof import.meta !== 'undefined',
        nodeEnv: process.env.NODE_ENV,
        astroEnv: import.meta.env.MODE
      }
    };
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Environment variables check',
      envVars
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
