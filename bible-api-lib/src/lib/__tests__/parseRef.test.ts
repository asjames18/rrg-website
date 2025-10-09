/**
 * Unit tests for reference parser
 */

import { describe, it, expect } from 'vitest';
import { 
  parseReference, 
  parseMultipleReferences, 
  formatReference, 
  isValidReference,
  normalizeReferenceString,
  extractBookName 
} from '../refs/parseRef';
import { Reference } from '../../types/index';

describe('parseReference', () => {
  it('should parse simple references', () => {
    const result = parseReference('John 3:16');
    expect(result).toEqual({
      book: 'John',
      chapter: 3,
      verse: 16
    });
  });

  it('should parse references with book aliases', () => {
    const result = parseReference('Jn 3:16');
    expect(result).toEqual({
      book: 'John',
      chapter: 3,
      verse: 16
    });
  });

  it('should parse references without verses', () => {
    const result = parseReference('Psalms 23');
    expect(result).toEqual({
      book: 'Psalms',
      chapter: 23
    });
  });

  it('should parse verse ranges', () => {
    const result = parseReference('John 3:16-18');
    expect(result).toEqual({
      book: 'John',
      chapter: 3,
      verse: 16,
      endVerse: 18
    });
  });

  it('should handle complex book names', () => {
    const result = parseReference('1 Corinthians 13:4');
    expect(result).toEqual({
      book: '1 Corinthians',
      chapter: 13,
      verse: 4
    });
  });

  it('should return null for invalid references', () => {
    expect(parseReference('Invalid Book 999:999')).toBeNull();
    expect(parseReference('')).toBeNull();
    expect(parseReference('Not a reference')).toBeNull();
  });
});

describe('parseMultipleReferences', () => {
  it('should parse multiple references', () => {
    const result = parseMultipleReferences('John 3:16; Romans 8:28');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      book: 'John',
      chapter: 3,
      verse: 16
    });
    expect(result[1]).toEqual({
      book: 'Romans',
      chapter: 8,
      verse: 28
    });
  });

  it('should handle comma-separated references', () => {
    const result = parseMultipleReferences('John 3:16, Romans 8:28');
    expect(result).toHaveLength(2);
  });

  it('should filter out invalid references', () => {
    const result = parseMultipleReferences('John 3:16, Invalid Book, Romans 8:28');
    expect(result).toHaveLength(2);
  });
});

describe('formatReference', () => {
  it('should format simple references', () => {
    const ref: Reference = {
      book: 'John',
      chapter: 3,
      verse: 16
    };
    expect(formatReference(ref)).toBe('John 3:16');
  });

  it('should format references without verses', () => {
    const ref: Reference = {
      book: 'Psalms',
      chapter: 23
    };
    expect(formatReference(ref)).toBe('Psalms 23');
  });

  it('should format verse ranges', () => {
    const ref: Reference = {
      book: 'John',
      chapter: 3,
      verse: 16,
      endVerse: 18
    };
    expect(formatReference(ref)).toBe('John 3:16-18');
  });
});

describe('isValidReference', () => {
  it('should validate correct references', () => {
    const ref: Reference = {
      book: 'John',
      chapter: 3,
      verse: 16
    };
    expect(isValidReference(ref)).toBe(true);
  });

  it('should reject invalid references', () => {
    expect(isValidReference({ book: '', chapter: 3, verse: 16 })).toBe(false);
    expect(isValidReference({ book: 'John', chapter: 0, verse: 16 })).toBe(false);
    expect(isValidReference({ book: 'John', chapter: 3, verse: 0 })).toBe(true); // verse 0 is valid in some contexts
  });
});

describe('normalizeReferenceString', () => {
  it('should normalize reference strings', () => {
    expect(normalizeReferenceString('  John   3:16  ')).toBe('John 3:16');
    expect(normalizeReferenceString('John,3:16')).toBe('John 3:16');
    expect(normalizeReferenceString('John;3:16')).toBe('John 3:16');
  });
});

describe('extractBookName', () => {
  it('should extract book names from references', () => {
    expect(extractBookName('John 3:16')).toBe('John');
    expect(extractBookName('1 Corinthians 13:4')).toBe('1 Corinthians');
    expect(extractBookName('Psalms 23')).toBe('Psalms');
  });

  it('should return null for invalid references', () => {
    expect(extractBookName('Invalid Book 3:16')).toBeNull();
    expect(extractBookName('')).toBeNull();
  });
});
