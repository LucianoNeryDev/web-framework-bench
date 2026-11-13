<script lang="ts">
  import { untrack } from "svelte";
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import type { CardData, Tag } from "#lib/types.ts";
  import PostCard from "./PostCard.svelte";

  let {
    tags,
    cards,
    initialQuery,
    initialTag,
  }: { tags: Tag[]; cards: CardData[]; initialQuery: string; initialTag: string } = $props();

  // Server mode seeds these from the request's query string; static mode seeds them in the effect below.
  let query = $state(untrack(() => initialQuery));
  let tag = $state(untrack(() => initialTag));

  // Pick up the URL on load (static mode) and when a tag link navigates to /blog?tag=... (both modes).
  // Runs in the browser only, so it never touches url.searchParams while prerendering.
  $effect(() => {
    const params = page.url.searchParams;
    const q = params.get("q") ?? "";
    if (q !== untrack(() => query).trim()) query = q;
    tag = params.get("tag") ?? "";
  });

  const shown = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (!tag || c.tags.some((t) => t.slug === tag)) && (!q || `${c.title} ${c.summary}`.toLowerCase().includes(q)),
    );
  });

  function syncUrl() {
    const url = new URL(location.href);
    const q = query.trim();
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    if (tag) url.searchParams.set("tag", tag);
    else url.searchParams.delete("tag");
    try {
      replaceState(url, {});
    } catch {
      history.replaceState(history.state, "", url);
    }
  }

  function submit(event: SubmitEvent) {
    event.preventDefault();
    syncUrl();
  }

  function choose(slug: string) {
    tag = slug;
    syncUrl();
  }
</script>

<form class="filters" role="search" action="/blog" method="get" onsubmit={submit}>
  <label for="q">Search posts</label>
  <input
    id="q"
    name="q"
    type="search"
    placeholder="Search titles and summaries"
    autocomplete="off"
    bind:value={query}
    oninput={syncUrl}
  />
  {#if tag}<input type="hidden" name="tag" value={tag} />{/if}
  <div class="tag-filter" role="group" aria-label="Filter by tag">
    <button type="button" class="chip" aria-pressed={tag === ""} onclick={() => choose("")}>All</button>
    {#each tags as t (t.slug)}
      <button type="button" class="chip" aria-pressed={tag === t.slug} onclick={() => choose(t.slug)}>{t.name}</button>
    {/each}
  </div>
</form>
<h2 class="visually-hidden">Posts</h2>
<p class="result-count" aria-live="polite">Showing {shown.length} of {cards.length} posts</p>
<div class="card-grid" data-post-list>
  {#each shown as post, i (post.slug)}
    <PostCard {post} eager={i < 3} />
  {/each}
</div>
<p class="empty" hidden={shown.length > 0}>No posts match.</p>
