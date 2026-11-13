# Web framework bench

The same small developer blog, built in 15 web stacks and measured the same way: build cost, server
throughput and latency, real-browser page performance, resource use, robustness, maintainability, operations
(analytics, monitoring) and development effort.

Every target implements one contract, [Field Notes](docs/site-spec.md), from one shared dataset, and must
pass the same [conformance check](bench/conformance.mjs) before it is measured.

## Targets

| Target | Stack | Modes |
|---|---|---|
| `static-html` | Hand-written HTML, CSS and JS on nginx (the reference) | static |
| `hugo` | Hugo | static |
| `nuxt` | Nuxt (Vue) | static, server |
| `next` | Next.js (React) | static, server |
| `astro` | Astro | static, server |
| `sveltekit` | SvelteKit | static, server |
| `react-router` | React Router v8, framework mode (the successor of Remix; v7 was the plan, v8 is the current major) | static, server |
| `angular` | Angular with `@angular/ssr` | static, server |
| `qwik` | Qwik City | static, server |
| `go` | Go `net/http` + `html/template`, vanilla JS island | server |
| `go-htmx` | The same Go server, with htmx for the filter | server |
| `laravel` | Laravel (Blade) on PHP-FPM | server |
| `wordpress` | WordPress classic theme on PHP-FPM + MariaDB | server, cached |
| `ghost` | Ghost with a Handlebars theme + MySQL | server, cached |

## Layout

```
content/    the shared dataset (generate.py, posts.json, posts/*.md)
shared/     files every target ships unchanged (style.css, app.js, images, nginx config)
apps/<id>/  one directory per target
bench/      conformance check and measurement harness
docs/       contract, methodology, research, results
results/    raw measurements and summaries
```

## Documentation

- [Site contract](docs/site-spec.md): what every target must build.
- [Implementing a target](docs/implementing-a-target.md): packaging and verification rules.
