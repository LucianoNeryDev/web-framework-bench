export interface TagRef {
  slug: string;
  name: string;
}

/** What a card needs: no post body, so list pages never carry it. */
export interface CardPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  thumb: string;
  thumbWidth: number;
  thumbHeight: number;
  tags: TagRef[];
}
