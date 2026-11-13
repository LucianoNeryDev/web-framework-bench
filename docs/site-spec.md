# Field Notes: the site every target implements

Every target in this benchmark builds the same small developer blog, *Field Notes*, from the same content.
Only the framework changes. The reference implementation is [`apps/static-html`](../apps/static-html):
its HTML output in `apps/static-html/site/` is the authoritative markup, and
[`bench/conformance.mjs`](../bench/conformance.mjs) checks any running target against it.

## Content

- `content/posts.json` is the canonical dataset: the site metadata, 10 tags and 40 posts, newest first.
  Every post has a slug, title, summary, ISO date, a pre-formatted `dateLabel` (`30 Oct 2026`), tags, reading
  time, cover image paths, `prev` (older) and `next` (newer) slugs, three `related` slugs, and the body as
  pre-rendered `html`.
- `content/posts/<slug>.md` holds the same posts as Markdown with front matter, for targets whose idiomatic
  workflow is Markdown (Hugo) or an import (WordPress, Ghost).
- `shared/public/` holds the files every target serves unchanged: `style.css`, `app.js` (the vanilla island),
  `favicon.svg` and `images/` (pre-optimised WebP covers, thumbnails, hero and avatar).
- Regenerate with `uv run content/generate.py`. The output is deterministic.

Use `dateLabel`, `readingMinutes`, `prev`, `next` and `related` as given. Do not recompute them, so no
target pays for (or saves on) a different algorithm.

## Routes

| Route | Status | Content |
|---|---|---|
| `/` | 200 | Hero, then the 6 latest posts |
| `/blog` | 200 | Search box, tag chips, all 40 posts |
| `/blog?q=<text>&tag=<slug>` | 200 | Same page, filtered (see [Filtering](#filtering)) |
| `/blog/<slug>` | 200 | One post |
| `/about` | 200 | About page |
| `/rss.xml` | 200 | RSS 2.0, all 40 posts, `xml` content type |
| `/sitemap.xml` | 200 | `/`, `/blog`, `/about` and every post as `https://bench.example/...` (a sitemap index is allowed) |
| `/healthz` | 200 | Plain `ok` |
| `/images/*`, `/style.css`, `/favicon.svg` | 200 | From `shared/public/` |
| anything else | **404** | The 404 page, with a real 404 status |

No route may redirect. `/blog` and `/blog/<slug>` are served without a trailing slash and without a 301.

## Markup contract

Match `apps/static-html/site/` element for element where the framework allows it. The checker relies on these
parts:

- `<html lang="en">`, `meta viewport`, `<title>` (`<page> · Field Notes`, or `Field Notes` on `/`), `meta
  description`, `link rel=canonical` (`https://bench.example<path>`), Open Graph type, title, description and
  image, `link rel=alternate type=application/rss+xml`, `link rel=icon`.
- The **theme snippet** inline in `<head>`, byte for byte, before any stylesheet:
  ```html
  <script>try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}</script>
  ```
- `a.skip-link[href="#main"]`, then `header.site-header` with `a.brand`, `nav.site-nav` linking `/`, `/blog`
  and `/about` (the current section carries `aria-current="page"`; posts count as `/blog`), and
  `button.theme-toggle` with an `aria-label`.
- `<main id="main" class="container">` and `footer.site-footer` containing a link to `/rss.xml`.
- **Cards** (`article.card`): `a.card-link[href="/blog/<slug>"]` wrapping `img.card-image` (the thumb, with
  width, height, `loading="lazy"` except the first three on `/blog`, `decoding="async"`) and `h3.card-title`;
  then `p.card-meta` (`<time datetime>` + ` · N min read`), `p.card-summary` and `ul.tag-list` of
  `a.tag[href="/blog?tag=<slug>"]`.
- **Home**: `section.hero` with the `h1`, text, `a.button` to `/blog` and `img.hero-image`
  (`fetchpriority="high"`); `section.latest` with its `h2`, a `.card-grid` of 6 cards and an "All posts" link.
- **Blog**: `h1` "Blog", `form.filters` (`label[for=q]`, `input#q[name=q][type=search]`, `.tag-filter` with
  an "All" `button.chip` and one per tag, each with `aria-pressed`), `p.result-count` reading
  `Showing N of 40 posts`, the card grid marked `[data-post-list]`, and `p.empty` ("No posts match.") hidden
  unless nothing matches.
- **Post**: `article.post` > `header.post-header` (`p.post-meta` with `<time>`, `h1`, `p.post-summary`,
  `ul.tag-list`), `img.post-cover` (`fetchpriority="high"`), `div.post-body` with the post HTML; then
  `nav.post-nav` with `a[rel=prev]` (older) and `a[rel=next]` (newer) when they exist, and `section.related`
  with three cards.
- **About**: `section.about` with `h1` "About", `img.about-avatar` and the about HTML.
- **404**: `section.not-found` with `h1` "Page not found".

Framework-added wrappers (a root `<div id="__nuxt">`, island wrappers, hydration comments) are fine. Extra
classes are fine. Missing or renamed contract elements are not.

## Rules for fair comparison

1. **Same CSS.** Ship `shared/public/style.css` unchanged, either linked as `/style.css` or imported through
   the framework's normal CSS pipeline. No other styling, no CSS framework, no web fonts.
2. **Same images.** Plain `<img>` with the given paths. No framework image component or optimiser.
3. **Idiomatic interactivity.** Client-framework targets implement the theme toggle and the blog filter as
   components in their own idiom, and do not load `shared/public/app.js`. Targets without a client framework
   (static-html, Hugo, Go, Laravel, WordPress, Ghost) load `app.js`. The htmx variant uses htmx for the filter.
4. **Production builds.** Production mode, default production settings, no debug toolbars.
5. **Self-hosted.** No CDN scripts, no third-party requests, no analytics snippets in the measured pages.
6. **Pinned versions.** Lockfiles committed. Use the current stable release of each framework and record it.

## Filtering

A post matches when the tag (if any) is in its tags and the query (if any) is a case-insensitive substring of
`title + " " + summary`. Results keep newest-first order.

- **In the browser** (every target): typing in `#q` and pressing a chip filter the list without a page load,
  update `aria-pressed`, the result count and the empty state, and keep `q` and `tag` in the URL
  (`history.replaceState` or equivalent). Opening `/blog?tag=go&q=the` shows the filtered list.
- **On the server** (every server-rendering target): `/blog?q=&tag=` is rendered already filtered, with the
  input value and pressed chip set, so the form also works without JavaScript. Static targets serve the full
  list and filter on load.

## Build modes

| Mode | Meaning |
|---|---|
| `static` | Every page prerendered at build time and served by the shared nginx config (`shared/nginx/static.conf`) |
| `server` | Every page rendered **per request**: no prerendering, no HTML or data cache. This measures the rendering engine, not a cache. |

Frameworks that support both ship both. CMS targets add a cached variant, because that is how they are run in
production.
