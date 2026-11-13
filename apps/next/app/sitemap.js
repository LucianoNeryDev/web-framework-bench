import { renderPerRequest } from "../lib/dynamic";
import { posts, site } from "../lib/site";

export default async function sitemap() {
  await renderPerRequest();
  return [
    { url: `${site.url}/`, lastModified: posts[0].date },
    { url: `${site.url}/blog`, lastModified: posts[0].date },
    { url: `${site.url}/about` },
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
