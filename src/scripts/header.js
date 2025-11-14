console.log('[Header] Script loading...');

// Import Supabase at the top level so Vite bundles it correctly
// This will work even when header.js is loaded via ?url
import { getSupabase } from '../lib/supabase-browser';

// Get Supabase client - React components already initialize window.__supabaseClient
// So we can use that, or import it if not available yet
let supabase;

async function initSupabase() {
  // First, check if React components have already initialized it
  if (window.__supabaseClient) {
    supabase = window.__supabaseClient;
    console.log('[Header] Using existing Supabase client from window');
    return;
  }
  
  // Use the imported getSupabase function
  try {
    console.log('[Header] Initializing Supabase client...');
    supabase = getSupabase();
    console.log('[Header] Supabase client initialized successfully');
  } catch (error) {
    console.error('[Header] Failed to initialize Supabase:', error);
    // Fallback: Wait for React components to initialize it
    console.log('[Header] Waiting for React components to initialize Supabase...');
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.__supabaseClient) {
        supabase = window.__supabaseClient;
        console.log('[Header] Supabase client found after waiting (attempt', attempts, ')');
        clearInterval(checkInterval);
      } else if (attempts > 200) {
        // Give up after 20 seconds
        console.error('[Header] Supabase client not available after waiting 20 seconds');
        console.error('[Header] Dropdown will work for UI but auth features may not work');
        clearInterval(checkInterval);
      }
    }, 100);
  }
}

initSupabase();

// Check user role and show/hide admin links
async function checkUserRoleAndShowAdminLinks(email) {
  if (!supabase) {
    console.warn('[Header] Supabase not available for checkUserRoleAndShowAdminLinks');
    return;
  }
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let isAdmin = false;

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile && !profileError) {
        isAdmin = profile.role === 'admin' || profile.role === 'editor';
      } else {
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (userRoles && userRoles.length > 0 && !rolesError) {
          isAdmin = ['admin', 'editor'].includes(userRoles[0].role);
        } else {
          isAdmin = false;
        }
      }
    } catch {
      isAdmin = false;
    }

    const adminLinks = document.getElementById('admin-links');
    if (adminLinks) {
      if (isAdmin) {
        adminLinks.classList.remove('hidden');
      } else {
        adminLinks.classList.add('hidden');
      }
    }

    const mobileAdminLinks = document.getElementById('mobile-admin-links');
    if (mobileAdminLinks) {
      if (isAdmin) {
        mobileAdminLinks.classList.remove('hidden');
      } else {
        mobileAdminLinks.classList.add('hidden');
      }
    }
  } catch {
    document.getElementById('admin-links')?.classList.add('hidden');
    document.getElementById('mobile-admin-links')?.classList.add('hidden');
  }
}

// Seed the browser session from the server once (if needed)
const bootstrapSession = (async () => {
  try {
    if (!supabase) return;
    const body = document.body;
    const sessionData = body.getAttribute('data-initial-session');
    const bootstrap = sessionData ? JSON.parse(sessionData) : null;
    if (bootstrap?.access_token && bootstrap?.refresh_token) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.setSession({
          access_token: bootstrap.access_token,
          refresh_token: bootstrap.refresh_token,
        });
      }
    }
  } catch {
    // Silently fail bootstrap
  }
})();

async function waitForBootstrap() {
  try {
    await bootstrapSession;
  } catch {
    /* noop */
  }
}

