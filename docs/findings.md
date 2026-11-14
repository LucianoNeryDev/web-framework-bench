# Findings

What the numbers in [results](results.md) mean, combined with the [research notes](research/) and what the
implementations ran into (`apps/*/NOTES.md`). Measured on two Google Cloud VMs: the target on an
`n2-standard-2` (2 vCPU, 8 GB), clients on a separate `n2-standard-4`. See the [methodology](methodology.md).

## In short

1. **For a content site, prerender.** Every static build, from hand-written HTML to Next.js, served the same
   ~17,000-18,000 requests per second on a 2-vCPU VPS with 3 MB of server memory. Once the HTML is a file, the
   framework only decides what the *browser* has to download and run.
2. **What the browser gets differs a lot.** For the same blog page: Astro 0 KB of JavaScript, the vanilla
   island 1.2 KB, htmx 18 KB, SvelteKit and Qwik ~44 KB, Nuxt 86 KB, Angular 97 KB, React Router 119 KB,
   Next.js 140 KB. On a throttled phone the blog filter responds after 0.55 s with no framework (Astro, Go, the vanilla island), about 1 s with Qwik, htmx and SvelteKit, 1.4 s with Angular and Nuxt, and 1.6-1.8 s with React Router and Next.js.
3. **Rendering per request costs between 0.5 and 37 ms of CPU per page.** Go renders a post in 0.54 ms of
   CPU, Astro 0.71, SvelteKit 1.3, React Router 2.4, Nuxt 5.1, Qwik 6.1, Next.js 8.0, Octane 9.2, Angular 11,
   Laravel on PHP-FPM 13, Ghost 30 and WordPress 37.5. On two vCPUs that is the difference between 3,400 and
   50 pages per second.
4. **Node servers use one thread.** Every Node SSR target topped out at 1.1-1.5 of the 2 vCPUs, while Go, nginx
   and PHP used both. A second Node process (or more cores) would roughly double them; the numbers here are the
   documented single-process defaults.
5. **A page cache turns a CMS into a static site.** WordPress went from 50 to 13,800 posts per second and Ghost
   from 42 to 12,100 behind an nginx cache, and both kept serving cached pages while their database was down.
   Without the cache, 1,000 concurrent visitors got errors for 71% of requests.
6. **Robustness gaps were specific, not general.** No target reflected the XSS probe or exposed source or
   secrets. Angular SSR and Qwik SSR answered a malformed URL with a 500. Astro, Angular and Qwik SSR ignore
   `SIGTERM`, so every restart waits for Docker's 10-second kill. Under 1,000 concurrent connections only Go,
   Laravel Octane, the static builds and the cached CMSs kept a 100% success rate.

## Per-stack verdicts

Ratings are 1 (poor) to 5 (excellent) within this comparison. Performance and resource ratings come from the
measurements; the others from the research notes (linked) and the implementations. "Static" rows describe the
prerendered build, "server" rows the per-request build.

| Stack | Server cost | Browser weight | Resources | Robustness | Maintainability | Security record | Monitoring | Analytics | Effort | Hosting | Editors |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HTML + nginx | 5 | 5 | 5 | 5 | 3 | 5 | 2 | 1 | 2 | 5 | 1 |
| Hugo | 5 | 5 | 5 | 5 | 3 | 5 | 2 | 2 | 4 | 5 | 2 |
| Astro | 5 static / 4 server | 5 | 5 / 4 | 5 / 3 | 3 | 2 | 2 | 2 | 5 | 5 / 3 | 2 |
| SvelteKit | 5 / 4 | 4 | 5 / 4 | 5 / 4 | 3 | 4 | 4 | 2 | 4 | 5 / 3 | 2 |
| Nuxt | 5 / 2 | 3 | 5 / 3 | 5 / 3 | 3 | 2 | 2 | 3 | 3 | 5 / 3 | 2 |
| Next.js | 5 / 1 | 2 | 5 / 3 | 5 / 2 | 3 | 1 | 4 | 3 | 2 | 5 / 2 | 2 |
| React Router | 5 / 3 | 2 | 5 / 3 | 5 / 3 | 3 | 3 | 3 | 1 | 3 | 5 / 3 | 1 |
| Angular | 5 / 1 | 3 | 5 / 3 | 5 / 2 | 4 | 2 | 2 | 1 | 2 | 5 / 3 | 1 |
| Qwik City | 5 / 2 | 4 | 5 / 3 | 5 / 2 | 2 | 1 | 1 | 1 | 2 | 5 / 3 | 1 |
| Go (+ htmx) | 4 | 5 (4 with htmx) | 5 | 5 | 5 | 4 | 4 | 1 | 3 | 4 | 1 |
| Laravel | 2 (Octane 2) | 5 | 4 (Octane 3) | 4 (Octane 5) | 4 | 4 | 5 | 1 | 3 | 3 | 1 |
| WordPress | 1 (cached 5) | 5 | 2 | 1 (cached 4) | 3 | 2 | 2 | 3 | 3 | 2 | 5 |
| Ghost | 1 (cached 5) | 5 | 1 | 1 (cached 4) | 2 | 1 | 2 | 4 | 2 | 2 | 5 |

