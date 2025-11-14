/**
 * API Route: Admin Activity Log
 * GET /api/admin/activity - Fetch all user activity (admin-only)
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { logger } from '../../../lib/logger';

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const role = userRole?.role || profile?.role || 'user';

    if (role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const offset = (page - 1) * limit;
    
    const userId = url.searchParams.get('user_id');
    const activityType = url.searchParams.get('activity_type');
    const search = url.searchParams.get('search');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    // Build activity query
    let activityQuery = supabase
      .from('user_activity')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (userId) {
      activityQuery = activityQuery.eq('user_id', userId);
    }

    if (activityType) {
      activityQuery = activityQuery.eq('activity_type', activityType);
    }

    if (search) {
      activityQuery = activityQuery.ilike('description', `%${search}%`);
    }

    if (startDate) {
      activityQuery = activityQuery.gte('created_at', startDate);
    }

    if (endDate) {
      activityQuery = activityQuery.lte('created_at', endDate);
    }

    // Apply pagination
    activityQuery = activityQuery.range(offset, offset + limit - 1);

    const { data: activities, error: activitiesError, count } = await activityQuery;

    if (activitiesError) {
      logger.error('[Activity API] Error fetching activities:', activitiesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch user information for each activity
    const userIds = [...new Set(activities?.map(a => a.user_id).filter(Boolean) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .in('id', userIds);

    // If profiles don't have email, fetch from auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const userMap = new Map();
    
    profiles?.forEach(p => {
      userMap.set(p.id, { email: p.email, displayName: p.display_name });
    });
    
    authUsers?.users.forEach(u => {
      if (!userMap.has(u.id) || !userMap.get(u.id).email) {
        userMap.set(u.id, { 
          email: u.email || 'Unknown',
          displayName: userMap.get(u.id)?.displayName || u.user_metadata?.display_name || null
        });
      }
    });

    // Enrich activities with user info
    const enrichedActivities = activities?.map(activity => ({
      ...activity,
      user_email: userMap.get(activity.user_id)?.email || 'Unknown',
      user_name: userMap.get(activity.user_id)?.displayName || null
    })) || [];

    // Calculate summary stats (from all activities, not just current page)
    let statsQuery = supabase
      .from('user_activity')
      .select('activity_type, user_id');

    if (userId) {
      statsQuery = statsQuery.eq('user_id', userId);
    }
    if (activityType) {
      statsQuery = statsQuery.eq('activity_type', activityType);
    }
    if (search) {
      statsQuery = statsQuery.ilike('description', `%${search}%`);
    }
    if (startDate) {
      statsQuery = statsQuery.gte('created_at', startDate);
    }
    if (endDate) {
      statsQuery = statsQuery.lte('created_at', endDate);
    }

    const { data: allActivities } = await statsQuery;

    const uniqueUsers = new Set(allActivities?.map(a => a.user_id).filter(Boolean) || []).size;
    
    // Count activities by type
    const activityByType: Record<string, number> = {};
    allActivities?.forEach(a => {
      activityByType[a.activity_type] = (activityByType[a.activity_type] || 0) + 1;
    });

    // Find most common activity type
    const mostCommonType = Object.entries(activityByType)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    const summary = {
      total: count || 0,
      uniqueUsers,
      mostCommonType,
      activityByType
    };

    return new Response(JSON.stringify({
      activities: enrichedActivities,
      summary,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('[Activity API] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

