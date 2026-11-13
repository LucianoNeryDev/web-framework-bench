# Next.js (React, App Router): research notes

Researched 2026-11-13. All "as of" dates are 2026-11 unless stated. Facts I derived myself are marked "inferred".

## 1. Snapshot

| Item | Value |
|---|---|
| Stable | `next@16.4.6`, published 2026-11-09 (npm `dist-tags.latest`, `time`) ([npm](https://www.npmjs.com/package/next)) |
| Previous minors | 16.0 2025-10-22, 16.1 2025-12-18, 16.2 2026-03-18, 16.3 2026-08-03, 16.4 2026-10-06 (npm `time`) |
| Other channels | `canary` 16.5.0-canary.49, `preview` 16.3.0-preview.10, `backport` 15.5.29 (npm dist-tags, 2026-11-13) |
| React | 19.3.1 latest; the scaffold installed 19.3.0 ([React 19.3 post](https://react.dev/blog/2026/09/09/react-19-3) is referenced by the [16.4 post](https://nextjs.org/blog/next-16-4)) |
| License | MIT (npm; GitHub reports MIT) |
| Runtime | Node >= 20.9.0 (npm `engines`) |
| Repo | [vercel/next.js](https://github.com/vercel/next.js): 143,504 stars (GitHub API, 2026-11-13) |

Governance: built and controlled by Vercel Inc. (company-led; I found no independent foundation, inferred from the support policy and release posts all being Vercel-authored). Funding: secondary sources report a $300M Series F at $9.3B post-money in Sept 2025; I did not find a primary Vercel source in this session. Claims of a 2026 S-1/IPO or Series G came from one low-quality aggregator and are not verified. Not found: any Next.js-specific funding or foundation.

## 2. Maintainability

**Cadence.** Majors roughly yearly (Oct 2023, Oct 2024, Oct 2025); 16.x has had a minor every 2-4 months and frequent patches (15.5.x reached .29 on 2026-11-03). The 16.4 post says Cache Components "will become the default in Next.js 17" (no date given) ([16.4 post](https://nextjs.org/blog/next-16-4)).

**Support policy** ([support-policy](https://nextjs.org/support-policy)): Active LTS = latest major until the next ships. Maintenance LTS = two years from the major's release, critical fixes only.

| Major | Released | Status |
|---|---|---|
| 16.x | 2025-10-21 | Active LTS |
| 15.x | 2024-10-21 | Maintenance; originally to 2026-10-21, extended: security releases through 2027-01-31 |
| 14.x | 2023-10-26 | Unsupported (last release 14.2.35, 2025-12-11, npm `time`) |

**Last three majors and migration.**

| Major | What broke | Tooling |
|---|---|---|
| 14 (2023-10-26) | Node 18.17 minimum; `next export` removed for `output: 'export'`; `ImageResponse` moved to `next/og`; `@next/font` removed; SWC WASM target removed ([guide](https://nextjs.org/docs/app/guides/upgrading/version-14)) | codemods for `next/og` and `next/font` imports |
| 15 (2024-10-21) | React 19 minimum; async `cookies`/`headers`/`params`/`searchParams` (sync access temporary); `fetch`, GET route handlers and client router cache no longer cached by default; `geo`/`ip` removed from `NextRequest`; Speed Insights auto-instrumentation removed ([guide](https://nextjs.org/docs/app/guides/upgrading/version-15)) | `npx @next/codemod@canary upgrade latest`, `next-async-request-api` codemod |
| 16 (2025-10-22) | Turbopack default for dev and build (a custom `webpack` config fails `next build` unless `--webpack`); sync request APIs fully removed; `middleware` renamed `proxy` (Node runtime only); `next lint` and AMP removed; `serverRuntimeConfig`/`publicRuntimeConfig` removed; `experimental.ppr`/`dynamicIO` replaced by `cacheComponents`; `revalidateTag` needs a second argument; next/image defaults tightened; Node 20.9+, TS 5.1+; parallel routes need `default.js` ([guide](https://nextjs.org/docs/app/guides/upgrading/version-16), lastUpdated 2026-11-06) | `npx @next/codemod@canary upgrade latest`; `npx next@canary upgrade --agent=latest` (agent-driven, added around 16.4) |

Three different caching models in three majors (implicit in 14, opt-in in 15, `'use cache'` / Cache Components in 16). Cache Components is not a rename: the guide says enabling it "can surface build errors for uncached data outside of `<Suspense>`".

**Type safety.** TypeScript first-class: generated route types, `next typegen` creates global `PageProps<'/route'>`, `LayoutProps`, `RouteContext` helpers (from 15.5) ([v16 guide](https://nextjs.org/docs/app/guides/upgrading/version-16)). `next.config.ts` supported.

**Dependency tree of a new project (measured).**
- Date 2026-11-13, Linux x64, Node v26.8.1, npm 11.19.0, plain environment, scratch dir `/var/tmp/wfb-research/next-scratch` (deleted afterwards).
- Command: `npx --yes create-next-app@latest app --ts --no-tailwind --app --no-src-dir --use-npm --yes --disable-git`, then `npm ls --all --parseable | wc -l`.
- Installed: next 16.4.6, react/react-dom 19.3.0, typescript ^5, @types/node ^20, @types/react(-dom) ^19. The default scaffold has no linter and no Tailwind.
- Result: `npm ls --all --parseable | wc -l` = **29** entries (includes the root project, so 28 packages); **28 unique** packages; `du -sm node_modules` = **369 MB**. `npm install` reported 28 packages added.
- `next` itself depends on `@next/env`, `@swc/helpers`, `baseline-browser-mapping`, `caniuse-lite`, `postcss`, `styled-jsx`; platform binaries `@next/swc-linux-x64-gnu` and `@img/sharp-*` were installed. The large size is probably dominated by the native SWC/Turbopack binary (inferred, not measured per package).
- Important for the benchmark: since 16.4, the scaffold's `next.config.ts` has `cacheComponents: true` and `partialPrefetching: true`, and it writes an `AGENTS.md` ([16.4 post](https://nextjs.org/blog/next-16-4); confirmed in the scaffold). This changes what a "default" app may do (dynamic data outside `<Suspense>` fails the build).

## 3. Analytics

- Not from the box as a product. Built in: `useReportWebVitals` (TTFB, FCP, LCP, CLS, INP) and `instrumentation-client.ts` for early client code ([analytics guide](https://nextjs.org/docs/app/guides/analytics), lastUpdated 2026-10-05). You still need to send results somewhere.
- Official third-party helper: `@next/third-parties` 16.4.6 (Google Analytics/Tag Manager components) ([npm](https://www.npmjs.com/package/@next/third-parties); GTM use shown in the [CSP guide](https://nextjs.org/docs/app/guides/content-security-policy)).
- Vercel Web Analytics: `@vercel/analytics` 2.0.1 (MIT), `<Analytics />` from `@vercel/analytics/next`; about 10.0M weekly downloads ([npm API](https://api.npmjs.org/downloads/point/last-week/@vercel/analytics), 2026-11-06..12). The quickstart lists a Vercel account, a Vercel project and the Vercel CLI as prerequisites and says to enable it in the dashboard; it adds `/_vercel/insights/*` routes after deploy ([Vercel quickstart](https://vercel.com/docs/analytics/quickstart)). Whether data is collected when self-hosted: not found.
- Speed Insights: `@vercel/speed-insights` 2.1.0 (Apache-2.0); auto-instrumentation was removed in Next 15, so it is a manual install ([v15 guide](https://nextjs.org/docs/app/guides/upgrading/version-15)).
- Conventional approach: Plausible/Umami/GA via a `<Script>` tag, or Vercel Analytics if deployed on Vercel.

## 4. Monitoring and observability

- **OpenTelemetry**: built-in instrumentation of Next itself. Default spans: root `[method] [route]`, `render route (app)`, `fetch`, `executing api route`, `generateMetadata`, `resolve page components`, `start response`; `NEXT_OTEL_VERBOSE=1` for more spans, `NEXT_OTEL_FETCH_DISABLED=1` to drop fetch spans ([OTel guide](https://nextjs.org/docs/app/guides/open-telemetry), lastUpdated 2026-10-22).
- Setup: root `instrumentation.ts` exporting `register()`. Either `@vercel/otel` 2.3.0 (`registerOTel({ serviceName })`, edge-compatible, MIT; it needs several `@opentelemetry/*` peer packages) or manual `NodeSDK` guarded by `NEXT_RUNTIME === 'nodejs'`. So: instrumentation is built in, the SDK and exporter are manual.
- **Error hook**: `onRequestError` export in `instrumentation.ts` (used by Sentry, per [Sentry docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)).
- **Sentry**: official SDK `@sentry/nextjs` 11.12.0 (npm latest). Docs state Next.js 14+ and Node 20.19+; wizard `npx @sentry/wizard@latest -i nextjs`; separate server/edge configs, `instrumentation-client.ts`, `app/global-error.tsx` ([Sentry Next.js guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)). About 16.4M weekly downloads (npm API). Turbopack and OpenNext support: not stated on that page.
- **Logging / health checks**: no built-in structured logger and no built-in health endpoint that I found (inferred; a Route Handler is the usual way).

## 5. Robustness and security

Advisory volume is the main finding. From the [vercel/next.js GitHub security advisories](https://github.com/vercel/next.js/security/advisories) API (queried 2026-11-13), **66 published advisories dated 2024-11-01 or later: 7 critical, 19 high, 33 medium, 7 low.** Bursts: 13 on 2026-05-06/07, 9 on 2026-07-21, 7 on 2026-11-03. Latest fixes: 16.4.5 and 15.5.29 (2026-11-03).

| ID | Severity | Date | What |
|---|---|---|---|
| [CVE-2025-29927](https://github.com/advisories/GHSA-f82v-jwr5-mffw) | critical 9.1 | 2025-03-21 | middleware auth bypass via `x-middleware-subrequest`; fixed 15.2.3, 14.2.25, 13.5.9, 12.3.5 |
| [CVE-2025-55182](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp) ("React2Shell"; Next.js tracked it as CVE-2025-66478) | critical 10.0 | 2025-12-03 | RCE in the React Server Components protocol; App Router 15.x/16.x (and 14.3 canaries); fixed 15.5.7, 16.0.7; Pages Router, Edge runtime, 13.x and 14 stable not affected; Vercel advises rotating secrets ([Next.js advisory](https://nextjs.org/blog/CVE-2025-66478)) |
| [CVE-2025-55183 / 55184 / 67779](https://github.com/vercel/next.js/security/advisories/GHSA-w37m-7fhw-fmv9) | medium 5.3 / high 7.5 / high 7.5 | 2025-12-11 | Server Actions source exposure; RSC DoS; incomplete DoS fix. Fixed 15.5.8/15.5.9, 16.0.9/16.0.10, 14.2.34/14.2.35 |
| [CVE-2026-23864](https://github.com/vercel/next.js/security/advisories/GHSA-h25m-26qc-wcjf), CVE-2026-23869, CVE-2026-23870 | high 7.5 | 2026-01..05 | more RSC DoS |
| [CVE-2026-27978](https://github.com/vercel/next.js/security/advisories/GHSA-mq59-m269-xvcx) | medium | 2026-03-16 | `Origin: null` bypasses Server Actions CSRF check (16.x, fixed 16.1.7) |
| CVE-2026-44574 / 44575 / 45109 / 44573, [CVE-2026-64642](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24) | high 7.5-8.1 | 2026-05..07 | middleware/proxy bypasses (dynamic params, segment-prefetch, Pages i18n, Turbopack single locale) |
| CVE-2026-44581 | medium 4.7 | 2026-05-06 | XSS in apps using CSP nonces |
| [CVE-2026-75604](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) | critical 9.0 | 2026-08-25 | unauthenticated RCE on Windows-hosted servers; fixed 15.5.24, 16.3.3 |
| GHSA-2xp9-vwfh-vxw4 (AVIF), [CVE-2026-96889](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) (SVG) | critical | 2026-08-25, 10-14 | unauthenticated RCE in the Image Optimization API; fixed 15.5.24/16.3.3 and 15.5.28/16.4.1 |
| [CVE-2026-94545](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j), GHSA-673q-mjm6-r5xr | critical | 2026-09-22, 10-14 | RCE in `next/og` ImageResponse (16.2-16.3.5); RCE in `use cache` functions returning typed arrays (16.0-16.4.0) |
| CVE-2026-64649, CVE-2026-64645, CVE-2026-44578 | high 8.6 for the last | 2026-05..07 | SSRF (Server Actions on custom servers, rewrites, WebSocket upgrades) |
| CVE-2026-119346..119351, 119790 (Nov 2026) | medium | 2026-11-03 | cross-user cache leaks in `use cache` / Cache Components, HttpOnly cookie exposure on Edge routes, SVG bypass in image optimization |

Pattern (inferred from the list): 2026 advisories cluster around the newest features (Cache Components, image optimizer, RSC/Server Actions, proxy). A site that uses none of Server Actions, `next/image` optimization, `next/og`, `use cache` or proxy would be exposed to few of them, but the scaffold enables Cache Components by default and a typical page uses `next/image`.

**Default protections.**
- Server Actions: POST only, Origin compared with Host / `X-Forwarded-Host`, `serverActions.allowedOrigins`, encrypted closure variables, unused actions removed from the bundle ([data-security guide](https://nextjs.org/docs/app/guides/data-security), lastUpdated 2026-10-06). React escapes text output.
- CSP: nonce support via `proxy.ts`, which forces dynamic rendering of every page and disables static/ISR/CDN caching and PPR; hash-based alternative is `experimental.sri` ([CSP guide](https://nextjs.org/docs/app/guides/content-security-policy), lastUpdated 2026-03-20). Security headers (HSTS, X-Frame-Options etc.): set manually in `headers()`; no built-in defaults found.
- The docs recommend a reverse proxy (nginx) for malformed requests, slow connections, payload limits and rate limits ([self-hosting](https://nextjs.org/docs/app/guides/self-hosting)).

**Production server behaviour.**
- SIGTERM/SIGINT: documented; the server finishes in-flight requests and pending `after()` callbacks, 10-30 s drain recommended ([self-hosting](https://nextjs.org/docs/app/guides/self-hosting)). I tested the scaffold with `next start`: SIGTERM exited within 2 s (idle).
- Render errors: caught by error boundaries (`error.tsx`, `global-error.tsx`); event-handler errors are not ([error handling](https://nextjs.org/docs/app/getting-started/error-handling)). Whether a render error crashes the process or only the request: not verified in this session.
- Request timeouts: not found in the docs (rely on the proxy).

## 6. Development effort

- Learning curve: steepest of the React options (inferred). Concepts to learn: Server vs Client Components, async request APIs, `'use cache'`/Cache Components, `Suspense` requirements, proxy, Server Actions, plus the three caching models that changed across 14, 15 and 16.
- Docs: extensive, with per-version upgrade guides, `llms.txt` index, and since 16.2 version-matched docs shipped in `node_modules/next/dist/docs/` (the scaffold's `AGENTS.md` points to them) ([v16 guide](https://nextjs.org/docs/app/guides/upgrading/version-16)).
- DX: Turbopack default with filesystem cache for dev and build; lazy server HMR and smaller disk cache in 16.4; React Compiler stable but opt-in; dev and build can run concurrently (separate `.next/dev`) ([16.4 post](https://nextjs.org/blog/next-16-4)). Measured: default scaffold `next build` compiled in 15.6 s (Turbopack, this machine).
- Community size: 143.5k GitHub stars; `next` 91.95M and `react` 253.6M npm downloads in the week 2026-11-06..12 ([npm API](https://api.npmjs.org/downloads/point/last-week/next)); `@sentry/nextjs` 16.4M; `@opennextjs/cloudflare` 2.3M.
- [State of JS 2025 meta-frameworks](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/): Next.js leads usage and keeps gaining; satisfaction is falling with a 39% gap to Astro; "Next.js issues" is the #2 pain point (302 answers). Exact usage and retention percentages: not found on that page (text only).

## 7. Hosting and operations

| Mode | How | Notes |
|---|---|---|
| Node server | `next start`, or `output: 'standalone'` (`.next/standalone/server.js`, `PORT`/`HOSTNAME` env) ([output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)) | Full feature set. Measured: `next start` on the default scaffold, 1 process, RSS **147 MB** after 200 requests to `/` (Node v26.8.1, 2026-11-13); that is a hello-world page, not the benchmark app. |
| Static export | `output: 'export'` to `out/` | Unsupported: Server Actions, proxy, ISR, `headers()`/redirects/rewrites config, default image loader, dynamic routes without `generateStaticParams` ([static exports](https://nextjs.org/docs/app/guides/static-exports)). A server-filtered `/blog?q=&tag=` route would not work statically (inferred). |
| Docker / multi-instance | needs shared `cacheHandler`, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, `deploymentId` | Default cache is per-instance on local disk ([self-hosting](https://nextjs.org/docs/app/guides/self-hosting)) |

- **Adapters API**: `adapterPath` stable since 16.2.0 (top-level config; `NEXT_ADAPTER_PATH` for zero-config platforms); reference implementation `nextjs/adapter-vercel` ([adapterPath](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath), lastUpdated 2026-09-29).
- **Cloudflare**: the Pages-specific `@cloudflare/next-on-pages` is deprecated on npm in favour of OpenNext. `@opennextjs/cloudflare` 1.20.17 (2026-11-12) targets Workers, supports Next 16 and the latest 15 minor (peer `next >=15.5.29 <16 || >=16.4.5`), 3 MiB (free) / 10 MiB (paid) compressed Worker size limit ([OpenNext docs](https://opennext.js.org/cloudflare)). Cloudflare's own docs now say it recommends **vinext** (a Vite reimplementation of the Next API, announced 2026-02-24 as experimental) for full-stack Next.js on Workers, and still describe it as beta ([Cloudflare guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), [vinext post](https://blog.cloudflare.com/vinext)). The Pages guide sends full-stack Next to Workers and static exports to Pages ([Pages guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)). I found no statement that Pages is deprecated; Cloudflare's migration page only says Workers has "a distinctly broader set of features" ([migrate-from-pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/), updated 2026-11-12).
- Vendor coupling: first-class on Vercel (analytics, Speed Insights, OTel exporter, ISR/PPR/Cache Components platform features); elsewhere, features beyond static export depend on adapters or a shared cache handler. Vendor-neutral Node/Docker deployment is documented.

## 8. Other

- **i18n**: no library; docs show proxy-based locale redirect, `app/[lang]` and dictionaries, `next/root-params` ([i18n guide](https://nextjs.org/docs/app/guides/internationalization), lastUpdated 2026-11-06). Community: next-intl and others.
- **SEO**: Metadata API (`metadata`, `generateMetadata`), file conventions `sitemap.ts`, `robots.ts`, `opengraph-image`, `ImageResponse` ([metadata guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)). RSS: no built-in; a Route Handler works (inferred). Streaming metadata is disabled for known bots.
- **Images**: `next/image` with built-in optimizer (needs a server, or a custom loader for static export; sharp memory note on glibc). 16.0 changed defaults (`minimumCacheTTL` 4 h, `qualities` [75], local IP blocked, max 3 redirects) ([v16 guide](https://nextjs.org/docs/app/guides/upgrading/version-16)). The optimizer was the source of several 2026 advisories (see section 5).
- **Content**: `@next/mdx` 16.4.6 ([npm](https://www.npmjs.com/package/@next/mdx)); no content-collections layer (inferred; Markdown is usually parsed in a Server Component or at build).
- **Accessibility**: `eslint-config-next@16.4.6` depends on `eslint-plugin-jsx-a11y` ([npm](https://www.npmjs.com/package/eslint-config-next)); the scaffold ships no linter by default (measured). Built-in route announcer: not verified.
