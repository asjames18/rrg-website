import React, { useState, useEffect } from 'react';

interface ActivityItem {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'published' | 'unpublished';
  type: 'blog' | 'videos' | 'books' | 'music';
  title: string;
  user: string;
  timestamp: string;
  changes?: string[];
}

interface ActivityLogProps {
  activities?: ActivityItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
  activities = [],
  onLoadMore,
  hasMore = false
}) => {
  const [filter, setFilter] = useState<'all' | 'blog' | 'videos' | 'books' | 'music'>('all');
  const [actionFilter, setActionFilter] = useState<'all' | 'created' | 'updated' | 'deleted' | 'published'>('all');

  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false;
    if (actionFilter !== 'all' && activity.action !== actionFilter) return false;
    return true;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return '➕';
      case 'updated': return '✏️';
      case 'deleted': return '🗑️';
      case 'published': return '📢';
      case 'unpublished': return '📝';
      default: return '📄';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-green-400';
      case 'updated': return 'text-blue-400';
      case 'deleted': return 'text-red-400';
      case 'published': return 'text-amber-400';
      case 'unpublished': return 'text-gray-400';
      default: return 'text-neutral-400';
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Content Types</option>
              <option value="blog">Blog Posts</option>
              <option value="videos">Videos</option>
              <option value="books">Books</option>
              <option value="music">Music</option>
            </select>
          </div>
          <div className="flex-1">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-neutral-300 mb-2">No activity found</h3>
            <p className="text-neutral-500">
              {activities.length === 0 
                ? 'No activity has been recorded yet' 
                : 'No activity matches your current filters'
              }
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Action Icon */}
                <div className={`text-2xl ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg ${getTypeColor(activity.type)}`}>
                      {getTypeIcon(activity.type)}
                    </span>
                    <h4 className="text-lg font-bold text-neutral-200 truncate">
                      {activity.title}
                    </h4>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      activity.action === 'created' ? 'bg-green-700 text-green-200' :
                      activity.action === 'updated' ? 'bg-blue-700 text-blue-200' :
                      activity.action === 'deleted' ? 'bg-red-700 text-red-200' :
                      activity.action === 'published' ? 'bg-amber-700 text-amber-200' :
                      'bg-gray-700 text-gray-200'
                    }`}>
                      {activity.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-neutral-400 mb-2">
                    <span>by {activity.user}</span>
                    <span>•</span>
                    <span>{formatTimestamp(activity.timestamp)}</span>
                    <span>•</span>
                    <span className="capitalize">{activity.type}</span>
                  </div>

                  {/* Changes */}
                  {activity.changes && activity.changes.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-neutral-300 mb-2">Changes:</h5>
                      <ul className="space-y-1">
                        {activity.changes.map((change, index) => (
                          <li key={index} className="text-sm text-neutral-400 flex items-center gap-2">
                            <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-sm text-neutral-500">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-amber-700 text-amber-200 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
          >
            Load More Activity
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {activities.filter(a => a.action === 'created').length}
            </div>
            <div className="text-neutral-400">Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {activities.filter(a => a.action === 'updated').length}
            </div>
            <div className="text-neutral-400">Updated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {activities.filter(a => a.action === 'published').length}
            </div>
            <div className="text-neutral-400">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {activities.filter(a => a.action === 'deleted').length}
            </div>
            <div className="text-neutral-400">Deleted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
