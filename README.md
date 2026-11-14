# Web framework bench

The same small developer blog, built in 13 web stacks (15 targets, 24 configurations) and measured the same way on two
Google Cloud VMs: build cost, server throughput and latency, real-browser page performance, resource use,
robustness, maintainability, monitoring, analytics and development effort.

Every target implements one contract, [Field Notes](docs/site-spec.md), from one shared dataset, and passes
the [conformance check](bench/conformance.mjs) before it is measured: 1,214 checks in static mode, 1,257-1,259
in server mode (Ghost cannot filter on the server and runs the static set).

## Results at a glance

Target VM: `n2-standard-2` (2 vCPU, 8 GB). Load and browsers on a separate VM. Full tables:
[results](docs/results.md). What they mean: [findings](docs/findings.md).

| Target | Post page, req/s at 100 connections | p99 ms | Memory after load, MB | External JS on /blog, KB | Filter ready on a slow phone, ms |
|---|---:|---:|---:|---:|---:|
| Any static build (HTML, Hugo, Astro, SvelteKit, Nuxt, Next, React Router, Angular, Qwik) | 16,600-18,300 | 10-11 | 3.4 | 0-141 | 553-1,831 |
| Go `net/http` | 3,427 | 148 | 19 | 1.2 | 556 |
| Astro SSR | 1,631 | 90 | 105 | 0 | 549 |
| SvelteKit SSR | 979 | 124 | 119 | 44 | 1,109 |
| React Router SSR | 487 | 244 | 117 | 119 | 1,830 |
| Nuxt SSR | 288 | 397 | 138 | 86 | 1,430 |
| Qwik City SSR | 214 | 1,148 | 113 | 48 | 988 |
| Laravel (Octane) | 208 | 531 | 110 | 1.2 | 554 |
| Next.js SSR | 168 | 2,010 | 178 | 141 | 1,707 |
| Laravel (PHP-FPM) | 144 | 757 | 38 | 1.2 | 557 |
| Angular SSR | 123 | 4,282 | 187 | 97 | 1,414 |
| WordPress / with page cache | 50 / 13,791 | 2,095 / 14 | 194 / 183 | 1.2 | 556 / 559 |
| Ghost / with page cache | 42 / 12,096 | 3,666 / 16 | 1,294 / 716 | 1.2 | 553 / 582 |

Server mode renders every page per request with no cache, on purpose: it measures the rendering engine.
Memory covers every container of the target (database and nginx included). Some frameworks also inline
script or state into the HTML (Next.js 74 KB, Qwik 63 KB on /blog); see the findings. One run per
configuration on one small site: read it as a strong hint, not a law. For this kind of site the hint is to
prerender; the framework then mostly decides how much JavaScript the browser gets. The [findings](docs/findings.md) cover robustness, security, maintainability and what to pick.

## Targets

| Target | Stack | Modes |
|---|---|---|
| `static-html` | Hand-written HTML, CSS and JS on nginx (the reference) | static |
| `hugo` | Hugo 0.169 | static |
| `nuxt` | Nuxt 4.6 (Vue) | static, server |
| `next` | Next.js 16.4 (React, App Router) | static, server |
| `astro` | Astro 7.4 | static, server |
| `sveltekit` | SvelteKit 3.2 (Svelte 5) | static, server |
| `react-router` | React Router 8.5, framework mode (the successor of Remix v2) | static, server |
| `angular` | Angular 22.2 with `@angular/ssr` | static, server |
| `qwik` | Qwik City 1.20 (the stable line) | static, server |
| `go` | Go 1.27 `net/http` + `html/template`, vanilla JS island | server |
| `go-htmx` | The same Go server, with htmx 2.0 for the filter | server |
| `laravel` | Laravel 13 (Blade) on PHP-FPM 8.4 behind nginx | server |
| `laravel-octane` | The same Laravel app on Octane with FrankenPHP | server |
| `wordpress` | WordPress 7.1 classic theme on PHP-FPM + MariaDB | server, cached |
| `ghost` | Ghost 6.77 with a Handlebars theme + MySQL | server, cached |

## Run it yourself

```bash
bench/setup.sh                              # harness dependencies, Chromium, oha
node bench/run.mjs build static-html        # build one target (or: all)
node bench/run.mjs conformance static-html  # check it against the contract
bench/run-all.sh                            # every phase for every target
node bench/report.mjs                       # regenerate docs/results.md
```

On one machine the target and the load generator share hardware, so the published numbers come from two VMs:
[`bench/cloud/create-vms.sh`](bench/cloud/create-vms.sh) provisions them on Google Cloud and the harness drives
the target over SSH. See the [methodology](docs/methodology.md).

The databases and CMS admin accounts in `apps/*/compose.yaml` use throwaway credentials on private Docker
networks. They exist only to run the benchmark; never reuse them.

## Layout

```
content/    the shared dataset (generate.py, posts.json, posts/*.md)
shared/     files every target ships unchanged (style.css, app.js, images, nginx config)
apps/<id>/  one directory per target; NOTES.md in each (except the reference) records versions,
            decisions, deviations and effort
bench/      conformance check, measurement harness, cloud scripts
docs/       contract, methodology, research, results, findings
results/    raw measurements (results/raw/<target>/<phase>.json) and summary.json
```

## Documentation

- [Findings](docs/findings.md): what the numbers mean and what to pick.
- [Results](docs/results.md): every measured number.
- [Methodology](docs/methodology.md): how each number is produced, and the threats to validity.
- [Site contract](docs/site-spec.md): what every target must build.
- [Implementing a target](docs/implementing-a-target.md): packaging and verification rules.
- [Research](docs/research/): maintainability, analytics, monitoring and security notes per stack, with sources.

## License and credit

MIT, see [LICENSE](LICENSE). If you use this work, keep the copyright notice; a link back to
[lucianonery.dev](https://lucianonery.dev) is appreciated. Maintained for our own needs: issues and pull requests
are welcome, with no support commitment.
