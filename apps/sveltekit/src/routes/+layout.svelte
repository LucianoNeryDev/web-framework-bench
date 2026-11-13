<script lang="ts">
  import { page } from "$app/state";
  import ThemeToggle from "#lib/components/ThemeToggle.svelte";

  let { data, children } = $props();

  const nav = [
    ["/", "Home"],
    ["/blog", "Blog"],
    ["/about", "About"],
  ] as const;

  const current = $derived.by(() => {
    const p = page.url.pathname;
    return p === "/" ? "/" : p === "/blog" || p.startsWith("/blog/") ? "/blog" : p === "/about" ? "/about" : "";
  });
</script>

<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="/">{data.site.title}</a>
    <nav class="site-nav" aria-label="Main">
      {#each nav as [href, label] (href)}
        <a {href} aria-current={current === href ? "page" : undefined}>{label}</a>
      {/each}
    </nav>
    <ThemeToggle />
  </div>
</header>
<main id="main" class="container">
  {@render children()}
</main>
<footer class="site-footer">
  <div class="container"><p>© 2026 {data.site.author} · <a href="/rss.xml" data-sveltekit-reload>RSS</a></p></div>
</footer>
