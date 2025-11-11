/**
 * API Route: Admin Users Export
 * GET /api/admin/users/export - Export users list as CSV
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

    // Parse query parameters for filters
    const search = url.searchParams.get('search') || '';
    const roleFilter = url.searchParams.get('role');
    const statusFilter = url.searchParams.get('status') || 'active';

    // Build query
    let query = supabase
      .from('profiles')
      .select('id, email, display_name, role, status, created_at, last_login')
      .order('created_at', { ascending: false });

    // Apply filters (same as the list API)
    if (search) {
      query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: users, error: usersError } = await query;

    if (usersError) {
      logger.error('Error fetching users for export:', usersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate CSV
    const csvHeaders = ['ID', 'Email', 'Display Name', 'Role', 'Status', 'Created At', 'Last Login'];
    const csvRows = users?.map(user => [
      user.id,
      user.email || '',
      user.display_name || '',
      user.role,
      user.status || 'active',
      new Date(user.created_at).toISOString(),
      user.last_login ? new Date(user.last_login).toISOString() : ''
    ]) || [];

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(val => escapeCsvValue(String(val))).join(','))
    ].join('\n');

    // Log the export action
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'admin_export_users',
        description: `Exported ${users?.length || 0} users to CSV`,
        metadata: { count: users?.length || 0, filters: { search, role: roleFilter, status: statusFilter } }
      });

    const filename = `users-export-${new Date().toISOString().split('T')[0]}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    logger.error('Admin export error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

