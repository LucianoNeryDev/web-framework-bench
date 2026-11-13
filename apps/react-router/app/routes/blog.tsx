import type { ShouldRevalidateFunctionArgs } from "react-router";
import type { Route } from "./+types/blog";
import { BlogFilters } from "~/components/BlogFilters";
import { filterPosts } from "~/lib/filter";
import { posts, toCard } from "~/lib/posts.server";
import { pageMeta, site } from "~/lib/site";

const isStatic = import.meta.env.WFB_MODE === "static";

// Card data only (no post bodies). The server build filters by ?q= and ?tag= from the request URL;
// the static build ships the full list (the pre-rendered page has no query) and the browser filters.
export function loader({ request }: Route.LoaderArgs) {
  const cards = posts.map(toCard);
  if (isStatic) return { cards, total: cards.length };
  const url = new URL(request.url);
  return { cards: filterPosts(cards, url.searchParams.get("q") ?? "", url.searchParams.get("tag") ?? ""), total: cards.length };
}

// Static: filtering is client-side, so a search change must not refetch the page data.
export function shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  if (isStatic && currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  pageMeta({ path: "/blog", title: "Blog", description: `All ${loaderData?.total} posts on ${site.title}.`, image: "/images/hero.webp" });

export default function Blog({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Blog</h1>
      <p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
      <BlogFilters cards={loaderData.cards} total={loaderData.total} />
    </>
  );
}
