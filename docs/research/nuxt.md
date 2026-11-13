# Nuxt (Vue)

Researched 2026-11-13. All version numbers and counts are "as of 2026-11-13" unless dated otherwise. Sources are primary (npm registry, GitHub advisories, official docs); "inferred" marks my own conclusions.

## 1. Snapshot

| Item | Value |
|---|---|
| Stable | `nuxt@4.6.4`, published 2026-11-02 ([npm registry](https://registry.npmjs.org/nuxt)); dist-tags `latest` 4.6.4, `3x` 3.21.11 (2026-08-05) |
| Next major | Nuxt 5 not released; npm has no 5.x. It is "in development" and previewable with `future.compatibilityVersion: 5` ([upgrade guide](https://nuxt.com/docs/4.x/getting-started/upgrade)) |
| Server runtime | Nuxt 4.6.4 depends on `nitropack@^2.13.6` (Nitro v2) and `h3@^1.15.11` through `@nuxt/nitro-server` ([npm](https://registry.npmjs.org/@nuxt/nitro-server/4.6.4)). Nitro v3 is `3.0.261103-rc` (release candidate, 2026-11-03) and h3 v2 is `2.0.8` (`latest` on npm, 2026-10-22) but Nuxt does not use them until Nuxt 5 ([Nuxt 4.6 post](https://nuxt.com/blog/v4-6)) |
| License | MIT (`nuxt`, `nitropack`, `nitro`, `h3`; npm registry) |
| Governance | NuxtLabs (creator and steward of Nuxt and Nitro) was acquired by Vercel, announced 2025-07-08. Vercel says Nuxt and Nitro stay MIT, keep open governance and a public roadmap, and the open source team moves to Vercel; Nuxt UI Pro, Studio MDC and NuxtHub Admin become free ([Vercel blog](https://vercel.com/blog/nuxtlabs-joins-vercel)). Nuxt UI Pro was merged into the free Nuxt UI v4 on 2025-09-22 ([Nuxt blog index](https://nuxt.com/blog)) |
| Repo | [nuxt/nuxt](https://github.com/nuxt/nuxt): 61,065 stars, about 420 contributors (GitHub API, 2026-11-13) |

Vendor concentration is the main governance fact: the core team is employed by the company that also sells the main competing host (inferred). No sign in the sources of any licence or deployment-target change.

## 2. Maintainability

**Cadence.** Per the roadmap: semver, a major yearly, minors roughly monthly, patches roughly weekly ([roadmap](https://nuxt.com/docs/3.x/community/roadmap)). Observed on npm: 4.0.0 2025-07-15, 4.1 2025-09-02, 4.2 2025-10-25, 4.3 2026-01-22, 4.4 2026-03-12, 4.5 2026-07-18, 4.6 2026-10-05, then 4.6.1 to 4.6.4 within 4 weeks. Minors have slowed from monthly to every 2 to 4 months in 2026 (inferred from npm `time`).

**Support policy.** "Minimum of six months after the release of the next major". Nuxt 4 EOL is "6 months after 5.x release" (not yet dated) ([roadmap](https://nuxt.com/docs/3.x/community/roadmap)). The 4.x roadmap table once estimated Nuxt 5 for Q1 2026; that slipped, and no new date was found.

| Major | Released (npm) | EOL | What broke / migration |
|---|---|---|---|
| Nuxt 2 | 2.0.0 2018-09-21 | 2024-06-30 ([Nuxt blog](https://nuxt.com/blog/nuxt2-eol)) | n/a here |
| Nuxt 3 | 3.0.0 2022-11-16 | 2026-07-31, extended from 2026-01-31 (original date in [v4 post](https://nuxt.com/blog/v4); extension in [Nuxt 3 docs](https://nuxt.com/docs/3.x/migration/overview)). Already past EOL | Rewrite from Nuxt 2: Vue 3, Nitro, Vite, new composition API. Migration guide, partial Bridge package |
| Nuxt 4 | 4.0.0 2025-07-15 (roadmap says 07-16) | 6 months after Nuxt 5 | Mild major: `app/` source dir (v3 layout still detected), `useAsyncData`/`useFetch` changes (shallow `data`, `undefined` defaults, shared refs per key), Unhead v2, `window.__NUXT__` removed, top-level `generate` config removed, `noUncheckedIndexedAccess` on, TS project references ([upgrade guide](https://nuxt.com/docs/4.x/getting-started/upgrade)) |

**Tooling.** `npx nuxt upgrade --dedupe` plus Codemod recipe `npx codemod@0.18.7 nuxt/4/migration-recipe` (version pinned for a known codemod issue) ([v4 post](https://nuxt.com/blog/v4), [upgrade guide](https://nuxt.com/docs/4.x/getting-started/upgrade)). Most breaking changes have flags to restore old behaviour. Nuxt 4.6 added `nuxt/server` so server code runs unchanged on Nitro v2, v3 or the experimental `@nuxt/vite-server` ([4.6 post](https://nuxt.com/blog/v4-6)); this is the stated path to Nuxt 5 (Nitro v3 + h3 v2; server auto-imports become opt-in).

**Churn risk (inferred).** The toolchain moved fast: Nuxt 4.4 brought vue-router v5, 4.5 Vite 8 and Rspack 2/Rsbuild, 4.6 Nuxt CLI v4 ([blog index](https://nuxt.com/blog)). Nuxt 4.6.4 requires Node `^22.22.3 || ^24.15.0 || >=26` and `rolldown ~1.2.1` as a peer ([npm](https://registry.npmjs.org/nuxt/4.6.4)); Node 20 and 22 older than 22.22.3 are out.

**Type safety.** TypeScript-first. Nuxt generates `.nuxt/tsconfig.{app,server,shared,node}.json` and root `tsconfig.json` uses `references`; check with `vue-tsc -b --noEmit`. Typed `$fetch` rebuilt in 4.6 ([upgrade guide](https://nuxt.com/docs/4.x/getting-started/upgrade), [4.6 post](https://nuxt.com/blog/v4-6)).

**Dependency tree (measured).** 2026-11-13, Node v26.8.1, npm 11.19.0, Linux. Commands in `/var/tmp/wfb-research/nuxt-scratch`:
`npm create nuxt@latest -- app --no-gitInit --no-install --packageManager=npm --template=minimal` (create-nuxt 4.0.3, no modules, no git), then `npm install` (3m31s wall, network bound). Resolved: nuxt 4.6.4, vue 3.5.45, vue-router 5.4.0, vite 8.3.8, rolldown 1.2.19, nitropack 2.13.6, h3 1.15.11. The template's `package.json` lists only `nuxt`, `vue`, `vue-router`.

| Metric | Value |
|---|---|
| `npm ls --all --parseable \| wc -l` | 519 entries (includes the root) |
| Unique package names among those paths | 453 |
| `du -sm node_modules` | 195 MB |
| Top-level dirs in `node_modules` | 377 |
| `npm audit` at install time | 12 (6 low, 6 moderate, 0 high/critical); all transitive via `nitropack` (`glob`, `minimatch`, `deepmerge`, `@vercel/nft`) |

`npm ls --all --json` counted 590 unique names (635 name@version), higher than 453, probably because it lists uninstalled optional platform packages (inferred). Scratch dir deleted afterwards. `@nuxt/telemetry` and `@nuxt/devtools` are in the default install.

## 3. Analytics

- Not from the box. There is no first-party visitor analytics. `@nuxt/telemetry` (a dependency of `nuxt`) collects anonymous CLI/build usage (commands, versions, OS, build durations, module list), not site-visitor data, and can be disabled with `telemetry: false` ([nuxt/telemetry README](https://github.com/nuxt/telemetry)).
- Official-ish route: [Nuxt Scripts](https://scripts.nuxt.com/docs/getting-started) (`@nuxt/scripts` 1.3.12, in the `nuxt` GitHub org, 372k weekly downloads). Its registry has entries for Cloudflare Web Analytics, Plausible, Umami, Fathom, Google Analytics, Matomo, PostHog, Clarity, Segment and Vercel Analytics ([source tree](https://github.com/nuxt/scripts/tree/main/packages/script/src/runtime/registry)). Third-party loading with timing and privacy controls.
- Conventional approach: Nuxt Scripts or a community module (nuxt-gtag and similar; not verified here), or a plain `<script>` via `useHead`. Server-side/log-based analytics via Nitro plugin is also possible (inferred).

## 4. Monitoring and observability

- **OpenTelemetry: manual on the Nuxt 4 default.** `nitropack@2.13.6` contains no `tracingChannel` or `opentelemetry` code (grepped the package, 2026-11-13). Nitro v3 docs describe built-in tracing via Node diagnostics channels (`tracingChannel: true` instruments h3, srvx, unstorage, db0; "no OpenTelemetry SDK required"; `experimental.tracingLogger`) ([Nitro tracing](https://nitro.build/docs/tracing)), which arrives for Nuxt users with Nuxt 5 (inferred). Today: community modules (`@scayle/nuxt-opentelemetry`, `nitro-opentelemetry`, `@hannoeru/nuxt-otel`; per [search results](https://www.pkgstats.com/pkg:nitro-opentelemetry)) or manual init in a Nitro plugin, not in `nuxt.config` ([Axiom guide](https://axiom.co/docs/guides/opentelemetry-nuxtjs), 2026-01). No official Nuxt OTel module found.
- **Sentry: official SDK `@sentry/nuxt`** (11.12.0, 2026-11-10; 419k weekly). Docs: Nuxt 3.7+ (3.14+ recommended); server config bundled into the Nitro build; server install options are `--import` flag (default), limited tracing, dynamic import (experimental) ([Sentry Nuxt docs](https://docs.sentry.io/platforms/javascript/guides/nuxt/)). Sentry's own tracing needs no OTel pipeline by default but can ingest OTel spans ([Sentry OTel page](https://docs.sentry.io/platforms/javascript/guides/nuxt/opentelemetry/), shown for v10.x docs). Cloudflare support for Nuxt in Sentry: not verified (the guessed Nuxt/Cloudflare page 404ed).
- **Logging:** consola in the toolchain; Nuxt CLI v4 adds per-request IDs to dev logs ([4.6 post](https://nuxt.com/blog/v4-6)). No structured production request logger built in (inferred).
- **Health checks:** none built in (inferred); a `server/routes/healthz.get.ts` handler is trivial.
- **Dev tooling:** Nuxt DevTools v4 released 2026-10-28 ([blog index](https://nuxt.com/blog)).

## 5. Robustness and security

**Advisories, 2024-11 to 2026-11** (GitHub advisory DB via `gh api`, 2026-11-13; severity is GHSA-assigned).

| Package | Count | Notable |
|---|---|---|
| `nuxt` and its sub-packages ([nuxt/nuxt](https://github.com/nuxt/nuxt/security/advisories)) | 41: 1 critical, 7 high, 21 medium, 12 low | see below |
| `nitropack` / `nitro` ([nitrojs/nitro](https://github.com/nitrojs/nitro/security/advisories)) | 6, all medium | open redirect in wildcard `redirect` route rules (CVE-2026-44372, GHSA-pqxc-r4h5-jc95), proxy scope bypass (CVE-2026-44373, GHSA-rhhp-7488-3qwf), cached handlers sharing entries or replaying `Set-Cookie` (GHSA-39r7-wfcx-99xg, fixed 2.13.6), middleware skipped for `cache`/`swr` routes on Nitro 3 beta (GHSA-g68v-xwhh-ccp5) |
| `h3` ([h3js/h3](https://github.com/h3js/h3/security/advisories)) | 11 (3 high) | h1: request smuggling TE.TE (CVE-2026-23527, high, <=1.15.4), `serveStatic` double-decoding traversal (GHSA-72gr-qfp7-vwhw, <=1.15.8). h2 (rc era): SSE injection (CVE-2026-33128, high), middleware bypass (CVE-2026-33131, high). Nuxt 4.6.4 uses h3 1.15.11, past the h1 fixes |
| Vite dev server ([vitejs/vite](https://github.com/vitejs/vite/security/advisories)) | 18 since 2025-01 | critical RCE via `__vite-browser-external` virtual module, GHSA-p4f5-76q4-ffq7, 2026-11-10, only when the dev server is exposed with `--host`; many `server.fs.deny` bypasses (e.g. CVE-2025-30208, CVE-2026-39363, high). Dev-only; a production Nuxt server does not run Vite |
| `@nuxt/image` | 1 high | unauthenticated command execution via default `/_ipx` route (GHSA-p5vf-pjf5-ggj3, 2026-10-30; fixed 2.2.1 and 1.11.2) ([advisory](https://github.com/nuxt/image/security/advisories)) |
| `@nuxt/content` | 3 high | unauthenticated SQL injection / DoS / cross-table reads on `/__nuxt_content/:collection/query` (CVE-2026-102650 and two GHSAs, 2026-10-21; fixed 3.15.2) ([advisory](https://github.com/nuxt/content/security/advisories)) |
| `@sentry/nuxt` | 1 low | ContextLines DoS, <8.49.0 (2025-01) |

Nuxt advisories that matter for a production server: RCE via island props, CVE-2026-71320 (high, fixed 4.5.1/3.21.10); cross-user SSR payload disclosure with cached routes, CVE-2026-71316 (high, 4.4.0 to 4.5.0 only); unauthenticated island DoS, CVE-2026-71321 and CVE-2026-71314 (high); DoS via payload cache poisoning, CVE-2025-27415 (high, <3.16.0). A repeating class: route rules and middleware bypass through path normalisation (case, `%2F`, dot segments, leading `//`): CVE-2026-53721 (high), CVE-2026-71315 (high), CVE-2026-114131/114132/119200 and GHSA-f3x9-2chm-73c8, GHSA-r99w-jh2x-3mg9 (medium), several fixed in "incomplete fix" rounds. A critical dev-only item: unauthenticated DevTools RPC command execution, CVE-2026-71319 (`@nuxt/devtools` <3.3.1). Patch bursts: 2026-07-27 ([blog](https://nuxt.com/blog)), 2026-10-16, 2026-10-27, 2026-11-02 (4.6.4 fixes all listed Nov-2 items). Nuxt 3 is EOL and the 2026-11-02 advisories list `nuxt >=3.0.0 <4.0.0` as affected with no 3.x fix listed (inferred: no more 3.x patches). Volume is high (41 in 12 months) but fast fixes; much of it was found in an Oct 2026 audit wave (inferred from dates).

**Default protections.** Vue templates escape interpolations (Vue default; not re-verified here). Nuxt itself ships no CSRF protection, CSP or security-header defaults. Those come from the community module [`nuxt-security`](https://github.com/Baroshem/nuxt-security) (2.7.0, 2026-10-24, MIT, 985 stars, 234k weekly, Nuxt ^4.2.1): headers, CSP for SSG, rate and size limits, XSS validation; CSRF is optional ([docs](https://nuxt-security.vercel.app/)). Nuxt 4.6 adds `useSession` (iron-sealed cookie, needs `NUXT_APP_SECRET`) and stops passing unhandled server-render error message/data to the error page (GHSA-96x6-fvhx-49hg, fixed 4.6.4) ([4.6 post](https://nuxt.com/blog/v4-6)).

**Production server (Node preset).** Verified in `nitropack@2.13.6` source: graceful shutdown on `SIGTERM SIGINT`, 30 s timeout by default, `NITRO_SHUTDOWN_SIGNALS`, `NITRO_SHUTDOWN_TIMEOUT`, `NITRO_SHUTDOWN_DISABLED`, `NITRO_SHUTDOWN_NO_FORCE_EXIT`; also in cluster mode. No application-level request timeout found in the Node runtime (inferred: Node's `http` defaults apply). Render errors are caught by h3 and rendered through the Nuxt error page with a 500 status (inferred from framework design; not tested). Behaviour on uncaught process-level exceptions: not found.

## 6. Development effort

- Learning curve (inferred): moderate. Vue 3 SFCs plus auto-imports, file-based routing, `useFetch`/`useAsyncData` semantics (reworked in 3.17 and 4.0) and Nitro conventions need learning; the `app/` and `server/` split is clear. Official docs are extensive and versioned (`/docs/4.x`); docs in this research were occasionally stale or 404 (3.x roadmap still said Nuxt 5 Q1 2026).
- DX: Vite 8 HMR, Nuxt DevTools v4, generated types, `nuxt curl`/`nuxt task` in CLI v4, an official Nuxt Agent and MCP server ([blog index](https://nuxt.com/blog)). Vue Vapor support arrived in 4.6.
- Community pool (2026-11-06 to 11-12 weekly npm downloads): `nuxt` 3.33M, `nitropack` 3.60M, `nitro` 9.26M, `h3` 38.4M (used by many tools), `@nuxt/kit` 12.7M ([npm API](https://api.npmjs.org/downloads/point/last-week/nuxt)). GitHub: nuxt 61.1k stars, nitro 11.4k, h3 5.5k. About one-twentieth to one-tenth of React meta-framework volumes (inferred, not measured here).
- State of JS 2025 Nuxt usage/retention/satisfaction: not found (charts not machine-readable; the survey says Next.js is the most used meta-framework and Astro leads satisfaction by 39 points over Next.js) ([State of JS 2025](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/)).

## 7. Hosting and operations

| Mode | How |
|---|---|
| Static | `nuxt generate` (prerender; `nitro.prerender` config) |
| Server | `nuxt build`, run `node .output/server/index.mjs` (Node preset default) |
| Presets | Nitro v2 includes aws-lambda, azure, bun, cloudflare, deno, netlify, node, vercel and more (listed in the `nitropack` package) |
| Cloudflare | `cloudflare_module` (Workers) is "the new recommended preset"; `cloudflare_pages` and `cloudflare-pages-static` exist; `cloudflare_durable` is deprecated ([Nitro docs](https://nitro.build/deploy/providers/cloudflare)). Nitro auto-enables `nodejs_compat`, generates `wrangler` config and `_routes.json` (Pages) |

Cloudflare direction: Workers "has a distinctly broader set of features" than Pages and migration is "often straightforward" ([Cloudflare migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)); I found no official Pages shutdown date. Nuxt's own Cloudflare deploy page still covers only Pages and says Git-integration auto-detects the preset ([Nuxt deploy](https://nuxt.com/deploy/cloudflare)). For this bench, a static `generate` output works on either; SSR on Workers is the better-supported path (inferred).

Memory footprint: no official guidance found; not measured here. Vendor coupling: low in code (Nitro is host-agnostic, `nuxt/server` abstracts the server), but Nuxt, Nitro and h3 are now stewarded by Vercel (see section 1). Nuxt Image's auto-detected providers named in the docs are Amplify, Netlify and Vercel ([Nuxt Image](https://nuxt.com/modules/image/providers)).

## 8. Other

| Area | Status |
|---|---|
| i18n | No built-in. `@nuxtjs/i18n` 10.6.0 (vue-i18n based, route localisation, lazy loading, SEO tags), about 993k weekly, maintained by community members (rchl, kazupon, BobbieGoede) ([module page](https://nuxt.com/modules/i18n)) |
| SEO | Core has `useHead`/`useSeoMeta` (Unhead v2). Sitemap, robots, OG images via the community Nuxt SEO suite: `@nuxtjs/sitemap` 9.1.0 (417k weekly), `@nuxtjs/seo` 6.0.1, `nuxt-og-image`. RSS: no module found; a server route writing XML is the usual approach (inferred) |
| Images | `@nuxt/image` 2.2.1, IPX default provider, remote domains allow-list ([docs](https://nuxt.com/modules/image/providers)). Mind the Oct 2026 `/_ipx` high advisory |
| Content | `@nuxt/content` 3.16.2: Markdown collections defined in `content.config.ts`, SQLite-backed; Node 22.5+ native SQLite or `better-sqlite3` ([docs](https://content.nuxt.com/docs/getting-started/installation)). Cloudflare/static deploy details: not found (page 404) |
| Fonts, UI | `@nuxt/fonts` 1.2.0; `@nuxt/ui` 4.12.0, MIT and free |
| Accessibility | `@nuxt/a11y` is `1.0.0-alpha.1` (2026-10-13), i.e. pre-release; otherwise standard Vue tooling (`eslint-plugin-vuejs-accessibility`, not verified) |
| Testing | `@nuxt/test-utils` 4.4.0 (1.27M weekly); `@nuxt/eslint` 1.31M weekly |
