---
title: "Measuring background jobs from first principles"
slug: measuring-background-jobs-from-first-principles
date: 2026-04-13
summary: "Most of the latency came from a single synchronous call that nobody remembered adding. I deleted more code than I added, and the system got faster and easier to read."
tags: [performance, databases]
cover: /images/measuring-background-jobs-from-first-principles.webp
---
Pinning the versions made the build reproducible and the upgrade a deliberate decision. Reading the source was faster than searching for a blog post that matched my exact version. The slowest part of the deploy was waiting for a health check that checked nothing. Moving the work off the request path made the page fast and the queue honest.

Every abstraction leaked a little, and the leaks were where the bugs lived. Most tools default to settings that are reasonable for a laptop and surprising on a server. Logs were useful only after every line carried a request identifier. Retries without jitter turned a short blip into a synchronised wave of traffic. The documentation described the happy path well and said nothing about what happens on timeout.

## Takeaways

Logs were useful only after every line carried a request identifier. Most of the latency came from a single synchronous call that nobody remembered adding. The profiler pointed at serialisation, which was not where I would have guessed. The documentation described the happy path well and said nothing about what happens on timeout. I started with the simplest version that could possibly work and wrote down every assumption.

Every abstraction leaked a little, and the leaks were where the bugs lived. Writing the test first forced me to decide what correct behaviour actually meant. I started with the simplest version that could possibly work and wrote down every assumption. Most tools default to settings that are reasonable for a laptop and surprising on a server. Moving the work off the request path made the page fast and the queue honest.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

The error only appeared when two requests raced for the same row inside one transaction. Writing the test first forced me to decide what correct behaviour actually meant. Clear error messages saved more time than any clever optimisation. Reading the source was faster than searching for a blog post that matched my exact version.

## Where it started

The migration ran in batches so it could be paused, resumed and verified at each step. Tail latency told a different story from the average, which looked perfectly healthy. Every abstraction leaked a little, and the leaks were where the bugs lived. Writing the test first forced me to decide what correct behaviour actually meant.

Most tools default to settings that are reasonable for a laptop and surprising on a server. Small, frequent releases made each change easy to reason about and easy to revert. The documentation described the happy path well and said nothing about what happens on timeout.

- The migration ran in batches so it could be paused, resumed and verified at each step.
- Logs were useful only after every line carried a request identifier.
- Small, frequent releases made each change easy to reason about and easy to revert.
- Every abstraction leaked a little, and the leaks were where the bugs lived.

The first measurement was misleading because the cache was already warm. I deleted more code than I added, and the system got faster and easier to read. Most of the latency came from a single synchronous call that nobody remembered adding. Retries without jitter turned a short blip into a synchronised wave of traffic. Reading the source was faster than searching for a blog post that matched my exact version.

## What I would do differently

The benchmark looked impressive until I ran it on the same hardware as production. The first measurement was misleading because the cache was already warm. I deleted more code than I added, and the system got faster and easier to read. Most tools default to settings that are reasonable for a laptop and surprising on a server. A small reproduction in an empty repository removed every distraction from the real problem. The profiler pointed at serialisation, which was not where I would have guessed.

A budget for each page kept the bundle from growing one harmless dependency at a time. The profiler pointed at serialisation, which was not where I would have guessed. I kept the old path behind a flag for a week so I could compare both under real traffic. The benchmark looked impressive until I ran it on the same hardware as production.

```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

@container (min-width: 40rem) {
  .card { grid-template-columns: 1fr 2fr; }
}
```

> Every abstraction leaked a little, and the leaks were where the bugs lived.

The error only appeared when two requests raced for the same row inside one transaction. I deleted more code than I added, and the system got faster and easier to read. Moving the work off the request path made the page fast and the queue honest. The fix itself was three lines; finding where to put them took two days.

## Trade-offs

Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic. A budget for each page kept the bundle from growing one harmless dependency at a time. The profiler pointed at serialisation, which was not where I would have guessed.

The migration ran in batches so it could be paused, resumed and verified at each step. Retries without jitter turned a short blip into a synchronised wave of traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Clear error messages saved more time than any clever optimisation. The configuration file had grown three ways to say the same thing.

Tail latency told a different story from the average, which looked perfectly healthy. The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step.
