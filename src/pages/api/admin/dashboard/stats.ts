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

    // Query stats from unified content table
    const [
      allContent,
      blogContent,
      videoContent,
      bookContent,
      musicContent,
      usersCount,
      activityCount,
      recentActivity
    ] = await Promise.all([
      supabase.from('content').select('id, content_type, created_at', { count: 'exact' }),
      supabase.from('content').select('id', { count: 'exact', head: true }).eq('content_type', 'blog'),
      supabase.from('content').select('id', { count: 'exact', head: true }).eq('content_type', 'video'),
      supabase.from('content').select('id', { count: 'exact', head: true }).eq('content_type', 'book'),
      supabase.from('content').select('id', { count: 'exact', head: true }).eq('content_type', 'music'),
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

    const stats = {
      total_content: allContent.count || 0,
      total_users: usersCount.count || 0,
      total_activity_30d: activityCount.count || 0,
      content_by_type: {
        blog: blogContent.count || 0,
        videos: videoContent.count || 0,
        books: bookContent.count || 0,
        music: musicContent.count || 0
      },
      recent_activity: recentActivity.data || []
    };

    // Get content growth data (last 30 days) from unified content table
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: contentGrowth } = await supabase
      .from('content')
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
    // Try profiles table first, fallback to user_activity signup events
    const { data: userGrowth } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true });

    // If no data from profiles in last 30 days, try user_activity signup events
    let userGrowthData = userGrowth || [];
    if (!userGrowth || userGrowth.length === 0) {
      const { data: signupActivities } = await supabase
        .from('user_activity')
        .select('created_at')
        .eq('activity_type', 'user_signup')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });
      
      if (signupActivities && signupActivities.length > 0) {
        userGrowthData = signupActivities;
      } else {
        // If still no data, get all users to show historical data
        const { data: allUsers } = await supabase
          .from('profiles')
          .select('created_at')
          .order('created_at', { ascending: true })
          .limit(100); // Limit to last 100 users for performance
        
        if (allUsers && allUsers.length > 0) {
          // Filter to last 90 days if no 30-day data
          const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
          userGrowthData = allUsers.filter(u => u.created_at >= ninetyDaysAgo);
        }
      }
    }

    const userGrowthByDate: Record<string, number> = {};
    userGrowthData.forEach(item => {
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

