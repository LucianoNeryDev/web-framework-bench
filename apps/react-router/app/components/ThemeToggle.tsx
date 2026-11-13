export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button className="theme-toggle" type="button" aria-label="Toggle dark mode" onClick={toggle}>
      ◐
    </button>
  );
}
