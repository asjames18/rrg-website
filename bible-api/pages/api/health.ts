/**
 * GET /api/health - Health check endpoint
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSearchStats } from '../../src/lib/corpus/indexer';
import { getCorpusMetadata } from '../../src/lib/corpus/loader';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET requests are allowed' }
    });
  }

  try {
    const searchStats = getSearchStats();
    const corpusMetadata = getCorpusMetadata();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      corpus: {
        loaded: !!corpusMetadata,
        totalBooks: corpusMetadata?.totalBooks || 0,
        lastUpdated: corpusMetadata?.lastUpdated
      },
      search: {
        indexBuilt: searchStats.indexBuilt,
        totalVerses: searchStats.totalVerses,
        totalBooks: searchStats.totalBooks
      }
    };

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json(health);
    
  } catch (error) {
    console.error('Error in /api/health:', error);
    
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Internal server error'
    });
  }
}
