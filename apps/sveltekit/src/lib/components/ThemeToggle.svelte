<script lang="ts">
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }
</script>

<button class="theme-toggle" type="button" aria-label="Toggle dark mode" onclick={toggle}>◐</button>
