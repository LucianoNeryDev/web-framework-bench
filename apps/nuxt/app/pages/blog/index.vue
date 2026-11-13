<script setup lang="ts">
const { site, tags } = useRuntimeConfig().public;
const route = useRoute();
const router = useRouter();
const { data: posts } = await useFetch<PostCard[]>("/api/cards", { key: "cards" });
const total = posts.value?.length ?? 0;

// Filter state starts from the route query (so the server renders ?q=&tag= already filtered) and is written
// back to the query with router.replace, which never reloads the page.
const first = (v: unknown) => (Array.isArray(v) ? v[0] : v) ?? "";
const q = ref(String(first(route.query.q)));
const tag = ref(String(first(route.query.tag)));

const shown = computed(() => {
  const needle = q.value.trim().toLowerCase();
  return (posts.value ?? []).filter(
    (p) => (!tag.value || p.tags.includes(tag.value)) && (!needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle)),
  );
});

if (import.meta.client) {
  watch([q, tag], () => {
    const query: Record<string, string> = {};
    if (q.value.trim()) query.q = q.value.trim();
    if (tag.value) query.tag = tag.value;
    router.replace({ query });
  });
  // A link such as /blog?tag=go clicked while already on /blog.
  watch(
    () => route.query,
    (query) => {
      q.value = String(first(query.q));
      tag.value = String(first(query.tag));
    },
  );
}

usePageMeta({ path: "/blog", title: "Blog", description: `All ${total} posts on ${site.title}.`, image: "/images/hero.webp" });
</script>

<template>
  <h1>Blog</h1>
  <p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
  <form class="filters" role="search" action="/blog" method="get" @submit.prevent>
    <label for="q">Search posts</label>
    <input id="q" v-model="q" name="q" type="search" placeholder="Search titles and summaries" autocomplete="off" />
    <div class="tag-filter" role="group" aria-label="Filter by tag">
      <button type="button" class="chip" :aria-pressed="String(tag === '')" @click="tag = ''">All</button>
      <button v-for="t in tags" :key="t.slug" type="button" class="chip" :aria-pressed="String(tag === t.slug)" @click="tag = t.slug">{{ t.name }}</button>
    </div>
  </form>
  <h2 class="visually-hidden">Posts</h2>
  <p class="result-count" aria-live="polite">Showing {{ shown.length }} of {{ total }} posts</p>
  <div class="card-grid" data-post-list>
    <PostCard v-for="(p, i) in shown" :key="p.slug" :post="p" :eager="i < 3" />
  </div>
  <p class="empty" :hidden="shown.length > 0">No posts match.</p>
</template>
