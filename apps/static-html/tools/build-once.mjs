// Writes the hand-maintained HTML for the static-html target into ../site.
//
// A real "pure HTML" site is edited by hand; with 40 posts that means copying one file per post.
// This script does that copying once so the output is reproducible. The committed files in site/
// are the source of truth for this target, and the reference markup every other target matches.
//
// Run: node apps/static-html/tools/build-once.mjs
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "site");
const data = JSON.parse(readFileSync(join(here, "../../../content/posts.json"), "utf8"));
const { site, tags, posts } = data;
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
const tagName = Object.fromEntries(tags.map((t) => [t.slug, t.name]));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const THEME_SCRIPT =
  '<script>try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;' +
  'else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}</script>';

function layout({ path, title, description, image, type = "website", current, body }) {
  const fullTitle = path === "/" ? site.title : `${title} · ${site.title}`;
  const nav = [["/", "Home"], ["/blog", "Blog"], ["/about", "About"]]
    .map(([href, label]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.url}${path}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${site.url}${image}">
<link rel="alternate" type="application/rss+xml" title="${esc(site.title)}" href="/rss.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${THEME_SCRIPT}
<link rel="stylesheet" href="/style.css">
<script src="/app.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container"><a class="brand" href="/">${esc(site.title)}</a><nav class="site-nav" aria-label="Main">${nav}</nav><button class="theme-toggle" type="button" aria-label="Toggle dark mode" data-theme-toggle>◐</button></div></header>
<main id="main" class="container">
${body}
</main>
<footer class="site-footer"><div class="container"><p>© 2026 ${esc(site.author)} · <a href="/rss.xml">RSS</a></p></div></footer>
</body>
</html>
`;
}

const tagList = (post) =>
  `<ul class="tag-list">${post.tags.map((t) => `<li><a class="tag" href="/blog?tag=${t}">${esc(tagName[t])}</a></li>`).join("")}</ul>`;

function card(post, { eager = false } = {}) {
  const search = esc(`${post.title} ${post.summary}`.toLowerCase());
  return `<article class="card" data-post data-tags="${post.tags.join(" ")}" data-search="${search}">
<a class="card-link" href="/blog/${post.slug}"><img class="card-image" src="${post.cover.thumb}" alt="" width="${post.cover.thumbWidth}" height="${post.cover.thumbHeight}"${eager ? "" : ' loading="lazy"'} decoding="async"><h3 class="card-title">${esc(post.title)}</h3></a>
<p class="card-meta"><time datetime="${post.date}">${post.dateLabel}</time> · ${post.readingMinutes} min read</p>
<p class="card-summary">${esc(post.summary)}</p>
${tagList(post)}
</article>`;
}

const pages = new Map();

pages.set("index.html", layout({
  path: "/", title: site.title, description: site.description, image: "/images/hero.webp", current: "/",
  body: `<section class="hero">
<div class="hero-text"><h1>${esc(site.heroTitle)}</h1><p>${esc(site.heroText)}</p><p><a class="button" href="/blog">Read the blog</a></p></div>
<img class="hero-image" src="/images/hero.webp" alt="Abstract illustration of overlapping circles" width="1600" height="900" fetchpriority="high">
</section>
<section class="latest" aria-labelledby="latest-heading">
<h2 id="latest-heading">Latest posts</h2>
<div class="card-grid">
${posts.slice(0, 6).map((p) => card(p)).join("\n")}
</div>
<p class="section-footer"><a href="/blog">All posts →</a></p>
</section>`,
}));

pages.set("blog.html", layout({
  path: "/blog", title: "Blog", description: `All ${posts.length} posts on ${site.title}.`, image: "/images/hero.webp", current: "/blog",
  body: `<h1>Blog</h1>
<p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
<form class="filters" role="search" action="/blog" method="get" data-filters>
<label for="q">Search posts</label>
<input id="q" name="q" type="search" placeholder="Search titles and summaries" autocomplete="off">
<div class="tag-filter" role="group" aria-label="Filter by tag">
<button type="button" class="chip" data-tag="" aria-pressed="true">All</button>
${tags.map((t) => `<button type="button" class="chip" data-tag="${t.slug}" aria-pressed="false">${esc(t.name)}</button>`).join("\n")}
</div>
</form>
<h2 class="visually-hidden">Posts</h2>
<p class="result-count" aria-live="polite" data-result-count>Showing ${posts.length} of ${posts.length} posts</p>
<div class="card-grid" data-post-list>
${posts.map((p, i) => card(p, { eager: i < 3 })).join("\n")}
</div>
<p class="empty" data-empty hidden>No posts match.</p>`,
}));

for (const post of posts) {
  const prev = post.prev && bySlug[post.prev];
  const next = post.next && bySlug[post.next];
  pages.set(`blog/${post.slug}.html`, layout({
    path: `/blog/${post.slug}`, title: post.title, description: post.summary, image: post.cover.src, type: "article", current: "/blog",
    body: `<article class="post">
<header class="post-header">
<p class="post-meta"><time datetime="${post.date}">${post.dateLabel}</time> · ${post.readingMinutes} min read</p>
<h1>${esc(post.title)}</h1>
<p class="post-summary">${esc(post.summary)}</p>
${tagList(post)}
</header>
<img class="post-cover" src="${post.cover.src}" alt="${esc(post.cover.alt)}" width="${post.cover.width}" height="${post.cover.height}" fetchpriority="high">
<div class="post-body">
${post.html}
</div>
</article>
<nav class="post-nav" aria-label="Adjacent posts">${prev ? `<a rel="prev" href="/blog/${prev.slug}">← ${esc(prev.title)}</a>` : ""}${next ? `<a rel="next" href="/blog/${next.slug}">${esc(next.title)} →</a>` : ""}</nav>
<section class="related" aria-labelledby="related-heading">
<h2 id="related-heading">Related posts</h2>
<div class="card-grid">
${post.related.map((s) => card(bySlug[s])).join("\n")}
</div>
</section>`,
  }));
}

pages.set("about.html", layout({
  path: "/about", title: "About", description: `About ${site.author} and ${site.title}.`, image: "/images/avatar.webp", current: "/about",
  body: `<section class="about">
<h1>About</h1>
<img class="about-avatar" src="/images/avatar.webp" alt="Portrait of ${esc(site.author)}" width="160" height="160">
${site.aboutHtml}
</section>`,
}));

pages.set("404.html", layout({
  path: "/404", title: "Page not found", description: "This page does not exist.", image: "/images/hero.webp",
  body: `<section class="not-found">
<h1>Page not found</h1>
<p>The page you asked for does not exist or has moved.</p>
<p><a class="button" href="/">Back to the home page</a></p>
</section>`,
}));

const rfc822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();
pages.set("rss.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(site.title)}</title>
<link>${site.url}/</link>
<description>${esc(site.description)}</description>
<language>en</language>
${posts.map((p) => `<item>
<title>${esc(p.title)}</title>
<link>${site.url}/blog/${p.slug}</link>
<guid>${site.url}/blog/${p.slug}</guid>
<pubDate>${rfc822(p.date)}</pubDate>
<description>${esc(p.summary)}</description>
</item>`).join("\n")}
</channel>
</rss>
`);

const urls = [["/", posts[0].date], ["/blog", posts[0].date], ["/about", null], ...posts.map((p) => [`/blog/${p.slug}`, p.date])];
pages.set("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`);

rmSync(out, { recursive: true, force: true });
for (const [file, html] of pages) {
  const target = join(out, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}
console.log(`wrote ${pages.size} files to ${out}`);
