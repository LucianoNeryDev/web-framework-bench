<script lang="ts">
  import PostCard from "#lib/components/PostCard.svelte";
  import Seo from "#lib/components/Seo.svelte";

  let { data } = $props();
  const post = $derived(data.post);
</script>

<Seo path="/blog/{post.slug}" title={post.title} description={post.summary} image={post.cover.src} type="article" />

<article class="post">
  <header class="post-header">
    <p class="post-meta"><time datetime={post.date}>{post.dateLabel}</time> · {post.readingMinutes} min read</p>
    <h1>{post.title}</h1>
    <p class="post-summary">{post.summary}</p>
    <ul class="tag-list">
      {#each data.tags as tag (tag.slug)}
        <li><a class="tag" href="/blog?tag={tag.slug}">{tag.name}</a></li>
      {/each}
    </ul>
  </header>
  <img
    class="post-cover"
    src={post.cover.src}
    alt={post.cover.alt}
    width={post.cover.width}
    height={post.cover.height}
    fetchpriority="high"
  />
  <div class="post-body">
    {@html post.html}
  </div>
</article>
<nav class="post-nav" aria-label="Adjacent posts">
  {#if data.prev}<a rel="prev" href="/blog/{data.prev.slug}">← {data.prev.title}</a>{/if}
  {#if data.next}<a rel="next" href="/blog/{data.next.slug}">{data.next.title} →</a>{/if}
</nav>
<section class="related" aria-labelledby="related-heading">
  <h2 id="related-heading">Related posts</h2>
  <div class="card-grid">
    {#each data.related as card (card.slug)}
      <PostCard post={card} />
    {/each}
  </div>
</section>
