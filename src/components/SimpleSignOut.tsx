import { useState } from 'react';

export default function SimpleSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    
    try {
      // Clear client-side state first
      if (typeof window !== 'undefined') {
        // Clear Supabase client
        if (window.__supabaseClient) {
          await window.__supabaseClient.auth.signOut();
          delete window.__supabaseClient;
        }
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(';').forEach(function(c) {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
      }
      
      // Call server-side sign out
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        window.location.href = '/auth?message=signed-out';
      } else {
        // Force redirect even if API fails
        window.location.href = '/auth?message=signed-out';
      }
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if everything fails
      window.location.href = '/auth?message=signed-out';
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="bg-red-700 hover:bg-red-600 disabled:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
    >
      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}
