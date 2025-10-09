/**
 * GET /api/books/[book]/[chapter] - Get chapter verses
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getChapter } from '../../../../src/lib/corpus/loader';
import { applySacredNames } from '../../../../src/lib/text/transformers';
import { createRateLimit } from '../../../../src/lib/http/rateLimit';
import type { ApiError } from '../../../../src/types/index';

// Rate limiting: 60 requests per minute
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60
});

// Query validation schema
const querySchema = z.object({
  sacredNames: z.string().transform(val => val === 'true').optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting
  rateLimit(req, res, () => {});
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET requests are allowed' }
    } as ApiError);
  }

  try {
    // Validate query parameters
    const query = querySchema.parse(req.query);
    
    // Get book ID and chapter from URL
    const { book: bookId, chapter: chapterParam } = req.query;
    
    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({
        error: { code: 'MISSING_BOOK_ID', message: 'Book ID is required' }
      } as ApiError);
    }
    
    if (!chapterParam || typeof chapterParam !== 'string') {
      return res.status(400).json({
        error: { code: 'MISSING_CHAPTER', message: 'Chapter number is required' }
      } as ApiError);
    }
    
    const chapterNumber = parseInt(chapterParam, 10);
    if (isNaN(chapterNumber) || chapterNumber < 1) {
      return res.status(400).json({
        error: { code: 'INVALID_CHAPTER', message: 'Chapter must be a positive integer' }
      } as ApiError);
    }
    
    // Get chapter data
    const chapterData = getChapter(bookId, chapterNumber);
    
    if (!chapterData) {
      return res.status(404).json({
        error: { 
          code: 'CHAPTER_NOT_FOUND', 
          message: `Chapter ${chapterNumber} not found in book '${bookId}'` 
        }
      } as ApiError);
    }
    
    // Apply sacred names transformation if requested
    let verses = chapterData.chapter.verses;
    if (query.sacredNames) {
      verses = verses.map((verse: any) => ({
        ...verse,
        t: applySacredNames(verse.t)
      }));
    }
    
    // Prepare response
    const response = {
      book: {
        id: chapterData.book.id,
        name: chapterData.book.name,
        group: chapterData.book.group
      },
      chapter: chapterNumber,
      verses: verses,
      metadata: {
        totalVerses: verses.length,
        sacredNames: query.sacredNames || false
      }
    };
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('ETag', `"chapter-${chapterData.book.id}-${chapterNumber}"`);
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Error in /api/books/[book]/[chapter]:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: { 
          code: 'INVALID_QUERY', 
          message: 'Invalid query parameters'
        }
      } as ApiError);
    }
    
    return res.status(500).json({
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'An internal error occurred' 
      }
    } as ApiError);
  }
}
