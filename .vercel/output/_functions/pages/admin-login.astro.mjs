import { c as createComponent, b as renderComponent, r as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
import { A as AuthForm } from '../chunks/AuthForm_JRaiIDjP.mjs';
import { U as UserProfile } from '../chunks/UserProfile_BmDXL3Eu.mjs';
export { renderers } from '../renderers.mjs';

const $$AdminLogin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Admin Login | Real & Raw Gospel" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-2xl mx-auto"> <div class="text-center mb-8"> <h1 class="text-3xl md:text-4xl font-bold text-amber-100 mb-4">
Admin Access
</h1> <p class="text-lg text-neutral-300">
Sign in to manage content, users, and site settings.
</p> </div> <!-- Admin Profile (if signed in) --> <div id="admin-profile" class="mb-8"> ${renderComponent($$result2, "UserProfile", UserProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserProfile", "client:component-export": "default" })} </div> <!-- Admin Auth Forms (if not signed in) --> <div id="admin-forms" class="space-y-8"> <div> <h2 class="text-xl font-semibold text-amber-100 mb-4 text-center">
Admin Sign In
</h2> ${renderComponent($$result2, "AuthForm", AuthForm, { "mode": "signin", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/AuthForm", "client:component-export": "default" })} </div> <div class="border-t border-neutral-800 pt-8"> <h2 class="text-xl font-semibold text-amber-100 mb-4 text-center">
Create Admin Account
</h2> ${renderComponent($$result2, "AuthForm", AuthForm, { "mode": "signup", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/AuthForm", "client:component-export": "default" })} </div> </div> <!-- Admin Features --> <div class="mt-12 bg-red-900/20 border border-red-800/50 rounded-lg p-6"> <h3 class="text-lg font-bold text-red-100 mb-4">Admin Capabilities</h3> <div class="grid md:grid-cols-2 gap-4 text-sm text-neutral-300"> <div class="flex items-start gap-3"> <span class="text-red-400 mt-1">⚡</span> <div> <strong>Content Management:</strong> Create, edit, and publish all content
</div> </div> <div class="flex items-start gap-3"> <span class="text-red-400 mt-1">⚡</span> <div> <strong>User Management:</strong> Promote users to editors/admins
</div> </div> <div class="flex items-start gap-3"> <span class="text-red-400 mt-1">⚡</span> <div> <strong>Database Access:</strong> Full access to all data and settings
</div> </div> <div class="flex items-start gap-3"> <span class="text-red-400 mt-1">⚡</span> <div> <strong>Site Configuration:</strong> Manage site-wide settings and features
</div> </div> </div> </div> <!-- Quick Links --> <div class="mt-8 grid md:grid-cols-2 gap-4"> <a href="/admin" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Content Management System
</a> <a href="/test-database" class="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-3 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Database Test
</a> </div> <!-- Security Note --> <div class="mt-8 bg-neutral-900 border border-neutral-800 rounded-lg p-4"> <p class="text-sm text-neutral-400 text-center"> <strong>Security:</strong> Admin accounts have elevated privileges. 
          Keep your credentials secure and use strong passwords.
</p> </div> </div> </div> ` })} ${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/admin-login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/admin-login.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin-login.astro";
const $$url = "/admin-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminLogin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
