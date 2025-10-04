import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_ClRe6QG4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_Cyjh60mP.mjs';
export { renderers } from '../renderers.mjs';

const $$Give = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Give" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <h1 class="text-4xl md:text-5xl font-bold mb-8 text-amber-100">Give</h1> <div class="prose prose-lg prose-invert max-w-4xl"> <p class="lead text-xl text-neutral-300">
Support the work of Real & Raw Gospel as we train the remnant in the ways of YAHUAH.
</p> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-8 my-8"> <h2 class="text-2xl font-bold mb-4 text-amber-100">Why Give?</h2> <p class="text-neutral-300">
This ministry operates on faith and the generosity of those who have been blessed by the teaching. 
          Your support helps us:
</p> <ul class="text-neutral-300 space-y-2 my-4"> <li>Produce high-quality teaching content</li> <li>Maintain and expand this website</li> <li>Reach more people with the truth of Scripture</li> <li>Provide free resources to the remnant worldwide</li> </ul> </div> <h2 class="text-amber-100">How to Give</h2> <p class="text-neutral-300">
We believe in complete transparency and accountability. Giving options will be added soon. 
        All donations will be used solely for ministry purposes—spreading the Gospel and training believers.
</p> <div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-6 my-8"> <p class="text-neutral-300 mb-0"> <strong class="text-amber-100">Note:</strong> We do not believe in manipulative giving tactics, prosperity gospel nonsense, 
          or "sowing seed" schemes. Give as the RUACH HAQODESH leads you, cheerfully and without compulsion (2 Corinthians 9:7).
</p> </div> <h2 class="text-amber-100">Other Ways to Support</h2> <p class="text-neutral-300">
If you're not able to give financially, you can still support this ministry by:
</p> <ul class="text-neutral-300 space-y-2"> <li>Sharing content with others who need to hear the truth</li> <li>Praying for this ministry and the remnant</li> <li>Living out the teachings and being a witness</li> <li>Purchasing recommended books through our affiliate links</li> </ul> <div class="text-center mt-12"> <p class="text-neutral-400 italic">
"Each one must give as he has decided in his heart, not reluctantly or under compulsion, 
          for YAHUAH loves a cheerful giver." — 2 Corinthians 9:7
</p> </div> </div> </div> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/give.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/give.astro";
const $$url = "/give";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Give,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
