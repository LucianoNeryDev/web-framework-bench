# WordPress target

Started: Fri Nov 13 01:58:03 PM UTC 2026
Finished: Fri Nov 13 03:31:34 PM UTC 2026

## Versions

| Component | Version |
|---|---|
| WordPress | 7.1.4 (official image `wordpress:7.1.4-php8.5-fpm-alpine`, the newest PHP the image ships) |
| PHP | 8.5.12, PHP-FPM, OPcache on with the image's recommended settings (128 MB, `revalidate_freq=2`) |
| MariaDB | 12.3.3 (`mariadb:12.3.3`, the current LTS; `mariadb:lts` points at the same digest) |
| nginx | `nginx:1.29-alpine` |
| WP-CLI | 2.12.0 (phar, SHA-512 checked in the Dockerfile) |

No plugins: the bundled Akismet, Hello Dolly and Twenty Twenty-* themes are removed from the image.

## Modes

One compose file, three services, two images built from `apps/wordpress/Dockerfile` (context: repository root):

| Service | Image | What it is |
|---|---|---|
| `db` | `mariadb:12.3.3` | Database, named volume `db` |
| `wordpress` | `wfb/wordpress:fpm` (target `wordpress`) | PHP-FPM with WordPress, the `fieldnotes` theme, the `fieldnotes-core` mu-plugin, `wp-config.php` and WP-CLI |
| `nginx` | `wfb/wordpress:nginx` (target `nginx`) | nginx on 8080, the same document root plus `shared/public/`, fastcgi to `wordpress:9000` |

```bash
# server (target `wordpress`): every request runs PHP
WFB_PORT=18190 WFB_CACHE=off docker compose -p wfb-wordpress -f apps/wordpress/compose.yaml up -d --build --wait
# cached (target `wordpress-cached`): nginx fastcgi_cache in front of PHP
WFB_PORT=18190 WFB_CACHE=on docker compose -p wfb-wordpress -f apps/wordpress/compose.yaml up -d --build --wait
node bench/conformance.mjs http://localhost:18190 --server
docker compose -p wfb-wordpress -f apps/wordpress/compose.yaml down -v
```

`WFB_CACHE` is read by `/docker-entrypoint.d/05-wfb-cache.sh` in the nginx container, which copies either
`docker/nginx/server.conf` (off) or `docker/nginx/cached.conf` (on) to `conf.d/default.conf`. The cached config:
`fastcgi_cache_valid 200 404 10m`, key `$scheme$request_method$host$request_uri` (query string included),
bypass and no-store for POST, `/wp-admin/`, `wp-login.php`, `xmlrpc.php`, `wp-cron.php`, `/wp-json/` and the
`wordpress_logged_in`, `wordpress_[hash]`, `wp-postpass`, `comment_author` and `wordpress_no_cache` cookies,
`fastcgi_ignore_headers Cache-Control Expires` (so the 404 page is cached too), `fastcgi_cache_lock on`,
stale-on-error, and an `X-Cache` header with `$upstream_cache_status`.

Seeding: the `wordpress` entrypoint (`docker/wfb-entrypoint.sh`) waits for the database, runs `wp core install` when
WordPress is not installed, then `wp eval-file docker/seed.php posts.json`, touches `/tmp/wfb-ready` and execs
php-fpm. The seed upserts every page, tag and post by slug and records a hash of the data and the script in the
option `wfb_seed_hash`, so a restart is a no-op and changed data is re-applied without duplicates.

Healthchecks (all with `start_interval: 2s` during a 300 s start period, then every 60 s): `db` runs the image's
`healthcheck.sh --connect --innodb_initialized`; `wordpress` checks the ready flag and that php-fpm accepts
connections; `nginx` fetches `/about` with a `wordpress_no_cache` cookie (so it never warms the page cache) and
looks for the avatar. `up --wait` therefore returns only when the seeded site renders.

## Implementation decisions

- **Theme**: a classic PHP theme (`wp-content/themes/fieldnotes`): `header.php`, `footer.php`, `front-page.php`,
  `page-blog.php`, `page-about.php`, `single.php`, `404.php`, `parts/card.php` (via `get_template_part`) and an
  `index.php` fallback that renders the 404 page. Templates pass the page metadata to `header.php` with
  `get_header( null, $args )`.
- **Content model**: posts with title, slug, date (`post_date` = `post_date_gmt` = the date at 00:00 UTC),
  `post_content` = the given HTML, `post_excerpt` = the summary, core tags, and post meta `date_label`,
  `reading_minutes`, `cover_src`, `cover_thumb`, `cover_alt`, `cover_width`, `cover_height`, `cover_thumb_width`,
  `cover_thumb_height`, `prev`, `next` and `related` (comma-separated slugs). Covers are plain `/images/...` paths,
  not attachments. Home, Blog and About are pages; Home is the static front page (`show_on_front=page`), the Blog
  page holds the intro paragraph and About holds `aboutHtml`. Author, hero title and hero text are one option,
  `fieldnotes_site`.
