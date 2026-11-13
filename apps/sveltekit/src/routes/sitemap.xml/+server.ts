import { posts, site } from "#lib/server/data.ts";

export const prerender = __WFB_STATIC__;

export const GET = () => {
  const urls: [string, string | null][] = [
    ["/", posts[0].date],
    ["/blog", posts[0].date],
    ["/about", null],
    ...posts.map((p): [string, string] => [`/blog/${p.slug}`, p.date]),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
