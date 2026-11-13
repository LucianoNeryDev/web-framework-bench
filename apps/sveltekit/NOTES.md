# SvelteKit target

## Versions
- SvelteKit `@sveltejs/kit` 3.2.0, Svelte 5.57.3 (runes), `@sveltejs/vite-plugin-svelte` 7.3.1, Vite 8.3.8
- `@sveltejs/adapter-static` 4.0.1, `@sveltejs/adapter-node` 6.0.2
- TypeScript 6.0.3, svelte-check 4.7.8 (dev only; `npm run check` passes with 0 errors, 0 warnings)
- Node 24 (`node:24-alpine`) for build and for the server image, nginx 1.29-alpine for static
- Everything is a devDependency: the adapter-node output bundles its dependencies, so the server image
  carries only `build/` and `package.json` (no `node_modules`).

## Modes
Selected at build time by `WFB_MODE` (`static` is the default, `server` the other). `vite.config.ts` picks the
adapter from it and defines the compile-time constant `__WFB_STATIC__`.

```bash
docker build -f apps/sveltekit/Dockerfile --target static -t wfb/sveltekit:static .
docker build -f apps/sveltekit/Dockerfile --target server -t wfb/sveltekit:server .
docker run -d --name wfb-sveltekit-static -p 18130:8080 wfb/sveltekit:static
docker run -d --name wfb-sveltekit-server -p 18131:8080 wfb/sveltekit:server
node bench/conformance.mjs http://localhost:18130
node bench/conformance.mjs http://localhost:18131 --server
```

- `static`: `vite build` with adapter-static (`strict: true`, no `fallback`); the prerendered `build/` goes to
  nginx with `shared/nginx/static.conf`. 3.5 MB output, 81 prerendered files under `blog/` alone.
- `server`: `vite build` with adapter-node, run with `node build` (one process, `PORT=8080 HOST=0.0.0.0`).
  No prerendering, `ssr = true`, no cache headers set by the app, no in-memory HTML cache. The dataset
  (`content/posts.json`) is bundled into the server module and held in memory like any imported module.
- Local dev: `npm install`, copy `../../shared/public` to `static/` (git-ignored), then `WFB_MODE=static npx vite dev`.

## Implementation decisions
- **Routing**: file routes `/`, `/blog`, `/blog/[slug]`, `/about`, `/404`, `/healthz`, `/rss.xml`, `/sitemap.xml`,
  root `+layout.svelte` (skip link, header, nav, footer) and `+error.svelte`.
- **Data loading**: server `load` functions (`+page.server.ts`) read a server-only module
  (`src/lib/server/data.ts`) that imports `content/posts.json`. Pages receive only what they render: cards
  (no body) for home, blog and related lists, and the single post body for `/blog/[slug]`. The full dataset
  never reaches the browser. In static mode the same loads run during prerender; client-side navigation
  fetches the prerendered `__data.json` files.
- **Mode switch**: `export const prerender = __WFB_STATIC__` in the root `+layout.server.ts` and in each `+server.ts`
  endpoint, `trailingSlash = "never"`, `paths.relative = false` (absolute `/_app/...` URLs, because the single
  `404.html` is served for unknown paths at any depth). With adapter-static and `never`, output is `blog.html` and
  `blog/<slug>.html`, which `static.conf` resolves through `$uri.html` with no redirects.
- **404**: `+error.svelte` renders the not-found section for any 404 (unknown paths and unknown slugs, thrown by
  `error(404)` in the post load) with a real 404 status in server mode. For static mode a `/404` route is prerendered
  (`prerender.entries` includes `/404`) to a real, laid-out `404.html`; in server mode that route itself throws a 404.
- **Blog filter** (`BlogFilter.svelte`, runes): `$state` for query and tag, `$derived` filtered list, `oninput` and chip clicks call
  `replaceState` from `$app/navigation` (with a `history.replaceState` fallback if the router is not ready yet). Server mode: the load
  reads `url.searchParams` and passes `q` and `tag` as initial state, so SSR output is already filtered (and the form works without JS: hidden
  `tag` input, GET to `/blog`). Static mode: reading `url.searchParams` during prerender is an error, so the load does not
  read it; an `$effect` (browser only) reads `page.url.searchParams` after hydration. The same effect also handles card tag links
  (`/blog?tag=go`) navigated to client-side in both modes.
