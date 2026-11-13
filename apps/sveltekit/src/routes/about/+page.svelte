<script lang="ts">
  import Seo from "#lib/components/Seo.svelte";

  let { data } = $props();
</script>

<Seo path="/about" title="About" description="About {data.author} and {data.title}." image="/images/avatar.webp" />

<section class="about">
  <h1>About</h1>
  <img class="about-avatar" src="/images/avatar.webp" alt="Portrait of {data.author}" width="160" height="160" />
  {@html data.aboutHtml}
</section>
