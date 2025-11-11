/**
import { logger } from '../../lib/logger';

 * API Route: Content Statistics
 * GET /api/content-stats?type=blog|videos|books|music
 * 
 * Returns count of content items for admin dashboard
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type');
    
    if (!type || !['blog', 'videos', 'books', 'music'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid type parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let count = 0;
    
    try {
      const collection = await getCollection(type as any);
      count = collection.length;
    } catch (error) {
      logger.log(`Collection ${type} not found, using default count`);
      count = 0;
    }

    return new Response(
      JSON.stringify({ 
        type,
        count,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logger.error('Content stats error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
