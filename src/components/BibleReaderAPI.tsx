import { useState, useEffect } from 'react';

interface BibleBook {
  id: string;
  name: string;
  group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha';
  chapters: number;
  aliases: string[];
  orderIndex: number;
}

interface Verse {
  v: number;
  t: string;
}

interface Chapter {
  verses: Verse[];
}

interface BibleAPIResponse {
  books: BibleBook[];
  metadata: {
    total: number;
    version: string;
    lastUpdated: string;
    totalBooks: number;
  };
}

interface VerseResponse {
  reference: string;
  book: {
    id: string;
    name: string;
    group: string;
  };
  chapter: number;
  verse: number;
  text: string;
  metadata: {
    sacredNames: boolean;
  };
}

/**
 * Interactive Bible reader using the new Bible API.
 * Replaces the old local JSON approach with API calls.
 */
export default function BibleReaderAPI() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('Genesis');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number>(1);
  const [sacredNames, setSacredNames] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<VerseResponse | null>(null);

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Load verse when book, chapter, or verse changes
  useEffect(() => {
    if (selectedBook && selectedChapter && selectedVerse) {
      loadVerse();
    }
  }, [selectedBook, selectedChapter, selectedVerse, sacredNames]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bible/books?group=canon');
      const data: BibleAPIResponse = await response.json();
      
      if (data.books) {
        setBooks(data.books);
      } else {
        setError('Failed to load books');
      }
    } catch (err) {
      setError('Failed to load books');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVerse = async () => {
    try {
      setLoading(true);
      const ref = `${selectedBook} ${selectedChapter}:${selectedVerse}`;
      const response = await fetch(`/api/bible/verse?ref=${encodeURIComponent(ref)}&sacredNames=${sacredNames}`);
      const data: VerseResponse = await response.json();
      
      if (data.text) {
        setCurrentVerse(data);
        setError(null);
      } else {
        setError('Verse not found');
      }
    } catch (err) {
      setError('Failed to load verse');
      console.error('Error loading verse:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter(1);
    setSelectedVerse(1);
  };

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    setSelectedVerse(1);
  };

  const handleVerseChange = (verse: number) => {
    setSelectedVerse(verse);
  };

  const nextVerse = () => {
    setSelectedVerse(prev => prev + 1);
  };

  const prevVerse = () => {
    if (selectedVerse > 1) {
      setSelectedVerse(prev => prev - 1);
    }
  };

  const nextChapter = () => {
    setSelectedChapter(prev => prev + 1);
  };

  const prevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading Bible...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-900 text-neutral-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Bible Reader (API Version)</h2>
        
        {/* Sacred Names Toggle */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sacredNames}
              onChange={(e) => setSacredNames(e.target.checked)}
              className="rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm">Use Sacred Names (Hebrew)</span>
          </label>
        </div>

        {/* Book Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Book:</label>
          <select
            value={selectedBook}
            onChange={(e) => handleBookChange(e.target.value)}
            className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-100 focus:ring-2 focus:ring-amber-500"
          >
            {books.map((book) => (
              <option key={book.id} value={book.name}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter and Verse Selection */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chapter:</label>
            <input
              type="number"
              value={selectedChapter}
              onChange={(e) => handleChapterChange(parseInt(e.target.value))}
              min="1"
              className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Verse:</label>
            <input
              type="number"
              value={selectedVerse}
              onChange={(e) => handleVerseChange(parseInt(e.target.value))}
              min="1"
              className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={prevChapter}
            disabled={selectedChapter <= 1}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
          >
            ← Previous Chapter
          </button>
          <button
            onClick={prevVerse}
            disabled={selectedVerse <= 1}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
          >
            ← Previous Verse
          </button>
          <button
            onClick={nextVerse}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
          >
            Next Verse →
          </button>
          <button
            onClick={nextChapter}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
          >
            Next Chapter →
          </button>
        </div>
      </div>

      {/* Verse Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded p-4 mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {currentVerse && (
        <div className="bg-neutral-800 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-amber-400">
              {currentVerse.reference}
            </h3>
            <p className="text-sm text-neutral-400">
              {currentVerse.book.name} • Chapter {currentVerse.chapter} • Verse {currentVerse.verse}
            </p>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              {currentVerse.text}
            </p>
          </div>

          {currentVerse.metadata.sacredNames && (
            <div className="mt-4 text-sm text-amber-400">
              ✡️ Sacred Names Applied
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-neutral-400">Loading verse...</span>
        </div>
      )}
    </div>
  );
}
