# Plain HTML/CSS/JS served by nginx: qualitative research

Research date: 2026-11-13. Every number is "as of 2026-11" unless dated otherwise. "Not found" means no primary source found.
Two things are researched: nginx (the server, with real release and CVE data) and hand-written HTML/CSS/JS (web standards, no
framework). In this benchmark the reference target is `apps/static-html`: pre-written files under `site/`, copied into
`nginx:1.29-alpine` with `shared/nginx/static.conf` (read from the repo, 2026-11-13).

## 1. Snapshot

| Item | Finding |
|---|---|
| nginx mainline | 1.31.8, released 2026-10-21 ([nginx.org](https://nginx.org/)) |
| nginx stable | 1.30.6, released 2026-10-14 (nginx.org). Stable branches: 1.28.0 on 2025-04-24, 1.30.0 on 2026-04-14; mainline 1.29.0 on 2025-06-25, 1.31.0 on 2026-05-13 ([GitHub releases](https://github.com/nginx/nginx/releases)) |
| Last 1.29 release | 1.29.8 on 2026-04-07 (GitHub releases); the benchmark pins `nginx:1.29-alpine` (see section 5) |
| License | BSD-2-Clause; 32.1k stars on `nginx/nginx` (`gh api`, 2026-11-13) |
| Owner/governance | F5, Inc. The governance page promises OSI-approved licenses, no removal-and-commercialization of existing features and no usage limits; each project has a technical committee; roadmaps and review are public. It names no maintainers and says nothing on funding ([governance](https://nginx.org/en/docs/governance.html)). A 2026-05-20 post says F5 is adding engineers and reviewers, a public project board and quarterly community calls, and moving features (session persistence in 1.29.6, forward-proxy CONNECT and `least_time` in 1.31.0) into the open source core ([blog.nginx.org](https://blog.nginx.org/blog/strengthening-the-nginx-community)) |
| Fork | freenginx, announced 2024-02-14 by Maxim Dounin, a long-time core developer, after a dispute over how F5 handled security fixes in the experimental HTTP/3 code (CVE-2024-24989) ([The Register](https://www.theregister.com/2024/02/16/freenginx_fork/), [Phoronix](https://Phoronix.com/news/Nginx-Forked-To-Freenginx)). Current: freenginx 1.31.5 mainline and 1.30.2 stable, both 2026-10-27 ([freenginx.org](https://freenginx.org/)). Few stars (181 on GitHub), but it keeps pace with security fixes |
| Share | nginx serves 30.0% of websites whose web server W3Techs knows, 2026-11-13 ([W3Techs](https://w3techs.com/technologies/details/ws-nginx)) |
| HTML/CSS/JS | Web standards (W3C/WHATWG, ECMAScript); no vendor, no license, no release cycle of its own. Browser support is the compatibility surface |

## 2. Maintainability

**nginx cadence.** Mainline releases about every two to four weeks (1.31.5 on 2026-09-02, 1.31.6 on 09-15, 1.31.7 on 10-14, 1.31.8 on 10-21); stable gets the same fixes in parallel (1.30.5 on 09-15, 1.30.6 on 10-14) ([GitHub releases](https://github.com/nginx/nginx/releases)).

**Support policy.** I found no published end-of-life policy. The advisory table is the best evidence: security fixes after about 2026-04 list only "1.31.x and 1.30.x" as fixed versions, while fixes from March 2026 still list 1.28.3 and 1.29.7 ([advisories](https://nginx.org/en/security_advisories.html)). So in practice only the current stable and mainline get fixes, and a stable branch is serviced for roughly a year until the next one. That is my reading of the table, not a stated policy.

| nginx branch | Date | Notes |
|---|---|---|
| 1.26 stable | 2024-04 (not retrieved) | Last patch seen 1.26.3 on 2025-02-05 |
| 1.28 stable | 2025-04-24 | Fixed as late as 1.28.3 (about 2026-03) |
| 1.30 stable | 2026-04-14 | Current stable |

What breaks between versions: configuration is usually backward compatible; modules and directives change slowly. Breaking changes are listed in the changelog per release; I did not retrieve a list. `nginx -t` validates config; no migration tooling is needed for a static server.

**Hand-written HTML/CSS/JS.** Maintenance cost is repetition, not dependency churn. With 40 posts, header, footer, nav and `<head>` appear 44+ times; a change means editing every file or running a generator. The benchmark's reference solves this with `apps/static-html/tools/build-once.mjs` that writes `site/` from `content/posts.json` (repo, 2026-11-13), which makes it a tiny custom static site generator. Pure hand-editing does not scale past a handful of pages. Platform churn is near zero: HTML, CSS and ES modules written today keep working; the main risk is relying on very new CSS or JS features without fallbacks.

**Dependency footprint.** None in the page output (the shared `style.css` and `app.js` have no library). The server side is the nginx binary plus an Alpine base image (`nginx:1.29-alpine`, base-image CVEs also matter).

## 3. Analytics

Not from the box: neither HTML nor nginx has analytics. Conventional options for a static site: Cloudflare Web Analytics (available on all plans, configurable without a DNS change, [docs](https://developers.cloudflare.com/web-analytics/)), Plausible or Umami via one script tag, GA4, or GoAccess over nginx access logs (log-based tools not evaluated). nginx logs give request counts without any client script, but bots and prefetch inflate them.

## 4. Monitoring and observability

| Facility | Facts |
|---|---|
| Access/error logs | Standard; the benchmark config disables the access log only for `/healthz` |
| `stub_status` | Active connections, accepts, handled, requests, reading/writing/waiting; not built by default (`--with-http_stub_status_module`); `location = /basic_status { stub_status; }` ([docs](https://nginx.org/en/docs/http/ngx_http_stub_status_module.html)). Whether official Docker and distro packages include it: not verified |
| Prometheus | `nginx-prometheus-exporter` (F5's `nginxinc` repo, 2.0k stars, active 2026-11-12) scrapes `stub_status` ([repo](https://github.com/nginxinc/nginx-prometheus-exporter)) |
| OpenTelemetry | Official `ngx_otel_module` (source at [nginx/nginx-otel](https://github.com/nginx/nginx-otel)): OTLP/gRPC traces, W3C trace context, `$otel_trace_id` variables; open-source package since 1.25.3 ([docs](https://nginx.org/en/docs/ngx_otel_module.html)) |
| Paid | NGINX Plus has a richer API and dashboard (not evaluated) |
| Sentry/APM | Not applicable to the server; a browser SDK only if JS is shipped |
| Health | A `location = /healthz` that returns `ok`, as the shared config does |

## 5. Robustness and security

**nginx advisories.** nginx.org lists 26 advisories for 2026, 2 for 2025, and 7 for 2024; that is 28 since 2024-11-01 ([security advisories](https://nginx.org/en/security_advisories.html); years inferred from CVE IDs because the page shows no dates). Severities are nginx's own: most medium, a few low, and two "major" in 2026: CVE-2026-42533 (buffer overflow in `map` and regex, versions 0.9.6 to 1.31.2) and CVE-2026-42530 (use-after-free in HTTP/3, 1.31.0 to 1.31.1). The rest of 2026, with fixes in 1.31.7/1.30.6 on 2026-10-14: CVE-2026-15176 (overflow, `alias` with `rewrite`), CVE-2026-93479 (script evaluation), CVE-2026-95101 (HTTP/3 request body injection), CVE-2026-97629 (TLS session ticket forgery with key rotation), CVE-2026-97205 (use-after-free, SSI with AIO) ([nginx.org](https://nginx.org/)). Earlier: CVE-2024-24989 and -24990, both major, in HTTP/3 (1.25.3 only).

Most entries need a module that a static site does not enable: HTTP/3, mp4, dav, SSI, mail, rewrite/alias, proxying. The benchmark's `static.conf` uses only `try_files`, one `return`, and `error_page` on plain HTTP port 8080, so on my reading of its ranges the exposure to the 2026 list is small, but that depends on compiled-in modules and was not tested.

**Decision-relevant finding: the pinned base image.** `Dockerfile` uses `nginx:1.29-alpine`. The last 1.29 release is 1.29.8 (2026-04-07), and 17 of the 26 advisories for 2026 have vulnerable ranges that include 1.29.8 and list fixes only in 1.30.x or 1.31.x (my reading of the ranges in the [advisory table](https://nginx.org/en/security_advisories.html)). The `1.29` Docker tag cannot get those fixes. I did not pull the image to confirm its version; `docker run --rm nginx:1.29-alpine nginx -v` will. For a benchmark that compares robustness, pinning `1.30-alpine` (stable) is the conservative choice.

**Defaults.** nginx adds no security headers or CSP; the shared config sets `server_tokens off` and nothing else (repo). Static HTML has no server-side escaping because there is no dynamic output, so XSS exists only in the JS you ship (`app.js`) and any third-party script. The shared `app.js` and generated HTML must be reviewed for `innerHTML` use (not audited here). CSRF: not applicable; there are no state-changing requests. Headers on Cloudflare Pages go in a `_headers` file (100 rules, 2,000 characters per line, not applied to Functions responses, [docs](https://developers.cloudflare.com/pages/configuration/headers/)).

**Attack surface.** The smallest of the seven: no application code, no database, no admin, no write paths, no interpreter. What remains is the web server process, TLS, the container base image, DNS/CDN configuration and any third-party script. Defacement needs write access to the host or build pipeline.

## 6. Development effort

- **Learning curve**: lowest of the seven; HTML, CSS and a script. nginx config is small for a static site (about 30 lines here).
- **Docs**: MDN for the platform, nginx.org reference for the server; both strong.
- **DX**: no tooling needed to start, but at this size you want a generator or at least templates (see section 2). Hand-typed duplication and link rot are the real DX problems; Hugo or a 100-line script remove them.
- **Hiring pool**: universal for HTML/CSS/JS; nginx skills are common among ops engineers (30.0% of sites with known servers).
- **Editing for non-developers**: none. Content edits mean editing HTML or re-running the generator. This is the weakest non-developer story, tied with Go and Hugo without an add-on.

## 7. Hosting and operations

- **Must run**: only files plus a static file server (nginx, Caddy, S3, a CDN). No runtime, database or process manager beyond nginx.
- **Backups**: git; output is regenerable.
- **Upgrades**: bump the nginx image tag (security-relevant, see section 5); content changes are file copies. Reloads are `nginx -s reload`, no downtime.
- **Resources**: tiny and flat; measured numbers are in the results.
- **Managed hosting**: Cloudflare Pages Free (20,000 files, 25 MiB per file, 500 builds a month, [limits](https://developers.cloudflare.com/pages/platform/limits/)) covers it at no cost; a VPS from EUR 5.49/mo excl. VAT also works ([Hetzner](https://www.hetzner.com/cloud/)). Object storage plus a CDN is the other standard route (prices not retrieved).
- **Cloudflare Pages compatibility**: full. Drop the files in a directory, use `_headers` for headers and `_redirects` for routing (not opened here). The nginx rules that make `/blog` resolve without a redirect (`try_files $uri $uri.html $uri/index.html`) are replaced by Pages' own clean-URL behavior; check that `/blog` does not 308 to `/blog/` before relying on it for the contract. Pages now sits beside Workers static assets, which Cloudflare recommends for new projects ([migration guide](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)).

## 8. Other

- **i18n**: none built in; separate folders per language and `hreflang` links by hand or generator.
- **SEO**: all manual: `<title>`, meta description, canonical, Open Graph, `sitemap.xml`, `rss.xml` (the reference ships them as generated files). Static output with real HTML is the best case for crawlers.
- **Images**: no processing; use pre-optimized WebP with explicit width and height and `loading="lazy"`, as the contract requires. Native `<picture>`/`srcset` give responsive images without tooling.
- **Content model**: files. No query, no taxonomy engine; tag and search filtering is client-side JS (`app.js`).
- **Accessibility**: as good as the markup you write; native elements, skip link and `aria-current` come for free in the contract. No framework layer to introduce regressions.

## Not found / unverified

- nginx published support/EOL policy and the 1.26 stable release date.
- Per-advisory dates for nginx (page shows none) and which Docker/Alpine images compile `stub_status`.
- Whether `nginx:1.29-alpine` resolves to 1.29.8 today (inferred, not pulled).
- Whether Cloudflare Pages serves `/blog` without a redirect (not tested).
- freenginx's size and funding.
