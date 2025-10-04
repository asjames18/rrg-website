import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from './supabase_rylPBTzj.mjs';

function AuthForm({ mode, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
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
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Check your email for the confirmation link!"
        });
      } else if (currentMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Successfully signed in!"
        });
        onSuccess?.();
      } else if (currentMode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Password reset email sent!"
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    setMessage(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  const clearMessage = () => {
    if (message) {
      setMessage(null);
    }
  };
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
      currentMode === "signup" && "Create Your Account",
      currentMode === "reset" && "Reset Your Password"
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-neutral-200 mb-2", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => {
              setEmail(e.target.value);
              clearMessage();
            },
            required: true,
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
            value: password,
            onChange: (e) => {
              setPassword(e.target.value);
              clearMessage();
            },
            required: true,
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
            value: confirmPassword,
            onChange: (e) => {
              setConfirmPassword(e.target.value);
              clearMessage();
            },
            required: true,
            className: "w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200",
            placeholder: "••••••••"
          }
        )
      ] }),
      message && /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-900/20 border border-green-600/30 text-green-200" : "bg-red-900/20 border border-red-600/30 text-red-200"}`, children: message.text }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg hover:shadow-xl disabled:shadow-none",
          children: loading ? "Loading..." : currentMode === "signin" ? "Sign In" : currentMode === "signup" ? "Create Account" : "Send Reset Email"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center", children: [
      currentMode === "signin" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-400", children: [
        "New to Real & Raw Gospel?",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("signup"),
            className: "text-amber-400 hover:text-amber-300 ml-1 font-medium underline hover:no-underline transition-all duration-200",
            children: "Create an account"
          }
        )
      ] }),
      currentMode === "signup" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-400", children: [
        "Already have an account?",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("signin"),
            className: "text-amber-400 hover:text-amber-300 ml-1 font-medium underline hover:no-underline transition-all duration-200",
            children: "Sign in"
          }
        )
      ] }),
      currentMode === "reset" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-400", children: [
        "Remember your password?",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("signin"),
            className: "text-amber-400 hover:text-amber-300 ml-1 font-medium underline hover:no-underline transition-all duration-200",
            children: "Sign in"
          }
        )
      ] }),
      currentMode === "signin" && /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400 mt-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => switchMode("reset"),
          className: "text-neutral-400 hover:text-neutral-200 font-medium underline hover:no-underline transition-all duration-200",
          children: "Forgot your password?"
        }
      ) })
    ] })
  ] });
}

export { AuthForm as A };
