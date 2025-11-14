// Push Notification Service for PWA

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private subscription: PushSubscription | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize the notification service
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if service workers and notifications are supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('[Push] Service Worker or Push API not supported');
        return false;
      }

      // Wait for service worker to be ready
      this.registration = await navigator.serviceWorker.ready;
      
      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      console.log('[Push] Initialized', { hasSubscription: !!this.subscription });
      return true;
    } catch (error) {
      console.error('[Push] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    try {
      if (!('Notification' in window)) {
        console.warn('[Push] Notifications not supported');
        return 'denied';
      }

      const permission = await Notification.requestPermission();
      console.log('[Push] Permission:', permission);
      return permission;
    } catch (error) {
      console.error('[Push] Permission request failed:', error);
      return 'denied';
    }
  }

  /**
   * Get current notification permission
   */
  getPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.getPermission() === 'granted';
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    try {
      if (!this.registration) {
        console.error('[Push] Service worker not registered');
        return null;
      }

      // Check permission
      if (this.getPermission() !== 'granted') {
        const permission = await this.requestPermission();
        if (permission !== 'granted') {
          console.warn('[Push] Permission not granted');
          return null;
        }
      }

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('[Push] Subscribed:', this.subscription);
      return this.subscription;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.subscription) {
        console.warn('[Push] No active subscription');
        return false;
      }

      const success = await this.subscription.unsubscribe();
      if (success) {
        this.subscription = null;
        console.log('[Push] Unsubscribed successfully');
      }
      return success;
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error);
      return false;
    }
  }

  /**
   * Get current subscription
   */
  getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  /**
   * Show a local notification (doesn't require push)
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    try {
      if (!this.registration) {
        console.error('[Push] Service worker not registered');
        return;
      }

      if (this.getPermission() !== 'granted') {
        console.warn('[Push] Permission not granted');
        return;
      }

      await this.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/rrg-logo.jpg',
        badge: options.badge || '/rrg-logo.jpg',
        image: options.image,
        tag: options.tag || 'rrg-notification',
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        vibrate: options.vibrate || [200, 100, 200],
        actions: options.actions || []
      });

      console.log('[Push] Notification shown:', options.title);
    } catch (error) {
      console.error('[Push] Show notification failed:', error);
    }
  }

  /**
   * Send subscription to backend
   */
  async sendSubscriptionToBackend(subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to backend');
      }

      console.log('[Push] Subscription sent to backend');
      return true;
    } catch (error) {
      console.error('[Push] Failed to send subscription:', error);
      return false;
    }
  }

  /**
   * Remove subscription from backend
   */
  async removeSubscriptionFromBackend(subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from backend');
      }

      console.log('[Push] Subscription removed from backend');
      return true;
    } catch (error) {
      console.error('[Push] Failed to remove subscription:', error);
      return false;
    }
  }

  /**
   * Convert VAPID key from Base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// Export singleton instance
export const pushNotifications = PushNotificationService.getInstance();

// Convenience functions
export async function initializePushNotifications(): Promise<boolean> {
  return await pushNotifications.initialize();
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await pushNotifications.requestPermission();
}

export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  const subscription = await pushNotifications.subscribe(vapidPublicKey);
  if (subscription) {
    await pushNotifications.sendSubscriptionToBackend(subscription);
  }
  return subscription;
}

export async function unsubscribeFromPush(): Promise<boolean> {
  const subscription = pushNotifications.getSubscription();
  if (subscription) {
    await pushNotifications.removeSubscriptionFromBackend(subscription);
  }
  return await pushNotifications.unsubscribe();
}

export async function showLocalNotification(options: NotificationOptions): Promise<void> {
  return await pushNotifications.showNotification(options);
}

export function isNotificationsEnabled(): boolean {
  return pushNotifications.isEnabled();
}

