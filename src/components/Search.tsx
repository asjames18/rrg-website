/**
 * Site search component using Pagefind
 * Install Pagefind: npm install pagefind
 * Build index: npx pagefind --site dist
 */

import { useEffect, useState } from 'react';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Pagefind when component mounts
    if (typeof window !== 'undefined') {
      import('pagefind').then(({ PagefindUI }) => {
        // Pagefind will be available globally
        (window as any).pagefind = new PagefindUI();
      }).catch(() => {
        // Pagefind not available (not built yet)
        console.warn('Pagefind not available. Run: npx pagefind --site dist');
      });
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !(window as any).pagefind) return;

    setIsLoading(true);
    try {
      const search = await (window as any).pagefind.search(query);
      const results = await Promise.all(
        search.results.slice(0, 10).map((r: any) => r.data())
      );
      setResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50">
          <form onSubmit={handleSearch} className="p-4 border-b border-neutral-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50"
              >
                {isLoading ? '...' : 'Search'}
              </button>
            </div>
          </form>

          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <ul className="divide-y divide-neutral-700">
                {results.map((result, idx) => (
                  <li key={idx} className="p-4 hover:bg-neutral-800">
                    <a
                      href={result.url}
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      <h3 className="text-amber-100 font-semibold mb-1">{result.meta?.title || result.url}</h3>
                      <p className="text-neutral-400 text-sm line-clamp-2">{result.excerpt}</p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : query && !isLoading ? (
              <div className="p-8 text-center text-neutral-400">
                No results found
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

