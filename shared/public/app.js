// Field Notes vanilla island: theme toggle on every page, tag/search filter on /blog.
// Used by the targets without a client framework (static-html, hugo, go, laravel, wordpress, ghost).
(() => {
  const root = document.documentElement;
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch {}
    });
  }

  const list = document.querySelector("[data-post-list]");
  const form = document.querySelector("[data-filters]");
  if (!list || !form) return;

  const input = form.querySelector('input[name="q"]');
  const chips = [...form.querySelectorAll("[data-tag]")];
  const cards = [...list.querySelectorAll("[data-post]")];
  const count = document.querySelector("[data-result-count]");
  const empty = document.querySelector("[data-empty]");
  const params = new URLSearchParams(location.search);
  let query = params.get("q") || "";
  let tag = params.get("tag") || "";
  input.value = query;

  const apply = () => {
    const q = query.trim().toLowerCase();
    let shown = 0;
    for (const card of cards) {
      const matchTag = !tag || card.dataset.tags.split(" ").includes(tag);
      const matchText = !q || card.dataset.search.includes(q);
      card.hidden = !(matchTag && matchText);
      if (!card.hidden) shown++;
    }
    for (const chip of chips) chip.setAttribute("aria-pressed", String(chip.dataset.tag === tag));
    count.textContent = `Showing ${shown} of ${cards.length} posts`;
    empty.hidden = shown !== 0;
    const url = new URL(location.href);
    q ? url.searchParams.set("q", query.trim()) : url.searchParams.delete("q");
    tag ? url.searchParams.set("tag", tag) : url.searchParams.delete("tag");
    history.replaceState(null, "", url);
  };

  input.addEventListener("input", () => { query = input.value; apply(); });
  form.addEventListener("submit", (event) => { event.preventDefault(); query = input.value; apply(); });
  for (const chip of chips) chip.addEventListener("click", () => { tag = chip.dataset.tag; apply(); });
  apply();
})();
