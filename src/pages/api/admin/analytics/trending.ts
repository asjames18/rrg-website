/**
 * API Route: Trending Content
 * GET /api/admin/analytics/trending - Get trending content
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const GET: APIRoute = async ({ cookies, url }) => {
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

    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Get trending content from the view
    const { data: trending, error: trendingError } = await supabase
      .from('trending_content')
      .select('*')
      .limit(limit);

    if (trendingError) {
      logger.error('Trending content error:', trendingError);
      return new Response(JSON.stringify({ error: 'Failed to fetch trending content' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      trending: trending || [],
      period: 'Last 7 days',
      limit
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300' // 5 minutes
      }
    });

  } catch (error) {
    logger.error('Trending content API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

