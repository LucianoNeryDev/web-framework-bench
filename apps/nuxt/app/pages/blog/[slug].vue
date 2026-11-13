<script setup lang="ts">
const slug = useRoute().params.slug as string;
const { data: post, error } = await useFetch<PostPage>(`/api/posts/${slug}`, { key: `post:${slug}` });
if (error.value || !post.value) throw createError({ statusCode: 404, statusMessage: "Post not found", fatal: true });

usePageMeta({
  path: `/blog/${slug}`,
  title: post.value.title,
  description: post.value.summary,
  image: post.value.cover.src,
  type: "article",
});
</script>

<template>
  <template v-if="post">
    <article class="post">
      <header class="post-header">
        <p class="post-meta"><time :datetime="post.date">{{ post.dateLabel }}</time> · {{ post.readingMinutes }} min read</p>
        <h1>{{ post.title }}</h1>
        <p class="post-summary">{{ post.summary }}</p>
        <TagList :tags="post.tags" />
      </header>
      <img class="post-cover" :src="post.cover.src" :alt="post.cover.alt" :width="post.cover.width" :height="post.cover.height" fetchpriority="high" />
      <div class="post-body" v-html="post.html" />
    </article>
    <nav class="post-nav" aria-label="Adjacent posts">
      <NuxtLink v-if="post.prev" rel="prev" :to="`/blog/${post.prev.slug}`">← {{ post.prev.title }}</NuxtLink>
      <NuxtLink v-if="post.next" rel="next" :to="`/blog/${post.next.slug}`">{{ post.next.title }} →</NuxtLink>
    </nav>
    <section class="related" aria-labelledby="related-heading">
      <h2 id="related-heading">Related posts</h2>
      <div class="card-grid">
        <PostCard v-for="p in post.related" :key="p.slug" :post="p" />
      </div>
    </section>
  </template>
</template>
