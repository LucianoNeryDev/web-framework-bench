# Findings

What the numbers in [results](results.md) mean, combined with the [research notes](research/) and what the
implementations ran into (`apps/*/NOTES.md`). Measured on two Google Cloud VMs: the target on an
`n2-standard-2` (2 vCPU, 8 GB), clients on a separate `n2-standard-4`. See the [methodology](methodology.md),
including its threats to validity: one run per configuration, one small site.

## In short

1. **For a content site, prerender.** On the post and home pages every static build, from hand-written HTML to
   Next.js, served 16,600-18,300 requests per second from a 2-vCPU VPS with 3.4 MB of server memory. Once the
   HTML is a file, the framework mostly decides what the *browser* has to download and run. The exception is
   page size: Next.js and Qwik inline their client state into the HTML (the `/blog` page is 109 KB and 147 KB
   against 45 KB for the reference), so their static `/blog` served only 10,900 and 7,900 requests per second.
2. **What the browser gets differs a lot.** On `/blog`:

   | | External JS (transferred) | Inline script in the HTML |
   |---|---:|---:|
   | Astro | 0 KB | 1.5 KB |
   | Vanilla island (HTML, Hugo, Go, Laravel, WordPress, Ghost) | 1.2 KB | 0.2 KB |
   | Go + htmx | 18 KB | 0.2 KB |
   | SvelteKit | 44 KB | 19 KB |
   | Qwik City | 47 KB | 63 KB (serialized state) |
   | Nuxt | 86 KB | 1 KB |
   | Angular | 97 KB | 1.3 KB |
   | React Router | 119 KB | 23 KB |
   | Next.js | 140 KB | 74 KB (RSC payload) |

   On a throttled phone the blog filter responds after 0.55 s without a client framework (Astro included),
   about 1 s with Qwik and htmx, 1.1 s with SvelteKit, 1.4 s with Angular and Nuxt, and 1.6-1.8 s with React
   Router and Next.js.
3. **Rendering a post per request costs 0.5 to 37 ms of CPU.** Measured on the post page at 100 connections:
   Go 0.54 ms, Astro 0.71, SvelteKit 1.3, React Router 2.4, Nuxt 5.1, Qwik 6.1, Next.js 8.0, Laravel Octane 9.2,
   Angular 11, Laravel on PHP-FPM 13, Ghost 30, WordPress 37.5. List pages cost 2-7 times more (Astro 1.1 ms,
   Go 3.3, Laravel 27, Ghost 72). For Laravel, WordPress and Ghost the figure includes nginx and the database.
   On two vCPUs that is the difference between 3,400 and 50 posts per second.
4. **Node servers do not use the whole VM.** Every Node SSR target used 1.1-1.5 of the 2 vCPUs (one main
   thread plus GC and I/O threads); Go and PHP-FPM used 1.9. The 2 vCPUs are one physical core with two
   threads, so a second Node process would gain something, not double; that was not measured.
5. **A page cache makes a CMS competitive.** WordPress went from 50 to 13,800 posts per second and Ghost from
   42 to 12,100 behind an nginx cache: 66-75% of static throughput, with a 14-16 ms p99 against 10-11 ms. Both
   kept serving cached pages while their database was down. Uncached, under 1,000 concurrent connections only
   29% of requests finished within 10 seconds.
6. **Robustness gaps were specific.** No target reflected the XSS probe or exposed source files or secrets.
   Angular SSR and Qwik SSR answered a malformed URL (invalid UTF-8) with a 500. Astro, Angular and Qwik SSR,
   and uncached Ghost, took the full 10-second Docker grace period to restart, consistent with the research
   finding that their servers install no `SIGTERM` handler. Under 1,000 concurrent connections the static
   builds, Go, Laravel Octane and the cached CMSs finished 100% of requests within 10 seconds; the Node SSR
   targets finished 58-94%. Those failures are almost all client time-outs, so they measure how far throughput
   falls short of the load more than error handling; only Laravel on PHP-FPM returned real server errors (5%).

## Per-stack ratings

1 (poor) to 5 (excellent) within this comparison. Where a framework has two modes, the cell reads
*static / server*.

**Measured**, with fixed thresholds:

