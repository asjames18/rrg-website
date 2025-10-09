/**
 * Unit tests for book aliases
 */

import { describe, it, expect } from 'vitest';
import { 
  resolveBookAlias, 
  getBookAliases, 
  isValidBookName 
} from '../text/aliases';

describe('resolveBookAlias', () => {
  it('should resolve canonical names', () => {
    expect(resolveBookAlias('Genesis')).toBe('Genesis');
    expect(resolveBookAlias('John')).toBe('John');
    expect(resolveBookAlias('1 Corinthians')).toBe('1 Corinthians');
  });

  it('should resolve aliases', () => {
    expect(resolveBookAlias('Gen')).toBe('Genesis');
    expect(resolveBookAlias('Jn')).toBe('John');
    expect(resolveBookAlias('1 Cor')).toBe('1 Corinthians');
  });

  it('should be case insensitive', () => {
    expect(resolveBookAlias('genesis')).toBe('Genesis');
    expect(resolveBookAlias('GENESIS')).toBe('Genesis');
    expect(resolveBookAlias('gen')).toBe('Genesis');
  });

  it('should handle complex aliases', () => {
    expect(resolveBookAlias('Song of Solomon')).toBe('Song of Solomon');
    expect(resolveBookAlias('Song')).toBe('Song of Solomon');
    expect(resolveBookAlias('Canticles')).toBe('Song of Solomon');
  });

  it('should return null for invalid names', () => {
    expect(resolveBookAlias('Invalid Book')).toBeNull();
    expect(resolveBookAlias('')).toBeNull();
    expect(resolveBookAlias('   ')).toBeNull();
  });
});

describe('getBookAliases', () => {
  it('should return aliases for canonical names', () => {
    const aliases = getBookAliases('Genesis');
    expect(aliases).toContain('Gen');
    expect(aliases).toContain('Gn');
    expect(aliases).toContain('Ge');
  });

  it('should return empty array for unknown books', () => {
    expect(getBookAliases('Unknown Book')).toEqual([]);
  });
});

describe('isValidBookName', () => {
  it('should validate canonical names', () => {
    expect(isValidBookName('Genesis')).toBe(true);
    expect(isValidBookName('John')).toBe(true);
    expect(isValidBookName('1 Corinthians')).toBe(true);
  });

  it('should validate aliases', () => {
    expect(isValidBookName('Gen')).toBe(true);
    expect(isValidBookName('Jn')).toBe(true);
    expect(isValidBookName('1 Cor')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(isValidBookName('genesis')).toBe(true);
    expect(isValidBookName('GENESIS')).toBe(true);
    expect(isValidBookName('gen')).toBe(true);
  });

  it('should reject invalid names', () => {
    expect(isValidBookName('Invalid Book')).toBe(false);
    expect(isValidBookName('')).toBe(false);
    expect(isValidBookName('   ')).toBe(false);
  });
});
