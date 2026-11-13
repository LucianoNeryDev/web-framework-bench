# Qwik City target

Started: 2026-11-13 13:57:24 UTC (`date -u` at task start)
Finished: 2026-11-13 15:56 UTC

## Versions
- `@builder.io/qwik` 1.20.4 and `@builder.io/qwik-city` 1.20.4 (the stable **Qwik v1** line, npm `latest`).
  Qwik v2 (`@qwik.dev/core`, `@qwik.dev/router`) is still a release candidate (2.0.0-rc.5 on 2026-11-13), so it
  was deliberately not used.
- Vite 7.3.7, vite-tsconfig-paths 4.3.2, TypeScript 5.4.5 (all as scaffolded by `create-qwik@1.20.4`, pinned exactly).
- Server mode: Express 4.22.0 (the version `qwik add express` pins), undici 8.12.4 (runtime import of the Node adapter).
- Node 24 (`node:24-alpine`) in the images; Node 26.8.1 on the host (host runs were only used for iteration).
- nginx 1.29-alpine for static mode.
- Starter and adapters were generated with `npm create qwik@1.20.4 empty`, `qwik add express`, `qwik add static`,
  then trimmed (no eslint, prettier, CSS-modules plugin, dotenv, compression, dev/preview entries).

## Modes
Build context is the repository root.

```bash
docker build -f apps/qwik/Dockerfile --target static -t wfb/qwik:static .
docker run -d --name wfb-qwik-static -p 18160:8080 wfb/qwik:static
node bench/conformance.mjs http://localhost:18160

docker build -f apps/qwik/Dockerfile --target server -t wfb/qwik:server .
docker run -d --name wfb-qwik-server -p 18161:8080 wfb/qwik:server
node bench/conformance.mjs http://localhost:18161 --server
```

- `static`: `npm run build:static` = `vite build` (client) then `vite build -c adapters/static/vite.config.ts`, which
  runs the Qwik City static site generator over every route (44 pages: `/`, `/blog`, `/about`, 40 posts, `404.html`)
  and the two endpoints (`rss.xml`, `sitemap.xml`). The `dist/` output goes to nginx with `shared/nginx/static.conf`.
  `/healthz` is answered by nginx (excluded from SSG).
- `server`: `npm run build:server` = `vite build` then `vite build -c adapters/express/vite.config.ts`, which emits
  `server/entry.express.js`. The image runs `node server/entry.express` (one process, `PORT=8080`). The adapter's own
  prerendering is switched off (`ssg: null`), so nothing is prerendered: every page, `/rss.xml`, `/sitemap.xml`,
  `/healthz` and the 404 page are rendered per request. No in-memory cache is added; Qwik City sets no
  `Cache-Control` on page responses. Static assets (`/build`, `/assets`, `public/`) are served by `express.static`
  from the starter entry. The server answers any Host header (checked with `Host: wfb-run`).
- `shared/public/` is copied into `public/` in the Dockerfile (and `public/` is git-ignored here). `style.css` is
  linked as `/style.css`; `app.js` is not loaded.

## Implementation decisions
- **Routing**: file based, `trailingSlash: false` in `qwikCity()`. SSG writes `blog/index.html` and
  `blog/<slug>/index.html`; `static.conf` resolves `/blog` and `/blog/<slug>` through `$uri/index.html` without redirects.
  `blog/[slug]` has `onStaticGenerate` listing the 40 slugs.
- **Data**: `content/posts.json` is imported from `../../../../content/posts.json` (the Dockerfile puts it at
  `/repo/content/` so the relative path is the same as in the repository). `src/lib/data.ts` is server-only (used in
  `routeLoader$` bodies, endpoints and `onStaticGenerate`). `src/lib/site.ts` re-exports only the named `site` and
  `tags`, so Vite tree-shakes the 40 posts out of client code.
- **Loaders**: `/` returns 6 card objects, `/blog` returns 40 card objects (no bodies) plus the `q`/`tag` read from
  the request URL, `/blog/<slug>` returns that post, its prev/next titles and 3 related cards. Nothing carries the full
  dataset. Unknown slugs set status 404 in the loader and render the 404 section.
- **Filter** (`components/post-filter.tsx`): `useSignal` for `q` and `tag`, `useComputed$` for the visible list,
  chips with `aria-pressed`, `history.replaceState` for `q`/`tag`. In server mode the loader reads `?q=&tag=` per
  request, so SSR already renders the filtered list, the input value and the pressed chip (works without JS for the
  text query through the plain GET form). In static mode the page is prerendered unfiltered and a
  `useVisibleTask$` (`document-ready`) applies `location.search` on load and after client-side navigations.
