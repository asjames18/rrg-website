import { c as createComponent, r as renderScript, m as maybeRenderHead, a as renderTemplate } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/admin.astro?astro&type=script&index=0&lang.ts")} ${maybeRenderHead()}<p>Redirecting to admin...</p>`;
}, "/Users/asjames18/Development/RRG Website/src/pages/admin.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
