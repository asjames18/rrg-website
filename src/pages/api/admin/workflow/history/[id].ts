/**
 * API Route: Workflow History
 * GET /api/admin/workflow/history/[id] - Get workflow history for content
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../../lib/supabase-server';
import { logger } from '../../../../../lib/logger';

export const GET: APIRoute = async ({ cookies, params, url }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check admin/editor role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const isEditor = userRoles && userRoles.some(role => ['admin', 'editor'].includes(role.role));
    if (!isEditor) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const contentId = params.id;
    const contentType = url.searchParams.get('type') || 'blog';

    if (!contentId) {
      return new Response(JSON.stringify({ error: 'Content ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get workflow history
    const { data: history, error: historyError } = await supabase
      .from('workflow_history')
      .select(`
        *,
        profiles:changed_by (
          display_name,
          email
        )
      `)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false });

    if (historyError) {
      logger.error('Workflow history fetch error:', historyError);
      return new Response(JSON.stringify({ error: 'Failed to fetch workflow history' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      history: history || []
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60'
      }
    });

  } catch (error) {
    logger.error('Workflow history API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

