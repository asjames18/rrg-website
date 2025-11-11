import { useState, useEffect } from 'react';

interface BlogFiltersProps {
  posts: any[];
  onFilterChange: (filters: FilterState) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: 'list' | 'grid' | 'compact') => void;
  viewMode: 'list' | 'grid' | 'compact';
}

export interface FilterState {
  tags: string[];
  categories: string[];
}

export type SortOption = 'newest' | 'oldest' | 'popular';

export default function BlogFilters({ 
  posts, 
  onFilterChange, 
  onSearchChange,
  onSortChange,
  onViewModeChange,
  viewMode
}: BlogFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values from posts
  const allTags = Array.from(new Set(
    posts.flatMap(p => p.data.tags || [])
  )).sort();
  
  const allCategories = Array.from(new Set(
    posts.map(p => p.data.category || 'General')
  )).sort();

  useEffect(() => {
    onFilterChange({
      tags: selectedTags,
      categories: selectedCategories,
    });
  }, [selectedTags, selectedCategories]);

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
    setSelectedTags([]);
    setSelectedCategories([]);
    setSearchTerm('');
    setSortBy('newest');
    onFilterChange({ tags: [], categories: [] });
    onSearchChange('');
    onSortChange('newest');
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedCategories.length > 0 || searchTerm !== '';

  return (
    <div className="mb-8 space-y-4">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search bar */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts by title, summary, or content..."
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
        <div className="sm:w-40">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2">
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </button>
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('compact')}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              viewMode === 'compact'
                ? 'bg-amber-700 border-amber-700 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
            aria-label="Compact view"
            title="Compact view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
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
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="bg-amber-700 text-white text-xs px-2 py-0.5 rounded-full">
              {selectedTags.length + selectedCategories.length}
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

          {/* Tags filter */}
          {allTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {tag}
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

