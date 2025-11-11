/**
 * Admin Dashboard Component
 * Main dashboard with stats, charts, activity feed, and quick actions
 */
import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import DashboardCharts from './DashboardCharts';

interface DashboardStats {
  total_content: number;
  total_users: number;
  total_activity_30d: number;
  content_by_type: {
    blog: number;
    videos: number;
    books: number;
    music: number;
  };
  recent_activity: Array<{
    id: string;
    activity_type: string;
    description: string;
    created_at: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contentGrowth, setContentGrowth] = useState<Record<string, number>>({});
  const [userGrowth, setUserGrowth] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Dashboard] Fetching stats from /api/admin/dashboard/stats');
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();

      console.log('[Dashboard] Response status:', response.status);
      console.log('[Dashboard] Response data:', data);

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to fetch dashboard stats';
        console.error('[Dashboard] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      setStats(data.stats);
      setContentGrowth(data.content_growth || {});
      setUserGrowth(data.user_growth || {});
      console.log('[Dashboard] Stats loaded successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load dashboard';
      console.error('[Dashboard] Failed to fetch stats:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content_created': return '📝';
      case 'content_published': return '✅';
      case 'user_signup': return '👤';
      case 'password_changed': return '🔒';
      case 'preferences_updated': return '⚙️';
      case 'admin_user_updated': return '👥';
      case 'admin_bulk_action': return '⚡';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-neutral-800 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-neutral-800 rounded-xl mb-8"></div>
          <div className="h-96 bg-neutral-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">{error || 'Failed to load dashboard'}</div>
        <button
          onClick={fetchDashboardStats}
          className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div>
        <h2 className="text-2xl font-bold text-amber-100 mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="📚"
            label="Total Content"
            value={stats.total_content}
            color="blue"
          />
          <StatCard
            icon="👥"
            label="Total Users"
            value={stats.total_users}
            color="green"
          />
          <StatCard
            icon="⚡"
            label="Activity (30d)"
            value={stats.total_activity_30d}
            color="purple"
          />
          <StatCard
            icon="✅"
            label="System Status"
            value="Healthy"
            color="green"
          />
        </div>
      </div>

      {/* Content by Type */}
      <div>
        <h2 className="text-2xl font-bold text-amber-100 mb-6">Content by Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="📝"
            label="Blog Posts"
            value={stats.content_by_type.blog}
            color="amber"
          />
          <StatCard
            icon="🎥"
            label="Videos"
            value={stats.content_by_type.videos}
            color="purple"
          />
          <StatCard
            icon="📖"
            label="Books"
            value={stats.content_by_type.books}
            color="blue"
          />
          <StatCard
            icon="🎵"
            label="Music"
            value={stats.content_by_type.music}
            color="green"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="text-2xl font-bold text-amber-100 mb-6">Analytics Charts</h2>
        <DashboardCharts
          contentGrowth={contentGrowth}
          userGrowth={userGrowth}
          contentByType={stats.content_by_type}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-amber-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.hash = 'content'}
            className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-xl transition-colors text-left"
          >
            <div className="text-3xl">📝</div>
            <div>
              <div className="font-semibold text-neutral-200">Create Blog Post</div>
              <div className="text-sm text-neutral-400">Write new content</div>
            </div>
          </button>

          <button
            onClick={() => window.location.hash = 'content'}
            className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-purple-700 rounded-xl transition-colors text-left"
          >
            <div className="text-3xl">🎥</div>
            <div>
              <div className="font-semibold text-neutral-200">Upload Video</div>
              <div className="text-sm text-neutral-400">Add new video</div>
            </div>
          </button>

          <button
            onClick={() => window.location.hash = 'content'}
            className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-blue-700 rounded-xl transition-colors text-left"
          >
            <div className="text-3xl">📖</div>
            <div>
              <div className="font-semibold text-neutral-200">Add Book</div>
              <div className="text-sm text-neutral-400">Recommend a book</div>
            </div>
          </button>

          <button
            onClick={() => window.location.hash = 'users'}
            className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-green-700 rounded-xl transition-colors text-left"
          >
            <div className="text-3xl">👥</div>
            <div>
              <div className="font-semibold text-neutral-200">Manage Users</div>
              <div className="text-sm text-neutral-400">User management</div>
            </div>
          </button>

          <button
            onClick={() => window.location.hash = 'analytics'}
            className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-xl transition-colors text-left"
          >
            <div className="text-3xl">📊</div>
            <div>
              <div className="font-semibold text-neutral-200">View Analytics</div>
              <div className="text-sm text-neutral-400">Content insights</div>
            </div>
          </button>

          <button
            onClick={() => window.location.hash = 'settings'}
            className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-red-700 rounded-xl transition-colors text-left"
          >
            <div className="text-3xl">⚙️</div>
            <div>
              <div className="font-semibold text-neutral-200">System Settings</div>
              <div className="text-sm text-neutral-400">Configure site</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-100">Recent Activity</h2>
          <button
            onClick={fetchDashboardStats}
            className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
          {stats.recent_activity && stats.recent_activity.length > 0 ? (
            stats.recent_activity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-neutral-200 font-medium">{activity.description}</div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {formatTimestamp(activity.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-neutral-400">
              <div className="text-4xl mb-4">📊</div>
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div>
        <h2 className="text-2xl font-bold text-amber-100 mb-6">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400">Database</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="text-2xl font-bold text-neutral-100">Online</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400">Storage</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="text-2xl font-bold text-neutral-100">Available</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400">API</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="text-2xl font-bold text-neutral-100">Normal</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400">Errors (24h)</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="text-2xl font-bold text-neutral-100">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

