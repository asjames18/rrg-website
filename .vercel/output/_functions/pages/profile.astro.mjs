import { c as createComponent, e as renderTemplate, d as renderComponent, af as maybeRenderHead } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_DbhHLVHB.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getSupabase } from '../chunks/supabase-browser_DW5nxn7W.mjs';
export { renderers } from '../renderers.mjs';

function ProfileCard({ showActions = true, className = "" }) {
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
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (profileData && !profileError) {
        console.log("[ProfileCard] Profile found:", profileData);
        setProfile(profileData);
      } else {
        console.warn("[ProfileCard] Profile query failed, trying user_roles table:", profileError);
        const { data: userRoles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", userId);
        if (userRoles && userRoles.length > 0 && !rolesError) {
          console.log("[ProfileCard] User roles found:", userRoles);
          setProfile({
            id: userId,
            email: currentUser?.email || user?.email || "",
            display_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split("@")[0] || user?.email || "User",
            role: userRoles[0].role,
            status: "active",
            created_at: currentUser?.created_at || (/* @__PURE__ */ new Date()).toISOString()
          });
        } else {
          console.warn("[ProfileCard] User roles query also failed, using default:", rolesError);
          setProfile({
            id: userId,
            email: currentUser?.email || user?.email || "",
            display_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split("@")[0] || user?.email || "User",
            role: "user",
            status: "active",
            created_at: currentUser?.created_at || (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
    } catch (error) {
      console.error("[ProfileCard] Error fetching profile:", error);
      const supabase = getSupabase();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setProfile({
        id: userId,
        email: currentUser?.email || user?.email || "",
        display_name: currentUser?.user_metadata?.display_name || currentUser?.email?.split("@")[0] || "User",
        role: "user",
        status: "active",
        created_at: currentUser?.created_at || (/* @__PURE__ */ new Date()).toISOString()
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    try {
      console.log("[ProfileCard] Sign out clicked");
      const supabase = getSupabase();
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (/* @__PURE__ */ new Date()).toUTCString() + ";path=/");
        });
        if (window.__supabaseClient) {
          delete window.__supabaseClient;
        }
      }
      await fetch("/api/auth/signout", { method: "POST" }).catch(() => {
      });
      console.log("[ProfileCard] Sign out complete, redirecting to home");
      window.location.href = "/";
    } catch (error) {
      console.error("[ProfileCard] Sign out error:", error);
      window.location.href = "/";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: `bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-neutral-700 rounded w-1/2 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-neutral-700 rounded w-1/3 mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-neutral-700 rounded w-1/4" })
    ] }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: `bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 text-center ${className}`, children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-amber-100 mb-2", children: "Not Signed In" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 mb-4", children: "Sign in to view your profile" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/auth",
          className: "inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors",
          children: "Sign In"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: `bg-gradient-to-r from-amber-900/20 to-amber-800/20 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-amber-100 font-display mb-2", children: "Welcome back!" }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-300 text-lg mb-4", children: user.email }),
        profile && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-neutral-400 font-medium", children: "Role:" }),
          /* @__PURE__ */ jsx("span", { className: `text-sm font-bold px-3 py-1.5 rounded-full ${profile.role === "admin" ? "bg-red-900/40 text-red-200 border border-red-700/50" : profile.role === "editor" ? "bg-amber-900/40 text-amber-200 border border-amber-700/50" : "bg-neutral-800/60 text-neutral-300 border border-neutral-700/50"}`, children: profile.role.charAt(0).toUpperCase() + profile.role.slice(1) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-neutral-400", children: [
          "Member since ",
          new Date(user.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long"
          })
        ] })
      ] }),
      showActions && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/profile",
            className: "bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg text-center",
            children: "View Profile"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSignOut,
            className: "bg-red-900/40 hover:bg-red-800/40 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg",
            children: "Sign Out"
          }
        )
      ] })
    ] }),
    profile && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      profile.role === "admin" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/30 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-200 font-medium", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-red-100", children: "Admin Access:" }),
        " You can create, edit, and manage all content."
      ] }) }),
      profile.role === "editor" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-200 font-medium", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-blue-100", children: "Editor Access:" }),
        " You can create and edit content."
      ] }) }),
      profile.role === "viewer" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700/30 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-200 font-medium", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-green-100", children: "Member Access:" }),
        " You can view all content and save favorites."
      ] }) })
    ] })
  ] });
}

