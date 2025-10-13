import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Test different ways of accessing environment variables
    const envTest = {
      // Method 1: process.env
      processEnv: {
        PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '***HIDDEN***' : 'NOT_FOUND'
      },
      // Method 2: import.meta.env
      importMetaEnv: {
        PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: import.meta.env.SUPABASE_SERVICE_ROLE_KEY ? '***HIDDEN***' : 'NOT_FOUND'
      },
      // Method 3: Check if we can access any env vars
      hasAnyEnv: {
        NODE_ENV: process.env.NODE_ENV,
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV
      }
    };
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Environment test',
      envTest
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
