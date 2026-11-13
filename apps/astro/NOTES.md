# Astro target

Started (UTC): Fri Nov 13 01:30:45 PM UTC 2026
Finished (UTC): Fri Nov 13 03:59:30 PM UTC 2026

## Versions
- astro 7.4.11, @astrojs/node 11.1.12 (server mode only), @astrojs/rss 4.0.19 (RSS endpoint), npm lockfile committed
- Node: `node:26-slim` (26.13.0) for build and server mode; nginx `nginx:1.30-alpine` for static mode
- No UI framework, no TypeScript package (Vite strips the `.ts` types), no `@astrojs/sitemap`

## Modes
Both modes share one Dockerfile; the build-time env var `WFB_MODE` (set by the build stages) switches
`astro.config.mjs` between `output: "static"` and `output: "server"` with `node({ mode: "standalone" })`.
Build context is the repository root.

```bash
docker build -f apps/astro/Dockerfile --target static -t wfb/astro:static .
docker build -f apps/astro/Dockerfile --target server -t wfb/astro:server .
docker run -d --name wfb-astro-static -p 18120:8080 wfb/astro:static
docker run -d --name wfb-astro-server -p 18121:8080 wfb/astro:server   # runs: node ./dist/server/entry.mjs
node bench/conformance.mjs http://localhost:18120
node bench/conformance.mjs http://localhost:18121 --server
```

- `static`: `astro build` prerenders 44 pages (`build.format: "file"` gives `blog.html`, `blog/<slug>.html`,
  `404.html`, `rss.xml`, `sitemap.xml`), served by `shared/nginx/static.conf`. `/healthz` is answered by nginx.
- `server`: no page sets `prerender`; every route, including `rss.xml`, `sitemap.xml` and `healthz`, is rendered per
  request by the Node standalone server on port 8080 (`HOST=0.0.0.0 PORT=8080`). The image installs production
  dependencies only.

`shared/public/` is copied to `public/` and `content/posts.json` to `src/data/posts.json` in the Dockerfile
(both gitignored). `public/app.js` is deleted: this target does not load the vanilla island.

## Implementation decisions
- Pages are file-based routes: `index.astro`, `blog.astro`, `blog/[slug].astro`, `about.astro`, `404.astro`, and
  endpoints `rss.xml.ts`, `sitemap.xml.ts`, `healthz.ts`. One layout (`Base.astro`), components `Card`, `TagList`,
  `ThemeToggle`, `BlogFilter`.
- Data comes from a JSON import (`src/lib/content.ts`) that the Dockerfile fills; there is no content collection,
  because the dataset is already rendered HTML and the contract forbids recomputing fields.
- Interactivity is framework-free: `<script>` blocks inside `ThemeToggle.astro` and `BlogFilter.astro`, bundled
  and hoisted by Astro (small ones are inlined as module scripts). No island, no hydration directive.
- The filter renders all 40 cards and marks non-matches `hidden`. In server mode `Astro.url.searchParams` drives
  the initial state (input value, pressed chip, count, empty state), so the form works without JS and the island
  can still restore the full list on the client. In static mode the search params are empty and the island filters
  on load from `location.search`. `history.replaceState` keeps `q` and `tag` in the URL.
- Unknown post slugs in server mode call `Astro.rewrite("/404")`, which keeps the 404 status. Unknown routes fall
  through to `404.astro` automatically in both modes.
- The theme snippet is injected with `<Fragment set:html>` so it stays byte-for-byte in `<head>` (an inline
  `<script>` would be processed by the compiler).
- The RSS endpoint uses `@astrojs/rss` with `trailingSlash: false` (its default appends `/` to item links, which
  the contract does not allow). The sitemap is hand-written: `@astrojs/sitemap` writes `sitemap-index.xml` and only
  lists prerendered routes.
- `compressHTML` is left at Astro's default (on), so the HTML is minified, not pretty-printed.

## Deviations from the contract
None. The markup differs from the reference only by whitespace (minified) and Astro-added module `<script>` tags
placed in the body (the theme toggle script right after the button, the filter script after the empty-state paragraph), which the
contract allows as framework wrappers.

## Native capabilities used or available
- Analytics: none built in. Conventional: a script tag in the layout or Partytown for third-party scripts;
  Astro has no first-party analytics.
- Monitoring and observability: none built in; the Node adapter logs the listening address only. Conventional:
  middleware (`src/middleware.ts`) for request logging and timing, plus OpenTelemetry through the Node runtime.
  `/healthz` is a hand-written endpoint here.
- SEO: `@astrojs/rss` (used) and `@astrojs/sitemap` (not usable for `/sitemap.xml` here, see above) are official
  integrations. Meta tags and canonical links are written by hand in the layout; there is no head helper.

## Effort log
- Started 2026-11-13 13:30:45 UTC, finished 2026-11-13 15:59 UTC (most of the wall time was Docker builds on a
  host shared with several other builds; a single image build took 10 to 20 minutes under I/O wait).
- Build-check-fix iterations: 4 (1: static build, RSS item links had a trailing slash; fixed with the
  `trailingSlash: false` option, verified with a host build for speed; 2: server image crashed with a
  permission error on the host-copied `package.json` under umask 077; 3: `chmod -R` on `node_modules` made one
  layer take over 20 minutes, so the chmod was moved to the host-copied files only; 4: final rebuilds, both
  modes 0 failures).
- Friction:
  - `@astrojs/rss` appends a trailing slash to item links unless `trailingSlash: false` is passed; this is only
    visible in the output, the docs mention it in passing.
  - `@astrojs/sitemap` does not fit a flat `/sitemap.xml` (index plus chunk files, prerendered routes only), so
    the endpoint is hand-written.
  - `chmod -R` over a large `node_modules` in a later layer copies every file up (overlayfs), which is very slow
    on a busy disk. Copy from a stage that already produced readable files instead.
- Hand-written source lines (excluding lockfile and generated output): about 370 (src, config, Dockerfile).
