import { c as createComponent, b as createAstro, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead, F as Fragment$1 } from '../chunks/astro/server_BKIoqdNA.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_Bd7Ja63m.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../chunks/supabase_B6EMrqat.mjs';
import { U as UserProfile } from '../chunks/UserProfile_xFc-1SSw.mjs';
import { s as supabaseServer } from '../chunks/supabase-server_ssb-PSP4.mjs';
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
    if (typeof window !== "undefined" && supabase) {
      console.log("SimpleAuthForm: Supabase client available");
      setIsInitialized(true);
    } else {
      console.error("SimpleAuthForm: Supabase client not available");
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
      const { data: adminCheck } = await supabase.rpc("is_admin");
      isAdmin = adminCheck || false;
    }
  } catch (error2) {
    console.error("Auth check error:", error2);
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Sign In | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-2xl mx-auto"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display"> ${user ? "Welcome Back" : "Join the Remnant"} </h1> <p class="text-xl text-neutral-300 max-w-lg mx-auto leading-relaxed"> ${user ? `You're signed in as ${user.email}. ${isAdmin ? "You have admin access." : "Enjoy your member benefits!"}` : "Create an account to access exclusive content, save favorites, and connect with other believers."} </p> </div> <!-- Success Message --> ${reset === "success" && renderTemplate`<div class="mb-8 bg-green-900/20 border border-green-700/50 rounded-xl p-6 backdrop-blur-sm"> <div class="flex items-center gap-3"> <span class="text-green-400 text-xl">✅</span> <div> <h3 class="text-green-100 font-semibold mb-1">Password Updated Successfully!</h3> <p class="text-green-200 text-sm">
Your password has been updated. You can now sign in with your new password.
</p> </div> </div> </div>`} <!-- Error Message --> ${error && renderTemplate`<div class="mb-8 bg-red-900/20 border border-red-700/50 rounded-xl p-6 backdrop-blur-sm"> <div class="flex items-center gap-3"> <span class="text-red-400 text-xl">⚠️</span> <div> <h3 class="text-red-100 font-semibold mb-1"> ${error === "insufficient-permissions" ? "Insufficient Permissions" : "Authentication Error"} </h3> <p class="text-red-200 text-sm"> ${error === "insufficient-permissions" ? "You need admin or editor access to view this page. Contact an administrator if you believe this is an error." : "There was an issue with your authentication. Please try signing in again."} </p> </div> </div> </div>`} <!-- User Profile (if signed in) --> ${user ? renderTemplate`<div class="mb-8"> ${renderComponent($$result2, "UserProfile", UserProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserProfile", "client:component-export": "default" })} <!-- Sign Out Button --> <div class="mt-6 mb-8"> <button id="signout-btn" class="w-full bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
Sign Out
</button> </div> <!-- Admin/User specific actions --> <div class="mt-8 grid md:grid-cols-2 gap-4"> ${isAdmin ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` <a href="/admin-dashboard" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">⚡</div> <div class="font-bold">Admin Dashboard</div> <div class="text-sm opacity-90">Manage content and users</div> </a> <a href="/admin" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">📝</div> <div class="font-bold">Content Management</div> <div class="text-sm opacity-90">Edit posts, videos, books</div> </a> ` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` <a href="/profile" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">👤</div> <div class="font-bold">My Profile</div> <div class="text-sm opacity-90">View and edit your profile</div> </a> <a href="/" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">🏠</div> <div class="font-bold">Go Home</div> <div class="text-sm opacity-90">Return to main site</div> </a> ` })}`} </div> </div>` : renderTemplate`<!-- Unified Auth Form (if not signed in) -->
                 <div id="auth-forms"> <div class="max-w-md mx-auto"> <!-- Loading fallback --> <div id="auth-loading" class="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-8 shadow-2xl"> <div class="text-center"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div> <p class="text-neutral-300">Loading authentication...</p> </div> </div> ${renderComponent($$result2, "SimpleAuthForm", SimpleAuthForm, { "mode": "signin", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/SimpleAuthForm", "client:component-export": "default" })} </div> </div>`} <!-- Benefits --> <div class="mt-16 bg-gradient-to-r from-amber-900/10 to-amber-800/10 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm"> <h3 class="text-2xl font-bold text-amber-100 mb-6 text-center font-display">Why Create an Account?</h3> <div class="grid md:grid-cols-2 gap-6 text-neutral-300"> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Save Favorites</div> <div class="text-sm">Bookmark posts and videos for later</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Track Progress</div> <div class="text-sm">See what you've read and learned</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Exclusive Content</div> <div class="text-sm">Access member-only teachings</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Community</div> <div class="text-sm">Connect with other believers (coming soon)</div> </div> </div> </div> </div> <!-- Admin Note --> <div class="mt-12 bg-neutral-900/50 border border-neutral-700/50 rounded-xl p-6 backdrop-blur-sm"> <p class="text-sm text-neutral-300 text-center"> <strong class="text-amber-100">Content Creators:</strong> Need admin or editor access? 
          Contact the site administrator to get started.
</p> </div> </div> </div> </div> ` })} ${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/auth.astro?astro&type=script&index=0&lang.ts")}`;
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