function UserActivity() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    postsRead: 0,
    videosWatched: 0,
    favoritesSaved: 0,
    totalTimeSpent: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  useEffect(() => {
    fetchActivityData();
  }, [pagination.page, filterType]);
  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      });
      if (filterType && filterType !== "all") {
        params.append("type", filterType);
      }
      const response = await fetch(`/api/user/activity?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities || []);
        setStats(data.summary || stats);
        setPagination((prev) => ({
          ...prev,
          ...data.pagination
        }));
      }
    } catch (error) {
      console.error("Error fetching activity data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return "🔐";
      case "post_read":
        return "📖";
      case "video_watched":
        return "🎥";
      case "favorite_saved":
        return "⭐";
      case "profile_updated":
        return "✏️";
      case "preferences_updated":
        return "⚙️";
      case "password_changed":
        return "🔒";
      default:
        return "📝";
    }
  };
  const getActivityColor = (type) => {
    switch (type) {
      case "login":
        return "bg-green-500";
      case "post_read":
        return "bg-blue-500";
      case "video_watched":
        return "bg-purple-500";
      case "favorite_saved":
        return "bg-yellow-500";
      case "profile_updated":
      case "preferences_updated":
        return "bg-amber-500";
      case "password_changed":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };
  const nextPage = () => {
    if (pagination.hasMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };
  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };
  if (loading && activities.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-neutral-700 rounded w-1/3 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-24 bg-neutral-800 rounded" }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-neutral-800 rounded" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100 mb-1", children: stats.postsRead }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Posts Read" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100 mb-1", children: stats.videosWatched }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Videos Watched" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100 mb-1", children: stats.favoritesSaved }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Favorites" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-amber-100 mb-1", children: [
          stats.totalTimeSpent,
          "m"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Time Spent" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400 font-medium", children: "Filter by:" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: filterType,
          onChange: (e) => {
            setFilterType(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          },
          className: "bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500",
          children: [
            /* @__PURE__ */ jsx("option", { value: "all", children: "All Activity" }),
            /* @__PURE__ */ jsx("option", { value: "post_read", children: "Posts Read" }),
            /* @__PURE__ */ jsx("option", { value: "video_watched", children: "Videos Watched" }),
            /* @__PURE__ */ jsx("option", { value: "favorite_saved", children: "Favorites" }),
            /* @__PURE__ */ jsx("option", { value: "profile_updated", children: "Profile Updates" }),
            /* @__PURE__ */ jsx("option", { value: "login", children: "Logins" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4 font-display", children: "Recent Activity" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: activities.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        activities.map((activity) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${getActivityColor(activity.activity_type)}`, children: getActivityIcon(activity.activity_type) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-neutral-200 font-medium truncate", children: activity.description }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400", children: formatTimestamp(activity.created_at) })
          ] })
        ] }, activity.id)),
        pagination.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: prevPage,
              disabled: pagination.page === 1,
              className: "px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors text-sm",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-neutral-400", children: [
            "Page ",
            pagination.page,
            " of ",
            pagination.totalPages,
            " (",
            pagination.total,
            " total)"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: nextPage,
              disabled: !pagination.hasMore,
              className: "px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors text-sm",
              children: "Next"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-neutral-400", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📝" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium mb-2", children: "No activity yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Start exploring content to see your activity here" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4 font-display", children: "Quick Actions" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/blog",
            className: "flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:bg-neutral-800/70 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xl", children: "📖" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: "Read Latest Posts" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Explore our teachings" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/videos",
            className: "flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:bg-neutral-800/70 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xl", children: "🎥" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: "Watch Videos" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Learn from our teachings" })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}

function UserDetailModal({ user, onClose, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    role: user.role,
    status: user.status,
    display_name: user.display_name || ""
  });
  useEffect(() => {
    fetchUserDetails();
  }, [user.id]);
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Update failed");
      }
      setEditing(false);
      onUpdate();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update user");
    }
  };
  const handleDelete = async (permanent) => {
    const confirmMsg = permanent ? "Are you sure you want to PERMANENTLY delete this user? This cannot be undone." : "Are you sure you want to soft delete this user? They can be restored later.";
    if (!confirm(confirmMsg)) return;
    try {
      const url = permanent ? `/api/admin/users/${user.id}?permanent=true` : `/api/admin/users/${user.id}`;
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Delete failed");
      }
      onUpdate();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete user");
    }
  };
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-neutral-900 border border-neutral-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto",
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-amber-100", children: "User Details" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "text-neutral-400 hover:text-neutral-200 transition-colors",
              children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-neutral-200 mb-4", children: "User Information" }),
            /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400", children: "Email" }),
                /* @__PURE__ */ jsx("div", { className: "text-neutral-200", children: user.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400", children: "Display Name" }),
                editing ? /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: formData.display_name,
                    onChange: (e) => setFormData({ ...formData, display_name: e.target.value }),
                    className: "w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "text-neutral-200", children: user.display_name || "Not set" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400", children: "Role" }),
                editing ? /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.role,
                    onChange: (e) => setFormData({ ...formData, role: e.target.value }),
                    className: "w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "viewer", children: "Viewer" }),
                      /* @__PURE__ */ jsx("option", { value: "editor", children: "Editor" }),
                      /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
                    ]
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "text-neutral-200 capitalize", children: user.role })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400", children: "Status" }),
                editing ? /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.status,
                    onChange: (e) => setFormData({ ...formData, status: e.target.value }),
                    className: "w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
                      /* @__PURE__ */ jsx("option", { value: "suspended", children: "Suspended" }),
                      /* @__PURE__ */ jsx("option", { value: "deleted", children: "Deleted" })
                    ]
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "text-neutral-200 capitalize", children: user.status })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400", children: "Member Since" }),
                /* @__PURE__ */ jsx("div", { className: "text-neutral-200", children: new Date(user.created_at).toLocaleDateString() })
              ] }),
              user.last_login && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm text-neutral-400", children: "Last Login" }),
                /* @__PURE__ */ jsx("div", { className: "text-neutral-200", children: formatTimestamp(user.last_login) })
              ] })
            ] })
          ] }),
          !loading && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-neutral-200 mb-4", children: "Activity Stats" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100", children: stats.totalActivities || 0 }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Total Actions" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100", children: stats.loginCount || 0 }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Logins" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100", children: stats.postsRead || 0 }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Posts Read" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100", children: stats.videosWatched || 0 }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Videos Watched" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-neutral-200 mb-4", children: "Recent Activity" }),
            /* @__PURE__ */ jsx("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg max-h-64 overflow-y-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-neutral-400", children: "Loading..." }) : activities.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-neutral-700", children: activities.map((activity) => /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-300", children: activity.description }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-neutral-500 mt-1", children: formatTimestamp(activity.created_at) })
            ] }, activity.id)) }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-neutral-400", children: "No activity yet" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-3 pt-4 border-t border-neutral-800", children: editing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setEditing(false),
                className: "flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-lg transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleUpdate,
                className: "flex-1 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors",
                children: "Save Changes"
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setEditing(true),
                className: "flex-1 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors",
                children: "Edit User"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(false),
                className: "flex-1 bg-yellow-900/50 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-200 py-3 rounded-lg transition-colors",
                children: "Soft Delete"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(true),
                className: "flex-1 bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-200 py-3 rounded-lg transition-colors",
                children: "Permanent Delete"
              }
            )
          ] }) })
        ] })
      ]
    }
  ) });
}

