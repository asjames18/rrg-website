/**
 * API Route: System Settings
 * GET /api/admin/settings - Get all settings
 * PUT /api/admin/settings - Update settings
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const GET: APIRoute = async ({ locals, cookies, url }) => {
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

    const supabase = supabaseServer(cookies);

    const category = url.searchParams.get('category');
    
    // Build query
    let query = supabase.from('system_settings').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data: settings, error } = await query;

    if (error) {
      logger.error('Settings fetch error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert to key-value map
    const settingsMap: Record<string, any> = {};
    settings?.forEach(setting => {
      settingsMap[setting.key] = {
        value: setting.value,
        category: setting.category,
        description: setting.description,
        updated_at: setting.updated_at
      };
    });

    return new Response(JSON.stringify({ settings: settingsMap }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60'
      }
    });

  } catch (error) {
    logger.error('Settings API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ locals, cookies, request }) => {
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

    const supabase = supabaseServer(cookies);

    const body = await request.json();
    const { key, value, category } = body;

    if (!key || value === undefined || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Upsert setting
    const { error: upsertError } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        category,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'key'
      });

    if (upsertError) {
      logger.error('Settings update error:', upsertError);
      return new Response(JSON.stringify({ error: 'Failed to update setting' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'settings_updated',
        description: `Updated system setting: ${key}`,
        metadata: { key, category }
      });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Settings update API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

