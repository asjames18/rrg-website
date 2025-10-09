/**
 * Unit tests for sacred names transformers
 */

import { describe, it, expect } from 'vitest';
import { 
  applySacredNames, 
  createSacredNamesTransformer,
  getSacredNameMappings,
  addSacredNameMappings 
} from '../text/transformers';
import { SacredNameMapping } from '../../types/index';

describe('applySacredNames', () => {
  it('should transform basic sacred names', () => {
    const text = 'For God so loved the world';
    const result = applySacredNames(text);
    expect(result).toBe('For Elohim so loved the world');
  });

  it('should transform Jesus to Yeshua', () => {
    const text = 'Jesus Christ is Lord';
    const result = applySacredNames(text);
    expect(result).toBe('Yeshua messiah is Adonai');
  });

  it('should handle case variations', () => {
    const text = 'God is good, GOD is great, god is love';
    const result = applySacredNames(text);
    expect(result).toBe('Elohim is good, ELOHIM is great, elohim is love');
  });

  it('should transform biblical names', () => {
    const text = 'Moses and Abraham and Isaac and Jacob';
    const result = applySacredNames(text);
    expect(result).toBe('Moshe and Avraham and Yitzchak and Ya\'akov');
  });

  it('should transform places', () => {
    const text = 'Jerusalem and Israel and Bethlehem';
    const result = applySacredNames(text);
    expect(result).toBe('Yerushalayim and Yisrael and Beit lechem');
  });

  it('should handle phrases', () => {
    const text = 'praise the Lord';
    const result = applySacredNames(text);
    expect(result).toBe('hallelu-Yah');
  });

  it('should not transform if no matches', () => {
    const text = 'This is just regular text';
    const result = applySacredNames(text);
    expect(result).toBe('This is just regular text');
  });

  it('should handle empty or null input', () => {
    expect(applySacredNames('')).toBe('');
    expect(applySacredNames(null as any)).toBe(null);
    expect(applySacredNames(undefined as any)).toBe(undefined);
  });
});

describe('createSacredNamesTransformer', () => {
  it('should create a transformer with custom mappings', () => {
    const customMappings: SacredNameMapping[] = [
      { original: 'test', sacred: 'transformed' }
    ];
    
    const transformer = createSacredNamesTransformer(customMappings);
    const result = transformer('This is a test');
    expect(result).toBe('This is a transformed');
  });
});

describe('getSacredNameMappings', () => {
  it('should return all mappings', () => {
    const mappings = getSacredNameMappings();
    expect(mappings.length).toBeGreaterThan(0);
    expect(mappings[0]).toHaveProperty('original');
    expect(mappings[0]).toHaveProperty('sacred');
  });
});

describe('addSacredNameMappings', () => {
  it('should add custom mappings', () => {
    const customMappings: SacredNameMapping[] = [
      { original: 'custom', sacred: 'mapped' }
    ];
    
    const allMappings = addSacredNameMappings(customMappings);
    expect(allMappings.length).toBeGreaterThan(customMappings.length);
    
    // Test that custom mapping works
    const result = applySacredNames('This is custom text', allMappings);
    expect(result).toBe('This is mapped text');
  });
});
