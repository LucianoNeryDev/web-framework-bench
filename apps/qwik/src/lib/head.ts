import type { DocumentHeadValue } from "@builder.io/qwik-city";
import { site } from "./site";

interface PageMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  type?: "website" | "article";
}

export const pageHead = ({ path, title, description, image, type = "website" }: PageMeta): DocumentHeadValue => {
  const full = path === "/" ? site.title : `${title} · ${site.title}`;
  return {
    title: full,
    meta: [
      { key: "description", name: "description", content: description },
      { key: "og:type", property: "og:type", content: type },
      { key: "og:title", property: "og:title", content: full },
      { key: "og:description", property: "og:description", content: description },
      { key: "og:image", property: "og:image", content: `${site.url}${image}` },
    ],
    links: [
      { key: "canonical", rel: "canonical", href: `${site.url}${path}` },
      { key: "rss", rel: "alternate", type: "application/rss+xml", title: site.title, href: "/rss.xml" },
      { key: "icon", rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  };
};
