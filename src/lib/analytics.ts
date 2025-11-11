/**
 * Privacy-first analytics integration
 * Placeholder for Plausible/Fathom integration
 * 
 * To enable Plausible:
 * 1. Set PLAUSIBLE_DOMAIN environment variable
 * 2. Add script to Base.astro layout
 * 
 * To enable Fathom:
 * 1. Set FATHOM_SITE_ID environment variable
 * 2. Add script to Base.astro layout
 */

const plausibleDomain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN;
const fathomSiteId = import.meta.env.PUBLIC_FATHOM_SITE_ID;

export function getAnalyticsScript(): string {
  if (plausibleDomain) {
    return `
      <script defer data-domain="${plausibleDomain}" src="https://plausible.io/js/script.js"></script>
    `.trim();
  }
  
  if (fathomSiteId) {
    return `
      <script src="https://cdn.usefathom.com/script.js" data-site="${fathomSiteId}" defer></script>
    `.trim();
  }
  
  return '';
}

export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  
  if (plausibleDomain && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
  
  if (fathomSiteId && (window as any).fathom) {
    (window as any).fathom.trackEvent(eventName);
  }
}

