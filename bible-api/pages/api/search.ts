/**
 * GET /api/search - Search Bible text
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { search } from '../../src/lib/corpus/indexer';
import { createRateLimit } from '../../src/lib/http/rateLimit';
import type { ApiError } from '../../src/types/index';

// Rate limiting: 30 requests per minute (more restrictive for search)
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 30
});

// Query validation schema
const querySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  in: z.enum(['all', 'canon', 'apocrypha', 'pseudepigrapha']).optional().default('all'),
  book: z.string().optional(),
  limit: z.string().transform(val => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 50 : Math.min(Math.max(num, 1), 100);
  }).optional().default('50'),
  offset: z.string().transform(val => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : Math.max(num, 0);
  }).optional().default('0')
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
    
    // Perform search
    const results = await search(query.q, {
      scope: query.in,
      book: query.book,
      limit: query.limit,
      offset: query.offset
    });
    
    // Set cache headers (shorter cache for search results)
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.setHeader('ETag', `"search-${Buffer.from(query.q).toString('base64')}"`);
    
    return res.status(200).json(results);
    
  } catch (error) {
    console.error('Error in /api/search:', error);
    
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
