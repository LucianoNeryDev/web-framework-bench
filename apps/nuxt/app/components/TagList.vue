<script setup lang="ts">
defineProps<{ tags: string[] }>();
const tagName = useTagNames();
</script>

<template>
  <ul class="tag-list">
    <li v-for="t in tags" :key="t"><NuxtLink class="tag" :to="`/blog?tag=${t}`">{{ tagName[t] }}</NuxtLink></li>
  </ul>
</template>
