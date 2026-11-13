# WordPress: qualitative research

Research date: 2026-11-13. Every number is "as of 2026-11" unless another date is given. "Not found" means I looked and
did not find a primary source. Several litigation and board details come from secondary press and are flagged.

## 1. Snapshot

| Item | Finding |
|---|---|
| Current stable | 7.1.4, released 2026-10-28; the 7.0 branch is at 7.0.8, same day ([wordpress.org releases](https://wordpress.org/download/releases/)) |
| Last three majors | 6.9 "Gene" 2025-12-02, 7.0 "Armstrong" 2026-05-20, 7.1 "Mary Lou" 2026-08-19 ([release index](https://wordpress.org/news/category/releases/)) |
| Next | 7.2 targeted 2026-12-08 per the [release party schedule](https://make.wordpress.org/core/); beta 5 shipped 2026-11-10 (release index above). Other pages still say Dec 9 or 10, so treat the date as soft |
| License | GPL-2.0-or-later ([wordpress.org/about/license](https://wordpress.org/about/license/)); GitHub mirror shows 21.5k stars (`gh api repos/WordPress/WordPress`, 2026-11-13) |
| Governance | Open-source project led by Matt Mullenweg. Trademark held by the WordPress Foundation; Automattic is the largest commercial contributor and runs wordpress.com. Automattic cut sponsored core contribution time to about 45 h/week in January 2025 ([summary by eseospace, secondary](https://eseospace.com/blog/wp-engine-automattic-dispute-explained/)) |
| Funding | No project-level budget found. Core is funded by employer-sponsored contributors (Automattic, hosts, agencies). Automattic's own financing: not found |

### WP Engine dispute and Automattic turmoil (status as reported, not verified against the court docket)

- 2024-09-25 WordPress.org cut off WP Engine; WP Engine sued in N.D. Cal. (case 4:24-cv-06917); a preliminary injunction on 2024-12-10 restored access; ACF was forked as "Secure Custom Fields" on 2024-10-12 ([eseospace timeline](https://eseospace.com/blog/wp-engine-automattic-dispute-explained/)).
- About 2026-09-24 the judge let WP Engine's amended antitrust claims proceed, kept the extortion claim dismissed, and let Automattic's seven trademark counterclaims proceed ([Search Engine Journal via search summary](https://www.searchenginejournal.com/wp-engine-vs-automattic-rulings-preserve-wp-engines-lawsuit/555928/)). No merits ruling and no trial date found.
- 2026-09-09 Automattic's board put Mullenweg on paid leave and named the CFO interim CEO; Automattic told TechCrunch it lasted 33 h 20 min and he returned; several directors then left ([TechCrunch](https://techcrunch.com/2026/09/09/automattics-board-forces-ceo-matt-mullenweg-into-leave-of-absence/); details from search summaries of TechCrunch and others, I could not open the full articles).
- Relevance to this benchmark: the risk is governance and plugin-directory politics (plugin forks, update channels), not code quality. The FAIR Package Manager (Linux Foundation, 2025) is a separate distribution effort ([eseospace](https://eseospace.com/blog/wp-engine-automattic-dispute-explained/)).

## 2. Maintainability

**Cadence.** Majors in the last 12 months: 6.9 (Dec 2025), 7.0 (May 2026, slipped from a 2026-04-09 target to 05-20 for "architectural improvements", [schedule post](https://make.wordpress.org/core/2026/04/22/wordpress-7-0-release-party-updated-schedule/)), 7.1 (Aug 2026). A third-party page claims WordPress moved to one major per year in April 2025; the 2026 dates contradict that, so ignore it. Security/maintenance point releases are frequent: 7.1.1 (09-17), 7.1.2 (09-22), 7.1.3 (10-06), 7.1.4 (10-28).

**Support policy.** "Only the latest version of WordPress is officially supported"; the Security Team backports fixes to older branches "as a courtesy" ([about/security](https://wordpress.org/about/security/)). The 7.1.4 release says fixes were backported to all eligible branches, back to 4.7 ([7.1.4 post](https://wordpress.org/news/2026/10/wordpress-7-1-4/)). Auto-updates apply minor/security releases by default.

**Requirements.** Recommended PHP 8.3+, MariaDB 10.11+ or MySQL 8.0+; PHP 7.4 and MySQL 5.5.5 are the lowest the page mentions, and it calls them EOL ([requirements](https://wordpress.org/about/requirements/)). The update API still reports PHP 7.4 as the minimum for 7.1.4 (`api.wordpress.org/core/version-check/1.7/`, 2026-11-13).

| Major | Date | What changed / what broke |
|---|---|---|
| 6.9 | 2025-12-02 | Notes on blocks, Command Palette everywhere, Abilities API, 30+ accessibility fixes, LCP work; announcement lists no breaking changes ([post](https://wordpress.org/news/2025/12/gene/)) |
| 7.0 | 2026-05-20 | Core AI Client and Connectors screen, admin redesign, visual revisions, server-side-only block registration, new blocks; no breaking changes listed; real-time collaboration did not ship ([post](https://wordpress.org/news/2026/05/armstrong/)) |
| 7.1 | 2026-08-19 | Responsive styling in the Site Editor, browser-side image processing (libvips WASM), AVIF/HEIC, iframed post editor for all themes (can break old editor CSS), Tabs/Playlist blocks ([post](https://wordpress.org/news/2026/08/mary-lou/)) |

Migration tooling: in-place auto-update, WP-CLI (latest release 2.12.0 on 2025-05-07, [GitHub](https://github.com/wp-cli/wp-cli/releases)), and per-release Field Guides for developers. There is no "major upgrade breaks nothing" guarantee; plugin and theme compatibility is the real migration cost.

**Release quality incident.** 6.9.2 (2026-03-10) fixed 10 security issues but ~20 h later was found to be missing several fixes and crashed some sites; 6.9.3 and 6.9.4 (2026-03-11) followed ([6.9.2 post](https://wordpress.org/news/2026/03/wordpress-6-9-2-release/), [summary](https://www.365i.co.uk/news/2026/03/12/wordpress-three-security-patches-24-hours/)).

**Ecosystem cost.** The long-term cost is plugins and themes, not core: 91% of 2025 vulnerabilities were in plugins and 9% in themes (section 5). A site must track updates for each plugin, and abandoned plugins need replacing. Dependency footprint of core is small (PHP + DB, vendored libraries such as PclZip and getID3, which themselves appear in advisories); the footprint of a real site is "core + N plugins + theme".

## 3. Analytics

Not from the box in core. Core ships no visitor analytics. Conventional options:

| Option | Detail |
|---|---|
| Jetpack Stats | Official Automattic plugin, 3M+ installs, v16.4 (2026-11-03); stats free for non-commercial sites, free plan limits views to 7 days; commercial prices not on the plugin page ([plugin page](https://wordpress.org/plugins/jetpack/)) |
| Site Kit by Google | 5M+ installs, v1.191.0; Analytics, Search Console, PageSpeed Insights ([plugin page](https://wordpress.org/plugins/google-site-kit/)). Sends data to Google |
| Third party | Plausible, Umami, Matomo, Cloudflare Web Analytics via snippet or plugin ([Cloudflare docs](https://developers.cloudflare.com/web-analytics/)) |

## 4. Monitoring and observability

- **Site Health** (core since 5.2): Status tab with critical/recommended/good tests, Info tab for support data; extensible via `site_status_tests` and `debug_information` ([core post](https://make.wordpress.org/core/2019/04/25/site-health-check-in-5-2/)). It checks configuration, not uptime or latency.
- **Query Monitor**: 200k+ installs, v4.1.1 (2026-10-27); DB queries, PHP errors, hooks, HTTP calls, admin-only, nothing stored or sent out ([plugin page](https://wordpress.org/plugins/query-monitor/)). Development tool, not production monitoring.
- **Logging**: `WP_DEBUG_LOG` to a file; PHP-FPM and web server logs. No metrics endpoint or tracing in core (not found).
- **APM/Sentry**: Sentry has a PHP SDK ([getsentry/sentry-php](https://github.com/getsentry/sentry-php)); the WordPress integration I found is a community plugin, [stayallive/wp-sentry](https://github.com/stayallive/wp-sentry) (394 stars). I found no official Sentry WordPress plugin. New Relic, Datadog and similar PHP agents work on the PHP layer.

## 5. Robustness and security

| Source | Finding |
|---|---|
| Ecosystem volume | 11,334 new WordPress-ecosystem vulnerabilities in 2025, +42% on 2024 (7,966); about 91% plugins, 9% themes, 6 in core, all low priority; 17% high severity; 46% had no patch at public disclosure ([Patchstack 2026 report](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/)). Patchstack sells WordPress security, so treat as a vendor figure |
| Core, 2026-03-10 | 6.9.2 fixed 10 issues: blind SSRF, stored XSS in nav menus and `data-wp-bind`, AJAX `query-attachments` authorization bypass, PclZip path traversal, Notes authorization bypass, getID3 XXE ([post](https://wordpress.org/news/2026/03/wordpress-6-9-2-release/)). A secondary source maps three to CVE-2026-3901, -3906, -3907, -3908 ([summary](https://www.365i.co.uk/news/2026/03/12/wordpress-three-security-patches-24-hours/)); the official post lists no CVE IDs or CVSS scores |
| Core, 2026-10-28 | 7.1.4 fixes a remote code execution weakness in the upgrade process, several stored XSS (Interactivity API, Customizer, Categories block, Playlist/image blocks, specially crafted usernames), a stored DoS and information exposures; no CVE IDs or severities in the post ([post](https://wordpress.org/news/2026/10/wordpress-7-1-4/)) |

Default protections: nonces for state-changing actions (not full CSRF tokens), escaping functions (`esc_html`, `esc_attr`, `wp_kses`) that the developer must call, prepared statements via `$wpdb->prepare`, no default CSP. Escaping is opt-in per output, unlike Go `html/template` or Blade `{{ }}`.

Attack surface vs a static site: public PHP execution, `/wp-login.php` and `/wp-admin`, XML-RPC and the REST API, a MySQL/MariaDB server, file uploads, and every plugin's endpoints. A static site has none of these. WordPress mitigation is operational: auto-updates, a minimal plugin set, a WAF, and backups.

## 6. Development effort

- **Learning curve**: low for editing content and installing themes; moderate for custom classic themes (PHP template hierarchy, The Loop, hooks). Block themes and `theme.json` add a second model.
- **Docs**: developer.wordpress.org plus the make.wordpress.org handbooks; broad, sometimes inconsistent between classic and block eras.
- **Market and pool**: WordPress is on 39.2% of all sites and 57.9% of CMS-using sites; 32.3% use no CMS ([W3Techs, 2026-11-13](https://w3techs.com/technologies/overview/content_management)). 13.6% of Stack Overflow 2025 respondents used it; PHP 18.9% ([SO 2025](https://survey.stackoverflow.co/2025/technology)). The largest hiring pool of the seven stacks, with wide skill variance.
- **Editing experience**: the block editor (Gutenberg) with notes, command palette, media editor, revisions compare, and a mature role model. The best non-developer editing story of the seven, along with Ghost.

## 7. Hosting and operations

- **Must run**: web server (nginx or Apache), PHP-FPM, MariaDB or MySQL, usually an object or page cache; cron (WP-Cron or system cron).
- **Backups**: database dump plus `wp-content/uploads`; plugins or host snapshots.
- **Upgrades**: auto-updates for minor releases; majors and plugin updates need testing. A staging copy is standard practice.
- **Resources**: no official sizing found; see `docs/results` for measured numbers. A page cache is what makes it competitive with static output.
- **Managed hosting** (list prices from vendor pages, 2026-11-13):

| Host | Entry price |
|---|---|
| WordPress.com | Free; Personal $4/mo, Premium $8/mo, Business $25/mo, Commerce $45/mo, billed yearly; plugins from Personal up, SFTP/WP-CLI on Business ([pricing](https://wordpress.com/pricing/)) |
| WP Engine (EU page) | 1 site EUR 32/mo (25k visits, 10 GB); Essential from EUR 25.60/mo annual ([plans](https://wpengine.com/plans/)) |
| Self-managed VPS | Hetzner shared cloud from EUR 5.49/mo excl. VAT ([Hetzner](https://www.hetzner.com/cloud/)) plus your own admin time |

- **Cloudflare Pages**: not compatible. Pages serves static assets and Functions run on Workers, not PHP ([limits](https://developers.cloudflare.com/pages/platform/limits/)). WordPress would need a separate PHP host, or a static export plugin (not evaluated). Cloudflare now recommends Workers static assets for new projects; Pages still works ([migration guide](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)).

## 8. Other

- **i18n**: core supports translated interfaces and language packs; multilingual content needs a plugin (WPML, Polylang). Not verified in this pass beyond general knowledge.
- **SEO**: RSS feeds in core; XML sitemaps at `/wp-sitemap.xml` since 5.5, can be disabled ([core post](https://make.wordpress.org/core/2020/07/22/new-xml-sitemaps-functionality-in-wordpress-5-5/)). Meta descriptions, canonical output beyond the basics and Open Graph usually come from a theme or an SEO plugin.
- **Images**: core generates sub-sizes; 7.1 moves compression, resizing and thumbnails to the browser (WASM libvips) and adds AVIF/HEIC ([7.1 post](https://wordpress.org/news/2026/08/mary-lou/)).
- **Content model**: posts, pages, custom post types, taxonomies, post meta in MySQL; REST API in core.
- **Accessibility**: 6.9 shipped 30+ fixes ([post](https://wordpress.org/news/2025/12/gene/)); output quality still depends on the theme.

## Not found / unverified

- Automattic financing and WordPress Foundation budget.
- Court docket confirmation of the 2026-09 ruling; Mullenweg leave details beyond TechCrunch's headline.
- Official CVE IDs and CVSS scores for 6.9.2 and 7.1.4 core fixes.
- WordPress.org PHP/DB version share charts (page did not render).
