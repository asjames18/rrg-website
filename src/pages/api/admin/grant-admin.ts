import type { APIRoute } from 'astro';
import { logger } from '../../../lib/logger';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request, locals }) => {
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

    const body = await request.json();
    const { email, role = 'admin' } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Invalid role. Must be admin, editor, or viewer' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use supabaseAdmin helper
    const admin = supabaseAdmin();

    // Check if user exists
    const { data: u, error: e1 } = await admin.auth.admin.getUserByEmail(email);
    if (e1 || !u?.user) {
      logger.warn(`[Grant Admin] User not found: ${email}`);
      return new Response(JSON.stringify({ error: 'User not found. They must create an account first at /auth' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update or insert user role
    const { error: upsertError } = await admin.from('user_roles')
      .upsert({ 
        user_id: u.user.id, 
        role: role 
      }, {
        onConflict: 'user_id,role'
      });

    if (upsertError) {
      logger.error('[Grant Admin] Error upserting user role:', upsertError);
      return new Response(JSON.stringify({ error: upsertError.message }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Also update the role in profiles table
    const { error: profileError } = await admin.from('profiles')
      .update({ role: role })
      .eq('id', u.user.id);

    if (profileError) {
      logger.warn('[Grant Admin] Error updating profile role:', profileError);
      // Don't fail if profile update fails, role in user_roles is more important
    }

    logger.info(`[Grant Admin] Successfully granted ${role} access to ${email}`);

    return new Response(JSON.stringify({ 
      ok: true, 
      message: `Successfully granted ${role} access to ${email}` 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    logger.error('[Grant Admin] Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
