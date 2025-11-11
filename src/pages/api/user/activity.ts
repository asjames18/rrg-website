/**
 * API Route: User Activity
 * GET /api/user/activity - Fetch user's activity with stats and pagination
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { logger } from '../../../lib/logger';

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const activityType = url.searchParams.get('type');
    const offset = (page - 1) * limit;

    // Build query for activities
    let activityQuery = supabase
      .from('user_activity')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by activity type if specified
    if (activityType) {
      activityQuery = activityQuery.eq('activity_type', activityType);
    }

    const { data: activities, error: activitiesError, count } = await activityQuery;

    if (activitiesError) {
      logger.error('Error fetching activities:', activitiesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate statistics
    const { data: stats, error: statsError } = await supabase
      .from('user_activity')
      .select('activity_type, metadata')
      .eq('user_id', user.id);

    if (statsError) {
      logger.error('Error fetching stats:', statsError);
    }

    // Calculate stats from activities
    const postsRead = stats?.filter(a => a.activity_type === 'post_read').length || 0;
    const videosWatched = stats?.filter(a => a.activity_type === 'video_watched').length || 0;
    const favoritesSaved = stats?.filter(a => a.activity_type === 'favorite_saved').length || 0;
    
    // Calculate total time spent (sum of duration metadata if available)
    const totalTimeSpent = stats?.reduce((sum, activity) => {
      if (activity.metadata && activity.metadata.duration) {
        return sum + (parseInt(activity.metadata.duration, 10) || 0);
      }
      return sum;
    }, 0) || 0;

    const summary = {
      postsRead,
      videosWatched,
      favoritesSaved,
      totalTimeSpent
    };

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit);
    const pagination = {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasMore: page < totalPages
    };

    return new Response(JSON.stringify({ 
      activities: activities || [],
      summary,
      pagination
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=30'
      }
    });

  } catch (error) {
    logger.error('User activity error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

