# Angular with @angular/ssr: research notes

Researched 2026-11-13. All versions and counts are "as of 2026-11" unless stated. Items marked "inferred" are my reading, not a source statement.

## 1. Snapshot

| Item | Value | Source |
|---|---|---|
| Stable `@angular/core` | 22.2.6, published 2026-11-12 (`latest`); 22.3.0-rc.0 on `next` | [npm registry](https://registry.npmjs.org/@angular/core) |
| Major 22.0.0 | 2026-06-03 | [angular CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md) |
| `@angular/ssr` | 22.2.7, published 2026-11-12 | [npm registry](https://registry.npmjs.org/@angular/ssr) |
| `@angular/cli` | 22.2.7 | [npm registry](https://registry.npmjs.org/@angular/cli) |
| Runtime requirement (v22) | Node `^22.22.3 \|\| ^24.15.0 \|\| >=26`, TypeScript `>=6.0 <6.1` | [version compatibility](https://angular.dev/reference/versions) |
| License | MIT (core, ssr, cli, `angular/angular` repo) | npm `license` field, [repo](https://github.com/angular/angular) |
| Governance | Google. Source headers read "Copyright Google LLC"; security reports go through the Google Open Source Software Vulnerability Reward Program | [SECURITY.md](https://github.com/angular/angular/blob/main/SECURITY.md) |
| Foundation / funding | No foundation. Funding is Google's own team budget; no separate funding statement found ("not found") | - |

## 2. Maintainability

**Cadence and support.** The release page now says a major ships roughly every 12 months with 4 to 6 minors per major, and each major is supported 24 months: 12 Active, then 12 LTS (critical fixes and security patches only). Before v22 the cadence was two majors a year with 18 months of support. The change was announced with 22.1 (v23 is due June 2027, not November 2026) ([releases](https://angular.dev/reference/releases), [Ninja Squad on 22.1](https://blog.ninja-squad.com/2026/07/29/what-is-new-angular-22.1)). Deprecated APIs stay for at least one major (about a year) ([releases](https://angular.dev/reference/releases)).

| Major | Released | Active ends | LTS ends |
|---|---|---|---|
| v22 | 2026-06-03 | 2027-06 | 2028-06 |
| v21 | 2025-11-19 | 2026-06-03 | 2027-06 |
| v20 | 2025-05-28 | 2025-11-19 | 2026-11-28 |
| v19 | 2024-11-19 | - | ended (page says v2 to v19 "no longer supported") |

Source: [releases](https://angular.dev/reference/releases); dates also in the [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md). A v19 app gets no security patches: advisories list "End of Support / LTS expired; will not be patched" for `<= 19.2.25` ([GHSA-jfgx-762w-99vr](https://github.com/angular/angular/security/advisories/GHSA-jfgx-762w-99vr)). v20 reaches end of LTS in about two weeks.

**Last three majors (v20, v21, v22) and v19 for context**

| Major | What broke | Migration |
|---|---|---|
| v19 (2024-11-19) | Standalone components, directives and pipes are the default (`standalone: false` for NgModule members); TypeScript < 5.5 dropped; `effect` timing changed; CSS selector parsing changed ([CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)) | `ng update` adds `standalone: false` automatically |
| v20 (2025-05-28) | Node 18 and 22.0 to 22.10 dropped; TypeScript < 5.8 dropped; `InjectFlags`, `TestBed.get`, `TestBed.flushEffects` removed; template `in`/`void` are operators and parentheses are respected; zoneless API renamed `provideZonelessChangeDetection` ([CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)) | `ng update` schematics |
| v21 (2025-11-19) | Zone-based change detection no longer provided by default (migration adds `provideZoneChangeDetection`); new apps are zoneless; Vitest configured for new projects; `bootstrapApplication` needs a `BootstrapContext` on the server (the fix for the platform-injector race, see section 5); TypeScript < 5.9 dropped ([CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md), [CLI CHANGELOG](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)) | `ng update` migrations incl. a schematic that rewrites `main.server.ts`; `jasmine-to-vitest` schematic |
| v22 (2026-06-03) | Components with no `changeDetection` are `OnPush` by default (`ChangeDetectionStrategy.Eager` keeps the old behaviour); TypeScript < 6.0 dropped; Node 20 dropped; `paramsInheritanceStrategy` default now `'always'`; `ComponentFactoryResolver` and `provideRoutes` removed; SSR returns 400 for an unrecognised `Host` instead of falling back to CSR; webpack builders and `CommonEngine` deprecated; `@Service` decorator added ([CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md), [CLI CHANGELOG](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)) | `ng update` adds `Eager` where needed, a trusted-proxy-headers migration and a Karma-to-Vitest migration; interactive [update guide](https://angular.dev/update-guide) |

**Type safety.** TypeScript 6.0 is required in v22 and makes `strict` default to `true` ([TypeScript 6.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)); the 22.0 CLI relies on that default for generated workspaces, and `strictTemplates` is on by default ([CLI CHANGELOG](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)). The scaffold's `tsconfig.json` has no explicit `strict` key (verified), so strictness comes from the TS 6 default (inferred). Templates are type-checked by the Angular compiler. Angular pins TypeScript to one minor (`>=6.0.0 <6.1.0`), so every TS minor needs an Angular release.

**Dependency footprint (measured).** Date 2026-11-13, Node v26.8.1, npm 11.19.0, Linux, plain environment, no global installs. Commands in an empty scratch dir:

```
npx -y @angular/cli@22.2.7 new fieldnotes --ssr --style=css --routing --skip-git --defaults --skip-install
cd fieldnotes && npm install
```

| Metric | Result |
|---|---|
| `npm install` | "added 367 packages", 0 vulnerabilities, 3m10s wall (network-bound on this host) |
| `npm ls --all --parseable \| wc -l` | 368 entries (includes the project root) |
| Unique package names | 334 (distinct trailing `node_modules/<name>` paths, excluding the root) |
| `npm ls --omit=dev --all --parseable \| wc -l` | 96 entries (runtime tree) |
| `du -sm node_modules` | 324 MB |
| Top-level dirs in `node_modules` | 262 |
| `npm run build` | 36 s; output `dist/` about 2 MB; initial browser JS 256 kB raw, 71.5 kB transfer (starter placeholder page) |

Scaffold dependencies: `@angular/*` 22.2.x, `express ^5.1.0`, `rxjs ~7.8.0`, `typescript ~6.0.2`, `vitest ^5.0.0`, `jsdom ^30.0.0`; no `zone.js`. npm 11.19 skipped install scripts for esbuild, lmdb and msgpackr-extract ("allowScripts" warning) and the build still succeeded. The scaffold set `RenderMode.Prerender` for `**` and `provideClientHydration()` with no extra features. Scratch dir deleted afterwards.

## 3. Analytics

- Nothing first-party or official: no analytics module in Angular, the CLI or `@angular/ssr`; the Angular docs have no analytics guide (not found in docs or search).
- Conventional approach: load the vendor tag (Google Analytics `gtag.js`, Plausible, etc.) in `index.html`, and send a page view from a `Router` `NavigationEnd` subscription, since the SPA router does not reload the page. Community packages wrap this (e.g. `ngx-google-analytics`) ([search results, third-party](https://github.com/hakimio/ngx-google-analytics)).
- Google-adjacent: `@angular/fire` is the Angular Firebase library, maintained under the `angular` GitHub org. It is at 21.0.0 with peer `@angular/core ^21.2.0` and `typescript <6.0`, so it does not yet declare support for Angular 22 ([npm](https://registry.npmjs.org/@angular/fire)). Whether its analytics module is current: not verified.
- "From the box": no. Everything is added by the project.
- Server-side hit counting (what the bench likely needs) is an Express middleware or a proxy log in this stack (inferred), since the Express server is project code.

## 4. Monitoring and observability

- OpenTelemetry: no built-in support and no official Angular OTel guide found. Browser tracing uses the generic OTel JS web SDK, usually with `@opentelemetry/context-zone` for zone apps; the zoneless default makes the zone context manager unnecessary (third-party write-ups: [Last9](https://last9.io/blog/implement-opnetelemetry-angular), [OneUptime](https://oneuptime.com/blog/post/2026-02-06-instrument-angular-opentelemetry-web-sdk/markdown)). Server side is the stock Node SDK with `@opentelemetry/instrumentation-express`, loaded before Express is imported ([OneUptime](https://oneuptime.com/blog/post/2026-02-06-fix-express-imported-before-otel-setup/view)). No SSR render-time span exists out of the box (inferred: no hook found in `@angular/ssr`).
- Logging and health checks: none built in. The Express `server.ts` is where `/healthz` and request logging go ([scaffold `server.ts`, verified](https://angular.dev/guide/ssr)).
- Sentry: package `@sentry/angular` 11.12.0 (2026-11-10); peer range `@angular/core >=14 <=22`. Setup is `Sentry.init()` plus `Sentry.createErrorHandler()` as the `ErrorHandler` provider and a trace service. Sentry states "The Sentry Angular SDK can only be used in the browser" and warns not to pass the Sentry providers to the SSR config, so server errors need `@sentry/node` separately ([Angular setup](https://docs.sentry.io/platforms/javascript/guides/angular/), [manual setup](https://docs.sentry.io/platforms/javascript/guides/angular/manual-setup/), [npm](https://registry.npmjs.org/@sentry/angular)).
- Angular DevTools: Chrome and Firefox extension for component tree, profiler, DI and signal graph; 22.1 added signal-graph search and a transfer-state panel ([DevTools](https://angular.dev/tools/devtools), [Ninja Squad](https://blog.ninja-squad.com/2026/07/29/what-is-new-angular-22.1)).

## 5. Robustness and security

**Advisories, 2024-11 to 2026-11.** `angular/angular` lists 40 published advisories in that window: 1 critical, 29 high, 10 medium; all dated 2025-09-10 or later ([GitHub list](https://github.com/angular/angular/security/advisories), counted with `gh api`). `angular/angular-cli` lists 8: 1 critical, 2 high, 4 medium, 1 low ([GitHub list](https://github.com/angular/angular-cli/security/advisories)). Two of the CVE IDs have six-digit sequence numbers (CVE-2026-111751 to 111754); I copied them as GHSA shows them. Selected, SSR-relevant:

| ID | Severity | Issue |
|---|---|---|
| [CVE-2025-59052](https://github.com/angular/angular/security/advisories/GHSA-68x2-mx4q-78m7) | high | Global platform injector race: cross-request data leakage in SSR. Fixed in ssr 19.2.16, 20.3.0, 21.0.0-next.3; needs `BootstrapContext` change |
| [CVE-2025-62427](https://github.com/angular/angular-cli/security/advisories/GHSA-q63q-pgmf-mxhr) | high | SSRF in `@angular/ssr` |
| [CVE-2026-27739](https://github.com/angular/angular-cli/security/advisories/GHSA-x288-3778-4hhx) | critical | SSRF and header injection in Angular SSR; v18 and older not patched |
| CVE-2026-27738, CVE-2026-44437, CVE-2026-33397 | medium | Open redirect via `X-Forwarded-Prefix` / backslash URLs in SSR ([list](https://github.com/angular/angular-cli/security/advisories)) |
| CVE-2026-41423, CVE-2026-46417, CVE-2026-50168, [CVE-2026-88056](https://github.com/angular/angular/security/advisories/GHSA-f6mr-pjwc-34m4) | high | `@angular/platform-server` SSRF: URL parsing, hostname hijack, allowlist bypass |
| CVE-2026-50555/50556, [CVE-2026-69149](https://github.com/angular/angular/security/advisories/GHSA-vpx6-8pjr-4g3v), CVE-2026-88058/88060 | high | SSR XSS from missing escaping of `<noscript>`, `<template>`, processing instructions, raw-content elements |
| CVE-2025-66412, CVE-2026-22610 | high | XSS via SVG animation/script and MathML attributes (sanitiser bypass) |
| CVE-2026-27970, CVE-2026-32635, CVE-2026-69151 | high | XSS in i18n and i18n attribute bindings |
| CVE-2026-68945, CVE-2026-54266, CVE-2026-50170 | high | `HttpTransferCache` key collisions or credentialed-request caching: cross-request leak |
| CVE-2026-101895/101896, CVE-2026-111751/111752 | high | SSR denial of service: malformed DOCTYPE, numeric matrix params, RouterLink query params, empty-path outlet matching |
| CVE-2025-66035, CVE-2026-111753 | high | HttpClient XSRF token leak via URL parsing |
| [GHSA-w34w-96hf-98hj](https://github.com/angular/angular-cli/security/advisories/GHSA-w34w-96hf-98hj) | high | Code injection in generated server manifests (`@angular/build`), 2026-10-28 |

Also: two Angular Language Service VS Code extension advisories (critical CVE-2026-49241, high CVE-2026-50178) and a DevTools local DoS (CVE-2026-101897). Pattern: the SSR and SSRF/host-header surface produced most high-severity findings in 2026, and several fixes are SSR-only breaking changes. Inferred: the volume partly reflects active security review plus AI-assisted bug hunting, not necessarily worse code.

**Default protections.**
- Template bindings are escaped and `innerHTML`, URL, style and resource-URL contexts are sanitised; `DomSanitizer.bypassSecurityTrust*` opts out ([security guide](https://angular.dev/best-practices/security)).
- XSRF: `HttpClient` sends `X-XSRF-TOKEN` from the `XSRF-TOKEN` cookie on mutating same-origin requests; the server must issue and check it ([security guide](https://angular.dev/best-practices/security)).
- CSP: `ngCspNonce` attribute or `CSP_NONCE` token; `security.autoCsp` in the workspace config hashes inline scripts for static hosts. Trusted Types policies `angular`, `angular#bundler` etc. are supported ([security guide](https://angular.dev/best-practices/security)).
- SSR host validation (v22): `Host`, `X-Forwarded-Host`, `Forwarded` are checked against `allowedHosts` (angular.json `security`, engine option, or `NG_ALLOWED_HOSTS`); unknown hosts get 400; `X-Forwarded-*` are stripped unless `trustProxyHeaders` / `NG_TRUST_PROXY_HEADERS` is set ([security guide](https://angular.dev/best-practices/security)). Bench consequence: the harness hostname must be allowed (inferred; Wrangler notes the same for `localhost`).
- No generic security-header helper (HSTS, X-Frame-Options) found; those go in Express (not found in docs).

**Production server behaviour.**
- The scaffold `server.ts` is plain Express 5: `app.listen`, no SIGTERM/SIGINT handler, no request or keep-alive timeout, no `server.close()` drain (verified in the scaffold). Express documents graceful shutdown as an application task ([Express guide](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html)). Inferred: SIGTERM ends the Node process immediately, dropping in-flight renders.
- Render errors: `AngularAppEngine` streams the HTML. An error before the first chunk rejects `handle()`, and the scaffold's `.catch(next)` sends it to Express's default 500 handler; an error mid-stream calls `controller.error`, aborting the response after headers are sent ([`app.ts`](https://github.com/angular/angular-cli/blob/main/packages/angular/ssr/src/app.ts)). The render is abandoned when the request aborts (`request.signal`); no render-timeout option found.
- Uncaught exceptions outside a request, or unhandled promise rejections, terminate Node (Node default; the v20 changelog warns rejections can shut down the SSR process: `PendingTasks.run` note in the [CHANGELOG](https://github.com/angular/angular/blob/main/CHANGELOG.md)).
- Server-side `HttpClient` responses are capped by `maxResponseBodySize`, default 1 MB ([SSR guide](https://angular.dev/guide/ssr)).

## 6. Development effort

- Learning curve: steep versus the other targets. A framework with DI, signals, templates with their own syntax (`@if`, `@for`, `@defer`), RxJS in HttpClient/Router, and a config-heavy CLI. The v19 to v22 changes (standalone, signals, zoneless, signal forms, `@Service`, OnPush default) mean tutorials from before 2025 are partly stale (inferred).
- Docs: [angular.dev](https://angular.dev) is complete and current for v22 (guides, API reference, update guide, interactive tutorials). Coverage gaps I hit: SSR guide has no error-handling, timeout or Cloudflare notes; a11y page does not state `@angular/aria` stability.
- DX: TypeScript-first, template type checking, schematics (`ng generate`), `ng update`, esbuild-based `@angular/build` application builder with Vite dev server (22.1 added Rolldown chunk optimisation, [Ninja Squad](https://blog.ninja-squad.com/2026/07/29/what-is-new-angular-22.1)), Vitest by default for new projects, Angular DevTools, an MCP server in the CLI. HMR for templates/styles: not verified here.
- Community pool (npm weekly downloads, 2026-11-06 to 2026-11-12, from [npm API](https://api.npmjs.org/downloads/point/last-week/@angular/core)): `@angular/core` 8,209,049; `@angular/cli` 7,341,384; `@angular/ssr` 731,479; `zone.js` 8,106,149 (legacy apps still carry it); `@sentry/angular` 686,239; `@angular/fire` 181,635.
- GitHub stars (2026-11-13): `angular/angular` 101,487; `angular/angular-cli` 27,017; `angular/angularfire` 7,795.
- State of JS 2025: the front-end frameworks page loads its charts client-side, so I could not read Angular's usage, satisfaction or retention numbers ("not found"). The page text says usage rankings were unchanged ([State of JS 2025](https://2025.stateofjs.com/en-US/libraries/front-end-frameworks/)). Third-party figures (71% satisfaction, 65% retention) were not verified, so I do not use them.

## 7. Hosting and operations

- Modes: `outputMode: "static"` in `angular.json` gives a fully static app, no server file. The default (`"server"`) emits a browser bundle, a Node server bundle (`server.mjs`) and prerendered pages. Per route: `RenderMode.Prerender` (SSG, with `getPrerenderParams` for dynamic routes), `Server` (SSR), `Client` (CSR); per-route `headers` and `status` ([SSR guide](https://angular.dev/guide/ssr)).
- Server runtimes: Node via `AngularNodeAppEngine` + Express (scaffold); other runtimes via `AngularAppEngine` and `createRequestHandler` with standard `Request`/`Response` ([SSR guide](https://angular.dev/guide/ssr)). `CommonEngine` is deprecated in v22 ([CLI CHANGELOG](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)). No adapter system: you own `server.ts`.
- Hydration: `provideClientHydration()`; incremental hydration with event replay is on by default and `withNoIncrementalHydration()` opts out; i18n components skip hydration unless `withI18nSupport()` ([hydration guide](https://angular.dev/guide/hydration)).
- Cloudflare: Cloudflare's Angular guides (2026-04) cover the static build only: Workers Assets from `dist/browser` via `wrangler deploy` auto-config or C3 `--framework=angular`, plus a Pages guide (`--platform=pages`) ([Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/angular/), [Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-angular-site/)). Neither mentions SSR. No official Cloudflare adapter for `@angular/ssr` found; SSR on Workers is possible through `AngularAppEngine` plus a hand-written fetch handler, and a Wrangler note says `allowedHosts: ["localhost"]` is needed locally ([Wrangler release note, secondary](https://newreleases.io/project/github/cloudflare/workers-sdk/release/wrangler@4.68.1)). Cloudflare's docs lead with Workers and have a [Pages to Workers migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) (updated 2026-11-12) saying Workers can host SSR; I found no explicit Pages end-of-life statement. For this bench, static Angular is a straightforward Cloudflare fit; server mode is a Node container.
- Memory footprint: no official guidance found. Measure it (the bench does). Inferred: a Node + Express process with the app bundle held in memory, plus per-request app instances (the cause of the shared-state advisories).
- Vendor coupling: Google drives the roadmap, but the output is plain Node/Express or static files with no host lock-in. Firebase hosting is a documented path (the scaffold comments mention Firebase Cloud Functions via `reqHandler`).

## 8. Other

- i18n: built in. `@angular/localize` with `$localize`/`i18n` attributes, extract-and-merge translation files, and one build per locale (compile-time); ICU message formats supported. Hydration skips i18n components unless `withI18nSupport()`. Details are in sub-pages I did not read ([i18n guide](https://angular.dev/guide/i18n)). The 2026 advisories show i18n/ICU as a recent XSS surface (section 5).
- SEO: `Title` and `Meta` services in `@angular/platform-browser`; the router has a `title` route property and `TitleStrategy`. SSR/prerender gives crawlable HTML. No sitemap or RSS helper found: the bench's `/rss.xml` and `/sitemap.xml` are Express routes or build-time scripts (inferred).
- Images: `NgOptimizedImage` (`ngSrc`): lazy by default, `priority` sets `fetchpriority=high` and an SSR preload hint, automatic `srcset`, placeholders, built-in loaders for Cloudflare, Cloudinary, ImageKit, Imgix, Netlify; requires `width`/`height` or `fill`; no `<picture>` support ([image guide](https://angular.dev/guide/image-optimization)).
- Content tooling: none built in (no content collections or Markdown pipeline). The bench's pre-rendered `html` field can be bound with `[innerHTML]` (sanitised, so it strips unsafe markup; inferred to need `bypassSecurityTrustHtml` for trusted content that the sanitiser alters).
- Accessibility: `@angular/cdk/a11y` (`LiveAnnouncer`, `cdkTrapFocus`), `@angular/aria` headless directives (accordion, combobox, listbox, menu, tabs, toolbar; stability stated as stable in secondary v22 coverage only), `ariaCurrentWhenActive` on `RouterLinkActive`. The router does not announce navigation or move focus; you do it on `NavigationEnd`. Template a11y lint rules come from `angular-eslint` (specific rules not listed in the page) ([a11y guide](https://angular.dev/best-practices/a11y)).
- Testing: Vitest is the default runner for new projects (since v21); a Karma-to-Vitest migration ships in v22 ([CLI CHANGELOG](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)).
