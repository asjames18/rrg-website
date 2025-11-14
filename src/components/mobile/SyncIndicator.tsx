import { useState, useEffect } from 'react';

interface PendingSync {
  id: string;
  type: string;
  timestamp: number;
}

export default function SyncIndicator() {
  const [pendingSyncs, setPendingSyncs] = useState<PendingSync[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check for pending syncs in IndexedDB or localStorage
    loadPendingSyncs();

    // Listen for sync events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'sync-progress') {
          setIsSyncing(true);
          setShowIndicator(true);
        } else if (event.data.type === 'sync-complete') {
          setIsSyncing(false);
          loadPendingSyncs();

          // Auto-hide after success
          setTimeout(() => {
            setShowIndicator(false);
          }, 3000);
        }
      });
    }
  }, []);

  const loadPendingSyncs = async () => {
    // TODO: Load from IndexedDB
    // For now, use localStorage as a fallback
    try {
      const stored = localStorage.getItem('pending-syncs');
      if (stored) {
        const syncs = JSON.parse(stored);
        setPendingSyncs(syncs);
        setShowIndicator(syncs.length > 0);
      } else {
        setPendingSyncs([]);
        setShowIndicator(false);
      }
    } catch (error) {
      console.error('[SyncIndicator] Failed to load pending syncs:', error);
    }
  };

  const triggerSync = async () => {
    if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
      console.warn('[SyncIndicator] Background Sync not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-forms');
      setIsSyncing(true);
      console.log('[SyncIndicator] Sync triggered');
    } catch (error) {
      console.error('[SyncIndicator] Sync failed:', error);
    }
  };

  if (!showIndicator && pendingSyncs.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-full shadow-lg px-4 py-2 flex items-center gap-2 animate-slideUp">
        {isSyncing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-neutral-300">Syncing...</span>
          </>
        ) : pendingSyncs.length > 0 ? (
          <>
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-neutral-300">
              {pendingSyncs.length} pending
            </span>
            <button
              onClick={triggerSync}
              className="ml-2 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-full transition-colors"
            >
              Sync Now
            </button>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-neutral-300">All synced</span>
          </>
        )}
      </div>
    </div>
  );
}

