import { useState } from 'react';
import bibleData from '../data/bible/kjv.sample.json';

interface BibleBook {
  book: string;
  chapters: string[][];
}

/**
 * Interactive Bible reader with Sacred Names toggle.
 * Reads from local JSON and applies name replacements when enabled.
 * 
 * TODO: Load full KJV JSON (all 66 books, 1189 chapters) from CDN or API
 * TODO: Add verse-level bookmarking/highlighting feature
 * TODO: Add copy-to-clipboard for verses
 * TODO: Add verse search functionality
 */
export default function BibleReader() {
  const [bookIndex, setBookIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [sacredNames, setSacredNames] = useState(true);

  const books = bibleData as BibleBook[];
  const currentBook = books[bookIndex];
  const currentChapter = currentBook?.chapters[chapterIndex] || [];

  /**
   * Apply Sacred Names replacements to verse text
   */
  const applySacredNames = (text: string): string => {
    if (!sacredNames) return text;

    let result = text;

    // LORD (all caps - Tetragrammaton) → YAHUAH
    result = result.replace(/\bLORD\b/g, 'YAHUAH');
    
    // GOD (all caps in certain contexts) → YAHUAH
    result = result.replace(/\bGOD\b/g, 'YAHUAH');
    
    // Jesus → YAHUSHA
    result = result.replace(/\bJesus\b/g, 'YAHUSHA');
    
    // Holy Ghost → RUACH HAQODESH
    result = result.replace(/\bHoly Ghost\b/g, 'RUACH HAQODESH');
    
    // Holy Spirit → RUACH HAQODESH
    result = result.replace(/\bHoly Spirit\b/g, 'RUACH HAQODESH');
    
    // Spirit of God → RUACH of Elohim (handle carefully)
    result = result.replace(/\bSpirit of God\b/g, 'RUACH of Elohim');
    
    // Generic God → Elohim (lowercase context)
    result = result.replace(/\bGod\b/g, 'Elohim');

    return result;
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBookIndex(Number(e.target.value));
    setChapterIndex(0); // Reset to first chapter
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChapterIndex(Number(e.target.value));
  };

  if (books.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
        <p className="text-neutral-500">Bible data not available</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg">
      {/* Controls */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex-1">
              <label htmlFor="book-select" className="block text-sm font-medium text-neutral-400 mb-1">
                Book
              </label>
              <select
                id="book-select"
                value={bookIndex}
                onChange={handleBookChange}
                className="w-full px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
              >
                {books.map((book, index) => (
                  <option key={index} value={index}>
                    {book.book}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label htmlFor="chapter-select" className="block text-sm font-medium text-neutral-400 mb-1">
                Chapter
              </label>
              <select
                id="chapter-select"
                value={chapterIndex}
                onChange={handleChapterChange}
                className="w-full px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
              >
                {currentBook.chapters.map((_, index) => (
                  <option key={index} value={index}>
                    Chapter {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6 md:pt-0">
            <input
              type="checkbox"
              id="sacred-names-toggle"
              checked={sacredNames}
              onChange={(e) => setSacredNames(e.target.checked)}
              className="w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-600 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            />
            <label 
              htmlFor="sacred-names-toggle" 
              className="text-sm font-medium text-neutral-300 cursor-pointer select-none"
            >
              Sacred Names
            </label>
          </div>
        </div>

        <div className="mt-4 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
          <p className="text-sm text-neutral-300">
            <strong className="text-amber-100">Note:</strong> This is a sample Bible reader with limited content. 
            Toggle "Sacred Names" to see the divine names restored: YAHUAH, YAHUSHA, RUACH HAQODESH, Elohim.
          </p>
        </div>
      </div>

      {/* Scripture Display */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-amber-100">
          {currentBook.book} {chapterIndex + 1}
        </h2>
        
        <div className="prose prose-lg prose-invert max-w-none">
          {currentChapter.length > 0 ? (
            currentChapter.map((verse, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <span className="text-sm font-bold text-amber-500 flex-shrink-0 w-8 text-right">
                  {index + 1}
                </span>
                <p className="text-lg leading-relaxed text-neutral-200 m-0">
                  {applySacredNames(verse)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">No verses available for this chapter.</p>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex gap-3">
          <button
            onClick={() => setChapterIndex(Math.max(0, chapterIndex - 1))}
            disabled={chapterIndex === 0}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            aria-label="Previous chapter"
          >
            ← Previous
          </button>
          <button
            onClick={() => setChapterIndex(Math.min(currentBook.chapters.length - 1, chapterIndex + 1))}
            disabled={chapterIndex === currentBook.chapters.length - 1}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            aria-label="Next chapter"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
