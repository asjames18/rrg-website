/**
 * Authentication Form Component
 * Handles sign up, sign in, and password reset
 */
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'reset';
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'reset') => void;
}

export default function AuthForm({ mode, onSuccess, onModeChange }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup' | 'reset'>(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
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

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Check your email for the confirmation link!'
        });
      } else if (currentMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Successfully signed in!'
        });

        onSuccess?.();
      } else if (currentMode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Password reset email sent!'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setCurrentMode(newMode);
    setMessage(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const clearMessage = () => {
    if (message) {
      setMessage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl">
      {/* Mode Tabs */}
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
        {currentMode === 'signup' && 'Create Your Account'}
        {currentMode === 'reset' && 'Reset Your Password'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearMessage();
            }}
            required
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearMessage();
              }}
              required
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
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearMessage();
              }}
              required
              className="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${
            message.type === 'success' 
              ? 'bg-green-900/20 border border-green-600/30 text-green-200'
              : 'bg-red-900/20 border border-red-600/30 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? 'Loading...' : (
            currentMode === 'signin' ? 'Sign In' :
            currentMode === 'signup' ? 'Create Account' :
            'Send Reset Email'
          )}
        </button>
      </form>

      {/* Additional Help Text */}
      <div className="mt-6 text-center">
        {currentMode === 'signin' && (
          <p className="text-sm text-neutral-400">
            New to Real & Raw Gospel? 
            <button
              onClick={() => switchMode('signup')}
              className="text-amber-400 hover:text-amber-300 ml-1 font-medium underline hover:no-underline transition-all duration-200"
            >
              Create an account
            </button>
          </p>
        )}
        
        {currentMode === 'signup' && (
          <p className="text-sm text-neutral-400">
            Already have an account? 
            <button
              onClick={() => switchMode('signin')}
              className="text-amber-400 hover:text-amber-300 ml-1 font-medium underline hover:no-underline transition-all duration-200"
            >
              Sign in
            </button>
          </p>
        )}
        
        {currentMode === 'reset' && (
          <p className="text-sm text-neutral-400">
            Remember your password? 
            <button
              onClick={() => switchMode('signin')}
              className="text-amber-400 hover:text-amber-300 ml-1 font-medium underline hover:no-underline transition-all duration-200"
            >
              Sign in
            </button>
          </p>
        )}
        
        {currentMode === 'signin' && (
          <p className="text-sm text-neutral-400 mt-2">
            <button
              onClick={() => switchMode('reset')}
              className="text-neutral-400 hover:text-neutral-200 font-medium underline hover:no-underline transition-all duration-200"
            >
              Forgot your password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
