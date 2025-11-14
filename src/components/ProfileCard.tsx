/**
 * Profile Card Component
 * Displays user profile information in a card format
 */
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase-browser';
import type { Profile } from '../lib/supabase';

interface ProfileCardProps {
  showActions?: boolean;
  className?: string;
}

export default function ProfileCard({ showActions = true, className = '' }: ProfileCardProps) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
      setUser(user);
      if (user) {
        fetchProfile(user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: { user: any } | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = getSupabase();
      
      // Get current user data to use as fallback
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Try profiles table first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileData && !profileError) {
        console.log('[ProfileCard] Profile found:', profileData);
        setProfile(profileData);
      } else {
        console.warn('[ProfileCard] Profile query failed, trying user_roles table:', profileError);
        
        // Fallback: try user_roles table
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);

        if (userRoles && userRoles.length > 0 && !rolesError) {
          console.log('[ProfileCard] User roles found:', userRoles);
          // Create a minimal profile object from user_roles data
          setProfile({
            id: userId,
            email: currentUser?.email || user?.email || '',
            display_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || user?.email || 'User',
            role: userRoles[0].role,
            status: 'active',
            created_at: currentUser?.created_at || new Date().toISOString()
          });
        } else {
          console.warn('[ProfileCard] User roles query also failed, using default:', rolesError);
          // Set a default profile if both queries fail
          setProfile({
            id: userId,
            email: currentUser?.email || user?.email || '',
            display_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || user?.email || 'User',
            role: 'user',
            status: 'active',
            created_at: currentUser?.created_at || new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('[ProfileCard] Error fetching profile:', error);
      // Set a default profile on error
      const supabase = getSupabase();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      setProfile({
        id: userId,
        email: currentUser?.email || user?.email || '',
        display_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || 'User',
        role: 'user',
        status: 'active',
        created_at: currentUser?.created_at || new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Prevent multiple simultaneous sign out attempts (shared with header.js)
    if ((window as any).__headerSignOutInProgress) {
      console.log('[ProfileCard] Sign out already in progress, ignoring duplicate call');
      return;
    }
    
    (window as any).__headerSignOutInProgress = true;
    console.log('[ProfileCard] Sign out clicked');
    
    try {
      const supabase = getSupabase();
      
      // Clear client-side Supabase session with timeout
      if (supabase) {
        try {
          console.log('[ProfileCard] Attempting Supabase signout...');
          const signOutPromise = supabase.auth.signOut();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Signout timeout')), 3000)
          );
          await Promise.race([signOutPromise, timeoutPromise]);
          console.log('[ProfileCard] Supabase client signed out');
        } catch (supabaseError) {
          console.warn('[ProfileCard] Supabase signout error or timeout (continuing anyway):', supabaseError);
        }
      }
      
      // Clear all storage
      if (typeof window !== 'undefined') {
        try {
          console.log('[ProfileCard] Clearing storage...');
          localStorage.clear();
          sessionStorage.clear();
          console.log('[ProfileCard] Cleared localStorage and sessionStorage');
        } catch (storageError) {
          console.warn('[ProfileCard] Error clearing storage:', storageError);
        }
        
        // Clear all cookies
        try {
          console.log('[ProfileCard] Clearing cookies...');
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
          console.log('[ProfileCard] Cleared cookies');
        } catch (cookieError) {
          console.warn('[ProfileCard] Error clearing cookies:', cookieError);
        }
        
        // Delete Supabase client instance
        if ((window as any).__supabaseClient) {
          delete (window as any).__supabaseClient;
          console.log('[ProfileCard] Deleted Supabase client instance');
        }
      }
      
      // Call server-side signout (don't wait for it)
      console.log('[ProfileCard] Calling server signout API...');
      fetch('/api/auth/signout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }).then(response => {
        if (response.ok) {
          console.log('[ProfileCard] Server signout successful');
        } else {
          console.warn('[ProfileCard] Server signout returned status:', response.status);
        }
      }).catch(apiError => {
        console.warn('[ProfileCard] Server signout API error (continuing anyway):', apiError);
      });
      
      // Update UI state if showSignedOutState is available (from header.js)
      if (typeof (window as any).__showSignedOutState === 'function') {
        console.log('[ProfileCard] Calling header showSignedOutState...');
        (window as any).__showSignedOutState();
      }
      
      console.log('[ProfileCard] Sign out complete, redirecting to home');
      // Use replace instead of href to prevent back button issues
      window.location.replace('/');
      
    } catch (error) {
      console.error('[ProfileCard] Sign out error:', error);
      // Update UI state if available
      if (typeof (window as any).__showSignedOutState === 'function') {
        try {
          (window as any).__showSignedOutState();
        } catch (uiError) {
          console.error('[ProfileCard] Error updating UI state:', uiError);
        }
      }
      // Force redirect even if everything fails
      window.location.replace('/');
    } finally {
      // Reset flag after a delay in case redirect doesn't happen (shared with header.js)
      setTimeout(() => {
        (window as any).__headerSignOutInProgress = false;
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className={`bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-neutral-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-amber-100 mb-2">Not Signed In</h3>
        <p className="text-neutral-400 mb-4">Sign in to view your profile</p>
        <a 
          href="/auth" 
          className="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-amber-900/20 to-amber-800/20 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-amber-100 font-display mb-2">
            Welcome back!
          </h3>
          <p className="text-neutral-300 text-lg mb-4">
            {user.email}
          </p>
          
          {profile && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-neutral-400 font-medium">Role:</span>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                profile.role === 'admin' ? 'bg-red-900/40 text-red-200 border border-red-700/50' :
                profile.role === 'editor' ? 'bg-amber-900/40 text-amber-200 border border-amber-700/50' :
                'bg-neutral-800/60 text-neutral-300 border border-neutral-700/50'
              }`}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            </div>
          )}

          <div className="text-sm text-neutral-400">
            Member since {new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </div>
        </div>

        {showActions && (
          <div className="flex flex-col gap-2">
            <a 
              href="/profile" 
              className="bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg text-center"
            >
              View Profile
            </a>
            <button
              onClick={handleSignOut}
              className="bg-red-900/40 hover:bg-red-800/40 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {profile && (
        <div className="space-y-4">
          {profile.role === 'admin' && (
            <div className="p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/30 rounded-xl">
              <p className="text-sm text-red-200 font-medium">
                <strong className="text-red-100">Admin Access:</strong> You can create, edit, and manage all content.
              </p>
            </div>
          )}

          {profile.role === 'editor' && (
            <div className="p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl">
              <p className="text-sm text-blue-200 font-medium">
                <strong className="text-blue-100">Editor Access:</strong> You can create and edit content.
              </p>
            </div>
          )}

          {profile.role === 'viewer' && (
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700/30 rounded-xl">
              <p className="text-sm text-green-200 font-medium">
                <strong className="text-green-100">Member Access:</strong> You can view all content and save favorites.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

