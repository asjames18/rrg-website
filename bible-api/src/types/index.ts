/**
 * Core TypeScript definitions for the Bible API
 */

export interface Verse {
  v: number;
  t: string;
}

export interface Chapter {
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha';
  chapters: Chapter[];
  aliases: string[];
  orderIndex: number;
}

export interface CorpusPack {
  books: Book[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalBooks: number;
  };
}

export interface SearchResult {
  ref: string;
  snippet: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  limit: number;
  offset: number;
  query: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface BookAlias {
  canonical: string;
  aliases: string[];
}

export interface SacredNameMapping {
  original: string;
  sacred: string;
  caseSensitive?: boolean;
}

export interface Reference {
  book: string;
  chapter: number;
  verse?: number;
  endVerse?: number;
}

export interface RateLimitInfo {
  requests: number;
  windowStart: number;
  limit: number;
  windowMs: number;
}
