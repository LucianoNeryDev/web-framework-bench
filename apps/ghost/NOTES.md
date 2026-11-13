# Ghost target (ghost and ghost-cached)

Ghost with a custom Handlebars theme on MySQL 8, behind nginx, which is Ghost's documented production setup. One compose
file, two benchmark targets selected by `WFB_CACHE`: `off` is target `ghost` (every page request goes to Ghost), `on` is
target `ghost-cached` (nginx `proxy_cache` in front of Ghost).

Start: Fri Nov 13 13:58:21 UTC 2026
End: Fri Nov 13 16:21:31 UTC 2026 (8 build-check-fix iterations)

## Versions
- Ghost 6.77.0, official image `ghost:6.77.0-alpine` (Node 22.23.5, Ghost-CLI 1.34.1 in the image, not used), `NODE_ENV=production`.
- MySQL 8.4.13 (`mysql:8.4.13`), the 8.4 LTS line; Ghost supports MySQL 8.0 and 8.4 in production.
- nginx 1.29 (`nginx:1.30-alpine`, as the brief asked; 1.30/1.31 exist).
- No npm dependencies of our own: the seed job and the theme-data generator use only Node built-ins (`fetch`, `fs`), so
  there is no lockfile. The theme has no build step and no assets.

Images (built by compose from the repository root):
- `wfb/ghost:server`: Ghost plus the theme, `routes.yaml`, `posts.json` and the seed script. Runs both the `ghost` and the
  one-shot `seed` service.
- `wfb/ghost-nginx:server`: nginx plus `shared/public/` and the proxy config.

## Modes
```bash
WFB_PORT=18200 WFB_CACHE=off docker compose -p wfb-ghost -f apps/ghost/compose.yaml up -d --build --wait
node bench/conformance.mjs http://localhost:18200
WFB_PORT=18200 WFB_CACHE=on  docker compose -p wfb-ghost -f apps/ghost/compose.yaml up -d --build --wait
node bench/conformance.mjs http://localhost:18200
docker compose -p wfb-ghost -f apps/ghost/compose.yaml down -v
```
Switching `WFB_CACHE` only recreates the nginx container. Conformance runs without `--server` (see Deviations).

Services:
- `db`: MySQL, healthcheck `mysqladmin ping` over TCP (the init-time temporary server has networking off, so it only
  passes once the real server is up).
- `ghost`: healthcheck `GET /ghost/api/admin/site/` with `X-Forwarded-Proto: https`.
- `seed`: one-shot, `restart: "no"`, runs after Ghost is healthy, on every `up`.
- `nginx`: starts only after `seed` completed successfully; healthcheck `/healthz` and `/blog`. Published as
  `${WFB_PORT:-8080}:8080`.
- Ghost, MySQL and the seed job share an `internal: true` network with no route out; nginx is on that network and on the
  published one. Nothing but nginx can reach or be reached from outside.

Healthchecks use `start_period: 3600s` with `start_interval: 3s`: a fresh Ghost creates about 150 tables on first boot,
which took 32 minutes on the loaded build host (a restart on an existing database takes 1 to 8 minutes there). Steady-state
checks run every 30 s.

## Implementation decisions
- **Theme** (`theme/`): `default.hbs` is the shared layout; each template fills `{{#contentFor "meta"}}` (title,
  description, canonical, Open Graph) through `partials/meta.hbs`, and `{{#contentFor "nav"}}` through `partials/nav.hbs`
  (`aria-current` via `{{#match}}`). Templates: `home.hbs` (custom route `/`, `{{#get "posts" limit="6"}}`), `index.hbs`
  (the `/blog/` collection, `posts_per_page: 40` in `package.json`, first three cards eager via `{{#match @number "<=" 3}}`),
  `post.hbs`, `page.hbs` (About), `error-404.hbs`, `rss.hbs`, `sitemap.hbs`. `{{ghost_head}}`/`{{ghost_foot}}` are left out
  on purpose: they inject Portal, search (from a CDN), card CSS/JS and Ghost's own meta tags, all of which the contract
  forbids or duplicates.
- **Routing** (`ghost/routes.yaml`): `/` custom route (`home`), collection `/blog/` with permalink `/blog/{slug}/`, the About
  page at Ghost's page URL `/about/`, `/rss/` and `/fieldnotes-sitemap/` custom routes with `content_type: xml` (Ghost's
  documented custom-RSS pattern), and no taxonomies, so `/tag/*` and `/author/*` are 404s. The file is copied into the content
  volume on every container start by `ghost/entrypoint.sh` (with the theme), then the official entrypoint runs.
