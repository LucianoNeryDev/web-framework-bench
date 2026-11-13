# Laravel target

Laravel with Blade, server mode only, on the conventional nginx + PHP-FPM stack. A stretch variant runs the same
app on Laravel Octane with FrankenPHP in a single container.

## Versions
- Laravel framework 13.42.0 (current stable, 13.x; skeleton v13.11.0), Blade, Eloquent, SQLite.
- PHP 8.4.27 (`php:8.4-fpm-alpine`), PHP-FPM, OPcache. nginx 1.30 (1.29.8 when implemented) (`nginx:1.30-alpine`).
- Composer 2.11.2 (`composer:2.11.2` build stage), `platform.php = 8.4.0` in `composer.json`.
- Production dependencies: 74 packages from `composer.lock`. No dev dependencies.
- Octane variant: laravel/octane v2.24.0 (`composer.octane.json` + `composer.octane.lock`, same package versions plus
  Octane and two bridge packages), FrankenPHP 1.13.5 / Caddy 2.11.9 on PHP 8.4.27 ZTS (`dunglas/frankenphp:1.13.5-php8.4-alpine`),
  `ext-pcntl` added with `install-php-extensions`.

## Modes
Server only. Image names: `wfb/laravel:server` (PHP-FPM app), `wfb/laravel-nginx:server` (nginx), `wfb/laravel:octane`.

```bash
# conventional stack: nginx -> php-fpm (app:9000)
WFB_PORT=18180 docker compose -p wfb-laravel -f apps/laravel/compose.yaml up -d --build --wait
node bench/conformance.mjs http://localhost:18180 --server

# stretch: Octane + FrankenPHP, one container on 8080
docker build -f apps/laravel/Dockerfile --target server-octane -t wfb/laravel:octane .
docker run -d -p 18181:8080 wfb/laravel:octane
node bench/conformance.mjs http://localhost:18181 --server
```

Dockerfile stages: `vendor` (composer), `server` (PHP-FPM app), `nginx`, `vendor-octane`, `server-octane`.
`Dockerfile.dockerignore` keeps the repository-root context down to this app, `content/posts.json` and `shared/public/`.

Build-time work in the app image: `composer install --no-dev --classmap-authoritative`, `php artisan migrate --seed --force`,
then `php artisan optimize` (config, events, routes and views caches). Nothing runs at start-up except PHP-FPM.

Runtime settings:
- php.ini is `php.ini-production`, plus `docker/php.ini`: `opcache.enable=1`, `opcache.validate_timestamps=0`,
  `opcache.memory_consumption=128` (default), `opcache.interned_strings_buffer=16`, `opcache.max_accelerated_files=20000`.
- PHP-FPM keeps the official image defaults: `pm = dynamic`, `pm.max_children = 5`, `pm.start_servers = 2`,
  `pm.min_spare_servers = 1`, `pm.max_spare_servers = 3`. The only addition (`docker/php-fpm.conf`) is `ping.path = /ping` for the
  health check. The official image also writes an access log line per request to stderr.
- `APP_ENV=production`, `APP_DEBUG=false`, `LOG_CHANNEL=stderr`, `SESSION_DRIVER=array`, `CACHE_STORE=array`, `QUEUE_CONNECTION=sync`
  are set in the image environment (there is no `.env` file in the image). `APP_KEY` is a fixed throwaway key baked into the
  Dockerfile, because nothing is encrypted or signed (no cookies, no sessions).
- Health checks: `app` runs `cgi-fcgi` against FPM `/ping` (package `fcgi`); `nginx` fetches `/healthz` through PHP-FPM, so a healthy
  nginx means the whole chain answers. `nginx` depends on `app` being healthy.
- Octane: `php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=8080 --admin-port=2019`, default worker count (auto, one per CPU)
  and default `--max-requests`. Runs as root in the container; FrankenPHP serves `public/` static files itself. Same php.ini and opcache settings.

