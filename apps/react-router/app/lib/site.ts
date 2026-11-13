// Only the named exports used here reach the client bundle; `posts` is tree-shaken away.
import { site, tags } from "~/data/posts.json";

export { site, tags };
export const tagName = (slug: string) => tags.find((t) => t.slug === slug)?.name ?? slug;

export const pageTitle = (title?: string) => (title ? `${title} · ${site.title}` : site.title);

export function pageMeta({
  path,
  title,
  description,
  image,
  type = "website",
}: {
  path: string;
  title?: string;
  description: string;
  image: string;
  type?: string;
}) {
  const full = pageTitle(title);
  return [
    { title: full },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: `${site.url}${path}` },
    { property: "og:type", content: type },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:image", content: `${site.url}${image}` },
  ];
}