- **Theme toggle** (`ThemeToggle.svelte`): flips `data-theme` on `<html>` and persists to `localStorage`. The no-flash snippet is inline in
  `src/app.html`, byte for byte, before the stylesheet.
- **Head**: `Seo.svelte` uses `<svelte:head>` for title, description, canonical, Open Graph and the RSS alternate.
- **CSS and images**: `/style.css` is linked from `app.html` and plain `<img>` is used. `shared/public/` is copied to `static/` in the
  Dockerfile (git-ignored here). `app.js` is present in the output (it comes with `shared/public`) but not referenced.
- **Footer RSS link** has `data-sveltekit-reload` so the client router does a full load for the endpoint.
- **Endpoints**: `rss.xml`, `sitemap.xml` and `healthz` are `+server.ts` files. Static mode also prerenders `healthz` to a file that nginx's own
  `location = /healthz` shadows; this keeps adapter-static's `strict` check on.

## Deviations from the contract
- None in the markup the checker looks at. Svelte adds `<!--[-->` hydration comments, an extra `<div style="display: contents">` body wrapper and
  `modulepreload` links; the blog filter removes non-matching cards from the DOM instead of setting `hidden` on them.
- Static mode: `/404` (the path itself, not an unknown one) answers 200 with the 404 page, because nginx resolves it to `404.html`. Unknown
  paths answer 404.
- Server mode: SvelteKit adds an `etag` header to page responses by default; the app sets no `cache-control` and does not cache.
- Static client-side navigations (not full loads) request `<route>/__data.json`; these are prerendered and present.

## Native capabilities used or available
- Analytics: none built in. The conventional route is a script tag in `app.html`, or a server hook (`handle`) logging requests; not added here.
- Monitoring and observability: `hooks.server.ts` (`handle`, `handleError`) for logging and error reporting; optional OpenTelemetry tracing in Kit 3
  (`@opentelemetry/api` is an optional peer). Only a hand-written `/healthz` endpoint was added.
- SEO: no built-in sitemap or RSS helper; both are hand-written `+server.ts` endpoints. Meta tags are hand-written with `<svelte:head>`. Prerendering
  and per-page `<title>`/canonical come for free from the router.

## Effort log
- Started 2026-11-13 13:30:56 UTC; finished 2026-11-13 14:42:47 UTC (wall clock, with other targets building on the same host; load average above 20, the image builds
  dominated: 4 to 5 minutes for the static build stage alone).
- Build-check-fix iterations until conformance passed: 5 (Kit 3 config location, `$lib` removal and subpath imports, absolute asset URLs,
  Dockerfile chmod cost, container start). Both containers passed on their first conformance run.
- Friction:
  - SvelteKit 3 removed `svelte.config.js` (config goes in `sveltekit({...})` in `vite.config.ts`) and `$lib`: it is now `#lib` through package.json
    `imports`, which needs explicit file extensions for TypeScript (`#lib/types.ts`). Most tutorials and training data still show Kit 2.
  - `tsconfig.json` must extend `$app/tsconfig`; `svelte-kit sync` writes it to `node_modules/$app`.
  - adapter-static defaults to relative asset URLs, which break the single `404.html` served on deep unknown paths; needs `paths.relative = false`.
  - `url.searchParams` is forbidden during prerender, so the static filter needs an after-hydration `$effect` while server mode reads it in `load`.
  - `adapter-static` has no way to emit a real rendered `404.html` except a dedicated route that is prerendered; `fallback` is an SPA shell.
  - `chmod -R a+rX /repo` over an in-image `node_modules` took more than five minutes on the loaded host; only host files copied into the final images need it.
- Hand-written source lines: about 545 in `src/`, plus 27 (`vite.config.ts`) and 41 (`Dockerfile`).
