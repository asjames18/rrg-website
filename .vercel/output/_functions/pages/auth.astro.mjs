import { c as createComponent, d as createAstro, b as renderComponent, r as renderScript, a as renderTemplate, m as maybeRenderHead, e as Fragment } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
import { A as AuthForm } from '../chunks/AuthForm_JRaiIDjP.mjs';
import { U as UserProfile } from '../chunks/UserProfile_BmDXL3Eu.mjs';
import { s as supabaseServer } from '../chunks/supabase-server_DNXtBe2A.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Auth = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Auth;
  const url = new URL(Astro2.request.url);
  url.searchParams.get("redirect") || "/";
  const error = url.searchParams.get("error");
  let user = null;
  let profile = null;
  let isAdmin = false;
  try {
    const authHeader = Astro2.request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || Astro2.request.headers.get("cookie")?.match(/sb-.*-auth-token=([^;]+)/)?.[1];
    if (token) {
      const { data: { user: authUser }, error: authError } = await supabaseServer.auth.getUser(token);
      if (!authError && authUser) {
        user = authUser;
        const { data: userProfile } = await supabaseServer.from("profiles").select("role").eq("id", user.id).single();
        profile = userProfile;
        isAdmin = profile?.role === "admin" || profile?.role === "editor";
      }
    }
  } catch (error2) {
    console.error("Auth check error:", error2);
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Sign In | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-2xl mx-auto"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display"> ${user ? "Welcome Back" : "Join the Remnant"} </h1> <p class="text-xl text-neutral-300 max-w-lg mx-auto leading-relaxed"> ${user ? `You're signed in as ${user.email}. ${isAdmin ? "You have admin access." : "Enjoy your member benefits!"}` : "Create an account to access exclusive content, save favorites, and connect with other believers."} </p> </div> <!-- Error Message --> ${error && renderTemplate`<div class="mb-8 bg-red-900/20 border border-red-700/50 rounded-xl p-6 backdrop-blur-sm"> <div class="flex items-center gap-3"> <span class="text-red-400 text-xl">⚠️</span> <div> <h3 class="text-red-100 font-semibold mb-1"> ${error === "insufficient-permissions" ? "Insufficient Permissions" : "Authentication Error"} </h3> <p class="text-red-200 text-sm"> ${error === "insufficient-permissions" ? "You need admin or editor access to view this page. Contact an administrator if you believe this is an error." : "There was an issue with your authentication. Please try signing in again."} </p> </div> </div> </div>`} <!-- User Profile (if signed in) --> ${user ? renderTemplate`<div class="mb-8"> ${renderComponent($$result2, "UserProfile", UserProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserProfile", "client:component-export": "default" })} <!-- Admin/User specific actions --> <div class="mt-8 grid md:grid-cols-2 gap-4"> ${isAdmin ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <a href="/admin-dashboard" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">⚡</div> <div class="font-bold">Admin Dashboard</div> <div class="text-sm opacity-90">Manage content and users</div> </a> <a href="/admin" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">📝</div> <div class="font-bold">Content Management</div> <div class="text-sm opacity-90">Edit posts, videos, books</div> </a> ` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <a href="/profile" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">👤</div> <div class="font-bold">My Profile</div> <div class="text-sm opacity-90">View and edit your profile</div> </a> <a href="/" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">🏠</div> <div class="font-bold">Go Home</div> <div class="text-sm opacity-90">Return to main site</div> </a> ` })}`} </div> </div>` : renderTemplate`<!-- Unified Auth Form (if not signed in) -->
          <div id="auth-forms"> <div class="max-w-md mx-auto"> ${renderComponent($$result2, "AuthForm", AuthForm, { "mode": "signin", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/AuthForm", "client:component-export": "default" })} </div> </div>`} <!-- Benefits --> <div class="mt-16 bg-gradient-to-r from-amber-900/10 to-amber-800/10 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm"> <h3 class="text-2xl font-bold text-amber-100 mb-6 text-center font-display">Why Create an Account?</h3> <div class="grid md:grid-cols-2 gap-6 text-neutral-300"> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Save Favorites</div> <div class="text-sm">Bookmark posts and videos for later</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Track Progress</div> <div class="text-sm">See what you've read and learned</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Exclusive Content</div> <div class="text-sm">Access member-only teachings</div> </div> </div> <div class="flex items-start gap-4"> <div class="flex-shrink-0 w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center"> <span class="text-amber-400 font-bold text-sm">✓</span> </div> <div> <div class="font-semibold text-amber-100 mb-1">Community</div> <div class="text-sm">Connect with other believers (coming soon)</div> </div> </div> </div> </div> <!-- Admin Note --> <div class="mt-12 bg-neutral-900/50 border border-neutral-700/50 rounded-xl p-6 backdrop-blur-sm"> <p class="text-sm text-neutral-300 text-center"> <strong class="text-amber-100">Content Creators:</strong> Need admin or editor access? 
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
