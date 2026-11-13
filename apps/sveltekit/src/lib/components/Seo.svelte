<script lang="ts">
  import { page } from "$app/state";

  let {
    path,
    title,
    description,
    image,
    type = "website",
  }: { path: string; title: string; description: string; image: string; type?: string } = $props();

  const site = $derived(page.data.site);
  const fullTitle = $derived(path === "/" ? site.title : `${title} · ${site.title}`);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{site.url}{path}" />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="{site.url}{image}" />
  <link rel="alternate" type="application/rss+xml" title={site.title} href="/rss.xml" />
</svelte:head>