let inflight = null;
async function getVerifiedUser() {
  await waitForBootstrap();
  if (!supabase) return null;
  if (!inflight) {
    inflight = supabase.auth
      .getUser()
      .then(({ data, error }) => (error ? null : data?.user ?? null))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

async function syncAuthUI(session) {
  if (session?.user?.email) {
    showSignedInState(session.user.email);
    return;
  }
  const u = await getVerifiedUser();
  if (u) {
    showSignedInState(u.email || '');
  } else {
    showSignedOutState();
  }
}

function showSignedInState(email) {
  const authNavItem = document.getElementById('auth-nav-item');
  const signInNavItem = document.getElementById('sign-in-nav-item');
  const userEmail = document.getElementById('user-email');
  const userDropdown = document.getElementById('user-dropdown');
  const userMenuButton = document.getElementById('user-menu-button');
  authNavItem?.classList.remove('hidden');
  signInNavItem?.classList.add('hidden');
  if (userEmail) userEmail.textContent = email;
  // Don't force-hide dropdown if it's currently open - let the toggle logic handle it
  // Only ensure it's closed if it's actually closed (check both hidden class and aria-expanded)
  const isDropdownOpen = userDropdown && !userDropdown.classList.contains('hidden');
  if (!isDropdownOpen) {
  userDropdown?.classList.add('hidden');
  userMenuButton?.setAttribute('aria-expanded', 'false');
  }

  checkUserRoleAndShowAdminLinks(email);
  
  // Expose functions globally so ProfileCard can use them
  if (typeof window !== 'undefined') {
    window.__showSignedOutState = showSignedOutState;
    window.__showSignedInState = showSignedInState;
  }

  const mAuth = document.getElementById('mobile-auth-nav-item');
  const mSign = document.getElementById('mobile-sign-in-nav-item');
  const mEmail = document.getElementById('mobile-user-email');
  mAuth?.classList.remove('hidden');
  mSign?.classList.add('hidden');
  if (mEmail) mEmail.textContent = email;
}

function showSignedOutState() {
  const authNavItem = document.getElementById('auth-nav-item');
  const signInNavItem = document.getElementById('sign-in-nav-item');
  const userEmail = document.getElementById('user-email');
  const adminLinks = document.getElementById('admin-links');
  const userDropdown = document.getElementById('user-dropdown');
  const userMenuButton = document.getElementById('user-menu-button');
  authNavItem?.classList.add('hidden');
  signInNavItem?.classList.remove('hidden');
  if (userEmail) userEmail.textContent = '';
  adminLinks?.classList.add('hidden');
  userDropdown?.classList.add('hidden');
  userMenuButton?.setAttribute('aria-expanded', 'false');

  const mAuth = document.getElementById('mobile-auth-nav-item');
  const mSign = document.getElementById('mobile-sign-in-nav-item');
  const mEmail = document.getElementById('mobile-user-email');
  mAuth?.classList.add('hidden');
  mSign?.classList.remove('hidden');
  if (mEmail) mEmail.textContent = '';
}

waitForBootstrap().finally(() => {
  syncAuthUI();
});

try {
  window.__supabaseAuthSub?.unsubscribe?.();
} catch {
  // ignore
}
(function subscribe() {
  if (!supabase) {
    console.warn('[Header] Supabase not available for auth subscription');
    return;
  }
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    await syncAuthUI(session);
  });
  window.__supabaseAuthSub = data.subscription;
  window.addEventListener('beforeunload', () => {
    try {
      window.__supabaseAuthSub?.unsubscribe?.();
    } catch {
      // ignore
    }
  });
})();

// Track if wireUI has been called to prevent duplicate listeners
let uiWired = false;

