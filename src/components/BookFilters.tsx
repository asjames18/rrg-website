import { useState, useEffect } from 'react';

interface BookFiltersProps {
  books: any[];
  onFilterChange: (filters: FilterState) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: 'grid' | 'list' | 'detailed') => void;
  viewMode: 'grid' | 'list' | 'detailed';
}

export interface FilterState {
  topics: string[];
  categories: string[];
  authors: string[];
  levels: string[];
}

export type SortOption = 'newest' | 'title-asc' | 'title-desc' | 'author' | 'rating';

export default function BookFilters({ 
  books, 
  onFilterChange, 
  onSearchChange,
  onSortChange,
  onViewModeChange,
  viewMode
}: BookFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values from books
  const allTopics = Array.from(new Set(
    books.flatMap(b => b.data.topics || [])
  )).sort();
  
  const allCategories = Array.from(new Set(
    books.map(b => b.data.category || 'General')
  )).sort();
  
  const allAuthors = Array.from(new Set(
    books.map(b => b.data.author)
  )).sort();
  
  const allLevels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    onFilterChange({
      topics: selectedTopics,
      categories: selectedCategories,
      authors: selectedAuthors,
      levels: selectedLevels,
    });
  }, [selectedTopics, selectedCategories, selectedAuthors, selectedLevels]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  const clearAllFilters = () => {
    setSelectedTopics([]);
    setSelectedCategories([]);
    setSelectedAuthors([]);
    setSelectedLevels([]);
    setSearchTerm('');
    setSortBy('newest');
    onFilterChange({ topics: [], categories: [], authors: [], levels: [] });
    onSearchChange('');
    onSortChange('newest');
  };

  const hasActiveFilters = selectedTopics.length > 0 || selectedCategories.length > 0 || 
                           selectedAuthors.length > 0 || selectedLevels.length > 0 || searchTerm !== '';

  return (
    <div className="mb-8 space-y-4">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search bar */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books by title, author, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="newest">Newest Added</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author">By Author</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              viewMode === 'grid'
                ? 'bg-amber-700 border-amber-700 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zm-11 11H3v7h7v-7zm11 0h-7v7h7v-7z"/>
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              viewMode === 'list'
                ? 'bg-amber-700 border-amber-700 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
            aria-label="List view"
            title="List view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('detailed')}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              viewMode === 'detailed'
                ? 'bg-amber-700 border-amber-700 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
            aria-label="Detailed view"
            title="Detailed view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h18v2H3zm0 7h12v2H3zm0 7h18v2H3z"/>
            </svg>
          </button>
        </div>

        {/* Filters toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-amber-700 text-white text-xs px-2 py-0.5 rounded-full">
              {selectedTopics.length + selectedCategories.length + selectedAuthors.length + selectedLevels.length}
            </span>
          )}
        </button>
      </div>

      {/* Expandable filters section */}
      {showFilters && (
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg space-y-6">
          {/* Category filter */}
          {allCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategories(prev =>
                      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
                    )}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedCategories.includes(category)
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Level filter */}
          <div>
            <h3 className="text-sm font-semibold text-amber-100 mb-3">Reading Level</h3>
            <div className="flex flex-wrap gap-2">
              {allLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevels(prev =>
                    prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
                  )}
                  className={`px-3 py-1.5 rounded-lg border text-sm capitalize transition-colors ${
                    selectedLevels.includes(level)
                      ? 'bg-amber-700 border-amber-700 text-white'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Topics filter */}
          {allTopics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopics(prev =>
                      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                    )}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedTopics.includes(topic)
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Author filter */}
          {allAuthors.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Author</h3>
              <div className="flex flex-wrap gap-2">
                {allAuthors.map((author) => (
                  <button
                    key={author}
                    onClick={() => setSelectedAuthors(prev =>
                      prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
                    )}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedAuthors.includes(author)
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {author}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear filters button */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={clearAllFilters}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

