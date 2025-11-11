/**
 * Dashboard Charts Component
 * Charts for content analytics and user growth
 */
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartsProps {
  contentGrowth: Record<string, number>;
  userGrowth: Record<string, number>;
  contentByType: {
    blog: number;
    videos: number;
    books: number;
    music: number;
  };
}

export default function DashboardCharts({ contentGrowth, userGrowth, contentByType }: ChartsProps) {
  // Prepare content growth data for line chart
  const contentGrowthData = Object.entries(contentGrowth || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    content: count
  }));

  // Prepare user growth data for line chart
  const userGrowthData = Object.entries(userGrowth || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: count
  }));

  // Prepare content by type data for pie/bar chart
  const contentTypeData = [
    { name: 'Blog Posts', value: contentByType.blog, color: '#F59E0B' },
    { name: 'Videos', value: contentByType.videos, color: '#A855F7' },
    { name: 'Books', value: contentByType.books, color: '#3B82F6' },
    { name: 'Music', value: contentByType.music, color: '#10B981' }
  ];

  const COLORS = ['#F59E0B', '#A855F7', '#3B82F6', '#10B981'];

  return (
    <div className="space-y-8">
      {/* Content Published Over Time */}
      {contentGrowthData.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-amber-100 mb-4">Content Published (Last 30 Days)</h3>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={contentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    border: '1px solid #404040',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fbbf24' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="content" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Content Published"
                  dot={{ fill: '#F59E0B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Content by Type - Pie and Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h3 className="text-xl font-bold text-amber-100 mb-4">Content Distribution</h3>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    border: '1px solid #404040',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-xl font-bold text-amber-100 mb-4">Content by Type</h3>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentTypeData}>
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
                <Bar dataKey="value" name="Count">
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Growth Over Time */}
      {userGrowthData.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-amber-100 mb-4">User Growth (Last 30 Days)</h3>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    border: '1px solid #404040',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#10B981' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="New Users"
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

