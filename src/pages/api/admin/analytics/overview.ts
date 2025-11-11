/**
 * API Route: Analytics Overview
 * GET /api/admin/analytics/overview - Get analytics overview
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const GET: APIRoute = async ({ locals, cookies, url }) => {
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

    const supabase = supabaseServer(cookies);

    // Get date range from query params (default to last 30 days)
    const days = parseInt(url.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total views by content type
    const { data: viewsByType, error: viewsError } = await supabase
      .from('content_analytics')
      .select('content_type, views')
      .gte('date', startDate.toISOString().split('T')[0]);

    if (viewsError) {
      logger.error('Analytics views error:', viewsError);
    }

    // Aggregate views by type
    const aggregatedViews: Record<string, number> = {};
    viewsByType?.forEach(row => {
      aggregatedViews[row.content_type] = (aggregatedViews[row.content_type] || 0) + row.views;
    });

    // Get trending content
    const { data: trending } = await supabase
      .from('trending_content')
      .select('*')
      .limit(10);

    // Get views over time (last 30 days)
    const { data: viewsOverTime } = await supabase
      .from('content_analytics')
      .select('date, views')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Aggregate views by date
    const viewsByDate: Record<string, number> = {};
    viewsOverTime?.forEach(row => {
      viewsByDate[row.date] = (viewsByDate[row.date] || 0) + row.views;
    });

    return new Response(JSON.stringify({
      views_by_type: aggregatedViews,
      trending_content: trending || [],
      views_over_time: viewsByDate,
      date_range: {
        start: startDate.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        days
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300' // 5 minutes
      }
    });

  } catch (error) {
    logger.error('Analytics overview API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