- **No redirects**: Ghost 301s every extensionless path without a trailing slash. nginx rewrites the URI internally before
  proxying (`rewrite ^(.*/[^/.]+)$ $1/ break;`), so `/blog`, `/blog/<slug>`, `/about` and unknown paths reach Ghost as
  `/blog/`, `/blog/<slug>/`, ... and the client never sees a slash or a 301. `/rss.xml` maps to `/rss/` and `/sitemap.xml`
  to `/fieldnotes-sitemap/`. Every link in the theme is written without a trailing slash.
- **Host and scheme**: Ghost's `url` is `https://bench.example`, so canonical, Open Graph, RSS and sitemap URLs match the
  contract. Ghost only redirects when its url is https and the request is not secure (it does not check the host), so
  nginx always sends `X-Forwarded-Proto: https` (TLS is taken to end in front of nginx) and passes `Host` through. Ghost builds
  absolute URLs from its config, so the site renders identically as `http://localhost:<port>` and `http://wfb-run:8080`.
- **Static files**: nginx serves `/style.css`, `/app.js`, `/favicon.svg` and `/images/*` from `shared/public/`; unknown
  images fall through to Ghost (plain-text 404, Ghost's behaviour for paths with an extension).
- **Seeding** (`seed/seed.mjs`, idempotent, every `up`): completes the owner setup through
  `POST /ghost/api/admin/authentication/setup/` once, signs in with a staff session (`Origin: https://bench.example`;
  `security.staffDeviceVerification` is off because there is no mail), sets title, description, timezone, locale, members
  sign-up `none`, Explore ping and social web off; creates missing tags in dataset order; deletes Ghost's fixture post, tag
  and pages; creates missing posts oldest first with `POST /posts/?source=html` (title, slug, `published_at`, html,
  `custom_excerpt` = summary, tags, `feature_image` = cover path, `feature_image_alt` = cover alt); replaces the fixture
  About page (Ghost ships one with the slug `about`); activates the theme; fails unless exactly 40 posts exist. A rerun
  creates nothing (`seed ok: 0 tags and 0 posts created, 40 posts total`).
- **Per-post data Ghost has no field for**: Ghost posts have no custom fields, so the theme carries the rest of
  `posts.json`, generated at image build time by `tools/theme-data.mjs` into `partials/data/` and looked up by slug with
  Ghost's documented dynamic partials, `{{#> (concat "data/minutes/" slug)}}{{/undefined}}` (GScan rejects the inline form):
  `readingMinutes` (Ghost's `{{reading_time}}` uses 275 wpm plus image time, the dataset 220 wpm), the lower-cased
  `data-search` text for app.js (Handlebars has no lower-case helper), the three `related` posts (one
  `{{#get "posts" filter="slug:[a,b,c]"}}` rendered in the given order) and the tag chips in dataset order. Internal tags
  were the alternative; they cannot hold the search text, and would put about 45 bookkeeping tags in the CMS.
- **Native Ghost data**: `dateLabel` and `<time datetime>` come from `{{date published_at format="D MMM YYYY"}}` and
  `"YYYY-MM-DD"` (site timezone UTC; identical strings). `prev`/`next` use Ghost's `{{#prev_post}}`/`{{#next_post}}`
  (published-at adjacency, which is how the dataset defines them; verified for all 40 posts). The cover is
  `{{img_url feature_image}}` (stays relative), the alt `{{feature_image_alt}}`; card thumbnails follow the dataset's fixed
  pattern `/images/<slug>-thumb.webp`.
- **Filter island and theme toggle**: the page loads `shared/public/app.js` like the reference (Ghost has no client framework).
- **Cache mode** (`nginx/fieldnotes/cache-on.conf`): `proxy_cache` with key `$host$request_uri` (query string included),
  `proxy_cache_valid 200 301 302 404 10m`, `proxy_ignore_headers Cache-Control Expires` (Ghost sends
  `Cache-Control: public, max-age=0` for pages), bypass and no-store when a `ghost-admin-api-session` or `ghost-members-ssr`
  cookie is present, `/ghost*` and `/members/` never cached, responses with `Set-Cookie` not stored (nginx default),
  `proxy_cache_lock`, `proxy_cache_use_stale error timeout updating http_5xx`, `proxy_cache_background_update`, and an
  `X-Cache-Status` header. `WFB_CACHE` picks the include through the nginx image's envsubst template step
  (`NGINX_ENVSUBST_FILTER=^WFB_`). nginx resolves `ghost` through Docker DNS (`server ghost:2368 resolve`) with upstream
  keepalive, so a restarted Ghost container is picked up.

## Deviations from the contract
- **No server-side filtering.** A Ghost theme cannot read query parameters (no helper exposes `req.query`), so `/blog?q=&tag=`
  renders the full list and app.js filters on load, like a static target. Conformance therefore runs without `--server`
  (`bench/targets.mjs` already has `server: false` for both Ghost targets). Tag-only filtering could be done server-side by
  mapping `/blog?tag=x` to a Ghost tag archive in nginx, but `q` cannot, so it was not done.
- **Post body markup**: Ghost converts the imported HTML to Lexical and renders that, so `.post-body` has no newlines between
  blocks, `<h2>` gains an `id`, and `<blockquote><p>…</p></blockquote>` becomes `<blockquote>…</blockquote>`. Text and code
  blocks are identical (the checker compares text). Keeping the HTML byte-exact would need every post wrapped in an HTML card,
  which is not how Ghost content is authored.
- Handlebars escapes `'` as `&#x27;` in text and attributes (same characters once parsed).
- `/blog/`, `/blog/<slug>/` and `/about/` also answer 200 (Ghost's own URLs, reachable through nginx unchanged).
- Unknown paths with a file extension (`/images/nope.webp`) get Ghost's plain-text 404, not the 404 page.
- GScan reports 15 non-fatal errors, all `GS050-CSS-KG*` (Koenig card CSS classes such as `.kg-width-wide`). The posts use
  no cards that need them, and the contract forbids CSS beyond `style.css`.

## Native capabilities used or available
- Analytics: Ghost 6 has cookie-free web analytics in Admin, built on Tinybird; self-hosted it needs the Docker (preview)
  install and a Tinybird account, and it is injected by `{{ghost_head}}`, which this theme omits. Member and newsletter
  analytics are built in. Conventional alternative: Plausible/Umami via code injection. None enabled here.
- Monitoring and observability: Ghost logs every request (stdout and `content/logs/`, the image's production default, kept).
  No documented health endpoint: the compose healthcheck uses the public `GET /ghost/api/admin/site/`. `@sentry/node` and
  `@tryghost/prometheus-metrics` ship as dependencies, but enabling them is not documented. nginx adds `X-Cache-Status` in
  cache mode; `/healthz` is answered by nginx.
- SEO: Ghost has a built-in sitemap index (`/sitemap.xml`), RSS (`/blog/rss/` here) and meta/structured data through
  `{{ghost_head}}`. The built-in sitemap lists trailing-slash URLs and no `/blog`, so `/sitemap.xml` is served from a custom
  `sitemap.hbs` route instead; RSS is a custom `rss.hbs` route (Ghost's documented pattern); meta tags are hand-written in
  `partials/meta.hbs`.

## Effort log
- Started 2026-11-13 13:58:21 UTC, finished 2026-11-13 16:21:31 UTC (about 2 h 25 min, most of it waiting on builds and
  Ghost's first boot on the shared, heavily loaded host).
- 8 build-check-fix iterations: BuildKit frontend crash, MySQL start period, Ghost start period, seed JSON parsing of the
  session response, inline dynamic partials rejected by GScan, nginx zone name clash, `/rss.xml/` route 404, partial
  whitespace. Final runs (fresh `down -v` + `up`): `WFB_CACHE=off` and `WFB_CACHE=on` both
  `1214/1214 checks passed against http://localhost:18200`. A fresh stack seeded itself in 890 s; `down` + `up` without
  `-v` and a mode switch reran the seed with `0 tags and 0 posts created, 40 posts total`.
- Friction:
  - The host was heavily loaded: a fresh Ghost boot (about 150 `CREATE TABLE`s on MySQL) took 32 minutes, a restart up to
    8 minutes, so healthcheck start periods had to go to an hour. A `# syntax=docker/dockerfile:1` line failed the build
    (frontend gRPC server closed under load); the built-in frontend is used.
  - Ghost 301s every URL without a trailing slash; the contract forbids it, so nginx rewrites internally.
  - A route cannot be called `/rss.xml/`: Ghost treats any path with an extension as a theme static file and 404s it before
    routing. Hence `/rss/` and `/fieldnotes-sitemap/` behind nginx.
  - Ghost's url is https, so without `X-Forwarded-Proto: https` every request 301s to `https://<host>`.
  - Ghost has no custom post fields and no string helpers (no lower-case), so contract data that Ghost does not compute the
    same way lives in generated theme partials. GScan rejects inline dynamic partials; the block form works.
  - The fixture page "About this site" already owns the slug `about`; the seed replaces it.
  - Staff device verification (on by default in the image) would block the seed's sign-in without mail; turned off.
  - Tinfoil mode does not cover the Explore ping (`explore.update_url` emptied, setting off) or ActivityPub (setting off).
    The internal network blocks them anyway.
  - The admin session endpoint answers `201 Created` as plain text, not JSON.
  - nginx refuses an upstream zone and a cache keys_zone with the same name.
- Hand-written source lines: about 640 (theme 190, seed 150, nginx 100, compose/Dockerfile/entrypoint/routes 180,
  generator 40), excluding NOTES.md and the 121 generated data partials.
