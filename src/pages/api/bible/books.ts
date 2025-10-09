/**
 * Astro API Route: Bible Books
 * GET /api/bible/books
 * 
 * Lists all available Bible books with metadata
 */

import type { APIRoute } from 'astro';
import { getBooks } from '../../../lib/bible-api-complete';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const group = searchParams.get('group');
    const sacredNames = searchParams.get('sacredNames') === 'true';

    // Get books
    const books = getBooks(group || undefined);

    // Transform books to response format
    const response = books.map(book => ({
      id: book.id,
      name: book.name,
      group: book.group,
      chapters: book.chapters.length,
      aliases: book.aliases,
      orderIndex: book.orderIndex
    }));

    return new Response(JSON.stringify({
      books: response,
      metadata: {
        total: response.length,
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalBooks: response.length
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'ETag': `"books-${new Date().toISOString()}"`
      }
    });

  } catch (error) {
    console.error('Error in /api/bible/books:', error);
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
