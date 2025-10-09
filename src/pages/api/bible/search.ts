/**
 * Astro API Route: Bible Search
 * GET /api/bible/search?q=faith&in=canon&limit=10
 * 
 * Search Bible text with full-text search
 */

import type { APIRoute } from 'astro';
import { searchBible } from '../../../lib/bible-api-complete';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const query = searchParams.get('q');
    const scope = searchParams.get('in') || 'all';
    const book = searchParams.get('book');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50'), 1), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    if (!query) {
      return new Response(JSON.stringify({
        error: { 
          code: 'MISSING_QUERY', 
          message: 'Search query parameter (q) is required' 
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate scope
    if (!['all', 'canon', 'apocrypha', 'pseudepigrapha'].includes(scope)) {
      return new Response(JSON.stringify({
        error: { 
          code: 'INVALID_SCOPE', 
          message: 'Scope must be one of: all, canon, apocrypha, pseudepigrapha' 
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Perform search
    const results = searchBible(query, {
      scope: scope as 'all' | 'canon' | 'apocrypha' | 'pseudepigrapha',
      book: book || undefined,
      limit,
      offset
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'ETag': `"search-${Buffer.from(query).toString('base64')}"`
      }
    });

  } catch (error) {
    console.error('Error in /api/bible/search:', error);
    return new Response(JSON.stringify({
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'An internal error occurred' 
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
