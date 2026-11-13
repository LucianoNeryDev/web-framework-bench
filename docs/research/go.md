# Go standard library (`net/http` + `html/template`): qualitative research

Research date: 2026-11-13. Every number is "as of 2026-11" unless dated otherwise. "Not found" means no primary source found.
Scope: the Go toolchain and standard library only. The benchmark's vanilla JS island is out of scope here; see htmx.md.

## 1. Snapshot

| Item | Finding |
|---|---|
| Current stable | Go 1.27.4 and Go 1.26.11, both 2026-11-10 ([release history](https://go.dev/doc/devel/release)) |
| Last three majors | 1.25 on 2025-08-12, 1.26 on 2026-02-10, 1.27 on 2026-08-19 ([release history](https://go.dev/doc/devel/release)). Two majors a year, February and August |
| License | BSD-3-Clause; 139.9k GitHub stars (`gh api repos/golang/go`, 2026-11-13) |
| Governance | Developed by the Go team at Google with a public proposal process: issues, weekly proposal-review meetings with public minutes, Go 1 compatibility as a hard constraint ([proposal repo](https://go.googlesource.com/proposal/)). A formal governance body outside Google: not found |
| Funding | Google employs the core team (widely stated; I found no primary page that states it, so treat as unverified) |
| Community | 16.4% of Stack Overflow 2025 respondents used Go ([SO 2025](https://survey.stackoverflow.co/2025/technology)); the 2025 Go survey had 5,379 respondents and 91% satisfaction, published 2026-01-21 ([secondary summary](https://gigazine.net/gsc_news/en/20260123-go-developer-survey-2025/), [Go blog](https://go.dev/blog/survey2025)). Go's share of websites (W3Techs): not found (fetch failed) |

## 2. Maintainability

**Compatibility promise.** "Programs written to the Go 1 specification will continue to compile and run correctly, unchanged" across Go 1.x point releases ([Go 1 compat](https://go.dev/doc/go1compat)). Behavior changes are gated by `GODEBUG` settings tied to the `go` line in `go.mod`; the 1.27 notes say old `GODEBUG` settings are being removed and a removed setting in `go.mod` now fails the build ([Go 1.27 notes](https://go.dev/doc/go1.27)).

**Support policy.** "Each major Go release is supported until there are two newer major releases"; critical and security fixes ship as minor revisions ([release policy](https://go.dev/doc/devel/release#policy)). On 2026-11-13 only 1.26 and 1.27 are supported; 1.25 (last patch 1.25.14, 2026-08-19) is not. In practice each release lives about a year, so an app needs a toolchain bump at least yearly to keep getting security fixes. Upgrading is usually a one-line `go.mod` change.

| Release | Relevant changes and breakage |
|---|---|
| 1.25 (2025-08) | `net/http.CrossOriginProtection` (CSRF defense via `Sec-Fetch-Site`), `runtime/trace` flight recorder, container-aware `GOMAXPROCS` ([notes](https://go.dev/doc/go1.25)) |
| 1.26 (2026-02) | Green Tea GC default (10-40% less GC overhead claimed); `ServeMux` trailing-slash redirects changed from 301 to 307; `net/url` rejects `host:80:80`; `ReverseProxy.Director` deprecated; `go fix` rewritten ([notes](https://go.dev/doc/go1.26)) |
| 1.27 (2026-08) | `encoding/json` backed by v2 (faster unmarshal, error text may change), `Response.Body` drains on close, `Server.MaxHeaderValueCount`, new vet `printf` check on wrapped error pointers, removed `asynctimerchan` and some TLS `GODEBUG`s, goroutine-leak profile GA ([notes](https://go.dev/doc/go1.27)) |

Migration tooling: `go fix` and `go vet` (rewritten in 1.26), the `toolchain` line in `go.mod` which auto-downloads a pinned toolchain, and `go mod tidy`.

**Dependency footprint.** Zero third-party modules are required for this benchmark: `net/http`, `html/template`, `encoding/xml` (RSS, sitemap), `embed` for assets, `log/slog` for logs. The compiled output is one static binary. The supply-chain surface is the Go toolchain itself, whose advisories appear in section 5. This is the smallest footprint of the server-side stacks.

## 3. Analytics

Not from the box. The standard library has no visitor analytics. Conventional: a privacy-friendly script (Plausible, Umami, Cloudflare Web Analytics) or log-based tools such as GoAccess reading access logs (not evaluated). If you want server-side counts, `expvar` counters or Prometheus counters on the request path are about ten lines, but they do not give referrers or unique visitors.

## 4. Monitoring and observability

| Facility | Facts |
|---|---|
| `log/slog` | Structured logging in the standard library since Go 1.21, with text and JSON handlers ([Go blog](https://go.dev/blog/slog)) |
| `expvar` | Blank import registers `/debug/vars` JSON with `cmdline` and `memstats`; anyone who can reach the path can read it ([pkg.go.dev/expvar](https://pkg.go.dev/expvar)) |
| `net/http/pprof` | Blank import registers `/debug/pprof/` (heap, goroutine, mutex, block, CPU profile, execution trace) on `DefaultServeMux`; use your own mux otherwise; GET-only since Go 1.22 ([pkg.go.dev](https://pkg.go.dev/net/http/pprof)). The package page carries no security warning, so bind it to localhost or a separate port |
| Runtime tracing | Flight recorder keeps the last seconds of a trace in memory (1.25); goroutine-leak profile GA in 1.27; `go tool trace -http` binds to localhost only ([1.25 notes](https://go.dev/doc/go1.25), [1.27 notes](https://go.dev/doc/go1.27)) |
| OpenTelemetry | Go traces and metrics are stable; logs are a release candidate ([OTel Go docs](https://opentelemetry.io/docs/languages/go/)); `opentelemetry-go` latest v1.47.0 (2026-10-02, [releases](https://github.com/open-telemetry/opentelemetry-go/releases)) |
| Prometheus | `prometheus/client_golang`, 6.0k stars ([repo](https://github.com/prometheus/client_golang)), external module |
| Sentry | Official `getsentry/sentry-go` ([repo](https://github.com/getsentry/sentry-go)), 1.1k stars |
| Health check | A handler you write; the contract's `/healthz` is three lines |

Everything beyond logs, pprof and expvar is opt-in and external. There is no built-in dashboard; the usual pairing is Prometheus + Grafana or an OTLP collector.

## 5. Robustness and security

**Standard-library advisories.** The Go vulnerability database lists 77 `stdlib` entries modified since 2024-11-01; 28 touch `net/http`, `net/textproto`, `html/template`, `net/http/httputil` or `mime/multipart` ([vuln.go.dev stdlib index](https://vuln.go.dev/index/modules.json), counted by script on 2026-11-13). The Go database does not publish CVSS scores, so I report no severities. Selected items:

| ID | Date | Package | Summary |
|---|---|---|---|
| CVE-2025-47910 | 2025-09 | net/http | `CrossOriginProtection` bypass patterns not limited to exact matches |
| CVE-2025-58186 | 2025-10 | net/http | No limit when parsing cookies, memory exhaustion |
| CVE-2026-27142 | 2026-03 | html/template | URLs in `meta content` attribute actions not escaped |
| CVE-2026-32289 | 2026-04 | html/template | `JsBraceDepth` context tracking bugs, XSS |
| CVE-2026-39826, CVE-2026-39823 | 2026-05 | html/template | Escaper bypass and `meta content` URL escaping bypass, XSS |
| CVE-2026-56858, CVE-2026-94448, CVE-2026-97030 | 2026-08 and 2026-10 | html/template | JS regexp and consecutive-expression context tracking fixes |
| CVE-2026-78659, -78663, -78669, -97032 | 2026-10-08 | net/http | HTTP/2 server memory exhaustion (Trailer headers), flow-control double refund, CPU use from window changes, HPACK encoder race crash |
| CVE-2026-94439, CVE-2026-56866 | 2026-10-08 | net/http | HTTP/1 connection desynchronization after CONNECT |
| CVE-2026-97054 | 2026-11-11 | net/http | HTTP/1 server crash due to `MaxBytesReader` header race |

Source for all rows: [vuln.go.dev](https://vuln.go.dev/ID/GO-2026-6599.json) style entries (IDs `GO-2025-3955`, `GO-2025-4012`, `GO-2026-4603`, `GO-2026-4865`, `GO-2026-4980`, `GO-2026-4982`, `GO-2026-6091`, `GO-2026-6599`, `GO-2026-6600`, `GO-2026-6603`, `GO-2026-6605`, `GO-2026-6612`, `GO-2026-6611`, `GO-2026-6613`, `GO-2026-6617`, `GO-2026-6859`). The 2026-10-08 and 2026-11-10 releases (1.27.2 and 1.27.4) carry fixes for `net/http` and, in October, `html/template` ([release history](https://go.dev/doc/devel/release#policy)). Two html/template XSS context-tracking fix rounds in five months show template escaping is mature but not finished.

**Defaults.** `html/template` does contextual autoescaping (HTML text, attributes, JS, CSS, URLs); `template.HTML` and similar types bypass it and must be trusted ([pkg.go.dev](https://pkg.go.dev/html/template)). CSRF: `http.CrossOriginProtection` (1.25) uses Fetch metadata, no tokens ([1.25 notes](https://go.dev/doc/go1.25)). No security headers or CSP by default; add them in middleware or the proxy. Go is memory-safe, so the buffer-overflow class that dominates nginx advisories does not apply, but HTTP/2 DoS bugs do.

**Attack surface vs static.** One Go process exposing HTTP; no database or admin UI in this benchmark's scope; a read-only blog needs no writable paths if assets are `embed`ded. Attack surface is the stdlib HTTP stack plus your handlers, typically behind a TLS-terminating proxy. A static site served by nginx has a smaller moving-part count but a C codebase; neither is "no attack surface".

## 6. Development effort

- **Learning curve**: low for the language (small spec), moderate for web idioms because the standard library gives primitives, not a framework: Go 1.22 pattern routing in `ServeMux`, `html/template` with `{{template}}` and blocks, manual layout composition. You write more glue than in Laravel or Hugo.
- **Docs**: excellent standard-library docs and `go doc`; official blog and Effective Go; the 2025 survey listed documentation/testing and learning modules as pain points ([summary](https://gigazine.net/gsc_news/en/20260123-go-developer-survey-2025/)).
- **DX**: fast compile, single binary, `go test` and `go vet` built in. Template errors surface at parse time or runtime, not compile time.
- **Hiring pool**: 16.4% of SO 2025 respondents; mostly backend engineers ([SO 2025](https://survey.stackoverflow.co/2025/technology)). Fewer people know `html/template` well than know Blade or WordPress themes.
- **Editing for non-developers**: none. Content is Markdown or JSON in the repo, rendered at start-up or build time. A CMS would be a separate project.

## 7. Hosting and operations

- **Must run**: one static binary (or a scratch/distroless container of roughly the binary size). No runtime, no database, no PHP-FPM. Put a TLS proxy (nginx, Caddy, or a cloud load balancer) in front, or use `ListenAndServeTLS` with your own cert handling.
- **Backups**: the repo; no state in this benchmark.
- **Upgrades**: rebuild with a new toolchain at least yearly; ship a new binary or image. 1.25's container-aware `GOMAXPROCS` helps in CPU-limited containers ([1.25 notes](https://go.dev/doc/go1.25)).
- **Resource needs**: see the benchmark's measured results; I did not find a vendor-neutral sizing figure.
- **Managed hosting**: any container or VPS host (Hetzner shared cloud from EUR 5.49/mo excl. VAT, [Hetzner](https://www.hetzner.com/cloud/)); no Go-specific CMS host.
- **Cloudflare Pages**: not compatible as a server. Pages serves static assets and Workers/Functions run JavaScript or Wasm, not a native Go binary ([Pages limits](https://developers.cloudflare.com/pages/platform/limits/)). To use Pages you would pre-render the site to files, which turns it into a static generator.
- **Contract note**: Go 1.26 changed `ServeMux` trailing-slash redirects to 307, so keep routes registered without trailing-slash patterns to satisfy "no route may redirect" ([1.26 notes](https://go.dev/doc/go1.26)).

## 8. Other

- **i18n**: no built-in message catalogs in the standard library; `golang.org/x/text` provides language matching, plural rules and message printing (not re-read in this pass).
- **SEO helpers**: none. Sitemap and RSS are `encoding/xml` code you write; meta tags are template markup.
- **Images**: `image/jpeg`, `image/png`, `image/gif` in the standard library; WebP only has a decoder in `golang.org/x/image/webp`, no encoder ([pkg.go.dev](https://pkg.go.dev/golang.org/x/image/webp)). The benchmark ships pre-optimized WebP, so no processing is needed. 1.26 replaced the `image/jpeg` codec, so encoded output may differ bit-for-bit ([1.26 notes](https://go.dev/doc/go1.26)).
- **Content model**: your structs; here, the shared `posts.json` loaded at start-up.
- **Accessibility**: template-driven, no help from the platform.

## Not found / unverified

- Primary source for Google funding the Go team; any formal governance body.
- CVSS severities for Go stdlib advisories (the Go DB does not publish them).
- Go's W3Techs share; `golang.org/x/text` details; GoAccess fit.
- A sizing guideline from a primary source.
