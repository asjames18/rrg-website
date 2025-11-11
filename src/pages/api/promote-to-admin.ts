/**
import { logger } from '../../lib/logger';

 * API Route: Promote User to Admin
 * POST /api/promote-to-admin
 * 
 * Promotes a specific user to admin role by email
 * This is a quick way to make someone an admin
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, adminSecret } = body;

    // Simple secret check (you can change this)
    if (adminSecret !== 'rrg-admin-2024') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid admin secret' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    // Find user by email - use listUsers and filter by email
    const { data: users, error: userError } = await supabaseServer.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === email);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update user role to admin
    const { error: updateError } = await supabaseServer
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${email} promoted to admin successfully` 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logger.error('Promote to admin failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