- **Theme toggle** (`components/theme-toggle.tsx`): the flip itself is a `sync$` handler (inlined into the HTML, runs
  inside qwikloader's click listener, so `html[data-theme]` changes immediately and no component code is needed); a
  second `$` handler stores the choice in a `useSignal` shown as the button tooltip. A plain lazy `$` handler failed
  the conformance check: it reads `data-theme` right after the click, before the lazily imported handler has run
  (reproduced with a probe script), so the DOM write had to be synchronous.
- **Head**: `lib/head.ts` builds the `DocumentHead` (title, description, canonical, Open Graph, RSS alternate, icon);
  `root.tsx` places the byte-exact theme snippet before the `/style.css` link. `<html lang="en">` is set in
  `entry.ssr.tsx` (the starter default is `en-us`).
- **404**: `routes/404.tsx` gives SSG its `404.html` with the site layout. Qwik City's server never renders that route
  per request: it serves a 404 page that was prerendered at build time (or a generic one when there is none). So server
  mode has a catch-all route `routes/[...catchall]` that renders the same 404 content with `status(404)` per request.
- **RSS and sitemap**: hand-written endpoints (`routes/rss.xml/index.ts`, `routes/sitemap.xml/index.ts`) with
  `onGet`. SSG writes them to `dist/rss.xml` and `dist/sitemap.xml` without extra configuration; the static adapter's
  own sitemap output is turned off (`sitemapOutFile: null`) so it does not overwrite the endpoint.
- **Links** use Qwik City's `<Link>` (client-side navigation plus prefetch), kept at its defaults. Plain `<a>` is used
  only for `/rss.xml` and the skip link. Images are plain `<img>`.
- **Qwik defaults kept** (they are part of what is measured): qwikloader, modulepreload bundle graph / preloader,
  `q:` attributes and the serialized `qwik/json` state, `view-transition` style. Left out because the empty starter does not
  ship them in 1.20.4 or they are not part of the contract: service worker (the 1.20.4 starter has none), `manifest.json`
  and `robots.txt` (not copied from the starter).

## Deviations from the contract
- Extra wrappers from the framework: `<!--qv-->` comments, `q:*` attributes on elements, `data-prefetch` on links,
  `on:*` listener attributes, `qwik/json` script tags. The post body and the About text sit in a wrapper `div`
  (`.post-body` as specified; `.about-body` added, because `dangerouslySetInnerHTML` needs an element).
- Cards do not carry `data-post`, `data-tags` or `data-search` (the filter works on data, not on the DOM), and the
  filter form and result count do not carry the reference's `data-*` hooks, only the contract classes and `data-post-list`.
- A post page serializes its own post object (including the body HTML) a second time in `qwik/json`, because the
  route component subscribes to the loader value and client-side navigation between posts re-renders from it. Hiding
  it with `untrack` broke prev/next navigation (stale body), so the default behaviour was kept: roughly 7 KB extra
  per post page. List pages carry card objects only.
- In static mode the filter is applied after JS loads (as the contract describes); the `useVisibleTask$` is also
  present in server mode, where it finds nothing to change.

## Native capabilities used or available
- Analytics: none built in. Conventional route is Partytown (`qwik add partytown`) for a third-party tag, or a plain
  script tag for Plausible/Umami; Qwik Insights exists for Qwik's own bundle tuning, not site analytics. Nothing added here.
- Monitoring and observability: no health check, metrics or OpenTelemetry support in the framework. Hooks are request
  middleware (`onRequest`, `plugin@*.ts`) and `sharedMap`; the Express entry adds an `uncaughtExceptionMonitor` logger.
  `/healthz` is a hand-written endpoint here (server mode). No SIGTERM handling in the adapter entry.
- SEO: `DocumentHead` (title, meta, links) is built in; sitemap generation exists in the static adapter
  (`sitemapOutFile`) but is only a flat list of prerendered paths without `lastmod`, so a hand-written endpoint is
  used. RSS has no helper: hand-written endpoint.

## Effort log
- Started 2026-11-13 13:57:24 UTC; finished 2026-11-13 15:56 UTC.
- Build-check-fix iterations until both modes passed conformance: 4 (first host run: 404 page used Qwik's generic
  prerendered page in server mode, theme toggle raced the lazy handler, prev/next navigation was stale after `untrack`;
  then the Docker images, which needed 3 packaging fixes: a Dockerfile.dockerignore so the repository context stays small,
  a narrow `chmod` that skips `node_modules`, and installing only the production dependencies in the server stage
  instead of `npm prune`).
- Friction:
  - The Express adapter prerenders `404.html` and an empty `sitemap.xml` into `dist/` by default (a mini SSG run);
    `ssg: null` turns it off, but then Qwik City has no per-request 404 page, hence the catch-all route.
  - Qwik City's 404 is a prerendered HTML file, not a rendered route, which clashes with "every page rendered per request".
  - `useVisibleTask$`, `sync$` vs `$`: a lazy click handler is not synchronous, which matters for anything (or any
    test) that reads the DOM right after a click.
  - Default `RouterHead` from the starter spreads `key` into the DOM (`<meta key="...">`); stripped in `router-head.tsx`.
  - Loader data is serialized into the page for client-side navigation, so each post body appears twice in the HTML.
  - Docker build on the loaded host: `chmod -R` and `npm prune` over `node_modules` are very slow because every touched
    file is copied up into a new layer.
- Hand-written source lines (excluding lockfile, generated output and the scaffolded vite/tsconfig/entry files):
  about 800 lines of TypeScript/TSX under `src/` and `adapters/`, plus a 40-line Dockerfile.
