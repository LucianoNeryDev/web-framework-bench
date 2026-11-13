import { posts, site } from "./site";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();
const xml = (body) => new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });

export const rss = () =>
  xml(`<?xml version="1.0" encoding="UTF-8"?>
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
`);
