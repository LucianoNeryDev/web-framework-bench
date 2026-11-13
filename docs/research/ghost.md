# Ghost: qualitative research

Research date: 2026-11-13. Every number is "as of 2026-11" unless dated otherwise. "Not found" means I looked and found no
primary source.

## 1. Snapshot

| Item | Finding |
|---|---|
| Current stable | v6.77.0, released 2026-11-11; `main` is at 6.78.0-rc.0 ([releases](https://github.com/TryGhost/Ghost/releases), [package.json](https://github.com/TryGhost/Ghost/blob/main/ghost/package.json)) |
| Last three majors | 4.0.0 2021-03-15, 5.0.0 2022-05-23, 6.0.0 2025-08-04 (GitHub release dates, `gh api repos/TryGhost/Ghost/releases`) |
| License | MIT; package author "Ghost Foundation" ([package.json](https://github.com/TryGhost/Ghost/blob/main/ghost/package.json)); 55.8k GitHub stars (2026-11-13) |
| Governance | Non-profit Ghost Foundation; the page says it "can never be bought or sold", founded April 2013 by John O'Nolan and Hannah Wolfe ([ghost.org/about](https://ghost.org/about/)) |
| Funding | Revenue from the paid hosted service Ghost(Pro): the about page shows ARR of about $11.14M, 30,316 customers, 2.9% net churn, 42 team members; no investors or grants mentioned ([ghost.org/about](https://ghost.org/about/), self-reported live metrics) |
| Market share | 0.1% of all websites, 0.1% of CMS-using sites ([W3Techs, 2026-11-13](https://w3techs.com/technologies/overview/content_management)). npm `ghost` package: 96,833 downloads in the last month (2026-10-14 to 11-12, [npm API](https://api.npmjs.org/downloads/point/last-month/ghost)) |

Ghost is a publishing platform (posts, pages, members, paid subscriptions, newsletters), not a general CMS.

## 2. Maintainability

**Cadence.** Weekly-ish minors inside a major: 6.72 (2026-10-20), 6.73 (10-27), 6.74 (11-03), 6.75 (11-04), 6.76 (11-10), 6.77 (11-11) ([releases](https://github.com/TryGhost/Ghost/releases)). That is 77 minors since 6.0.0 in 15 months. Majors are rare (about every 1.5 to 3.5 years) and mostly remove old things.

**Support policy.** The security page does not say which versions get security fixes; it says security takes precedence and that releases can be marked "urgent" ([docs.ghost.org/security](https://docs.ghost.org/security/)). Every advisory I checked lists "fixed in" a single newer 6.x minor, so in practice you must run a current release. Not found: an LTS branch.

**Stack requirements (self-hosted).** Ubuntu 22.04/24.04/26.04 LTS, Node.js 22 or 24, MySQL 8.0 or 8.4, nginx and systemd, at least 1 GB RAM, Ghost-CLI ([hosting docs](https://docs.ghost.org/hosting)). `ghost/package.json` pins `node ^22.23.5 || ^24.22.3`. MariaDB is not officially supported; SQLite is development only ([changes page](https://docs.ghost.org/changes)).

| Major | Date | What broke |
|---|---|---|
| 4.0 | 2021-03-15 | Not researched; date only |
| 5.0 | 2022-05-23 | Mobiledoc removed (Lexical), MySQL 8 the only production DB, API versioning removed, tiers replace products, `@blog` and single-author theme helpers removed; migration: Lexical, GScan theme check, Portal script tag update ([changes](https://docs.ghost.org/changes)); community reports of failed 4.48 to 5.0 upgrades and a bumpy MariaDB-to-MySQL move ([forum](https://forum.ghost.org/t/unable-to-update-ghost-from-4-48-to-5-0-1-or-5-0-0/30346)) |
| 6.0 | 2025-08-04 | Node 22 only, `limit=all` capped at 100, AMP removed, `created_by`/`updated_by` columns dropped, session endpoint removed, theme root files without extension no longer served ([changes](https://docs.ghost.org/changes)). One upgrade failed under MySQL `ANSI_QUOTES` ([forum guide](https://forum.ghost.org/t/guide-community-overview-of-ghost-v6-0-for-self-hosted-installations/59236)) |

Migration tooling: Ghost-CLI (`ghost update`), `knex-migrator` for DB migrations, GScan for theme validation, JSON import/export. Docker Compose is a "preview" and the forum says it becomes the official method with Ghost 7 ([docker docs](https://docs.ghost.org/install/docker), [forum guide](https://forum.ghost.org/t/guide-community-overview-of-ghost-v6-0-for-self-hosted-installations/59236)); Ghost-CLI itself is not being updated much, per the hosting docs. A Ghost 7 date: not found.

**Dependency footprint.** `ghost/package.json` lists 158 direct runtime dependencies on `main` (counted from the file, 2026-11-13), including express, knex, mysql2, handlebars, nodemailer, stripe and `@sentry/node`. Ecosystem cost is small compared with WordPress: themes (Handlebars) and integrations (webhooks, Zapier), no in-process plugin system.

## 3. Analytics

Ghost is the only CMS here with first-party analytics, but "from the box" depends on how you host:

- Ghost 6 adds cookie-free web analytics in Ghost Admin, built on Tinybird. On Ghost(Pro) it is on by default; self-hosters need Ghost 6+, the Docker (preview) install, and a Tinybird account ([Ghost integration page](https://ghost.org/integrations/tinybird/), [forum thread](https://forum.ghost.org/t/we-pay-for-tinybird-to-get-analytics-in-self-hosted-ghost-6-0/59205)). The Ghost-CLI install does not offer it ([docker docs](https://docs.ghost.org/install/docker)). Whether self-hosters pay Tinybird: sources disagree (Tinybird says free via a self-managed image; a forum user reports hitting limits). A user found it less complete than Plausible or Umami ([forum](https://forum.ghost.org/t/guide-community-overview-of-ghost-v6-0-for-self-hosted-installations/59236)).
- Member and email analytics (opens, clicks, automation funnels) are built in; recent changelog items add automation analytics ([changelog](https://ghost.org/changelog/)).
- Ghost(Pro) native advanced analytics: not on Starter, on Publisher ($29/mo) and up ([pricing](https://ghost.org/pricing/)).
- Conventional alternative: Plausible, Umami, or Cloudflare Web Analytics via code injection.

## 4. Monitoring and observability

- **Logs**: configurable `level`, `transports` (stdout and file in production), daily rotation keeping 10 files, `content/logs/` ([config docs](https://docs.ghost.org/config)).
- **Admin**: staff-facing audit-style views only; no health or performance dashboard found.
- **Sentry**: `@sentry/node` 7.120.4 is a runtime dependency ([package.json](https://github.com/TryGhost/Ghost/blob/main/ghost/package.json)). The config docs page does not describe a Sentry option, so the supported way to enable it is not documented in what I read.
- **Metrics**: `@tryghost/prometheus-metrics` 5.0.8 is a dependency ([package.json](https://github.com/TryGhost/Ghost/blob/main/ghost/package.json)); documentation for enabling it: not found.
- **Health check**: no documented `/health` endpoint found; use a page request.
- **Tracing/OpenTelemetry**: not found.

## 5. Robustness and security

GitHub lists 80 published security advisories for the repo; 71 of them are dated after 2024-11-01 and 70 in 2026 (3 critical, 23 high, 41 medium, 3 low), with a sharp rise from June 2026: 8 in June, 9 July, 18 August, 20 September, 6 October ([advisories](https://github.com/TryGhost/Ghost/security/advisories), counted with `gh api`, 2026-11-13). The cause of the surge is not stated; I found no explanation.

| ID | Date | Severity | Summary |
|---|---|---|---|
| CVE-2026-26980 | 2026-02 | Critical, CVSS 9.4 | Unauthenticated SQL injection in the Content API, reads arbitrary DB data incl. API keys; v3.24.0 to 6.19.0, fixed 6.19.1 ([GHSA-w52v-v783-gw97](https://github.com/TryGhost/Ghost/security/advisories/GHSA-w52v-v783-gw97)) |
| CVE-2026-53943 | 2026-05-28 | Critical (CVSS 9.6) | Cache-poisoning XSS via `x-ghost-preview` header; 4.0.0 to 6.36.0, fixed 6.37.0 ([GHSA-62q6-4hv4-vjrw](https://github.com/TryGhost/Ghost/security/advisories/GHSA-62q6-4hv4-vjrw)) |
| GHSA-q734-xjgc-vpj9 | 2026-09-03 | Critical, CVSS 9.8 | Suspended staff could reactivate accounts via password reset; fixed 6.62.0 ([advisory](https://github.com/TryGhost/Ghost/security/advisories/GHSA-q734-xjgc-vpj9)) |
| CVE-2026-105677 | 2026-09-17 | High, CVSS 7.2 | Remote code execution via theme translation files; fixed 6.64.0 ([GHSA-jj74-hc2q-xrvm](https://github.com/TryGhost/Ghost/security/advisories/GHSA-jj74-hc2q-xrvm)) |
| CVE-2026-105642 | 2026-10-01 | High | Remote code execution via bookmark card images ([GHSA-788w-68h3-cvxp](https://github.com/TryGhost/Ghost/security/advisories/GHSA-788w-68h3-cvxp)) |

The rest are mostly stored XSS (SVG, embeds, oEmbed, bookmark cards), staff and API authorization flaws, token disclosure, SSRF and ReDoS in import paths. Most require a logged-in staff user or a content import; the SQL injection and the staff-enumeration advisory (GHSA-ffmj-3ppp-cj4r) are unauthenticated.

Defaults: Handlebars escapes `{{ }}` output by default (`{{{ }}}` is raw); admin sessions with optional email 2FA (a bypass was fixed, GHSA-q55r-w7fh-rmh6); CSP: not found as a default for the public site.

Attack surface vs static: a Node process, an Admin UI at `/ghost`, Admin and Content APIs, a MySQL database, file/media uploads, Stripe webhooks, outbound fetches (bookmark/oEmbed, a recurring SSRF source), and a theme upload path that has had an RCE. Public pages can be cached, so the read path can sit behind a CDN, but the admin cannot be removed.

## 6. Development effort

- **Learning curve**: low for content; themes are Handlebars with a small helper set. Custom behavior is via themes, code injection, webhooks and the Content/Admin APIs. Headless use is supported; the Content API is read-only, cacheable JSON ([docs](https://docs.ghost.org/content-api/)).
- **Docs**: good and compact, with some stale or moved pages (several docs URLs returned 404 during this research).
- **Community**: 55.8k stars; 0.1% of sites (W3Techs); hiring pool is small and mostly front-end/Node developers. Stack Overflow 2025 does not list Ghost (not found).
- **Editing experience**: a polished Lexical-based editor with cards, newsletters, memberships and scheduling; very good for a single writer or a small team. Roles: Owner, Admin, Editor, Author, Contributor.

## 7. Hosting and operations

- **Must run**: Node 22/24 process, MySQL 8, nginx (or Caddy in Docker), SMTP for email; optional Tinybird and ActivityPub services under Docker profiles ([docker docs](https://docs.ghost.org/install/docker)). Docker docs use a 2 GB / 1 CPU droplet as the example; hosting docs state 1 GB minimum.
- **Backups**: MySQL dump plus `content/` (images, themes); the Admin can export JSON, which omits images.
- **Upgrades**: frequent, mandatory-in-practice (see section 5); `ghost update` or a new image tag. Ghost-CLI offers a rollback command (general knowledge, not re-verified); DB migrations are the risk.
- **Storage/CDN**: local `content/images` by default; S3-compatible adapters; on-demand image resizing must stay in Ghost unless you add imgproxy ([config docs](https://docs.ghost.org/config)).
- **Managed**: Ghost(Pro) Starter $18/mo (default theme only, no custom themes), Publisher $29/mo, Business $199/mo, billed yearly ([pricing](https://ghost.org/pricing/)). A custom Handlebars theme like the benchmark's needs Publisher or higher on Ghost(Pro). Business member limit is inconsistent on the page (1,000 vs 10,000).
- **Cloudflare Pages**: not compatible (needs Node and MySQL). A headless Ghost plus a static front end is possible but changes the architecture.

## 8. Other

- **i18n**: `{{t}}` helper with `locales/<lang>.json` and a single publication language. Ghost's FAQ says it is not for multi-language content; use a third-party service for that ([FAQ](https://docs.ghost.org/faq/translation)).
- **SEO**: structured data can be toggled with `useStructuredData` ([config docs](https://docs.ghost.org/config)). Ghost core also serves RSS and sitemaps and emits meta tags, but I did not open a primary doc for that in this pass (general knowledge, unverified).
- **Images**: uploads resized to max 2000 px width, JPEG recompressed at 80%, metadata stripped, original kept with `_o` suffix; responsive sizes need the `content/images` path ([config docs](https://docs.ghost.org/config)).
- **Content model**: posts, pages, tags, authors, tiers/members; custom fields for members added 2026-11-10 ([changelog](https://ghost.org/changelog/)); no arbitrary content types.
- **Accessibility**: depends on the theme; Casper/Source defaults. Not evaluated.
- **ActivityPub**: built in; hosted service default, limits of 2,000 followers/following for self-hosters ([forum](https://forum.ghost.org/t/guide-community-overview-of-ghost-v6-0-for-self-hosted-installations/59236)).

## Not found / unverified

- Ghost 4.0 breaking changes; Ghost 7 date.
- Which versions receive security fixes (no stated policy).
- Reason for the 2026 advisory surge.
- Documentation for enabling Sentry and Prometheus metrics.
- Whether self-hosted Tinybird analytics has a free tier that covers a small blog.
