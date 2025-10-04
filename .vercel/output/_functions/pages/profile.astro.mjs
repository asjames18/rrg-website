import { c as createComponent, b as renderComponent, r as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../chunks/supabase_rylPBTzj.mjs';
import { U as UserManagement } from '../chunks/UserManagement_Bftlx0ze.mjs';
export { renderers } from '../renderers.mjs';

function ProfileCard({ showActions = true, className = "" }) {
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
      async (event, session) => {
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchActivityData();
  }, []);
  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const mockActivities = [
        {
          id: "1",
          type: "login",
          description: "Signed in to Real & Raw Gospel",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "2",
          type: "profile_updated",
          description: "Updated profile information",
          timestamp: new Date(Date.now() - 1e3 * 60 * 30).toISOString()
          // 30 minutes ago
        },
        {
          id: "3",
          type: "post_read",
          description: 'Read "Keep the Feast, Dump the Yeast"',
          timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 2).toISOString()
          // 2 hours ago
        },
        {
          id: "4",
          type: "video_watched",
          description: 'Watched "Shut the Doorways - Warfare 101"',
          timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 4).toISOString()
          // 4 hours ago
        }
      ];
      setActivities(mockActivities);
      setStats({
        postsRead: 1,
        videosWatched: 1,
        favoritesSaved: 0,
        totalTimeSpent: 45
        // minutes
      });
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
        return "bg-amber-500";
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
    return date.toLocaleDateString();
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-neutral-700 rounded w-1/3 mb-4" }),
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
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4 font-display", children: "Recent Activity" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: activities.length > 0 ? activities.map((activity) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getActivityColor(activity.type)}`, children: getActivityIcon(activity.type) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-neutral-200 font-medium", children: activity.description }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400", children: formatTimestamp(activity.timestamp) })
        ] })
      ] }, activity.id)) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-neutral-400", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📝" }),
        /* @__PURE__ */ jsx("p", { children: "No activity yet" }),
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
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-lg", children: "📖" }) }),
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
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-lg", children: "🎥" }) }),
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

const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Profile | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-6xl mx-auto"> <!-- Page Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display">
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
</button> </div> <!-- Tab Content --> <div id="tab-content"> <!-- Profile Settings Tab --> <div id="profile-content" class="tab-panel"> <div class="space-y-8"> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Account Information</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="grid md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">Email Address</label> <input type="email" id="profile-email" class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" readonly> </div> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">Account Created</label> <input type="text" id="profile-created" class="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" readonly> </div> </div> </div> </div> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Security</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="space-y-4"> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Password</h4> <p class="text-sm text-neutral-400">Last updated: Never</p> </div> <button class="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
Change Password
</button> </div> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Two-Factor Authentication</h4> <p class="text-sm text-neutral-400">Add an extra layer of security</p> </div> <button class="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-semibold px-4 py-2 rounded-lg transition-colors">
Enable 2FA
</button> </div> </div> </div> </div> </div> </div> <!-- Activity Tab --> <div id="activity-content" class="tab-panel hidden"> <div id="user-activity"> ${renderComponent($$result2, "UserActivity", UserActivity, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserActivity", "client:component-export": "default" })} </div> </div> <!-- Preferences Tab --> <div id="preferences-content" class="tab-panel hidden"> <div class="space-y-8"> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Display Preferences</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="space-y-6"> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Theme</h4> <p class="text-sm text-neutral-400">Choose your preferred theme</p> </div> <select class="bg-neutral-700 border border-neutral-600 text-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"> <option value="dark">Dark (Default)</option> <option value="light">Light</option> <option value="auto">Auto</option> </select> </div> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Sacred Names</h4> <p class="text-sm text-neutral-400">Show sacred names in content</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" class="sr-only peer" checked> <div class="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div> </label> </div> </div> </div> </div> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">Notifications</h3> <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6"> <div class="space-y-4"> <div class="flex items-center justify-between"> <div> <h4 class="text-lg font-semibold text-neutral-100">Email Notifications</h4> <p class="text-sm text-neutral-400">Receive updates about new content</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" class="sr-only peer" checked> <div class="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div> </label> </div> </div> </div> </div> </div> </div> <!-- Admin Panel Tab --> <div id="admin-content" class="tab-panel hidden"> <div class="space-y-8"> <div> <h3 class="text-2xl font-bold text-amber-100 mb-6 font-display">User Management</h3> <div id="admin-user-management"> ${renderComponent($$result2, "UserManagement", UserManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserManagement", "client:component-export": "default" })} </div> </div> </div> </div> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/profile.astro?astro&type=script&index=0&lang.ts")}`;
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
