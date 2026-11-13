import { $, component$, useComputed$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { filterPosts } from "~/lib/filter";
import type { CardPost, TagRef } from "~/lib/types";
import { PostCard } from "./post-card";

interface Props {
  posts: CardPost[];
  tags: TagRef[];
  /** Initial query and tag, read from the request URL by the routeLoader$ (empty when prerendered). */
  q: string;
  tag: string;
}

export const PostFilter = component$<Props>((props) => {
  const q = useSignal(props.q);
  const tag = useSignal(props.tag);
  const loc = useLocation();
  const visible = useComputed$(() => filterPosts(props.posts, q.value, tag.value));

  // Static builds are prerendered without a query string: apply the one in the address bar on load, and
  // again after a client-side navigation to /blog?tag=...
  useVisibleTask$(
    ({ track }) => {
      track(() => loc.url.search);
      const params = new URLSearchParams(location.search);
      q.value = params.get("q") ?? "";
      tag.value = params.get("tag") ?? "";
    },
    { strategy: "document-ready" },
  );

  const syncUrl = $(() => {
    const url = new URL(location.href);
    const needle = q.value.trim();
    if (needle) url.searchParams.set("q", needle);
    else url.searchParams.delete("q");
    if (tag.value) url.searchParams.set("tag", tag.value);
    else url.searchParams.delete("tag");
    history.replaceState(null, "", url);
  });

  const total = props.posts.length;
  return (
    <>
      <form class="filters" role="search" action="/blog" method="get" preventdefault:submit>
        <label for="q">Search posts</label>
        <input
          id="q"
          name="q"
          type="search"
          placeholder="Search titles and summaries"
          autoComplete="off"
          value={q.value}
          onInput$={(_, el) => {
            q.value = el.value;
            syncUrl();
          }}
        />
        <div class="tag-filter" role="group" aria-label="Filter by tag">
          <button
            type="button"
            class="chip"
            aria-pressed={tag.value === "" ? "true" : "false"}
            onClick$={() => {
              tag.value = "";
              syncUrl();
            }}
          >
            All
          </button>
          {props.tags.map((t) => (
            <button
              key={t.slug}
              type="button"
              class="chip"
              aria-pressed={tag.value === t.slug ? "true" : "false"}
              onClick$={() => {
                tag.value = t.slug;
                syncUrl();
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </form>
      <h2 class="visually-hidden">Posts</h2>
      <p class="result-count" aria-live="polite">
        {`Showing ${visible.value.length} of ${total} posts`}
      </p>
      <div class="card-grid" data-post-list>
        {visible.value.map((p) => (
          <PostCard key={p.slug} post={p} eager={props.posts.indexOf(p) < 3} />
        ))}
      </div>
      <p class="empty" hidden={visible.value.length > 0}>
        No posts match.
      </p>
    </>
  );
});
