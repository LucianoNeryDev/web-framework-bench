# Hugo target

## Versions
- Hugo v0.169.0 extended (`ghcr.io/gohugoio/hugo:v0.169.0`, build stage only; Goldmark is Hugo's built-in Markdown renderer)
- nginx 1.29-alpine (`nginx:1.29-alpine`) serving the output with `shared/nginx/static.conf`
- No Hugo modules, themes, npm packages or lockfile: the project has no third-party dependencies.

## Modes
Single mode, `static`. Image `wfb/hugo:static`.

```bash
docker build -f apps/hugo/Dockerfile --target static -t wfb/hugo:static .
docker run -d --name wfb-hugo -p 18170:8080 wfb/hugo:static
node bench/conformance.mjs http://localhost:18170
```

The build stage copies three shared inputs into the project (none are committed under `apps/hugo`, see `.gitignore`):
`content/posts/*.md` into `content/blog/` (the `blog` section), `content/posts.json` into `data/posts.json`
and `shared/public/` into `static/`. Then `hugo --environment production --gc` writes `public/`, which nginx serves.
Running Hugo outside Docker needs the same three copies first.

## Implementation decisions
- **Posts** are the Markdown files, rendered by Goldmark. `markup.highlight.codeFences = false` gives plain
  `<pre><code class="language-x">` and `markup.goldmark.extensions.typographer.disable = true` keeps quotes and dashes
  untouched, so the `.post-body` text equals posts.json. Auto heading ids stay on (they do not change the text).
- **posts.json as a data file** (`hugo.Data.posts`). Site metadata (title, hero text, author, URL), the tag names and every
  value the contract says not to recompute (`dateLabel`, `readingMinutes`, cover sizes, `prev`, `next`, `related`) are looked
  up by slug through the cached partial `posts-by-slug.html` (a slug-keyed dict). Titles, dates, tags and the body come from
  the Markdown pages. Related cards use `site.GetPage`.
- **Routing**: `uglyURLs = true`, so output is `blog/<slug>.html`, `about.html`, `404.html`, and the section list is
  `blog/index.html`. nginx's `try_files $uri $uri.html $uri/index.html` resolves `/blog` and `/blog/<slug>` with no
  redirect. Every href is hand-built from the slug (`/blog/<slug>`, `/blog?tag=<slug>`), and the `path.html` partial
  strips `.html` and `/index` for the sitemap.
- **Feeds**: `home.rss.xml` is the RSS output of the home page, with the RSS output format renamed through
  `outputFormats.rss.baseName = "rss"` so it lands at `/rss.xml` (all 40 items, not limited by `rssLimit`).
  `sitemap.xml` overrides Hugo's built-in sitemap template to print the contract paths. `disableKinds = ["taxonomy",
  "term"]` removes the tag pages.
- **Layout**: new-style names (`baseof.html`, `home.html`, `section.html`, `blog/page.html`, `about/page.html`, `404.html`,
  `_partials/`). The about page uses `type: about` in its front matter to select its template.
- **Interactivity**: none of its own. Pages load `/app.js` (theme toggle and the `data-filters` blog filter), as the contract
  requires for targets without a client framework.

## Deviations from the contract
- None that the checker sees. Two cosmetic differences from the reference markup: code blocks keep the tab indentation of the
  Markdown files where posts.json uses spaces, and headings carry Goldmark's auto `id`. Apostrophes in attribute values are
  escaped as `&#39;` by Go's html/template.
- The about text is Markdown in `content/about.md` (the idiomatic place) instead of `aboutHtml` from posts.json. Same words.

## Native capabilities used or available
- Analytics: none built in. Conventional: a script snippet in `baseof.html`, or a privacy-friendly service. Hugo ships an
  embedded Google Analytics template (`_internal/google_analytics.html`) that was not used, per the contract.
- Monitoring and observability: nothing at run time (static files). `/healthz` comes from the shared nginx config. Build-time:
  `hugo --templateMetrics`, `--printPathWarnings`, `--logLevel`.
- SEO: built in and available are the sitemap, RSS, `Page.Permalink`, and embedded Open Graph, Twitter card and
  schema.org templates. This target hand-writes the head and both feeds to match the contract markup exactly (overriding the
  built-in sitemap and RSS templates is the standard way to customise them).

## Effort log
- Started 2026-11-13 13:31 UTC.
- Finished: 2026-11-13 14:30 UTC. Build-check-fix iterations until conformance passed: 3 (first run: sitemap listed `/blog/index` and the feeds were HTML-escaped; then a clean pass, then one rebuild for `disableHugoGeneratorInject`, also clean).
- Friction:
  - Hugo deprecates config and template names quickly (v0.146 layout names, v0.156 `hugo.Data`, v0.158 `locale`), so most
    tutorials and AI-remembered snippets warn or fail on 0.169.
  - XML output formats are parsed with html/template: `<?xml ...?>` is escaped to `&lt;?xml` unless printed through
    `safeHTML`, and `transform.XMLEscape` then double-escapes. Autoescaping already produces valid XML.
  - With `uglyURLs` the section index is `blog/index.html`, not `blog.html`, so the sitemap needed a path partial.
  - `hugo.toml` `tags` front matter implies taxonomy pages; they have to be disabled with `disableKinds`.
  - No built-in way to look up a data array by key: the slug-keyed dict is built with `merge` in a cached partial.
  - Hugo injects `<meta name="generator">` unless `disableHugoGeneratorInject = true`.
- Hand-written source lines (excluding lockfiles and generated output): about 255 (templates 190, config and content 50, Dockerfile 17).
