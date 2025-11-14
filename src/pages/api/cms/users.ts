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

    // Fetch all auth users first to ensure we get all users
    const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers();
    
    if (authUsersError) {
      logger.error('Error fetching auth users:', authUsersError);
    }
    
    logger.info(`[Users API] Found ${authUsers?.users?.length || 0} users in auth.users`);

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, display_name, role, created_at, last_login, status')
      .order('created_at', { ascending: false });

    if (profilesError) {
      logger.error('Error fetching profiles:', profilesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    logger.info(`[Users API] Found ${profiles?.length || 0} profiles in database`);
    
    // Create a map of profile IDs for quick lookup
    const profileMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        profileMap.set(profile.id, profile);
        logger.info(`[Users API] Profile: ${profile.email}, role: ${profile.role || 'null/undefined'}, id: ${profile.id}`);
      });
    }
    
    // Create profiles for auth users that don't have profiles yet
    if (authUsers?.users) {
      for (const authUser of authUsers.users) {
        if (!profileMap.has(authUser.id)) {
          logger.info(`[Users API] Creating missing profile for user: ${authUser.email}`);
          try {
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: authUser.id,
                email: authUser.email || '',
                display_name: authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'User',
                role: 'user', // Default role
                status: 'active',
                created_at: authUser.created_at || new Date().toISOString()
              });
            
            if (createError) {
              logger.error(`[Users API] Failed to create profile for ${authUser.email}:`, createError);
            } else {
              logger.info(`[Users API] Created profile for ${authUser.email}`);
              // Add to profileMap so it's included in results
              profileMap.set(authUser.id, {
                id: authUser.id,
                email: authUser.email || '',
                display_name: authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'User',
                role: 'user',
                status: 'active',
                created_at: authUser.created_at || new Date().toISOString(),
                last_login: null
              });
            }
          } catch (error) {
            logger.error(`[Users API] Error creating profile for ${authUser.email}:`, error);
          }
        }
      }
    }
    
    // Re-fetch profiles to get the newly created ones
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('id, email, display_name, role, created_at, last_login, status')
      .order('created_at', { ascending: false });
    
    if (allProfilesError) {
      logger.error('Error re-fetching profiles:', allProfilesError);
    }
    
    const finalProfiles = allProfiles || profiles || [];
    logger.info(`[Users API] Final profile count: ${finalProfiles.length}`);

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
    const users = finalProfiles.map(profile => {
      // Get role from user_roles table first, then profile, then default to 'user'
      const userRoleFromTable = roleMap.get(profile.id);
      const profileRole = profile.role;
      
      // Handle null, undefined, or empty string roles
      let finalRole = 'user'; // Default
      if (userRoleFromTable && userRoleFromTable.trim() !== '') {
        finalRole = userRoleFromTable;
      } else if (profileRole && profileRole.trim() !== '') {
        finalRole = profileRole;
      }
      
      logger.info(`[Users API] User ${profile.email}: profile.role="${profileRole}", user_roles="${userRoleFromTable}", final="${finalRole}"`);
      
      return {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        role: finalRole,
        lastActive: profile.last_login 
          ? new Date(profile.last_login).toLocaleDateString() 
          : profile.created_at 
            ? new Date(profile.created_at).toLocaleDateString() 
            : 'Never',
        createdAt: profile.created_at,
        status: profile.status || 'active'
      };
    });

    logger.info(`[Users API] Returning ${users.length} users:`, users.map(u => ({ email: u.email, role: u.role })));

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

    if (profileError) {
      logger.error('Error updating profile role:', profileError);
    }

    // Upsert user role (insert or update)
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role }, { onConflict: 'user_id' });

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