## Implementation decisions
- **Data**: Eloquent models `Post` and `Tag` (many-to-many through `post_tag` with a `position` column that preserves each post's tag order),
  plus a self-referencing many-to-many `related` (`post_related`, ordered by `position`) and `older`/`newer` belongs-to relations on
  `prev_slug`/`next_slug`. One migration creates the schema; `DatabaseSeeder` loads `content/posts.json`.
- **Database built into the image**: the SQLite file is created by `migrate --seed` during the image build, so start-up has no seeding step and
  no writable state. This is the idiomatic shape for read-only content and removes a start-up race, but it means a content change needs an
  image rebuild. Queries run on every request: no response cache, no query cache (`CACHE_STORE=array` is per request).
- **Site copy** (title, description, author, hero, about HTML) is `config/site.php`, read from the JSON at build time and baked into the config cache.
- **Routes and views**: `routes/web.php` with controller classes (route cache needs them; `/healthz` is an invokable controller). Blade
  anonymous components: `x-layout`, `x-card`, `x-tag-list`; pages in `resources/views/pages`, XML in `resources/views/feeds`
  (`{!! '<?xml ...?>' !!}` because the image has `short_open_tag` on), `resources/views/errors/404.blade.php` for the real 404.
  Unknown posts 404 through implicit route model binding (`{post:slug}`).
- **Filtering**: `/blog?q=&tag=` renders all 40 cards and marks non-matching ones `hidden` (same approach as the Go target), so `app.js`
  keeps correct counts and chips when it loads. The match itself is a SQL query (`whereHas` on tags, `instr(lower(title || ' ' || summary), ?)`
  on the lower-cased, trimmed query), the result count, pressed chip, input value and empty state are server-rendered.
- **List queries** select only the card columns (`Post::summary()` scope), skipping the HTML body; tags are eager loaded.
- **Interactivity**: `shared/public/app.js` loaded with `defer`, exactly like the reference. The starter's Vite, Tailwind and npm setup was
  removed (`package.json`, `vite.config.js`, `resources/css`, `resources/js`); nothing needs a JS build.
- **Static files**: `shared/public/` is copied into `public/` in the app image and into nginx's root in the nginx image; nginx serves
  `/style.css`, `/app.js`, `/favicon.svg` and `/images/*` itself. The nginx block is the standard Laravel one (`try_files`, fastcgi to `app:9000`,
  dotfiles denied) with `SCRIPT_FILENAME $realpath_root$fastcgi_script_name`.
- **Stripped**: cookie encryption, queued cookies, session, shared-errors and CSRF (`PreventRequestForgery`) middleware are removed from the
  `web` group with `$middleware->web(remove: [...])` in `bootstrap/app.php`. A content site with no writes needs none of them, and with them
  every GET would set a session cookie. Also removed: the users/cache/jobs migrations, `User` model and factory, `laravel/tinker`, all
  dev dependencies, tests, the console routes file, favicon and robots.txt. The built-in `/up` health route is kept.

## Deviations from the contract
- None in the markup: `node bench/conformance.mjs ... --server` passes every check.
- Behaviour differences worth knowing: the 404 page is rendered by Laravel for every unknown path (nginx never answers 404 itself, because
  `try_files` falls back to `index.php`); a missing static file such as `/images/x.webp` therefore returns the HTML 404 page with status 404.
- The nginx `try_files` omits the usual `$uri/` branch: nginx's public dir has no `index.php`, so `/` hit the directory and returned 403.
  Without `$uri/` there are also no directory redirects (`/images` does not 301).
- Cards contain a `hidden` attribute on non-matching posts in the filtered `/blog` page (needed by `app.js`), so those pages carry all 40 cards.

## Native capabilities used or available
- Analytics: none in the box. Pulse's "Application Usage" is application metrics, not visitor analytics; the usual answer is a third-party script
  or log analysis. Nothing added here.
- Monitoring and observability: built-in `/up` health route (kept), `/healthz` hand-written as required; Monolog channels (stderr here);
  first-party Pulse (needs MySQL/MariaDB/PostgreSQL), Telescope, Nightwatch (hosted) and Sentry's official package exist. None installed.
  PHP-FPM `ping.path` is used for the container check (a `pm.status_path` page is available too).
- SEO: no sitemap or RSS in core (Spatie packages are the common choice); both are hand-written Blade XML views here. Meta tags are hand-written in the layout.

## Effort log
- Started 2026-11-13 13:57:41 UTC; finished 2026-11-13 16:07:33 UTC. About two thirds of that was waiting: the host was at 70-75% I/O pressure and a
  single `chmod -R` image layer took 33 minutes before I narrowed it.
- Build-check-fix iterations until the FPM stack passed conformance: 2 (first build: Blade parse error and nginx 403 on `/`; hot-patched in the
  running containers to confirm, then rebuilt clean). Octane variant: 2 more builds (missing `ext-pcntl`), then pass.
- Friction:
  - Blade directives only match after a non-word character, so `data-empty@if (...)` and `hidden@endif` are not compiled and leak into the page
    as text; use `{!! ... !!}` or spaces around inline directives.
  - OPcache with `validate_timestamps=0` kept serving a stale compiled view after `view:clear`; FPM needed a restart. Expected, but it
    makes hot-patching a running container misleading.
  - `php artisan optimize:clear` fails when `CACHE_STORE` is `database` and the cache table is missing; the starter `.env.example` assumes
    the database cache, session and queue drivers (and their three migrations), so a read-only app has to override all three.
  - `.env.example` is not read in the image, so every setting that is not a config default has to be an image `ENV`; `config:cache` bakes whatever it saw.
  - Two-container PHP: nginx needs `public/` for static files and `$realpath_root`, so the static files are copied into both images, and the
    stock `try_files $uri $uri/ /index.php` block returns 403 on `/` when `index.php` is not in nginx's copy.
  - `composer` is not on the host and the `composer` image is PHP 8.5, so `config.platform.php = 8.4.0` is needed to lock for 8.4.
  - FrankenPHP's image lacks `ext-pcntl`, which `octane:start` needs for signal handling.
  - The 13.x starter ships agent instruction files (AGENTS.md, CLAUDE.md), Vite, Tailwind and Pest/Pint/Pail/Pao dev dependencies; all removed here.
- Hand-written source lines (PHP, Blade, nginx/php config, Dockerfile, compose; excluding lockfiles and the untouched skeleton `config/*.php`): about 590.