| Column | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|
| Server cost: post page, req/s at 100 connections | ≥10,000 | 1,500-9,999 | 400-1,499 | 150-399 | <150 |
| Browser: filter ready on a throttled phone | ≤600 ms | ≤1,050 ms | ≤1,500 ms | ≤2,000 ms | >2,000 ms |
| Resources: memory of all containers after load | ≤10 MB | ≤60 MB | ≤150 MB | ≤300 MB | >300 MB |
| Robustness: share of 1,000 concurrent requests finished within 10 s | ≥99% | ≥90% | ≥75% | ≥50% | <50% |

Robustness then loses one point for each of: a 5xx on malformed input, a restart that takes the full grace
period, and not answering right after the overload (minimum 1).

**Judgement**, from the research notes and the implementations:

- **Maintainability**: support windows, how often majors break things, dependency footprint.
- **Security record**: advisories in the last two years in the code that serves requests. 4: no critical;
  3: one critical or 20+ advisories; 2: a critical plus 40+ advisories, or an admin and database surface
  exposed to the web; 1: several criticals including unauthenticated RCE, SQL injection or a server crash.
  Static output is served by nginx (28 advisories since 2024-11, none critical), so every static mode gets 4.
  Nothing gets 5.
- **Monitoring** and **Analytics**: what exists first-party.
- **Effort**: framework friction while building the same site, hand-written source and the researched learning
  curve. Agent wall-clock time is recorded in [results](results.md) but weighs least.
- **Hosting**: what production needs. **Editors**: editing for non-developers.

| Stack | Server cost | Browser | Resources | Robustness | Maintainability | Security record | Monitoring | Analytics | Effort | Hosting | Editors |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HTML + nginx | 5 | 5 | 5 | 5 | 3 | 4 | 2 | 1 | 2 | 5 | 1 |
| Hugo | 5 | 5 | 5 | 5 | 3 | 4 | 2 | 2 | 4 | 5 | 2 |
| Astro | 5 / 4 | 5 / 5 | 5 / 3 | 5 / 3 | 3 | 4 / 2 | 2 | 2 | 5 | 5 / 3 | 2 |
| SvelteKit | 5 / 3 | 3 / 3 | 5 / 3 | 5 / 3 | 3 | 4 / 4 | 4 | 1 | 4 | 5 / 3 | 2 |
| Nuxt | 5 / 2 | 3 / 3 | 5 / 3 | 5 / 3 | 3 | 4 / 2 | 2 | 3 | 3 | 5 / 3 | 2 |
| Next.js | 5 / 2 | 2 / 2 | 5 / 2 | 5 / 2 | 3 | 4 / 1 | 4 | 3 | 2 | 5 / 2 | 2 |
| React Router | 5 / 3 | 2 / 2 | 5 / 3 | 5 / 3 | 3 | 4 / 3 | 3 | 1 | 3 | 5 / 3 | 1 |
| Angular | 5 / 1 | 3 / 3 | 5 / 2 | 5 / 1 | 4 | 4 / 2 | 2 | 1 | 2 | 5 / 3 | 1 |
| Qwik City | 5 / 2 | 4 / 4 | 5 / 3 | 5 / 1 | 2 | 4 / 1 | 1 | 1 | 2 | 5 / 3 | 1 |
| Go | 4 | 5 | 4 | 5 | 5 | 4 | 4 | 1 | 3 | 4 | 1 |
| Go + htmx | 4 | 4 | 4 | 5 | 5 | 4 | 4 | 1 | 3 | 4 | 1 |
| Laravel (PHP-FPM) | 1 | 5 | 4 | 4 | 4 | 3 | 5 | 1 | 3 | 3 | 1 |
| Laravel (Octane) | 2 | 5 | 3 | 5 | 4 | 3 | 5 | 1 | 3 | 3 | 1 |
| WordPress / cached | 1 / 5 | 5 | 2 | 1 / 5 | 3 | 2 | 2 | 3 | 3 | 2 | 5 |
| Ghost / cached | 1 / 5 | 5 | 1 | 1 / 5 | 2 | 1 | 2 | 3 | 2 | 2 | 5 |

Notes on the judgement columns:

