import type { RequestHandler } from "@builder.io/qwik-city";
import { allPosts } from "~/lib/data";
import { site } from "~/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export const onGet: RequestHandler = ({ headers, send }) => {
  const items = allPosts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${site.url}/blog/${p.slug}</link>
<guid>${site.url}/blog/${p.slug}</guid>
<pubDate>${rfc822(p.date)}</pubDate>
<description>${esc(p.summary)}</description>
</item>`,
    )
    .join("\n");
  headers.set("Content-Type", "application/rss+xml; charset=utf-8");
  send(
    200,
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(site.title)}</title>
<link>${site.url}/</link>
<description>${esc(site.description)}</description>
<language>en</language>
${items}
</channel>
</rss>
`,
  );
};
