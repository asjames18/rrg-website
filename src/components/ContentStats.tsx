/**
 * Content Statistics Component
 * Real-time content analytics for admin dashboard
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ContentStats {
  blogPosts: number;
  videos: number;
  books: number;
  music: number;
  totalUsers: number;
  lastUpdated: string;
}

export default function ContentStats() {
  const [stats, setStats] = useState<ContentStats>({
    blogPosts: 0,
    videos: 0,
    books: 0,
    music: 0,
    totalUsers: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch content counts from collections
      const [blogResult, videoResult, bookResult, musicResult, userResult] = await Promise.all([
        fetch('/api/content-stats?type=blog'),
        fetch('/api/content-stats?type=videos'),
        fetch('/api/content-stats?type=books'),
        fetch('/api/content-stats?type=music'),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      const blogData = await blogResult.json();
      const videoData = await videoResult.json();
      const bookData = await bookResult.json();
      const musicData = await musicResult.json();

      setStats({
        blogPosts: blogData.count || 0,
        videos: videoData.count || 0,
        books: bookData.count || 0,
        music: musicData.count || 0,
        totalUsers: userResult.count || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-amber-100">Content Statistics</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded text-sm transition-colors"
          >
            Refresh
          </button>
          <span className="text-xs text-neutral-400">
            Updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.blogPosts}</div>
          <div className="text-sm text-neutral-400">Blog Posts</div>
        </div>
        
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{stats.videos}</div>
          <div className="text-sm text-neutral-400">Videos</div>
        </div>
        
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{stats.books}</div>
          <div className="text-sm text-neutral-400">Books</div>
        </div>
        
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-400 mb-1">{stats.music}</div>
          <div className="text-sm text-neutral-400">Music</div>
        </div>
        
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{stats.totalUsers}</div>
          <div className="text-sm text-neutral-400">Users</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-700">
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <span>Total Content: {stats.blogPosts + stats.videos + stats.books + stats.music}</span>
          <span>Auto-refresh: 30s</span>
        </div>
      </div>
    </div>
  );
}
