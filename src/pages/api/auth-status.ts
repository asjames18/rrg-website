/**
 * API Route: Check Authentication Status
 * GET /api/auth-status
 * 
 * Returns current user's authentication status and profile
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                 request.headers.get('cookie')?.match(/sb-.*-auth-token=([^;]+)/)?.[1];

    if (!token) {
      return new Response(
        JSON.stringify({ 
          authenticated: false, 
          user: null, 
          profile: null 
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify token and get user
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
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

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
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Auth status check failed:', error);
    return new Response(
      JSON.stringify({
        authenticated: false,
        user: null,
        profile: null,
        error: 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
