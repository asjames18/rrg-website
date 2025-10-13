import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check session status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Check user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Check admin role if user exists
    let adminRole = null;
    let roleError = null;
    
    if (user) {
      const { data: userRoles, error: rolesErr } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');
      
      adminRole = userRoles && userRoles.length > 0;
      roleError = rolesErr;
    }
    
    // Check cookies
    const authCookies = {
      access_token: cookies.get('sb-access-token')?.value ? 'Present' : 'Missing',
      refresh_token: cookies.get('sb-refresh-token')?.value ? 'Present' : 'Missing',
      supabase_auth: cookies.get('supabase-auth-token')?.value ? 'Present' : 'Missing'
    };
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: {
        exists: !!session,
        error: sessionError?.message || null,
        expires_at: session?.expires_at || null,
        user_id: session?.user?.id || null
      },
      user: {
        exists: !!user,
        error: userError?.message || null,
        email: user?.email || null,
        id: user?.id || null
      },
      adminRole: {
        isAdmin: adminRole,
        error: roleError?.message || null
      },
      cookies: authCookies,
      environment: {
        supabase_url: import.meta.env.PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabase_anon_key: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }
    };
    
    return new Response(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error) {
    console.error('Debug session error:', error);
    
    return new Response(JSON.stringify({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


