export type Filterable = { title: string; summary: string; tags: string[] };

// A post matches when the tag (if any) is in its tags and the query (if any)
// is a case-insensitive substring of "title summary". Order is preserved.
export function filterPosts<T extends Filterable>(items: T[], q: string, tag: string): T[] {
  const needle = q.trim().toLowerCase();
  return items.filter(
    (p) => (!tag || p.tags.includes(tag)) && (!needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle)),
  );
}
