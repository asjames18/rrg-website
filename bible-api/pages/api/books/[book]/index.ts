/**
 * GET /api/books/[book] - Get book metadata
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getBook } from '../../../../src/lib/corpus/loader';
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
    
    // Get book ID from URL
    const { book: bookId } = req.query;
    
    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({
        error: { code: 'MISSING_BOOK_ID', message: 'Book ID is required' }
      } as ApiError);
    }
    
    // Get book data
    const book = getBook(bookId);
    
    if (!book) {
      return res.status(404).json({
        error: { code: 'BOOK_NOT_FOUND', message: `Book '${bookId}' not found` }
      } as ApiError);
    }
    
    // Prepare response
    const response = {
      id: book.id,
      name: book.name,
      group: book.group,
      chapters: book.chapters.length,
      aliases: book.aliases,
      orderIndex: book.orderIndex,
      metadata: {
        totalChapters: book.chapters.length,
        totalVerses: book.chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0)
      }
    };
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('ETag', `"book-${book.id}"`);
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Error in /api/books/[book]:', error);
    
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
