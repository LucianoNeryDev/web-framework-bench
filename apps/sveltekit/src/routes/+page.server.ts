import { posts, site, toCard } from "#lib/server/data.ts";

export const load = () => ({
  hero: { title: site.heroTitle, text: site.heroText },
  latest: posts.slice(0, 6).map(toCard),
});
