/**
 * Simple in-memory search index for Bible text
 */

import type { Book } from '../../types/index';
import { loadCorpus } from './loader';

interface SearchIndexEntry {
  book: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  tokens: string[];
}

interface SearchResult {
  ref: string;
  snippet: string;
  book: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  score: number;
}

// In-memory search index
let searchIndex: SearchIndexEntry[] | null = null;
let indexBuilt = false;

/**
 * Tokenize text for indexing
 * @param text - Text to tokenize
 * @returns Array of tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Build the search index from the corpus
 * @returns Promise that resolves when indexing is complete
 */
export async function buildSearchIndex(): Promise<void> {
  if (indexBuilt) {
    return;
  }
  
  console.log('Building search index...');
  
  const corpus = loadCorpus();
  const index: SearchIndexEntry[] = [];
  
  for (const book of corpus) {
    for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
      const chapter = book.chapters[chapterIndex];
      const chapterNumber = chapterIndex + 1;
      
      for (const verse of chapter.verses) {
        const tokens = tokenize(verse.t);
        
        index.push({
          book: book.name,
          bookId: book.id,
          chapter: chapterNumber,
          verse: verse.v,
          text: verse.t,
          tokens
        });
      }
    }
  }
  
  searchIndex = index;
  indexBuilt = true;
  
  console.log(`Built search index with ${index.length} verses`);
}

/**
 * Search the index for a query
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 */
export async function search(
  query: string,
  options: {
    scope?: 'all' | 'canon' | 'apocrypha' | 'pseudepigrapha';
    book?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{
  results: SearchResult[];
  total: number;
  limit: number;
  offset: number;
  query: string;
}> {
  if (!indexBuilt) {
    await buildSearchIndex();
  }
  
  if (!searchIndex) {
    return {
      results: [],
      total: 0,
      limit: options.limit || 50,
      offset: options.offset || 0,
      query
    };
  }
  
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return {
      results: [],
      total: 0,
      limit: options.limit || 50,
      offset: options.offset || 0,
      query
    };
  }
  
  // Filter by scope if specified
  let filteredIndex = searchIndex;
  if (options.scope && options.scope !== 'all') {
    const corpus = loadCorpus();
    const scopeBooks = corpus
      .filter(book => book.group.toLowerCase() === options.scope)
      .map(book => book.id);
    
    filteredIndex = searchIndex.filter(entry => scopeBooks.includes(entry.bookId));
  }
  
  // Filter by specific book if specified
  if (options.book) {
    filteredIndex = filteredIndex.filter(entry => 
      entry.bookId === options.book || 
      entry.book === options.book
    );
  }
  
  // Score and rank results
  const scoredResults: SearchResult[] = [];
  
  for (const entry of filteredIndex) {
    let score = 0;
    let matchCount = 0;
    
    // Count matching tokens
    for (const queryToken of queryTokens) {
      for (const entryToken of entry.tokens) {
        if (entryToken.includes(queryToken) || queryToken.includes(entryToken)) {
          score += 1;
          matchCount++;
          break;
        }
      }
    }
    
    // Calculate relevance score
    if (matchCount > 0) {
      score = (matchCount / queryTokens.length) * 100;
      
      // Boost score for exact phrase matches
      if (entry.text.toLowerCase().includes(query.toLowerCase())) {
        score += 50;
      }
      
      // Create snippet with highlighting
      const snippet = createSnippet(entry.text, query);
      
      scoredResults.push({
        ref: `${entry.book} ${entry.chapter}:${entry.verse}`,
        snippet,
        book: entry.book,
        bookId: entry.bookId,
        chapter: entry.chapter,
        verse: entry.verse,
        text: entry.text,
        score
      });
    }
  }
  
  // Sort by score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Apply pagination
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  const paginatedResults = scoredResults.slice(offset, offset + limit);
  
  return {
    results: paginatedResults,
    total: scoredResults.length,
    limit,
    offset,
    query
  };
}

/**
 * Create a snippet with highlighted search terms
 * @param text - Full text
 * @param query - Search query
 * @param maxLength - Maximum snippet length
 * @returns Highlighted snippet
 */
function createSnippet(text: string, query: string, maxLength: number = 150): string {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Find the first occurrence of the query
  const index = textLower.indexOf(queryLower);
  
  if (index === -1) {
    // If query not found, return beginning of text
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  // Calculate start and end positions for snippet
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + query.length + 30);
  
  let snippet = text.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < text.length) {
    snippet = snippet + '...';
  }
  
  // Highlight the query term
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  snippet = snippet.replace(regex, '<mark>$1</mark>');
  
  return snippet;
}

/**
 * Get search statistics
 * @returns Search index statistics
 */
export function getSearchStats(): {
  totalVerses: number;
  totalBooks: number;
  indexBuilt: boolean;
} {
  return {
    totalVerses: searchIndex?.length || 0,
    totalBooks: new Set(searchIndex?.map(entry => entry.bookId)).size || 0,
    indexBuilt
  };
}

/**
 * Clear the search index (useful for testing)
 */
export function clearSearchIndex(): void {
  searchIndex = null;
  indexBuilt = false;
}

/**
 * Rebuild the search index
 * @returns Promise that resolves when rebuilding is complete
 */
export async function rebuildSearchIndex(): Promise<void> {
  clearSearchIndex();
  await buildSearchIndex();
}
