import { $, component$, sync$, useSignal } from "@builder.io/qwik";

export const ThemeToggle = component$(() => {
  // The last theme chosen on this page, shown as the button tooltip.
  const theme = useSignal("");

  return (
    <button
      class="theme-toggle"
      type="button"
      aria-label="Toggle dark mode"
      title={theme.value ? `Theme: ${theme.value}` : undefined}
      onClick$={[
        // sync$ is inlined into the HTML and runs inside qwikloader's click listener, so the theme flips
        // immediately, before any component code is downloaded.
        sync$(() => {
          const root = document.documentElement;
          const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
          const next = current === "dark" ? "light" : "dark";
          root.dataset.theme = next;
          try {
            localStorage.setItem("theme", next);
          } catch (e) {
            /* storage can be blocked */
          }
        }),
        $(() => {
          theme.value = document.documentElement.dataset.theme ?? "";
        }),
      ]}
    >
      ◐
    </button>
  );
});
