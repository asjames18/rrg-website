import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
export { renderers } from '../renderers.mjs';

const $$AdminTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Admin Test | Real & Raw Gospel" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-4xl mx-auto"> <div class="text-center mb-8"> <h1 class="text-3xl md:text-4xl font-bold text-amber-100 mb-4">
Admin Test Page
</h1> <p class="text-lg text-neutral-300">
Testing admin portal functionality
</p> </div> <div class="grid md:grid-cols-2 gap-6"> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold text-amber-100 mb-4">Admin Portal</h3> <a href="/admin" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors block mb-4">
Access Admin Portal
</a> <p class="text-sm text-neutral-400">
Passcode: rrg-dev
</p> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold text-amber-100 mb-4">Admin Dashboard</h3> <a href="/admin-dashboard" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors block mb-4">
View Admin Dashboard
</a> <p class="text-sm text-neutral-400">
User management and stats
</p> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold text-amber-100 mb-4">Admin Login</h3> <a href="/admin-login" class="bg-green-700 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors block mb-4">
Admin Login Page
</a> <p class="text-sm text-neutral-400">
Authentication and user management
</p> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold text-amber-100 mb-4">API Test</h3> <a href="/api/test-supabase" class="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors block mb-4">
Test Supabase API
</a> <p class="text-sm text-neutral-400">
Check database connection
</p> </div> </div> <div class="mt-8 bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold text-amber-100 mb-4">Quick Actions</h3> <div class="grid md:grid-cols-3 gap-4"> <a href="/admin-promote" class="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors text-sm">
Promote User to Admin
</a> <a href="/debug-api" class="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors text-sm">
Debug API Tool
</a> <a href="/test-database" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors text-sm">
Test Database
</a> </div> </div> </div> </div> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/admin-test.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin-test.astro";
const $$url = "/admin-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
