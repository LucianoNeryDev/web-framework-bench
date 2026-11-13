---
title: "Automating image optimisation on a small budget"
slug: automating-image-optimisation-on-a-small-budget
date: 2026-05-07
summary: "Writing the test first forced me to decide what correct behaviour actually meant. Reading the source was faster than searching for a blog post that matched my exact version."
tags: [testing]
cover: /images/automating-image-optimisation-on-a-small-budget.webp
---
The profiler pointed at serialisation, which was not where I would have guessed. Measuring before and after turned a hunch into a result I could defend. Most tools default to settings that are reasonable for a laptop and surprising on a server. The migration ran in batches so it could be paused, resumed and verified at each step.

Small, frequent releases made each change easy to reason about and easy to revert. Tail latency told a different story from the average, which looked perfectly healthy. Clear error messages saved more time than any clever optimisation. The error only appeared when two requests raced for the same row inside one transaction. Reading the source was faster than searching for a blog post that matched my exact version.

## Numbers after the change

I deleted more code than I added, and the system got faster and easier to read. The slowest part of the deploy was waiting for a health check that checked nothing. The first measurement was misleading because the cache was already warm. Tail latency told a different story from the average, which looked perfectly healthy. Logs were useful only after every line carried a request identifier. The error only appeared when two requests raced for the same row inside one transaction.

A budget for each page kept the bundle from growing one harmless dependency at a time. The migration ran in batches so it could be paused, resumed and verified at each step. The first measurement was misleading because the cache was already warm.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

I deleted more code than I added, and the system got faster and easier to read. Most of the latency came from a single synchronous call that nobody remembered adding. I kept the old path behind a flag for a week so I could compare both under real traffic.

## What I would do differently

Clear error messages saved more time than any clever optimisation. The benchmark looked impressive until I ran it on the same hardware as production. A budget for each page kept the bundle from growing one harmless dependency at a time. Tail latency told a different story from the average, which looked perfectly healthy.

Small, frequent releases made each change easy to reason about and easy to revert. Measuring before and after turned a hunch into a result I could defend. Writing the test first forced me to decide what correct behaviour actually meant. I deleted more code than I added, and the system got faster and easier to read. The migration ran in batches so it could be paused, resumed and verified at each step.

- The benchmark looked impressive until I ran it on the same hardware as production.
- Writing the test first forced me to decide what correct behaviour actually meant.
- Moving the work off the request path made the page fast and the queue honest.
- Tail latency told a different story from the average, which looked perfectly healthy.

The configuration file had grown three ways to say the same thing. The first measurement was misleading because the cache was already warm. The benchmark looked impressive until I ran it on the same hardware as production.

## Measuring the problem

A budget for each page kept the bundle from growing one harmless dependency at a time. The real constraint was not the CPU but the number of open file descriptors. Retries without jitter turned a short blip into a synchronised wave of traffic. The fix itself was three lines; finding where to put them took two days.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Logs were useful only after every line carried a request identifier. I kept the old path behind a flag for a week so I could compare both under real traffic. Small, frequent releases made each change easy to reason about and easy to revert.

> The benchmark looked impressive until I ran it on the same hardware as production.

The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step. Reading the source was faster than searching for a blog post that matched my exact version.

## Where it started

The first measurement was misleading because the cache was already warm. Moving the work off the request path made the page fast and the queue honest. I kept the old path behind a flag for a week so I could compare both under real traffic. Retries without jitter turned a short blip into a synchronised wave of traffic. The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived.

Small, frequent releases made each change easy to reason about and easy to revert. Tail latency told a different story from the average, which looked perfectly healthy. Reading the source was faster than searching for a blog post that matched my exact version.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

Every abstraction leaked a little, and the leaks were where the bugs lived. Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation.
