/**
 * Robust Bible reference parser
 * Supports formats like "John 3:16", "1 John 2:3-5", "Ps 23", etc.
 */

import { Reference } from '../../types/index';
import { resolveBookAlias } from '../text/aliases';

/**
 * Parse a Bible reference string into structured data
 * @param refString - The reference string to parse (e.g., "John 3:16", "1 John 2:3-5")
 * @returns Parsed reference object or null if invalid
 */
export function parseReference(refString: string): Reference | null {
  if (!refString || typeof refString !== 'string') {
    return null;
  }

  const trimmed = refString.trim();
  if (!trimmed) {
    return null;
  }

  // Normalize the input: remove extra spaces, handle common separators
  const normalized = trimmed
    .replace(/\s+/g, ' ')
    .replace(/[,;]/g, ' ')
    .trim();

  // Try different parsing patterns
  const patterns = [
    // Pattern 1: "Book Chapter:Verse" (e.g., "John 3:16")
    /^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/,
    // Pattern 2: "Book Chapter" (e.g., "Psalms 23")
    /^(.+?)\s+(\d+)$/,
    // Pattern 3: "Book Chapter:Verse-Verse" (e.g., "John 3:16-18")
    /^(.+?)\s+(\d+):(\d+)-(\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      const bookName = match[1].trim();
      const chapter = parseInt(match[2], 10);
      
      // Resolve book alias
      const canonicalBook = resolveBookAlias(bookName);
      if (!canonicalBook) {
        continue; // Try next pattern
      }

      const reference: Reference = {
        book: canonicalBook,
        chapter,
      };

      // Handle verse information if present
      if (match[3]) {
        reference.verse = parseInt(match[3], 10);
      }

      // Handle verse range if present
      if (match[4]) {
        reference.endVerse = parseInt(match[4], 10);
      }

      return reference;
    }
  }

  return null;
}

/**
 * Parse multiple references from a string
 * @param refString - String containing multiple references
 * @returns Array of parsed references
 */
export function parseMultipleReferences(refString: string): Reference[] {
  if (!refString || typeof refString !== 'string') {
    return [];
  }

  // Split by common separators and parse each
  const parts = refString
    .split(/[,;]/)
    .map(part => part.trim())
    .filter(part => part.length > 0);

  const references: Reference[] = [];
  
  for (const part of parts) {
    const ref = parseReference(part);
    if (ref) {
      references.push(ref);
    }
  }

  return references;
}

/**
 * Format a reference object back to a string
 * @param ref - The reference object to format
 * @returns Formatted reference string
 */
export function formatReference(ref: Reference): string {
  if (!ref || !ref.book || !ref.chapter) {
    return '';
  }

  let formatted = `${ref.book} ${ref.chapter}`;
  
  if (ref.verse) {
    formatted += `:${ref.verse}`;
    
    if (ref.endVerse && ref.endVerse !== ref.verse) {
      formatted += `-${ref.endVerse}`;
    }
  }

  return formatted;
}

/**
 * Validate a reference object
 * @param ref - The reference to validate
 * @returns True if the reference is valid
 */
export function isValidReference(ref: Reference): boolean {
  if (!ref || !ref.book || !ref.chapter) {
    return false;
  }

  if (ref.chapter < 1) {
    return false;
  }

  if (ref.verse && ref.verse < 1) {
    return false;
  }

  if (ref.endVerse && ref.endVerse < 1) {
    return false;
  }

  if (ref.verse && ref.endVerse && ref.endVerse < ref.verse) {
    return false;
  }

  return true;
}

/**
 * Normalize a reference string for consistent parsing
 * @param refString - The reference string to normalize
 * @returns Normalized reference string
 */
export function normalizeReferenceString(refString: string): string {
  if (!refString || typeof refString !== 'string') {
    return '';
  }

  return refString
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[,;]/g, ' ')
    .replace(/[^\w\s:.-]/g, '') // Remove special characters except colons, dots, and hyphens
    .trim();
}

/**
 * Extract book name from a reference string
 * @param refString - The reference string
 * @returns The book name or null if not found
 */
export function extractBookName(refString: string): string | null {
  if (!refString || typeof refString !== 'string') {
    return null;
  }

  const normalized = normalizeReferenceString(refString);
  
  // Try to find the book name by progressively removing parts
  const parts = normalized.split(/\s+/);
  
  for (let i = parts.length; i > 0; i--) {
    const potentialBook = parts.slice(0, i).join(' ');
    const canonicalBook = resolveBookAlias(potentialBook);
    if (canonicalBook) {
      return canonicalBook;
    }
  }

  return null;
}
