import React, { useState, useEffect } from 'react';

interface ContentItem {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'published';
  featured: boolean;
  publishedAt: string;
  type: 'blog' | 'videos' | 'books' | 'music';
  slug: string;
  author?: string;
  platform?: string;
  tags?: string[];
}

interface ContentListProps {
  content: ContentItem[];
  type: 'blog' | 'videos' | 'books' | 'music';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
  onStatusChange?: (id: string, status: 'draft' | 'review' | 'published') => void;
}

const ContentList: React.FC<ContentListProps> = ({
  content,
  type,
  onEdit,
  onDelete,
  onToggleFeatured,
  onStatusChange
}) => {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'review'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContent = content
    .filter(item => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-700 text-green-200';
      case 'review': return 'bg-yellow-700 text-yellow-200';
      case 'draft': return 'bg-gray-700 text-gray-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return '📝';
      case 'videos': return '🎥';
      case 'books': return '📚';
      case 'music': return '🎵';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'text-amber-400';
      case 'videos': return 'text-blue-400';
      case 'books': return 'text-green-400';
      case 'music': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="review">In Review</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-neutral-300 mb-2">No content found</h3>
            <p className="text-neutral-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No content matches your filters'}
            </p>
          </div>
        ) : (
          filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <h3 className="text-lg font-bold text-neutral-200 truncate">
                      {item.title}
                    </h3>
                    {item.featured && (
                      <span className="bg-amber-700 text-amber-200 text-xs font-bold px-2 py-1 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    {item.author && <span>by {item.author}</span>}
                    {item.platform && <span>• {item.platform}</span>}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-neutral-500 text-xs">
                          +{item.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ml-4">
                  <button
                    onClick={() => onToggleFeatured?.(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.featured
                        ? 'bg-amber-700 text-amber-200 hover:bg-amber-600'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                    title={item.featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    ⭐
                  </button>
                  
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange?.(item.id, e.target.value as any)}
                    className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit?.(item.id)}
                      className="p-2 bg-blue-700 text-blue-200 rounded-lg hover:bg-blue-600 transition-colors"
                      title="Edit content"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onDelete?.(item.id)}
                      className="p-2 bg-red-700 text-red-200 rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete content"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-neutral-500 text-center">
        Showing {filteredContent.length} of {content.length} items
      </div>
    </div>
  );
};

export default ContentList;
