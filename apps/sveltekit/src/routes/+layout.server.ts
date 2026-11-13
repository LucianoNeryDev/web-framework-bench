import { site } from "#lib/server/data.ts";

// Prerender everything in static mode; render per request in server mode.
export const prerender = __WFB_STATIC__;
export const ssr = true;
export const trailingSlash = "never";

export const load = () => ({
  site: { title: site.title, author: site.author, description: site.description, url: site.url },
});
