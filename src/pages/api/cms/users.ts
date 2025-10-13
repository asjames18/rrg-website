import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseAdmin();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has admin role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const isAdmin = userRoles && userRoles.some(role => role.role === 'admin');
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all users with their roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        display_name,
        role,
        created_at,
        user_roles!inner(role)
      `)
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching users:', profilesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format the response
    const users = profiles.map(profile => ({
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      role: profile.role || 'user',
      lastActive: new Date(profile.created_at).toLocaleDateString()
    }));

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Users API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseAdmin();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has admin role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const isAdmin = userRoles && userRoles.some(role => role.role === 'admin');
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return new Response(JSON.stringify({ error: 'Missing userId or role' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update user role in both tables
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    const { error: userRoleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role })
      .eq('user_id', userId);

    if (profileError || userRoleError) {
      console.error('Error updating user role:', profileError || userRoleError);
      return new Response(JSON.stringify({ error: 'Failed to update user role' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
