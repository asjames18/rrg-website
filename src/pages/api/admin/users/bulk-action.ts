/**
 * API Route: Admin Bulk User Actions
 * POST /api/admin/users/bulk-action - Perform bulk actions on multiple users
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check admin role
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

    // Parse request body
    const body = await request.json();
    const { action, userIds } = body;

    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prevent acting on self
    const filteredUserIds = userIds.filter(id => id !== user.id);
    if (filteredUserIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Cannot perform bulk action on yourself' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result: any = { success: false, affectedCount: 0 };

    switch (action) {
      case 'change_role': {
        const { role } = body;
        if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
          return new Response(JSON.stringify({ error: 'Invalid role' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const { error: updateError, count } = await supabase
          .from('profiles')
          .update({ role })
          .in('id', filteredUserIds);

        if (updateError) {
          logger.error('Bulk role change error:', updateError);
          return new Response(JSON.stringify({ error: 'Failed to update roles' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        result = { success: true, affectedCount: count || 0, action: 'role_changed', role };
        break;
      }

      case 'change_status': {
        const { status } = body;
        if (!status || !['active', 'suspended', 'deleted'].includes(status)) {
          return new Response(JSON.stringify({ error: 'Invalid status' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const { error: updateError, count } = await supabase
          .from('profiles')
          .update({ status })
          .in('id', filteredUserIds);

        if (updateError) {
          logger.error('Bulk status change error:', updateError);
          return new Response(JSON.stringify({ error: 'Failed to update status' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        result = { success: true, affectedCount: count || 0, action: 'status_changed', status };
        break;
      }

      case 'delete': {
        const { permanent } = body;

        if (permanent === true) {
          // Permanent delete
          const { error: deleteError, count } = await supabase
            .from('profiles')
            .delete()
            .in('id', filteredUserIds);

          if (deleteError) {
            logger.error('Bulk delete error:', deleteError);
            return new Response(JSON.stringify({ error: 'Failed to delete users' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          result = { success: true, affectedCount: count || 0, action: 'deleted_permanent' };
        } else {
          // Soft delete
          const { error: updateError, count } = await supabase
            .from('profiles')
            .update({ status: 'deleted' })
            .in('id', filteredUserIds);

          if (updateError) {
            logger.error('Bulk soft delete error:', updateError);
            return new Response(JSON.stringify({ error: 'Failed to delete users' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          result = { success: true, affectedCount: count || 0, action: 'deleted_soft' };
        }
        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Log the admin action
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'admin_bulk_action',
        description: `Bulk action: ${action}`,
        metadata: { action, userIds: filteredUserIds, ...result }
      });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Admin bulk action error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

