/**
 * Bulk Actions Bar Component
 * Displays and manages bulk actions for selected content
 */
import { useState } from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  contentType: string;
  onAction: (action: string, value?: string) => Promise<void>;
  onClearSelection: () => void;
}

export default function BulkActionsBar({ selectedCount, contentType, onAction, onClearSelection }: BulkActionsBarProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (selectedCount === 0) return null;

  const handleAction = async (actionType: string, value?: string) => {
    if (actionType === 'delete' && !showConfirm) {
      setAction(actionType);
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    try {
      await onAction(actionType, value);
      setShowConfirm(false);
      setAction('');
      setTagValue('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-amber-700 border-t border-amber-600 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClearSelection}
                className="text-amber-100 hover:text-white transition-colors"
                disabled={loading}
              >
                ✕
              </button>
              <span className="text-amber-100 font-semibold">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Workflow State Change */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('change_workflow', 'draft')}
                  disabled={loading}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Set to Draft
                </button>
                <button
                  onClick={() => handleAction('change_workflow', 'review')}
                  disabled={loading}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Send to Review
                </button>
                <button
                  onClick={() => handleAction('change_workflow', 'published')}
                  disabled={loading}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleAction('change_workflow', 'archived')}
                  disabled={loading}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Archive
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleAction('delete')}
                disabled={loading}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl max-w-md w-full p-6 border border-neutral-800">
            <h3 className="text-xl font-bold text-amber-100 mb-4">Confirm Delete</h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete {selectedCount} {contentType} item{selectedCount !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setAction('');
                }}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('delete')}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

