/**
 * User Profile Component
 * Shows user info and sign out option
 */
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase-browser';
import type { Profile } from '../lib/supabase';

export default function UserProfile() {
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
        console.log('[UserProfile] Profile found:', profileData);
        setProfile(profileData);
      } else {
        console.warn('[UserProfile] Profile query failed, trying user_roles table:', profileError);
        
        // Fallback: try user_roles table
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);

        if (userRoles && userRoles.length > 0 && !rolesError) {
          console.log('[UserProfile] User roles found:', userRoles);
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
          console.warn('[UserProfile] User roles query also failed, using default:', rolesError);
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
      console.error('[UserProfile] Error fetching profile:', error);
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
    try {
      console.log('[UserProfile] Sign out clicked');
      const supabase = getSupabase();
      
      // Clear client-side state
      await supabase.auth.signOut();
      
      // Clear all storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(';').forEach(function(c) {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        
        // Delete Supabase client instance
        if (window.__supabaseClient) {
          delete window.__supabaseClient;
        }
      }
      
      // Call server-side signout
      await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {});
      
      console.log('[UserProfile] Sign out complete, redirecting to home');
      window.location.href = '/';
    } catch (error) {
      console.error('[UserProfile] Sign out error:', error);
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-neutral-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-amber-100 font-display">
            Welcome back!
          </h3>
          <p className="text-neutral-300 text-lg">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
        >
          Sign Out
        </button>
      </div>

      {profile && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400 font-medium">Role:</span>
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
              profile.role === 'admin' ? 'bg-red-900/40 text-red-200 border border-red-700/50' :
              profile.role === 'editor' ? 'bg-amber-900/40 text-amber-200 border border-amber-700/50' :
              'bg-neutral-800/60 text-neutral-300 border border-neutral-700/50'
            }`}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
          
          {profile.role === 'admin' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/30 rounded-xl">
              <p className="text-sm text-red-200 font-medium">
                <strong className="text-red-100">Admin Access:</strong> You can create, edit, and manage all content.
              </p>
            </div>
          )}

          {profile.role === 'editor' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl">
              <p className="text-sm text-blue-200 font-medium">
                <strong className="text-blue-100">Editor Access:</strong> You can create and edit content.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
