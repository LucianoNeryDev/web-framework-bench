# Qwik City (Qwik)

Researched 2026-11-13. Qwik is the component framework, Qwik City (renamed Qwik Router in v2) is its meta-framework. All counts and dates are as of 2026-11-13 unless stated.

## 1. Snapshot

| Item | Value | Source |
|---|---|---|
| npm `latest` (legacy v1) | `@builder.io/qwik` and `@builder.io/qwik-city` 1.20.4, published 2026-11-09 | [npm registry](https://registry.npmjs.org/@builder.io/qwik) |
| npm `latest` (v2 packages) | `@qwik.dev/core` and `@qwik.dev/router` 2.0.0-rc.5, published 2026-11-09. There is no stable 2.0.0 yet; dist-tags are `alpha`, `beta`, `latest` = rc.5 | [npm registry](https://registry.npmjs.org/@qwik.dev/core) |
| Scaffolder | `create-qwik`: `latest` = 1.20.4 (v1), `rc` = 2.0.0-rc.5. `npm create qwik@latest` therefore still creates a v1 app; v2 needs `@rc` | [npm registry](https://registry.npmjs.org/create-qwik) |
| License | MIT | npm registry, [repo](https://github.com/QwikDev/qwik) |
| Repo | QwikDev/qwik, 22,070 stars, 166 open issues+PRs (85 issues, 81 PRs), not archived, last push 2026-11-13 | [GitHub API](https://api.github.com/repos/QwikDev/qwik) |

Governance and funding:
- Created at Builder.io (Misko Hevery). On 2024-03-26 Builder.io said it "will keep supporting and sponsoring" Qwik, proposed an open collective so other companies can fund it, moved the repo to the `QwikDev` GitHub org and announced the `@qwik.dev` npm scope for 2.x ([Qwik: next leap](https://qwik.dev/blog/qwik-next-leap/)).
- [GOVERNANCE.md](https://github.com/QwikDev/qwik/blob/main/GOVERNANCE.md): Core Team, Core Leadership (votes), Docs/Community/Outreach teams, and a two-person Stewardship Team (Misko Hevery, Shai Reznik) with tiebreak and veto rights. It is not a foundation. No foundation, acquisition or change of owner found as of 2026-11.
- Partytown also moved: `@qwik.dev/partytown` (repo QwikDev/partytown) is the actively released line (1.0.5, 2026-11-07); `@builder.io/partytown` last modified 2026-09-09 at 0.10.3 ([npm](https://registry.npmjs.org/@qwik.dev/partytown)). The "Builder.io-maintained" premise is out of date; the npm maintainer lists overlap.
- Who commits now (inferred from git history since 2026-08-13): mostly Wout Mertens, Maiéul, Varixo, Michał Popek, not Builder.io staff ([commits API](https://api.github.com/repos/QwikDev/qwik/commits)). Misko Hevery has about 20 commits in the same window. Builder.io's current funding level: not found.

## 2. Maintainability

**Release cadence (v1, `@builder.io/qwik`, dates from npm `time`).** Releases run from 1.5.6 (2024-06-09) to 1.20.4. Minor releases: 1.10.0 2024-11-11, 1.11.0 2024-11-25, 1.12.0 2024-12-23, 1.13.0 2025-04-01, 1.14.0 2025-05-21, 1.15.0 2025-07-21, 1.16.0 2025-08-21, 1.17.0 2025-10-08, 1.18.0 2025-12-17, 1.19.0 2026-01-30, 1.20.0 2026-05-22. Gaps: 2025-02-20 to 2025-04-01 (6 weeks), 2025-12-17 to 2026-01-30, and 2026-03-13 to 2026-05-22 (10 weeks), then 1.20.0 to 1.20.1 (2026-05-22 to 2026-09-23, 4 months, with no v1 release). Autumn 2026 is dense because of security patches (1.20.1 2026-09-23, 1.20.2 2026-10-06, 1.20.3 2026-10-25, 1.20.4 2026-11-09).

**v2 line (`@qwik.dev/core`).** alpha.0 2024-11-15, alpha.10 2025-05-19, beta.1 2025-06-04, 41 betas to beta.47 2026-09-30 (about 16 months of beta), rc.0 2026-10-01, rc.5 2026-11-09 ([npm](https://registry.npmjs.org/@qwik.dev/core)). The 2.0 RC post gives no stable date; it lists open work: more app testing, stabilising `Pending`/`Catch`, making the TypeScript optimizer default, finishing v2 docs ([RC post](https://next.qwik.dev/blog/qwik-2-rc)). Out-of-order streaming is still experimental in rc.

**Support policy.** No written LTS or EOL policy for v1 found. In practice v1 still gets releases (1.20.4 on 2026-11-09), and several advisories are patched on both lines.

**Majors.**

| Major | Dates | What changed |
|---|---|---|
| 0.x | 2021-06-01 to 2023-05 | Pre-1.0 |
| 1.0.0 | 2023-05-02 (npm `time`) | First stable |
| 2.0 (rc) | rc.0 2026-10-01, no stable | Package rename to `@qwik.dev/core`/`@qwik.dev/router`, Vite 8 / Rolldown required, no HTML comment markers, `useResource$` replaced by async `useComputed$`, listener attribute `on:click` to `q-e:click`, `*.server.ts` cannot be imported on the client ([RC summary](https://dev.classmethod.jp/en/articles/qwik-2-rc-changes/), [RC post](https://next.qwik.dev/blog/qwik-2-rc)) |

**Migration tooling.** `npx qwik migrate-v2` renames packages and identifiers (`QwikCityProvider` to `QwikRouterProvider`, `qwikCity` to `qwikRouter`, etc.), config and dependencies; the [upgrade guide](https://github.com/QwikDev/qwik/blob/main/packages/docs/src/routes/docs/upgrade/index.mdx) (source of the docs page, created 2026-03-19, updated 2026-07-31) lists manual steps and a checklist. The published docs URL `qwik.dev/docs/upgrade-guide/` returned 404 when fetched; the guide is in the repo and on the `next.qwik.dev` docs. The v2 docs site is `next.qwik.dev`. The upgrade guide calls v2 "a ground-up rewrite". Node range: `^18.17 || ^20.3 || >=21`.

**Type safety.** Written in TypeScript; `routeLoader$` return types flow to `useXxx()` consumers by inference ([route loader docs](https://qwik.dev/docs/route-loader/); the docs page itself does not describe the typing, inferred from examples). Optional TypeScript optimizer (`tsOptimizer: true`) is opt-in in rc. The optimizer ($-suffix lazy-loading) is Rust-based and adds serialization constraints (only serializable values cross `$` boundaries), which is a typing/DX cost not captured by TS.

**Dependency tree of a new project.** Measured 2026-11-13 on Node 26.8.1 / npm 11.19.0, empty app, plain environment:

```
npm create qwik@latest empty app </dev/null && cd app && npm install      # v1: create-qwik 1.20.4
npm create qwik@rc     empty app </dev/null && cd app && npm install      # v2: create-qwik 2.0.0-rc.5
npm ls --all --parseable | wc -l ; du -sm node_modules
```

| | v1 (1.20.4, vite 7.3.7, TS 5.4.5) | v2 (2.0.0-rc.5, vite 8.2.4, TS 5.9.3) |
|---|---|---|
| `npm ls --all --parseable` entries (includes root) | 474 | 517 |
| Installed package dirs | 473 | 516 |
| Unique name@version | 447 | 486 |
| Unique names | 416 | 456 |
| `node_modules` size | 212 MB | 234 MB |
| `npm audit` | 11 vulns (7 moderate, 4 high) | 16 (12 moderate, 4 high) |

Everything, including Qwik itself, lands in `devDependencies`; the empty app has no runtime `dependencies`. The count is inflated by eslint/prettier/typescript from the starter. `@qwik.dev/router` rc.5 itself declares 26 direct dependencies (mdx, remark, unified, zod, svgo, `@azure/functions`, `@netlify/edge-functions`, vite-imagetools) even for a non-MDX app ([npm](https://registry.npmjs.org/@qwik.dev/router/2.0.0-rc.5)). npm 11 printed "install-scripts" warnings for `esbuild`, `sharp`, `@parcel/watcher`. Scratch dir deleted after measurement.

## 3. Analytics

- No first-party analytics. The official [integrations list](https://qwik.dev/docs/integrations/) (27 items) has none, and no Sentry/OTel either.
- Conventional approach: Partytown, added with `npm run qwik add partytown`; Google Analytics/GTM scripts are marked `type="text/partytown"` and run in a web worker, with `<QwikPartytown forward={['gtag','dataLayer.push']} />` in `<head>` ([docs](https://qwik.dev/docs/integrations/partytown/)). Needs a service-worker-style file served from the origin (`~partytown`); caveats are Partytown's own (some scripts break off the main thread).
- Not "from the box": the starter has no analytics. Self-hosted choices (Plausible, Umami script tag) are plain `<script>` tags, inferred.
- Qwik-specific: `@builder.io/qwik` has a first-party "Qwik Insights" package in the repo (`packages/insights`) and `qwik-lab` for bundle telemetry; these are for Qwik's own prefetch tuning, not site analytics ([repo tree](https://github.com/QwikDev/qwik/tree/main/packages)).

## 4. Monitoring and observability

- OpenTelemetry: no built-in support, no instrumentation hooks found. No `@opentelemetry` dependency in `@qwik.dev/core` or `@qwik.dev/router`, and a GitHub code search for "opentelemetry" in the repo returned 0. Manual only: start the Node OTel SDK before the server entry and create spans in loaders/middleware (inferred, standard OTel pattern; not documented by Qwik). Edge runtimes: nothing.
- Hooks: request middleware (`onRequest`, plugin files `src/routes/plugin@*.ts`) and `sharedMap` give a place to add request logging or timing ([docs repo](https://github.com/QwikDev/qwik/tree/main/packages/docs/src/routes)). Server entries log `uncaughtExceptionMonitor` only in the starters ([node-server starter](https://github.com/QwikDev/qwik/blob/main/starters/adapters/node-server/src/entry.node-server.tsx)).
- Health checks: none built in; add a route (`src/routes/healthz/index.ts`), inferred.
- Sentry: no Qwik guide and no Qwik SDK. The [Sentry JavaScript docs](https://docs.sentry.io/platforms/javascript/) list about 40 framework guides, none for Qwik, so `@sentry/browser` (client) plus a Node/Express SDK (server) is the fallback, and server instrumentation is unofficial. An open community question exists: [getsentry/sentry-javascript#8867](https://github.com/getsentry/sentry-javascript/discussions/8867).

## 5. Robustness and security

**Advisories.** [QwikDev/qwik GHSA list](https://github.com/QwikDev/qwik/security/advisories) via API, published 2024-11 to 2026-11: 31 advisories (3 critical, 13 high, 14 medium, 1 low). 21 of them were published in 2026-10, when many reports landed for both lines. Selected:

| ID | CVE | Severity | Date | Subject, fixed in |
|---|---|---|---|---|
| GHSA-qr9h-j6xg-2j72 | CVE-2025-53620 | critical | 2025-07-09 | "Crashing any Qwik Server", qwik-city 1.13.0 |
| GHSA-xqg6-98cw-gxhq | CVE-2026-25150 | critical | 2026-02-03 | Prototype pollution via FormData, 1.19.0 |
| GHSA-p9x5-jp3h-96mm | CVE-2026-27971 | critical | 2026-03-02 | Unauthenticated RCE via `server$` deserialization (needs `require()` at runtime), 1.19.1 |
| GHSA-r666-8gjf-4v5f / GHSA-vm6g-8r4h-22x8 | CVE-2026-25151 / -25155 | medium | 2026-02-03 | CSRF origin check bypassed by Content-Type parameters, 1.19.0 |
| GHSA-m6jq-g7gq-5w3c | CVE-2026-25148 | medium | 2026-02-03 | SSR XSS via virtual node serialization, 1.19.0 |
| GHSA-whhv-gg5v-864r | CVE-2026-32701 | high | 2026-03-20 | FormData array pollution, DoS, 1.19.2 |
| GHSA-x586-xvc8-g7q6 | CVE-2026-84994 (as listed) | high | 2026-09-22 | Crash any server via Resource thenable, 1.20.0 / 2.0.0-beta.37 |
| GHSA-97vv-h72q-2gvr | none yet | high | 2026-10-13 | `server$()` RPC runs before and bypasses layout `onRequest` middleware (auth bypass), 1.20.2 |
| GHSA-hgrw-m6vc-wrwr | none yet | high | 2026-10-13 | Cloudflare Pages adapter caches private/no-store responses in shared worker cache, 1.20.2 |
| GHSA-39vp-6542-fw43 | none yet | high | 2026-10-13 | Body size limit missing on Bun, Cloudflare Pages, Netlify Edge, Vercel Edge adapters, 1.20.2 / rc.2 |
| GHSA-7g9h-pv6m-p3mw | none yet | high | 2026-10-03 | Path traversal (file read) in dev server static middleware, 1.20.1 |
| GHSA-pm8x-mx56-g395 | none yet | high | 2026-10-13 | Arbitrary file write in dev server `POST /__image_fix`, 1.20.2 |
| GHSA-xjvj-9xf4-x9rm | none yet | high | 2026-10-13 | `SSRComment` unescaped, XSS, 2.0.0-rc.2 |
| GHSA-qg6q-pp92-r5q6, GHSA-cvf2-p22x-xw37 | none yet | high | 2026-10-28 | FormData DoS (incomplete earlier fixes), 1.20.3 / 2.0.0-rc.4 |
| GHSA-2v54-72rw-xh94 | none yet | high | 2026-10-28 | v2 state deserializer BigInt DoS, rc.4 |

Pattern: recurring bugs in FormData parsing (`formToObj`, five advisories), the CSRF/redirect checks (bypassed twice), the `server$` RPC path, and process-crashing unhandled errors. Many of these are in the v1 line that this benchmark would use today, so a v1 app needs 1.20.4 or later. Per-advisory CVE IDs for October 2026 were not yet assigned in the API. I counted these from the API; I did not read each advisory.

**Default protections.**
- Escaping: JSX escapes text/attributes, but the advisory history above shows several SSR escaping holes (attribute names, comment nodes).
- CSRF: `checkOrigin` option, default `true`: every POST/PUT/PATCH/DELETE must have an `Origin` header equal to the server origin, else 403; `'lax-proto'` for TLS-terminating proxies ([router source, rc.5 `request-handler` types](https://www.npmjs.com/package/@qwik.dev/router/v/2.0.0-rc.5)). Behind a reverse proxy, the origin is derived from the request URL, so a wrong `Host`/scheme can cause 403s; trusting `X-Forwarded-*` is opt-in.
- CSP: manual. The docs show a route plugin that sets a nonce in `sharedMap` (`"@nonce"`) and the `Content-Security-Policy` header; the docs do not say whether Qwik's own inline scripts get the nonce automatically (the rc.5 router source passes a `@nonce` value into the render options, so probably yes; inferred); custom scripts need it passed by hand; works only with SSR, not static generation; the example policy keeps `'unsafe-inline'` ([CSP docs](https://qwik.dev/docs/advanced/content-security-policy)).
- Security headers: none by default. Body size limit: `limitRequestBody` (see advisory for adapters that lacked it).

**Production server.**
- SIGTERM: the node-server, express and fastify starter entries do not handle SIGTERM/SIGINT or drain connections. Only `process.on("uncaughtExceptionMonitor")` is present, which logs and does not prevent exit (checked in [starters/adapters](https://github.com/QwikDev/qwik/tree/main/starters/adapters), main branch, 2026-11-13; "not found" for graceful shutdown). Node's default SIGTERM behavior (exit) applies. Add your own handler.
- Request timeouts: none configured in the adapters; the node middleware aborts an internal controller on `aborted`/`close`/`error` ([router source](https://www.npmjs.com/package/@qwik.dev/router/v/2.0.0-rc.5)).
- Render errors: middleware wraps `next()` in try/catch and returns a 500 `ServerError` or error page. Unhandled promise rejections are not isolated: three advisories (qwik-city 1.13.0, 1.20.0, and v2 `<Pending>` rc.4) show a single request could terminate the Node process.

## 6. Development effort

- Learning curve: steep for the model, not the syntax. JSX like React, but `$`-suffixed functions, serializable-closure rules, `useSignal`/`useStore`, `useVisibleTask$` escape hatch and `routeLoader$`/`routeAction$`/`server$` have their own constraints. v2 adds async `useComputed$`, `<Pending>`, `*.server.ts`.
- Docs: qwik.dev docs are structured and have a playground and tutorial, but I hit several 404s on pages (CSP at `/docs/guides/csp/`, sitemap, i18n guide paths) and the `loader` docs page showed inconsistent snippets; v2 docs are on a separate `next.qwik.dev` site and are marked unfinished in the RC post.
- DX: Vite-based; v2 needs Vite 8 (Rolldown). HMR improved in v2; Qwik DevTools (`@qwik.dev/devtools`), VS Code extension, `eslint-plugin-qwik`, `qwik add` integrations (tailwind, auth, drizzle, prisma, playwright, vitest, partytown, etc.) ([integrations](https://qwik.dev/docs/integrations/)). Dev server had its own security advisories (SSRF `/__image_info`, file write `/__image_fix`, path traversal): do not expose it.
- Community pool (2026-11-13): 22,070 GitHub stars; `@builder.io/qwik` 53,840 downloads/week, `@builder.io/qwik-city` 40,189, `@qwik.dev/core` 15,322, `@qwik.dev/router` 9,901, `create-qwik` 1,420, `qwik-speak` 6,862 (week 2026-11-06 to 2026-11-12, [npm API](https://api.npmjs.org/downloads/point/last-week/@builder.io/qwik)). For scale, `react` was 253,620,155 the same week. Monthly `@builder.io/qwik` downloads rose from about 81k (2026-01) to about 231k (2026-10); the cause is not known (possibly CI or automation; inferred).
- State of JS 2025: no usage/awareness/retention percentages could be read from the page. It says Qwik is the exception to stable satisfaction ranks, "continuing to lose ranks", and shows its opinion trend as "Mostly negative opinions" for 2024 (-6.44%) and 2025 (-11.32%) ([front-end frameworks](https://2025.stateofjs.com/en-US/libraries/front-end-frameworks/), [libraries](https://2025.stateofjs.com/en-US/libraries/)). Hiring pool: small; inferred from the numbers above.
- Project health: 3,948 commits in the 9 months to 2026-11-13 on `main` (mostly v2 work); open issues 85, open PRs 81. Releases: see section 2. Backed by a company sponsor but with a small, mostly volunteer core (inferred from commit authors).

## 7. Hosting and operations

| Target | Support (starters in repo `main`) |
|---|---|
| Node | `node-server`, `express`, `fastify` adapters |
| Static | `ssg` adapter (`sitemapOutFile` option, writes `sitemap.xml`, retries option) |
| Cloudflare | `cloudflare-pages` (generates `dist/_worker.js` and `_routes.json`) and `cloudflare-workers` (wrangler.jsonc, `wrangler deploy`) |
| Others | `vercel-edge`, `netlify-edge`, `deno`, `bun`, `aws-lambda`, `azure-swa`, `cloud-run`, `firebase` |

Sources: [starters/adapters](https://github.com/QwikDev/qwik/tree/main/starters/adapters), [Cloudflare Pages docs](https://qwik.dev/docs/deployments/cloudflare-pages/), [Cloudflare Workers docs](https://qwik.dev/docs/deployments/cloudflare-workers/). The list was read from `main` (v2); I did not check it against 1.20.4.
- Cloudflare direction: Cloudflare's migration guide presents Workers as the broader platform ("Unlike Pages, Workers has a distinctly broader set of features") and says migrating from Pages is "often a straightforward process"; it does not state that Pages is deprecated ([Cloudflare docs](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)). Qwik supports both. Pages adapter had a high-severity cache bug (GHSA-hgrw-m6vc-wrwr).
- Memory footprint guidance: not found in docs. An SSR Node server holds no component state per user (resumability), so memory is expected to be modest (inferred, not measured here).
- Vendor coupling: low. MIT, adapter-based; Builder.io integration is an optional `qwik add builder.io`. Partytown and some docs still use Builder.io branding.

## 8. Other

- i18n: not built in. The docs say Qwik "does not solve the internationalization problem directly" and name `qwik-speak` (runtime, 0.24.0, last published 2025-12-09, 143 GitHub stars), `compiled-i18n` (`qwik add compiled-i18n`; compile-time build per locale or runtime) and Paraglide JS ([docs](https://qwik.dev/docs/integrations/i18n/)).
- SEO: `head` export / `DocumentHead` for title, meta, links; static adapter writes `sitemap.xml` ([ssg types](https://www.npmjs.com/package/@qwik.dev/router/v/2.0.0-rc.5)). RSS: no helper found, write an endpoint route. OG images: `qwik add og-image` integration.
- Images: `?jsx` import via `vite-imagetools`, emits WebP at 200/400/600/800/1200 px with `srcset`, lazy loading, width/height ([docs](https://qwik.dev/docs/integrations/image-optimization/)). Build time, not on-demand.
- Content: Markdown and MDX routes through `@qwik.dev/router` (it depends on mdx/remark), no content-collection layer found. Orama search integration exists.
- Accessibility tooling: `eslint-plugin-qwik` exists, but it contains no jsx-a11y rules (grep of rc.5 package returned nothing; inferred absence). Not found as a documented feature.
