/**
 * API Route: Change Password
 * POST /api/user/change-password
 * Updates user password via Supabase Auth
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
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
    const { newPassword } = body;

    // Validate new password
    if (!newPassword || typeof newPassword !== 'string') {
      return new Response(JSON.stringify({ error: 'New password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ 
        error: 'Password must be at least 8 characters long' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for password complexity (at least one number or special character)
    const hasNumberOrSpecial = /[\d\W]/.test(newPassword);
    if (!hasNumberOrSpecial) {
      return new Response(JSON.stringify({ 
        error: 'Password must contain at least one number or special character' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update password using Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      logger.error('Password update error:', updateError);
      return new Response(JSON.stringify({ 
        error: updateError.message || 'Failed to update password' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log the password change activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'password_changed',
        description: 'Password updated successfully',
        metadata: { timestamp: new Date().toISOString() }
      });

    logger.info(`Password changed for user: ${user.email}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Password updated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Change password error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

