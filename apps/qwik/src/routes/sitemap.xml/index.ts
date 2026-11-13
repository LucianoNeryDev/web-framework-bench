import type { RequestHandler } from "@builder.io/qwik-city";
import { allPosts } from "~/lib/data";
import { site } from "~/lib/site";

export const onGet: RequestHandler = ({ headers, send }) => {
  const newest = allPosts[0].date;
  const urls: [string, string | null][] = [
    ["/", newest],
    ["/blog", newest],
    ["/about", null],
    ...allPosts.map((p): [string, string] => [`/blog/${p.slug}`, p.date]),
  ];
  headers.set("Content-Type", "application/xml; charset=utf-8");
  send(
    200,
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`,
  );
};
