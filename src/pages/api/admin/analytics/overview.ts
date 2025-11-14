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

    // Initialize default values
    let aggregatedViews: Record<string, number> = {};
    let trending: any[] = [];
    let viewsByDate: Record<string, number> = {};

    // Try to get analytics from content_analytics table
    let hasAnalyticsData = false;
    try {
      const { data: viewsByType, error: viewsError } = await supabase
        .from('content_analytics')
        .select('content_type, views')
        .gte('date', startDate.toISOString().split('T')[0]);

      if (!viewsError && viewsByType && viewsByType.length > 0) {
        hasAnalyticsData = true;
        viewsByType.forEach(row => {
          aggregatedViews[row.content_type] = (aggregatedViews[row.content_type] || 0) + row.views;
        });
        logger.info('[Analytics] Found analytics data:', Object.keys(aggregatedViews).length, 'content types');
      } else if (viewsError) {
        logger.warn('[Analytics] content_analytics table error:', viewsError.message);
      }
    } catch (error) {
      logger.warn('[Analytics] content_analytics table may not exist, using fallback');
    }

    // Fallback: Get content counts by type from unified content table
    // Always get content data as fallback or supplement
    if (!hasAnalyticsData || Object.keys(aggregatedViews).length === 0) {
      try {
        logger.info('[Analytics] Using fallback: getting content counts from content table');
        const { data: contentByType, error: contentError } = await supabase
          .from('content')
          .select('content_type')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (contentError) {
          logger.error('[Analytics] Error getting content by type:', contentError);
        } else if (contentByType && contentByType.length > 0) {
          logger.info('[Analytics] Found', contentByType.length, 'published content items');
          contentByType.forEach(item => {
            aggregatedViews[item.content_type] = (aggregatedViews[item.content_type] || 0) + 1;
          });
        } else {
          logger.warn('[Analytics] No published content found');
        }
      } catch (error) {
        logger.error('[Analytics] Failed to get content by type:', error);
      }
    } else {
      logger.info('[Analytics] Using analytics table data, found', Object.keys(aggregatedViews).length, 'content types');
    }

    // Try to get trending content from view
    let hasTrendingData = false;
    try {
      const { data: trendingData, error: trendingError } = await supabase
        .from('trending_content')
        .select('*')
        .limit(10);

      if (!trendingError && trendingData && trendingData.length > 0) {
        hasTrendingData = true;
        trending = trendingData;
        logger.info('[Analytics] Found trending data from view:', trending.length, 'items');
      } else if (trendingError) {
        logger.warn('[Analytics] trending_content view error:', trendingError.message);
      }
    } catch (error) {
      logger.warn('[Analytics] trending_content view may not exist, using fallback');
    }

    // Fallback: Get recently published content as "trending"
    // Always get recent content as fallback or supplement
    if (!hasTrendingData || trending.length === 0) {
      try {
        logger.info('[Analytics] Using fallback: getting trending from recently published content');
        const { data: recentContent, error: recentError } = await supabase
          .from('content')
          .select('id, content_type, title, published_at, created_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(10);

        if (recentError) {
          logger.error('[Analytics] Error getting recent content:', recentError);
        } else if (recentContent && recentContent.length > 0) {
          logger.info('[Analytics] Found', recentContent.length, 'recent published items');
          trending = recentContent.map(item => ({
            content_id: item.id,
            content_type: item.content_type,
            title: item.title,
            total_views: 0,
            total_visitors: 0,
            avg_engagement: 0
          }));
        } else {
          logger.warn('[Analytics] No published content found for trending');
        }
      } catch (error) {
        logger.error('[Analytics] Failed to get trending content:', error);
      }
    } else {
      logger.info('[Analytics] Using trending_content view, found', trending.length, 'trending items');
    }

    // Try to get views over time from content_analytics
    let hasViewsOverTime = false;
    try {
      const { data: viewsOverTime, error: viewsTimeError } = await supabase
        .from('content_analytics')
        .select('date, views')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (!viewsTimeError && viewsOverTime && viewsOverTime.length > 0) {
        hasViewsOverTime = true;
        viewsOverTime.forEach(row => {
          viewsByDate[row.date] = (viewsByDate[row.date] || 0) + row.views;
        });
        logger.info('[Analytics] Found views over time from analytics table:', Object.keys(viewsByDate).length, 'dates');
      } else if (viewsTimeError) {
        logger.warn('[Analytics] views over time error:', viewsTimeError.message);
      }
    } catch (error) {
      logger.warn('[Analytics] Failed to get views over time from analytics table');
    }

    // Fallback: Generate views over time from content creation dates
    // Always generate from content if no analytics data
    if (!hasViewsOverTime || Object.keys(viewsByDate).length === 0) {
      try {
        logger.info('[Analytics] Using fallback: generating views over time from content creation dates');
        // Get all published content, not just from date range, to show full picture
        const { data: contentOverTime, error: timeError } = await supabase
          .from('content')
          .select('created_at, published_at')
          .eq('status', 'published')
          .order('created_at', { ascending: true });

        if (timeError) {
          logger.error('[Analytics] Error getting content over time:', timeError);
        } else if (contentOverTime && contentOverTime.length > 0) {
          logger.info('[Analytics] Generating time series from', contentOverTime.length, 'content items');
          contentOverTime.forEach(item => {
            // Use published_at if available, otherwise created_at
            const dateField = item.published_at || item.created_at;
            const date = dateField.split('T')[0];
            viewsByDate[date] = (viewsByDate[date] || 0) + 1;
          });
        } else {
          logger.warn('[Analytics] No content found in date range for views over time');
        }
      } catch (error) {
        logger.error('[Analytics] Failed to generate views over time:', error);
      }
    } else {
      logger.info('[Analytics] Using analytics table for views over time, found', Object.keys(viewsByDate).length, 'dates');
    }

    logger.info('[Analytics] Returning data:', {
      views_by_type_count: Object.keys(aggregatedViews).length,
      trending_count: trending.length,
      views_over_time_count: Object.keys(viewsByDate).length
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