- **Tag order**: cards list tags in the dataset's order, not alphabetically. The mu-plugin makes `post_tag` a
  sortable taxonomy (`sort => true`, `orderby => term_order`) so `wp_set_object_terms()` stores the order and
  `get_the_terms()` returns it. The chips list tags by `term_id`, i.e. creation order.
- **Routing**: permalink structure `/blog/%postname%`, so posts are `/blog/<slug>` with no trailing slash. `/blog`
  and `/about` are pages. `redirect_canonical` and `wp_old_slug_redirect` are removed and `user_trailingslashit`
  strips the slash, so nothing redirects. A `template_redirect` guard in the mu-plugin turns every route outside the
  contract (tag/date/author archives, search, attachments, core feeds, `/favicon.ico`, `/home`) into the 404 page
  with a real 404 status. `?tag=` on `/blog` is dropped from the main query in a `request` filter, because `tag` is
  a public WordPress query var.
- **Server-side filtering**: `page-blog.php` runs one `WP_Query` for all posts and, when `q` or `tag` is set, a
  second `WP_Query` (`fields => ids`, `tag => <slug>`, plus a custom arg `fieldnotes_text`) for the matching IDs.
  The text match is a `posts_where` filter: `CONCAT(post_title, ' ', post_excerpt) LIKE '%<q>%'` with
  `$wpdb->esc_like`, i.e. the contract's substring rule on title + " " + summary. Core search (`s`) was not used
  because it also searches the body and splits terms. Case-insensitivity comes from the MariaDB collation (also
  accent-insensitive; the dataset is ASCII). Non-matching cards are rendered with `hidden` and the count reads
  `Showing N of 40 posts`, so `app.js` keeps working against the full list (same approach as the Go target).
- **Interactivity**: `shared/public/app.js` enqueued as `/app.js` (`strategy => defer`, in the head, no version
  query) and `shared/public/style.css` as `/style.css`; both served by nginx from disk. The theme snippet is printed
  inline before `wp_head()`, so it precedes the stylesheet.
- **Post bodies**: printed with `the_content()`, with `wpautop`, `wptexturize`, `convert_smilies` and
  `capital_P_dangit` removed from `the_content`, since the imported HTML is final. Titles, summaries and other
  fields are printed from the post object with `esc_html`/`esc_attr` instead of `the_title()`/`the_excerpt()`, to
  avoid texturizing.
- **Host handling**: `WP_HOME` and `WP_SITEURL` are fixed to `https://bench.example` in `wp-config.php`. That is
  the URL in canonical, `og:*`, the RSS feed and the sitemap. Page links are root-relative (the theme writes them,
  and `script_loader_src`/`style_loader_src` go through `wp_make_link_relative`), and `redirect_canonical` is off,
  so the site answers on `localhost:<port>` and `wfb-run:8080` without redirecting. Side effect: wp-admin and
  wp-login redirect to `https://bench.example` and are unusable from the benchmark host (not part of the contract).
- **RSS**: a custom feed (`add_feed( 'fieldnotes' )`) rewritten from `^rss\.xml$`, rendering the main feed query
  (`posts_per_rss = 40`) in the reference format, `application/rss+xml`. Links come from `get_permalink()`, so
  `https://bench.example/blog/<slug>` with no trailing slash.
- **Sitemap**: the core sitemap (`wp-sitemap`), with `/sitemap.xml` rewritten to the sitemap index. The index lists
  `wp-sitemap-posts-post-1.xml` (40 posts) and `wp-sitemap-posts-page-1.xml` (`/`, `/blog`, `/about`); the users
  and taxonomies providers are removed because those routes are 404 here.
- **Disabled** (mu-plugin and theme): emoji detection script and styles (and the emoji SVG URL), block library CSS
  (`wp-block-library`, `-theme`), classic theme styles, global styles (and its SVG filters), oEmbed discovery links
  and the wp-embed host script, the generator meta and `the_generator`, RSD link, core feed links, REST API link tag
  and `Link` header, shortlink tag and header, `rel_canonical` (the theme prints its own), adjacent-post links, the
  `wp_robots` meta, speculative-loading rules, the img auto-sizes CSS fix, the `X-Pingback` header, and jQuery
  (deregistered on the front end).
- **Run time is self-contained**: `DISABLE_WP_CRON`, `AUTOMATIC_UPDATER_DISABLED`, `WP_HTTP_BLOCK_EXTERNAL` and
  `DISALLOW_FILE_MODS`, so no loopback cron requests, update checks or other outbound HTTP.
- **PHP-FPM** keeps the image's defaults: `pm = dynamic`, `pm.max_children = 5`, access log to stderr.

## Deviations from the contract

The rendered `<body>` of `/`, `/blog`, a post and `/about` is byte-identical to `apps/static-html/site/`. The checker
passes 1259/1259 in both modes. Remaining differences:

