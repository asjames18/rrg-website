/**
 * Enhanced User Management Component
 * For admins to view and manage users with search, filters, pagination, and bulk actions
 */
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase-browser';
import UserDetailModal from './admin/UserDetailModal';
import BulkActionBar from './admin/BulkActionBar';

interface User {
  id: string;
  email: string;
  display_name?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'suspended' | 'deleted';
  created_at: string;
  last_login?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [sortBy, setSortBy] = useState('created_at');
  
  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

  // Selection
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Modal
  const [detailModalUser, setDetailModalUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter, statusFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sort: sortBy
      });

      if (search) params.append('search', search);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users || []);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === users.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
      setSelectAll(false);
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
      setSelectAll(true);
    }
  };

  const handleBulkAction = async (action: string, params?: any) => {
    try {
      const response = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userIds: Array.from(selectedUsers),
          ...params
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bulk action failed');
      }

      // Clear selection and refresh
      setSelectedUsers(new Set());
      setSelectAll(false);
      await fetchUsers();
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/users/export?${params.toString()}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Export failed');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/30 text-green-200 border-green-700';
      case 'suspended': return 'bg-yellow-900/30 text-yellow-200 border-yellow-700';
      case 'deleted': return 'bg-red-900/30 text-red-200 border-red-700';
      default: return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  if (loading && users.length === 0) {
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-amber-100">User Management</h3>
        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded text-sm transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleExport}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded text-sm transition-colors"
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="col-span-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* Bulk Action Bar */}
      {selectedUsers.size > 0 && (
        <BulkActionBar
          selectedCount={selectedUsers.size}
          onBulkAction={handleBulkAction}
          onClear={() => {
            setSelectedUsers(new Set());
            setSelectAll(false);
          }}
        />
      )}

      {error && (
        <div className="p-3 rounded mb-4 bg-red-900/30 border border-red-700 text-red-200">
          {error}
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-neutral-400">
        {pagination.total} total user{pagination.total !== 1 ? 's' : ''}
        {selectedUsers.size > 0 && ` • ${selectedUsers.size} selected`}
      </div>

      {/* User List */}
      <div className="space-y-2">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-neutral-800/50 rounded text-sm font-semibold text-neutral-400">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-neutral-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
            />
          </div>
          <div className="col-span-4">Email / Name</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* User Rows */}
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-800/80 transition-colors">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedUsers.has(user.id)}
                onChange={() => toggleSelectUser(user.id)}
                className="w-4 h-4 rounded border-neutral-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
              />
            </div>
            
            <div className="col-span-4">
              <div className="font-medium text-neutral-200">{user.email}</div>
              {user.display_name && (
                <div className="text-sm text-neutral-400">{user.display_name}</div>
              )}
            </div>

            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 rounded border ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>

            <div className="col-span-2 text-sm text-neutral-400">
              {new Date(user.created_at).toLocaleDateString()}
            </div>

            <div className="col-span-1">
              <button
                onClick={() => setDetailModalUser(user)}
                className="text-amber-500 hover:text-amber-400 text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && !loading && (
          <div className="text-center py-8 text-neutral-400">
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-neutral-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={!pagination.hasMore}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      {detailModalUser && (
        <UserDetailModal
          user={detailModalUser}
          onClose={() => setDetailModalUser(null)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
}
