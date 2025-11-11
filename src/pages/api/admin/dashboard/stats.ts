/**
 * API Route: Admin Dashboard Stats
 * GET /api/admin/dashboard/stats - Get dashboard statistics
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const GET: APIRoute = async ({ locals, cookies }) => {
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

    // Get dashboard stats using the database function
    const { data: stats, error: statsError } = await supabase
      .rpc('get_dashboard_stats');

    if (statsError) {
      logger.error('Dashboard stats error:', statsError);
      
      // Fallback: manually query stats
      const [
        postsCount,
        videosCount,
        booksCount,
        musicCount,
        usersCount,
        activityCount,
        recentActivity
      ] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('music').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('user_activity')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('user_activity')
          .select('id, activity_type, description, created_at')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const fallbackStats = {
        total_content: (postsCount.count || 0) + (videosCount.count || 0) + (booksCount.count || 0) + (musicCount.count || 0),
        total_users: usersCount.count || 0,
        total_activity_30d: activityCount.count || 0,
        content_by_type: {
          blog: postsCount.count || 0,
          videos: videosCount.count || 0,
          books: booksCount.count || 0,
          music: musicCount.count || 0
        },
        recent_activity: recentActivity.data || []
      };

      return new Response(JSON.stringify({ stats: fallbackStats }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=60'
        }
      });
    }

    // Get content growth data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: contentGrowth } = await supabase
      .from('posts')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true });

    // Group by date
    const growthByDate: Record<string, number> = {};
    contentGrowth?.forEach(item => {
      const date = item.created_at.split('T')[0];
      growthByDate[date] = (growthByDate[date] || 0) + 1;
    });

    // Get user growth data (last 30 days)
    const { data: userGrowth } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true });

    const userGrowthByDate: Record<string, number> = {};
    userGrowth?.forEach(item => {
      const date = item.created_at.split('T')[0];
      userGrowthByDate[date] = (userGrowthByDate[date] || 0) + 1;
    });

    return new Response(JSON.stringify({ 
      stats,
      content_growth: growthByDate,
      user_growth: userGrowthByDate
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60'
      }
    });

  } catch (error) {
    logger.error('Dashboard stats API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

