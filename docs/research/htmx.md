# htmx as an interactivity layer: qualitative research

Research date: 2026-11-13. Every number is "as of 2026-11" unless dated otherwise. "Not found" means no primary source found.
htmx is a browser library, not a server stack. In this benchmark it replaces the vanilla JS filter island on top of the Go server
(`go-htmx`). Server-side facts (hosting, patching, template escaping) are therefore those of [go.md](go.md); this file covers
only what htmx adds or changes.

## 1. Snapshot

| Item | Finding |
|---|---|
| Current versions | Two lines. 4.0.0 released 2026-08-28, 4.0.1 on 2026-11-01; 2.0.11 on 2026-11-01 ([GitHub releases](https://github.com/bigskysoftware/htmx/releases)) |
| npm default | npm `latest` is still 2.0.11; 4.x will be marked `latest` "sometime in 2027" ([htmx.org](https://htmx.org/), [npm registry](https://registry.npmjs.org/htmx.org/latest)). Pin an exact version to use 4.x |
| Last three majors | 1.0 date not retrieved (1.9.0 was 2023-04-11), 2.0.0 on 2024-06-17, 4.0.0 on 2026-08-28 (GitHub releases). There is no 3.x |
| License | npm lists 0BSD for 2.0.11; the GitHub repo reports "Other" and htmx.org states no license, so check the `LICENSE` file for 4.x before relying on this ([npm](https://registry.npmjs.org/htmx.org/latest), [repo](https://github.com/bigskysoftware/htmx)) |
| Governance | Project lives under the `bigskysoftware` GitHub owner (Big Sky Software); release notes show one main maintainer-style contributor pattern plus many one-off contributors (my reading of the 4.0.0 notes, not a stated structure); 49.6k stars, created 2020-04-13 ([repo](https://github.com/bigskysoftware/htmx)). Formal governance document: not found |
| Funding | GitHub Sponsors; platinum commspace, gold SerpApi, silver includes JetBrains, GitHub, Craft CMS, ButterCMS, Black Host ([htmx.org](https://htmx.org/)). No venture funding found |
| Size and deps | About 16 kB min+gzip with zero dependencies per htmx.org; the htmx 4 site says about 11 kB min+brotli, zero dependencies ([htmx.org](https://htmx.org/), [four.htmx.org](https://four.htmx.org/)) |
| Adoption | 1.48M npm downloads in the last month, 2026-10-14 to 11-12 ([npm API](https://api.npmjs.org/downloads/point/last-month/htmx.org)); npm counts include CI and mirrors |

## 2. Maintainability

**Cadence.** Frequent: the 4.0 line went through at least three betas (4.0.0-beta4 on 2026-05-22 to beta6 on 2026-07-23) before 4.0.0 (GitHub releases), and 2.0.11 was cut the same day as 4.0.1. The library has no server component, so upgrading means replacing one file.

**Support policy.** htmx.org says the 1.x line "will be supported indefinitely"; 2.x stays the npm default until 2027 ([htmx.org](https://htmx.org/)). A dated end-of-support for 2.x: not found (the migration guide does not state one, [guide](https://four.htmx.org/migration-guide-htmx-4/)).

| Major | Date | What changed |
|---|---|---|
| 1.9 to 2.0 | 2024-06-17 | Dropped IE support, extensions moved to separate packages (general knowledge, not re-read); 1.x remains supported ([htmx.org](https://htmx.org/)) |
| 4.0 | 2026-08-28 | "Significant architectural rewrite". `fetch()` replaces `XMLHttpRequest` (cannot be reverted); attribute inheritance becomes explicit (`:inherited`, or `htmx.config.implicitInheritance = true`); history snapshot cache in `localStorage` removed (back button re-fetches); 4xx/5xx responses are now swapped unless configured; default timeout 60 s (was none); `hx-disable` renamed `hx-ignore`; `allowEval` and `allowScriptTags` removed; `selfRequestsOnly` replaced by `mode` ([migration guide](https://four.htmx.org/migration-guide-htmx-4/)) |

Migration tooling: a compatibility extension, `htmx-2-compat`, is documented for running 2.x markup on 4 ([four.htmx.org](https://four.htmx.org/extensions/htmx-2-compat), found through search, not opened). The official guide still marked some tables TBD in search snippets. For a 3-attribute usage like this benchmark's filter, migration cost is small; for a large app that relies on implicit inheritance it is real work.

**Dependency footprint.** Zero runtime dependencies; no build step; one vendored file served from `/static` or a CDN. Compared with the vanilla island it adds ~11-16 kB over the wire (see measured results for the actual delta). Server side, the Go server needs to return HTML fragments and inspect `HX-Request`; add `Vary: HX-Request` when one URL returns two markups ([docs](https://htmx.org/docs/#introduction)). That is a caching correctness cost that a plain JS island does not have.

## 3. Analytics

Not from the box. htmx has no analytics. Partial responses and boosted navigations do not trigger full page loads, so script-based analytics that count page loads undercount unless they listen to htmx history events (htmx event names changed to `htmx:phase:action` in 4, [guide](https://four.htmx.org/migration-guide-htmx-4/)). Server logs can separate fragment requests by the `HX-Request` header ([docs](https://htmx.org/docs/#introduction)). Conventional approach: whatever the backend uses (see go.md).

## 4. Monitoring and observability

Nothing built in. The browser console and `htmx.logAll()` are debug aids (general knowledge, not re-read). Error handling is via events; htmx 4 swaps error responses by default, so error HTML can appear in the page unless you set `htmx.config.noSwap = [204, 304, '4xx', '5xx']` ([guide](https://four.htmx.org/migration-guide-htmx-4/)). Client-side error reporting: Sentry's browser SDK works at the DOM level; htmx-specific integration: not found. Server-side monitoring is Go's (go.md).

## 5. Robustness and security

**Vulnerabilities in htmx itself.** The GitHub repo shows no published security advisories (`gh api repos/bigskysoftware/htmx/security-advisories`, 2026-11-13). An NVD keyword search for "htmx" returns only two CVEs, both in other products that use htmx (Leantime CVE-2026-92772, CVSS 7.1, an authorization bypass in a plugin install endpoint; WebDyne CVE-2026-78192, CVSS 7.5) ([NVD API](https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=htmx)). NVD keyword search can miss entries; read this as "no known CVE in htmx core", not as proof of absence.

**The real risk is injected markup.** htmx executes `hx-*` attributes found in any HTML it swaps in. If user content reaches the page unescaped, an attacker does not need `<script>`: injected `hx-get` or `hx-post` attributes can fire requests with the victim's cookies. The docs' guidance ([security section](https://htmx.org/docs/#security)):

- "Do not trust input from the user": escape all untrusted content; if you bypass escaping (a `raw()` helper), scrub `hx-` attributes and inline scripts, using an allow-list rather than a deny-list.
- `hx-disable` on a parent stops htmx processing of that subtree and cannot be undone by injected content. **In htmx 4 this attribute was renamed `hx-ignore`, and `hx-disable` now means "disable element while request runs"**, so a 2.x site that relied on it for protection loses that protection if it upgrades without renaming ([guide](https://four.htmx.org/migration-guide-htmx-4/)).
- 2.x config: `selfRequestsOnly` defaults to true; `allowEval=false` disables eval-based features (`hx-on:`, event filters, `js:` prefixes); `allowScriptTags=false`; `historyCacheSize=0` and `hx-history="false"` keep sensitive pages out of the `localStorage` history cache ([docs](https://htmx.org/docs/#security)). In 4, `mode` defaults to `'same-origin'`, history caching is gone, and `hx-csp` supports strict CSP ([guide](https://four.htmx.org/migration-guide-htmx-4/)).
- A CSP adds a second layer. With `allowEval=false` htmx 2 can run under a CSP without `unsafe-eval` ([docs](https://htmx.org/docs/#security)); the CSP details for 4: not found.
- CSRF: send tokens with `hx-headers` on `<body>`; with `hx-boost`, place the token on an element that gets replaced ([docs](https://htmx.org/docs/#security)).

**Protections the backend keeps.** Go `html/template` still escapes fragment output, because fragments are templates too. A fragment endpoint that returns `template.HTML` from user data re-opens the hole. Fragment endpoints are extra public URLs, so rate limits and input validation apply to them as well.

**Attack surface vs static.** Adds: fragment endpoints, `hx-*` attribute injection as an XSS vector, and (4.x) error-body swapping. Removes: hand-written fetch/DOM code. Net change versus the vanilla island: small, and mostly shifts from "my JS" to "a third-party library with a documented trust model".

## 6. Development effort

- **Learning curve**: low. About a dozen core attributes (`hx-get`, `hx-target`, `hx-swap`, `hx-trigger`, `hx-push-url`, `hx-boost`). The hard part is server design: which fragments to return, URL history, and full-page fallback ("you must be able to navigate to that URL and get a full page back", [docs](https://htmx.org/docs/#introduction)).
- **Docs**: a single long reference page plus essays; the 4.x docs site was still marked "under construction" in search snippets (four.htmx.org).
- **DX**: no build, no bundler, no client state. Debugging is in the network tab; HTML fragments are readable.
- **Community**: 49.6k stars; npm 1.48M monthly downloads (above). Hiring pool: no direct measure found; htmx knowledge is incidental to backend skills (Go, Python, PHP, Ruby).
- **Editing for non-developers**: none. htmx does not touch content authoring.

## 7. Hosting and operations

- **What must run**: nothing extra in the browser; the server must serve HTML fragments, which means a dynamic backend (the Go server here).
- **Backups/upgrades**: replace one JS file; pin the version in the template (a CDN `latest` URL for 2.x will not pick up 4.x because npm `latest` is 2.0.11 until 2027).
- **Caching**: fragment and full-page responses share URLs, so `Vary: HX-Request` or `getCacheBusterParam` is needed behind a CDN ([docs](https://htmx.org/docs/#introduction)).
- **Cloudflare Pages**: the htmx file is static and works anywhere, but the filter needs a server that returns fragments. On Pages alone it would require pre-rendered fragment files (one per tag/query), which does not fit free-text search. See go.md for why Go itself does not run on Pages.
- **Progressive enhancement**: boosted links and forms still work without JavaScript ([docs](https://htmx.org/docs/#introduction)); a full-text `q=` filter needs a server or JS either way.

## 8. Other

- **i18n, SEO, images, content model**: none; inherited from the backend. Server-rendered HTML with real URLs (`hx-push-url`, `hx-boost`) keeps pages crawlable.
- **Accessibility**: swapped content is not announced by screen readers unless the target region is a live region (`aria-live`) or focus is moved (general knowledge, not re-read); htmx 4 adds `hx-validate` form validation by default per the docs ([docs](https://htmx.org/docs/#introduction)). The benchmark's markup contract (`aria-pressed` chips, `p.result-count`) must be kept in sync by the fragment.
- **Browser support**: 2.x dropped IE; 1.x supports IE11 ([docs](https://htmx.org/docs/#introduction)). 4.x browser matrix: not found.

## Not found / unverified

- htmx 4 license text; 1.0 release date; any dated end-of-support for 2.x.
- Whether htmx 4 works under a strict CSP without `unsafe-inline` for the indicator styles.
- Accessibility behavior specifics and `htmx-2-compat` contents (only seen in search snippets).
- Corporate details of Big Sky Software (no primary page opened).
