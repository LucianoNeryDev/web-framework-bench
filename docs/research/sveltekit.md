# SvelteKit (Svelte 5) research

Researched 2026-11-13. All versions and numbers are "as of 2026-11-13" unless stated. Claims from memory that sources contradicted were corrected (for example Rich Harris joined Vercel in 2021, not 2025).

## 1. Snapshot

| Item | Value | Source |
|---|---|---|
| `@sveltejs/kit` latest | 3.2.0, published 2026-11-10 (3.0.0 on 2026-10-01; a 2.70.4 backport shipped 2026-11-05) | `npm view @sveltejs/kit` dist-tags and time |
| `svelte` latest | 5.57.3, published 2026-10-26 (5.0.0 on 2024-10-19) | `npm view svelte` |
| `@sveltejs/adapter-node` | 6.0.2; `adapter-static` 4.0.1; `adapter-cloudflare` 8.0.2 | npm |
| `sv` CLI | 1.3.0 (1.0.0 on 2026-10-01) | npm |
| Vite / vite-plugin-svelte | 8.3.8 / 7.3.1 | npm |
| License | MIT (kit, svelte, adapters, devalue, sv) | npm `license` field; [GitHub API](https://github.com/sveltejs/svelte) |
| Stars | svelte about 88.8k, kit about 20.9k (2026-11-13) | `gh api repos/sveltejs/svelte` |

Governance and funding:
- Community-run open source, no foundation found. Rich Harris joined Vercel in November 2021 to work on Svelte full time; the announcement says "The governance of Svelte does not and will not change" ([Vercel, 2021-11-11](https://vercel.com/blog/vercel-welcomes-rich-harris-creator-of-svelte)). The "joined Vercel in 2025" hint is wrong.
- Vercel employs at least some core developers (the [SvelteKit 1.0 post](https://svelte.dev/blog/announcing-sveltekit-1.0) says two, as of 2022). A current statement of Vercel's role was not found. The Svelte team thanked "the Vercel security team" for help with disclosure in [Jan 2026](https://svelte.dev/blog/cves-affecting-the-svelte-ecosystem).
- Donations: [Open Collective](https://opencollective.com/svelte) (Vercel listed at $18,000 since Jul 2021) and [Drips](https://github.com/sveltejs/svelte/blob/main/FUNDING.json). No acquisition found.

## 2. Maintainability

Release cadence: kit had 58 npm releases between 2025-11-13 and 2026-11-13; svelte had 94 releases since 2025-11 (npm `time`, counted by script). Both ship patch and minor releases roughly weekly to fortnightly.

Support/LTS: no LTS or support-window policy found in docs, SECURITY.md (none present in kit or svelte repos) or the blog. In practice kit 2.x still receives releases after 3.0 (2.70.4 on 2026-11-05; whether these are security-only or general was not stated). Old Svelte majors get rare patches: svelte 4.2.20 on 2025-05-20; npm shows no 3.x release after 3.59.2 (2023-06-20), although [GHSA-gw32-9rmw-qwww](https://github.com/advisories/GHSA-gw32-9rmw-qwww) (2026-01) cites 3.59.2 as the fix.

Last three majors:

| Package | Major | Date | What broke | Tooling |
|---|---|---|---|---|
| kit | 1.0 | 2022-12-14 | n/a | n/a |
| kit | 2.0 | 2023-12-14 | `error()`/`redirect()` no longer thrown; cookie `path` required; Node 18.13, Svelte 4, Vite 5 minimums | `npx sv migrate sveltekit-2` ([guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-2)) |
| kit | 3.0 | 2026-10-01 | `svelte.config.js` removed (config goes in the `sveltekit()` Vite plugin); `$lib` becomes `#lib`; `$app/stores` removed; `csrf.checkOrigin` removed for `trustedOrigins`; tracing leaves `experimental`; Node >=22.17, TS 6, Svelte >=5.57.1, Vite >=8.0.12 | `npx sv migrate sveltekit-3 --tasks all --confirm` ([guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3), [release notes](https://github.com/sveltejs/kit/releases)) |
| svelte | 3.0 | 2019-04-21 | n/a | n/a |
| svelte | 4.0 | 2023-06-22 | smaller breaking set | `npx svelte-migrate svelte-4` (memory, not verified) |
| svelte | 5.0 | 2024-10-19 | runes, components no longer classes (`mount`/`hydrate`), snippets replace slots, stricter HTML | `npx sv migrate svelte-5`; legacy syntax still works and can be mixed ([guide](https://svelte.dev/docs/svelte/v5-migration-guide)) |

The Svelte 4 to 5 and kit 2 to 3 migrations touched the template syntax and project layout respectively, so each is a real project, not a bump. Kit 3 and Svelte 5.57 were announced in [SvelteKit 3 is here](https://svelte.dev/blog/sveltekit-3-is-here).

Type safety: TypeScript first-class (`sv create --types ts`); route types are generated into `.svelte-kit` (`svelte-kit sync`), `svelte-check` is in the scaffold; kit 3 requires TypeScript 6 ([release notes](https://github.com/sveltejs/kit/releases)).

Dependency tree, measured 2026-11-13 (Node v26.8.1, npm 11.19.0, plain environment, no global installs):
- Command: `npx --yes sv@1.3.0 create app --template minimal --types ts --no-add-ons --no-install`, then `npm install` in `app/` (scaffold devDependencies: adapter-auto 8.0.1, kit 3.2.0, vite-plugin-svelte 7.3.1, svelte 5.57.3, svelte-check 4.7.8, typescript 6.0.3, vite 8.3.8).
- Result: `npm ls --all --parseable | wc -l` = 56 (includes the root project, so 55 packages); lockfile 86 packages (85 unique names); `du -sm node_modules` = 76 MB.
- After `npm i -D @sveltejs/adapter-node` (6.0.2): `npm ls` parseable 56, lockfile 87 packages (86 unique names), 76 MB. Parseable count is unchanged because npm also dropped an extraneous `$app` entry (inferred).
- `npm audit` on the fresh scaffold reports 4 low findings: `deepmerge` prototype poisoning [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) (published 2026-09-18, no fix), pulled in by `@sveltejs/vite-plugin-svelte@7.3.1` (`deepmerge ^4.3.1`).

## 3. Analytics

- No first-party analytics module found in the Svelte docs; the [integrations page](https://svelte.dev/docs/kit/integrations) does not mention analytics, and `sv add` has no analytics add-on ([sv overview](https://svelte.dev/docs/cli/overview)).
- Conventional approach (inferred): paste a vendor script (Plausible, Umami, Cloudflare Web Analytics, GA) into `src/app.html`, or inject it via the `handle` hook's `transformPageChunk`; Vercel and Cloudflare offer platform analytics without app code.
- Not "from the box". Client-side route changes need manual page-view calls (`afterNavigate`), because SvelteKit does not reload the page ([accessibility doc describes the same client-nav behaviour](https://svelte.dev/docs/kit/accessibility)).

## 4. Monitoring and observability

- OpenTelemetry: built into kit since 2.31 (introduced in [Aug 2025](https://svelte.dev/blog/sveltekit-integrated-observability)); in kit 3 it is no longer experimental. Enable with `tracing: { server: true }` in the `sveltekit()` plugin, default off. Spans: `handle` (root `sveltekit.handle.root`), server and universal `load`, form actions, `+server` handlers, remote functions. You supply the SDK in `src/instrumentation.server.ts` (`@opentelemetry/sdk-node` etc.); `@opentelemetry/api` is an optional peer dependency. Docs warn tracing has nontrivial overhead and suggest dev/preview use ([observability docs](https://svelte.dev/docs/kit/observability)).
- Hooks: `handle`, `handleFetch`, `handleError`, `init`, `reroute`, `transport` ([hooks docs](https://svelte.dev/docs/kit/hooks)). `handleError` receives `app`, `framework`, `unknown` and `validation` kinds and must not throw; kit 3 runs all errors through it ([3.0.0 notes](https://github.com/sveltejs/kit/releases)).
- Logging: no built-in structured logger found; log in `handle`/`handleError` (inferred).
- Health checks: none built in; the adapter-node docs show a manual `/healthcheck` route only in a custom Express server ([adapter-node docs](https://svelte.dev/docs/kit/adapter-node)). A `+server` route is the obvious equivalent (inferred).
- Sentry: official SDK `@sentry/sveltekit` 11.12.0; npm peer range `@sveltejs/kit: 2.x || 3.x`. Sentry docs recommend kit 2.31+ for earliest init and use of kit's own spans, with `npx @sentry/wizard@latest -i sveltekit`. Fully supported on adapter-node and Vercel Node; Cloudflare supported with extra setup; non-Node runtimes unsupported ([Sentry docs](https://docs.sentry.io/platforms/javascript/guides/sveltekit/)). The page does not mention kit 3 explicitly; npm metadata does.

## 5. Robustness and security

Advisories, 2024-11 to 2026-11, from the [GitHub advisory database](https://github.com/advisories) (queried with `gh api advisories?affects=...`):

| Package | ID | Severity | Date | Issue, fixed in |
|---|---|---|---|---|
| kit | CVE-2024-53261 / 53262 | low | 2024-11-25 | XSS on dev 404 page; unescaped error message; 2.8.3 |
| kit | CVE-2025-32388 | medium | 2025-04-14 | XSS via tracked `search_params`; 2.20.6 |
| kit | CVE-2025-67647 (GHSA-j62c-4x62-9r35) | high | 2026-01-15 | DoS and possible SSRF when prerendering; kit 2.49.5, adapter-node 5.5.1 |
| kit | CVE-2026-22803 | high | 2026-01-15 | memory amplification in remote-function binary form parser; 2.49.5 |
| kit | GHSA-88qp-p4qg-rqm6, GHSA-vrhm-gvg7-fpcf | medium | 2026-02-19 | CPU/memory exhaustion in remote form deserialization (experimental); 2.52.2 |
| kit | CVE-2026-40073 (GHSA-2crg-3p73-43xp) | high | 2026-04-10 | adapter-node `BODY_SIZE_LIMIT` bypass; 2.57.1 |
| kit | CVE-2026-40074 | medium | 2026-04-10 | unvalidated redirect in `handle` causes DoS; 2.57.1 |
| kit | GHSA-hgv7-v322-mmgr | medium | 2026-05-21 | `query.batch` cross-talk; 2.60.1 |
| kit | GHSA-866w-xmhq-wj7x, GHSA-wqjv-9729-c5q2 | medium | 2026-07-24 | prototype pollution in remote file inputs; large remote form payload crashes Node; 2.69.1 |
| kit | CVE-2026-66062 | medium | 2026-08-07 | ReDoS in `Accept` content negotiation (unauthenticated DoS); 2.70.2 |
| kit | CVE-2026-114060 / 114061 | low | 2026-10-23 | open redirect via enhanced forms; XSS via `cache-control` in prerendered pages; 3.0.0 |
| svelte | CVE-2026-27119, 27121, 27122, 27125 | medium | 2026-02-19 | SSR XSS (`<option>`, spread attributes, `<svelte:element>` tag names, prototype keys); 5.51.5 |
| svelte | CVE-2026-27901 / 27902 | medium | 2026-02-26 | SSR XSS (contenteditable binds, hydration comment markers); 5.53.5 |
| svelte | CVE-2026-42567, 42573, 42599, GHSA-f3cj-j4f6-wq85 | medium | 2026-05-14 | ReDoS, DOM clobbering XSS, SSR spread XSS, `hydratable` serialization XSS; 5.55.7 |
| devalue | CVE-2025-57820 | high | 2025-08-26 | prototype pollution; 5.3.2 |
| devalue | CVE-2026-22774 / 22775 | high | 2026-01-15 | DoS in `parse`; 5.6.2 |
| devalue | CVE-2026-30226 | medium | 2026-03-12 | prototype pollution in `parse`/`unflatten`; 5.6.4 |
| devalue | CVE-2026-42570 | high | 2026-05-14 | DoS via sparse arrays; 5.8.1 |
| devalue | CVE-2026-81176, CVE-2026-92708 and 5 more | medium to high | 2026-09-17, 2026-10-01 | malformed input DoS; shared-memory serialization and `uneval` amplification; 5.9.2 / 5.9.3 |
| adapter-vercel | CVE-2026-27118 | medium | 2026-02-19 | cache poisoning; 6.3.2 |
| vite (dev server) | CVE-2025-24010 ... CVE-2026-39363/39364, CVE-2026-112946 | medium to high | 2025-01 to 2026-10 | repeated `server.fs.deny` bypasses, WebSocket file read (CVE-2026-39363, high), plus `launch-editor` command injection; dev-server only; 8.3.3 |

Reading: the volume is high for 2026 (about 15 kit/svelte/devalue advisories in H1 2026 alone), concentrated in SSR escaping, devalue deserialization and the experimental remote functions. All were patched quickly in point releases; the Svelte team published a [consolidated CVE post](https://svelte.dev/blog/cves-affecting-the-svelte-ecosystem) and said it will add earlier review processes. Vite items affect only the dev server.

Default protections:
- Template output is escaped; `{@html}` is the explicit escape hatch (inferred from the SSR XSS advisories all being edge cases such as spread, `<option>`, `<svelte:element>`).
- CSRF: built in. In production, form-type (or content-type-less) `POST/PUT/PATCH/DELETE` requests with a non-matching `Origin` are rejected; remote function calls require same origin, with no trusted-origin exception ([csrf.js source, kit 3.2.0](https://github.com/sveltejs/kit/blob/main/packages/kit/src/runtime/server/csrf.js)). Allow list: `csrf.trustedOrigins` ([config](https://svelte.dev/docs/kit/configuration)). Not enforced in dev.
- CSP: first-class `kit.csp` with `mode` hash/nonce/auto, `directives`, `reportOnly`; prerendered pages get a `<meta>` CSP with limited directives ([config](https://svelte.dev/docs/kit/configuration)). Other security headers: no defaults found.

Production server (adapter-node 6.0.2, read from source in `node_modules`):
- Handles `SIGTERM` and `SIGINT`: stops accepting, closes idle connections, waits for in-flight requests, force-closes after `SHUTDOWN_TIMEOUT` (default 30 s), emits `sveltekit:shutdown` ([docs](https://svelte.dev/docs/kit/adapter-node)).
- Request body cap `BODY_SIZE_LIMIT` default 512 kb. `KEEP_ALIVE_TIMEOUT` and `HEADERS_TIMEOUT` are optional with no documented default; no request timeout is set by the adapter (inferred from source: only those two plus Node defaults).
- Render errors: an error in `load`/render goes through `handleError` and returns a 500 error page or JSON by `Accept` header; the process keeps running. The handler catches unexpected failures and returns 500 (adapter-node 6.0.2 changelog, "returns a 500 instead of crashing"). No `uncaughtException` handler is installed (inferred from grep of the adapter source). Required env: set `ORIGIN` or `paths.origin`, otherwise CSRF and prerender origin may be wrong (kit 3.0 moved this to `kit.paths.origin`, with adapter-node still honouring `ORIGIN`).

## 6. Development effort

- Learning curve (inferred): small compiler framework with a compact template language, but Svelte 5 adds runes (`$state`, `$derived`, `$effect`, snippets), and legacy and runes syntax coexist, so tutorials from 2020 to 2024 are partly stale. Kit adds file-based routing, `load`, form actions, hooks and (experimental) remote functions.
- Docs: official site [svelte.dev](https://svelte.dev/docs) with interactive tutorial and playground; MCP server for agents announced [Nov 2025](https://svelte.dev/blog/whats-new-in-svelte-november-2025).
- DX: Vite HMR, `svelte-check`, VS Code extension, a11y warnings from the compiler ([accessibility doc](https://svelte.dev/docs/kit/accessibility)), `sv create`/`sv add`/`sv migrate`/`sv check`. Remote functions are still experimental: they need `experimental.remoteFunctions` and Svelte's experimental async compiler flag, and the team says they are "not quite" production-ready ([SvelteKit 3 is here](https://svelte.dev/blog/sveltekit-3-is-here), [docs](https://svelte.dev/docs/kit/remote-functions)).
- Community size, npm weekly downloads (2026-11-06 to 2026-11-12, [npm API](https://api.npmjs.org/downloads/point/last-week/svelte)): svelte 9.40M, kit 5.03M, adapter-node 1.62M, adapter-static 1.68M, adapter-cloudflare 0.59M, `@sentry/sveltekit` 0.53M. GitHub: about 413 contributors to svelte, about 443 to kit (contributors endpoint page count). Hiring pool is smaller than React/Vue/Angular (inferred; no hiring data found).
- State of JS 2025: the official pages did not render Svelte or SvelteKit figures in text ([front-end frameworks](https://2025.stateofjs.com/en-US/libraries/front-end-frameworks/)). The Svelte blog says only that Svelte "continues to hold the top spot among reactive frameworks in terms of positive sentiment" ([March 2026](https://svelte.dev/blog/whats-new-in-svelte-march-2026)). Numbers quoted by secondary sites conflict (retention 81% vs 91%), so they are not reported here.

## 7. Hosting and operations

| Target | Adapter | Notes |
|---|---|---|
| Static | `adapter-static` 4.0.1 with `prerender = true` in the root layout | options `pages`, `assets`, `fallback` (SPA, costs SEO), `precompress`, `strict` default true ([docs](https://svelte.dev/docs/kit/adapter-static)) |
| Node server | `adapter-node` 6.0.2 | env `PORT`/`HOST` (default 3000 on 0.0.0.0), `ORIGIN`, `BODY_SIZE_LIMIT`, proxy headers, `XFF_DEPTH`, `.env` not auto-loaded (`node --env-file`) ([docs](https://svelte.dev/docs/kit/adapter-node)) |
| Cloudflare | `adapter-cloudflare` 8.0.2 | builds for Workers Static Assets and Pages; bindings now via `import { env } from 'cloudflare:workers'`; `nodejs_als`/`nodejs_compat` flags ([docs](https://svelte.dev/docs/kit/adapter-cloudflare)) |
| Others | Vercel, Netlify, Bun, auto | `sv add sveltekit-adapter` ([CLI help](https://svelte.dev/docs/cli/overview)) |

Cloudflare direction: Cloudflare's guide now deploys SvelteKit to Workers with Static Assets and enables observability ([Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/sveltekit/)); the Pages guide is still live, updated 2026-04-21, with no deprecation notice ([Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/)). The migration page says Workers has a "distinctly broader set of features" ([Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)). An explicit "Pages is deprecated" statement was not found. Convergence post: [Cloudflare blog](https://blog.cloudflare.com/pages-and-workers-are-converging-into-one-experience) (title only, not read).

Memory footprint: no official guidance found. Vendor coupling is low: adapters are one config line, but Cloudflare needs Worker-compatible code (no Node-only APIs without `nodejs_compat`). Kit 3 needs Node >=22.17 on the server.

## 8. Other

- i18n: no built-in router i18n; official add-on `paraglide` (`sv add paraglide`) ([sv overview](https://svelte.dev/docs/cli/overview)); `lang` per page via `transformPageChunk` ([accessibility doc](https://svelte.dev/docs/kit/accessibility)).
- SEO: SSR by default, `<svelte:head>` for titles and meta, automatic trailing-slash redirects; sitemap is manual (`+server` endpoint), RSS and structured data not covered ([SEO doc](https://svelte.dev/docs/kit/seo)).
- Images: Vite asset hashing, plus official `@sveltejs/enhanced-img` 1.0.x (AVIF/WebP, srcset, intrinsic size, local files only) ([images doc](https://svelte.dev/docs/kit/images)).
- Content: `mdsvex` official add-on (`sv add mdsvex`); no content-collections layer; use `import.meta.glob` (inferred).
- Accessibility: compiler a11y warnings, live-region route announcements from `<title>`, focus reset to body after navigation ([doc](https://svelte.dev/docs/kit/accessibility)).
- Scaffolder: `sv create` with `--template minimal --types ts --no-add-ons` runs non-interactively; the default adapter is `adapter-auto`, swap for `adapter-node` or `adapter-static`.
