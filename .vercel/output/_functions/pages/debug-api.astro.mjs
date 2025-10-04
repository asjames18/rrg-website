import { c as createComponent, b as renderComponent, r as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
export { renderers } from '../renderers.mjs';

const $$DebugApi = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Debug API | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"> <div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-4xl mx-auto"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-amber-100 mb-6 font-display">
API Debug Tool
</h1> <p class="text-xl text-neutral-300">
Test API endpoints and debug JSON parsing issues
</p> </div> <div class="grid md:grid-cols-2 gap-8"> <!-- Test GET Request --> <div class="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8"> <h3 class="text-xl font-bold text-amber-100 mb-4">Test GET Request</h3> <button id="test-get-btn" class="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
Test GET /api/debug-json
</button> <div id="get-result" class="hidden bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-4"> <pre class="text-sm text-neutral-300 whitespace-pre-wrap"></pre> </div> </div> <!-- Test POST Request --> <div class="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8"> <h3 class="text-xl font-bold text-amber-100 mb-4">Test POST Request</h3> <div class="space-y-4 mb-4"> <div> <label class="block text-sm font-medium text-neutral-200 mb-2">Test Data</label> <textarea id="test-data" class="w-full px-4 py-3 bg-neutral-800/80 border border-neutral-600/50 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200" rows="4" placeholder="Enter JSON test data here"></textarea> </div> </div> <button id="test-post-btn" class="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
Test POST /api/debug-json
</button> <div id="post-result" class="hidden bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-4"> <pre class="text-sm text-neutral-300 whitespace-pre-wrap"></pre> </div> </div> </div> <!-- Test Supabase Connection --> <div class="mt-8 bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8"> <h3 class="text-xl font-bold text-amber-100 mb-4">Test Supabase Connection</h3> <button id="test-supabase-btn" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
Test Supabase API
</button> <div id="supabase-result" class="hidden bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-4"> <pre class="text-sm text-neutral-300 whitespace-pre-wrap"></pre> </div> </div> <!-- Error Log --> <div class="mt-8 bg-red-900/20 border border-red-700/50 rounded-2xl p-8"> <h3 class="text-xl font-bold text-red-100 mb-4">Error Log</h3> <div id="error-log" class="bg-neutral-900/50 border border-neutral-700/50 rounded-lg p-4 min-h-32"> <p class="text-neutral-400 text-sm">Errors will appear here...</p> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/debug-api.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/debug-api.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/debug-api.astro";
const $$url = "/debug-api";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DebugApi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
