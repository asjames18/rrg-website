/**
 * Astro API Route: Bible Verse
 * GET /api/bible/verse?ref=John+3:16
 * 
 * Get a single verse by reference
 */

import type { APIRoute } from 'astro';
import { getVerse, parseReference, applySacredNames } from '../../../lib/bible-api-complete';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const ref = searchParams.get('ref');
    const sacredNames = searchParams.get('sacredNames') === 'true';

    if (!ref) {
      return new Response(JSON.stringify({
        error: { 
          code: 'MISSING_REFERENCE', 
          message: 'Reference parameter is required' 
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the reference
    const reference = parseReference(ref);
    
    if (!reference) {
      return new Response(JSON.stringify({
        error: { 
          code: 'INVALID_REFERENCE', 
          message: `Invalid reference format: '${ref}'. Expected format: 'Book Chapter:Verse' (e.g., 'John 3:16')` 
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get verse data
    const verseData = getVerse(reference.book, reference.chapter, reference.verse!);
    
    if (!verseData) {
      return new Response(JSON.stringify({
        error: { 
          code: 'VERSE_NOT_FOUND', 
          message: `Verse not found: ${reference.book} ${reference.chapter}:${reference.verse}` 
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Apply sacred names transformation if requested
    let text = verseData.verse.t;
    if (sacredNames) {
      text = applySacredNames(text);
    }

    // Prepare response
    const response = {
      reference: `${verseData.book.name} ${reference.chapter}:${reference.verse}`,
      book: {
        id: verseData.book.id,
        name: verseData.book.name,
        group: verseData.book.group
      },
      chapter: reference.chapter,
      verse: reference.verse,
      text: text,
      metadata: {
        sacredNames: sacredNames
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'ETag': `"verse-${verseData.book.id}-${reference.chapter}-${reference.verse}"`
      }
    });

  } catch (error) {
    console.error('Error in /api/bible/verse:', error);
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
