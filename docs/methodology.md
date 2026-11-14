# Methodology

Every target builds the same site ([contract](site-spec.md)) and must pass the
[conformance check](../bench/conformance.mjs) before it is measured. The harness
([`bench/run.mjs`](../bench/run.mjs)) then runs each target through the same phases. Raw results land in
`results/raw/<target>/<phase>.json`; [`bench/report.mjs`](../bench/report.mjs) aggregates them.

## Hardware and isolation

- One machine: Intel Core i7-4790S (4 cores, 8 threads, 3.2-4.0 GHz), 16 GB RAM, Debian 13, Docker 26. It
  is a shared home server: a CI runner and two idle databases kept running, so expect some noise.
- **The target gets two physical cores and 1 GiB per container** (`--cpuset-cpus 0,1 --memory 1g`). The
  SMT siblings of those cores (logical CPUs 4 and 5) stay idle, so nothing competes with the target through
  hyperthreading. Multi-container
  targets (a CMS with its database, PHP-FPM behind nginx) keep the same per-container limits and share the
  same two cores. That is how a small VPS runs them.
- **Clients run on the other two physical cores** (logical CPUs 2, 3, 6, 7): the load generator, the edge
  proxy, Chromium and the harness itself (`taskset`). Load and target never share a physical core.
- The load generator ([oha](https://github.com/hatoo/oha)) runs in a container on a dedicated Docker network
  and talks to the target directly, without compression. That measures the framework, not gzip.
- Browser measurements go through an **edge proxy**: one nginx with identical gzip settings in front of every
  target, standing in for a CDN, so no target wins or loses on its own compression defaults.

## Modes

| Mode | What it measures |
|---|---|
| `static` | Prerendered HTML on the shared nginx config. Server numbers are nginx numbers; the interesting differences are build cost, output size and what the browser has to download and run. |
| `server` | Every page rendered on each request, with no HTML or data cache. This is the cost of the rendering engine. |
| `cached` | CMS targets with the page cache their production setups normally use (nginx fastcgi/proxy cache). |

Server mode is deliberately the worst case for frameworks that would normally prerender or cache. The static
mode of the same framework shows the other end.

## Phases

### Build
Cold `docker build --no-cache` with base images already pulled: total time, plus the dependency-install and
build steps split out from BuildKit's step timings. Final image size (all images of a multi-container target)
and, for static targets, the output size and JavaScript in the output, excluding the shared assets.

### Server load
For each route (`/`, `/blog`, one post, `/blog?q=the&tag=go`, a 404) at 10 and 100 concurrent connections,
20 s each after a 5 s warm-up: requests per second, latency percentiles (p50, p90, p99), errors and non-2xx
responses, plus CPU (cores used) and memory (peak and average) of the target's containers from cgroup v2.
Also: **cold start** (container start to first 200 on `/`), **restart** (container restart to first 200) and
**idle memory**.

### Lighthouse
Lighthouse (mobile form factor, default simulated throttling) on `/`, `/blog` and a post, three runs each,
median reported: performance score, FCP, LCP, TBT, CLS, Speed Index, transferred bytes by type, script
boot-up time, main-thread work, DOM size, and the accessibility, best-practices and SEO scores.

### Interaction
Playwright Chromium on a phone profile (412 x 823, 4x CPU slowdown, 150 ms RTT, 1.6 Mbps down), five runs,
median:
- **Filter ready**: time from navigation start until clicking the "Go" chip actually filters the list. It
  captures how long hydration (or resumption, or plain script loading) leaves the page unresponsive.
- **INP proxy**: the slowest interaction of a scripted session (typing a search, clicking chips, toggling
  the theme), from the Event Timing API.
- Script bytes and count as the browser saw them.

### Robustness
- **Hostile and malformed requests**: path traversal, null bytes, invalid UTF-8, a reflected-XSS query,
  array parameters, 6 KB queries, 9 KB paths, a 16 KB cookie, unusual methods, and requests for `.env`,
  `.git/config`, `package.json`, `composer.json` and `server.js`. Any 5xx, reflected script or exposed file
  is a finding.
- **Overload**: 1,000 concurrent connections for 15 s on a post page: success rate, tail latency, and whether
  the target still answers afterwards.
- **Soak**: 50 connections over every page for 3 minutes: errors and memory growth.
- **Crash recovery**: `SIGKILL` the application container, start it again, time to the first 200.
- **Database outage** (CMS targets): what visitors get while the database is down, and whether the site
  recovers on its own when it comes back.

### Code and dependencies
Non-blank hand-written source lines (git-tracked files, excluding lockfiles, vendored minified files and
notes), direct and transitive dependency counts from the lockfiles, `npm audit` of production dependencies,
and a [Trivy](https://trivy.dev) scan of every image (HIGH and CRITICAL, OS packages and language packages
separately).

## Qualitative dimensions

Maintainability, analytics, monitoring, security history, development effort, hosting and editorial
experience cannot be load-tested. They are researched from primary sources in [`docs/research/`](research/),
with a link for every claim, and combined with what the implementation notes (`apps/*/NOTES.md`) recorded:
versions, deviations, friction and effort.

### Development effort, honestly
The targets were implemented by AI coding agents working from the same brief. Their wall-clock time and
number of build-check-fix iterations are recorded, but they measure how hard each framework was to get right
against a strict contract, not how long a person would take. Source size, dependency count, friction notes
and the researched learning curve carry more weight in the effort rating than agent time.

## Threats to validity

- One machine, one run per configuration (three to five for browser metrics). Differences under about 10%
  are noise.
- Two cores and one Node process: Node servers use one core by design, while Go, nginx and PHP-FPM use both.
  That is each runtime's documented default, and it is what you get on a small VPS. A clustered Node
  deployment would close part of the gap.
- Server mode disables caches that real deployments would enable. Read it as engine cost, not as the
  performance of a tuned production site.
- The site is small and content-heavy. Applications with heavy client state would favour different stacks.
