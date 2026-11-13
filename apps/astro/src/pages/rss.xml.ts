import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { site, posts } from "../lib/content";

export function GET(context: APIContext) {
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    trailingSlash: false,
    customData: "<language>en</language>",
    items: posts.map((p) => ({
      title: p.title,
      link: `/blog/${p.slug}`,
      pubDate: new Date(`${p.date}T00:00:00Z`),
      description: p.summary,
    })),
  });
}