function BulkActionBar({ selectedCount, onBulkAction, onClear }) {
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const handleAction = async (actionType, params) => {
    if (actionType === "delete" || actionType === "change_status") {
      setConfirmAction({ action: actionType, params });
      setShowConfirm(true);
      return;
    }
    await executeAction(actionType, params);
  };
  const executeAction = async (actionType, params) => {
    try {
      setLoading(true);
      const result = await onBulkAction(actionType, params);
      alert(`Success! ${result.affectedCount} user(s) updated.`);
      setAction("");
      setShowConfirm(false);
      setConfirmAction(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Bulk action failed");
    } finally {
      setLoading(false);
    }
  };
  const confirmAndExecute = async () => {
    if (confirmAction) {
      await executeAction(confirmAction.action, confirmAction.params);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-amber-200 font-semibold", children: [
          selectedCount,
          " user",
          selectedCount !== 1 ? "s" : "",
          " selected"
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: action,
            onChange: (e) => setAction(e.target.value),
            disabled: loading,
            className: "px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Choose action..." }),
              /* @__PURE__ */ jsxs("optgroup", { label: "Role Changes", children: [
                /* @__PURE__ */ jsx("option", { value: "role_admin", children: "Change to Admin" }),
                /* @__PURE__ */ jsx("option", { value: "role_editor", children: "Change to Editor" }),
                /* @__PURE__ */ jsx("option", { value: "role_viewer", children: "Change to Viewer" })
              ] }),
              /* @__PURE__ */ jsxs("optgroup", { label: "Status Changes", children: [
                /* @__PURE__ */ jsx("option", { value: "status_active", children: "Set as Active" }),
                /* @__PURE__ */ jsx("option", { value: "status_suspended", children: "Suspend" }),
                /* @__PURE__ */ jsx("option", { value: "status_deleted", children: "Soft Delete" })
              ] }),
              /* @__PURE__ */ jsxs("optgroup", { label: "Delete", children: [
                /* @__PURE__ */ jsx("option", { value: "delete_soft", children: "Soft Delete" }),
                /* @__PURE__ */ jsx("option", { value: "delete_permanent", children: "Permanent Delete" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (!action) return;
              const [category, value] = action.split("_");
              switch (category) {
                case "role":
                  handleAction("change_role", { role: value });
                  break;
                case "status":
                  handleAction("change_status", { status: value });
                  break;
                case "delete":
                  handleAction("delete", { permanent: value === "permanent" });
                  break;
              }
            },
            disabled: !action || loading,
            className: "px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors",
            children: loading ? "Processing..." : "Apply"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClear,
          disabled: loading,
          className: "text-neutral-400 hover:text-neutral-200 text-sm transition-colors",
          children: "Clear Selection"
        }
      )
    ] }) }),
    showConfirm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Confirm Bulk Action" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-300 mb-6", children: confirmAction?.action === "delete" ? confirmAction.params?.permanent ? `Are you sure you want to PERMANENTLY delete ${selectedCount} user(s)? This action cannot be undone.` : `Are you sure you want to soft delete ${selectedCount} user(s)? They can be restored later.` : `Are you sure you want to update ${selectedCount} user(s)?` }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setShowConfirm(false);
              setConfirmAction(null);
            },
            disabled: loading,
            className: "flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-lg transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmAndExecute,
            disabled: loading,
            className: "flex-1 bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg transition-colors",
            children: loading ? "Processing..." : "Confirm"
          }
        )
      ] })
    ] }) })
  ] });
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortBy, setSortBy] = useState("created_at");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [selectedUsers, setSelectedUsers] = useState(/* @__PURE__ */ new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [detailModalUser, setDetailModalUser] = useState(null);
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter, statusFilter, sortBy]);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sort: sortBy
      });
      if (search) params.append("search", search);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }
      setUsers(data.users || []);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  const handleSearchChange = (value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const toggleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === users.length);
  };
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(/* @__PURE__ */ new Set());
      setSelectAll(false);
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
      setSelectAll(true);
    }
  };
  const handleBulkAction = async (action, params) => {
    try {
      const response = await fetch("/api/admin/users/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          userIds: Array.from(selectedUsers),
          ...params
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Bulk action failed");
      }
      setSelectedUsers(/* @__PURE__ */ new Set());
      setSelectAll(false);
      await fetchUsers();
      return data;
    } catch (error2) {
      throw error2;
    }
  };
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      const response = await fetch(`/api/admin/users/export?${params.toString()}`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Export failed");
    }
  };
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-900/30 text-red-200 border-red-700";
      case "editor":
        return "bg-amber-900/30 text-amber-200 border-amber-700";
      case "viewer":
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-900/30 text-green-200 border-green-700";
      case "suspended":
        return "bg-yellow-900/30 text-yellow-200 border-yellow-700";
      case "deleted":
        return "bg-red-900/30 text-red-200 border-red-700";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };
  if (loading && users.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-neutral-700 rounded w-1/3 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-neutral-800 rounded" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100", children: "User Management" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchUsers,
            className: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded text-sm transition-colors",
            children: "↻ Refresh"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleExport,
            className: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded text-sm transition-colors",
            children: "⬇ Export CSV"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search by email or name...",
          value: search,
          onChange: (e) => handleSearchChange(e.target.value),
          className: "col-span-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: roleFilter,
          onChange: (e) => {
            setRoleFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          },
          className: "px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500",
          children: [
            /* @__PURE__ */ jsx("option", { value: "all", children: "All Roles" }),
            /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" }),
            /* @__PURE__ */ jsx("option", { value: "editor", children: "Editor" }),
            /* @__PURE__ */ jsx("option", { value: "viewer", children: "Viewer" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: statusFilter,
          onChange: (e) => {
            setStatusFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          },
          className: "px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500",
          children: [
            /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
            /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ jsx("option", { value: "suspended", children: "Suspended" }),
            /* @__PURE__ */ jsx("option", { value: "deleted", children: "Deleted" })
          ]
        }
      )
    ] }),
    selectedUsers.size > 0 && /* @__PURE__ */ jsx(
      BulkActionBar,
      {
        selectedCount: selectedUsers.size,
        onBulkAction: handleBulkAction,
        onClear: () => {
          setSelectedUsers(/* @__PURE__ */ new Set());
          setSelectAll(false);
        }
      }
    ),
    error && /* @__PURE__ */ jsx("div", { className: "p-3 rounded mb-4 bg-red-900/30 border border-red-700 text-red-200", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 text-sm text-neutral-400", children: [
      pagination.total,
      " total user",
      pagination.total !== 1 ? "s" : "",
      selectedUsers.size > 0 && ` • ${selectedUsers.size} selected`
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4 px-4 py-2 bg-neutral-800/50 rounded text-sm font-semibold text-neutral-400", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-1 flex items-center", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: selectAll,
            onChange: toggleSelectAll,
            className: "w-4 h-4 rounded border-neutral-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Email / Name" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Role" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Status" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Joined" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1", children: "Actions" })
      ] }),
      users.map((user) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4 items-center px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-800/80 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-1", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: selectedUsers.has(user.id),
            onChange: () => toggleSelectUser(user.id),
            className: "w-4 h-4 rounded border-neutral-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-4", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: user.email }),
          user.display_name && /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: user.display_name })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded border ${getRoleColor(user.role)}`, children: user.role.charAt(0).toUpperCase() + user.role.slice(1) }) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded border ${getStatusColor(user.status)}`, children: user.status.charAt(0).toUpperCase() + user.status.slice(1) }) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2 text-sm text-neutral-400", children: new Date(user.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDetailModalUser(user),
            className: "text-amber-500 hover:text-amber-400 text-sm font-medium",
            children: "View"
          }
        ) })
      ] }, user.id)),
      users.length === 0 && !loading && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-neutral-400", children: "No users found" })
    ] }),
    pagination.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-neutral-800", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPagination((prev) => ({ ...prev, page: prev.page - 1 })),
          disabled: pagination.page === 1,
          className: "px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded transition-colors",
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-neutral-400", children: [
        "Page ",
        pagination.page,
        " of ",
        pagination.totalPages
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPagination((prev) => ({ ...prev, page: prev.page + 1 })),
          disabled: !pagination.hasMore,
          className: "px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded transition-colors",
          children: "Next"
        }
      )
    ] }),
    detailModalUser && /* @__PURE__ */ jsx(
      UserDetailModal,
      {
        user: detailModalUser,
        onClose: () => setDetailModalUser(null),
        onUpdate: fetchUsers
      }
    )
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", " <script type=\"module\">\n  // Tab switching functionality\n  document.addEventListener('DOMContentLoaded', () => {\n    console.log('[Profile Page] Initializing tabs...');\n    \n    const tabs = ['profile', 'activity', 'preferences', 'admin'];\n    const tabButtons = tabs.map(id => document.getElementById(`${id}-tab`));\n    const tabContents = tabs.map(id => document.getElementById(`${id}-content`));\n\n    console.log('[Profile Page] Tab buttons found:', tabButtons.filter(b => b).length);\n    console.log('[Profile Page] Tab contents found:', tabContents.filter(c => c).length);\n\n    // Tab click handlers\n    tabButtons.forEach((button, index) => {\n      if (!button) {\n        console.warn(`[Profile Page] Tab button not found for: ${tabs[index]}`);\n        return;\n      }\n      \n      button.addEventListener('click', () => {\n        console.log(`[Profile Page] Tab clicked: ${tabs[index]}`);\n        \n        // Remove active state from all tabs\n        tabButtons.forEach(btn => {\n          btn?.classList.remove('bg-amber-600', 'text-white', 'shadow-lg');\n          btn?.classList.add('text-neutral-400', 'hover:text-neutral-200');\n        });\n        \n        // Hide all content\n        tabContents.forEach(content => {\n          content?.classList.add('hidden');\n        });\n\n        // Activate clicked tab\n        button.classList.add('bg-amber-600', 'text-white', 'shadow-lg');\n        button.classList.remove('text-neutral-400', 'hover:text-neutral-200');\n        tabContents[index]?.classList.remove('hidden');\n\n        // Load preferences when switching to preferences tab\n        if (tabs[index] === 'preferences') {\n          loadPreferences();\n        }\n        \n        console.log(`[Profile Page] Now showing: ${tabs[index]}`);\n      });\n    });\n\n    console.log('[Profile Page] Tab click handlers attached');\n\n    // Load user profile data (don't let this block tab functionality)\n    loadUserProfile().catch(err => {\n      console.error('[Profile Page] Error in loadUserProfile:', err);\n    });\n    \n    setupPasswordChange();\n    setupPreferencesSave();\n    \n    console.log('[Profile Page] Initialization complete');\n  });\n\n  async function loadUserProfile() {\n    try {\n      const { getSupabase } = await import('../lib/supabase-browser.ts');\n      const supabase = getSupabase();\n\n      const { data: { user } } = await supabase.auth.getUser();\n      \n      if (user) {\n        console.log('[Profile Page] User found:', user.email);\n        \n        // Populate profile fields\n        const emailField = document.getElementById('profile-email');\n        const createdField = document.getElementById('profile-created');\n        \n        if (emailField) emailField.value = user.email || '';\n        if (createdField) {\n          const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {\n            year: 'numeric',\n            month: 'long',\n            day: 'numeric'\n          });\n          createdField.value = createdDate;\n        }\n\n        // Check if user is admin and show admin tab - use maybeSingle to handle missing profile\n        const { data: profile, error: profileError } = await supabase\n          .from('profiles')\n          .select('role')\n          .eq('id', user.id)\n          .maybeSingle();\n\n        if (profileError) {\n          console.warn('[Profile Page] Could not fetch profile from profiles table:', profileError);\n          \n          // Try user_roles table as fallback\n          const { data: userRoles } = await supabase\n            .from('user_roles')\n            .select('role')\n            .eq('user_id', user.id);\n            \n          if (userRoles && userRoles.some(r => r.role === 'admin')) {\n            const adminTab = document.getElementById('admin-tab');\n            adminTab?.classList.remove('hidden');\n            console.log('[Profile Page] Admin tab shown (from user_roles)');\n          }\n        } else if (profile?.role === 'admin') {\n          const adminTab = document.getElementById('admin-tab');\n          adminTab?.classList.remove('hidden');\n          console.log('[Profile Page] Admin tab shown (from profiles)');\n        }\n      } else {\n        console.log('[Profile Page] No user found, redirecting to auth');\n        // Redirect to auth page if not signed in\n        window.location.href = '/auth';\n      }\n    } catch (error) {\n      console.error('[Profile Page] Error loading user profile:', error);\n      // Don't stop execution - tabs should still work\n    }\n  }\n\n  // Password Change Modal\n  function setupPasswordChange() {\n    const modal = document.getElementById('password-modal');\n    const openBtn = document.getElementById('change-password-btn');\n    const closeBtn = document.getElementById('close-password-modal');\n    const cancelBtn = document.getElementById('cancel-password-change');\n    const form = document.getElementById('password-change-form');\n    const errorDiv = document.getElementById('password-error');\n    const successDiv = document.getElementById('password-success');\n\n    openBtn?.addEventListener('click', () => {\n      modal?.classList.remove('hidden');\n      form?.reset();\n      errorDiv?.classList.add('hidden');\n      successDiv?.classList.add('hidden');\n    });\n\n    const closeModal = () => {\n      modal?.classList.add('hidden');\n    };\n\n    closeBtn?.addEventListener('click', closeModal);\n    cancelBtn?.addEventListener('click', closeModal);\n\n    // Close modal on outside click\n    modal?.addEventListener('click', (e) => {\n      if (e.target === modal) closeModal();\n    });\n\n    form?.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      \n      const newPassword = document.getElementById('new-password')?.value;\n      const confirmPassword = document.getElementById('confirm-password')?.value;\n      const submitBtn = document.getElementById('submit-password-change');\n\n      errorDiv?.classList.add('hidden');\n      successDiv?.classList.add('hidden');\n\n      // Validate passwords match\n      if (newPassword !== confirmPassword) {\n        if (errorDiv) errorDiv.textContent = 'Passwords do not match';\n        errorDiv?.classList.remove('hidden');\n        return;\n      }\n\n      // Validate password strength\n      if (newPassword.length < 8) {\n        if (errorDiv) errorDiv.textContent = 'Password must be at least 8 characters long';\n        errorDiv?.classList.remove('hidden');\n        return;\n      }\n\n      if (!/[\\d\\W]/.test(newPassword)) {\n        if (errorDiv) errorDiv.textContent = 'Password must contain at least one number or special character';\n        errorDiv?.classList.remove('hidden');\n        return;\n      }\n\n      // Show loading state\n      if (submitBtn) {\n        submitBtn.textContent = 'Changing...';\n        submitBtn.setAttribute('disabled', 'true');\n      }\n\n      try {\n        const response = await fetch('/api/user/change-password', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ newPassword })\n        });\n\n        const data = await response.json();\n\n        if (!response.ok) {\n          throw new Error(data.error || 'Failed to change password');\n        }\n\n        if (successDiv) successDiv.textContent = '\u2713 Password changed successfully';\n        successDiv?.classList.remove('hidden');\n        \n        // Reset form and close modal after 2 seconds\n        setTimeout(() => {\n          form?.reset();\n          closeModal();\n        }, 2000);\n\n      } catch (error) {\n        if (errorDiv) errorDiv.textContent = error instanceof Error ? error.message : 'Failed to change password';\n        errorDiv?.classList.remove('hidden');\n      } finally {\n        if (submitBtn) {\n          submitBtn.textContent = 'Change Password';\n          submitBtn.removeAttribute('disabled');\n        }\n      }\n    });\n  }\n\n  // Load and Save Preferences\n  async function loadPreferences() {\n    try {\n      const response = await fetch('/api/user/preferences');\n      const data = await response.json();\n\n      if (data.preferences) {\n        const prefs = data.preferences;\n        \n        const themeSelect = document.getElementById('pref-theme');\n        const sacredNamesCheckbox = document.getElementById('pref-sacred-names');\n        const emailNotifsCheckbox = document.getElementById('pref-email-notifs');\n\n        if (themeSelect) themeSelect.value = prefs.theme || 'dark';\n        if (sacredNamesCheckbox) sacredNamesCheckbox.checked = prefs.show_sacred_names !== false;\n        if (emailNotifsCheckbox) emailNotifsCheckbox.checked = prefs.email_notifications !== false;\n      }\n    } catch (error) {\n      console.error('Failed to load preferences:', error);\n    }\n  }\n\n  function setupPreferencesSave() {\n    const saveBtn = document.getElementById('save-preferences-btn');\n    const successDiv = document.getElementById('preferences-success');\n\n    saveBtn?.addEventListener('click', async () => {\n      const themeSelect = document.getElementById('pref-theme');\n      const sacredNamesCheckbox = document.getElementById('pref-sacred-names');\n      const emailNotifsCheckbox = document.getElementById('pref-email-notifs');\n\n      const preferences = {\n        theme: themeSelect?.value || 'dark',\n        show_sacred_names: sacredNamesCheckbox?.checked || false,\n        email_notifications: emailNotifsCheckbox?.checked || false\n      };\n\n      // Show loading state\n      if (saveBtn) {\n        saveBtn.textContent = 'Saving...';\n        saveBtn.setAttribute('disabled', 'true');\n      }\n\n      try {\n        const response = await fetch('/api/user/preferences', {\n          method: 'PUT',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify(preferences)\n        });\n\n        const data = await response.json();\n\n        if (!response.ok) {\n          throw new Error(data.error || 'Failed to save preferences');\n        }\n\n        // Show success message\n        successDiv?.classList.remove('hidden');\n        setTimeout(() => {\n          successDiv?.classList.add('hidden');\n        }, 3000);\n\n      } catch (error) {\n        alert(error instanceof Error ? error.message : 'Failed to save preferences');\n      } finally {\n        if (saveBtn) {\n          saveBtn.textContent = 'Save Preferences';\n          saveBtn.removeAttribute('disabled');\n        }\n      }\n    });\n  }\n<\/script>"], ["", " <script type=\"module\">\n  // Tab switching functionality\n  document.addEventListener('DOMContentLoaded', () => {\n    console.log('[Profile Page] Initializing tabs...');\n    \n    const tabs = ['profile', 'activity', 'preferences', 'admin'];\n    const tabButtons = tabs.map(id => document.getElementById(\\`\\${id}-tab\\`));\n    const tabContents = tabs.map(id => document.getElementById(\\`\\${id}-content\\`));\n\n    console.log('[Profile Page] Tab buttons found:', tabButtons.filter(b => b).length);\n    console.log('[Profile Page] Tab contents found:', tabContents.filter(c => c).length);\n\n    // Tab click handlers\n    tabButtons.forEach((button, index) => {\n      if (!button) {\n        console.warn(\\`[Profile Page] Tab button not found for: \\${tabs[index]}\\`);\n        return;\n      }\n      \n      button.addEventListener('click', () => {\n        console.log(\\`[Profile Page] Tab clicked: \\${tabs[index]}\\`);\n        \n        // Remove active state from all tabs\n        tabButtons.forEach(btn => {\n          btn?.classList.remove('bg-amber-600', 'text-white', 'shadow-lg');\n          btn?.classList.add('text-neutral-400', 'hover:text-neutral-200');\n        });\n        \n        // Hide all content\n        tabContents.forEach(content => {\n          content?.classList.add('hidden');\n        });\n\n        // Activate clicked tab\n        button.classList.add('bg-amber-600', 'text-white', 'shadow-lg');\n        button.classList.remove('text-neutral-400', 'hover:text-neutral-200');\n        tabContents[index]?.classList.remove('hidden');\n\n        // Load preferences when switching to preferences tab\n        if (tabs[index] === 'preferences') {\n          loadPreferences();\n        }\n        \n        console.log(\\`[Profile Page] Now showing: \\${tabs[index]}\\`);\n      });\n    });\n\n    console.log('[Profile Page] Tab click handlers attached');\n\n    // Load user profile data (don't let this block tab functionality)\n    loadUserProfile().catch(err => {\n      console.error('[Profile Page] Error in loadUserProfile:', err);\n    });\n    \n    setupPasswordChange();\n    setupPreferencesSave();\n    \n    console.log('[Profile Page] Initialization complete');\n  });\n\n  async function loadUserProfile() {\n    try {\n      const { getSupabase } = await import('../lib/supabase-browser.ts');\n      const supabase = getSupabase();\n\n      const { data: { user } } = await supabase.auth.getUser();\n      \n      if (user) {\n        console.log('[Profile Page] User found:', user.email);\n        \n        // Populate profile fields\n        const emailField = document.getElementById('profile-email');\n        const createdField = document.getElementById('profile-created');\n        \n        if (emailField) emailField.value = user.email || '';\n        if (createdField) {\n          const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {\n            year: 'numeric',\n            month: 'long',\n            day: 'numeric'\n          });\n          createdField.value = createdDate;\n        }\n\n        // Check if user is admin and show admin tab - use maybeSingle to handle missing profile\n        const { data: profile, error: profileError } = await supabase\n          .from('profiles')\n          .select('role')\n          .eq('id', user.id)\n          .maybeSingle();\n\n        if (profileError) {\n          console.warn('[Profile Page] Could not fetch profile from profiles table:', profileError);\n          \n          // Try user_roles table as fallback\n          const { data: userRoles } = await supabase\n            .from('user_roles')\n            .select('role')\n            .eq('user_id', user.id);\n            \n          if (userRoles && userRoles.some(r => r.role === 'admin')) {\n            const adminTab = document.getElementById('admin-tab');\n            adminTab?.classList.remove('hidden');\n            console.log('[Profile Page] Admin tab shown (from user_roles)');\n          }\n        } else if (profile?.role === 'admin') {\n          const adminTab = document.getElementById('admin-tab');\n          adminTab?.classList.remove('hidden');\n          console.log('[Profile Page] Admin tab shown (from profiles)');\n        }\n      } else {\n        console.log('[Profile Page] No user found, redirecting to auth');\n        // Redirect to auth page if not signed in\n        window.location.href = '/auth';\n      }\n    } catch (error) {\n      console.error('[Profile Page] Error loading user profile:', error);\n      // Don't stop execution - tabs should still work\n    }\n  }\n\n  // Password Change Modal\n  function setupPasswordChange() {\n    const modal = document.getElementById('password-modal');\n    const openBtn = document.getElementById('change-password-btn');\n    const closeBtn = document.getElementById('close-password-modal');\n    const cancelBtn = document.getElementById('cancel-password-change');\n    const form = document.getElementById('password-change-form');\n    const errorDiv = document.getElementById('password-error');\n    const successDiv = document.getElementById('password-success');\n\n    openBtn?.addEventListener('click', () => {\n      modal?.classList.remove('hidden');\n      form?.reset();\n      errorDiv?.classList.add('hidden');\n      successDiv?.classList.add('hidden');\n    });\n\n    const closeModal = () => {\n      modal?.classList.add('hidden');\n    };\n\n    closeBtn?.addEventListener('click', closeModal);\n    cancelBtn?.addEventListener('click', closeModal);\n\n    // Close modal on outside click\n    modal?.addEventListener('click', (e) => {\n      if (e.target === modal) closeModal();\n    });\n\n    form?.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      \n      const newPassword = document.getElementById('new-password')?.value;\n      const confirmPassword = document.getElementById('confirm-password')?.value;\n      const submitBtn = document.getElementById('submit-password-change');\n\n      errorDiv?.classList.add('hidden');\n      successDiv?.classList.add('hidden');\n\n      // Validate passwords match\n      if (newPassword !== confirmPassword) {\n        if (errorDiv) errorDiv.textContent = 'Passwords do not match';\n        errorDiv?.classList.remove('hidden');\n        return;\n      }\n\n      // Validate password strength\n      if (newPassword.length < 8) {\n        if (errorDiv) errorDiv.textContent = 'Password must be at least 8 characters long';\n        errorDiv?.classList.remove('hidden');\n        return;\n      }\n\n      if (!/[\\\\d\\\\W]/.test(newPassword)) {\n        if (errorDiv) errorDiv.textContent = 'Password must contain at least one number or special character';\n        errorDiv?.classList.remove('hidden');\n        return;\n      }\n\n      // Show loading state\n      if (submitBtn) {\n        submitBtn.textContent = 'Changing...';\n        submitBtn.setAttribute('disabled', 'true');\n      }\n\n      try {\n        const response = await fetch('/api/user/change-password', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ newPassword })\n        });\n\n        const data = await response.json();\n\n        if (!response.ok) {\n          throw new Error(data.error || 'Failed to change password');\n        }\n\n        if (successDiv) successDiv.textContent = '\u2713 Password changed successfully';\n        successDiv?.classList.remove('hidden');\n        \n        // Reset form and close modal after 2 seconds\n        setTimeout(() => {\n          form?.reset();\n          closeModal();\n        }, 2000);\n\n      } catch (error) {\n        if (errorDiv) errorDiv.textContent = error instanceof Error ? error.message : 'Failed to change password';\n        errorDiv?.classList.remove('hidden');\n      } finally {\n        if (submitBtn) {\n          submitBtn.textContent = 'Change Password';\n          submitBtn.removeAttribute('disabled');\n        }\n      }\n    });\n  }\n\n  // Load and Save Preferences\n  async function loadPreferences() {\n    try {\n      const response = await fetch('/api/user/preferences');\n      const data = await response.json();\n\n      if (data.preferences) {\n        const prefs = data.preferences;\n        \n        const themeSelect = document.getElementById('pref-theme');\n        const sacredNamesCheckbox = document.getElementById('pref-sacred-names');\n        const emailNotifsCheckbox = document.getElementById('pref-email-notifs');\n\n        if (themeSelect) themeSelect.value = prefs.theme || 'dark';\n        if (sacredNamesCheckbox) sacredNamesCheckbox.checked = prefs.show_sacred_names !== false;\n        if (emailNotifsCheckbox) emailNotifsCheckbox.checked = prefs.email_notifications !== false;\n      }\n    } catch (error) {\n      console.error('Failed to load preferences:', error);\n    }\n  }\n\n  function setupPreferencesSave() {\n    const saveBtn = document.getElementById('save-preferences-btn');\n    const successDiv = document.getElementById('preferences-success');\n\n    saveBtn?.addEventListener('click', async () => {\n      const themeSelect = document.getElementById('pref-theme');\n      const sacredNamesCheckbox = document.getElementById('pref-sacred-names');\n      const emailNotifsCheckbox = document.getElementById('pref-email-notifs');\n\n      const preferences = {\n        theme: themeSelect?.value || 'dark',\n        show_sacred_names: sacredNamesCheckbox?.checked || false,\n        email_notifications: emailNotifsCheckbox?.checked || false\n      };\n\n      // Show loading state\n      if (saveBtn) {\n        saveBtn.textContent = 'Saving...';\n        saveBtn.setAttribute('disabled', 'true');\n      }\n\n      try {\n        const response = await fetch('/api/user/preferences', {\n          method: 'PUT',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify(preferences)\n        });\n\n        const data = await response.json();\n\n        if (!response.ok) {\n          throw new Error(data.error || 'Failed to save preferences');\n        }\n\n        // Show success message\n        successDiv?.classList.remove('hidden');\n        setTimeout(() => {\n          successDiv?.classList.add('hidden');\n        }, 3000);\n\n      } catch (error) {\n        alert(error instanceof Error ? error.message : 'Failed to save preferences');\n      } finally {\n        if (saveBtn) {\n          saveBtn.textContent = 'Save Preferences';\n          saveBtn.removeAttribute('disabled');\n        }\n      }\n    });\n  }\n<\/script>"])), renderComponent($$result, "Base", $$Base, { "title": "Profile | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-6xl mx-auto"> <!-- Page Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display">
Your Profile
</h1> <p class="text-xl text-neutral-300 max-w-2xl mx-auto">
Manage your account settings, view your activity, and access exclusive content.
</p> </div> <!-- Profile Overview --> <div class="mb-12"> <div id="user-profile-overview"> ${renderComponent($$result2, "ProfileCard", ProfileCard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/ProfileCard", "client:component-export": "default" })} </div> </div> <!-- Profile Tabs --> <div class="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8"> <!-- Tab Navigation --> <div class="flex flex-wrap gap-2 mb-8 bg-neutral-800/50 rounded-lg p-1"> <button id="profile-tab" class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-amber-600 text-white shadow-lg">
Profile Settings
</button> <button id="activity-tab" class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-neutral-400 hover:text-neutral-200">
Activity
</button> <button id="preferences-tab" class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-neutral-400 hover:text-neutral-200">
Preferences
</button> <button id="admin-tab" class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-neutral-400 hover:text-neutral-200 hidden">
Admin Panel
</button> </div> <!-- Tab Content --> <div id="tab-content"> <!-- Profile Settings Tab --> <div id="profile-content" class="tab-panel"> <div class="space-y-8"> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Account Information</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="grid md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">Email Address</label> <input type="email" id="profile-email" class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" readonly> </div> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">Account Created</label> <input type="text" id="profile-created" class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" readonly> </div> </div> </div> </div> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Security</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="space-y-4"> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Password</h4> <p class="text-sm text-neutral-400">Keep your account secure</p> </div> <button id="change-password-btn" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
Change Password
</button> </div> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Two-Factor Authentication</h4> <p class="text-sm text-neutral-400">Add an extra layer of security (Coming Soon)</p> </div> <button disabled class="bg-neutral-700 text-neutral-500 font-semibold px-4 py-2 rounded-lg cursor-not-allowed opacity-50">
Enable 2FA
</button> </div> </div> </div> </div> </div> </div> <!-- Activity Tab --> <div id="activity-content" class="tab-panel hidden"> <div id="user-activity"> ${renderComponent($$result2, "UserActivity", UserActivity, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserActivity", "client:component-export": "default" })} </div> </div> <!-- Preferences Tab --> <div id="preferences-content" class="tab-panel hidden"> <div class="space-y-8"> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Display Preferences</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="space-y-6"> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Theme</h4> <p class="text-sm text-neutral-400">Choose your preferred theme</p> </div> <select id="pref-theme" class="bg-neutral-700 border border-neutral-600 text-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"> <option value="dark">Dark (Default)</option> <option value="light">Light</option> <option value="auto">Auto</option> </select> </div> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Sacred Names</h4> <p class="text-sm text-neutral-400">Show sacred names in content</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" id="pref-sacred-names" class="sr-only peer" checked> <div class="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div> </label> </div> </div> </div> </div> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Notifications</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="space-y-4"> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Email Notifications</h4> <p class="text-sm text-neutral-400">Receive updates about new content</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" id="pref-email-notifs" class="sr-only peer" checked> <div class="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div> </label> </div> </div> </div> </div> <!-- Save Preferences Button --> <div class="flex justify-end"> <button id="save-preferences-btn" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
Save Preferences
</button> </div> <!-- Success Message --> <div id="preferences-success" class="hidden p-4 bg-green-900/30 border border-green-700 text-green-200 rounded-lg">
✓ Preferences saved successfully
</div> </div> </div> <!-- Admin Panel Tab --> <div id="admin-content" class="tab-panel hidden"> <div class="space-y-8"> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">User Management</h3> <div id="admin-user-management"> ${renderComponent($$result2, "UserManagement", UserManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserManagement", "client:component-export": "default" })} </div> </div> </div> </div> </div> </div> </div> </div> </div>  <div id="password-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4"> <div class="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6"> <div class="flex items-center justify-between mb-6"> <h3 class="text-2xl font-bold text-amber-100">Change Password</h3> <button id="close-password-modal" class="text-neutral-400 hover:text-neutral-200 transition-colors"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="password-change-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">New Password</label> <input type="password" id="new-password" required minlength="8" class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Enter new password"> <p class="text-xs text-neutral-500 mt-1">Minimum 8 characters, must include a number or special character</p> </div> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">Confirm New Password</label> <input type="password" id="confirm-password" required minlength="8" class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Confirm new password"> </div> <div id="password-error" class="hidden p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-lg text-sm"></div> <div id="password-success" class="hidden p-3 bg-green-900/30 border border-green-700 text-green-200 rounded-lg text-sm"></div> <div class="flex gap-3 pt-4"> <button type="button" id="cancel-password-change" class="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-4 py-3 rounded-lg transition-colors">
Cancel
</button> <button type="submit" id="submit-password-change" class="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors">
Change Password
</button> </div> </form> </div> </div> ` }));
}, "/Users/asjames18/Development/RRG Website/src/pages/profile.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
