/**
 * User Management Component
 * For admins to view and manage user roles
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      setPromoting(userId);
      setError(null);
      
      const response = await fetch('/api/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        // Show success message
        setError(`✅ User successfully promoted to ${newRole}`);
        setTimeout(() => setError(null), 3000);
      } else {
        throw new Error(result.error || 'Failed to promote user');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to promote user');
    } finally {
      setPromoting(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-900/30 text-red-200 border-red-700';
      case 'editor': return 'bg-amber-900/30 text-amber-200 border-amber-700';
      case 'viewer': return 'bg-neutral-800 text-neutral-300 border-neutral-700';
      default: return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-amber-100">User Management</h3>
        <button
          onClick={fetchUsers}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className={`p-3 rounded mb-4 ${
          error.startsWith('✅') 
            ? 'bg-green-900/30 border border-green-700 text-green-200'
            : 'bg-red-900/30 border border-red-700 text-red-200'
        }`}>
          {error}
        </div>
      )}

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-neutral-200 font-medium">{user.email}</span>
                  <span className={`text-xs px-2 py-1 rounded border ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-neutral-400">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  onChange={(e) => promoteUser(user.id, e.target.value as 'admin' | 'editor' | 'viewer')}
                  disabled={promoting === user.id}
                  className="bg-neutral-700 border border-neutral-600 text-neutral-200 text-sm px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                
                {promoting === user.id && (
                  <div className="text-xs text-neutral-400">Updating...</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-8 text-neutral-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
