# Go target (go and go-htmx)

One image, `wfb/go:server`, serves two benchmark targets chosen by `WFB_INTERACTIVITY`:
`vanilla` is target `go`, `htmx` is target `go-htmx`.

## Versions
- Go 1.27.4 (`golang:1.27.4-alpine` build stage), standard library only: `net/http` (Go 1.22+ ServeMux patterns),
  `html/template`, `text/template`, `encoding/json`, `embed`. No third-party modules, so there is no `go.sum`
  (`go.mod` only; go would create `go.sum` on the first dependency).
- Final image: `gcr.io/distroless/static-debian12:nonroot`, one static binary (`CGO_ENABLED=0 -trimpath -ldflags "-s -w"`).
- htmx 2.0.11 (`apps/go/static/htmx.min.js`, sha256 `d6fdc75f204e6bdefa99b69bf1e6d4ac69b8a364f77929f45c13476b4000f717`,
  from `unpkg.com/htmx.org@2.0.11/dist/htmx.min.js`), embedded with `go:embed` and served at `/htmx.min.js` in htmx mode only.
  htmx 4.0.1 is the newest release; 2.0.11 is the last 2.x, as the brief asked.

## Modes
Single mode, `server`. Image `wfb/go:server`, port 8080.

```bash
docker build -f apps/go/Dockerfile --target server -t wfb/go:server .
docker run -d --name wfb-go       -e WFB_INTERACTIVITY=vanilla -p 18171:8080 wfb/go:server
docker run -d --name wfb-go-htmx  -e WFB_INTERACTIVITY=htmx    -p 18172:8080 wfb/go:server
node bench/conformance.mjs http://localhost:18171 --server
node bench/conformance.mjs http://localhost:18172 --server
```
Environment: `WFB_INTERACTIVITY` (`vanilla` default, or `htmx`), `WFB_DATA` (posts.json, default `/app/posts.json`),
`WFB_PUBLIC` (shared/public, default `/public`), `WFB_ADDR` (default `:8080`).

## Implementation decisions
- **Start-up**: templates (embedded with `go:embed`, one parse per page set) and `posts.json` (typed structs, slug index,
  resolved prev/next/related, lower-cased search string, RFC 822 date) are loaded once. Nothing rendered is cached: every
  HTML page, `/rss.xml` and `/sitemap.xml` is executed per request into a buffer (so a template error becomes a 500).
- **Routing**: `GET /{$}`, `GET /blog`, `GET /blog/{slug}`, `GET /about`, `GET /rss.xml`, `GET /sitemap.xml`, `GET /healthz`,
  static files, and a catch-all `/` that renders the 404 page with status 404. Unknown slugs and missing static files also
  get the 404 page. No redirects anywhere.
- **Static files**: `shared/public/` is copied into the image at `/public` and served from disk (`http.ServeFileFS`, regular
  files only, no directory listings), not embedded: `go:embed` cannot reach outside `apps/go`, and copying keeps the shared
  files out of the app directory. Templates and htmx are embedded because they belong to the app.
- **Filtering** (`/blog?q=&tag=`): the tag must be in the post's tags and the trimmed, lower-cased query must be a substring of
  `title + " " + summary`; order stays newest first. The input value, pressed chip, count and empty state are rendered by the
  server, so the form works without JavaScript (the chips are `type=button`, as in the reference markup).
- **vanilla**: renders every card and marks the non-matching ones `hidden`. app.js builds its card list from the DOM and takes
  the total from it, so rendering only the matches would make its count and chips wrong after load. The checker's visible-card
  count matches. The page loads `/app.js` exactly like the reference, and the form carries `data-filters`.
- **htmx**: the form has `hx-get="/blog"`, `hx-trigger="input changed delay:250ms, submit"`, `hx-target="#results"` and
  `hx-replace-url="true"`, no `data-filters`, and `action`/`method` kept. Each chip has its own `hx-get` (`/blog?tag=<slug>`,
  `hx-include="#q"`); a hidden `tag` input keeps the active tag in the next search request. The server returns only a fragment
  when `HX-Request: true` (and the request is not a history restore, which needs a full page): the count, the matching cards
  and the empty state for `#results`, plus the chip group as an out-of-band swap so `aria-pressed` follows. In this mode only
  matching cards are rendered. `Vary: HX-Request` is set on `/blog`. app.js is still loaded for the theme toggle.

## Deviations from the contract
- None that the checker sees. In htmx mode the replaced URL keeps empty parameters (`/blog?tag=go&q=`) because htmx sends
  the empty search value; the server treats them as absent. In vanilla mode a filtered `/blog` response contains all 40
  cards, 27 of them `hidden`, so its HTML is larger than a response with only the matches.

## Native capabilities used or available
- Analytics: nothing in the standard library. Conventional: middleware that logs or counts requests, or a script snippet.
- Monitoring and observability: `/healthz` here; the standard library offers `log/slog`, `expvar`, `net/http/pprof` and
  `runtime/metrics`, none enabled (production defaults, no debug endpoints). No access log is written, so request logging
  costs nothing in the measurements.
- SEO: nothing built in. The sitemap, RSS and meta tags are templates in `apps/go/templates/`.

## Effort log
- Started 2026-11-13 13:31 UTC.
- Finished: 2026-11-13 14:30 UTC. Build-check-fix iterations until conformance passed: 1 (both modes passed the first conformance run; gofmt and go vet were run before it).
- Friction:
  - Go is not installed on the host, so everything ran through the `golang` image; with the host heavily loaded (parallel
    builds) each Docker step took 15 to 200 seconds.
  - `go:embed` cannot embed `../../shared/public`, so the shared files are copied into the image and served from disk.
  - html/template needs no special handling for the theme snippet (static `<script>` text is left alone), but passing several
    values to a sub-template needs a wrapper struct (`Card`) or a func, since templates take one argument.
  - app.js assumes the DOM holds every post, which forced the hidden-card rendering in vanilla mode.
  - htmx 4.0.x is now the default release on GitHub and npm `latest`; 2.0.11 has to be pinned explicitly.
- Hand-written source lines (excluding lockfiles and generated output): 579 (Go 427, templates 128,
  Dockerfile 24; the vendored htmx file is excluded).
