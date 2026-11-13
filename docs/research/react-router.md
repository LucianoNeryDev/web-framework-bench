# React Router v7/v8 (framework mode)

Researched 2026-11-13. Versions and numbers are "as of 2026-11" unless dated. Framework mode is the part of React Router that replaced Remix v2; the bench target uses it with SSR and prerender.

## 1. Snapshot

| Item | Value |
|---|---|
| Current stable | `react-router` 8.5.1, published 2026-10-27 ([npm registry](https://registry.npmjs.org/react-router)); `latest` dist-tag = 8.5.1, `version-7` tag = 7.18.5 (same day), `version-6` = 6.30.6 |
| Major 8.0.0 | 2026-06-17 ([npm time](https://registry.npmjs.org/react-router), [announcement](https://remix.run/blog/react-router-v8)) |
| Runtime requirements (v8) | Node >=22.22.0, React and React DOM >=19.2.7, Vite 7+ in framework mode; ESM-only ([upgrade guide](https://reactrouter.com/upgrading/v7), [announcement](https://remix.run/blog/react-router-v8)) |
| License | MIT ([npm](https://www.npmjs.com/package/react-router)) |
| Repo | [remix-run/react-router](https://github.com/remix-run/react-router), 56,635 stars (GitHub API, 2026-11-13) |

Governance and funding:
- Remix joined Shopify on 2022-10-31 ("joined forces", Shopify's "stewardship"; the post does not say "acquired"); stated commitment: keep running the project in the open, with long-term Shopify backing ([remix.run](https://remix.run/blog/remixing-shopify)).
- Remix v2 was merged into React Router v7 (planned Remix v3 became RR v7), announced 2024-05-15 ([blog](https://remix.run/blog/merging-remix-and-react-router)). The project moved from a founder-leader model to a Steering Committee with an RFC and staged feature process (stage 0 proposal to stage 5 stable). The initial SC is the seven Remix-team developers; community members may be added later ([GOVERNANCE.md](https://github.com/remix-run/react-router/blob/main/GOVERNANCE.md)). The seven are Shopify-employed (inferred: the blog footers say Shopify, Inc.).
- Remix 3 is a separate, non-React framework. npm shows `remix@3.0.0` on 2026-10-01 and `3.2.0` on 2026-11-04, MIT, Node >=24.3 ([npm](https://registry.npmjs.org/remix)). The RC post said final was planned for 2026-10-02 ([RC post](https://remix.run/blog/remix-3-release-candidate)); earlier posts said it forks Preact ([beta preview](https://remix.run/blog/remix-3-beta-preview)). No migration path from RR is claimed in sources I found. React Router stays React-based and is being actively released (8.5.1 and 7.18.5 on 2026-10-27).

## 2. Maintainability

Release cadence: very frequent. v7: 18 minors from 7.0.0 (2024-11-22) to 7.18.0 (2026-06-16). v8: 8.0.0 2026-06-17, then 8.1 (06-29), 8.2 (07-08), 8.3 (07-22), 8.4 (09-15), 8.5 (10-19) ([changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)). Patches ship in parallel on the v7 line (7.18.5). Features land as `unstable_` first and are stabilized in minors (middleware stable in 7.9.0; instrumentation stable in 7.15.0, 2026-05-05; RSC still unstable) ([changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)).

Support policy: v8 moves to a yearly major cadence ([announcement](https://remix.run/blog/react-router-v8), [GOVERNANCE.md](https://github.com/remix-run/react-router/blob/main/GOVERNANCE.md)). v6 and Remix v2 are End of Life: "no longer receiving security updates". v7 "will continue to receive security updates"; no end date given ([announcement](https://remix.run/blog/react-router-v8)). Node support: all Active LTS lines and only the latest minor of Maintenance LTS (22.22.x and 24.x at launch). No formal LTS programme beyond this: not found. Evidence the v6 line was patched after v7 shipped: 6.30.6 on 2026-08-18.

| Major | Date | What broke | Migration tooling |
|---|---|---|---|
| v6 | 2021-11-03 ([npm time](https://registry.npmjs.org/react-router)) | not re-verified here (from memory: Switch to Routes, relative routes) | not checked |
| v7 | 2024-11-22 | Merged Remix v2 and RR; framework mode (Vite); `react-router-dom` became a re-export; Node 20+ and React 18+ ([Remix migration](https://reactrouter.com/upgrading/remix), [v7 post](https://remix.run/blog/react-router-v7)) | v6: future flags then bump, guide at reactrouter.com/upgrading/v6 (page returned 404 when fetched 2026-11-13; unverified). Remix v2: enable all v2 flags, then `npx codemod remix/2/react-router/upgrade` ([guide](https://reactrouter.com/upgrading/remix)) |
| v8 | 2026-06-17 | Node 22.22+, React 19.2.7+, Vite 7+, ESM-only; `react-router-dom` removed; `data` renamed `loaderData` in `meta`/`matches`; Cloudflare dev proxy removed; middleware always on; four `v8_*` flags became default; `splitRouteModules` top-level and default ([announcement](https://remix.run/blog/react-router-v8), [upgrade guide](https://reactrouter.com/upgrading/v7)) | Future flags `v8_middleware`, `v8_splitRouteModules`, `v8_viteEnvironmentApi`, `v8_passThroughRequests`, `v8_trailingSlashAwareDataRequests` on latest v7, then bump. Announcement mentions no codemods ([upgrade guide](https://reactrouter.com/upgrading/v7)) |

Type safety: `react-router typegen` (and `--watch`) generates `.react-router/types/**/+types/<route>.d.ts` per route with `Route.LoaderArgs`, `Route.ComponentProps` etc.; `react-router dev` keeps them current; template script is `react-router typegen && tsc` ([docs](https://reactrouter.com/explanation/type-safety)). Types are route-config-driven, not inferred across `fetch`.

Dependency tree, measured 2026-11-13 on Node v26.8.1 / npm 11.19.0: `npx create-react-router@latest app --yes --no-git-init --no-install --no-agent-skills`, then `npm install`. The default template includes Tailwind (`tailwindcss`, `@tailwindcss/vite`) and cannot be disabled by a flag (inferred: no such option in `--help`). Resolved: react-router/@react-router/* 8.5.1, react 19.2.x, vite 8.0.x, typescript 5.9.3.

| Variant | `npm ls --all --parseable` entries | unique packages | `du -sm node_modules` |
|---|---|---|---|
| Default template (with Tailwind) | 190 | 175 by `node_modules` dirs; lockfile 211 unique names (222 name@version, includes other-platform optional binaries) | 124 MB |
| After `npm uninstall tailwindcss @tailwindcss/vite` | 167 | 159 unique paths; lockfile 195 name@version | 107 MB |

Largest installed: typescript 23 MB, `@rolldown` 21 MB, `@babel` 11 MB. A later re-install resolved newer react/vite patch versions (react 19.3.1, vite 8.3.8), so numbers drift slightly. v8 itself has only two runtime dependencies (`cookie-es`, `@remix-run/route-pattern`); `@react-router/dev` pulls Babel and lodash ([npm](https://registry.npmjs.org/react-router)). Scratch dir deleted.

## 3. Analytics

- Nothing first-party or official: no analytics module or integration found in the docs. Not "from the box".
- Conventional approach (inferred): add the provider's script/tag in `root.tsx`, or call it from `useLocation` effects or `clientLoader`s; the Instrumentation API (below) can send navigation timings. CSP nonces apply to inline scripts ([security how-to](https://reactrouter.com/how-to/security)).

## 4. Monitoring and observability

- OpenTelemetry: not built in. The Instrumentation API (stable since 7.15.0, 2026-05-05) takes an `instrumentations` array exported from `entry.server.tsx`, passed to `<HydratedRouter>` on the client, or to `createBrowserRouter`. Hooks: `handler.request`, router `navigate`/`fetch`, route `loader`/`action`/`middleware`/`lazy`. It is read-only and errors inside it are swallowed. The docs show a manual `@opentelemetry/api` span wrapper; they warn about runtime overhead ([docs](https://reactrouter.com/how-to/instrumentation), [changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)).
- Logging: `handleError` in `entry.server.tsx` logs server errors to the console by default; exporting it replaces the default. Thrown `Response`s do not reach it ([docs](https://reactrouter.com/api/framework-conventions/entry.server.tsx)). `react-router-serve` adds `morgan("tiny")` access logs ([source](https://github.com/remix-run/react-router/blob/main/packages/react-router-serve/cli.ts)).
- Health checks: no built-in endpoint; a resource route returning JSON is the documented pattern ([docs](https://reactrouter.com/how-to/resource-routes)).
- Sentry: official `@sentry/react-router` (latest 11.12.0; v10.78.0 on `v10` tag), framework mode, needs React Router 7.15.0 or later; setup via `npx sentry@latest init` (labelled experimental) or `npx @sentry/wizard@latest -i reactRouter` ([Sentry docs](https://docs.sentry.io/platforms/javascript/guides/react-router/), [npm](https://registry.npmjs.org/@sentry/react-router)).

## 5. Robustness and security

Advisories on [remix-run/react-router](https://github.com/remix-run/react-router/security/advisories) (GitHub API, 22 published; severity as GitHub rates it). Framework-mode-only unless noted:

| Date | ID | Sev | Issue (fixed in) |
|---|---|---|---|
| 2025-04-01 | CVE-2025-31137 / GHSA-4q56-crqp-v477 | high | URL manipulation via Host / X-Forwarded-Host (`@react-router/express`) |
| 2025-04-24 | CVE-2025-43864 / GHSA-f46r-rw29-r322 | high | DoS via cache poisoning by forcing SPA mode (7.2.0-7.5.1) |
| 2025-04-24 | CVE-2025-43865 / GHSA-cpj6-fhp6-mr6j | high | Pre-render data spoofing (7.0-7.5.1) |
| 2026-01-08 | CVE-2025-61686 / GHSA-9583-h5hc-x8cw | critical (CVSS 9.1) | File access via `createFileSessionStorage()` with unsigned cookies (`@react-router/node` <=7.9.3, `@remix-run/node` <=2.17.1) |
| 2026-01-08 | CVE-2025-59057, CVE-2026-21884, CVE-2026-22029 | high | XSS via Meta ld+json, ScrollRestoration, open redirects |
| 2026-01-08 | CVE-2026-22030 / GHSA-h5cw-625j-3rxh | medium | CSRF on document POST actions (<7.12.0; also Remix v2 <2.17.3) |
| 2026-06-02 | CVE-2026-42211 / GHSA-49rj-9fvp-4h2h | high | RCE via 2-step chain onto an app prototype-pollution bug (<=7.14.1) |
| 2026-06-02 | CVE-2026-42342, CVE-2026-34077 | high | DoS: unbounded `__manifest` path expansion; reflected input in single fetch |
| 2026-06-02 | CVE-2026-33244, CVE-2026-33245, CVE-2026-40181, CVE-2026-53663 | high/medium/low | Stored XSS in prerendered redirect HTML; RSC `javascript:` redirect; `//` open redirect; CSRF via PUT/PATCH/DELETE |
| 2026-07-22 | CVE-2026-55685 | high | Unauthenticated DoS in `__manifest` endpoint (<7.18.0) |
| 2026-07-22 | CVE-2026-53666, -53667, -53668, -53669, GHSA-qwww-vcr4-c8h2 | medium | Constructor injection via hydration; RSC XSS; open redirect to XSS; external redirect bypass; RSC CSRF (fixed 7.18.2 / 8.3.0) |

Pattern (inferred): about 20 advisories in 16 months, clustered in three disclosure batches (2026-01, 2026-06, 2026-07), centred on redirects, the `__manifest` route-discovery endpoint, and CSRF. Keep on the latest 7.18.x or 8.x. Remix v2 packages are EOL ([announcement](https://remix.run/blog/react-router-v8)).

Related runtimes: Vite dev-server advisories in the same window are many (for example CVE-2026-39364 `server.fs.deny` bypass high, CVE-2026-39363 arbitrary file read via dev WebSocket high; [GitHub advisories](https://github.com/advisories?query=ecosystem%3Anpm+vite)); dev only, not in production servers. React Server Components advisories (CVE-2025-55182 critical RCE, 2025-12-03; CVE-2026-126187 critical RCE, 2026-11-10; GitHub API) concern `react-server-dom-*`, which `@react-router/dev` lists as a peer for the unstable RSC mode only; applicability to RR's standard mode not established (inferred: not affected).

Default protections:
- CSRF: since 7.12.0 an origin check rejects document submissions to UI routes from external origins; `allowedActionOrigins` in `react-router.config.ts` permits others ([changelog 7.12.0](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)). In 7.18.0 the check uses the request URL `host`, which can break behind a reverse proxy without `trust proxy`; add the internal host to `allowedActionOrigins` (same changelog).
- Escaping: React's default JSX escaping; known bypasses are in the advisories above.
- CSP: nonce support via `<ServerRouter nonce>` plus React's render `nonce` option ([docs](https://reactrouter.com/how-to/security)); RSC mode needs manual nonce wiring ([RSC docs](https://reactrouter.com/how-to/react-server-components)). No security-header helper found beyond route `headers` exports.
- Production server: `react-router-serve` is Express 5 with compression, morgan, immutable cache for `/assets`; it disables `x-powered-by`. On SIGTERM/SIGINT it calls `server.close()` only: no explicit drain timeout or forced exit, no request or header timeout of its own ([source](https://github.com/remix-run/react-router/blob/main/packages/react-router-serve/cli.ts); inference for the rest). Render errors: shell errors go to `handleError` and the nearest `ErrorBoundary`; errors after streaming starts must be handled in `entry.server` (`onError`). `streamTimeout` (ms) rejects pending deferred promises; abort the React render a bit later ([docs](https://reactrouter.com/api/framework-conventions/entry.server.tsx)). No global uncaughtException handler found.

## 6. Development effort

- Learning curve: routing config in `app/routes.ts` (explicit; `@react-router/fs-routes` for file-based), route modules export `loader`/`action`/`Component`/`meta`/`links`. Three modes (declarative, data, framework) add conceptual surface. Docs at [reactrouter.com](https://reactrouter.com) are structured by mode with how-tos; some pages 404 for older paths (v6 upgrade page). Rapid change is the cost: v7 to v8 in 19 months, many `unstable_` APIs.
- DX: Vite HMR with React Refresh, automatic typegen, template includes a Dockerfile and `typecheck` script ([template package.json](https://registry.npmjs.org/create-react-router)). No dedicated devtools found.
- Pool, as of 2026-11-06..12 ([npm downloads API](https://api.npmjs.org/downloads/point/last-week/react-router)): `react-router` 74,675,214 per week (includes library-mode SPA users); `@react-router/dev` 3,880,241; `@react-router/serve` 1,711,639; legacy `remix` 80,281. The framework-mode figure is therefore closer to 2-4 million. GitHub 56,635 stars (React Router), 33,457 (remix-run/remix, now Remix 3).
- State of JS 2025: only an "Other meta-frameworks" mention row for React Router (rank 3, value 29, unlabeled); no usage/satisfaction/retention figures found ([stateofjs.com](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/)).
- Hiring (inferred): large, since the router is ubiquitous in React apps; framework-mode specifically is a smaller subset with Remix experience carrying over.

## 7. Hosting and operations

- Rendering modes in `react-router.config.ts`: `ssr: true` (default) with optional `prerender`; `ssr: false` + `prerender` gives static files (HTML plus `.data` per path in `build/client`); `ssr: false` alone is SPA mode. Constraints with `ssr: false`: no `action` or `headers` exports ([docs](https://reactrouter.com/how-to/pre-rendering)).
- Node: `react-router-serve` or a custom Express server; the default template ships a Dockerfile ([deploy docs](https://reactrouter.com/start/framework/deploying)). Memory guidance: not found; measure.
- Adapters: `@react-router/node`, `@react-router/express`, `@react-router/cloudflare`, `@react-router/architect`; Vercel via `@vercel/react-router` 1.3.7 (npm); Netlify supports RR 8 since 2026-06-18 ([Netlify](https://www.netlify.com/changelog/2026-06-18-react-router-8-support.md)). Docs list Cloudflare Workers, Vercel, Netlify as provider-maintained guides.
- Cloudflare: the official guide targets Workers via `@cloudflare/vite-plugin` (`npm create cloudflare@latest -- app --framework=react-router`); no Pages guide (the Pages URL returned 404 on 2026-11-13). SPA mode is not supported with the Cloudflare Vite plugin; prerender works on v8 (7.13.1+ with a flag) ([Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router/)). Cloudflare says Workers has a broader feature set than Pages and gives a Pages migration guide, without declaring Pages deprecated ([Cloudflare](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)). A static build (`ssr: false` + prerender) can be served from any static host including Pages.
- Vendor coupling: low; web-standard Request/Response, Vite, no required host. Shopify controls the maintainers (see section 1).

## 8. Other

- i18n: no built-in; not found in docs (inferred: use i18next-style libraries).
- SEO: `meta` export per route and `links`; sitemap and RSS via resource routes returning XML ([docs](https://reactrouter.com/how-to/resource-routes)); no built-in generator.
- Images: no image component or optimizer found (inferred: use Vite asset handling or a CDN).
- Content: no content collections; Markdown/MDX through Vite plugins (inferred) or a loader reading files.
- Accessibility: no dedicated tooling found; `<Link>`/`NavLink` set `aria-current`, `ScrollRestoration` and focus handling exist (not verified here).
- Agent skill: `create-react-router` can install a React Router agent skill since 8.1.0 (`--no-agent-skills` opts out) ([changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)).
