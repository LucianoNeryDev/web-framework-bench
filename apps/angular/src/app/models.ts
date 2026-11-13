export interface Site {
  title: string;
  description: string;
  url: string;
  author: string;
  heroTitle: string;
  heroText: string;
  aboutHtml: string;
}

export interface Tag {
  slug: string;
  name: string;
}

export interface Cover {
  src: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  tags: string[];
  readingMinutes: number;
  cover: Cover;
  prev: string | null;
  next: string | null;
  related: string[];
}
