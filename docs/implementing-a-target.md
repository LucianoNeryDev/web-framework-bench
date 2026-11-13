# Implementing a target

A target is one framework building [Field Notes](site-spec.md). It lives in `apps/<id>/` and is judged only
through its container, so every target is packaged the same way.

## Layout

```
apps/<id>/
  Dockerfile      build context is the repository root
  compose.yaml    only for multi-container targets (CMS + database, PHP-FPM + nginx)
  NOTES.md        versions, decisions, deviations, effort log (template below)
  .gitignore      node_modules, build output, vendor, caches
  ...             the app itself, in the framework's standard project layout
```

## Packaging rules

- **Build context is the repository root**, so the Dockerfile can `COPY content/posts.json`, `shared/public/`
  and `shared/nginx/static.conf`. Build with `docker build -f apps/<id>/Dockerfile --target <mode> .`
- **One stage per mode.** A target with both modes has final stages named `static` and `server`. Single-mode
  targets name their final stage after their mode.
- **Images** are tagged `wfb/<id>:<mode>`. Multi-container targets use `compose.yaml` with project name
  `wfb-<id>` and publish the entry container on a port given by `${WFB_PORT:-8080}`.
- **Port 8080** inside the container, for the entry container.
- **Static mode** runs on `nginx:1.29-alpine` with `shared/nginx/static.conf` as the only server config, the
  build output in `/usr/share/nginx/html`, and `shared/public/` copied alongside it.
- **Server mode** runs the framework's documented production server, as one process unless multiple workers
  are the documented default (PHP-FPM is; a Node server is not). No PM2, no cluster mode.
- **Readable files.** The host umask is `077`. Finish every stage that copies files from the host with
  `RUN chmod -R a+rX <dir>`, or nginx and PHP-FPM return 403.
- **Reproducible.** Pin the base image tags and commit the lockfile. A database is seeded from
  `content/posts.json` automatically and idempotently on first start, so `docker compose up` yields a
  conformant site with no manual steps.
- **Self-contained.** No network calls at run time other than to the target's own database.

## Verification

Start the container (or compose project) on a free host port and run the checker from the repository root:

```bash
cd bench && npm install && cd ..
node bench/conformance.mjs http://localhost:<port>            # static mode
node bench/conformance.mjs http://localhost:<port> --server   # server mode: also checks server-side filtering
```

A target is done when every mode passes every check.

## NOTES.md template

```markdown
# <Framework> target

## Versions
Framework, runtime and every key package, with exact versions.

## Modes
How each mode is built and run, with the exact commands.

## Implementation decisions
How routing, data loading, the filter island and the theme toggle were done, and why that is idiomatic.

## Deviations from the contract
Anything that could not match the reference markup, and why. "None" is a valid answer.

## Native capabilities used or available
- Analytics: what the framework or its ecosystem offers out of the box, and what is conventional.
- Monitoring and observability: health checks, metrics, tracing, logging hooks.
- SEO: sitemap, RSS, meta helpers, and whether they were built in or hand-written here.

## Effort log
- Started / finished (UTC), and the number of build-check-fix iterations until conformance passed.
- Friction: every place the framework fought the contract or the documentation was wrong or missing.
- Hand-written source lines (excluding lockfiles and generated output).
```
