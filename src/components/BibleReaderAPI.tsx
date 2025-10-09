import { useState, useEffect, useMemo } from 'react';

interface BibleBook {
  id: string;
  name: string;
  group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha';
  chapters: number;
  aliases: string[];
  orderIndex: number;
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

interface ChapterResponse {
  reference: string;
  book: {
    id: string;
    name: string;
    group: string;
  };
  chapter: number;
  verses: Array<{
    number: number;
    text: string;
  }>;
  metadata: {
    totalVerses: number;
    sacredNames: boolean;
  };
}

/**
 * Interactive Bible reader using the new Bible API.
 * Fetches entire chapters so visitors can browse every verse with sacred names.
 */
export default function BibleReaderAPI() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number>(1);
  const [sacredNames, setSacredNames] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  // When books load, set the initial selection to the first book with chapters
  useEffect(() => {
    if (!selectedBook && books.length > 0) {
      const firstBookWithChapters = books.find((book) => book.chapters > 0) || books[0];
      if (firstBookWithChapters) {
        setSelectedBook(firstBookWithChapters.id);
        setSelectedChapter(1);
        setSelectedVerse(1);
      }
    }
  }, [books, selectedBook]);

  // Load the chapter whenever book, chapter, or sacred names toggle changes
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      loadChapter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, selectedChapter, sacredNames]);

  const loadBooks = async () => {
    try {
      setLoadingBooks(true);
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
      setLoadingBooks(false);
    }
  };

  const loadChapter = async () => {
    try {
      setLoadingChapter(true);
      setError(null);

      const params = new URLSearchParams({
        book: selectedBook,
        chapter: String(selectedChapter),
        sacredNames: sacredNames ? 'true' : 'false'
      });

      const response = await fetch(`/api/bible/chapter?${params.toString()}`);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.error?.message || 'Failed to load chapter';
        setChapterData(null);
        setError(message);
        return;
      }

      const data: ChapterResponse = await response.json();

      if (data.verses?.length) {
        setChapterData(data);
        setSelectedVerse((prev) => {
          if (data.verses.some((verse) => verse.number === prev)) {
            return prev;
          }
          return data.verses[0]?.number || 1;
        });
      } else {
        setChapterData(null);
        setError('Chapter not found');
      }
    } catch (err) {
      setChapterData(null);
      setError('Failed to load chapter');
      console.error('Error loading chapter:', err);
    } finally {
      setLoadingChapter(false);
    }
  };

  const selectedBookData = useMemo(() => {
    return books.find((book) => book.id === selectedBook || book.name === selectedBook) || null;
  }, [books, selectedBook]);

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter(1);
    setSelectedVerse(1);
    setChapterData(null);
  };

  const handleChapterChange = (chapter: number) => {
    if (Number.isNaN(chapter) || chapter < 1) {
      chapter = 1;
    }

    const maxChapter = selectedBookData?.chapters || chapter;
    if (maxChapter > 0 && chapter > maxChapter) {
      chapter = maxChapter;
    }

    setSelectedChapter(chapter);
    setSelectedVerse(1);
  };

  const handleVerseChange = (verse: number) => {
    if (Number.isNaN(verse) || verse < 1) {
      verse = 1;
    }

    if (chapterData?.verses?.length) {
      const availableNumbers = chapterData.verses.map((v) => v.number);
      const maxVerse = Math.max(...availableNumbers);
      if (verse > maxVerse) {
        verse = maxVerse;
      }
    }

    setSelectedVerse(verse);
  };

  const nextVerse = () => {
    if (!chapterData) {
      return;
    }

    const next = selectedVerse + 1;
    const hasNext = chapterData.verses.some((verse) => verse.number === next);

    if (hasNext) {
      setSelectedVerse(next);
    } else if (selectedBookData && selectedChapter < selectedBookData.chapters) {
      setSelectedChapter((prev) => prev + 1);
      setSelectedVerse(1);
    }
  };

  const prevVerse = () => {
    if (selectedVerse > 1) {
      setSelectedVerse((prev) => prev - 1);
    }
  };

  const nextChapter = () => {
    if (selectedBookData && selectedChapter < selectedBookData.chapters) {
      setSelectedChapter((prev) => prev + 1);
      setSelectedVerse(1);
    }
  };

  const prevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter((prev) => prev - 1);
      setSelectedVerse(1);
    }
  };

  const currentVerse = useMemo(() => {
    if (!chapterData) {
      return null;
    }
    return chapterData.verses.find((verse) => verse.number === selectedVerse) || null;
  }, [chapterData, selectedVerse]);

  if ((loadingBooks || (!selectedBook && books.length === 0)) && books.length === 0) {
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
              <option key={book.id} value={book.id}>
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
              max={selectedBookData?.chapters || undefined}
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
              max={chapterData?.metadata.totalVerses || undefined}
              className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
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
            disabled={selectedBookData ? selectedChapter >= selectedBookData.chapters : false}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
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

      {chapterData && (
        <div className="bg-neutral-800 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-amber-400">{chapterData.reference}</h3>
            <p className="text-sm text-neutral-400">
              {chapterData.book.name} • Chapter {chapterData.chapter} • {chapterData.metadata.totalVerses} verses
            </p>
          </div>

          {chapterData.metadata.sacredNames && (
            <div className="mt-4 text-sm text-amber-400">✡️ Sacred Names Applied</div>
          )}
        </div>
      )}

      {currentVerse && (
        <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-amber-400 font-semibold">{currentVerse.number}</span>
            <p className="text-lg leading-relaxed">{currentVerse.text}</p>
          </div>
        </div>
      )}

      {chapterData && (
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-4 space-y-2 max-h-[28rem] overflow-y-auto">
          {chapterData.verses.map((verse) => {
            const isSelected = verse.number === selectedVerse;
            return (
              <button
                key={verse.number}
                type="button"
                onClick={() => setSelectedVerse(verse.number)}
                className={`w-full text-left p-3 rounded transition-colors border ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400 text-neutral-100'
                    : 'bg-neutral-800/40 border-transparent hover:bg-neutral-800/70'
                }`}
              >
                <span className="text-amber-400 font-semibold mr-3">{verse.number}</span>
                <span className="text-sm md:text-base leading-relaxed">{verse.text}</span>
              </button>
            );
          })}
        </div>
      )}

      {loadingChapter && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-neutral-400">Loading verse...</span>
        </div>
      )}
    </div>
  );
}
