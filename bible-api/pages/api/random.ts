/**
 * GET /api/random - Get random verse(s)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { loadCorpus, getBooksByGroup } from '../../src/lib/corpus/loader';
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
  in: z.enum(['all', 'canon', 'apocrypha', 'pseudepigrapha']).optional().default('all'),
  count: z.string().transform(val => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 1 : Math.min(Math.max(num, 1), 10);
  }).optional().default('1'),
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
    
    // Get books based on scope
    let books;
    if (query.in === 'all') {
      books = loadCorpus();
    } else {
      books = getBooksByGroup(query.in.charAt(0).toUpperCase() + query.in.slice(1) as 'Canon' | 'Apocrypha' | 'Pseudepigrapha');
    }
    
    if (books.length === 0) {
      return res.status(404).json({
        error: { 
          code: 'NO_BOOKS_FOUND', 
          message: `No books found in scope: ${query.in}` 
        }
      } as ApiError);
    }
    
    // Collect all verses from all books
    const allVerses: Array<{
      book: any;
      chapter: number;
      verse: any;
    }> = [];
    
    for (const book of books) {
      for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
        const chapter = book.chapters[chapterIndex];
        const chapterNumber = chapterIndex + 1;
        
        for (const verse of chapter.verses) {
          allVerses.push({
            book,
            chapter: chapterNumber,
            verse
          });
        }
      }
    }
    
    if (allVerses.length === 0) {
      return res.status(404).json({
        error: { 
          code: 'NO_VERSES_FOUND', 
          message: 'No verses found in the corpus' 
        }
      } as ApiError);
    }
    
    // Select random verses
    const selectedVerses = [];
    const maxCount = Math.min(query.count, allVerses.length);
    
    for (let i = 0; i < maxCount; i++) {
      const randomIndex = Math.floor(Math.random() * allVerses.length);
      const selectedVerse = allVerses[randomIndex];
      
      // Apply sacred names transformation if requested
      let text = selectedVerse.verse.t;
      if (query.sacredNames) {
        text = applySacredNames(text);
      }
      
      selectedVerses.push({
        reference: `${selectedVerse.book.name} ${selectedVerse.chapter}:${selectedVerse.verse.v}`,
        book: {
          id: selectedVerse.book.id,
          name: selectedVerse.book.name,
          group: selectedVerse.book.group
        },
        chapter: selectedVerse.chapter,
        verse: selectedVerse.verse.v,
        text: text
      });
      
      // Remove selected verse to avoid duplicates
      allVerses.splice(randomIndex, 1);
    }
    
    // Prepare response
    const response = {
      verses: selectedVerses,
      metadata: {
        count: selectedVerses.length,
        scope: query.in,
        sacredNames: query.sacredNames || false,
        totalAvailable: allVerses.length + selectedVerses.length
      }
    };
    
    // Set cache headers (no cache for random results)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Error in /api/random:', error);
    
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
