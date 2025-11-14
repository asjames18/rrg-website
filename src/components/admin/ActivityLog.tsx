/**
 * Activity Log Component
 * Displays system-wide activity log with filtering, search, and pagination
 */
import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  metadata?: any;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

interface Summary {
  total: number;
  uniqueUsers: number;
  mostCommonType: string | null;
  activityByType: Record<string, number>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    uniqueUsers: 0,
    mostCommonType: null,
    activityByType: {}
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [pagination.page, searchQuery, activityTypeFilter, dateRange, customStartDate, customEndDate]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (searchQuery) params.append('search', searchQuery);
      if (activityTypeFilter) params.append('activity_type', activityTypeFilter);
      
      // Handle date range
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate: Date | null = null;

        switch (dateRange) {
          case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'custom':
            if (customStartDate) {
              params.append('start_date', customStartDate);
            }
            if (customEndDate) {
              params.append('end_date', customEndDate);
            }
            break;
        }

        if (startDate && dateRange !== 'custom') {
          params.append('start_date', startDate.toISOString());
        }
      }

      const response = await fetch(`/api/admin/activity?${params}`);
      const data = await response.json();

      if (response.ok) {
        setActivities(data.activities || []);
        setSummary(data.summary || { total: 0, uniqueUsers: 0, mostCommonType: null, activityByType: {} });
        setPagination(data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 });
      } else {
        console.error('[ActivityLog] Failed to fetch activities:', data);
      }
    } catch (error) {
      console.error('[ActivityLog] Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchActivities();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActivityTypeFilter('');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setPagination({ ...pagination, page: 1 });
  };

  const getActivityIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      user_signup: '👤',
      login: '🔓',
      login_failed: '🚫',
      content_created: '✨',
      content_updated: '📝',
      content_deleted: '🗑️',
      content_published: '🚀',
      settings_updated: '⚙️',
      post_read: '📖',
      video_watched: '📺',
      error: '⚠️',
      password_changed: '🔑',
      preference_updated: '🎨'
    };
    return iconMap[type] || '📋';
  };

  const getActivityColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      user_signup: 'bg-green-500/10 text-green-400 border-green-500/20',
      login: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      login_failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      content_created: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      content_updated: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      content_deleted: 'bg-red-500/10 text-red-400 border-red-500/20',
      content_published: 'bg-green-500/10 text-green-400 border-green-500/20',
      settings_updated: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      post_read: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      video_watched: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      error: 'bg-red-500/10 text-red-400 border-red-500/20',
      password_changed: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      preference_updated: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    };
    return colorMap[type] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatAbsoluteTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activityTypes = [
    'user_signup',
    'login',
    'login_failed',
    'content_created',
    'content_updated',
    'content_deleted',
    'content_published',
    'settings_updated',
    'post_read',
    'video_watched',
    'password_changed',
    'preference_updated',
    'error'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-amber-100 mb-3">Activity Log</h2>
        <p className="text-neutral-400 text-lg">Monitor all system activity and user actions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm font-medium">Total Activities</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-amber-100">{summary.total.toLocaleString()}</div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm font-medium">Unique Users</span>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-amber-100">{summary.uniqueUsers}</div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm font-medium">Most Common</span>
            <span className="text-2xl">{summary.mostCommonType ? getActivityIcon(summary.mostCommonType) : '📋'}</span>
          </div>
          <div className="text-lg font-bold text-amber-100 truncate">
            {summary.mostCommonType ? summary.mostCommonType.replace(/_/g, ' ') : 'N/A'}
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm font-medium">Activity Types</span>
            <span className="text-2xl">🏷️</span>
          </div>
          <div className="text-3xl font-bold text-amber-100">{Object.keys(summary.activityByType).length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-amber-100">Filters</h3>
          {(searchQuery || activityTypeFilter || dateRange !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-amber-400 hover:text-amber-300 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Search Description</label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Activity Type</label>
            <select
              value={activityTypeFilter}
              onChange={(e) => {
                setActivityTypeFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Types</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {getActivityIcon(type)} {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Start Date</label>
              <input
                type="datetime-local"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">End Date</label>
              <input
                type="datetime-local"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
          <h3 className="text-lg font-semibold text-amber-100">
            Activity Feed
            {!loading && <span className="text-neutral-400 text-sm ml-2">({activities.length} of {summary.total})</span>}
          </h3>
        </div>

        <div className="divide-y divide-neutral-800">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-700/30 border-t-amber-500 mb-4"></div>
              <p className="text-neutral-400">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-neutral-400 text-lg">No activities found</p>
              <p className="text-neutral-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {getActivityIcon(activity.activity_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getActivityColor(activity.activity_type)}`}>
                            {activity.activity_type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-neutral-400 text-sm">by</span>
                          <span className="text-neutral-300 text-sm font-medium">
                            {activity.user_name || activity.user_email || 'Unknown User'}
                          </span>
                        </div>
                        <p className="text-neutral-200 font-medium">{activity.description}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-neutral-400 text-sm font-medium">
                          {formatRelativeTime(activity.created_at)}
                        </div>
                        <div className="text-neutral-500 text-xs">
                          {formatAbsoluteTime(activity.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                          className="text-sm text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                        >
                          {expandedId === activity.id ? '▼' : '▶'} Show Details
                        </button>
                        {expandedId === activity.id && (
                          <div className="mt-2 p-3 bg-neutral-800 rounded-lg">
                            <pre className="text-xs text-neutral-300 overflow-x-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && activities.length > 0 && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-400">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-lg font-medium transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

