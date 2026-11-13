<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);

usePageMeta({
  path: "/404",
  title: notFound.value ? "Page not found" : "Something went wrong",
  description: notFound.value ? "This page does not exist." : "The server hit an error.",
  image: "/images/hero.webp",
});
</script>

<template>
  <NuxtLayout>
    <section class="not-found">
      <template v-if="notFound">
        <h1>Page not found</h1>
        <p>The page you asked for does not exist or has moved.</p>
      </template>
      <template v-else>
        <h1>Something went wrong</h1>
        <p>The server hit an error while rendering this page.</p>
      </template>
      <p><a class="button" href="/">Back to the home page</a></p>
    </section>
  </NuxtLayout>
</template>
