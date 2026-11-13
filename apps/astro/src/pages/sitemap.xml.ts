import { site, posts } from "../lib/content";

// Hand-written: @astrojs/sitemap only lists prerendered routes and emits sitemap-index.xml, not /sitemap.xml.
export function GET() {
  const urls: [string, string | null][] = [
    ["/", posts[0].date],
    ["/blog", posts[0].date],
    ["/about", null],
    ...posts.map((p): [string, string] => [`/blog/${p.slug}`, p.date]),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
