# Nuxt target

## Versions
- nuxt 4.6.4 (Nitro 2 via nitropack 2.13.6, Vite), vue 3.5.45, vue-router 5.5.0. No Nuxt modules.
- Node 26.13.0 (`node:26.13.0-slim`) for build and the server image; `nginx:1.29-alpine` for the static image.
- npm lockfile: `package-lock.json` (installed with `npm ci`).

## Modes
Both are stages of `apps/nuxt/Dockerfile` (context = repository root; `Dockerfile.dockerignore` trims the context to the
files the build needs, because the root holds every other target's node_modules).

```bash
docker build -f apps/nuxt/Dockerfile --target static -t wfb/nuxt:static .   # nuxt generate --envName static
docker build -f apps/nuxt/Dockerfile --target server -t wfb/nuxt:server .   # nuxt build, node-server preset
docker run -p 18100:8080 wfb/nuxt:static   # nginx + shared/nginx/static.conf
docker run -p 18101:8080 wfb/nuxt:server   # node .output/server/index.mjs (HOST=0.0.0.0 PORT=8080)
```

- **static**: `nuxt generate --envName static` prerenders an explicit route list (/, /blog, /about, 40 posts, /rss.xml,
  /sitemap.xml; `crawlLinks: false`). `experimental.prerenderErrorPages` makes Nuxt render `error.vue` into
  `404.html` with the site layout. nginx serves `.output/public` plus `shared/public`; /healthz is nginx's.
- **server**: `nuxt build`, no prerender, no routeRules. Every page is SSR-rendered per request; /healthz, /rss.xml and
  /sitemap.xml are Nitro server routes. One Node process, no PM2.
- Local dev: `npm install && npm run sync:public && npm run dev` (the shared files are copied into `public/`, which is
  git-ignored; the Dockerfile does the same copy).

## Implementation decisions
- **Data**: `content/posts.json` is imported by `server/utils/data.ts` (bundled into the Nitro server, indexed once per
  process). Pages call `useFetch` on `/api/cards` (slim card shape, no bodies; `?limit=6` for home),
  `/api/posts/[slug]` (one body, prev/next, 3 related cards) and `/api/about`. In static mode these run at build time and
  end up in per-page `_payload.json` files, so client navigation needs no API. Site metadata and the tag list (about 1 kB)
  come from `runtimeConfig.public`, read from posts.json in `nuxt.config.ts` at build time.
- **Payload**: no page carries the dataset. A post page carries its own body once in the payload (Nuxt serialises
  `useFetch` data) plus once as markup; /blog carries the 40 slim cards (needed for the client-side filter).
- **Filter**: `pages/blog/index.vue`. `q` and `tag` refs start from `route.query`, so the server renders `?q=&tag=` already
  filtered (input value, pressed chip, count, empty state). On the client a watcher writes them back with
  `router.replace({ query })` (no reload, no history entry). A second watcher re-reads the query when a tag link is followed
  while already on /blog.
- **Theme**: `ThemeToggle.vue` flips `html[data-theme]` and localStorage; the byte-exact theme snippet is added through
  `app.head.script` with `tagPriority: critical`, so it precedes the stylesheet. `shared/app.js` is not loaded.
- **CSS**: `/style.css` linked from `app.head.link` (a file in `public/`, copied from shared at build time).
- **Head**: `usePageMeta()` composable sets title, canonical and Open Graph via `useHead`/`useSeoMeta`.
- **404**: unknown routes and missing posts (`createError({ statusCode: 404, fatal: true })`) render `error.vue`.
  `server/middleware/html-accept.ts` pins page requests to `Accept: text/html` (see friction).

## Deviations from the contract
- Prefetch/modulepreload `<link>`s, an importmap script, `<div id="__nuxt">`, `<!--[-->` hydration comments, a
  `__NUXT_DATA__` script and `window.__NUXT__` config are added by Nuxt (allowed wrappers).
- Cards and tag links are `NuxtLink` (client-side navigation); the markup is the same `<a>`. Cards do not carry the
  `data-post`/`data-tags`/`data-search` attributes used by the vanilla island.
- `/blog` and other pages are written as `blog/index.html` etc.; nginx resolves them via `$uri/index.html` with no redirect.
- Static mode serves `/rss.xml` as `text/xml` (nginx mime map).

## Native capabilities used or available
- Analytics: nothing built in. Conventional: `nuxt-gtag`, `@nuxt/scripts`, Plausible/Umami modules. None enabled.
- Monitoring and observability: `/healthz` hand-written as a Nitro route. Nitro has hooks (`request`, `error`,
  `afterResponse`) and plugins for logging; OpenTelemetry via community modules. Nuxt DevTools is disabled.
- SEO: `useHead`/`useSeoMeta`/unhead built in (used). Sitemap, RSS, robots, schema.org are module territory
  (`@nuxtjs/sitemap`, `@nuxtjs/seo`); here sitemap.xml and rss.xml are hand-written server routes.

## Effort log
- Started: 2026-11-13 13:31:58 UTC. Finished: 2026-11-13 15:08:51 UTC (wall clock inflated: the host load average was 20-30 from other builds; one cold
  `npm install` took 5 minutes, one `nuxt build` 8 minutes).
- Build-check-fix iterations until conformance passed: 3 (1: first generate had an SPA-fallback 404.html -> enabled
  `prerenderErrorPages`; 2: server 404 answered JSON to `Accept: */*` -> middleware; 3: Docker context/chmod fixes).
- Friction:
  - `nuxt generate` writes an empty SPA shell as 404.html; a real prerendered 404 needs the new experimental
    `prerenderErrorPages` flag (found by grepping the source, not the docs). Listing `/404.html` in prerender routes does nothing.
  - Nuxt's error handler returns JSON unless the request's Accept contains text/html, so a client sending `*/*` gets a JSON
    404 instead of the 404 page; worked around with a Nitro middleware.
  - Including prerender routes in `nuxt.config` also prerenders them under `nuxt build`; the list is scoped to
    `$env.static` and selected with `--envName static`.
  - Build context is the repo root: without a `Dockerfile.dockerignore` the context upload of the whole bench repo stalled
    the build, and a recursive chmod over node_modules was very slow.
- Dockerfile.dockerignore keeps the repo-root context small.
- Hand-written source lines (non-blank, excluding lockfile): about 430 (Vue, TS, config), plus the Dockerfile.
