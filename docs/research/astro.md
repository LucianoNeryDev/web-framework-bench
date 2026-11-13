# Astro research

Researched 2026-11-13. All versions and counts are "as of 2026-11" unless dated otherwise.

## 1. Snapshot

| Item | Value |
|---|---|
| Current stable | `astro` 7.4.11, published 2026-11-11 ([npm registry](https://www.npmjs.com/package/astro), `dist-tags.latest`) |
| Current major | 7.0.0 published 2026-06-22 ([npm `time`](https://registry.npmjs.org/astro), [Astro 7 post](https://astro.build/blog/astro-7/)) |
| Pre-release tags | `beta` = 7.4.4-beta.0; `legacy` = 4.16.19 (npm dist-tags) |
| License | MIT (npm `license` field; the post below confirms "Astro stays open-source and MIT-licensed"). GitHub's API reports `NOASSERTION` for the repo because it holds several license files (inferred cause). |
| Engines | `node >=22.23.4` (from `astro@7.4.11` `package.json`) |
| Governance | The Astro Technology Company joined Cloudflare on 2026-01-16; all full-time employees became Cloudflare employees. The post says open governance and roadmap stay, Astro stays platform-agnostic and supports deployment targets beyond Cloudflare. No financial terms disclosed. ([Astro blog](https://astro.build/blog/joining-cloudflare/), [Cloudflare press release](https://www.businesswire.com/news/home/20260116386991/en/Cloudflare-Acquires-Astro-to-Accelerate-the-Future-of-High-Performance-Web-Development)) |
| Funding | Now corporate (Cloudflare). Per the Astro post, earlier paid hosted products such as Astro DB did not become a business; the Press release mentions an Astro Ecosystem Fund with Webflow, Netlify, Wix and Sentry (via [search summary](https://www.businesswire.com/news/home/20260116386991/en/Cloudflare-Acquires-Astro-to-Accelerate-the-Future-of-High-Performance-Web-Development); the Astro post itself does not mention the fund). |

Vendor-concentration note (inferred): a single vendor that also sells a hosting platform now employs the core team. The stated commitments are neutral, but the Cloudflare adapter gets the most invested work (see section 7).

## 2. Maintainability

### Release cadence and support policy

- Minor releases roughly every 3 to 4 weeks in 7.x: 7.1.0 2026-07-16, 7.2.0 2026-08-06, 7.3.0 2026-09-03, 7.4.0 2026-10-15; patches several times a week. 118 stable `astro` releases in the 12 months to 2026-11-13 (npm `time`).
- Majors: about every 3 to 9 months (5.0 2024-12-03, 6.0 2026-03-10, 7.0 2026-06-22).
- Support/LTS policy: not found. The v7 upgrade guide states no maintenance window for old majors ([v7 guide](https://docs.astro.build/en/guides/upgrade-to/v7/)). Observed behaviour from npm `time`: 6.x last released 2026-06-17 (6.4.8, a security fix for GHSA-vj59-8hwv-xxmv); 5.x last released 2026-05-26 (5.18.2); 4.x last released 2025-08-19 (4.16.19, tagged `legacy`). So old majors get security patches for roughly 3 months to a year after the next major (inferred, not a policy).

### Last three majors

| Major | Date | Main breaking changes | Tooling |
|---|---|---|---|
| 5.0 | 2024-12-03 | Vite 6; content config moved to `src/content.config.ts` with required loaders (Content Layer), `slug` became `id`; `output: 'hybrid'` removed (static + per-route `prerender = false`); `<script>` no longer hoisted; Squoosh and Lit removed; `security.checkOrigin` on by default; Actions form handling changed ([v5 guide](https://docs.astro.build/en/guides/upgrade-to/v5/)) | `npx @astrojs/upgrade` |
| 6.0 | 2026-03-10 | Node 18/20 dropped (Node 22.12+); Vite 7, Zod 4, Shiki 4; legacy content collections and `legacy.collections` removed; `<ViewTransitions/>`, `Astro.glob()`, CJS config removed; i18n `redirectToDefaultLocale` default false; default image service crops, never upscales; new Cloudflare adapter major; Pages unsupported ([v6 guide](https://docs.astro.build/en/guides/upgrade-to/v6/), [Astro 6 post](https://astro.build/blog/astro-6/)) | `npx @astrojs/upgrade`; a community Zod 3 to 4 codemod only (no Astro codemod) |
| 7.0 | 2026-06-22 | Vite 8 (Rolldown); Rust `.astro` compiler, stricter (unclosed tags are errors, no HTML auto-correct); Sätteri default Markdown/MDX processor, remark/rehype need `@astrojs/markdown-remark` + `unified()`; `compressHTML` default `'jsx'`; `src/fetch.ts` reserved; `@astrojs/db` removed; some `astro:transitions` internals removed ([v7 guide](https://docs.astro.build/en/guides/upgrade-to/v7/), [Astro 7 post](https://astro.build/blog/astro-7/)) | `npx @astrojs/upgrade`; no codemods mentioned |

Each major in the last 12 months needed manual work. A site on 4.x skipping to 7 would face about three rounds of this (content layer, Zod 4, Rust compiler). Content collections and Markdown are the main areas that move.

### Type safety

- TypeScript is first-class: `.astro` files are type-checked with `astro check` (package `@astrojs/check` 0.9.12 on npm); strict tsconfig presets ship with the template (the minimal template extends Astro's tsconfig; seen in the scaffold).
- Content collections are typed from Zod schemas (Zod 4 since Astro 6, per the v6 guide). Env vars can be typed via the `env` schema (moved to root config in 5.0).
- Types are generated into `.astro/types.d.ts` (v5 guide).

### Dependency tree of a fresh project (measured)

- Date: 2026-11-13. Node v26.8.1, npm 11.19.0, Linux.
- Command: `npm create astro@latest app -- --template minimal --no-git --install --yes --no-ai --skip-houston` (create-astro 5.3.1; installs `astro@7.4.11`, sole dependency).
- `npm ls --all --parseable | wc -l`: 186 lines (includes the root project, so 185 packages; duplicates by path counted).
- Unique package names: 183 names (from the same listing, after stripping paths; includes root, so 182) / `package-lock.json`: 267 package entries, 257 unique names, 267 unique name@version. The lockfile figure is the most reliable one, because it includes platform-optional native binaries for all targets (sharp, Rust compiler, rolldown, lightningcss).
- `du -sm node_modules`: 146 MB (155 top-level entries).
- Install time 41 s (including template copy), cold-ish npm cache. `npm audit`: 0 vulnerabilities. `npm run build` of the template: 1 page in about 5 s.
- Scratch directory deleted afterwards.

## 3. Analytics

- First-party analytics: none in the box. Astro does not ship an analytics module.
- `@astrojs/web-vitals` (Astro DB based) is deprecated on npm: "no longer maintained by Astro", moved to the StudioCMS organisation (`npm view @astrojs/web-vitals deprecated`; last publish 2025-09-18). `@astrojs/db` was deprecated in 6.4 and removed in 7.0 ([v7 guide](https://docs.astro.build/en/guides/upgrade-to/v7/), [npm deprecation notice](https://www.npmjs.com/package/@astrojs/db)).
- `@astrojs/partytown` 2.1.9 (published 2026-10-21) runs third-party scripts such as Google Analytics in a web worker ([docs](https://docs.astro.build/en/guides/integrations-guide/partytown/)). Third-party guides report it works poorly with `<ClientRouter />` and does not fire page_view automatically ([search summary](https://ricostacruz.com/posts/google-analytics-in-astro)). Not read in full: treat as unverified.
- `@astrojs/vercel` exposes a `webAnalytics` option (config type `VercelWebAnalyticsConfig` in the adapter source, [index.ts](https://github.com/withastro/astro/blob/main/packages/integrations/vercel/src/index.ts)); Vercel-only.
- Conventional approach: paste a script tag (Plausible, Umami, GA) in a layout, with `is:inline` or `data-astro-rerun` when using view transitions; or Cloudflare Web Analytics at the edge. "From the box": no. Needs a layout edit or a third-party package.
- Under the experimental CSP feature, external scripts need manual hashes ([CSP docs](https://docs.astro.build/en/reference/experimental-flags/csp/)).

## 4. Monitoring and observability

- OpenTelemetry: no built-in support. The roadmap issue [withastro/roadmap#1208 "Tracing hooks for Astro"](https://github.com/withastro/roadmap/issues/1208) (a core hook plus an `@astrojs/opentelemetry` integration) was still open at last update 2025-11-08. Practice is manual: start the OTel Node SDK with `node --import` before `dist/server/entry.mjs` (third-party how-to: [OneUptime](https://oneuptime.com/blog/post/2026-02-06-instrument-astro-applications-opentelemetry/view)); community packages such as `@astroscope/opentelemetry` exist (not evaluated).
- Logging: Astro 7 adds a stable configurable logger: JSON output via `logHandlers.json()` or `astro dev --json`, composable and custom handlers ([Astro 7 post](https://astro.build/blog/astro-7/)). The Node adapter logs via the Astro logger and can be silenced with `ASTRO_NODE_LOGGING=disabled` (adapter source [standalone.ts](https://github.com/withastro/astro/blob/main/packages/integrations/node/src/standalone.ts)).
- Instrumentation hooks: middleware (`defineMiddleware`) around every request; the integration API; Advanced Routing `src/fetch.ts` pipeline in 7.0 (Hono-compatible) for wrapping requests.
- Health checks: none built in. In dev, 7.x `astro dev --background` exposes `/_astro/status` ([Astro 7 post](https://astro.build/blog/astro-7/)). In production, add a `/healthz` endpoint route yourself (the benchmark spec does).
- Sentry: official `@sentry/astro` (11.12.0 on npm), added with `npx astro add @sentry/astro`; Astro 4.0.0+; errors, tracing, profiling (Node only), replay, feedback, logs and metrics. Docs say it works only on Node runtimes; Cloudflare Workers/Pages use a separate guide ([Sentry docs](https://docs.sentry.io/platforms/javascript/guides/astro/)). Weekly downloads 253,876.

## 5. Robustness and security

### Advisories (astro repo, published 2024-11 to 2026-11; source: [GitHub advisories for withastro/astro](https://github.com/withastro/astro/security/advisories), queried via API on 2026-11-13). 51 published since 2024-11 (the API list also includes one CI-workflow advisory); selected ones below. CVE IDs are as returned by the API (several 2026 IDs have six digits).

| GHSA / CVE | Sev. | Package | Issue | Published |
|---|---|---|---|---|
| GHSA-26w7-cxv4-gfx2 | critical (CVSS 9.8) | astro | RCE via libheif when optimizing a malicious AVIF; fixed 7.2.8 with Sharp 0.35.4 | 2026-08-27 |
| GHSA-vj59-8hwv-xxmv / CVE-2026-59731 | high (8.2) | astro 6.4.7 | Authorization bypass: decode iteration limit and rewrite path canonicalization mismatch; fixed 6.4.8 | 2026-07-01 |
| GHSA-2pvr-wf23-7pc7 / CVE-2026-54299 | high (7.5) | astro | Host-header SSRF in prerendered error page fetch; fixed 6.4.6 | 2026-06-12 |
| GHSA-8hv8-536x-4wqp / CVE-2026-50146 | high | astro | Reflected XSS via unescaped slot name | 2026-06-12 |
| GHSA-376h-93r7-7g6f / CVE-2026-84376 | medium | astro | Auth bypass: missing path-segment boundary when stripping `base` | 2026-08-27 |
| GHSA-m8p5-r7qv-cx4c | medium | @astrojs/node | Full-read SSRF in `/_image` via Host header; fixed 11.1.7 | 2026-10-12 |
| GHSA-qh8j-hqjv-7m4x / CVE-2026-102984 | low | @astrojs/node | Malformed port in Host header can crash the Node adapter | 2026-08-27 |
| GHSA-3rmj-9m5h-8fpv / CVE-2026-29772, GHSA-jm64-8m5q-4qh8 / CVE-2026-27729 | medium | @astrojs/node | Memory-exhaustion DoS: no body size limit for Server Islands and Actions | 2026-03 / 2026-02 |
| GHSA-qq67-mvv5-fw3g / CVE-2026-25545, GHSA-cj9f-h6r6-4cx2 / CVE-2026-27829 | medium | @astrojs/node | Host-header SSRF in error rendering; SSRF via remote image `inferSize` | 2026-02-23 |
| GHSA-c57f-mm3j-27q9 / CVE-2026-41322 | medium | @astrojs/node | Cache poisoning on malformed `If-Match` | 2026-04-20 |
| GHSA-qpr4-c339-7vq8 / CVE-2025-58179, GHSA-88gm-j2wx-58h6 / CVE-2026-41321 | high / low | @astrojs/cloudflare | SSRF via `/_image` and incomplete fix | 2025-09-04, 2026-04-20 |
| GHSA-ggxq-hp9w-j794 / CVE-2025-64765, GHSA-whqg-ppgf-wp8c / CVE-2025-66202 | medium | astro | Middleware auth checks on `url.pathname` bypassed with encoded values; bypass of that fix | 2025-11-19, 2025-12-06 |
| GHSA-wrwg-2hg8-v723 / CVE-2025-64764 | high | astro | Reflected XSS through server islands | 2025-11-19 |
| GHSA-5ff5-9fcw-vg88 / CVE-2025-61925 | medium | astro | `X-Forwarded-Host` reflected without validation | 2025-10-10 |
| GHSA-hr2q-hp5q-x767 / CVE-2025-64525 | medium | astro | Header manipulation bypasses path-based middleware; SSRF/cache poisoning | 2025-11-13 |
| GHSA-qcpr-679q-rhm2 / CVE-2025-59837, GHSA-xf8x-j4p2-f749 / CVE-2025-55303 | high | astro | `/_image` remote-domain validation bypasses (SSRF, XSS) | 2025-10-28, 2025-08-19 |
| GHSA-c4pw-33h3-35xw / CVE-2024-56140 | medium | astro | Bypass of `security.checkOrigin` CSRF middleware | 2024-12-18 |
| GHSA-49w6-73cw-chjr / CVE-2024-56159 | high | astro | Server source exposed when sourcemaps enabled | 2024-12-19 |
| GHSA-8mv7-9c27-98vc / CVE-2026-73423 | low | astro | `astro/hono` pipeline bypasses `checkOrigin` when `middleware()` missing or misordered | 2026-07-17 |

Pattern (inferred from the list): recurring classes are Host/X-Forwarded-Host handling, `/_image` SSRF, path normalisation vs middleware auth, and XSS from unescaped names/slots/directives. About 26 advisories were published in the 2026-05 to 2026-11 window alone, mostly low or medium. The most severe recent one is an upstream native library (libheif via Sharp).

Dev-server/Vite: Astro has its own dev-server advisories (GHSA-x3h8-62x9-952g local file read, GHSA-w2vj-39qv-7vh7 XSS on dev error page, both 2025-11). Vite advisories were not checked separately: not found.

### Default protections

- `security.checkOrigin` (CSRF origin check for form-like POSTs) is on by default since 5.0 ([v5 guide](https://docs.astro.build/en/guides/upgrade-to/v5/)); it has had a bypass (CVE-2024-56140 above).
- Template expressions are HTML-escaped by default; `set:html` is the opt-out. Several escaping gaps were advisories (slot names, spread attributes, dynamic tag names).
- CSP: `security.csp` is stable since 6.0, generates hashes for scripts and styles into a `<meta>` tag; not supported with `<ClientRouter />`, Shiki, or in dev; no response-header form in the docs read (meta tag only) ([CSP docs](https://docs.astro.build/en/reference/experimental-flags/csp/)). The "experimental" label no longer applies.
- No built-in security-headers helper beyond CSP; static header files are adapter/host specific (not found otherwise).
- Image optimisation requires `image.domains` / `image.remotePatterns` for remote sources ([images guide](https://docs.astro.build/en/guides/images/)).

### Production server behaviour (`@astrojs/node`, standalone)

- Standalone mode serves `dist/client` (hashed `_astro/` assets get one-year immutable cache) and renders on-demand routes; `HOST`/`PORT` env vars; optional HTTPS via `SERVER_CERT_PATH`/`SERVER_KEY_PATH`; `bodySizeLimit` default 1 GB ([Node adapter docs](https://docs.astro.build/en/guides/integrations-guide/node/)).
- Graceful shutdown: no SIGTERM/SIGINT handler found in the adapter's `standalone.ts`/`server.ts` (read on 2026-11-13 from the main branch, [source](https://github.com/withastro/astro/tree/main/packages/integrations/node/src)). A server handle with `stop()` (uses `server-destroy`) exists for programmatic use, so draining on SIGTERM is left to the operator or a wrapper (inferred). The docs page does not mention shutdown.
- Uncaught errors: render errors in a request return the 500 page; a process-wide `unhandledRejection` listener logs the error with the request URL, and outside a request context sets `process.exitCode = 1` ([serve-app.ts](https://github.com/withastro/astro/blob/main/packages/integrations/node/src/serve-app.ts)). A related open bug: [withastro/astro#18624](https://github.com/withastro/astro/issues/18624) says in-request rejections are logged twice and set exit code 1 (open 2026-11-05).
- Request timeouts: none configured by Astro; Node `http.Server` defaults apply (inferred; not documented).
- Malformed URLs (`decodeURI` failure) return 400 in the adapter handler (same `standalone.ts`).

## 6. Development effort

- Learning curve (inferred): low for HTML/JSX-literate developers: `.astro` files are HTML with a frontmatter script, file-based routing, zero JS by default. Server Islands, Actions, sessions, live collections and Advanced Routing add concepts.
- Documentation: extensive official docs with per-major upgrade guides and a migration-first structure ([docs](https://docs.astro.build/)). Docs for older majors are kept as snapshots (e.g. an unmaintained v6 snapshot is linked from the v7 guide).
- DX: Vite HMR; TypeScript; `astro check`; dev toolbar with an Audit app for accessibility/performance checks (dev only, [docs](https://docs.astro.build/en/guides/dev-toolbar/)); Astro 6 runs the production runtime (workerd for Cloudflare) in dev via Vite's Environment API ([Astro 6 post](https://astro.build/blog/astro-6/)); Astro 7 adds `astro dev --background` for agents.
- Community: 63,946 GitHub stars ([API](https://api.github.com/repos/withastro/astro), 2026-11-13). npm weekly downloads (week 2026-11-06 to 2026-11-12, [npm API](https://api.npmjs.org/downloads/point/last-week/astro)): `astro` 11.68M; `@astrojs/sitemap` 5.58M; `@astrojs/cloudflare` 1.62M; `@astrojs/node` 1.44M; `@astrojs/rss` 1.20M; `@sentry/astro` 0.25M.
- State of JS 2025: Astro holds the top satisfaction ranking among meta-frameworks, and Next.js is 39 points behind it ([2025.stateofjs.com](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/)). The page text did not expose Astro's usage or retention percentages: not found. Third-party blogs quote ~29% usage; unverified, not used.
- Hiring pool: inferred as large for a content-site framework, smaller than React/Next.js. Skills transfer from any component framework since Astro hosts React, Vue, Svelte, Solid islands.

## 7. Hosting and operations

- Static: default `output: 'static'`; the result is a folder deployable anywhere.
- Server: adapters `@astrojs/node` 11.1.12 (standalone or middleware mode), `@astrojs/cloudflare` 14.4.7, `@astrojs/vercel` 11.0.21, `@astrojs/netlify` 8.2.13 (npm, 2026-11). Hybrid in one project: static by default with `export const prerender = false` per route (since 5.0).
- Node adapter peer: `astro ^7.2.1`; Cloudflare adapter peers `astro ^7.4.0`, `wrangler ^4.125.0` (npm `peerDependencies`). Adapters are versioned with core, so a core major forces an adapter major.
- Cloudflare: the Astro 6+ adapter "no longer supports deployment on Cloudflare Pages"; use Workers with static assets. Prerendered pages run in workerd by default; default image service uses the Images binding; sessions use Workers KV; `nodejs_compat` is needed for `node:*` ([adapter docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)). Cloudflare's own direction is Workers with Static Assets for new projects, and Pages keeps working: I found no official Pages sunset date ([Cloudflare migration guide](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)). For a static build, plain Pages or Workers assets both work (inferred).
- Memory footprint guidance: not found in Astro docs. Measure it in the benchmark.
- Vendor coupling: low for code (platform-agnostic adapters); but the owning company is Cloudflare, and some features are adapter-specific (KV sessions, Images binding, Vercel `webAnalytics`). Route caching providers for Netlify, Vercel and Cloudflare are experimental in 7.0 ([Astro 7 post](https://astro.build/blog/astro-7/)).

## 8. Other

- i18n: built in routing (folders, `prefixDefaultLocale`, `manual` mode), fallback (redirect/rewrite), per-locale domains for SSR, `astro:i18n` URL helpers, middleware helpers, preferred-locale detection. No translation-string management ([i18n guide](https://docs.astro.build/en/guides/internationalization/)).
- SEO: `@astrojs/sitemap` 3.7.4 (depends on `sitemap ^9`, `zod ^4`), `@astrojs/rss` 4.0.19 (had an XML-injection advisory GHSA-8j5q-mfj2-5q9q, 2026-07). Meta tags are hand-written in layouts (no head manager built in).
- Images: `astro:assets` with `<Image/>` and `<Picture/>`, Sharp default service, responsive `layout` prop generating srcset/sizes, SVG components, remote allow-lists, a cache in `node_modules/.astro` ([images guide](https://docs.astro.build/en/guides/images/)). A Fonts API (self-hosted, preload hints) is stable since 6.0.
- Content tooling: Content Layer collections (`glob`/`file` loaders and custom loaders, Zod-typed), live collections stable since 6.0; Markdown/MDX processed by Sätteri by default since 7.0 (remark/rehype optional).
- Accessibility tooling: dev toolbar Audit app (dev-only, not a replacement for Pa11y/Lighthouse). `<Image/>` requires `alt`. Nothing for production a11y checks.

## Gaps

- Support/LTS policy for older majors: no statement found.
- Production graceful-shutdown behaviour inferred from source reading, not by running a test; the benchmark's robustness test should confirm it.
- Astro State of JS usage and retention numbers: not exposed on the fetched page.
- Vite core advisories relevant to Astro: not checked.
- Ecosystem Fund detail comes from a search summary of the press release, not read directly.
