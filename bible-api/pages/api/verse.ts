/**
 * GET /api/verse - Get single verse by reference
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getVerse } from '../../src/lib/corpus/loader';
import { parseReference } from '../../src/lib/refs/parseRef';
import { applySacredNames } from '../../src/lib/text/transformers';
import { createRateLimit } from '../../src/lib/http/rateLimit';
import type { ApiError } from '../../src/types/index';

// Rate limiting: 60 requests per minute
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60
});

// Query validation schema
const querySchema = z.object({
  ref: z.string().min(1, 'Reference is required'),
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
    
    // Parse the reference
    const reference = parseReference(query.ref);
    
    if (!reference) {
      return res.status(400).json({
        error: { 
          code: 'INVALID_REFERENCE', 
          message: `Invalid reference format: '${query.ref}'. Expected format: 'Book Chapter:Verse' (e.g., 'John 3:16')` 
        }
      } as ApiError);
    }
    
    // Get verse data
    const verseData = getVerse(reference.book, reference.chapter, reference.verse!);
    
    if (!verseData) {
      return res.status(404).json({
        error: { 
          code: 'VERSE_NOT_FOUND', 
          message: `Verse not found: ${reference.book} ${reference.chapter}:${reference.verse}` 
        }
      } as ApiError);
    }
    
    // Apply sacred names transformation if requested
    let text = verseData.verse.t;
    if (query.sacredNames) {
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
        sacredNames: query.sacredNames || false
      }
    };
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('ETag', `"verse-${verseData.book.id}-${reference.chapter}-${reference.verse}"`);
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Error in /api/verse:', error);
    
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
