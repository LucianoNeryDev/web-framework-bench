// Title, description, canonical and Open Graph tags for one page, in the shape of the reference markup.
export function usePageMeta(page: { path: string; title: string; description: string; image: string; type?: string }) {
  const { site } = useRuntimeConfig().public;
  const fullTitle = page.path === "/" ? site.title : `${page.title} · ${site.title}`;
  useHead({
    title: fullTitle,
    link: [{ rel: "canonical", href: `${site.url}${page.path}` }],
  });
  useSeoMeta({
    description: page.description,
    ogType: (page.type ?? "website") as "website",
    ogTitle: fullTitle,
    ogDescription: page.description,
    ogImage: `${site.url}${page.image}`,
  });
}
