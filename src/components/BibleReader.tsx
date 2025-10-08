import { useState } from 'react';
import bibleData from '../data/bible/complete-bible-original-kjv.json';

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
   * Comprehensive Sacred Names Restoration
   * Restores divine names, titles, places, and people with covenant weight
   */
  const applySacredNames = (text: string): string => {
    if (!sacredNames) return text;

    let result = text;

    // ===== CORE DIVINE NAMES =====
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

    // Christ → MASHIACH
    result = result.replace(/\bChrist\b/g, 'MASHIACH');

    // Jesus Christ → YAHUSHA MASHIACH
    result = result.replace(/\bYAHUSHA MASHIACH\b/g, 'YAHUSHA MASHIACH');

    // Lord (not all caps) → YAHUAH in specific contexts
    result = result.replace(/\bLord\b/g, 'YAHUAH');

    // Additional sacred name replacements
    // Jehovah → YAHUAH
    result = result.replace(/\bJehovah\b/g, 'YAHUAH');

    // Yahweh → YAHUAH
    result = result.replace(/\bYahweh\b/g, 'YAHUAH');

    // Yeshua → YAHUSHA
    result = result.replace(/\bYeshua\b/g, 'YAHUSHA');

    // Spirit of the Lord → RUACH of YAHUAH
    result = result.replace(/\bSpirit of the Lord\b/g, 'RUACH of YAHUAH');

    // ===== YAHUAH COMPOUND TITLES (phrase-first, longest-match) =====
    // Handle hyphenated Jehovah- forms first
    result = result.replace(/\bJehovah[-\s]?jireh\b/gi, 'YAHUAH YIREH');
    result = result.replace(/\bJehovah[-\s]?rapha\b/gi, 'YAHUAH RAPHA');
    result = result.replace(/\bJehovah[-\s]?shalom\b/gi, 'YAHUAH SHALOM');
    result = result.replace(/\bJehovah[-\s]?nissi\b/gi, 'YAHUAH NICCIY');

    // Phrase-based YAHUAH titles
    result = result.replace(/\bthe LORD our Righteousness\b/g, 'YAHUAH TSIDQENU');
    result = result.replace(/\bthe LORD is there\b/g, 'YAHUAH SHAMMAH');
    result = result.replace(/\bthe LORD will provide\b/g, 'YAHUAH YIREH');
    result = result.replace(/\bthe LORD who heals\b/g, 'YAHUAH RAPHA');
    result = result.replace(/\bthe LORD is peace\b/g, 'YAHUAH SHALOM');
    result = result.replace(/\bthe LORD my banner\b/g, 'YAHUAH NICCIY');

    // ===== DIVINE TITLES =====
    // Most High → EL ELYON (only as title; keep conservative)
    result = result.replace(/\bthe Most High\b/g, 'EL ELYON');
    result = result.replace(/\bMost High\b/g, 'EL ELYON');

    // God Almighty / the Almighty → EL SHADDAI (title contexts)
    result = result.replace(/\bGod Almighty\b/g, 'EL SHADDAI');
    result = result.replace(/\bthe Almighty\b/g, 'EL SHADDAI');

    // ===== YAHUSHA TITLES =====
    result = result.replace(/\bImmanuel\b/g, "Immanu'El");
    result = result.replace(/\bLamb of God\b/g, 'Lamb of Elohim');
    result = result.replace(/\bSon of God\b/g, 'Ben-Elohim');
    result = result.replace(/\bSon of Man\b/g, 'Ben-Adam');

    // ===== RUACH HAQODESH TITLES =====
    result = result.replace(/\bSpirit of truth\b/g, 'RUACH EMETH');
    // Comforter in John (Joh 14–16) — keep English + clarify
    result = result.replace(/\bthe Comforter\b/g, 'the Comforter (RUACH HAQODESH)');
    result = result.replace(/\bThe Comforter\b/g, 'The Comforter (RUACH HAQODESH)');

    // ===== ISRAEL PEOPLE/PLACES (word boundaries, phrase-first) =====
    // Children of Israel first (phrase)
    result = result.replace(/\bChildren of Israel\b/g, "Benei Yisra'el");
    result = result.replace(/\bchildren of Israel\b/g, "Benei Yisra'el");

    // Israelites
    result = result.replace(/\bIsraelites\b/g, "Yisra'elim");

    // Base toponyms / ethnonyms
    result = result.replace(/\bJerusalem\b/g, 'Yerushalayim');
    result = result.replace(/\bZion\b/g, 'Tsiyon');
    result = result.replace(/\bJudaea\b/g, 'Yehudah');
    result = result.replace(/\bJudea\b/g, 'Yehudah');
    result = result.replace(/\bJudah\b/g, 'Yehudah');
    result = result.replace(/\bEphraim\b/g, 'Ephrayim');

    // Israel last (to avoid stepping on "Children of Israel" earlier)
    result = result.replace(/\bIsrael\b/g, "Yisra'el");

    // Jew / Jews with boundaries to avoid partial hits (e.g., "jewelry")
    result = result.replace(/\bJew\b/g, 'Yehudi');
    result = result.replace(/\bJews\b/g, 'Yehudim');

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
              Sacred Names (Divine Names, Titles & Places)
            </label>
          </div>
        </div>

        <div className="mt-4 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
          <p className="text-sm text-neutral-300">
            <strong className="text-amber-100">Note:</strong> Complete Bible (66 books) with original KJV text. 
            Toggle "Sacred Names" to restore divine names (YAHUAH, YAHUSHA, RUACH HAQODESH, MASHIACH), 
            covenant titles (EL ELYON, YAHUAH TSIDQENU), and Hebrew places/people (Yisra'el, Yerushalayim, Yehudah).
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

        {/* Sacred Names Legend */}
        {sacredNames && (
          <div className="mt-6 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
            <h3 className="text-amber-100 font-bold mb-3">📜 Sacred Names Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-amber-200 font-semibold mb-2">Divine Names:</h4>
                <ul className="space-y-1 text-neutral-300">
                  <li><strong>YAHUAH</strong> = Tetragrammaton (LORD/GOD in caps)</li>
                  <li><strong>YAHUSHA</strong> = Jesus (the Messiah)</li>
                  <li><strong>RUACH HAQODESH</strong> = Holy Spirit</li>
                  <li><strong>MASHIACH</strong> = Christ/Messiah</li>
                  <li><strong>Elohim</strong> = God (divine nature)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-amber-200 font-semibold mb-2">Covenant Titles & Places:</h4>
                <ul className="space-y-1 text-neutral-300">
                  <li><strong>EL ELYON</strong> = Most High</li>
                  <li><strong>EL SHADDAI</strong> = Almighty</li>
                  <li><strong>YAHUAH TSIDQENU</strong> = The LORD our Righteousness</li>
                  <li><strong>Yisra'el</strong> = Israel</li>
                  <li><strong>Yerushalayim</strong> = Jerusalem</li>
                  <li><strong>Yehudah</strong> = Judah/Judea</li>
                  <li><strong>Tsiyon</strong> = Zion</li>
                  <li><strong>Yehudim</strong> = Jews</li>
                </ul>
              </div>
            </div>
          </div>
        )}

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
