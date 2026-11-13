import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Build-time read of the shared dataset: only the small site metadata and tag list go into the public
// runtime config. Posts are served by Nitro server routes (server/utils/data.ts).
const data = JSON.parse(readFileSync(fileURLToPath(new URL("../../content/posts.json", import.meta.url)), "utf8"));
const { aboutHtml: _about, ...site } = data.site;

const THEME_SCRIPT =
  'try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;' +
  'else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}';

export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  devtools: { enabled: false },
  telemetry: false,
  runtimeConfig: {
    public: { site, tags: data.tags },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "alternate", type: "application/rss+xml", title: site.title, href: "/rss.xml" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "stylesheet", href: "/style.css" },
      ],
      script: [{ innerHTML: THEME_SCRIPT, tagPosition: "head", tagPriority: "critical" }],
    },
  },
  // `nuxt generate --envName static`: every page is prerendered at build time.
  // `nuxt build` (server mode) has no prerender at all.
  $env: {
    static: {
      // Renders error.vue into 404.html (with the site layout) instead of the empty SPA fallback.
      experimental: { prerenderErrorPages: true },
      nitro: {
        prerender: {
          crawlLinks: false,
          failOnError: true,
          routes: [
            "/",
            "/blog",
            "/about",
            ...data.posts.map((p: { slug: string }) => `/blog/${p.slug}`),
            "/rss.xml",
            "/sitemap.xml",
          ],
        },
      },
    },
  },
});
