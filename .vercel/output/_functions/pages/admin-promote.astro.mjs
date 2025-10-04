import { c as createComponent, b as renderComponent, r as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DCtlZR10.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CLTBcQpW.mjs';
export { renderers } from '../renderers.mjs';

const $$AdminPromote = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Promote to Admin | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-2xl mx-auto"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display">
Promote to Admin
</h1> <p class="text-xl text-neutral-300">
Promote a user to admin role by entering their email address.
</p> </div> <div class="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8 shadow-2xl"> <form id="promote-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-neutral-200 mb-2">
User Email
</label> <input type="email" id="email" required class="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" placeholder="user@example.com"> </div> <div> <label for="admin-secret" class="block text-sm font-medium text-neutral-200 mb-2">
Admin Secret
</label> <input type="password" id="admin-secret" required class="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" placeholder="Enter admin secret"> <p class="text-sm text-neutral-400 mt-2">
Secret: <code class="bg-neutral-800 px-2 py-1 rounded text-amber-400">rrg-admin-2024</code> </p> </div> <button type="submit" id="promote-btn" class="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg hover:shadow-xl">
Promote to Admin
</button> </form> <div id="result" class="mt-6 hidden"> <!-- Result message will appear here --> </div> </div> <!-- Instructions --> <div class="mt-12 bg-amber-900/20 border border-amber-800/50 rounded-2xl p-6"> <h3 class="text-lg font-bold text-amber-100 mb-4">How to Use:</h3> <ol class="space-y-2 text-neutral-300 text-sm"> <li>1. Make sure the user has already created an account</li> <li>2. Enter their email address exactly as they signed up</li> <li>3. Enter the admin secret: <code class="bg-neutral-800 px-2 py-1 rounded text-amber-400">rrg-admin-2024</code></li> <li>4. Click "Promote to Admin"</li> <li>5. The user will immediately have admin access</li> </ol> </div> <!-- Alternative Methods --> <div class="mt-8 bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6"> <h3 class="text-lg font-bold text-amber-100 mb-4">Alternative Methods:</h3> <div class="space-y-4 text-sm text-neutral-300"> <div> <strong>1. Supabase Dashboard:</strong> <p>Go to Authentication → Users → Find user → Edit metadata → Add role: "admin"</p> </div> <div> <strong>2. SQL Editor:</strong> <p>Run: <code class="bg-neutral-800 px-2 py-1 rounded text-amber-400">UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';</code></p> </div> <div> <strong>3. Admin Dashboard:</strong> <p>If you're already an admin, use the User Management section in your profile</p> </div> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/admin-promote.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/admin-promote.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin-promote.astro";
const $$url = "/admin-promote";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminPromote,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
