/**
 * Bulk Action Bar Component
 * Shows bulk action options when users are selected
 */
import { useState } from 'react';

interface BulkActionBarProps {
  selectedCount: number;
  onBulkAction: (action: string, params?: any) => Promise<any>;
  onClear: () => void;
}

export default function BulkActionBar({ selectedCount, onBulkAction, onClear }: BulkActionBarProps) {
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{action: string; params?: any} | null>(null);

  const handleAction = async (actionType: string, params?: any) => {
    // Show confirmation for destructive actions
    if (actionType === 'delete' || actionType === 'change_status') {
      setConfirmAction({ action: actionType, params });
      setShowConfirm(true);
      return;
    }

    await executeAction(actionType, params);
  };

  const executeAction = async (actionType: string, params?: any) => {
    try {
      setLoading(true);
      const result = await onBulkAction(actionType, params);
      
      // Show success message
      alert(`Success! ${result.affectedCount} user(s) updated.`);
      setAction('');
      setShowConfirm(false);
      setConfirmAction(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Bulk action failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmAndExecute = async () => {
    if (confirmAction) {
      await executeAction(confirmAction.action, confirmAction.params);
    }
  };

  return (
    <>
      <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-amber-200 font-semibold">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>

            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={loading}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              <option value="">Choose action...</option>
              <optgroup label="Role Changes">
                <option value="role_admin">Change to Admin</option>
                <option value="role_editor">Change to Editor</option>
                <option value="role_viewer">Change to Viewer</option>
              </optgroup>
              <optgroup label="Status Changes">
                <option value="status_active">Set as Active</option>
                <option value="status_suspended">Suspend</option>
                <option value="status_deleted">Soft Delete</option>
              </optgroup>
              <optgroup label="Delete">
                <option value="delete_soft">Soft Delete</option>
                <option value="delete_permanent">Permanent Delete</option>
              </optgroup>
            </select>

            <button
              onClick={() => {
                if (!action) return;
                
                const [category, value] = action.split('_');
                
                switch (category) {
                  case 'role':
                    handleAction('change_role', { role: value });
                    break;
                  case 'status':
                    handleAction('change_status', { status: value });
                    break;
                  case 'delete':
                    handleAction('delete', { permanent: value === 'permanent' });
                    break;
                }
              }}
              disabled={!action || loading}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
            >
              {loading ? 'Processing...' : 'Apply'}
            </button>
          </div>

          <button
            onClick={onClear}
            disabled={loading}
            className="text-neutral-400 hover:text-neutral-200 text-sm transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-amber-100 mb-4">Confirm Bulk Action</h3>
            
            <p className="text-neutral-300 mb-6">
              {confirmAction?.action === 'delete' 
                ? confirmAction.params?.permanent
                  ? `Are you sure you want to PERMANENTLY delete ${selectedCount} user(s)? This action cannot be undone.`
                  : `Are you sure you want to soft delete ${selectedCount} user(s)? They can be restored later.`
                : `Are you sure you want to update ${selectedCount} user(s)?`
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmAction(null);
                }}
                disabled={loading}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndExecute}
                disabled={loading}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

