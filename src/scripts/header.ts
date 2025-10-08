import { getSupabase } from '../lib/supabase-browser';

declare global {
  interface Window {
    __supabaseClient?: any;
    __supabaseAuthSub?: { unsubscribe?: () => void } | null;
    __RRG_INITIAL_SESSION?: { access_token: string; refresh_token: string } | null;
  }
}

const supabase = getSupabase();

// Seed the browser session from the server once (if needed)
(async () => {
  try {
    const bootstrap = window.__RRG_INITIAL_SESSION;
    if (bootstrap?.access_token && bootstrap?.refresh_token) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.setSession({
          access_token: bootstrap.access_token,
          refresh_token: bootstrap.refresh_token,
        });
      }
      try { delete window.__RRG_INITIAL_SESSION; } catch {}
    }
  } catch (err) {
    console.warn('Bootstrap session failed', err);
  }
})();

let inflight: Promise<any> | null = null;
async function getVerifiedUser() {
  if (!inflight) {
    inflight = supabase.auth
      .getUser()
      .then(({ data, error }) => (error ? null : (data?.user ?? null)))
      .finally(() => { inflight = null; });
  }
  return inflight;
}

function showSignedInState(email: string) {
  // desktop
  const authNavItem = document.getElementById('auth-nav-item');
  const signInNavItem = document.getElementById('sign-in-nav-item');
  const userEmail = document.getElementById('user-email');
  authNavItem?.classList.remove('hidden');
  signInNavItem?.classList.add('hidden');
  if (userEmail) userEmail.textContent = email;

  // admin links (demo rule)
  const adminLinks = document.getElementById('admin-links');
  if (adminLinks) {
    if (email === 'asjames18@proton.me') adminLinks.classList.remove('hidden');
    else adminLinks.classList.add('hidden');
  }

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
  authNavItem?.classList.add('hidden');
  signInNavItem?.classList.remove('hidden');

  // mobile
  const mAuth = document.getElementById('mobile-auth-nav-item');
  const mSign = document.getElementById('mobile-sign-in-nav-item');
  mAuth?.classList.add('hidden');
  mSign?.classList.remove('hidden');
}

// initial check
getVerifiedUser().then((u) => u ? showSignedInState(u.email || '') : showSignedOutState());

// single subscription (and re-verify on changes)
try { window.__supabaseAuthSub?.unsubscribe?.(); } catch {}
{
  const { data } = supabase.auth.onAuthStateChange(async () => {
    const u = await getVerifiedUser();
    u ? showSignedInState(u.email || '') : showSignedOutState();
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


