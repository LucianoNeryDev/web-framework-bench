<script setup lang="ts">
const { site } = useRuntimeConfig().public;
const route = useRoute();
const failed = useError();

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];
const current = computed(() => {
  if (failed.value) return null;
  const path = route.path;
  if (path === "/") return "/";
  return links.slice(1).find((l) => path === l.href || path.startsWith(`${l.href}/`))?.href ?? null;
});
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container">
      <NuxtLink class="brand" to="/">{{ site.title }}</NuxtLink>
      <nav class="site-nav" aria-label="Main">
        <NuxtLink v-for="l in links" :key="l.href" :to="l.href" :aria-current="current === l.href ? 'page' : undefined">{{ l.label }}</NuxtLink>
      </nav>
      <ThemeToggle />
    </div>
  </header>
  <main id="main" class="container">
    <slot />
  </main>
  <footer class="site-footer">
    <div class="container">
      <p>© 2026 {{ site.author }} · <a href="/rss.xml">RSS</a></p>
    </div>
  </footer>
</template>
