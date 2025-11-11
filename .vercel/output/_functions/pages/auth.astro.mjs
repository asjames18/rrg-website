import { c as createComponent, a as createAstro, e as renderTemplate, d as renderComponent, af as maybeRenderHead, aq as Fragment$1 } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_BI6EUuN9.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getSupabase } from '../chunks/supabase-browser_Cda5YnzV.mjs';
import { s as supabaseServer } from '../chunks/supabase-server_CrvNcPIF.mjs';
export { renderers } from '../renderers.mjs';

function SimpleAuthForm({ mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    console.log("SimpleAuthForm: Initializing...");
    if (typeof window !== "undefined") {
      try {
        const supabase = getSupabase();
        if (supabase) {
          console.log("SimpleAuthForm: Supabase client available");
          setIsInitialized(true);
        } else {
          console.error("SimpleAuthForm: Supabase client not available");
          setMessage({ type: "error", text: "Authentication service not available. Please refresh the page." });
        }
      } catch (error) {
        console.error("SimpleAuthForm: Error getting Supabase client:", error);
        setMessage({ type: "error", text: "Authentication service not available. Please refresh the page." });
      }
    } else {
      console.error("SimpleAuthForm: Not in browser environment");
      setMessage({ type: "error", text: "Authentication service not available. Please refresh the page." });
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      console.log("SimpleAuthForm: Submitting form...", {
        currentMode,
        email,
        passwordLength: password.length,
        hasPassword: !!password
      });
      if (currentMode === "signup") {
        if (!password || !confirmPassword) {
          setMessage({ type: "error", text: "Please fill in all fields" });
          return;
        }
        if (password !== confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" });
          return;
        }
        if (password.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters" });
          return;
        }
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Signup failed");
        }
        setMessage({
          type: "success",
          text: "Check your email for the confirmation link!"
        });
      } else if (currentMode === "signin") {
        if (!password) {
          setMessage({ type: "error", text: "Please enter your password" });
          return;
        }
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Signin failed");
        }
        setMessage({
          type: "success",
          text: "Successfully signed in! Redirecting..."
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else if (currentMode === "reset") {
        const response = await fetch("/api/auth/request-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to send reset email");
        }
        setMessage({
          type: "success",
          text: "Password reset email sent! Check your email for the reset link."
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage({
        type: "error",
        text: error.message || "An error occurred. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    setMessage(null);
  };
  if (!isInitialized) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-300", children: "Initializing authentication..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex mb-8 bg-neutral-800/50 rounded-lg p-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => switchMode("signin"),
          className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${currentMode === "signin" ? "bg-amber-600 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-200"}`,
          children: "Sign In"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => switchMode("signup"),
          className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${currentMode === "signup" ? "bg-amber-600 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-200"}`,
          children: "Sign Up"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => switchMode("reset"),
          className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${currentMode === "reset" ? "bg-amber-600 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-200"}`,
          children: "Reset"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-amber-100 mb-6 text-center font-display", children: [
      currentMode === "signin" && "Welcome Back",
      currentMode === "signup" && "Join the Remnant",
      currentMode === "reset" && "Reset Password"
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-neutral-200 mb-2", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "email",
            type: "email",
            required: true,
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200",
            placeholder: "your@email.com"
          }
        )
      ] }),
      currentMode !== "reset" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-neutral-200 mb-2", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            type: "password",
            required: true,
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200",
            placeholder: "••••••••"
          }
        )
      ] }),
      currentMode === "signup" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-neutral-200 mb-2", children: "Confirm Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "confirmPassword",
            type: "password",
            required: true,
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            className: "w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200",
            placeholder: "••••••••"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg hover:shadow-xl disabled:shadow-none",
          children: loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }),
            currentMode === "signin" && "Signing In...",
            currentMode === "signup" && "Creating Account...",
            currentMode === "reset" && "Sending Reset..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            currentMode === "signin" && "Sign In",
            currentMode === "signup" && "Create Account",
            currentMode === "reset" && "Send Reset Email"
          ] })
        }
      )
    ] }),
    message && /* @__PURE__ */ jsx("div", { className: `mt-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-900/20 border border-green-600/30 text-green-200" : "bg-red-900/20 border border-red-600/30 text-red-200"}`, children: message.text }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center", children: [
      currentMode === "signin" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-400", children: [
        "New to Real & Raw Gospel?",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("signup"),
            className: "text-amber-400 hover:text-amber-300 font-medium underline hover:no-underline transition-all duration-200",
            children: "Create an account"
          }
        )
      ] }),
      currentMode === "signup" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-400", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("signin"),
            className: "text-amber-400 hover:text-amber-300 font-medium underline hover:no-underline transition-all duration-200",
            children: "Sign in"
          }
        )
      ] }),
      currentMode === "reset" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-400", children: [
        "Remember your password?",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("signin"),
            className: "text-amber-400 hover:text-amber-300 font-medium underline hover:no-underline transition-all duration-200",
            children: "Sign in"
          }
        )
      ] })
    ] })
  ] });
}

function UserProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data: { user: user2 } }) => {
      setUser(user2);
      if (user2) {
        fetchProfile(user2.id);
      } else {
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
  const fetchProfile = async (userId) => {
    try {
      const supabase = getSupabase();
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (profileData && !profileError) {
        setProfile(profileData);
      } else {
        console.warn("Profile query failed, trying user_roles table:", profileError);
        const { data: userRoles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", userId);
        if (userRoles && userRoles.length > 0 && !rolesError) {
          setProfile({
            id: userId,
            email: user?.email || "",
            display_name: user?.user_metadata?.full_name || user?.email || "",
            role: userRoles[0].role,
            created_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        } else {
          console.warn("User roles query also failed:", rolesError);
          setProfile({
            id: userId,
            email: user?.email || "",
            display_name: user?.user_metadata?.full_name || user?.email || "",
            role: "user",
            created_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile({
        id: userId,
        email: user?.email || "",
        display_name: user?.user_metadata?.full_name || user?.email || "",
        role: "user",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } finally {
      try {
        await fetch("/api/auth/signout", { method: "POST" });
      } catch {
      }
      window.location.href = "/";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-neutral-700 rounded w-1/2 mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-neutral-700 rounded w-1/3" })
    ] }) });
  }
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-amber-900/20 to-amber-800/20 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-amber-100 font-display", children: "Welcome back!" }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-300 text-lg", children: user.email })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSignOut,
          className: "bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg",
          children: "Sign Out"
        }
      )
    ] }),
    profile && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-neutral-400 font-medium", children: "Role:" }),
        /* @__PURE__ */ jsx("span", { className: `text-sm font-bold px-3 py-1.5 rounded-full ${profile.role === "admin" ? "bg-red-900/40 text-red-200 border border-red-700/50" : profile.role === "editor" ? "bg-amber-900/40 text-amber-200 border border-amber-700/50" : "bg-neutral-800/60 text-neutral-300 border border-neutral-700/50"}`, children: profile.role.charAt(0).toUpperCase() + profile.role.slice(1) })
      ] }),
      profile.role === "admin" && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/30 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-200 font-medium", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-red-100", children: "Admin Access:" }),
        " You can create, edit, and manage all content."
      ] }) }),
      profile.role === "editor" && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-200 font-medium", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-blue-100", children: "Editor Access:" }),
        " You can create and edit content."
      ] }) })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$Auth = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Auth;
  const url = new URL(Astro2.request.url);
  const error = url.searchParams.get("error");
  const reset = url.searchParams.get("reset");
  let user = null;
  let isAdmin = false;
  try {
    const supabase = supabaseServer(Astro2.cookies);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      user = authUser;
      const { data: userRoles } = await supabase.from("user_roles").select("role").eq("user_id", authUser.id).eq("role", "admin");
      isAdmin = Boolean(userRoles && userRoles.length > 0);
    }
  } catch (error2) {
  }
  return renderTemplate(_a || (_a = __template(["", ` <script type="module">
  // Hide loading fallback when component loads
  document.addEventListener('DOMContentLoaded', () => {
    const loadingEl = document.getElementById('auth-loading');
    if (loadingEl) {
      // Hide loading after a short delay to allow component to load
      setTimeout(() => {
        loadingEl.style.display = 'none';
      }, 1000);
    }
  });

  // Handle sign out button
  document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
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
        // Force redirect to auth page
        window.location.href = '/auth?message=signed-out';
      } else {
        
        alert('Sign out failed. Please try again.');
      }
    } catch (error) {
      
      // Force redirect even if API fails
      window.location.href = '/auth?message=signed-out';
    }
  });

  // Handle role-based redirects after authentication
  import { getSupabase } from '../lib/supabase-browser';

  // Get redirect URL from query params
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect') || '/';

  // Listen for auth changes
  const supabase = getSupabase();
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user && event === 'SIGNED_IN') {
      try {
        // Get user profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const isAdmin = profile?.role === 'admin' || profile?.role === 'editor';
        
        // Redirect based on role and original destination
        setTimeout(() => {
          if (redirectTo.includes('/admin-dashboard') || redirectTo.includes('/admin-login')) {
            // Admin trying to access admin area
            if (isAdmin) {
              window.location.href = redirectTo;
            } else {
              // Not admin, redirect to home with error
              window.location.href = '/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(redirectTo);
            }
          } else {
            // Regular user or admin going to regular page
            window.location.href = redirectTo;
          }
        }, 1500);
      } catch (error) {
        
        // Fallback redirect
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1500);
      }
    }
  });
<\/script>`])), renderComponent($$result, "Base", $$Base, { "title": "Sign In | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-2xl mx-auto"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display"> ${user ? "Welcome Back" : "Join the Remnant"} </h1> <p class="text-xl text-neutral-300 max-w-lg mx-auto leading-relaxed"> ${user ? `You're signed in as ${user.email}. ${isAdmin ? "You have admin access." : "Enjoy your member benefits!"}` : "Create an account to access exclusive content, save favorites, and connect with other believers."} </p> </div> <!-- Success Message --> ${reset === "success" && renderTemplate`<div class="mb-8 bg-green-900/20 border border-green-700/50 rounded-xl p-6 backdrop-blur-sm"> <div class="flex items-center gap-3"> <span class="text-green-400 text-xl">✅</span> <div> <h3 class="text-green-100 font-semibold mb-1">Password Updated Successfully!</h3> <p class="text-green-200 text-sm">
Your password has been updated. You can now sign in with your new password.
</p> </div> </div> </div>`} <!-- Error Message --> ${error && renderTemplate`<div class="mb-8 bg-red-900/20 border border-red-700/50 rounded-xl p-6 backdrop-blur-sm"> <div class="flex items-center gap-3"> <span class="text-red-400 text-xl">⚠️</span> <div> <h3 class="text-red-100 font-semibold mb-1"> ${error === "insufficient-permissions" ? "Insufficient Permissions" : error === "auth-failed" ? "Authentication Failed" : error === "role-check-failed" ? "Role Check Failed" : error === "session-expired" ? "Session Expired" : error === "auth-refresh-failed" ? "Session Refresh Failed" : error === "database-error" ? "Database Error" : error === "server-error" ? "Server Error" : "Authentication Error"} </h3> <p class="text-red-200 text-sm"> ${error === "insufficient-permissions" ? "You need admin or editor access to view this page. Contact an administrator if you believe this is an error." : error === "auth-failed" ? "There was an issue with your authentication. Please try signing in again." : error === "role-check-failed" ? "Unable to verify your user role. Please try signing in again or contact support." : error === "session-expired" ? "Your session has expired. Please sign in again." : error === "auth-refresh-failed" ? "Unable to refresh your session. Please sign in again." : error === "database-error" ? "Database connection issue. Please try again in a moment." : error === "server-error" ? "Server error occurred. Please try again or contact support." : "There was an issue with your authentication. Please try signing in again."} </p> ${error !== "insufficient-permissions" && renderTemplate`<div class="mt-3"> <button onclick="window.location.reload()" class="text-red-300 hover:text-red-100 text-sm underline">
Try Again
</button> </div>`} </div> </div> </div>`} <!-- User Profile (if signed in) --> ${user ? renderTemplate`<div class="mb-8"> ${renderComponent($$result2, "UserProfile", UserProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserProfile", "client:component-export": "default" })} <!-- Sign Out Button --> <div class="mt-6 mb-8"> <button id="sign-out-btn" class="w-full bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
Sign Out
</button> </div> <!-- Admin/User specific actions --> <div class="mt-8 grid md:grid-cols-2 gap-4"> ${isAdmin ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` <a href="/admin-dashboard" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">⚡</div> <div class="font-bold">Admin Dashboard</div> <div class="text-sm opacity-90">Manage content and users</div> </a> <a href="/admin" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">📝</div> <div class="font-bold">Content Management</div> <div class="text-sm opacity-90">Edit posts, videos, books</div> </a> ` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` <a href="/profile" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">👤</div> <div class="font-bold">My Profile</div> <div class="text-sm opacity-90">View and edit your profile</div> </a> <a href="/" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">🏠</div> <div class="font-bold">Go Home</div> <div class="text-sm opacity-90">Return to main site</div> </a> ` })}`} </div> </div>` : renderTemplate`<!-- Unified Auth Form (if not signed in) -->
                 <div id="auth-forms"> <div class="max-w-md mx-auto"> <!-- Loading fallback --> <div id="auth-loading" class="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl"> <div class="text-center"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div> <p class="text-neutral-300">Loading authentication...</p> </div> </div> ${renderComponent($$result2, "SimpleAuthForm", SimpleAuthForm, { "mode": "signin", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/SimpleAuthForm", "client:component-export": "default" })} </div> </div>`} <!-- Benefits --> <div class="mt-16 bg-gradient-to-r from-amber-900/10 to-amber-800/10 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm"> <h3 class="text-2xl font-bold text-amber-100 mb-6 text-center font-display">Why Create an Account?</h3> <div class="grid md:grid-cols-2 gap-6 text-neutral-300"> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Save Favorites</div> <div class="text-sm">Bookmark posts and videos for later</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Track Progress</div> <div class="text-sm">See what you've read and learned</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Exclusive Content</div> <div class="text-sm">Access member-only teachings</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Community</div> <div class="text-sm">Connect with other believers (coming soon)</div> </div> </div> </div> </div> <!-- Admin Note --> <div class="mt-12 bg-neutral-900/50 border border-neutral-700/50 rounded-xl p-6 backdrop-blur-sm"> <p class="text-sm text-neutral-300 text-center"> <strong class="text-amber-100">Content Creators:</strong> Need admin or editor access? 
          Contact the site administrator to get started.
</p> </div> </div> </div> </div> ` }));
}, "/Users/asjames18/Development/RRG Website/src/pages/auth.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/auth.astro";
const $$url = "/auth";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Auth,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