- **Maintainability.** Go scores highest (the Go 1 compatibility promise, standard library only, no
  dependencies). Angular and Laravel publish yearly majors with 24 months of fixes and ship upgrade tooling.
  Qwik's v2 spent about 16 months in beta and is now a release candidate; Ghost's only stated policy is
  "run the latest release". Hand-written HTML has no dependencies but repeats the layout in every file: 5,180
  lines against Hugo's 243 for the same site.
- **Security record.** Next.js had 66 advisories in two years, 7 critical, including the middleware bypass
  CVE-2025-29927 and the React Server Components RCE. Qwik had 31 including 3 critical (one crashes any Qwik
  server). Ghost had 70 in 2026 alone, including an unauthenticated SQL injection. The Trivy image scans mostly
  reflect the base image (Debian-slim Node images carry 48 OS findings, Alpine ones 0-3), so they are listed
  in the results but not used here, except that the Ghost (133 HIGH, 4 CRITICAL) and WordPress (25, 1) images
  stand out in their own application packages.
- **Monitoring.** Laravel has first-party Pulse, Telescope and Nightwatch. Go has pprof, expvar, slog and stable
  OpenTelemetry. Next.js emits OpenTelemetry spans itself, and SvelteKit 3 has built-in tracing. React Router
  has an instrumentation API. The rest rely on generic Node or nginx tooling.
- **Analytics.** Nothing is truly from the box. Ghost has native analytics, but self-hosters only get it through
  the Docker install plus a Tinybird account. WordPress (Jetpack, Site Kit), Next.js (Vercel Analytics) and Nuxt
  (Nuxt Scripts) have first-party plugins or modules; Hugo ships a Google Analytics template. Elsewhere it is a
  script tag.
- **Effort.** Among the JavaScript frameworks, Astro needed no deviations from the contract and the fewest lines
  (352); only Hugo needed fewer (243). Its agent took the longest wall-clock time (149 minutes), mostly waiting
  for builds on a loaded machine. Next.js needed a rewrite to return a correct 404 from a dynamic page, Nuxt an
  undocumented experimental flag for a real `404.html`, and Ghost nginx rewrites for trailing slashes plus
  generated theme data for fields it lacks.
- **Hosting.** Static output runs on any CDN (Cloudflare Pages, for one). A Go binary is a 22 MB image. Node SSR
  needs a Node process; WordPress and Ghost need a database, backups and timely updates, and Ghost needed 1.3 GB
  of memory after load.

## What to pick

| If you are building | Pick | Why |
|---|---|---|
| A developer hub or blog with a few interactive islands | **Astro**, or the framework you already know in **static** mode | Every static build costs the same to serve; Astro ships the least JavaScript |
| A Vue site that needs app-like client navigation | **Nuxt, prerendered** | Full Vue ecosystem with no server cost once prerendered |
| Pages rendered per request on a small VPS | **Go** (with htmx for interactivity), **Astro SSR** or **SvelteKit** | 2-28x the throughput of the other Node and PHP frameworks on the same two vCPUs, and 20-80x uncached WordPress or Ghost |
| A PHP application | **Laravel**, on Octane if throughput matters | First-party monitoring and predictable releases. Octane added 44% on post pages (none on list pages) and finished every request under overload |
| A site non-developers edit | **WordPress or Ghost, always behind a page cache** | Uncached they serve 40-50 pages per second; cached they reach 66-75% of static throughput and survive database outages |
| A large client-side application with a big team | **Next.js, Angular or React Router** | You pay in JavaScript and server CPU; worth it when the app needs what they offer |

## Caveats

- One run per configuration (median of three Lighthouse and five interaction runs) on cloud VMs that share
  hardware with other tenants. Identical nginx builds spread by about 10% on the same route, so smaller
  differences are noise.
- Server mode is deliberately uncached. Real deployments of the Node frameworks would cache or prerender most
  pages, which moves them towards the static rows.
- Idle memory is taken five seconds after start; the ratings use memory after load, which is 3-5 times higher
  for the Node servers.
- Ghost cannot filter on the server, so its `/blog?q=&tag=` route serves the full list and passes 1,214 checks
  rather than the 1,257 of the other server targets.
- The implementations were written by AI coding agents against a strict contract. Effort is recorded, but it is
  not a measure of how long a person would take. See the [methodology](methodology.md).
