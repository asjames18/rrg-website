/**
 * User Activity Component
 * Shows user's activity, engagement stats, and recent actions
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ActivityItem {
  id: string;
  type: 'login' | 'post_read' | 'video_watched' | 'favorite_saved' | 'profile_updated';
  description: string;
  timestamp: string;
  metadata?: any;
}

interface ActivityStats {
  postsRead: number;
  videosWatched: number;
  favoritesSaved: number;
  totalTimeSpent: number;
}

export default function UserActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    postsRead: 0,
    videosWatched: 0,
    favoritesSaved: 0,
    totalTimeSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll use mock data since we don't have activity tracking set up yet
      // In a real app, you'd fetch from a user_activities table
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'login',
          description: 'Signed in to Real & Raw Gospel',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'profile_updated',
          description: 'Updated profile information',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: '3',
          type: 'post_read',
          description: 'Read "Keep the Feast, Dump the Yeast"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: '4',
          type: 'video_watched',
          description: 'Watched "Shut the Doorways - Warfare 101"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        }
      ];

      setActivities(mockActivities);
      setStats({
        postsRead: 1,
        videosWatched: 1,
        favoritesSaved: 0,
        totalTimeSpent: 45 // minutes
      });
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
        return 'bg-amber-500';
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
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-700 rounded w-1/3 mb-4"></div>
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

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold text-amber-100 mb-4 font-display">Recent Activity</h3>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-200 font-medium">{activity.description}</p>
                  <p className="text-sm text-neutral-400">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <div className="text-4xl mb-4">📝</div>
              <p>No activity yet</p>
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
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📖</span>
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
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🎥</span>
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

