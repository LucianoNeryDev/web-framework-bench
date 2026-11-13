<script setup lang="ts">
function toggle() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}
</script>

<template>
  <button class="theme-toggle" type="button" aria-label="Toggle dark mode" @click="toggle">◐</button>
</template>
