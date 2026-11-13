export interface Cover {
  src: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
}

export interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  tags: string[];
  readingMinutes: number;
  cover: Cover;
  html: string;
  prev: string | null;
  next: string | null;
  related: string[];
}

export interface Tag {
  slug: string;
  name: string;
}

export interface SiteMeta {
  title: string;
  description: string;
  url: string;
  author: string;
  heroTitle: string;
  heroText: string;
  aboutHtml: string;
}

export interface Dataset {
  site: SiteMeta;
  tags: Tag[];
  posts: Post[];
}

/** What a card needs; never carries the post body. */
export interface CardData {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  thumb: string;
  thumbWidth: number;
  thumbHeight: number;
  tags: Tag[];
}
