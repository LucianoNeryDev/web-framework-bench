// RSS and sitemap generation. Plain functions with no Angular imports: server.ts calls them per request and
// tools/post-static.mjs calls them once after the static build.
import type { PostMeta, Site } from "./app/models";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export function rss(site: Site, posts: PostMeta[]): string {
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

export function sitemap(site: Site, posts: PostMeta[]): string {
  const urls: [string, string | null][] = [
    ["/", posts[0].date],
    ["/blog", posts[0].date],
    ["/about", null],
    ...posts.map((p): [string, string] => [`/blog/${p.slug}`, p.date]),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
}
