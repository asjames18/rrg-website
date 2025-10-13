import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async () => {
  try {
    // Try to get environment variables
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const envStatus = {
      hasUrl: !!supabaseUrl,
      hasKey: !!serviceKey,
      urlValue: supabaseUrl ? 'FOUND' : 'NOT_FOUND',
      keyValue: serviceKey ? 'FOUND' : 'NOT_FOUND'
    };
    
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing environment variables',
        envStatus
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Try to create Supabase client directly
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test a simple query
    const { data, error } = await supabase
      .from('content')
      .select('id, title')
      .limit(1);
    
    if (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Database query failed',
        details: error.message,
        envStatus
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Direct Supabase test successful',
      data,
      envStatus
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
