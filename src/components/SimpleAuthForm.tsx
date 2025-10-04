/**
 * Simplified Authentication Form Component
 * Handles loading states and errors better
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SimpleAuthFormProps {
  mode: 'signin' | 'signup' | 'reset';
}

export default function SimpleAuthForm({ mode }: SimpleAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup' | 'reset'>(mode);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize component
  useEffect(() => {
    console.log('SimpleAuthForm: Initializing...');
    
    // Check if Supabase is available
    if (typeof window !== 'undefined' && supabase) {
      console.log('SimpleAuthForm: Supabase client available');
      setIsInitialized(true);
    } else {
      console.error('SimpleAuthForm: Supabase client not available');
      setMessage({ type: 'error', text: 'Authentication service not available. Please refresh the page.' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log('SimpleAuthForm: Submitting form...', { 
        currentMode, 
        email, 
        passwordLength: password.length,
        hasPassword: !!password 
      });

      if (currentMode === 'signup') {
        if (!password || !confirmPassword) {
          setMessage({ type: 'error', text: 'Please fill in all fields' });
          return;
        }
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match' });
          return;
        }
        if (password.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
          return;
        }

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Signup failed');
        }

        setMessage({
          type: 'success',
          text: 'Check your email for the confirmation link!'
        });
      } else if (currentMode === 'signin') {
        if (!password) {
          setMessage({ type: 'error', text: 'Please enter your password' });
          return;
        }

        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Signin failed');
        }

        setMessage({
          type: 'success',
          text: 'Successfully signed in! Redirecting...'
        });

        // Redirect after successful sign in
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else if (currentMode === 'reset') {
        // Use our API endpoint for password reset
        const response = await fetch('/api/auth/request-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send reset email');
        }

        setMessage({
          type: 'success',
          text: 'Password reset email sent! Check your email for the reset link.'
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setCurrentMode(newMode);
    setMessage(null);
  };

  if (!isInitialized) {
    return (
      <div className="max-w-md mx-auto bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-neutral-300">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl">
      <div className="flex mb-8 bg-neutral-800/50 rounded-lg p-1">
        <button
          onClick={() => switchMode('signin')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            currentMode === 'signin'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => switchMode('signup')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            currentMode === 'signup'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => switchMode('reset')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            currentMode === 'reset'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Reset
        </button>
      </div>

      <h2 className="text-2xl font-bold text-amber-100 mb-6 text-center font-display">
        {currentMode === 'signin' && 'Welcome Back'}
        {currentMode === 'signup' && 'Join the Remnant'}
        {currentMode === 'reset' && 'Reset Password'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
            placeholder="your@email.com"
          />
        </div>

        {currentMode !== 'reset' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        )}

        {currentMode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-200 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {currentMode === 'signin' && 'Signing In...'}
              {currentMode === 'signup' && 'Creating Account...'}
              {currentMode === 'reset' && 'Sending Reset...'}
            </div>
          ) : (
            <>
              {currentMode === 'signin' && 'Sign In'}
              {currentMode === 'signup' && 'Create Account'}
              {currentMode === 'reset' && 'Send Reset Email'}
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-900/20 border border-green-600/30 text-green-200'
            : 'bg-red-900/20 border border-red-600/30 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mt-6 text-center">
        {currentMode === 'signin' && (
          <p className="text-sm text-neutral-400">
            New to Real & Raw Gospel?{' '}
            <button
              onClick={() => switchMode('signup')}
              className="text-amber-400 hover:text-amber-300 font-medium underline hover:no-underline transition-all duration-200"
            >
              Create an account
            </button>
          </p>
        )}
        {currentMode === 'signup' && (
          <p className="text-sm text-neutral-400">
            Already have an account?{' '}
            <button
              onClick={() => switchMode('signin')}
              className="text-amber-400 hover:text-amber-300 font-medium underline hover:no-underline transition-all duration-200"
            >
              Sign in
            </button>
          </p>
        )}
        {currentMode === 'reset' && (
          <p className="text-sm text-neutral-400">
            Remember your password?{' '}
            <button
              onClick={() => switchMode('signin')}
              className="text-amber-400 hover:text-amber-300 font-medium underline hover:no-underline transition-all duration-200"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
