/**
 * API Route: Change User Email
 * POST /api/user/change-email - Update user's email address
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { logger } from '../../../lib/logger';

export const POST: APIRoute = async ({ request, cookies }) => {
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

    // Parse request body
    const body = await request.json();
    const { newEmail } = body;

    if (!newEmail) {
      return new Response(JSON.stringify({ error: 'New email address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if email is different from current
    if (user.email === newEmail) {
      return new Response(JSON.stringify({ error: 'New email must be different from current email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if email is already in use (requires admin access)
    const adminSupabase = supabaseAdmin();
    const { data: existingUser } = await adminSupabase.auth.admin.getUserByEmail(newEmail);
    if (existingUser?.user && existingUser.user.id !== user.id) {
      return new Response(JSON.stringify({ error: 'This email address is already in use' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update email in Supabase Auth
    // This will send a confirmation email to the new address
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (updateError) {
      logger.error('[Change Email] Error updating email:', updateError);
      return new Response(JSON.stringify({ 
        error: 'Failed to update email address',
        message: updateError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update email in profiles table if it exists
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ email: newEmail })
      .eq('id', user.id);

    if (profileError) {
      logger.warn('[Change Email] Could not update profiles table:', profileError);
      // Don't fail the request - auth update succeeded
    }

    // Log activity
    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'email_changed',
          description: `Email address changed from ${user.email} to ${newEmail}`,
          metadata: {
            old_email: user.email,
            new_email: newEmail
          }
        });
    } catch (activityError) {
      logger.warn('[Change Email] Could not log activity:', activityError);
      // Don't fail the request
    }

    logger.info(`[Change Email] Email updated for user ${user.id}: ${user.email} -> ${newEmail}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email address updated successfully. Please check your new email for a confirmation link.',
      user: {
        id: updateData.user?.id,
        email: updateData.user?.email,
        email_confirmed_at: updateData.user?.email_confirmed_at
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('[Change Email] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

