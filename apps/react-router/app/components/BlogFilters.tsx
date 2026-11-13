import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { filterPosts } from "~/lib/filter";
import { tags } from "~/lib/site";
import type { Card as CardData } from "~/lib/posts.server";
import { Card } from "./Card";

const isStatic = import.meta.env.WFB_MODE === "static";

// The URL (q, tag) is the single source of truth for the filter.
//  - server build: the loader already filtered the list from the request URL, so the
//    component renders it as is, and typing navigates with `replace` to re-run the loader.
//  - static build: the pre-rendered page has no query, so the full list is rendered first
//    and the URL is applied after hydration (no hydration mismatch), filtering in the browser.
export function BlogFilters({ cards, total }: { cards: CardData[]; total: number }) {
  const [params, setParams] = useSearchParams();
  const [ready, setReady] = useState(!isStatic);
  useEffect(() => setReady(true), []);

  const q = ready ? (params.get("q") ?? "") : "";
  const tag = ready ? (params.get("tag") ?? "") : "";
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (next: { q?: string; tag?: string }) => {
    const merged = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (value) merged.set(key, value);
      else merged.delete(key);
    }
    setParams(merged, { replace: true, preventScrollReset: true });
  };

  const shown = isStatic ? filterPosts(cards, q, tag) : cards;

  return (
    <>
      <form className="filters" role="search" action="/blog" method="get" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q">Search posts</label>
        <input
          id="q"
          name="q"
          type="search"
          placeholder="Search titles and summaries"
          autoComplete="off"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            update({ q: e.target.value.trim() });
          }}
        />
        <div className="tag-filter" role="group" aria-label="Filter by tag">
          <button type="button" className="chip" aria-pressed={tag === ""} onClick={() => update({ tag: "" })}>
            All
          </button>
          {tags.map((t) => (
            <button
              key={t.slug}
              type="button"
              className="chip"
              aria-pressed={tag === t.slug}
              onClick={() => update({ tag: t.slug })}
            >
              {t.name}
            </button>
          ))}
        </div>
      </form>
      <h2 className="visually-hidden">Posts</h2>
      <p className="result-count" aria-live="polite">
        {`Showing ${shown.length} of ${total} posts`}
      </p>
      <div className="card-grid" data-post-list>
        {shown.map((p, i) => (
          <Card key={p.slug} post={p} eager={i < 3} />
        ))}
      </div>
      <p className="empty" hidden={shown.length !== 0}>
        No posts match.
      </p>
    </>
  );
}
