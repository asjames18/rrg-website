/**
 * Content Analytics Component
 * Displays analytics data for content including views, trending items, and engagement metrics
 */
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendingContent {
  content_id: string;
  content_type: string;
  total_views: number;
  total_visitors: number;
  avg_engagement: number;
}

export default function ContentAnalytics() {
  const [viewsByType, setViewsByType] = useState<Record<string, number>>({});
  const [trending, setTrending] = useState<TrendingContent[]>([]);
  const [viewsOverTime, setViewsOverTime] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[ContentAnalytics] Fetching analytics from /api/admin/analytics/overview?days=' + days);
      const response = await fetch(`/api/admin/analytics/overview?days=${days}`);
      const data = await response.json();

      console.log('[ContentAnalytics] Response:', response.status, data);

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to fetch analytics';
        console.error('[ContentAnalytics] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      const viewsByTypeData = data.views_by_type || {};
      const trendingData = data.trending_content || [];
      const viewsOverTimeData = data.views_over_time || {};
      
      console.log('[ContentAnalytics] Setting data:', {
        viewsByType: Object.keys(viewsByTypeData).length,
        trending: trendingData.length,
        viewsOverTime: Object.keys(viewsOverTimeData).length
      });
      
      setViewsByType(viewsByTypeData);
      setTrending(trendingData);
      setViewsOverTime(viewsOverTimeData);
      
      console.log('[ContentAnalytics] Analytics loaded successfully');
      console.log('[ContentAnalytics] Views by type:', viewsByTypeData);
      console.log('[ContentAnalytics] Trending:', trendingData);
      console.log('[ContentAnalytics] Views over time:', viewsOverTimeData);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load analytics';
      console.error('[ContentAnalytics] Exception:', error);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const viewsByTypeData = Object.entries(viewsByType || {}).map(([type, views]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    views: typeof views === 'number' ? views : 0
  }));

  const viewsTimeData = Object.entries(viewsOverTime || {}).map(([date, views]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: typeof views === 'number' ? views : 0
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  console.log('[ContentAnalytics] Processed data:', {
    viewsByTypeData: viewsByTypeData.length,
    viewsTimeData: viewsTimeData.length,
    trending: trending.length
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return '📝';
      case 'video': return '🎥';
      case 'book': return '📖';
      case 'music': return '🎵';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-neutral-800 rounded-xl"></div>
        <div className="h-96 bg-neutral-800 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">{error}</div>
        <button
          onClick={fetchAnalytics}
          className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-100">Content Analytics</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === d
                  ? 'bg-amber-700 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Views by Type */}
      <div>
        <h3 className="text-xl font-bold text-amber-100 mb-4">Views by Content Type</h3>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          {viewsByTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsByTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    border: '1px solid #404040',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="views" fill="#F59E0B" name="Total Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No view data available</p>
                <p className="text-sm mt-2">Analytics will appear once content views are tracked</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Views Over Time */}
      <div>
        <h3 className="text-xl font-bold text-amber-100 mb-4">Views Over Time</h3>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          {viewsTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    border: '1px solid #404040',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#A855F7" 
                  strokeWidth={2}
                  name="Views"
                  dot={{ fill: '#A855F7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>No view data over time</p>
                <p className="text-sm mt-2">Time-based analytics will appear once tracking is enabled</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trending Content */}
      <div>
        <h3 className="text-xl font-bold text-amber-100 mb-4">Trending Content (Last 7 Days)</h3>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
          {trending && trending.length > 0 ? (
            trending.map((item, index) => (
              <div key={`${item.content_type}-${item.content_id}`} className="p-4 hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 text-3xl">{getTypeIcon(item.content_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-400">#{index + 1}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
                        {item.content_type}
                      </span>
                    </div>
                    <div className="text-neutral-200 font-medium mt-1">
                      {(item as any).title || `Content ID: ${item.content_id}`}
                    </div>
                    {!((item as any).title) && (
                      <div className="text-neutral-400 text-xs mt-1">ID: {item.content_id}</div>
                    )}
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-100">{item.total_views}</div>
                      <div className="text-neutral-500 text-xs">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{item.total_visitors}</div>
                      <div className="text-neutral-500 text-xs">Visitors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{Math.round(item.avg_engagement)}s</div>
                      <div className="text-neutral-500 text-xs">Avg Time</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-neutral-400">
              <div className="text-4xl mb-4">📊</div>
              <p>No trending content yet</p>
              <p className="text-sm mt-2">Content views will appear here once tracked</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📊</div>
            <div className="text-amber-400 text-sm font-medium">Total</div>
          </div>
          <div className="text-3xl font-bold text-neutral-100 mb-1">
            {Object.values(viewsByType).reduce((sum, views) => sum + views, 0) || 
             Object.keys(viewsByType).length}
          </div>
          <div className="text-sm text-neutral-400">
            {Object.values(viewsByType).reduce((sum, views) => sum + views, 0) > 0 
              ? 'Total Views' 
              : 'Content Types'}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🔥</div>
            <div className="text-red-400 text-sm font-medium">Trending</div>
          </div>
          <div className="text-3xl font-bold text-neutral-100 mb-1">
            {trending.length}
          </div>
          <div className="text-sm text-neutral-400">
            {trending.length > 0 ? 'Trending Items' : 'No trending content'}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📈</div>
            <div className="text-green-400 text-sm font-medium">Average</div>
          </div>
          <div className="text-3xl font-bold text-neutral-100 mb-1">
            {trending.length > 0 && trending.some(item => item.avg_engagement > 0)
              ? Math.round(trending.reduce((sum, item) => sum + item.avg_engagement, 0) / trending.length)
              : 0}s
          </div>
          <div className="text-sm text-neutral-400">Engagement Time</div>
        </div>
      </div>
    </div>
  );
}

