import { site } from "./site";

// Metadata for one page. metadataBase (layout) makes the og:image path absolute; the canonical URL is
// written out in full so that "/" keeps its trailing slash.
export function pageMeta({ path, title, description, image, type = "website" }) {
  const fullTitle = path === "/" ? site.title : `${title} · ${site.title}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: `${site.url}${path}`,
      types: { "application/rss+xml": [{ url: "/rss.xml", title: site.title }] },
    },
    openGraph: { type, title: fullTitle, description, images: [image] },
  };
}