How to read the qualitative columns:

- **Maintainability**: support windows, how often majors break things, and dependency footprint. Go (Go 1
  compatibility, standard library only) and Angular and Laravel (published yearly majors with 18-24 months of
  fixes) score highest. Qwik (v2 stuck in release candidate for about 16 months) and Ghost ("run the latest
  release" is the only policy) lowest. Hand-written HTML has no dependencies but repeats the layout in every
  file: 5,180 lines against Hugo's 243 for the same site. See [research](research/).
- **Security record**: advisories in the last two years for the runtime that serves requests. Static output
  carries none of the framework's server advisories, so the static rows of the meta-frameworks are effectively
  5. Next.js (66 advisories including a CVSS 10 RCE in React Server Components), Qwik (31, including an
  unauthenticated RCE) and Ghost (70 in 2026, including critical SQL injection) score lowest. The Trivy scans
  agree: the Ghost image carries 133 HIGH and 4 CRITICAL findings, WordPress 25 and 1, Go none.
- **Monitoring**: what exists first-party. Laravel (Pulse, Telescope, Nightwatch), Go (pprof, expvar, slog,
  stable OpenTelemetry), Next.js (built-in OpenTelemetry spans) and SvelteKit 3 (built-in tracing) score high.
- **Analytics**: nothing is truly from the box. Ghost has native analytics (self-hosted via Tinybird),
  WordPress and Next.js have first-party plugins or packages; everywhere else it is a script tag.
- **Effort**: hand-written lines, framework friction recorded while building the same site, and the
  researched learning curve. Astro needed no deviations from the contract and the fewest framework lines.
  Next.js needed a rewrite to return a correct 404 from a dynamic page; Nuxt needed an undocumented
  experimental flag for a real `404.html`; Ghost needed nginx to hide trailing slashes and generated theme
  data for fields it lacks.
- **Hosting**: static output runs on any CDN (Cloudflare Pages, for one). A Go binary is a 22 MB image. Node
  SSR needs a Node process; WordPress and Ghost need a database, backups and timely updates.
- **Editors**: only WordPress and Ghost give non-developers an editor out of the box.

## What to pick

| If you are building | Pick | Why |
|---|---|---|
| A developer hub or blog with a few interactive islands | **Astro** (Vue or React islands where needed) or the framework you know in **static** mode | Same server cost for every static build; Astro ships the least JavaScript and needed the least code |
| A Vue site that needs app-like client navigation | **Nuxt, prerendered** | Full Vue ecosystem; prerendering removes its server cost entirely |
| Pages that must be rendered per request on a small VPS | **Go** (with htmx for interactivity), **Astro SSR** or **SvelteKit** | 3.5-28x the throughput of the other SSR stacks on the same two vCPUs |
| A PHP application | **Laravel**, on Octane if throughput matters | First-party monitoring, predictable releases; Octane adds 45% throughput and 100% success under overload |
| A site non-developers edit | **WordPress or Ghost, always behind a page cache** | Uncached they serve 40-50 pages per second and collapse under load; cached they match static output |
| A large client-side application with a big team | **Next.js, Angular or React Router** | You pay for it in JavaScript and server CPU; worth it only when the app needs what they offer |

## Caveats

- One run per configuration (median of three Lighthouse and five interaction runs). Cloud VMs share
  hardware with other tenants; differences under about 10% are noise.
- Server mode is deliberately uncached. Real deployments of the Node frameworks would cache or prerender most
  pages, which moves them to the static rows.
- The implementations were written by AI coding agents against a strict contract; effort is recorded, but it
  is not a measure of how long a person would take. See the [methodology](methodology.md).
