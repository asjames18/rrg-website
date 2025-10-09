/**
 * Corpus loader for Bible data packs
 * Lazy-loads JSON packs and caches them in memory
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { Book, CorpusPack } from '../../types/index';

interface BookData {
  book: string;
  group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha';
  chapters: string[][];
  aliases?: string[];
}

interface CorpusPackData {
  books: BookData[];
  metadata?: {
    version: string;
    lastUpdated: string;
    totalBooks: number;
  };
}

// In-memory cache for loaded corpus
let corpusCache: Book[] | null = null;
let corpusMetadata: { version: string; lastUpdated: string; totalBooks: number } | null = null;

/**
 * Load a single book from JSON file
 * @param filePath - Path to the JSON file
 * @returns Parsed book data or null if failed
 */
function loadBookFromFile(filePath: string): BookData | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as BookData;
    return data;
  } catch (error) {
    console.error(`Failed to load book from ${filePath}:`, error);
    return null;
  }
}

/**
 * Load corpus pack from directory
 * @param dirPath - Directory containing JSON files
 * @param group - Book group (Canon, Apocrypha, or Pseudepigrapha)
 * @returns Array of loaded books
 */
function loadCorpusPack(dirPath: string, group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha'): Book[] {
  const books: Book[] = [];
  
  try {
    // For now, we'll create sample data since we don't have actual files
    // In production, you would read from actual JSON files
    const sampleBooks = createSampleBooks(group);
    books.push(...sampleBooks);
  } catch (error) {
    console.error(`Failed to load corpus pack from ${dirPath}:`, error);
  }
  
  return books;
}

/**
 * Create sample books for testing
 * @param group - Book group
 * @returns Array of sample books
 */
function createSampleBooks(group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha'): Book[] {
  const sampleBooks: Book[] = [];
  
  if (group === 'Canon') {
    // Sample KJV books
    sampleBooks.push({
      id: 'genesis',
      name: 'Genesis',
      group: 'Canon',
      chapters: [
        {
          verses: [
            { v: 1, t: 'In the beginning God created the heaven and the earth.' },
            { v: 2, t: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
            { v: 3, t: 'And God said, Let there be light: and there was light.' }
          ]
        }
      ],
      aliases: ['Gen', 'Gn'],
      orderIndex: 1
    });
    
    sampleBooks.push({
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
      aliases: ['Jn', 'Joh'],
      orderIndex: 43
    });
  } else if (group === 'Apocrypha') {
    // Sample Apocrypha books
    sampleBooks.push({
      id: 'tobit',
      name: 'Tobit',
      group: 'Apocrypha',
      chapters: [
        {
          verses: [
            { v: 1, t: 'The book of the words of Tobit, son of Tobiel, the son of Ananiel, the son of Aduel, the son of Gabael, of the seed of Asael, of the tribe of Nephthali;' },
            { v: 2, t: 'Who in the time of Enemessar king of the Assyrians was led away captive out of Thisbe, which is at the right hand of that city, which is called properly Nephthali in Galilee above Aser.' }
          ]
        }
      ],
      aliases: ['Tob', 'Tb'],
      orderIndex: 67
    });
    
    sampleBooks.push({
      id: 'wisdom',
      name: 'Wisdom of Solomon',
      group: 'Apocrypha',
      chapters: [
        {
          verses: [
            { v: 1, t: 'Love righteousness, ye that be judges of the earth: think of the Lord with a good (heart,) and in simplicity of heart seek him.' },
            { v: 2, t: 'For he will be found of them that tempt him not; and sheweth himself unto such as do not distrust him.' }
          ]
        }
      ],
      aliases: ['Wisdom', 'Wis'],
      orderIndex: 69
    });
  } else if (group === 'Pseudepigrapha') {
    // Sample Pseudepigrapha books
    sampleBooks.push({
      id: 'enoch',
      name: '1 Enoch',
      group: 'Pseudepigrapha',
      chapters: [
        {
          verses: [
            { v: 1, t: 'The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation, when all the wicked and godless are to be removed.' },
            { v: 2, t: 'And he took up his parable and said--Enoch a righteous man, whose eyes were opened by God, saw the vision of the Holy One in the heavens, which the angels showed me, and from them I heard everything, and from them I understood as I saw, but not for this generation, but for a remote one which is for to come.' }
          ]
        }
      ],
      aliases: ['Enoch', '1 En'],
      orderIndex: 80
    });
    
    sampleBooks.push({
      id: 'jasher',
      name: 'Jasher',
      group: 'Pseudepigrapha',
      chapters: [
        {
          verses: [
            { v: 1, t: 'And God said, Let us make man in our image, after our likeness, and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.' },
            { v: 2, t: 'So God created man in his own image, in the image of God created he him; male and female created he them.' }
          ]
        }
      ],
      aliases: ['Book of Jasher', 'Jashar'],
      orderIndex: 82
    });
  }
  
  return sampleBooks;
}

/**
 * Load the complete corpus (all books)
 * @returns Array of all books
 */
export function loadCorpus(): Book[] {
  if (corpusCache) {
    return corpusCache;
  }
  
  console.log('Loading Bible corpus...');
  
  const allBooks: Book[] = [];
  
  // Load Canon books
  const canonBooks = loadCorpusPack('./data/canon', 'Canon');
  allBooks.push(...canonBooks);
  
  // Load Apocrypha books
  const apocryphaBooks = loadCorpusPack('./data/apocrypha', 'Apocrypha');
  allBooks.push(...apocryphaBooks);
  
  // Load Pseudepigrapha books
  const pseudepigraphaBooks = loadCorpusPack('./data/pseudepigrapha', 'Pseudepigrapha');
  allBooks.push(...pseudepigraphaBooks);
  
  // Sort books by order index
  allBooks.sort((a, b) => a.orderIndex - b.orderIndex);
  
  // Cache the results
  corpusCache = allBooks;
  corpusMetadata = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalBooks: allBooks.length
  };
  
  console.log(`Loaded ${allBooks.length} books from corpus`);
  
  return allBooks;
}

