import { getSupabase } from '../lib/supabase-browser';

const supabase = getSupabase();

// Check user role and show/hide admin links
async function checkUserRoleAndShowAdminLinks(email) {
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
  userDropdown?.classList.add('hidden');
  userMenuButton?.setAttribute('aria-expanded', 'false');

  checkUserRoleAndShowAdminLinks(email);

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

(function wireUI() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu?.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (menu && !menu.contains(t) && !toggle?.contains(t)) {
      menu.classList.add('hidden');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

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
    e.preventDefault();
    e.stopPropagation();
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  userDropdown?.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', (e) => {
    if (!open) return;
    const t = e.target;
    if (userDropdown?.contains(t) || userMenuButton?.contains(t)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) closeMenu();
  });

  const doSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      try {
        await fetch('/api/auth/signout', { method: 'POST' });
      } catch {
        // ignore
      }
      showSignedOutState();
      window.location.assign('/');
    }
  };
  document
    .getElementById('sign-out-btn')
    ?.addEventListener('click', (e) => {
      e.preventDefault();
      doSignOut();
    });
  document
    .getElementById('mobile-sign-out-btn')
    ?.addEventListener('click', (e) => {
      e.preventDefault();
      doSignOut();
    });
})();

