# React Router target

## Versions
- react-router, @react-router/dev, @react-router/node, @react-router/serve: 8.5.1 (npm `latest`; the 7.x line is at 7.18.5, see Deviations)
- react / react-dom 19.3.1, vite 8.3.8, typescript 7.0.2, isbot 5.2.3
- Runtime: node 24.22.3 (alpine) for build and server mode, nginx 1.29-alpine for static mode
- Lockfile: `package-lock.json` (npm ci in the Dockerfile)

## Modes
Build context is the repository root; `WFB_MODE` is a build-time env var read by `react-router.config.ts`.

```bash
docker build -f apps/react-router/Dockerfile --target static -t wfb/react-router:static .
docker build -f apps/react-router/Dockerfile --target server -t wfb/react-router:server .
docker run -d --name wfb-react-router-static -p 18140:8080 wfb/react-router:static
docker run -d --name wfb-react-router-server -p 18141:8080 wfb/react-router:server
node bench/conformance.mjs http://localhost:18140
node bench/conformance.mjs http://localhost:18141 --server
```

- **static**: `ssr: false` plus `prerender` listing `/`, `/blog`, `/about`, `/404`, `/rss.xml`, `/sitemap.xml` and the 40 post
  paths. The output is `build/client`, copied to nginx with `shared/nginx/static.conf`.
- **server**: `ssr: true`, no prerender. Run by the documented production server, `react-router-serve ./build/server/index.js`
  (Express under the hood), one Node process, `PORT=8080`. `/healthz` is a resource route (not registered in the static build).
- `content/posts.json` is copied to `app/data/posts.json` and `shared/public/` to `public/` inside the Dockerfile;
  both paths are gitignored (nothing duplicated in the repo). For local dev, copy them by hand the same way.

## Implementation decisions
- **Routing**: explicit `app/routes.ts` (index, `blog`, `blog/:slug`, `about`, `rss.xml`, `sitemap.xml`, `healthz` in server
  mode, and a `*` splat). Shell (head, skip link, header, footer, theme script) is the root `Layout` export.
- **Data**: loaders in each route read `app/lib/posts.server.ts` (the only module that touches the full dataset, so post
  bodies never reach the client bundle; verified by grepping the built assets). Home sends 6 cards, `/blog` sends cards
  without bodies, a post sends its own body plus prev/next titles and 3 related cards.
- **Head**: each route exports `meta` (title, description, og:*, and the canonical `<link>` through the `tagName: "link"`
  descriptor). Root `links` carries RSS, icon and `/style.css` (plain link, not a CSS import). The theme snippet is inline,
  byte for byte, between `<Meta/>` and `<Links/>`.
- **Interactivity**: `ThemeToggle` and `BlogFilters` are React components; `shared/public/app.js` is deleted from the output.
  The filter keeps `q` and `tag` in the URL with `useSearchParams` and `replace: true`.
  - server build: the `/blog` loader filters from `request.url`, so the SSR response is already filtered, and typing
    navigates (replace) so the loader runs again.
  - static build: the loader returns every card, `shouldRevalidate` skips search-only changes, and the component applies the
    URL after hydration (a `ready` flag avoids a hydration mismatch with the query-less prerendered HTML).
- **404**: `blog/:slug` throws `data(null, { status: 404 })` rendered by the root `ErrorBoundary`; the splat route throws it
  too in server mode. In static mode `/404` is prerendered (the splat loader does not throw there) and the Dockerfile copies
  `404/index.html` to `404.html` for nginx's `error_page`. The 404 head is React 19 hoisted `<title>/<meta>/<link>` in the boundary.
- **Resource routes**: `rss.ts`, `sitemap.ts` and `healthz.ts` return `Response` objects; prerender writes `rss.xml` and
  `sitemap.xml` as plain files in static mode.

## Deviations from the contract
- **Version**: the brief says React Router v7, but the current stable release on npm is 8.5.1, and the brief says to use the
  current stable one, so 8.5.1 is used (framework mode, same architecture; the 7.x line is 7.18.5).
- **Static 404 file**: React Router prerenders a path as a directory (`404/index.html`, and even `/404.html` became
  `404.html/index.html`), so the static stage of the Dockerfile copies it to `404.html`. It also removes `app.js` and
  `__spa-fallback.html` from the output. Otherwise none; markup differs from the reference only by React wrappers
  (`data-discover` attributes, NavLink `class=""`, `<script>` payloads for hydration, modulepreload links) and by the absence of
  `data-*` hooks that only the vanilla island used.
- Static mode serves `*.data` files (client navigation payloads, e.g. `/blog/<slug>.data`, `/_.data`) next to the HTML.

## Native capabilities used or available
- Analytics: none built in; conventional is a script tag or a server-side hook in `entry.server.tsx` (not used here).
- Monitoring and observability: `react-router-serve` logs requests via morgan; `/healthz` is hand-written; custom
  `entry.server.tsx` `handleError` is the hook for error reporting; OpenTelemetry via the Node SDK is conventional, not built in.
- SEO: `meta`/`links` exports are built in; sitemap and RSS are hand-written resource routes (no first-party generator).

## Effort log
- Started: 2026-11-13 13:33:30 UTC (clock noted in the first command at 13:31). Finished: 2026-11-13 14:52:19 UTC.
- Build-check-fix iterations: 2. (1) static: typecheck fixes (the v8 `meta` argument is `loaderData`, `prerender` type),
  404.html experiment, then a Docker build that passed 1214/1214 on the first run; (2) server: container looked dead for ~15 s
  (see friction), CMD switched from `npm run start` to the binary directly, 1257/1257.
- Wall clock is dominated by host load (load average 20-36 from parallel builds): the first Docker build took 22 min and the
  second 37 min, almost all in the context transfer and `npm ci`; the real work was a minute or two.
- Friction:
  - `prerender` always writes `<path>/index.html`, so there is no direct way to get `404.html`.
  - the `meta` function argument changed from `data` to `loaderData` and `ShouldRevalidateFunctionArgs` is exported from
    `react-router`, not from the generated `+types`; both only visible through `tsc`.
  - no error boundary `meta`: the 404 head needs React 19 hoisted tags in the boundary.
  - `react-router-serve` prints nothing until it listens, and under load took more than 10 s to start inside the container,
    which looks like a hung container.
  - a prerendered static site still needs hydration-safe URL handling for the filter (`ready` flag).
- Hand-written source lines: ~670 (app, config, Dockerfile; no lockfile, no generated types).
