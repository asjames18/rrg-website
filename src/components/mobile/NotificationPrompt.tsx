import { useState, useEffect } from 'react';
import { pushNotifications, type NotificationOptions } from '../../lib/push/notifications';

interface NotificationPromptProps {
  onAllow?: () => void;
  onDeny?: () => void;
  autoShow?: boolean;
  delay?: number;
}

export default function NotificationPrompt({
  onAllow,
  onDeny,
  autoShow = false,
  delay = 5000
}: NotificationPromptProps) {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check current permission
    const currentPermission = pushNotifications.getPermission();
    setPermission(currentPermission);

    // Don't show if already granted or denied
    if (currentPermission !== 'default') {
      return;
    }

    // Auto-show after delay
    if (autoShow) {
      const timer = setTimeout(() => {
        // Check if not dismissed in localStorage
        const dismissed = localStorage.getItem('notification-prompt-dismissed');
        if (!dismissed) {
          setShow(true);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, delay]);

  const handleAllow = async () => {
    setLoading(true);

    try {
      // Initialize push notifications
      await pushNotifications.initialize();

      // Request permission
      const newPermission = await pushNotifications.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        // Subscribe to push with VAPID key from environment
        const vapidKey = import.meta.env.PUBLIC_VAPID_PUBLIC_KEY;
        if (vapidKey) {
          await pushNotifications.subscribe(vapidKey);
          console.log('[NotificationPrompt] Subscribed successfully');
        } else {
          console.warn('[NotificationPrompt] VAPID public key not configured in environment variables');
        }

        console.log('[NotificationPrompt] Notifications enabled');
        onAllow?.();
        setShow(false);
      } else {
        console.log('[NotificationPrompt] Permission denied');
        onDeny?.();
        setShow(false);
      }
    } catch (error) {
      console.error('[NotificationPrompt] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = () => {
    localStorage.setItem('notification-prompt-dismissed', 'true');
    setShow(false);
    onDeny?.();
  };

  const handleLater = () => {
    setShow(false);
  };

  if (!show || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-amber-100 text-center mb-2">
          Stay Connected
        </h3>
        <p className="text-neutral-300 text-center mb-6">
          Get notified when new teachings, videos, and resources are available. You can change this anytime in settings.
        </p>

        {/* Benefits List */}
        <ul className="space-y-2 mb-6 text-sm text-neutral-400">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>New teachings and blog posts</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Live event reminders</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Important announcements</span>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAllow}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enabling...
              </span>
            ) : (
              'Allow Notifications'
            )}
          </button>
          
          <button
            onClick={handleLater}
            className="w-full bg-transparent border border-neutral-700 text-neutral-300 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-800 transition-all"
          >
            Maybe Later
          </button>
          
          <button
            onClick={handleDeny}
            className="w-full bg-transparent text-neutral-500 text-sm py-2 px-4 hover:text-neutral-400 transition-colors"
          >
            Don't Ask Again
          </button>
        </div>
      </div>
    </div>
  );
}

