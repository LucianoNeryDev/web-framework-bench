<script setup lang="ts">
const { site } = useRuntimeConfig().public;
const { data: about } = await useFetch<{ html: string }>("/api/about", { key: "about" });

usePageMeta({ path: "/about", title: "About", description: `About ${site.author} and ${site.title}.`, image: "/images/avatar.webp" });
</script>

<template>
  <section class="about">
    <h1>About</h1>
    <img class="about-avatar" src="/images/avatar.webp" :alt="`Portrait of ${site.author}`" width="160" height="160" />
    <div v-html="about?.html" />
  </section>
</template>
