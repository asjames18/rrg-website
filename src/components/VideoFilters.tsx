import { useState, useEffect } from 'react';

interface VideoFiltersProps {
  videos: any[];
  onFilterChange: (filters: FilterState) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
}

export interface FilterState {
  series: string[];
  topics: string[];
  platforms: string[];
}

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export default function VideoFilters({ 
  videos, 
  onFilterChange, 
  onSearchChange,
  onSortChange,
  onViewModeChange,
  viewMode
}: VideoFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values from videos
  const allSeries = Array.from(new Set(
    videos.flatMap(v => v.metadata?.series || [])
  )).sort();
  
  const allTopics = Array.from(new Set(
    videos.flatMap(v => v.metadata?.topics || [])
  )).sort();
  
  const allPlatforms = Array.from(new Set(
    videos.map(v => v.metadata?.platform || 'youtube')
  )).sort();

  useEffect(() => {
    onFilterChange({
      series: selectedSeries,
      topics: selectedTopics,
      platforms: selectedPlatforms,
    });
  }, [selectedSeries, selectedTopics, selectedPlatforms]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSeriesToggle = (series: string) => {
    setSelectedSeries(prev =>
      prev.includes(series) ? prev.filter(s => s !== series) : [...prev, series]
    );
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  const clearAllFilters = () => {
    setSelectedSeries([]);
    setSelectedTopics([]);
    setSelectedPlatforms([]);
    setSearchTerm('');
    setSortBy('newest');
    onFilterChange({ series: [], topics: [], platforms: [] });
    onSearchChange('');
    onSortChange('newest');
  };

  const hasActiveFilters = selectedSeries.length > 0 || selectedTopics.length > 0 || 
                           selectedPlatforms.length > 0 || searchTerm !== '';

  return (
    <div className="mb-8 space-y-4">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search bar */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
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
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
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
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
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
              {selectedSeries.length + selectedTopics.length + selectedPlatforms.length}
            </span>
          )}
        </button>
      </div>

      {/* Expandable filters section */}
      {showFilters && (
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg space-y-6">
          {/* Series filter */}
          {allSeries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Series</h3>
              <div className="flex flex-wrap gap-2">
                {allSeries.map((series) => (
                  <button
                    key={series}
                    onClick={() => handleSeriesToggle(series)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedSeries.includes(series)
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {series}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topics filter */}
          {allTopics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicToggle(topic)}
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

          {/* Platform filter */}
          {allPlatforms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-100 mb-3">Platform</h3>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`px-3 py-1.5 rounded-lg border text-sm capitalize transition-colors ${
                      selectedPlatforms.includes(platform)
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {platform}
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