/**
 * Get corpus metadata
 * @returns Corpus metadata or null if not loaded
 */
export function getCorpusMetadata(): { version: string; lastUpdated: string; totalBooks: number } | null {
  return corpusMetadata;
}

/**
 * Clear the corpus cache (useful for testing)
 */
export function clearCorpusCache(): void {
  corpusCache = null;
  corpusMetadata = null;
}

/**
 * Get a specific book by ID or name
 * @param bookId - Book ID or name
 * @returns Book object or null if not found
 */
export function getBook(bookId: string): Book | null {
  const corpus = loadCorpus();
  
  // Try to find by ID first
  let book = corpus.find(b => b.id === bookId);
  
  // If not found, try to find by name or alias
  if (!book) {
    book = corpus.find(b => 
      b.name === bookId || 
      b.aliases.includes(bookId)
    );
  }
  
  return book || null;
}

/**
 * Get all books in a specific group
 * @param group - Book group
 * @returns Array of books in the group
 */
export function getBooksByGroup(group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha'): Book[] {
  const corpus = loadCorpus();
  return corpus.filter(book => book.group === group);
}

/**
 * Get a specific chapter from a book
 * @param bookId - Book ID or name
 * @param chapterNumber - Chapter number (1-based)
 * @returns Chapter object or null if not found
 */
export function getChapter(bookId: string, chapterNumber: number): { book: Book; chapter: any } | null {
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

/**
 * Get a specific verse from a book
 * @param bookId - Book ID or name
 * @param chapterNumber - Chapter number (1-based)
 * @param verseNumber - Verse number (1-based)
 * @returns Verse object or null if not found
 */
export function getVerse(bookId: string, chapterNumber: number, verseNumber: number): { book: Book; chapter: any; verse: any } | null {
  const chapterData = getChapter(bookId, chapterNumber);
  if (!chapterData) {
    return null;
  }
  
  const verse = chapterData.chapter.verses.find((v: any) => v.v === verseNumber);
  if (!verse) {
    return null;
  }
  
  return { book: chapterData.book, chapter: chapterData.chapter, verse };
}
