/**
 * API Route: Admin User Detail
 * GET /api/admin/users/[id] - Get detailed user info
 * PUT /api/admin/users/[id] - Update user details
 * DELETE /api/admin/users/[id] - Delete user
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';
import { sanitizeString } from '../../../../lib/sanitize';

// Check if requesting user is admin
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  
  return userRoles && userRoles.some((role: any) => role.role === 'admin');
}

export const GET: APIRoute = async ({ params, locals, cookies }) => {
  try {
    // Use authenticated user from middleware
    const user = locals.user;
    const isAdminUser = locals.isAdmin;
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!isAdminUser) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = supabaseServer(cookies);
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch recent activity
    const { data: activities } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Fetch activity stats
    const { data: activityStats } = await supabase
      .from('user_activity')
      .select('activity_type')
      .eq('user_id', id);

    const stats = {
      totalActivities: activityStats?.length || 0,
      loginCount: activityStats?.filter((a: any) => a.activity_type === 'login').length || 0,
      postsRead: activityStats?.filter((a: any) => a.activity_type === 'post_read').length || 0,
      videosWatched: activityStats?.filter((a: any) => a.activity_type === 'video_watched').length || 0
    };

    return new Response(JSON.stringify({ 
      user: profile,
      activities: activities || [],
      stats
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Admin user detail GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals, cookies }) => {
  try {
    // Use authenticated user from middleware
    const user = locals.user;
    const isAdminUser = locals.isAdmin;
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!isAdminUser) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = supabaseServer(cookies);
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const body = await request.json();
    const { role, status, display_name } = body;

    // Build update object
    const updates: any = {};
    if (role) {
      const validRoles = ['admin', 'editor', 'viewer'];
      if (!validRoles.includes(role)) {
        return new Response(JSON.stringify({ error: 'Invalid role' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      updates.role = role;
    }
    if (status) {
      const validStatuses = ['active', 'suspended', 'deleted'];
      if (!validStatuses.includes(status)) {
        return new Response(JSON.stringify({ error: 'Invalid status' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      updates.status = status;
    }
    if (display_name !== undefined) {
      updates.display_name = sanitizeString(display_name);
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating user:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log the admin action
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'admin_user_updated',
        description: `Updated user ${updatedUser.email}`,
        metadata: { targetUserId: id, updates }
      });

    return new Response(JSON.stringify({ 
      success: true,
      user: updatedUser
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Admin user PUT error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!(await isAdmin(supabase, user.id))) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prevent self-deletion
    if (id === user.id) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own account' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if permanent delete or soft delete
    const url = new URL(request.url);
    const permanent = url.searchParams.get('permanent') === 'true';

    if (permanent) {
      // Permanent delete - remove from database
      // Note: Cascade delete will handle related records
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (deleteError) {
        logger.error('Error deleting user:', deleteError);
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Soft delete - update status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (updateError) {
        logger.error('Error soft deleting user:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Log the admin action
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'admin_user_deleted',
        description: `Deleted user (${permanent ? 'permanent' : 'soft'})`,
        metadata: { targetUserId: id, permanent }
      });

    return new Response(JSON.stringify({ 
      success: true,
      message: permanent ? 'User permanently deleted' : 'User soft deleted'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Admin user DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

