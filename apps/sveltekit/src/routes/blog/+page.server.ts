import { posts, tags, toCard } from "#lib/server/data.ts";

export const load = ({ url }) => {
  // Server mode renders ?q= and ?tag= already filtered. Reading url.searchParams while prerendering is
  // an error, so the static build ships the unfiltered list and the component filters on load.
  const q = __WFB_STATIC__ ? "" : (url.searchParams.get("q") ?? "");
  const tag = __WFB_STATIC__ ? "" : (url.searchParams.get("tag") ?? "");
  return { tags, cards: posts.map(toCard), q, tag, total: posts.length };
};
