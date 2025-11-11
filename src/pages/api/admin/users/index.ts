/**
 * API Route: Admin Users List
 * GET /api/admin/users - Fetch all users with search, filters, and pagination
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const GET: APIRoute = async ({ url, cookies }) => {
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

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const search = url.searchParams.get('search') || '';
    const roleFilter = url.searchParams.get('role');
    const statusFilter = url.searchParams.get('status') || 'active';
    const sortBy = url.searchParams.get('sort') || 'created_at';
    const sortOrder = url.searchParams.get('order') === 'asc' ? true : false;
    const offset = (page - 1) * limit;

    // Build base query
    let query = supabase
      .from('profiles')
      .select('id, email, display_name, role, status, created_at, last_login', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    // Apply role filter
    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Apply sorting
    const validSortColumns = ['email', 'created_at', 'last_login', 'role'];
    if (validSortColumns.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, error: usersError, count } = await query;

    if (usersError) {
      logger.error('Error fetching users:', usersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
      users: users || [],
      pagination
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-cache'
      }
    });

  } catch (error) {
    logger.error('Admin users API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

