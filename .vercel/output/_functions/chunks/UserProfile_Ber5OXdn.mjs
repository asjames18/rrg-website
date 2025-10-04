import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_rylPBTzj.mjs';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
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

export { UserProfile as U };
