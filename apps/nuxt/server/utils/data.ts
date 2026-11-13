// The shared dataset, bundled into the server build and indexed once per process.
import data from "../../../../content/posts.json";

type RawPost = (typeof data.posts)[number];

export const site = data.site;
export const posts = data.posts;
const bySlug = new Map(posts.map((p) => [p.slug, p]));

export const toCard = (p: RawPost): PostCard => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  date: p.date,
  dateLabel: p.dateLabel,
  readingMinutes: p.readingMinutes,
  tags: p.tags,
  thumb: p.cover.thumb,
  thumbWidth: p.cover.thumbWidth,
  thumbHeight: p.cover.thumbHeight,
});

const ref = (slug: string | null) => {
  const p = slug ? bySlug.get(slug) : undefined;
  return p ? { slug: p.slug, title: p.title } : null;
};

export function getPostPage(slug: string): PostPage | null {
  const p = bySlug.get(slug);
  if (!p) return null;
  return {
    ...toCard(p),
    cover: { src: p.cover.src, alt: p.cover.alt, width: p.cover.width, height: p.cover.height },
    html: p.html,
    prev: ref(p.prev),
    next: ref(p.next),
    related: p.related.map((s) => toCard(bySlug.get(s)!)),
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export function renderRss() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(site.title)}</title>
<link>${site.url}/</link>
<description>${esc(site.description)}</description>
<language>en</language>
${posts
  .map(
    (p) => `<item>
<title>${esc(p.title)}</title>
<link>${site.url}/blog/${p.slug}</link>
<guid>${site.url}/blog/${p.slug}</guid>
<pubDate>${rfc822(p.date)}</pubDate>
<description>${esc(p.summary)}</description>
</item>`,
  )
  .join("\n")}
</channel>
</rss>
`;
}

export function renderSitemap() {
  const urls: [string, string | null][] = [
    ["/", posts[0]!.date],
    ["/blog", posts[0]!.date],
    ["/about", null],
    ...posts.map((p): [string, string] => [`/blog/${p.slug}`, p.date]),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
}
