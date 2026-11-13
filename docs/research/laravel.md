# Laravel: qualitative research

Research date: 2026-11-13. Every number is "as of 2026-11" unless dated otherwise. "Not found" means no primary source found.
Facts marked "(not re-read)" come from my prior knowledge of the Laravel docs and were not re-fetched in this pass.

## 1. Snapshot

| Item | Finding |
|---|---|
| Current stable | Laravel 13.x, latest tag v13.42.0 (2026-11-10); 12.x at v12.72.0 same day ([releases](https://github.com/laravel/framework/releases)) |
| Last three majors | 11 on 2024-03-12, 12 on 2025-02-24, 13 on 2026-03-17 ([support policy](https://laravel.com/docs/13.x/releases)) |
| PHP | 13.x needs PHP 8.3 to 8.5 ([releases](https://laravel.com/docs/13.x/releases)) |
| License | MIT; `laravel/framework` 35.0k stars, skeleton `laravel/laravel` 85.4k (2026-11-13) |
| Governance | Laravel LLC, founded by Taylor Otwell (CEO). Framework is MIT and developed in the open, but the company decides direction |
| Funding | $57M Series A led by Accel, announced 2024-09-05, mainly for Laravel Cloud ([Laravel blog](https://laravel.com/blog/accel-invests-57m-into-laravel), [Fortune](https://www.fortune.com/2024/09/05/laravel-raises-57-million-series-a-from-accel)). Revenue products: Forge, Vapor, Nova, Cloud, Nightwatch |
| Usage | Packagist: 24.65M monthly and 620.9M total installs of `laravel/framework` ([Packagist](https://packagist.org/packages/laravel/framework)); 8.9% of Stack Overflow 2025 respondents; PHP at 68.7% of sites with a known server language ([SO 2025](https://survey.stackoverflow.co/2025/technology), [W3Techs](https://w3techs.com/technologies/details/pl-php)) |

Laravel is a full-stack application framework. A blog here is a small app: routes, Blade views, an Eloquent or file-backed model.

## 2. Maintainability

**Cadence.** One major a year (about Q1), with minors and patches as often as weekly; minors and patches "should never contain breaking changes" ([policy](https://laravel.com/docs/13.x/releases)). Named arguments are excluded from the compatibility promise.

**Support windows.** Bug fixes for 18 months, security fixes for 2 years ([policy](https://laravel.com/docs/13.x/releases)):

| Version | PHP | Released | Bug fixes until | Security until |
|---|---|---|---|---|
| 11 | 8.2-8.4 | 2024-03-12 | 2025-09-03 | 2026-03-12 (ended) |
| 12 | 8.2-8.5 | 2025-02-24 | 2026-08-13 (ended) | 2027-02-24 |
| 13 | 8.3-8.5 | 2026-03-17 | Q3 2027 | 2028-03-17 |

Underlying PHP: 8.2 security-only until 2026-12-31, 8.3 until 2027-12-31, 8.4 until 2028-12-31, 8.5 until 2029-12-31; each branch gets 2 years of active and 2 of security support ([php.net](https://www.php.net/supported-versions.php)). A Laravel 13 app therefore has a hard ceiling set by Laravel (March 2028), not PHP.

**Last three majors and what broke.**

| Major | Notes |
|---|---|
| 13 (2026-03) | Minimal breaking changes; 10-minute estimate; bumps `laravel/boost` ^2, `tinker` ^3, PHPUnit 12, Pest 4. High impact: CSRF middleware renamed `PreventRequestForgery` with `Sec-Fetch-Site` origin checks. Medium: cache `serializable_classes` default false, MySQL `upsert` validation. Low: cache/session key prefixes change from `_` to `-` ([upgrade guide](https://laravel.com/docs/13.x/upgrade)) |
| 12 (2025-02) | Not researched in detail; PHP 8.2 minimum (table above) |
| 11 (2024-03) | Not researched in detail; PHP 8.2 minimum (table above). Slimmed application skeleton (general knowledge, not re-read) |

Migration tooling: the guide points to Shift (community, paid, automated) and to Laravel Boost, a first-party MCP server with a `/upgrade-laravel-v13` command for AI assistants ([upgrade guide](https://laravel.com/docs/13.x/upgrade)).

**Dependency footprint.** A fresh Laravel app pulls in dozens of Composer packages (Symfony components, Carbon, Monolog and so on). I did not count them in this pass; `composer show` on the benchmark app will give the number. Laravel 13 adds `symfony/polyfill-php85`, which defines `array_first()` and `array_last()` on PHP below 8.5 and can clash with old helper packages ([upgrade guide](https://laravel.com/docs/13.x/upgrade)). Annual majors plus a first-party package set (Livewire is separate) mean keeping up is routine work, not a rewrite.

## 3. Analytics

Not from the box. Laravel has no visitor-analytics feature. Pulse's "Application Usage" card shows top users by requests and jobs for the app owner, not site traffic ([Pulse docs](https://laravel.com/docs/13.x/pulse)). Conventional approach: a third-party script (Plausible, Umami, Cloudflare Web Analytics, GA4) or server-log analysis; community packages exist for server-side tracking (not evaluated).

## 4. Monitoring and observability

| Tool | Facts |
|---|---|
| Laravel Pulse | First-party, free, MIT; v1.10.0 (2026-11-10). Needs MySQL, MariaDB or PostgreSQL storage; dashboard at `/pulse`, local-only unless the `viewPulse` gate is defined; cards for slow requests, jobs, queries, outgoing requests, cache, exceptions, queues, servers (needs the `pulse:check` daemon); Redis ingest and sampling for high traffic; built on Livewire ([docs](https://laravel.com/docs/13.x/pulse)) |
| Laravel Telescope | First-party debug assistant, v5.28.0 (2026-11-10), 5.2k stars ([repo](https://github.com/laravel/telescope)). Per-request detail for local debugging; Laravel says it keeps supporting both free tools ([Nightwatch FAQ](https://laravel.com/nightwatch/pricing)) |
| Laravel Nightwatch | Hosted, first-party, Laravel-only, no self-hosting. Free 300k events/mo with 14-day lookback; Pro $20 (7.5M events, 30 days); Team $60 (30M, 60 days); Business $300 (180M, 90 days) ([pricing](https://laravel.com/nightwatch/pricing)). Free projects pause after 30 days of inactivity |
| Sentry | Official `getsentry/sentry-laravel` (1.35k stars, active 2026-11-13) ([repo](https://github.com/getsentry/sentry-laravel)) |
| OpenTelemetry | `open-telemetry/opentelemetry-php` exists (922 stars); maturity for Laravel: not evaluated ([repo](https://github.com/open-telemetry/opentelemetry-php)) |
| Health check | A built-in `/up` health route in the Laravel 11+ skeleton (not re-read). Benchmark contract needs `/healthz` anyway |
| Logs | Monolog channels, configured in `config/logging.php` (not re-read) |

## 5. Robustness and security

**Laravel framework advisories (last two years).** 14 advisories total in the repo, of which these fall after 2024-11-01 ([advisories](https://github.com/laravel/framework/security/advisories)):

| Date | Severity | ID | Summary |
|---|---|---|---|
| 2026-11-11 | Medium | GHSA-6rv8-qj5v-p8ch, GHSA-v5ch-g375-82r6 | Temporary signed URL expiration bypass (two advisories) |
| 2026-11-04 | Low | GHSA-63hm-g96r-2m2q | Task output injection in Concurrency |
| 2026-10-19 | Critical | CVE-2026-114509 | Token-based API guard authentication bypass; fixed in 13.29.0 and 12.68.0 |
| 2026-10-19 | Medium | CVE-2026-114508 | Unauthorized data destruction |
| 2026-09-10 | Low | CVE-2026-102279 | XSS in debug page information |
| 2026-06-08 | Medium | CVE-2026-48041 | Temporary signed URL path confusion |
| 2026-06-01 | High (CVSS 8.9) | CVE-2026-48019 | CRLF injection in default email rule; fixed 13.10.0 and 12.60.0 |
| 2025-03-05 | Medium | CVE-2025-27515 | File validation bypass |
| 2024-11-12 | High | CVE-2024-52301 | Environment manipulation via query string |

CVSS scores for most of these were not returned by the API. Ecosystem: Livewire, used by Pulse and by many Laravel apps, had CVE-2025-54068 (critical, remote command execution during property hydration, 2025-07-17), CVE-2024-47823 (high, RCE on file uploads, 2024-10-08) and CVE-2026-81887 (medium DOM XSS, 2026-08-10) ([Livewire advisories](https://github.com/livewire/livewire/security/advisories)). A blog that does not use Livewire is not exposed to these.

**PHP runtime advisories.** php-src lists 49 published advisories since 2024-11-01: 2 critical, 8 high, 31 medium, 8 low. The critical pair, both 2026-10-21, are RCE bugs: CVE-2026-109618 (OOM corruption) and CVE-2026-109619 (stale global state). Other high items include SOAP use-after-free RCE CVE-2026-6722, pgsql SQL injection CVE-2026-17543 and a TLS setup DoS CVE-2026-12184 ([php-src advisories](https://github.com/php/php-src/security/advisories), counted with `gh api`). Many sit in SOAP, phar, streams and OpenSSL extensions that a blog does not load; patching PHP is still part of operations.

**Defaults.** Blade `{{ }}` escapes output; CSRF protection middleware on web routes, hardened in 13 (`PreventRequestForgery`, [upgrade guide](https://laravel.com/docs/13.x/upgrade)); prepared statements through Eloquent and the query builder; `APP_KEY` encrypts cookies, and 13 defaults session serialization to JSON and cache `serializable_classes` to false to limit deserialization gadget chains if the key leaks ([upgrade guide](https://laravel.com/docs/13.x/upgrade)). No CSP by default (not re-read; third-party packages exist).

**Attack surface vs static.** PHP-FPM executing application code, secrets in `.env` (a leaked `APP_KEY` is a serious event), a database, `/pulse` and `/telescope` if installed, queue workers, Composer supply chain. No admin panel by default, which is better than WordPress or Ghost; a static site has none of these.

## 6. Development effort

- **Learning curve**: moderate. Conventions are strong (routing, Eloquent, Blade, migrations, queues); a developer who knows PHP is productive quickly. For a read-only blog it is heavy machinery.
- **Docs**: broad and well kept; each major has versioned docs; Laracasts and Laravel News are large secondary sources.
- **Community/hiring**: 8.9% of SO 2025 respondents; PHP 18.9% ([SO 2025](https://survey.stackoverflow.co/2025/technology)); large Packagist base (above). A bigger pool than Go or htmx; smaller than the WordPress pool.
- **Editing for non-developers**: none out of the box. Content needs a custom admin or a package/CMS on top (Nova is paid, Filament is community; neither evaluated). Markdown files in the repo are the lowest-cost option, matching the benchmark's dataset.

## 7. Hosting and operations

- **Must run**: nginx (or Apache) + PHP-FPM; a database (SQLite/MySQL/MariaDB/PostgreSQL); optionally Redis or Valkey, a queue worker and the scheduler cron. OPcache and `artisan optimize` are standard.
- **Backups**: database and uploaded files; code is in git. `.env` must be backed up separately.
- **Upgrades**: Composer update inside a major; a yearly major with a short upgrade guide (13: "10 minutes" estimate).
- **Managed options** (2026-11-13):

| Option | Price |
|---|---|
| Laravel Cloud | Starter $5/mo + usage ($5 usage credit included, scale to zero, custom domains); Growth $20/mo; Business $200/mo. A "small blog" example is about $5.70/mo of usage ([pricing](https://laravel.com/cloud/docs/pricing.md)). Redis by Upstash is deprecated on Cloud and sunsets 2027-08-31 |
| Laravel Forge | Hobby $12/mo, Growth $19/mo, Business $39/mo, flat; you also pay a cloud provider ([pricing](https://laravel.com/forge/pricing)) |
| Self-managed VPS | From EUR 5.49/mo excl. VAT at Hetzner ([Hetzner](https://www.hetzner.com/cloud/)) plus admin time |

- **Cloudflare Pages**: not compatible; Pages serves static files and Workers, not PHP ([limits](https://developers.cloudflare.com/pages/platform/limits/)). Laravel Cloud's own edge cache serves static pages while compute sleeps (see its small-blog example).

## 8. Other

- **i18n**: built in (language files, `__()`, locale switching), not re-read; no URL-prefix routing for locales in core.
- **SEO**: no sitemap or RSS in core. Spatie's `laravel-sitemap` (2.6k stars) and `laravel-feed` (985 stars) are the usual packages ([sitemap](https://github.com/spatie/laravel-sitemap), [feed](https://github.com/spatie/laravel-feed)). Meta tags are hand-written in Blade.
- **Images**: no processing in core; Intervention Image or Spatie Media Library are the usual packages (not evaluated). The benchmark uses pre-optimized WebP, so this is moot.
- **Content model**: whatever you build; Eloquent models and migrations. 13 adds first-party JSON:API resources, vector search with pgvector, and an AI SDK ([release notes](https://laravel.com/docs/13.x/releases)), none of which a blog needs.
- **Accessibility**: nothing built in; entirely template-driven.

## Not found / unverified

- Laravel 12 and 11 breaking-change lists (only support dates retrieved).
- Dependency count of a fresh app; memory per request.
- Docs for health route, logging, localization, Blade escaping and CSRF were not re-read this pass.
- CVSS scores for most Laravel advisories (GitHub API returned blanks).
- Maturity of OpenTelemetry PHP for Laravel.
