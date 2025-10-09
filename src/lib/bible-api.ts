/**
 * Bible API Library - Integrated into Astro project
 * Simplified version of the Bible API functionality
 */

// Types
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

// Sample data - in production, this would be loaded from JSON files
const SAMPLE_BOOKS: Book[] = [
  {
    id: 'genesis',
    name: 'Genesis',
    group: 'Canon',
    chapters: [
      {
        verses: [
          { v: 1, t: 'In the beginning God created the heaven and the earth.' },
          { v: 2, t: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
          { v: 3, t: 'And God said, Let there be light: and there was light.' },
          { v: 4, t: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
          { v: 5, t: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' }
        ]
      }
    ],
    aliases: ['Gen', 'Gn', 'Ge'],
    orderIndex: 1
  },
  {
    id: 'john',
    name: 'John',
    group: 'Canon',
    chapters: [
      {
        verses: [
          { v: 1, t: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
          { v: 2, t: 'The same was in the beginning with God.' }
        ]
      },
      {
        verses: [
          { v: 1, t: 'And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there:' }
        ]
      },
      {
        verses: [
          { v: 16, t: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' }
        ]
      }
    ],
    aliases: ['Jn', 'Joh', 'Jhn'],
    orderIndex: 43
  }
];

// Book aliases mapping
const BOOK_ALIASES: Record<string, string> = {
  'genesis': 'Genesis',
  'gen': 'Genesis',
  'gn': 'Genesis',
  'ge': 'Genesis',
  'john': 'John',
  'jn': 'John',
  'joh': 'John',
  'jhn': 'John'
};

// Sacred names mappings
const SACRED_NAMES: Record<string, string> = {
  'God': 'Elohim',
  'LORD': 'YHWH',
  'Lord': 'Adonai',
  'Jesus': 'Yeshua',
  'Christ': 'Messiah',
  'Jesus Christ': 'Yeshua Messiah',
  'Moses': 'Moshe',
  'Abraham': 'Avraham',
  'Isaac': 'Yitzchak',
  'Jacob': 'Ya\'akov',
  'David': 'Dawid',
  'Solomon': 'Shlomo',
  'Jerusalem': 'Yerushalayim',
  'Israel': 'Yisrael',
  'Bethlehem': 'Beit Lechem',
  'Nazareth': 'Natzrat',
  'Galilee': 'Galil',
  'Judea': 'Yehudah'
};

// API Functions
export function getBooks(group?: string): Book[] {
  let books = SAMPLE_BOOKS;
  
  if (group && ['canon', 'apocrypha', 'pseudepigrapha'].includes(group)) {
    books = SAMPLE_BOOKS.filter(book => book.group.toLowerCase() === group);
  }
  
  return books;
}

export function getBook(bookId: string): Book | null {
  // Try to find by ID first
  let book = SAMPLE_BOOKS.find(b => b.id === bookId);
  
  // If not found, try to find by name or alias
  if (!book) {
    const canonicalName = BOOK_ALIASES[bookId.toLowerCase()] || bookId;
    book = SAMPLE_BOOKS.find(b => 
      b.name === canonicalName || 
      b.aliases.includes(bookId)
    );
  }
  
  return book || null;
}

export function getChapter(bookId: string, chapterNumber: number): { book: Book; chapter: Chapter } | null {
  const book = getBook(bookId);
  if (!book) {
    return null;
  }
  
  const chapter = book.chapters[chapterNumber - 1];
  if (!chapter) {
    return null;
  }
  
  return { book, chapter };
}

export function getVerse(bookId: string, chapterNumber: number, verseNumber: number): { book: Book; chapter: Chapter; verse: Verse } | null {
  const chapterData = getChapter(bookId, chapterNumber);
  if (!chapterData) {
    return null;
  }
  
  const verse = chapterData.chapter.verses.find(v => v.v === verseNumber);
  if (!verse) {
    return null;
  }
  
  return { book: chapterData.book, chapter: chapterData.chapter, verse };
}

export function parseReference(refString: string): { book: string; chapter: number; verse: number } | null {
  if (!refString || typeof refString !== 'string') {
    return null;
  }

  const trimmed = refString.trim();
  if (!trimmed) {
    return null;
  }

  // Simple pattern: "Book Chapter:Verse"
  const match = trimmed.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (match) {
    const bookName = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);
    
    // Resolve book alias
    const canonicalBook = BOOK_ALIASES[bookName.toLowerCase()] || bookName;
    
    return {
      book: canonicalBook,
      chapter,
      verse
    };
  }

  return null;
}

export function applySacredNames(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let result = text;

  // Apply sacred name transformations
  for (const [original, sacred] of Object.entries(SACRED_NAMES)) {
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, (match) => {
      if (match === match.toUpperCase()) {
        return sacred.toUpperCase();
      } else if (match === match.toLowerCase()) {
        return sacred.toLowerCase();
      } else if (match[0] === match[0].toUpperCase()) {
        return sacred.charAt(0).toUpperCase() + sacred.slice(1).toLowerCase();
      }
      return sacred;
    });
  }

  return result;
}

export function searchBible(query: string, options: {
  scope?: 'all' | 'canon' | 'apocrypha' | 'pseudepigrapha';
  book?: string;
  limit?: number;
  offset?: number;
} = {}): {
  results: Array<{
    ref: string;
    snippet: string;
    book: string;
    bookId: string;
    chapter: number;
    verse: number;
    text: string;
    score: number;
  }>;
  total: number;
  limit: number;
  offset: number;
  query: string;
} {
  const { scope = 'all', book, limit = 50, offset = 0 } = options;
  
  const results: Array<{
    ref: string;
    snippet: string;
    book: string;
    bookId: string;
    chapter: number;
    verse: number;
    text: string;
    score: number;
  }> = [];
  
  // Simple search implementation
  const queryLower = query.toLowerCase();
  
  for (const bookData of SAMPLE_BOOKS) {
    if (scope !== 'all' && bookData.group.toLowerCase() !== scope) {
      continue;
    }
    
    if (book && bookData.id !== book && bookData.name !== book) {
      continue;
    }
    
    for (let chapterIndex = 0; chapterIndex < bookData.chapters.length; chapterIndex++) {
      const chapter = bookData.chapters[chapterIndex];
      const chapterNumber = chapterIndex + 1;
      
      for (const verse of chapter.verses) {
        if (verse.t.toLowerCase().includes(queryLower)) {
          const snippet = verse.t.length > 100 
            ? verse.t.substring(0, 100) + '...' 
            : verse.t;
            
          results.push({
            ref: `${bookData.name} ${chapterNumber}:${verse.v}`,
            snippet,
            book: bookData.name,
            bookId: bookData.id,
            chapter: chapterNumber,
            verse: verse.v,
            text: verse.t,
            score: 100
          });
        }
      }
    }
  }
  
  return {
    results: results.slice(offset, offset + limit),
    total: results.length,
    limit,
    offset,
    query
  };
}
