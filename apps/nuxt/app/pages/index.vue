<script setup lang="ts">
const { site } = useRuntimeConfig().public;
const { data: latest } = await useFetch<PostCard[]>("/api/cards", { query: { limit: 6 }, key: "latest" });

usePageMeta({ path: "/", title: site.title, description: site.description, image: "/images/hero.webp" });
</script>

<template>
  <section class="hero">
    <div class="hero-text">
      <h1>{{ site.heroTitle }}</h1>
      <p>{{ site.heroText }}</p>
      <p><NuxtLink class="button" to="/blog">Read the blog</NuxtLink></p>
    </div>
    <img class="hero-image" src="/images/hero.webp" alt="Abstract illustration of overlapping circles" width="1600" height="900" fetchpriority="high" />
  </section>
  <section class="latest" aria-labelledby="latest-heading">
    <h2 id="latest-heading">Latest posts</h2>
    <div class="card-grid">
      <PostCard v-for="p in latest" :key="p.slug" :post="p" />
    </div>
    <p class="section-footer"><NuxtLink to="/blog">All posts →</NuxtLink></p>
  </section>
</template>
