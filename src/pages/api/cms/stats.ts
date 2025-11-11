import type { APIRoute } from 'astro';
import { SupabaseCMSAPI } from '../../../lib/cms/supabase-cms-api';
import { logger } from '../../../lib/logger';

export const GET: APIRoute = async () => {
  try {
    const stats = await SupabaseCMSAPI.getStats();
    
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    logger.error('Error fetching CMS stats:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};