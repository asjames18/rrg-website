import type { APIRoute } from 'astro';
import { logger } from '../../../lib/logger';
import { supabaseServer } from '../../../lib/supabase-server';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId: string | null = null;
  let userEmail: string | null = null;
  
  try {
    const supabase = supabaseServer(cookies);
    
    // Get user info before signing out (for activity logging)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email || null;
        console.log('[Signout API] Sign out for:', userEmail, userId);
      }
    } catch (userError) {
      logger.warn('[Signout API] Could not get user before signout:', userError);
    }
    
    // Sign out from Supabase
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      logger.error('[Signout API] Supabase signout error:', signOutError);
      // Continue anyway to clear cookies
    }
    
    // Log signout activity
    if (userId) {
      try {
        const adminClient = supabaseAdmin();
        await adminClient
          .from('user_activity')
          .insert({
            user_id: userId,
            activity_type: 'logout',
            description: 'User signed out',
            metadata: { email: userEmail, source: 'web' }
          })
          .then(({ error: activityError }) => {
            if (activityError) {
              logger.error('[Signout API] Failed to log signout activity:', activityError);
            } else {
              console.log('[Signout API] Signout activity logged for:', userEmail);
            }
          });
      } catch (logError) {
        logger.error('[Signout API] Error logging signout:', logError);
        // Don't fail the signout if logging fails
      }
    }
    
    // Clear all authentication cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token', 
      'sb-rrg-auth-token',
      'sb:rrg:auth',
      'supabase-auth-token'
    ];
    
    console.log('[Signout API] Clearing authentication cookies');
    
    cookieNames.forEach(name => {
      cookies.delete(name, { path: '/' });
    });
    
    // Clear the main Supabase auth cookie with all variations
    cookies.delete('sb-rrg-auth-token', { 
      path: '/',
      domain: '.localhost',
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    });
    
    logger.info('[Signout API] Sign out successful for:', userEmail || 'unknown user');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Signed out successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'sb-rrg-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
      }
    });
    
  } catch (error) {
    logger.error('[Signout API] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An unexpected error occurred during sign out' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};