/**
 * User Detail Modal Component
 * Shows detailed information about a user with management options
 */
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  display_name?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'suspended' | 'deleted';
  created_at: string;
  last_login?: string;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserDetailModal({ user, onClose, onUpdate }: UserDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    role: user.role,
    status: user.status,
    display_name: user.display_name || ''
  });

  useEffect(() => {
    fetchUserDetails();
  }, [user.id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setActivities(data.activities || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Update failed');
      }

      setEditing(false);
      onUpdate();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleDelete = async (permanent: boolean) => {
    const confirmMsg = permanent 
      ? 'Are you sure you want to PERMANENTLY delete this user? This cannot be undone.'
      : 'Are you sure you want to soft delete this user? They can be restored later.';
    
    if (!confirm(confirmMsg)) return;

    try {
      const url = permanent 
        ? `/api/admin/users/${user.id}?permanent=true`
        : `/api/admin/users/${user.id}`;

      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      onUpdate();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-amber-100">User Details</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div>
            <h4 className="text-lg font-bold text-neutral-200 mb-4">User Information</h4>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-sm text-neutral-400">Email</label>
                <div className="text-neutral-200">{user.email}</div>
              </div>
              
              <div>
                <label className="text-sm text-neutral-400">Display Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <div className="text-neutral-200">{user.display_name || 'Not set'}</div>
                )}
              </div>

              <div>
                <label className="text-sm text-neutral-400">Role</label>
                {editing ? (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <div className="text-neutral-200 capitalize">{user.role}</div>
                )}
              </div>

              <div>
                <label className="text-sm text-neutral-400">Status</label>
                {editing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="deleted">Deleted</option>
                  </select>
                ) : (
                  <div className="text-neutral-200 capitalize">{user.status}</div>
                )}
              </div>

              <div>
                <label className="text-sm text-neutral-400">Member Since</label>
                <div className="text-neutral-200">{new Date(user.created_at).toLocaleDateString()}</div>
              </div>

              {user.last_login && (
                <div>
                  <label className="text-sm text-neutral-400">Last Login</label>
                  <div className="text-neutral-200">{formatTimestamp(user.last_login)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div>
              <h4 className="text-lg font-bold text-neutral-200 mb-4">Activity Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-100">{stats.totalActivities || 0}</div>
                  <div className="text-sm text-neutral-400">Total Actions</div>
                </div>
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-100">{stats.loginCount || 0}</div>
                  <div className="text-sm text-neutral-400">Logins</div>
                </div>
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-100">{stats.postsRead || 0}</div>
                  <div className="text-sm text-neutral-400">Posts Read</div>
                </div>
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-100">{stats.videosWatched || 0}</div>
                  <div className="text-sm text-neutral-400">Videos Watched</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h4 className="text-lg font-bold text-neutral-200 mb-4">Recent Activity</h4>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-neutral-400">Loading...</div>
              ) : activities.length > 0 ? (
                <div className="divide-y divide-neutral-700">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-3">
                      <div className="text-sm text-neutral-300">{activity.description}</div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {formatTimestamp(activity.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-neutral-400">No activity yet</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-800">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors"
                >
                  Edit User
                </button>
                <button
                  onClick={() => handleDelete(false)}
                  className="flex-1 bg-yellow-900/50 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-200 py-3 rounded-lg transition-colors"
                >
                  Soft Delete
                </button>
                <button
                  onClick={() => handleDelete(true)}
                  className="flex-1 bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-200 py-3 rounded-lg transition-colors"
                >
                  Permanent Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

