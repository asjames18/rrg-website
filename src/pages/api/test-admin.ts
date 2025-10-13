import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Auth error: ' + authError.message,
        user: null
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No user found',
        user: null
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Check user_roles table
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);
    
    // Check admin status
    const isAdmin = userRoles && userRoles.some(role => role.role === 'admin');
    
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile: profile,
      userRoles: userRoles,
      isAdmin: isAdmin || false,
      rolesError: rolesError?.message || null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
