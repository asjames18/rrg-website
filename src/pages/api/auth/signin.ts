import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { sanitizeEmail } from '../../../lib/sanitize';
import { logger } from '../../../lib/logger';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const email = sanitizeEmail(body.email);
    const password = body.password; // Password should not be sanitized, but validated
    
    console.log('[Signin API] Sign in attempt for:', email);
    
    // Validate input
    if (!email || !email.includes('@')) {
      logger.warn('[Signin API] Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Attempt sign in
    const supabase = supabaseServer(cookies);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      logger.warn('[Signin API] Sign in failed for:', email, error.message);
      
      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        // Log failed attempt
        try {
          const adminClient = supabaseAdmin();
          await adminClient
            .from('user_activity')
            .insert({
              user_id: null, // No user ID for failed attempts
              activity_type: 'login_failed',
              description: 'Failed login attempt',
              metadata: { email, error: 'Invalid credentials' }
            });
        } catch (logError) {
          logger.error('[Signin API] Failed to log failed attempt:', logError);
        }
        
        return new Response(
          JSON.stringify({ error: 'Invalid email or password. Please try again.' }), 
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (error.message.includes('Email not confirmed')) {
        return new Response(
          JSON.stringify({ 
            error: 'Please verify your email address. Check your inbox for the verification link.' 
          }), 
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Log successful sign in
    if (data.user) {
      console.log('[Signin API] Sign in successful for:', email, data.user.id);
      
      try {
        const adminClient = supabaseAdmin();
        
        // Update last_login in profiles table
        await adminClient
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)
          .then(({ error: updateError }) => {
            if (updateError) {
              logger.error('[Signin API] Failed to update last_login:', updateError);
            }
          });
        
        // Log login activity
        await adminClient
          .from('user_activity')
          .insert({
            user_id: data.user.id,
            activity_type: 'login',
            description: 'User signed in',
            metadata: { email, source: 'web' }
          })
          .then(({ error: activityError }) => {
            if (activityError) {
              logger.error('[Signin API] Failed to log activity:', activityError);
            }
          });
        
      } catch (logError) {
        logger.error('[Signin API] Error logging sign in:', logError);
        // Don't fail the sign in if logging fails
      }
    }
    
    logger.info('[Signin API] Sign in successful for:', email);
    
    return new Response(
      JSON.stringify({ 
        ok: true,
        user: {
          id: data.user?.id,
          email: data.user?.email
        }
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    logger.error('[Signin API] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
