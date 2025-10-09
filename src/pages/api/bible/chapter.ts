/**
 * Astro API Route: Bible Chapter
 * GET /api/bible/chapter?book=John&chapter=3
 *
 * Returns an entire chapter with verses, optionally applying sacred names.
 */

import type { APIRoute } from 'astro';
import { getChapter, applySacredNames } from '../../../lib/bible-api-complete';

interface VersePayload {
  number: number;
  text: string;
}

interface ChapterResponse {
  reference: string;
  book: {
    id: string;
    name: string;
    group: string;
  };
  chapter: number;
  verses: VersePayload[];
  metadata: {
    totalVerses: number;
    sacredNames: boolean;
  };
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const bookParam = searchParams.get('book');
    const chapterParam = searchParams.get('chapter');
    const sacredNames = searchParams.get('sacredNames') === 'true';

    if (!bookParam) {
      return new Response(JSON.stringify({
        error: {
          code: 'MISSING_BOOK',
          message: 'Book parameter is required'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!chapterParam) {
      return new Response(JSON.stringify({
        error: {
          code: 'MISSING_CHAPTER',
          message: 'Chapter parameter is required'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const chapterNumber = parseInt(chapterParam, 10);

    if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
      return new Response(JSON.stringify({
        error: {
          code: 'INVALID_CHAPTER',
          message: `Invalid chapter number: '${chapterParam}'. Chapter must be a positive integer.`
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const chapterData = getChapter(bookParam, chapterNumber);

    if (!chapterData) {
      return new Response(JSON.stringify({
        error: {
          code: 'CHAPTER_NOT_FOUND',
          message: `Chapter not found: ${bookParam} ${chapterNumber}`
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verses: VersePayload[] = chapterData.chapter.verses.map((verse) => ({
      number: verse.v,
      text: sacredNames ? applySacredNames(verse.t) : verse.t
    }));

    const response: ChapterResponse = {
      reference: `${chapterData.book.name} ${chapterNumber}`,
      book: {
        id: chapterData.book.id,
        name: chapterData.book.name,
        group: chapterData.book.group
      },
      chapter: chapterNumber,
      verses,
      metadata: {
        totalVerses: verses.length,
        sacredNames
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
        'ETag': `"chapter-${chapterData.book.id}-${chapterNumber}-${sacredNames}"`
      }
    });
  } catch (error) {
    console.error('Error in /api/bible/chapter:', error);
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
