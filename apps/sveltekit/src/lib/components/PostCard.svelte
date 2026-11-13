<script lang="ts">
  import type { CardData } from "#lib/types.ts";

  let { post, eager = false }: { post: CardData; eager?: boolean } = $props();
</script>

<article class="card">
  <a class="card-link" href="/blog/{post.slug}"
    ><img
      class="card-image"
      src={post.thumb}
      alt=""
      width={post.thumbWidth}
      height={post.thumbHeight}
      loading={eager ? undefined : "lazy"}
      decoding="async"
    /><h3 class="card-title">{post.title}</h3></a
  >
  <p class="card-meta"><time datetime={post.date}>{post.dateLabel}</time> · {post.readingMinutes} min read</p>
  <p class="card-summary">{post.summary}</p>
  <ul class="tag-list">
    {#each post.tags as tag (tag.slug)}
      <li><a class="tag" href="/blog?tag={tag.slug}">{tag.name}</a></li>
    {/each}
  </ul>
</article>
