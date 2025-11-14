// PWA Service Worker Registration
console.log('[PWA] Initializing...');

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // Register service worker after page load
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}

async function registerServiceWorker() {
  try {
    console.log('[PWA] Registering service worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('[PWA] Service worker registered successfully');
    
    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[PWA] New service worker found');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          showUpdateNotification(registration);
        }
      });
    });
    
    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);
    
  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
  }
}

function showUpdateNotification(registration) {
  console.log('[PWA] Update available');
  
  // Create update notification
  const notification = document.createElement('div');
  notification.id = 'pwa-update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 90%;
      width: 400px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      animation: slideUp 0.3s ease-out;
    ">
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Update Available</div>
        <div style="font-size: 14px; opacity: 0.9;">A new version of the app is ready</div>
      </div>
      <button id="pwa-update-btn" style="
        background: white;
        color: #d97706;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
      ">
        Update
      </button>
      <button id="pwa-dismiss-btn" style="
        background: transparent;
        color: white;
        border: none;
        padding: 8px;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        opacity: 0.7;
      ">
        ×
      </button>
    </div>
    <style>
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    </style>
  `;
  
  document.body.appendChild(notification);
  
  // Handle update button
  document.getElementById('pwa-update-btn').addEventListener('click', () => {
    const waiting = registration.waiting;
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  });
  
  // Handle dismiss button
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    notification.remove();
  });
}

// Handle install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button
  showInstallPrompt();
});

function showInstallPrompt() {
  // Check if already shown or dismissed
  if (localStorage.getItem('pwa-install-dismissed')) {
    return;
  }
  
  // Don't show if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return;
  }
  
  // Create install prompt (only show once per session)
  if (sessionStorage.getItem('pwa-install-shown')) {
    return;
  }
  
  sessionStorage.setItem('pwa-install-shown', 'true');
  
  // Wait a bit before showing
  setTimeout(() => {
    const prompt = document.createElement('div');
    prompt.id = 'pwa-install-prompt';
    prompt.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #171717;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        border: 1px solid #404040;
        z-index: 10000;
        max-width: 90%;
        width: 400px;
        animation: slideUp 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <img src="/rrg-logo.jpg" style="width: 40px; height: 40px; border-radius: 8px;">
          <div>
            <div style="font-weight: 600; color: #d97706;">Install App</div>
            <div style="font-size: 14px; color: #a3a3a3;">Add to your home screen</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="pwa-install-btn" style="
            flex: 1;
            background: #d97706;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
          ">
            Install
          </button>
          <button id="pwa-install-dismiss" style="
            background: transparent;
            color: #a3a3a3;
            border: 1px solid #404040;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
          ">
            Later
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    // Handle install
    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Install outcome:', outcome);
        deferredPrompt = null;
      }
      prompt.remove();
    });
    
    // Handle dismiss
    document.getElementById('pwa-install-dismiss').addEventListener('click', () => {
      localStorage.setItem('pwa-install-dismissed', 'true');
      prompt.remove();
    });
  }, 3000); // Show after 3 seconds
}

// Track installation
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  localStorage.setItem('pwa-installed', 'true');
});

// Network status monitoring
window.addEventListener('online', () => {
  console.log('[PWA] Connection restored');
  showConnectionStatus('online');
});

window.addEventListener('offline', () => {
  console.log('[PWA] Connection lost');
  showConnectionStatus('offline');
});

function showConnectionStatus(status) {
  // Remove existing status
  const existing = document.getElementById('pwa-connection-status');
  if (existing) {
    existing.remove();
  }
  
  const isOnline = status === 'online';
  const statusBar = document.createElement('div');
  statusBar.id = 'pwa-connection-status';
  statusBar.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: ${isOnline ? '#16a34a' : '#dc2626'};
      color: white;
      padding: 8px 16px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      animation: slideDown 0.3s ease-out;
    ">
      ${isOnline ? '✓ Back Online' : '⚠ No Internet Connection'}
    </div>
    <style>
      @keyframes slideDown {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }
    </style>
  `;
  
  document.body.appendChild(statusBar);
  
  // Auto-remove online status after 3 seconds
  if (isOnline) {
    setTimeout(() => {
      statusBar.style.animation = 'slideDown 0.3s ease-out reverse';
      setTimeout(() => statusBar.remove(), 300);
    }, 3000);
  }
}

// Export for use in other scripts
window.PWA = {
  showInstallPrompt,
  isInstalled: () => localStorage.getItem('pwa-installed') === 'true' || 
                window.matchMedia('(display-mode: standalone)').matches,
  isOnline: () => navigator.onLine
};

