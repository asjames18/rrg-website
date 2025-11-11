/**
 * User Activity Component
 * Shows user's activity, engagement stats, and recent actions
 */
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase-browser';

interface ActivityItem {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: any;
}

interface ActivityStats {
  postsRead: number;
  videosWatched: number;
  favoritesSaved: number;
  totalTimeSpent: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function UserActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    postsRead: 0,
    videosWatched: 0,
    favoritesSaved: 0,
    totalTimeSpent: 0
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchActivityData();
  }, [pagination.page, filterType]);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      // Build query parameters
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      });

      if (filterType && filterType !== 'all') {
        params.append('type', filterType);
      }

      // Fetch activity data
      const response = await fetch(`/api/user/activity?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setActivities(data.activities || []);
        setStats(data.summary || stats);
        setPagination(prev => ({
          ...prev,
          ...data.pagination
        }));
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return '🔐';
      case 'post_read':
        return '📖';
      case 'video_watched':
        return '🎥';
      case 'favorite_saved':
        return '⭐';
      case 'profile_updated':
        return '✏️';
      case 'preferences_updated':
        return '⚙️';
      case 'password_changed':
        return '🔒';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-500';
      case 'post_read':
        return 'bg-blue-500';
      case 'video_watched':
        return 'bg-purple-500';
      case 'favorite_saved':
        return 'bg-yellow-500';
      case 'profile_updated':
      case 'preferences_updated':
        return 'bg-amber-500';
      case 'password_changed':
        return 'bg-red-500';
      default:
        return 'bg-neutral-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const nextPage = () => {
    if (pagination.hasMore) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-neutral-800 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-100 mb-1">{stats.postsRead}</div>
          <div className="text-sm text-neutral-400">Posts Read</div>
        </div>
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-100 mb-1">{stats.videosWatched}</div>
          <div className="text-sm text-neutral-400">Videos Watched</div>
        </div>
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-100 mb-1">{stats.favoritesSaved}</div>
          <div className="text-sm text-neutral-400">Favorites</div>
        </div>
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-100 mb-1">{stats.totalTimeSpent}m</div>
          <div className="text-sm text-neutral-400">Time Spent</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-neutral-400 font-medium">Filter by:</label>
        <select 
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Activity</option>
          <option value="post_read">Posts Read</option>
          <option value="video_watched">Videos Watched</option>
          <option value="favorite_saved">Favorites</option>
          <option value="profile_updated">Profile Updates</option>
          <option value="login">Logins</option>
        </select>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold text-amber-100 mb-4 font-display">Recent Activity</h3>
        <div className="space-y-3">
          {activities.length > 0 ? (
            <>
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-200 font-medium truncate">{activity.description}</p>
                    <p className="text-sm text-neutral-400">{formatTimestamp(activity.created_at)}</p>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={prevPage}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors text-sm"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-neutral-400">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={!pagination.hasMore}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg font-medium mb-2">No activity yet</p>
              <p className="text-sm">Start exploring content to see your activity here</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-amber-100 mb-4 font-display">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/blog" 
            className="flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:bg-neutral-800/70 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">📖</span>
            </div>
            <div>
              <div className="font-medium text-neutral-200">Read Latest Posts</div>
              <div className="text-sm text-neutral-400">Explore our teachings</div>
            </div>
          </a>
          
          <a 
            href="/videos" 
            className="flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:bg-neutral-800/70 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🎥</span>
            </div>
            <div>
              <div className="font-medium text-neutral-200">Watch Videos</div>
              <div className="text-sm text-neutral-400">Learn from our teachings</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
