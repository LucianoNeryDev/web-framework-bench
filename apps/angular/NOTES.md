# Angular target

## Versions
- Angular 22.2.6 (`@angular/core`, `common`, `compiler`, `platform-browser`, `platform-server`, `router`, `compiler-cli`), standalone components, signals, zoneless (no `zone.js`)
- `@angular/ssr` 22.2.7, `@angular/build` 22.2.7 (application builder, esbuild), `@angular/cli` 22.2.7
- Express 5.3.0, rxjs 7.8.2, tslib 2.9.1, TypeScript 6.0.3 (Angular 22 needs `>=6.0 <6.1`)
- Node 26.13.0 (`node:26.13.0-slim`, build stages and the server image), nginx 1.30-alpine for static mode
- Exact versions are pinned in `package.json`; `package-lock.json` is committed.

## Modes
Two images from one `Dockerfile` (build context: repository root), two Angular build configurations in `angular.json`.

```bash
docker build -f apps/angular/Dockerfile --target static -t wfb/angular:static .
docker build -f apps/angular/Dockerfile --target server -t wfb/angular:server .
docker run -d --name wfb-angular-static -p 18150:8080 wfb/angular:static
docker run -d --name wfb-angular-server -p 18151:8080 wfb/angular:server
node bench/conformance.mjs http://localhost:18150
node bench/conformance.mjs http://localhost:18151 --server
```

