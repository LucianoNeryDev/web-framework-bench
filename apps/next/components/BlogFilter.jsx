"use client";

import { Fragment, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// `items` is [{ slug, tags, search, card }]: card is a server-rendered <Card>, so no post bodies
// and no card code reach the client; only the filter state and the ids to filter on.
export function BlogFilter({ items, tags, initialQ = "", initialTag = "" }) {
  const [q, setQ] = useState(initialQ);
  const [tag, setTag] = useState(initialTag);

  // A link to /blog?tag=x while on /blog changes the incoming props; the typed text wins otherwise.
  useEffect(() => {
    setQ((cur) => (cur.trim() === initialQ.trim() ? cur : initialQ));
    setTag(initialTag);
  }, [initialQ, initialTag]);

  const needle = q.trim().toLowerCase();
  const shown = items.filter((i) => (!tag || i.tags.includes(tag)) && (!needle || i.search.includes(needle)));

  const syncUrl = (nextQ, nextTag) => {
    const url = new URL(window.location.href);
    if (nextQ.trim()) url.searchParams.set("q", nextQ.trim());
    else url.searchParams.delete("q");
    if (nextTag) url.searchParams.set("tag", nextTag);
    else url.searchParams.delete("tag");
    window.history.replaceState(null, "", url);
  };
  const onQuery = (value) => {
    setQ(value);
    syncUrl(value, tag);
  };
  const onTag = (value) => {
    setTag(value);
    syncUrl(q, value);
  };

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
          value={q}
          onChange={(e) => onQuery(e.target.value)}
        />
        <div className="tag-filter" role="group" aria-label="Filter by tag">
          <button type="button" className="chip" aria-pressed={tag === ""} onClick={() => onTag("")}>All</button>
          {tags.map((t) => (
            <button
              key={t.slug}
              type="button"
              className="chip"
              aria-pressed={tag === t.slug}
              onClick={() => onTag(t.slug)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </form>
      <h2 className="visually-hidden">Posts</h2>
      <p className="result-count" aria-live="polite">{`Showing ${shown.length} of ${items.length} posts`}</p>
      <div className="card-grid" data-post-list>
        {shown.map((i) => (
          <Fragment key={i.slug}>{i.card}</Fragment>
        ))}
      </div>
      <p className="empty" hidden={shown.length !== 0}>No posts match.</p>
    </>
  );
}

function FromUrl(props) {
  const params = useSearchParams();
  return <BlogFilter {...props} initialQ={params.get("q") || ""} initialTag={params.get("tag") || ""} />;
}

// Static export: the page is prerendered without a query string, so the filter reads it in the
// browser. useSearchParams needs a Suspense boundary; the fallback is the full, unfiltered list.
export function BlogFilterFromUrl(props) {
  return (
    <Suspense fallback={<BlogFilter {...props} />}>
      <FromUrl {...props} />
    </Suspense>
  );
}
