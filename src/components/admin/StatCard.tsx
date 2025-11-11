/**
 * Stat Card Component
 * Displays a single statistic with icon, value, and label
 */
interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

export default function StatCard({ icon, label, value, trend, color = 'amber' }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-900/30 to-blue-800/30 border-blue-700/50',
    green: 'from-green-900/30 to-green-800/30 border-green-700/50',
    amber: 'from-amber-900/30 to-amber-800/30 border-amber-700/50',
    purple: 'from-purple-900/30 to-purple-800/30 border-purple-700/50',
    red: 'from-red-900/30 to-red-800/30 border-red-700/50'
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
    red: 'text-red-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`text-3xl ${iconColorClasses[color]}`}>{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-neutral-100 mb-1">{value}</div>
      <div className="text-sm text-neutral-400 font-medium">{label}</div>
    </div>
  );
}

