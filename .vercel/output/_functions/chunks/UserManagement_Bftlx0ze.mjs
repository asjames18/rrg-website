import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_rylPBTzj.mjs';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoting, setPromoting] = useState(null);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error2) throw error2;
      setUsers(data || []);
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  const promoteUser = async (userId, newRole) => {
    try {
      setPromoting(userId);
      const response = await fetch("/api/promote-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, role: newRole })
      });
      const result = await response.json();
      if (result.success) {
        setUsers(users.map(
          (user) => user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        throw new Error(result.error || "Failed to promote user");
      }
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to promote user");
    } finally {
      setPromoting(null);
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
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-neutral-700 rounded w-1/3 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-neutral-800 rounded" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100", children: "User Management" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchUsers,
          className: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded text-sm transition-colors",
          children: "Refresh"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-900/30 border border-red-700 text-red-200 p-3 rounded mb-4", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      users.map((user) => /* @__PURE__ */ jsx("div", { className: "bg-neutral-800 border border-neutral-700 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neutral-200 font-medium", children: user.email }),
            /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded border ${getRoleColor(user.role)}`, children: user.role.charAt(0).toUpperCase() + user.role.slice(1) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-neutral-400", children: [
            "Joined: ",
            new Date(user.created_at).toLocaleDateString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: user.role,
              onChange: (e) => promoteUser(user.id, e.target.value),
              disabled: promoting === user.id,
              className: "bg-neutral-700 border border-neutral-600 text-neutral-200 text-sm px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "viewer", children: "Viewer" }),
                /* @__PURE__ */ jsx("option", { value: "editor", children: "Editor" }),
                /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
              ]
            }
          ),
          promoting === user.id && /* @__PURE__ */ jsx("div", { className: "text-xs text-neutral-400", children: "Updating..." })
        ] })
      ] }) }, user.id)),
      users.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-neutral-400", children: "No users found" })
    ] })
  ] });
}

export { UserManagement as U };
