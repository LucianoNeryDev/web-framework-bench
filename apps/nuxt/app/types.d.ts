// Slim post shape used by cards: no body, no related list.
interface PostCard {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  tags: string[];
  thumb: string;
  thumbWidth: number;
  thumbHeight: number;
}
interface PostPage extends Omit<PostCard, "thumb" | "thumbWidth" | "thumbHeight"> {
  cover: { src: string; alt: string; width: number; height: number };
  html: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  related: PostCard[];
}
