/**
 * Enhanced Authentication Form Component
 * With password strength indicator, real-time validation, and better UX
 */
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase-browser';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel } from '../lib/password-validator';

interface SimpleAuthFormProps {
  mode: 'signin' | 'signup' | 'reset';
}

export default function SimpleAuthForm({ mode }: SimpleAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup' | 'reset'>(mode);
  const [isInitialized, setIsInitialized] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof validatePassword> | null>(null);

  // Initialize component
  useEffect(() => {
    console.log('[SimpleAuthForm] Initializing...');
    
    // Hide the static loading fallback immediately when component mounts
    if (typeof window !== 'undefined') {
      const loadingEl = document.getElementById('auth-loading');
      if (loadingEl) {
        loadingEl.style.display = 'none';
        console.log('[SimpleAuthForm] Hidden static loading fallback');
      }
    }
    
    // Check if Supabase is available
    if (typeof window !== 'undefined') {
      try {
        const supabase = getSupabase();
        if (supabase) {
          console.log('[SimpleAuthForm] Supabase client available');
          setIsInitialized(true);
        } else {
          console.error('[SimpleAuthForm] Supabase client not available');
          setIsInitialized(true); // Still show the form
          setMessage({ type: 'error', text: 'Authentication service not available. Please refresh the page.' });
        }
      } catch (error) {
        console.error('[SimpleAuthForm] Error getting Supabase client:', error);
        setIsInitialized(true); // Still show the form
        setMessage({ type: 'error', text: 'Authentication service not available. Please check your configuration.' });
      }
    } else {
      console.error('[SimpleAuthForm] Not in browser environment');
      // This should never happen with client:load, but handle it anyway
      setTimeout(() => {
        setIsInitialized(true);
      }, 100);
    }
  }, []);

  // Validate email on blur
  const handleEmailBlur = () => {
    if (email && !email.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Check password strength on change (for signup)
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    
    if (currentMode === 'signup' && value) {
      const strength = validatePassword(value);
      setPasswordStrength(strength);
      
      if (!strength.isValid) {
        setPasswordError(strength.feedback[0] || 'Password is too weak');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordStrength(null);
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setEmailError('');
    setPasswordError('');

    try {
      console.log('[SimpleAuthForm] Submitting form...', { 
        currentMode, 
        email, 
        passwordLength: password.length,
        hasPassword: !!password 
      });

      // Validate email
      if (!email || !email.includes('@')) {
        setEmailError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (currentMode === 'signup') {
        // Signup validation
        if (!password || !confirmPassword) {
          setMessage({ type: 'error', text: 'Please fill in all fields' });
          setLoading(false);
          return;
        }
        
        if (password !== confirmPassword) {
          setPasswordError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (password.length < 8) {
          setPasswordError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }

        // Check password strength
        const strength = validatePassword(password);
        if (!strength.isValid) {
          setPasswordError(strength.feedback[0] || 'Password is too weak');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log('[SimpleAuthForm] Signup response:', response.status, result);

        if (!response.ok) {
          throw new Error(result.error || 'Signup failed');
        }

        setMessage({
          type: 'success',
          text: result.message || 'Check your email for the confirmation link!'
        });
        
        // Clear form on success
        setPassword('');
        setConfirmPassword('');
        setPasswordStrength(null);
        
      } else if (currentMode === 'signin') {
        // Signin validation
        if (!password) {
          setPasswordError('Please enter your password');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log('[SimpleAuthForm] Signin response:', response.status, result);

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
        // Password reset
        const response = await fetch('/api/auth/request-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();
        console.log('[SimpleAuthForm] Reset response:', response.status, result);

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send reset email');
        }

        setMessage({
          type: 'success',
          text: 'Password reset email sent! Check your email for the reset link.'
        });
      }
    } catch (error: any) {
      console.error('[SimpleAuthForm] Auth error:', error);
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
    setEmailError('');
    setPasswordError('');
    setPasswordStrength(null);
    setPassword('');
    setConfirmPassword('');
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
      {/* Tab Switcher */}
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
        {/* Email Field */}
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
            onBlur={handleEmailBlur}
            className={`w-full px-4 py-3 bg-neutral-800/80 border ${
              emailError ? 'border-red-500/50' : 'border-neutral-600/50'
            } rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200`}
            placeholder="your@email.com"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          {emailError && (
            <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {emailError}
            </p>
          )}
        </div>

        {/* Password Field */}
        {currentMode !== 'reset' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 pr-12 bg-neutral-800/80 border ${
                  passwordError ? 'border-red-500/50' : 'border-neutral-600/50'
                } rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200`}
                placeholder="••••••••"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {passwordError}
              </p>
            )}
            
            {/* Password Strength Indicator (only for signup) */}
            {currentMode === 'signup' && password && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-400">Password Strength:</span>
                  <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength.label)}`}>
                    {getPasswordStrengthLabel(passwordStrength.label)}
                  </span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      passwordStrength.label === 'very-weak' ? 'bg-red-500 w-1/5' :
                      passwordStrength.label === 'weak' ? 'bg-orange-500 w-2/5' :
                      passwordStrength.label === 'medium' ? 'bg-yellow-500 w-3/5' :
                      passwordStrength.label === 'strong' ? 'bg-green-500 w-4/5' :
                      'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <p className="mt-1 text-xs text-neutral-400">
                    {passwordStrength.feedback[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirm Password Field */}
        {currentMode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-200 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-neutral-800/80 border ${
                confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-neutral-600/50'
              } rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200`}
              placeholder="••••••••"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> Passwords do not match
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
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

      {/* Success/Error Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
          message.type === 'success' 
            ? 'bg-green-900/20 border border-green-600/30 text-green-200'
            : 'bg-red-900/20 border border-red-600/30 text-red-200'
        }`}>
          <span className="text-lg">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="flex-1">{message.text}</span>
        </div>
      )}

      {/* Mode Switcher Links */}
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
