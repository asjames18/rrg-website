import { useState, useEffect } from 'react';

interface Subscription {
  id: string;
  user_id: string;
  endpoint: string;
  created_at: string;
  user_email?: string;
}

interface NotificationStats {
  total_subscriptions: number;
  active_subscriptions: number;
  notifications_sent: number;
}

export default function PushNotifications() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    body: '',
    url: '',
    requireInteraction: false
  });

  useEffect(() => {
    loadStats();
    loadSubscriptions();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/push/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('[PushNotifications] Failed to load stats:', error);
    }
  };

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/push/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('[PushNotifications] Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.body) {
      alert('Please fill in title and body');
      return;
    }

    try {
      setSending(true);
      const response = await fetch('/api/admin/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: notificationForm.title,
          body: notificationForm.body,
          url: notificationForm.url || '/',
          requireInteraction: notificationForm.requireInteraction
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Notification sent to ${result.sent_count} subscribers!`);
        setNotificationForm({ title: '', body: '', url: '', requireInteraction: false });
        loadStats();
      } else {
        const error = await response.json();
        alert(`❌ Failed to send: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[PushNotifications] Send failed:', error);
      alert('❌ Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-amber-100 mb-2">Push Notifications</h2>
        <p className="text-neutral-400">Send push notifications to subscribed users</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Total Subscriptions</span>
              <span className="text-2xl">📱</span>
            </div>
            <div className="text-3xl font-bold text-amber-100">{stats.total_subscriptions}</div>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Active Subscriptions</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.active_subscriptions}</div>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Notifications Sent</span>
              <span className="text-2xl">📤</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.notifications_sent}</div>
          </div>
        </div>
      )}

      {/* Send Notification Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-amber-100 mb-4">Send Notification</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={notificationForm.title}
              onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
              placeholder="e.g., New Teaching Available"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Message *
            </label>
            <textarea
              value={notificationForm.body}
              onChange={(e) => setNotificationForm({ ...notificationForm, body: e.target.value })}
              placeholder="e.g., Check out our latest teaching on spiritual warfare"
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Link URL (optional)
            </label>
            <input
              type="url"
              value={notificationForm.url}
              onChange={(e) => setNotificationForm({ ...notificationForm, url: e.target.value })}
              placeholder="e.g., /blog/new-post or https://..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-neutral-500 mt-1">Where users will be taken when they click the notification</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requireInteraction"
              checked={notificationForm.requireInteraction}
              onChange={(e) => setNotificationForm({ ...notificationForm, requireInteraction: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-600 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="requireInteraction" className="text-sm text-neutral-300">
              Require user interaction (notification stays until clicked)
            </label>
          </div>

          <button
            onClick={sendNotification}
            disabled={sending || !notificationForm.title || !notificationForm.body}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              `📤 Send to ${stats?.active_subscriptions || 0} Subscribers`
            )}
          </button>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-100">Subscriptions</h3>
          <button
            onClick={loadSubscriptions}
            className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-neutral-400">Loading subscriptions...</div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <p className="text-lg mb-2">No subscriptions yet</p>
            <p className="text-sm">Users need to subscribe to push notifications first</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Endpoint</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="py-3 px-4 text-neutral-300">
                      {sub.user_email || sub.user_id.substring(0, 8) + '...'}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-sm font-mono">
                      {sub.endpoint.substring(0, 50)}...
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-sm">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