- `static`: `ng build --configuration static` (`outputMode: "static"`). A file replacement swaps
  `app.routes.server.ts` for `app.routes.server.static.ts`, which marks every route `RenderMode.Prerender`, with
  `getPrerenderParams` listing the 40 slugs. 44 routes are prerendered (`/`, `/blog`, `/about`, 40 posts, `/404`).
  `tools/post-static.mjs` then renames `404/index.html` to `404.html` and writes `rss.xml` and `sitemap.xml`
  (`src/feeds.ts`, run by Node's native type stripping). nginx serves `dist/angular/browser` with `shared/nginx/static.conf`
  (`/blog` resolves to `blog/index.html`, `/blog/<slug>` to `blog/<slug>/index.html`, no redirects).
- `server`: `ng build --configuration server` (`outputMode: "server"`), one catch-all route `RenderMode.Server`, nothing
  prerendered ("Prerendered 0 static routes"). Run with `node dist/angular/server/server.mjs` (Express 5 +
  `AngularNodeAppEngine`, the scaffold's `server.ts` plus `/healthz`, `/rss.xml` and `/sitemap.xml`). Feeds are
  computed per request. One Node process, no PM2.
- Outside Docker: `npm ci && npm run build:static` or `npm run build:server` in `apps/angular`.

`tools/prepare.mjs` runs before every build. It copies `shared/public/` into `public/` (Angular copies that to the output
root), and writes `src/generated/` from `content/posts.json`. Both are gitignored, so no shared file is duplicated in git.
`angular.json` imports `../../shared/public/style.css` through the normal CSS pipeline (hashed, critical CSS inlined by
the production defaults); the Dockerfile keeps the same `apps/angular` next to `shared/` layout so that path resolves.
`/style.css` is still served too, because `public/` holds the whole shared directory.

## Implementation decisions
- **Routing**: `provideRouter` with `withComponentInputBinding`. `/` is eager; `/blog`, `/blog/:slug`, `/about` and the
  not-found page use `loadComponent`. `blog/:slug` has a `canMatch` guard (slug exists), so an unknown post falls through to
  the `**` route and renders the 404 page, with no redirect. The `**` route is the not-found page.
- **Data**: `prepare.mjs` writes `generated/index.ts` (site, tags and the 40 posts without bodies) and one module per post
  body, plus `generated/bodies.ts`, a slug to `() => import()` map. The post route has a resolver that awaits the body,
  so the body is a lazy chunk fetched only on a post page (SSR awaits it; the browser waits for it before activating the
  route, so hydration sees the same markup). Pages other than a post never load a body. The metadata index (about 28 kB
  raw) is in the main bundle because the cards and the filter need it everywhere.
- **Post body**: `div.post-body [innerHTML]` with `DomSanitizer.bypassSecurityTrustHtml`. The HTML is trusted, pre-rendered
  content from `content/posts.json`; the default sanitizer would strip its `class` attributes. The about HTML is bound
  the same way.
- **Cards**: `PostCard` is an attribute component (`article[appPostCard]`, `host: {class: 'card'}`), so the output is
  `<article class="card">` with no wrapper element inside `.card-grid`.
- **Theme toggle**: `ThemeToggle` (`button[appThemeToggle]`) holds a `theme` signal. The inline `<head>` snippet in
  `index.html` (byte for byte) applies the theme before paint; the component reads `html[data-theme]` after the first render and
  writes both the attribute and `localStorage` on click.
- **Blog filter**: `Blog` holds `q` and `tag` signals and a `computed` filtered list rendered with `@for`. Typing or
  pressing a chip updates the signals and calls `router.navigate([], {queryParams, replaceUrl: true})`, so the URL keeps
  `q` and `tag` without a reload or a history entry. On the server the query is read from the route snapshot, so server mode
  renders `?q=&tag=` already filtered (input `value`, pressed chip, count, empty state). The rendered filter state is put
  in `TransferState` (a tiny `{q, tag}` object, not an HTTP cache), the browser starts hydration from it so the markup
  matches, and then `afterNextRender` subscribes to `queryParamMap`: in static mode this is what applies the URL's
  query after hydration; it also reacts to a tag link clicked on the page.
- **Head**: a small `Seo` service uses `Title`, `Meta` and a canonical `<link>` per page. `index.html` carries the static
  tags (charset, viewport, RSS alternate, icon, theme snippet).
- **404 status**: `NotFound` injects `RESPONSE_INIT` and sets `status = 404`; in server mode that is the real response status.
  In static mode there is a `/404` route that is prerendered and renamed to `404.html`, which nginx serves with `error_page`.
- **Allowed hosts**: Angular 22 rejects unrecognised `Host`, `X-Forwarded-Host` and `Forwarded` values with 400. For this
  benchmark, which runs behind a proxy and under aliases like `wfb-run:8080`, every host is allowed with
  `"security": {"allowedHosts": ["*"]}` in `angular.json` (baked into the server build) and `NG_ALLOWED_HOSTS=*` in the
  server image. Do not do this in production without a proxy that already validates the host.
- **No `<base href>`**: `APP_BASE_HREF` is provided instead. A `<base href="/">` would make the skip link's `#main` resolve to
  `/#main` on every page. Without it, relative asset URLs break on nested routes, so `"deployUrl": "/"` makes the
  built index reference `/main-*.js` and `/styles-*.css`.
- **Hydration**: `provideClientHydration()` with the defaults (in v22 this also includes event replay, which adds a small
  inline script and `jsaction` attributes). No `HttpClient`, so no HTTP transfer cache.

## Deviations from the contract
- Extra attributes from the framework: `routerlink`, `routerlinkactive`, `ariacurrentwhenactive`, `ngh`, `jsaction`,
  `ng-version`, and an inline event-dispatch script. `<app-root>` wraps the page.
- `data-post`, `data-tags` and `data-search` on the cards and `data-filters`, `data-result-count`, `data-empty`,
  `data-theme-toggle` are not emitted (they exist only for the vanilla `app.js`). `[data-post-list]` and the contract
  classes are present.
- The about HTML sits in a `<div>` inside `section.about` (needed for `[innerHTML]`); in the reference it is direct children.
- On `/blog/<unknown>` the 404 page marks Blog as `aria-current` in the nav, because the URL starts with `/blog`
  (the reference 404 page marks nothing). The checker does not look at the nav on 404 pages.
- The `<style>` and `<link media="print" onload>` for the stylesheet come from Angular's critical-CSS inlining, not a plain
  `<link rel="stylesheet" href="/style.css">`.
- The theme snippet is kept byte for byte, but Angular moves the `<style>`, stylesheet link and the meta tags it manages
  after it in `<head>`, so the snippet still precedes any stylesheet.

## Native capabilities used or available
- Analytics: nothing built in. Conventional: a script tag in `index.html` or a vendor SDK; Google Analytics via third parties.
- Monitoring and observability: none built in (`/healthz` is hand-written in `server.ts`, no request logging, no graceful
  shutdown in the scaffold's server). OpenTelemetry's Node SDK can wrap Express; there is no render-time hook.
- SEO: `Title` and `Meta` services (used), router `title` property available, prerender/SSR gives crawlable HTML.
  Sitemap and RSS are not built in: hand-written here (`src/feeds.ts`), per request in server mode and at build time in static mode.

## Effort log
- Started Fri Nov 13 13:57:16 UTC 2026.
- Finished Fri Nov 13 02:57:17 PM UTC 2026. 4 build-check-fix iterations until conformance passed: (1) first static build had no `404.html`, (2) first server check failed on 404s for relative asset URLs on nested routes (`deployUrl` fix), (3) and (4) the two Docker image builds, which passed first time.
  Image builds are slow on the loaded host (`npm ci` plus `ng build` took 3 to 13 minutes).
- Friction:
  - `ng build` in `static` mode does not emit `404.html` for a `**` route (no automatic 404 file); the workaround is an explicit
    `/404` route that is prerendered and renamed after the build.
  - With no `<base href>`, relative asset URLs (`main-*.js`) 404 on nested routes, and with `<base href="/">` the `#main`
    skip link navigates to `/#main`. `deployUrl` plus `APP_BASE_HREF` resolves both, but neither is in the SSR guide.
  - The static configuration sets `"ssr": false` (no server entry) yet still prerenders through `server: src/main.server.ts`. The two modes need different
    server route tables, which a `fileReplacements` entry handles; this is not documented together anywhere I found.
  - `npm ci` is slow (313 packages, install scripts for esbuild, lmdb, msgpackr-extract and @parcel/watcher are skipped by npm 11).
  - The scaffold's `@angular/cli` prompts and analytics need `NG_CLI_ANALYTICS=false`; `ng new` was run only once to get the
    scaffold layout, nothing generated is left over.
- Hand-written source lines (excluding lockfile and generated output): about 700 (`src/`, `tools/`, config).
