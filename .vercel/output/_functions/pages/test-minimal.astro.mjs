import { c as createComponent, b as createAstro, e as renderHead, a as renderTemplate } from '../chunks/astro/server_BKIoqdNA.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$TestMinimal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TestMinimal;
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  return renderTemplate`<html> <head><title>Minimal Test</title>${renderHead()}</head> <body> <h1>Minimal Test Page</h1> <p>If you can see this, basic Astro is working.</p> <p>Timestamp: ${timestamp}</p> <p><a href="/api/ping">Test API Ping</a></p> <p><a href="/api/health">Test API Health</a></p> </body></html>`;
}, "/Users/asjames18/Development/RRG Website/src/pages/test-minimal.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/test-minimal.astro";
const $$url = "/test-minimal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestMinimal,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
