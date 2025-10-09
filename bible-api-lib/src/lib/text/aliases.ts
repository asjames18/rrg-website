/**
 * Book name aliases and canonical name resolution
 */

import { BookAlias } from '../../types/index';

/**
 * Canonical book registry with aliases
 */
export const BOOK_ALIASES: BookAlias[] = [
  // Canon (Old Testament)
  { canonical: 'Genesis', aliases: ['Gen', 'Gn', 'Ge'] },
  { canonical: 'Exodus', aliases: ['Ex', 'Exo', 'Exod'] },
  { canonical: 'Leviticus', aliases: ['Lev', 'Le', 'Lv'] },
  { canonical: 'Numbers', aliases: ['Num', 'Nu', 'Nm', 'Nb'] },
  { canonical: 'Deuteronomy', aliases: ['Deut', 'De', 'Dt'] },
  { canonical: 'Joshua', aliases: ['Josh', 'Jos', 'Jsh'] },
  { canonical: 'Judges', aliases: ['Judg', 'Jdg', 'Jg', 'Jdgs'] },
  { canonical: 'Ruth', aliases: ['Rth', 'Ru'] },
  { canonical: '1 Samuel', aliases: ['1 Sam', '1Sa', '1 S', 'I Sam', 'I Samuel'] },
  { canonical: '2 Samuel', aliases: ['2 Sam', '2Sa', '2 S', 'II Sam', 'II Samuel'] },
  { canonical: '1 Kings', aliases: ['1 Kgs', '1Ki', '1 K', 'I Kings', 'I Kgs'] },
  { canonical: '2 Kings', aliases: ['2 Kgs', '2Ki', '2 K', 'II Kings', 'II Kgs'] },
  { canonical: '1 Chronicles', aliases: ['1 Chr', '1Ch', '1 Ch', 'I Chronicles', 'I Chr'] },
  { canonical: '2 Chronicles', aliases: ['2 Chr', '2Ch', '2 Ch', 'II Chronicles', 'II Chr'] },
  { canonical: 'Ezra', aliases: ['Ezr', 'Ez'] },
  { canonical: 'Nehemiah', aliases: ['Neh', 'Ne'] },
  { canonical: 'Esther', aliases: ['Esth', 'Est', 'Es'] },
  { canonical: 'Job', aliases: ['Jb'] },
  { canonical: 'Psalms', aliases: ['Ps', 'Psalm', 'Psa', 'Psm', 'Pss'] },
  { canonical: 'Proverbs', aliases: ['Prov', 'Prv', 'Pr', 'Pro'] },
  { canonical: 'Ecclesiastes', aliases: ['Eccl', 'Ec', 'Ecc', 'Qoh'] },
  { canonical: 'Song of Solomon', aliases: ['Song', 'SOS', 'Canticles', 'Cant', 'Song of Songs', 'Solomon\'s Song'] },
  { canonical: 'Isaiah', aliases: ['Isa', 'Is'] },
  { canonical: 'Jeremiah', aliases: ['Jer', 'Je', 'Jr'] },
  { canonical: 'Lamentations', aliases: ['Lam', 'La'] },
  { canonical: 'Ezekiel', aliases: ['Ezek', 'Eze', 'Ezk'] },
  { canonical: 'Daniel', aliases: ['Dan', 'Da', 'Dn'] },
  { canonical: 'Hosea', aliases: ['Hos', 'Ho'] },
  { canonical: 'Joel', aliases: ['Jl'] },
  { canonical: 'Amos', aliases: ['Am'] },
  { canonical: 'Obadiah', aliases: ['Obad', 'Ob'] },
  { canonical: 'Jonah', aliases: ['Jnh', 'Jon'] },
  { canonical: 'Micah', aliases: ['Mic', 'Mc'] },
  { canonical: 'Nahum', aliases: ['Nah', 'Na'] },
  { canonical: 'Habakkuk', aliases: ['Hab', 'Hb'] },
  { canonical: 'Zephaniah', aliases: ['Zeph', 'Zep', 'Zp'] },
  { canonical: 'Haggai', aliases: ['Hag', 'Hg'] },
  { canonical: 'Zechariah', aliases: ['Zech', 'Zec', 'Zc'] },
  { canonical: 'Malachi', aliases: ['Mal', 'Ml'] },

  // Canon (New Testament)
  { canonical: 'Matthew', aliases: ['Matt', 'Mt', 'Mat'] },
  { canonical: 'Mark', aliases: ['Mk', 'Mr', 'Mar'] },
  { canonical: 'Luke', aliases: ['Lk', 'Lu', 'Luk'] },
  { canonical: 'John', aliases: ['Jn', 'Joh', 'Jhn'] },
  { canonical: 'Acts', aliases: ['Ac'] },
  { canonical: 'Romans', aliases: ['Rom', 'Ro', 'Rm'] },
  { canonical: '1 Corinthians', aliases: ['1 Cor', '1Co', '1 C', 'I Corinthians', 'I Cor'] },
  { canonical: '2 Corinthians', aliases: ['2 Cor', '2Co', '2 C', 'II Corinthians', 'II Cor'] },
  { canonical: 'Galatians', aliases: ['Gal', 'Ga'] },
  { canonical: 'Ephesians', aliases: ['Eph', 'Ephes'] },
  { canonical: 'Philippians', aliases: ['Phil', 'Php', 'Pp'] },
  { canonical: 'Colossians', aliases: ['Col', 'Co'] },
  { canonical: '1 Thessalonians', aliases: ['1 Thess', '1Th', '1 Th', 'I Thessalonians', 'I Thess'] },
  { canonical: '2 Thessalonians', aliases: ['2 Thess', '2Th', '2 Th', 'II Thessalonians', 'II Thess'] },
  { canonical: '1 Timothy', aliases: ['1 Tim', '1Ti', '1 T', 'I Timothy', 'I Tim'] },
  { canonical: '2 Timothy', aliases: ['2 Tim', '2Ti', '2 T', 'II Timothy', 'II Tim'] },
  { canonical: 'Titus', aliases: ['Tit', 'Ti'] },
  { canonical: 'Philemon', aliases: ['Phlm', 'Phm', 'Philem'] },
  { canonical: 'Hebrews', aliases: ['Heb'] },
  { canonical: 'James', aliases: ['Jas', 'Jm'] },
  { canonical: '1 Peter', aliases: ['1 Pet', '1Pe', '1 P', 'I Peter', 'I Pet'] },
  { canonical: '2 Peter', aliases: ['2 Pet', '2Pe', '2 P', 'II Peter', 'II Pet'] },
  { canonical: '1 John', aliases: ['1 Jn', '1Jo', '1 J', 'I John', 'I Jn'] },
  { canonical: '2 John', aliases: ['2 Jn', '2Jo', '2 J', 'II John', 'II Jn'] },
  { canonical: '3 John', aliases: ['3 Jn', '3Jo', '3 J', 'III John', 'III Jn'] },
  { canonical: 'Jude', aliases: ['Jud', 'Jd'] },
  { canonical: 'Revelation', aliases: ['Rev', 'Re', 'The Revelation', 'Apocalypse'] },

  // Apocrypha
  { canonical: 'Tobit', aliases: ['Tob', 'Tb'] },
  { canonical: 'Judith', aliases: ['Jdt', 'Jth', 'Jud'] },
  { canonical: 'Wisdom of Solomon', aliases: ['Wisdom', 'Wis', 'Wisd', 'Solomon'] },
  { canonical: 'Sirach', aliases: ['Ecclesiasticus', 'Sir', 'Ecclus', 'Ben Sira'] },
  { canonical: 'Baruch', aliases: ['Bar', 'Ba'] },
  { canonical: '1 Maccabees', aliases: ['1 Macc', '1Mac', '1 M', 'I Maccabees', 'I Macc'] },
  { canonical: '2 Maccabees', aliases: ['2 Macc', '2Mac', '2 M', 'II Maccabees', 'II Macc'] },
  { canonical: 'Additions to Esther', aliases: ['Esther Additions', 'Est Add', 'Add Esth'] },
  { canonical: 'Prayer of Manasseh', aliases: ['Manasseh', 'Pr Man', 'Prayer of Man'] },
  { canonical: 'Susanna', aliases: ['Sus', 'Dan 13'] },
  { canonical: 'Bel and the Dragon', aliases: ['Bel', 'Bel Dragon', 'Dan 14'] },
  { canonical: '1 Esdras', aliases: ['I Esdras', '1 Esdr', '1 Es', '3 Esdras'] },
  { canonical: '2 Esdras', aliases: ['II Esdras', '2 Esdr', '2 Es', '4 Ezra', '4 Esdras'] },

  // Pseudepigrapha
  { canonical: '1 Enoch', aliases: ['Enoch', '1 En', 'I Enoch', 'Ethiopic Enoch'] },
  { canonical: 'Jubilees', aliases: ['Jub', 'Book of Jubilees', 'Little Genesis'] },
  { canonical: 'Jasher', aliases: ['Book of Jasher', 'Sefer HaYashar', 'Jashar'] }
];

/**
 * Create a lookup map for fast alias resolution
 */
const aliasMap = new Map<string, string>();

// Build the alias map
BOOK_ALIASES.forEach(book => {
  aliasMap.set(book.canonical.toLowerCase(), book.canonical);
  book.aliases.forEach(alias => {
    aliasMap.set(alias.toLowerCase(), book.canonical);
  });
});

/**
 * Resolve a book name or alias to its canonical name
 * @param input - The book name or alias to resolve
 * @returns The canonical book name or null if not found
 */
export function resolveBookAlias(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const normalized = input.trim().toLowerCase();
  return aliasMap.get(normalized) || null;
}

/**
 * Get all aliases for a canonical book name
 * @param canonicalName - The canonical book name
 * @returns Array of aliases or empty array if not found
 */
export function getBookAliases(canonicalName: string): string[] {
  const book = BOOK_ALIASES.find(b => b.canonical === canonicalName);
  return book ? book.aliases : [];
}

/**
 * Check if a string is a valid book name or alias
 * @param input - The string to check
 * @returns True if the string is a valid book name or alias
 */
export function isValidBookName(input: string): boolean {
  return resolveBookAlias(input) !== null;
}
