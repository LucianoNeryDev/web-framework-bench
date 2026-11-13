<script lang="ts">
  import BlogFilter from "#lib/components/BlogFilter.svelte";
  import Seo from "#lib/components/Seo.svelte";

  let { data } = $props();
</script>

<Seo path="/blog" title="Blog" description="All {data.total} posts on Field Notes." image="/images/hero.webp" />

<h1>Blog</h1>
<p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
<BlogFilter tags={data.tags} cards={data.cards} initialQuery={data.q} initialTag={data.tag} />
