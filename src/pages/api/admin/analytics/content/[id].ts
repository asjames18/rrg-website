/**
 * API Route: Content Analytics
 * GET /api/admin/analytics/content/[id] - Get analytics for specific content
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../../lib/supabase-server';
import { logger } from '../../../../../lib/logger';

export const GET: APIRoute = async ({ cookies, params, url }) => {
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

    const contentId = params.id;
    const contentType = url.searchParams.get('type') || 'blog';

    if (!contentId) {
      return new Response(JSON.stringify({ error: 'Content ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get analytics for this specific content
    const { data: analytics, error: analyticsError } = await supabase
      .from('content_analytics')
      .select('*')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('date', { ascending: true });

    if (analyticsError) {
      logger.error('Content analytics error:', analyticsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate totals
    const totals = analytics?.reduce((acc, row) => ({
      total_views: acc.total_views + row.views,
      total_unique_visitors: acc.total_unique_visitors + row.unique_visitors,
      total_time_on_page: acc.total_time_on_page + (row.avg_time_on_page * row.views)
    }), { total_views: 0, total_unique_visitors: 0, total_time_on_page: 0 });

    const avgTimeOnPage = totals && totals.total_views > 0 
      ? Math.round(totals.total_time_on_page / totals.total_views) 
      : 0;

    return new Response(JSON.stringify({
      content_id: contentId,
      content_type: contentType,
      analytics: analytics || [],
      summary: {
        total_views: totals?.total_views || 0,
        total_unique_visitors: totals?.total_unique_visitors || 0,
        avg_time_on_page: avgTimeOnPage,
        first_view: analytics && analytics.length > 0 ? analytics[0].date : null,
        last_view: analytics && analytics.length > 0 ? analytics[analytics.length - 1].date : null
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300' // 5 minutes
      }
    });

  } catch (error) {
    logger.error('Content analytics API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