- **Head tags from the enqueue API**: WordPress prints `<link rel='stylesheet' id='fieldnotes-css' href='/style.css'
  media='all' />` and `<script data-wp-strategy="defer" defer id="fieldnotes-js" src="/app.js"></script>` (extra
  attributes, single quotes), and `wp_head()` leaves an empty line. Same files, same order, same `defer`.
- **WordPress's own endpoints still answer**: `/wp-json/` (REST API, 200), `/wp-login.php` and `/wp-admin/` (302 to
  `https://bench.example/...`), `/xmlrpc.php`, `/wp-sitemap*.xml` and the static files under `/wp-includes/`. The
  contract says anything else is a 404; every WordPress *content* route outside the contract is a 404 (see the route
  guard), but the admin, login and API endpoints are left in place because a WordPress site without them is not a
  WordPress site. Directory URLs that exist on disk (for example `/images/`) get nginx's 403, from the standard
  WordPress `try_files $uri $uri/ /index.php?$args` rule.
- **Trailing slashes are tolerated**: `/blog/` and `/blog/<slug>/` render the same page with 200 (the core rewrite
  rules accept an optional slash). No route redirects, and no generated link has a trailing slash.
- **Sitemap**: the core sitemap index with two children, rather than one flat `urlset`; `lastmod` on pages is the
  page's modified time (seed time). The contract allows an index.
- **Cached mode caches 404s** for 10 minutes too (`fastcgi_ignore_headers Cache-Control Expires` overrides the
  `nocache_headers()` WordPress sends on 404).

## Native capabilities used or available

- Analytics: nothing in core. Conventional: Jetpack Stats, Site Kit by Google, or a Plausible/Umami/Matomo snippet
  or plugin. None installed.
- Monitoring and observability: Site Health (configuration checks), `WP_DEBUG_LOG`, PHP-FPM and nginx logs,
  Query Monitor for development; APM through PHP agents (New Relic, Datadog) or a community Sentry plugin. Here: the
  three compose healthchecks, nginx `/healthz`, and the `X-Cache` header in cached mode.
- SEO: core provides the XML sitemap (used, through a rewrite) and RSS feeds (a custom feed was written to match the
  reference format and URL). Meta description, canonical and Open Graph are hand-written in `header.php`; the
  usual alternative is an SEO plugin (Yoast, Rank Math).

## Effort log

- Started 2026-11-13 13:58 UTC, finished 15:31 UTC (about 1 h 35 min, much of it waiting on Docker: the host was
  at a load average of 21-26, and one `cp` of the WordPress tree in a build step took 520 s).
- Build-check-fix iterations: 3. The first build that started passed the checker (1259/1259); two more rebuilds fixed
  things the checker does not test (core feed URLs rendered the core RSS feed with a 404 status, `X-Powered-By`), and
  the final run was a fresh `down -v` + `up --build`. Two earlier builds were aborted: one by the BuildKit
  `# syntax=docker/dockerfile:1` frontend crashing under load, one restructured to avoid a slow full-tree `chmod`.
- Verified: fresh volume seeds 40 posts + 3 pages + 10 tags; `docker compose restart wordpress` and a recreate
  without `-v` log "content is up to date" and keep 43 posts/pages and 10 tags; `X-Cache` shows MISS then HIT for
  `/blog?q=cache`, BYPASS for POST and for a `wordpress_logged_in_*` cookie; `Host: wfb-run:8080` gets 200.
- Friction:
  - `tag` is a public WordPress query var, so `/blog?tag=go` turns the Blog page request into a tag query; it has to
    be dropped in a `request` filter.
  - `WP_Scripts`/`WP_Styles` prefix a root-relative `src` with `site_url()`, which would point the assets at
    `https://bench.example`; fixed with `wp_make_link_relative` on `script_loader_src`/`style_loader_src`.
  - Term order: `get_the_terms()` sorts tags by name. Keeping the dataset order needs a sortable taxonomy.
  - `WP_Query::set_404()` deliberately keeps `is_feed`, so a 404'd `/feed` still rendered the core feed (with the
    feed content type that `WP::send_headers()` had already sent). Needed `is_feed = false` and a fresh
    `Content-Type`.
  - `wp_insert_post()` unslashes its input (so the seed passes `wp_slash()`), and kses filters run under WP-CLI
    (no user), so the seed calls `kses_remove_filters()`.
  - `wp core install` creates "Hello world!", "Sample Page" and a draft privacy page, which would leak into lists and
    the sitemap; the seed deletes them.
  - The official image declares `VOLUME /var/www/html`; compose keeps anonymous volumes across recreates, so a
    rebuilt theme would be shadowed by the old copy. The document root is `/var/www/wordpress` instead.
  - Without the mu-plugin (for example if it is unreadable), WordPress immediately 301s every page to
    `https://bench.example`: the no-redirect behaviour depends entirely on removing `redirect_canonical`.
  - Content filters: `wpautop` and `wptexturize` would rewrite the imported HTML; they are removed from `the_content`.
- Hand-written source lines: about 1050 (Dockerfile, compose, nginx configs, entrypoint, seed, wp-config,
  mu-plugin, theme), excluding this file.
