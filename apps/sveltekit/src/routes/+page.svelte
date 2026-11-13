<script lang="ts">
  import PostCard from "#lib/components/PostCard.svelte";
  import Seo from "#lib/components/Seo.svelte";
  import { page } from "$app/state";

  let { data } = $props();
  const site = $derived(page.data.site);
</script>

<Seo path="/" title={site.title} description={site.description} image="/images/hero.webp" />

<section class="hero">
  <div class="hero-text">
    <h1>{data.hero.title}</h1>
    <p>{data.hero.text}</p>
    <p><a class="button" href="/blog">Read the blog</a></p>
  </div>
  <img
    class="hero-image"
    src="/images/hero.webp"
    alt="Abstract illustration of overlapping circles"
    width="1600"
    height="900"
    fetchpriority="high"
  />
</section>
<section class="latest" aria-labelledby="latest-heading">
  <h2 id="latest-heading">Latest posts</h2>
  <div class="card-grid">
    {#each data.latest as post (post.slug)}
      <PostCard {post} />
    {/each}
  </div>
  <p class="section-footer"><a href="/blog">All posts →</a></p>
</section>
