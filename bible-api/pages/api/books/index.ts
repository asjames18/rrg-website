/**
 * GET /api/books - List all books
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { loadCorpus, getCorpusMetadata } from '../../../src/lib/corpus/loader';
import { createRateLimit } from '../../../src/lib/http/rateLimit';
import type { ApiError } from '../../../src/types/index';

// Rate limiting: 60 requests per minute
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60
});

// Query validation schema
const querySchema = z.object({
  group: z.enum(['canon', 'apocrypha', 'pseudepigrapha']).optional(),
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
    
    // Load corpus
    const corpus = loadCorpus();
    const metadata = getCorpusMetadata();
    
    // Filter by group if specified
    let books = corpus;
    if (query.group) {
      books = corpus.filter(book => book.group.toLowerCase() === query.group);
    }
    
    // Transform books to response format
    const response = books.map(book => ({
      id: book.id,
      name: book.name,
      group: book.group,
      chapters: book.chapters.length,
      aliases: book.aliases,
      orderIndex: book.orderIndex
    }));
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('ETag', `"books-${metadata?.lastUpdated || 'unknown'}"`);
    
    return res.status(200).json({
      books: response,
      metadata: {
        total: response.length,
        ...metadata
      }
    });
    
  } catch (error) {
    console.error('Error in /api/books:', error);
    
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
