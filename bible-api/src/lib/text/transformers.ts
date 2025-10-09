/**
 * Sacred Names transformation pipeline
 */

import { SacredNameMapping } from '../../types/index';

/**
 * Sacred name mappings for Hebrew names and titles
 * These are common public domain sacred name translations
 */
export const SACRED_NAME_MAPPINGS: SacredNameMapping[] = [
  // Divine Names
  { original: 'God', sacred: 'Elohim', caseSensitive: false },
  { original: 'LORD', sacred: 'YHWH', caseSensitive: true },
  { original: 'Lord', sacred: 'Adonai', caseSensitive: false },
  { original: 'Jesus', sacred: 'Yeshua', caseSensitive: false },
  { original: 'Christ', sacred: 'Messiah', caseSensitive: false },
  { original: 'Jesus Christ', sacred: 'Yeshua Messiah', caseSensitive: false },
  
  // Biblical Names
  { original: 'Moses', sacred: 'Moshe', caseSensitive: false },
  { original: 'Abraham', sacred: 'Avraham', caseSensitive: false },
  { original: 'Isaac', sacred: 'Yitzchak', caseSensitive: false },
  { original: 'Jacob', sacred: 'Ya\'akov', caseSensitive: false },
  { original: 'David', sacred: 'Dawid', caseSensitive: false },
  { original: 'Solomon', sacred: 'Shlomo', caseSensitive: false },
  { original: 'Jerusalem', sacred: 'Yerushalayim', caseSensitive: false },
  { original: 'Israel', sacred: 'Yisrael', caseSensitive: false },
  
  // Places
  { original: 'Bethlehem', sacred: 'Beit Lechem', caseSensitive: false },
  { original: 'Nazareth', sacred: 'Natzrat', caseSensitive: false },
  { original: 'Galilee', sacred: 'Galil', caseSensitive: false },
  { original: 'Judea', sacred: 'Yehudah', caseSensitive: false },
  
  // Titles and Terms
  { original: 'angel', sacred: 'malakh', caseSensitive: false },
  { original: 'prophet', sacred: 'navi', caseSensitive: false },
  { original: 'priest', sacred: 'kohen', caseSensitive: false },
  { original: 'temple', sacred: 'beit ha-mikdash', caseSensitive: false },
  { original: 'synagogue', sacred: 'beit knesset', caseSensitive: false },
  
  // Common phrases
  { original: 'praise the Lord', sacred: 'hallelu-Yah', caseSensitive: false },
  { original: 'amen', sacred: 'amen', caseSensitive: false }
];

/**
 * Transform text by applying sacred name mappings
 * @param text - The text to transform
 * @param mappings - Optional custom mappings (uses default if not provided)
 * @returns The transformed text
 */
export function applySacredNames(
  text: string, 
  mappings: SacredNameMapping[] = SACRED_NAME_MAPPINGS
): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let transformedText = text;

  // Apply mappings in order of specificity (longer phrases first)
  const sortedMappings = [...mappings].sort((a, b) => b.original.length - a.original.length);

  for (const mapping of sortedMappings) {
    const { original, sacred, caseSensitive = false } = mapping;
    
    if (caseSensitive) {
      // Case-sensitive replacement
      transformedText = transformedText.replace(
        new RegExp(escapeRegExp(original), 'g'),
        sacred
      );
    } else {
      // Case-insensitive replacement with preserved case
      transformedText = transformedText.replace(
        new RegExp(escapeRegExp(original), 'gi'),
        (match) => {
          // Preserve the original case pattern
          if (match === match.toUpperCase()) {
            return sacred.toUpperCase();
          } else if (match === match.toLowerCase()) {
            return sacred.toLowerCase();
          } else if (match[0] === match[0].toUpperCase()) {
            return sacred.charAt(0).toUpperCase() + sacred.slice(1).toLowerCase();
          }
          return sacred;
        }
      );
    }
  }

  return transformedText;
}

/**
 * Escape special regex characters
 * @param string - The string to escape
 * @returns The escaped string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a custom sacred names transformer with specific mappings
 * @param customMappings - Custom sacred name mappings
 * @returns A transformer function
 */
export function createSacredNamesTransformer(customMappings: SacredNameMapping[]) {
  return (text: string) => applySacredNames(text, customMappings);
}

/**
 * Get all available sacred name mappings
 * @returns Array of all sacred name mappings
 */
export function getSacredNameMappings(): SacredNameMapping[] {
  return [...SACRED_NAME_MAPPINGS];
}

/**
 * Add custom sacred name mappings
 * @param mappings - New mappings to add
 * @returns Updated array of mappings
 */
export function addSacredNameMappings(mappings: SacredNameMapping[]): SacredNameMapping[] {
  return [...SACRED_NAME_MAPPINGS, ...mappings];
}
