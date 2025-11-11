/**
 * Workflow Manager Component
 * Displays and manages workflow state for content
 */
import { useState, useEffect } from 'react';

interface WorkflowManagerProps {
  contentId: string;
  contentType: string;
  currentState?: string;
  onStateChange?: (newState: string) => void;
}

type WorkflowState = 'draft' | 'review' | 'published' | 'archived';

export default function WorkflowManager({ contentId, contentType, currentState = 'draft', onStateChange }: WorkflowManagerProps) {
  const [state, setState] = useState<WorkflowState>(currentState as WorkflowState);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState(currentState as WorkflowState);
  }, [currentState]);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/admin/workflow/history/${contentId}?type=${contentType}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch history');
      }

      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch workflow history:', error);
    }
  };

  const handleStateChange = async (newState: WorkflowState) => {
    if (newState === state) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/workflow/change-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: contentId,
          content_type: contentType,
          new_state: newState,
          comment: comment || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change workflow state');
      }

      setState(newState);
      setComment('');
      
      if (onStateChange) {
        onStateChange(newState);
      }

      // Refresh history
      fetchHistory();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to change state');
    } finally {
      setLoading(false);
    }
  };

  const getStateColor = (workflowState: string) => {
    switch (workflowState) {
      case 'draft': return 'bg-gray-700 text-gray-300';
      case 'review': return 'bg-yellow-700 text-yellow-300';
      case 'published': return 'bg-green-700 text-green-300';
      case 'archived': return 'bg-red-700 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStateIcon = (workflowState: string) => {
    switch (workflowState) {
      case 'draft': return '✏️';
      case 'review': return '👀';
      case 'published': return '✅';
      case 'archived': return '📦';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current State Display */}
      <div className="flex items-center gap-4">
        <span className="text-neutral-400 font-medium">Workflow Status:</span>
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${getStateColor(state)}`}>
          <span>{getStateIcon(state)}</span>
          <span className="capitalize">{state}</span>
        </span>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
        >
          {showHistory ? 'Hide History' : 'View History'}
        </button>
      </div>

      {/* State Change Actions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-amber-100 mb-4">Change Workflow State</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => handleStateChange('draft')}
            disabled={loading || state === 'draft'}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              state === 'draft'
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            <div className="text-2xl mb-1">✏️</div>
            <div className="text-sm">Draft</div>
          </button>

          <button
            onClick={() => handleStateChange('review')}
            disabled={loading || state === 'review'}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              state === 'review'
                ? 'bg-yellow-700 text-yellow-300 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-yellow-700 text-yellow-400 hover:text-yellow-100'
            }`}
          >
            <div className="text-2xl mb-1">👀</div>
            <div className="text-sm">Review</div>
          </button>

          <button
            onClick={() => handleStateChange('published')}
            disabled={loading || state === 'published'}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              state === 'published'
                ? 'bg-green-700 text-green-300 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-green-700 text-green-400 hover:text-green-100'
            }`}
          >
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm">Publish</div>
          </button>

          <button
            onClick={() => handleStateChange('archived')}
            disabled={loading || state === 'archived'}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              state === 'archived'
                ? 'bg-red-700 text-red-300 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-red-700 text-red-400 hover:text-red-100'
            }`}
          >
            <div className="text-2xl mb-1">📦</div>
            <div className="text-sm">Archive</div>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment about this workflow change..."
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={2}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm mt-2">{error}</div>
        )}

        {loading && (
          <div className="text-amber-400 text-sm mt-2">Updating workflow state...</div>
        )}
      </div>

      {/* History Timeline */}
      {showHistory && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-amber-100 mb-4">Workflow History</h4>
          
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex gap-4 pb-4 border-b border-neutral-800 last:border-0">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStateColor(entry.to_state)}`}>
                      {getStateIcon(entry.to_state)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-neutral-200">
                        {entry.from_state ? `${entry.from_state} → ${entry.to_state}` : entry.to_state}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                    {entry.profiles && (
                      <div className="text-sm text-neutral-400 mb-1">
                        by {entry.profiles.display_name || entry.profiles.email}
                      </div>
                    )}
                    {entry.comment && (
                      <div className="text-sm text-neutral-400 mt-2 italic">
                        "{entry.comment}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              No workflow history available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