function wireUI() {
  console.log('[Header] wireUI called');
  
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    // Prevent duplicate listeners
    if (toggle.dataset.wired === 'true') {
      console.log('[Header] Mobile menu already wired');
      return;
    }
    toggle.dataset.wired = 'true';
    
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log('[Header] Mobile menu toggle clicked');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      toggle.setAttribute('aria-expanded', String(newState));
      if (newState) {
        menu.classList.remove('hidden');
        console.log('[Header] Mobile menu opened');
      } else {
        menu.classList.add('hidden');
        console.log('[Header] Mobile menu closed');
      }
    }, true); // Use capture phase
    
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (menu && !menu.classList.contains('hidden') && !menu.contains(t) && !toggle.contains(t)) {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        console.log('[Header] Mobile menu closed (click outside)');
      }
    }, true); // Use capture phase
  } else {
    console.warn('[Header] Mobile menu toggle or menu not found:', { toggle: !!toggle, menu: !!menu });
  }

  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');
  
  console.log('[Header] userMenuButton:', userMenuButton);
  console.log('[Header] userDropdown:', userDropdown);
  
  if (!userMenuButton || !userDropdown) {
    console.warn('[Header] User menu elements not found, retrying...');
    setTimeout(wireUI, 100);
    return;
  }
  
  // Prevent duplicate event listeners
  if (uiWired && userMenuButton.dataset.wired === 'true') {
    console.log('[Header] UI already wired, skipping');
    return;
  }
  
  // Mark as wired
  userMenuButton.dataset.wired = 'true';
  uiWired = true;
  
  function isMenuOpen() {
    return !userDropdown.classList.contains('hidden');
  }
  
  function openMenu() {
    if (!userDropdown) return;
    userDropdown.classList.remove('hidden');
    userMenuButton?.setAttribute('aria-expanded', 'true');
    console.log('[Header] Menu opened');
  }
  
  function closeMenu() {
    if (!userDropdown) return;
    userDropdown.classList.add('hidden');
    userMenuButton?.setAttribute('aria-expanded', 'false');
    console.log('[Header] Menu closed');
  }
  
  // Handle button click - use capture phase to ensure it runs before other handlers
  userMenuButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation(); // Prevent other handlers from running
    console.log('[Header] User menu button clicked');
    
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }, true); // Use capture phase
  
  // Close dropdown when clicking outside - use capture phase
  document.addEventListener('click', (e) => {
    if (!isMenuOpen()) return;
    
    const target = e.target;
    // Check if click is outside both button and dropdown
    if (!userDropdown.contains(target) && !userMenuButton.contains(target)) {
      console.log('[Header] Click outside menu, closing');
      closeMenu();
    }
  }, true); // Use capture phase
  
  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
    }
  }, true); // Use capture phase
  
  // Prevent dropdown clicks from closing the menu - use capture phase
  userDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  }, true); // Use capture phase
  
  // Prevent multiple simultaneous sign out attempts (shared with ProfileCard)
  const doSignOut = async () => {
    // Prevent multiple simultaneous sign out attempts
    if (window.__headerSignOutInProgress) {
      console.log('[Header] Sign out already in progress, ignoring duplicate call');
      return;
    }
    
    window.__headerSignOutInProgress = true;
    console.log('[Header] Sign out initiated');
    
    try {
      // Clear client-side Supabase session with timeout
      if (supabase) {
        try {
          console.log('[Header] Attempting Supabase signout...');
          // Add timeout to prevent hanging
          const signOutPromise = supabase.auth.signOut();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Signout timeout')), 3000)
          );
          await Promise.race([signOutPromise, timeoutPromise]);
          console.log('[Header] Supabase client signed out');
        } catch (supabaseError) {
          console.warn('[Header] Supabase signout error or timeout (continuing anyway):', supabaseError);
        }
      } else {
        console.log('[Header] No Supabase client available, skipping client signout');
      }
      
      // Clear all storage
      if (typeof window !== 'undefined') {
      try {
          console.log('[Header] Clearing storage...');
          localStorage.clear();
          sessionStorage.clear();
          console.log('[Header] Cleared localStorage and sessionStorage');
        } catch (storageError) {
          console.warn('[Header] Error clearing storage:', storageError);
        }
        
        // Clear all cookies
        try {
          console.log('[Header] Clearing cookies...');
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // Clear cookie with various path and domain options
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
          }
          console.log('[Header] Cleared cookies');
        } catch (cookieError) {
          console.warn('[Header] Error clearing cookies:', cookieError);
        }
        
        // Delete Supabase client instance
        if (window.__supabaseClient) {
          delete window.__supabaseClient;
          console.log('[Header] Deleted Supabase client instance');
        }
      }
      
      // Call server-side signout (don't wait for it)
      console.log('[Header] Calling server signout API...');
      fetch('/api/auth/signout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }).then(response => {
        if (response.ok) {
          console.log('[Header] Server signout successful');
        } else {
          console.warn('[Header] Server signout returned status:', response.status);
        }
      }).catch(apiError => {
        console.warn('[Header] Server signout API error (continuing anyway):', apiError);
      });
      
      // Update UI state
      console.log('[Header] Updating UI state...');
      showSignedOutState();
      
      // Expose showSignedOutState globally so ProfileCard can use it
      window.__showSignedOutState = showSignedOutState;
      
      // Redirect to home page immediately
      console.log('[Header] Redirecting to home page');
      // Use replace instead of href to prevent back button issues
      window.location.replace('/');
      
    } catch (error) {
      console.error('[Header] Sign out error:', error);
      console.error('[Header] Error stack:', error.stack);
      // Force redirect even if everything fails
      try {
        showSignedOutState();
      } catch (uiError) {
        console.error('[Header] Error updating UI state:', uiError);
      }
      window.location.replace('/');
    } finally {
      // Reset flag after a delay in case redirect doesn't happen (shared with ProfileCard)
      setTimeout(() => {
        window.__headerSignOutInProgress = false;
      }, 1000);
    }
  };
  
  // Wire up sign out buttons
  const signOutBtn = document.getElementById('sign-out-btn');
  const mobileSignOutBtn = document.getElementById('mobile-sign-out-btn');
  
  console.log('[Header] signOutBtn found:', signOutBtn);
  console.log('[Header] mobileSignOutBtn found:', mobileSignOutBtn);
  
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[Header] Sign out button clicked');
      // Close dropdown first
      closeMenu();
      // Wait a moment for dropdown to close, then sign out
      await doSignOut();
    });
    console.log('[Header] Sign out button event listener attached');
  } else {
    console.warn('[Header] Sign out button not found');
  }
  
  if (mobileSignOutBtn) {
    mobileSignOutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[Header] Mobile sign out button clicked');
      await doSignOut();
    });
    console.log('[Header] Mobile sign out button event listener attached');
  } else {
    console.warn('[Header] Mobile sign out button not found');
  }
  
  console.log('[Header] Event handlers attached successfully');
}

// Wait for DOM to be ready with error handling
function initHeader() {
  try {
if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        try {
          wireUI();
        } catch (error) {
          console.error('[Header] Error in wireUI on DOMContentLoaded:', error);
          // Retry after a delay
          setTimeout(() => {
            try {
              wireUI();
            } catch (retryError) {
              console.error('[Header] Error in wireUI retry:', retryError);
            }
          }, 500);
        }
      });
} else {
      try {
        wireUI();
      } catch (error) {
        console.error('[Header] Error in wireUI:', error);
        // Retry after a delay
        setTimeout(() => {
          try {
            wireUI();
          } catch (retryError) {
            console.error('[Header] Error in wireUI retry:', retryError);
          }
        }, 500);
      }
    }
  } catch (error) {
    console.error('[Header] Error initializing header:', error);
    // Final fallback: try again after everything loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
  wireUI();
        } catch (loadError) {
          console.error('[Header] Error in wireUI on window load:', loadError);
        }
      }, 1000);
    });
  }
}

initHeader();

