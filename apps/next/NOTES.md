# Next.js target

Started: 2026-11-13 13:30 UTC (UTC clock, `date -u`)
Finished: 2026-11-13 15:49 UTC

## Versions
- Next.js 16.4.6 (App Router, React Server Components, Turbopack production build), pinned exactly
- React / React DOM 19.3.1
- Node 24.22.3 (`node:24.22.3-alpine3.23`) for build and run; nginx 1.30-alpine for the static image
- No other dependencies: plain JavaScript (JSX), no TypeScript, no CSS tooling, no `next/image`, no `next/font`

## Modes
Both modes build from the same source; `WFB_MODE` (build-time) selects the Next output type in `next.config.mjs`.

```bash
docker build -f apps/next/Dockerfile --target static -t wfb/next:static .
docker build -f apps/next/Dockerfile --target server -t wfb/next:server .
docker run -d --name wfb-next-static -p 18110:8080 wfb/next:static
docker run -d --name wfb-next-server -p 18111:8080 wfb/next:server
node bench/conformance.mjs http://localhost:18110
node bench/conformance.mjs http://localhost:18111 --server
```

- `static`: `output: 'export'`, `next build` writes `out/`, served by nginx with `shared/nginx/static.conf`
  (nginx answers `/healthz`, `404.html` is the exported not-found page).
- `server`: `output: 'standalone'`, run with `node server.js` (`PORT=8080 HOSTNAME=0.0.0.0`) as the `node` user.
  One process, no PM2.

`content/posts.json` is copied to `data/` and `shared/public/` to `public/` inside the Dockerfile; both
directories are git-ignored, nothing shared is duplicated in the repository. To run locally outside Docker,
copy them the same way and run `node scripts/prepare-mode.mjs <mode>` on a scratch copy (it edits sources).

## Implementation decisions
- **Routing**: `app/(home)/page.jsx`, `app/blog/page.jsx`, `app/blog/[slug]/page.jsx`, `app/about/page.jsx`,
  `app/not-found.jsx`. The current nav item comes from nested layouts (`(home)`, `blog`, `about` each wrap their
  pages in `<Shell current=...>`), so the header stays a Server Component and posts count as `/blog`.
- **Server vs client components**: everything is a Server Component except `ThemeToggle` and `BlogFilter`.
  The dataset is imported only by server modules; no post body reaches the client bundle or the RSC payload of
  `/blog`.
- **Blog filter**: the server renders all 40 `<Card>`s and hands them to the client `BlogFilter` as
  `items: [{ slug, tags, search, card }]`; the client only decides which to show. It syncs `q` and `tag` to the URL with
  `history.replaceState` (Next integrates this with `useSearchParams`).
  - server mode: `page` awaits `searchParams` and passes `initialQ` / `initialTag`, so `?q=&tag=` is rendered filtered
    in the HTML, with the input value and pressed chip set.
  - static mode: `BlogFilterFromUrl` reads `useSearchParams()` inside `<Suspense>` (required by the export); the
    fallback is the full unfiltered list, which is what the exported HTML contains.
- **Theme**: the inline snippet is in the root layout `<head>` before the stylesheet link; `<html suppressHydrationWarning>`.
  `ThemeToggle` flips `data-theme` and writes `localStorage`.
- **Per-request rendering (server mode)**: `lib/dynamic.js` awaits `connection()` in every page when `WFB_MODE=server`,
  which opts the route out of prerendering; the build output lists all pages and handlers as dynamic (only Next's
  own `/_not-found` page is prerendered, see Deviations). In static mode the call is skipped.
- **404 in server mode**: a dynamic page that calls `notFound()` makes Next answer 404 with an empty HTML shell
  (`<html id="__next_error__">`, the browser then renders `not-found.jsx`), which fails the contract (`h1` "Page not
  found" must be in the HTML). Only routes that match nothing get a complete 404 page, so `next.config.mjs` adds a
  `beforeFiles` rewrite (server mode only) that sends `/blog/<anything that is not a known slug>` to a route that does
  not exist. The page still calls `notFound()` as a safety net. In static mode the exported `404.html` is nginx's `error_page`.
- **Metadata**: Metadata API (`metadata` / `generateMetadata`, `metadataBase`), one helper `lib/meta.js`.
  Canonical URLs are written in full to keep the trailing slash on `/`.
- **Feeds**: `app/rss.xml/route.js` (route handler) and `app/sitemap.js` (metadata file). `/healthz`: `app/healthz/route.js`.
- **CSS**: `<link rel="stylesheet" href="/style.css">` to the unchanged shared file in `public/`.

## Deviations from the contract
- `app.js` is not loaded (client-framework rule), but `public/` still contains it because `shared/public/` is copied whole.
- Next adds `<meta name="robots" content="noindex">` to the 404 page, and `twitter:*` meta tags next to Open Graph tags
  (Metadata API behaviour when an image is set). Framework-added; contract elements are all present.
- The card `data-post` / `data-tags` / `data-search` attributes of the vanilla island are not rendered; React state does the filtering.
- The about HTML sits in a wrapper `<div>` inside `section.about` (React cannot inject raw HTML without a host element).
- Server mode: the 404 page (`/_not-found`) is prerendered by `next build` (Next has no way to render it per request);
  every other route is dynamic. Unknown post slugs reach it through the rewrite described above.

## Native capabilities used or available
- Analytics: none built in. `@vercel/analytics` / `@next/third-parties` (GA, GTM) are the conventional add-ons; Web Vitals
  via `useReportWebVitals`. Nothing enabled here.
- Monitoring and observability: `instrumentation.js` with `@vercel/otel` / OpenTelemetry (built-in spans when
  `@opentelemetry/api` is present); `next start` logs requests only with `logging` config; health check is a hand-written route handler.
- SEO: Metadata API (title, canonical, Open Graph, alternates), `sitemap.js` and `robots.js` file conventions are built in;
  the RSS feed is hand-written (no built-in RSS helper). Sitemap here uses the built-in convention.

## Effort log
- Started 2026-11-13 13:30 UTC, finished 2026-11-13 15:49 UTC; 4 (static passed on the first build; server needed three: file permissions for the `node` user, then the 404 body, then the re-check; the static image was rebuilt once more for the final sources) build-check-fix iterations until both modes passed.
- Friction:
  - Route segment config (`dynamic`) must be a literal and cannot follow an env var, so one codebase cannot say
    `force-static` for export and dynamic for the server in the route files. `output: 'export'` refuses route handlers and
    metadata files without `force-static`, and refuses `generateStaticParams() => []`. Solved with `scripts/prepare-mode.mjs`,
    which the static build stage runs to append the config and delete `app/healthz`.
  - `notFound()` in a dynamic page does not server-render the 404 body (empty `__next_error__` shell, client renders it),
    in 15.5 and 16.x alike; worked around with a rewrite. This cost most of the debugging time.
  - `connection()` is the supported way to force per-request rendering without `force-dynamic`, which export rejects.
  - Metadata API replaces (not merges) `alternates`, so the RSS `<link rel="alternate">` has to be repeated on every page.
  - Docker builds on the shared host were slow; a `COPY --from=deps node_modules` stage hung for many minutes, so `npm ci`
    runs in the build stage itself.
- Hand-written source lines: about 610 (JSX/JS app code, config, Dockerfile, scripts) (excluding lockfile and generated output).
