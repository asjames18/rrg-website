import type { APIRoute } from 'astro';
import { SupabaseCMSAPI } from '../../lib/cms/supabase-cms-api';

export const GET: APIRoute = async () => {
  try {
    console.log('Testing SupabaseCMSAPI.getContent...');
    
    const result = await SupabaseCMSAPI.getContent({
      limit: 5,
      offset: 0
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Content API test successful',
      result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Content API test error:', error);
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
