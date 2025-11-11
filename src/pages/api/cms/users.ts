import type { APIRoute } from 'astro';
import { logger } from '../../../lib/logger';

import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Use authenticated user from middleware
    const user = locals.user;
    const isAdmin = locals.isAdmin;
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = supabaseAdmin();

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, display_name, role, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      logger.error('Error fetching profiles:', profilesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all user roles to supplement profile roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      logger.warn('Error fetching user roles (using profile roles only):', rolesError);
    }

    // Create a map of user_id -> role from user_roles table
    const roleMap = new Map<string, string>();
    if (userRoles) {
      userRoles.forEach(ur => {
        // If user has multiple roles, prefer 'admin' over others
        if (!roleMap.has(ur.user_id) || ur.role === 'admin') {
          roleMap.set(ur.user_id, ur.role);
        }
      });
    }

    // Format the response, using user_roles if available, otherwise profile role
    const users = profiles.map(profile => ({
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      role: roleMap.get(profile.id) || profile.role || 'user',
      lastActive: new Date(profile.created_at).toLocaleDateString()
    }));

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Users API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    // Use authenticated user from middleware
    const user = locals.user;
    const isAdmin = locals.isAdmin;
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = supabaseAdmin();

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
      logger.error('Error updating user role:', profileError || userRoleError);
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
    logger.error('Update user role error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
