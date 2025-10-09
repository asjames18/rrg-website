/**
 * Astro API Route: Bible Chapter
 * GET /api/bible/chapter?book=John&chapter=3
 *
 * Returns an entire chapter with verses, optionally applying sacred names.
 */

import type { APIRoute } from 'astro';
import { getBook, getChapter, applySacredNames } from '../../../lib/bible-api-complete';
import type { Book, Chapter } from '../../../lib/bible-api-complete';

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
    source: 'local' | 'remote';
  };
}

interface RemoteBibleApiVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface RemoteBibleApiResponse {
  reference: string;
  verses: RemoteBibleApiVerse[];
}

type RawVerse = {
  number: number;
  text: string;
};

const remoteChapterCache = new Map<string, RawVerse[]>();

async function fetchRemoteChapter(book: Book, chapterNumber: number): Promise<RawVerse[] | null> {
  const cacheKey = `${book.id}-${chapterNumber}`;
  const cached = remoteChapterCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const query = encodeURIComponent(`${book.name} ${chapterNumber}`);
  const requestUrl = `https://bible-api.com/${query}?translation=kjv`;

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      console.error(`Remote Bible API responded with ${response.status} for ${book.name} ${chapterNumber}`);
      return null;
    }

    const data = (await response.json()) as RemoteBibleApiResponse;
    if (!data?.verses?.length) {
      console.error(`Remote Bible API returned no verses for ${book.name} ${chapterNumber}`);
      return null;
    }

    const verses = data.verses
      .filter((verse) => verse.chapter === chapterNumber)
      .map((verse) => ({
        number: verse.verse,
        text: verse.text.trim()
      }));

    if (!verses.length) {
      console.error(`Filtered verses list empty for ${book.name} ${chapterNumber}`);
      return null;
    }

    remoteChapterCache.set(cacheKey, verses);
    return verses;
  } catch (error) {
    console.error('Failed to fetch chapter from remote Bible API:', error);
    return null;
  }
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

    const book = getBook(bookParam);

    if (!book) {
      return new Response(JSON.stringify({
        error: {
          code: 'BOOK_NOT_FOUND',
          message: `Book not found: ${bookParam}`
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const chapterData = getChapter(book.id, chapterNumber);

    if (!chapterData) {
      return new Response(JSON.stringify({
        error: {
          code: 'CHAPTER_NOT_FOUND',
          message: `Chapter not found: ${book.name} ${chapterNumber}`
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let source: 'local' | 'remote' = 'local';
    let verses: RawVerse[] | null = null;

    const localChapter: Chapter = chapterData.chapter;

    if (localChapter.verses.length > 0) {
      verses = localChapter.verses.map((verse) => ({
        number: verse.v,
        text: verse.t
      }));
    } else {
      source = 'remote';
      verses = await fetchRemoteChapter(chapterData.book, chapterNumber);
    }

    if (!verses || verses.length === 0) {
      return new Response(JSON.stringify({
        error: {
          code: 'CHAPTER_NOT_FOUND',
          message: `Chapter not found: ${chapterData.book.name} ${chapterNumber}`
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const transformedVerses: VersePayload[] = verses.map((verse) => ({
      number: verse.number,
      text: sacredNames ? applySacredNames(verse.text) : verse.text
    }));

    const response: ChapterResponse = {
      reference: `${chapterData.book.name} ${chapterNumber}`,
      book: {
        id: chapterData.book.id,
        name: chapterData.book.name,
        group: chapterData.book.group
      },
      chapter: chapterNumber,
      verses: transformedVerses,
      metadata: {
        totalVerses: transformedVerses.length,
        sacredNames,
        source
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
        'ETag': `"chapter-${chapterData.book.id}-${chapterNumber}-${sacredNames}-${source}"`
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
