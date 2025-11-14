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
      logger.error('[Settings API] Settings fetch error:', error);
      // If table doesn't exist, return empty settings
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        logger.warn('[Settings API] system_settings table does not exist, returning empty settings');
        return new Response(JSON.stringify({ settings: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    logger.info(`[Settings API] Found ${settings?.length || 0} settings in database`);

    // Convert to key-value map and parse JSONB values
    const settingsMap: Record<string, any> = {};
    settings?.forEach(setting => {
      let parsedValue = setting.value;
      
      // If value is a JSONB object, try to parse it
      if (typeof setting.value === 'object' && setting.value !== null) {
        parsedValue = setting.value;
      } else if (typeof setting.value === 'string') {
        // Try to parse as JSON, fallback to string
        try {
          parsedValue = JSON.parse(setting.value);
        } catch {
          parsedValue = setting.value;
        }
      }
      
      settingsMap[setting.key] = {
        value: parsedValue,
        category: setting.category,
        description: setting.description,
        updated_at: setting.updated_at
      };
    });

    logger.info(`[Settings API] Returning ${Object.keys(settingsMap).length} settings`);

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

    // Prepare value for JSONB storage
    let jsonbValue: any = value;
    if (typeof value === 'string') {
      // Try to parse as JSON, if it fails, store as string
      try {
        jsonbValue = JSON.parse(value);
      } catch {
        jsonbValue = value;
      }
    }

    logger.info(`[Settings API] Updating setting: ${key} = ${JSON.stringify(jsonbValue)} (category: ${category})`);

    // Upsert setting
    const { error: upsertError } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value: jsonbValue, // Store as JSONB directly
        category,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'key'
      });

    if (upsertError) {
      logger.error('[Settings API] Settings update error:', upsertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to update setting',
        details: upsertError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    logger.info(`[Settings API] Setting ${key} updated successfully`);

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

