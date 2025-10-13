import { getSupabase } from '../lib/supabase-browser';

declare global {
  interface Window {
    __supabaseClient?: any;
    __supabaseAuthSub?: { unsubscribe?: () => void } | null;
    __RRG_INITIAL_SESSION?: { access_token: string; refresh_token: string } | null;
  }
}

const supabase = getSupabase();

// Check user role and show/hide admin links
async function checkUserRoleAndShowAdminLinks(email: string) {
  try {
    // First get the user to get their ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let isAdmin = false;
    
    // Try profiles table first
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile && !profileError) {
        isAdmin = profile.role === 'admin' || profile.role === 'editor';
      } else {
        console.warn('Profile query failed, trying user_roles table:', profileError);
        
        // Fallback: try user_roles table
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (userRoles && userRoles.length > 0 && !rolesError) {
          isAdmin = userRoles[0].role === 'admin' || userRoles[0].role === 'editor';
        } else {
          console.warn('User roles query also failed:', rolesError);
          isAdmin = false;
        }
      }
    } catch (queryError) {
      console.warn('Role check query error:', queryError);
      isAdmin = false;
    }
    
    // Desktop admin links
    const adminLinks = document.getElementById('admin-links');
    if (adminLinks) {
      if (isAdmin) {
        adminLinks.classList.remove('hidden');
      } else {
        adminLinks.classList.add('hidden');
      }
    }

    // Mobile admin links
    const mobileAdminLinks = document.getElementById('mobile-admin-links');
    if (mobileAdminLinks) {
      if (isAdmin) {
        mobileAdminLinks.classList.remove('hidden');
      } else {
        mobileAdminLinks.classList.add('hidden');
      }
    }
  } catch (error) {
    console.warn('Error checking user role:', error);
    // Hide admin links on error
    document.getElementById('admin-links')?.classList.add('hidden');
    document.getElementById('mobile-admin-links')?.classList.add('hidden');
  }
}

// Seed the browser session from the server once (if needed)
const bootstrapSession = (async () => {
  try {
    // Get session data from body data attribute
    const body = document.body;
    const sessionData = body.getAttribute('data-initial-session');
    const bootstrap = sessionData ? JSON.parse(sessionData) : null;
    console.log('🔍 Auth Debug: Bootstrap session data:', bootstrap ? 'present' : 'missing');
    if (bootstrap?.access_token && bootstrap?.refresh_token) {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Auth Debug: Current session before bootstrap:', session ? 'exists' : 'missing');
      if (!session) {
        console.log('🔍 Auth Debug: Setting session from bootstrap');
        await supabase.auth.setSession({
          access_token: bootstrap.access_token,
          refresh_token: bootstrap.refresh_token,
        });
      }
    }
  } catch (err) {
    console.warn('Bootstrap session failed', err);
  }
})();

async function waitForBootstrap() {
  try {
    await bootstrapSession;
  } catch {
    /* noop */
  }
}

let inflight: Promise<any> | null = null;
async function getVerifiedUser() {
  await waitForBootstrap();
  if (!inflight) {
    inflight = supabase.auth
      .getUser()
      .then(({ data, error }) => (error ? null : (data?.user ?? null)))
      .finally(() => { inflight = null; });
  }
  return inflight;
}

async function syncAuthUI(session?: { user?: { email?: string | null } | null } | null) {
  console.log('🔍 Auth Debug: syncAuthUI called with session:', session?.user?.email || 'no session');
  if (session?.user?.email) {
    console.log('🔍 Auth Debug: Using session email:', session.user.email);
    showSignedInState(session.user.email);
    return;
  }
  const u = await getVerifiedUser();
  console.log('🔍 Auth Debug: getVerifiedUser returned:', u?.email || 'no user');
  u ? showSignedInState(u.email || '') : showSignedOutState();
}

function showSignedInState(email: string) {
  // desktop
  const authNavItem = document.getElementById('auth-nav-item');
  const signInNavItem = document.getElementById('sign-in-nav-item');
  const userEmail = document.getElementById('user-email');
  const userDropdown = document.getElementById('user-dropdown');
  const userMenuButton = document.getElementById('user-menu-button');
  authNavItem?.classList.remove('hidden');
  signInNavItem?.classList.add('hidden');
  if (userEmail) userEmail.textContent = email;
  userDropdown?.classList.add('hidden');
  userMenuButton?.setAttribute('aria-expanded', 'false');

  // Check user role and show admin links
  checkUserRoleAndShowAdminLinks(email);

  // mobile
  const mAuth = document.getElementById('mobile-auth-nav-item');
  const mSign = document.getElementById('mobile-sign-in-nav-item');
  const mEmail = document.getElementById('mobile-user-email');
  mAuth?.classList.remove('hidden');
  mSign?.classList.add('hidden');
  if (mEmail) mEmail.textContent = email;
}

function showSignedOutState() {
  // desktop
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

  // mobile
  const mAuth = document.getElementById('mobile-auth-nav-item');
  const mSign = document.getElementById('mobile-sign-in-nav-item');
  const mEmail = document.getElementById('mobile-user-email');
  mAuth?.classList.add('hidden');
  mSign?.classList.remove('hidden');
  if (mEmail) mEmail.textContent = '';
}

// initial check (wait until bootstrap completes so server session can hydrate)
waitForBootstrap().finally(() => {
  console.log('🔍 Auth Debug: Bootstrap completed, syncing UI');
  syncAuthUI();
});

// single subscription (and re-verify on changes)
try { window.__supabaseAuthSub?.unsubscribe?.(); } catch {}
{
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    await syncAuthUI(session);
  });
  window.__supabaseAuthSub = data.subscription;
  window.addEventListener('beforeunload', () => {
    try { window.__supabaseAuthSub?.unsubscribe?.(); } catch {}
  });
}

// dropdown wiring + mobile menu + signout buttons
(function wireUI() {
  // mobile hamburger
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu?.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (menu && !menu.contains(t) && !toggle?.contains(t)) {
      menu.classList.add('hidden');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // dropdown
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');
  let open = false;
  function openMenu() {
    if (!userDropdown) return;
    userDropdown.classList.remove('hidden');
    userMenuButton?.setAttribute('aria-expanded', 'true');
    open = true;
  }
  function closeMenu() {
    if (!userDropdown) return;
    userDropdown.classList.add('hidden');
    userMenuButton?.setAttribute('aria-expanded', 'false');
    open = false;
  }
  userMenuButton?.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    open ? closeMenu() : openMenu();
  });
  userDropdown?.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', (e) => {
    if (!open) return;
    const t = e.target as Node;
    if (userDropdown?.contains(t) || userMenuButton?.contains(t)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) closeMenu();
  });

  // sign-out (desktop + mobile)
  const doSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      try { await fetch('/api/auth/signout', { method: 'POST' }); } catch {}
      showSignedOutState();
      location.assign('/');
    }
  };
  document.getElementById('sign-out-btn')?.addEventListener('click', (e) => { e.preventDefault(); doSignOut(); });
  document.getElementById('mobile-sign-out-btn')?.addEventListener('click', (e) => { e.preventDefault(); doSignOut(); });
})();


