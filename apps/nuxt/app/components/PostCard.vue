<script setup lang="ts">
defineProps<{ post: PostCard; eager?: boolean }>();
</script>

<template>
  <article class="card">
    <NuxtLink class="card-link" :to="`/blog/${post.slug}`">
      <img
        class="card-image"
        :src="post.thumb"
        alt=""
        :width="post.thumbWidth"
        :height="post.thumbHeight"
        :loading="eager ? undefined : 'lazy'"
        decoding="async"
      />
      <h3 class="card-title">{{ post.title }}</h3>
    </NuxtLink>
    <p class="card-meta"><time :datetime="post.date">{{ post.dateLabel }}</time> · {{ post.readingMinutes }} min read</p>
    <p class="card-summary">{{ post.summary }}</p>
    <TagList :tags="post.tags" />
  </article>
</template>
