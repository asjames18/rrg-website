/**
 * API Route: User Preferences
 * GET /api/user/preferences - Fetch user preferences
 * PUT /api/user/preferences - Update user preferences
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { logger } from '../../../lib/logger';
import { sanitizeString } from '../../../lib/sanitize';

export const GET: APIRoute = async ({ cookies }) => {
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

    // Fetch user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (prefsError) {
      // If preferences don't exist, create default ones
      if (prefsError.code === 'PGRST116') {
        const { data: newPrefs, error: createError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            theme: 'dark',
            show_sacred_names: true,
            email_notifications: true
          })
          .select()
          .single();

        if (createError) {
          logger.error('Error creating preferences:', createError);
          return new Response(JSON.stringify({ error: 'Failed to create preferences' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ preferences: newPrefs }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      logger.error('Error fetching preferences:', prefsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch preferences' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ preferences }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60'
      }
    });

  } catch (error) {
    logger.error('Preferences GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
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

    // Parse and validate request body
    const body = await request.json();
    const { theme, show_sacred_names, email_notifications } = body;

    // Validate theme
    const validThemes = ['dark', 'light', 'auto'];
    if (theme && !validThemes.includes(theme)) {
      return new Response(JSON.stringify({ error: 'Invalid theme value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build update object (only include provided fields)
    const updates: any = {};
    if (theme !== undefined) updates.theme = sanitizeString(theme);
    if (show_sacred_names !== undefined) updates.show_sacred_names = Boolean(show_sacred_names);
    if (email_notifications !== undefined) updates.email_notifications = Boolean(email_notifications);

    // Update preferences
    const { data: updatedPrefs, error: updateError } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      // If preferences don't exist, create them
      if (updateError.code === 'PGRST116') {
        const { data: newPrefs, error: createError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            ...updates
          })
          .select()
          .single();

        if (createError) {
          logger.error('Error creating preferences:', createError);
          return new Response(JSON.stringify({ error: 'Failed to save preferences' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Log activity
        await supabase
          .from('user_activity')
          .insert({
            user_id: user.id,
            activity_type: 'preferences_updated',
            description: 'Updated user preferences',
            metadata: { updates }
          });

        return new Response(JSON.stringify({ 
          success: true, 
          preferences: newPrefs 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      logger.error('Error updating preferences:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update preferences' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'preferences_updated',
        description: 'Updated user preferences',
        metadata: { updates }
      });

    return new Response(JSON.stringify({ 
      success: true, 
      preferences: updatedPrefs 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Preferences PUT error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

