import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PostFilter } from "~/components/post-filter";
import { allCards } from "~/lib/data";
import { pageHead } from "~/lib/head";
import { site, tags } from "~/lib/site";

// Cards only (no post bodies). In server mode the query string is read here, per request; prerendered
// builds see no query and the browser applies it on load.
export const useBlog = routeLoader$(({ url }) => ({
  posts: allCards(),
  q: url.searchParams.get("q") ?? "",
  tag: url.searchParams.get("tag") ?? "",
}));

export default component$(() => {
  const blog = useBlog();
  return (
    <>
      <h1>Blog</h1>
      <p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
      <PostFilter posts={blog.value.posts} tags={tags} q={blog.value.q} tag={blog.value.tag} />
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) =>
  pageHead({
    path: "/blog",
    title: "Blog",
    description: `All ${resolveValue(useBlog).posts.length} posts on ${site.title}.`,
    image: "/images/hero.webp",
  });
