import { c as createComponent, b as createAstro } from '../chunks/astro/server_BKIoqdNA.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$AdminLogin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLogin;
  const url = new URL(Astro2.request.url);
  const redirectParam = url.searchParams.get("redirect");
  const error = url.searchParams.get("error");
  let redirectUrl = "/auth";
  if (redirectParam) {
    redirectUrl += `?redirect=${encodeURIComponent(redirectParam)}`;
    if (error) {
      redirectUrl += `&error=${encodeURIComponent(error)}`;
    }
  } else if (error) {
    redirectUrl += `?error=${encodeURIComponent(error)}`;
  }
  return Astro2.redirect(redirectUrl);
}, "/Users/asjames18/Development/RRG Website/src/pages/admin-login.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin-login.astro";
const $$url = "/admin-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminLogin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
