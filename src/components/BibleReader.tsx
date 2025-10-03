import React, { useState } from 'react';

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

/**
 * Interactive Bible reader with Sacred Names toggle.
 * This is a minimal implementation - will be expanded with actual Bible data.
 */
export default function BibleReader() {
  const [useSacredNames, setUseSacredNames] = useState(true);
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);

  // Sample Bible data - replace with actual data from kjv.sample.json
  const sampleVerses: BibleVerse[] = [
    {
      book: 'Genesis',
      chapter: 1,
      verse: 1,
      text: useSacredNames 
        ? 'In the beginning ELOHIM created the heaven and the earth.'
        : 'In the beginning God created the heaven and the earth.',
    },
    {
      book: 'Genesis',
      chapter: 1,
      verse: 2,
      text: useSacredNames
        ? 'And the earth was without form, and void; and darkness was upon the face of the deep. And the RUACH of ELOHIM moved upon the face of the waters.'
        : 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
    },
    {
      book: 'Genesis',
      chapter: 1,
      verse: 3,
      text: useSacredNames
        ? 'And ELOHIM said, Let there be light: and there was light.'
        : 'And God said, Let there be light: and there was light.',
    },
  ];

  const books = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
      {/* Controls */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Select book"
            >
              {books.map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
            
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Select chapter"
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Chapter {num}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useSacredNames}
              onChange={(e) => setUseSacredNames(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Use Sacred Names
            </span>
          </label>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            <strong>Note:</strong> Full Bible data will be loaded in future updates. This is a demonstration of the Sacred Names toggle feature.
          </p>
        </div>
      </div>

      {/* Scripture Display */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
          {selectedBook} {selectedChapter}
        </h2>
        
        <div className="space-y-4">
          {sampleVerses.map((verse) => (
            <div key={`${verse.book}-${verse.chapter}-${verse.verse}`} className="flex gap-4">
              <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 flex-shrink-0 w-8 text-right">
                {verse.verse}
              </span>
              <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
                {verse.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
            className="px-6 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedChapter === 1}
            aria-label="Previous chapter"
          >
            ← Previous
          </button>
          <button
            onClick={() => setSelectedChapter(selectedChapter + 1)}
            className="px-6 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors"
            aria-label="Next chapter"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

