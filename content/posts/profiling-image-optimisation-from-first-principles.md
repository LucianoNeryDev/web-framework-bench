---
title: "Profiling image optimisation from first principles"
slug: profiling-image-optimisation-from-first-principles
date: 2026-05-18
summary: "A budget for each page kept the bundle from growing one harmless dependency at a time. The error only appeared when two requests raced for the same row inside one transaction."
tags: [go, testing]
cover: /images/profiling-image-optimisation-from-first-principles.webp
---
Every abstraction leaked a little, and the leaks were where the bugs lived. Retries without jitter turned a short blip into a synchronised wave of traffic. The benchmark looked impressive until I ran it on the same hardware as production. Logs were useful only after every line carried a request identifier.

The configuration file had grown three ways to say the same thing. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Most of the latency came from a single synchronous call that nobody remembered adding. I deleted more code than I added, and the system got faster and easier to read. The migration ran in batches so it could be paused, resumed and verified at each step.

## What I would do differently

Reading the source was faster than searching for a blog post that matched my exact version. Moving the work off the request path made the page fast and the queue honest. The benchmark looked impressive until I ran it on the same hardware as production. Tail latency told a different story from the average, which looked perfectly healthy. Most of the latency came from a single synchronous call that nobody remembered adding.

Clear error messages saved more time than any clever optimisation. The documentation described the happy path well and said nothing about what happens on timeout. The error only appeared when two requests raced for the same row inside one transaction. The benchmark looked impressive until I ran it on the same hardware as production. The fix itself was three lines; finding where to put them took two days.

Most tools default to settings that are reasonable for a laptop and surprising on a server. A budget for each page kept the bundle from growing one harmless dependency at a time. The migration ran in batches so it could be paused, resumed and verified at each step. Most of the latency came from a single synchronous call that nobody remembered adding.

## Takeaways

I started with the simplest version that could possibly work and wrote down every assumption. The first measurement was misleading because the cache was already warm. The documentation described the happy path well and said nothing about what happens on timeout. I kept the old path behind a flag for a week so I could compare both under real traffic. The profiler pointed at serialisation, which was not where I would have guessed.

Measuring before and after turned a hunch into a result I could defend. I deleted more code than I added, and the system got faster and easier to read. The configuration file had grown three ways to say the same thing. Clear error messages saved more time than any clever optimisation. The migration ran in batches so it could be paused, resumed and verified at each step.

- The profiler pointed at serialisation, which was not where I would have guessed.
- The first measurement was misleading because the cache was already warm.
- Writing the test first forced me to decide what correct behaviour actually meant.
- Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

Reading the source was faster than searching for a blog post that matched my exact version. The benchmark looked impressive until I ran it on the same hardware as production. The migration ran in batches so it could be paused, resumed and verified at each step. Retries without jitter turned a short blip into a synchronised wave of traffic. Tail latency told a different story from the average, which looked perfectly healthy.

## The first attempt

Logs were useful only after every line carried a request identifier. The migration ran in batches so it could be paused, resumed and verified at each step. The documentation described the happy path well and said nothing about what happens on timeout. Small, frequent releases made each change easy to reason about and easy to revert. Reading the source was faster than searching for a blog post that matched my exact version. Tail latency told a different story from the average, which looked perfectly healthy.

Every abstraction leaked a little, and the leaks were where the bugs lived. I kept the old path behind a flag for a week so I could compare both under real traffic. Most of the latency came from a single synchronous call that nobody remembered adding.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

> Moving the work off the request path made the page fast and the queue honest.

A budget for each page kept the bundle from growing one harmless dependency at a time. The documentation described the happy path well and said nothing about what happens on timeout. Writing the test first forced me to decide what correct behaviour actually meant.

## Numbers after the change

The documentation described the happy path well and said nothing about what happens on timeout. Most of the latency came from a single synchronous call that nobody remembered adding. The slowest part of the deploy was waiting for a health check that checked nothing. The fix itself was three lines; finding where to put them took two days.

The migration ran in batches so it could be paused, resumed and verified at each step. Reading the source was faster than searching for a blog post that matched my exact version. Most tools default to settings that are reasonable for a laptop and surprising on a server. I kept the old path behind a flag for a week so I could compare both under real traffic. Most of the latency came from a single synchronous call that nobody remembered adding.

Retries without jitter turned a short blip into a synchronised wave of traffic. Most of the latency came from a single synchronous call that nobody remembered adding. The configuration file had grown three ways to say the same thing. The documentation described the happy path well and said nothing about what happens on timeout.

## Where it started

Moving the work off the request path made the page fast and the queue honest. The real constraint was not the CPU but the number of open file descriptors. The profiler pointed at serialisation, which was not where I would have guessed. I started with the simplest version that could possibly work and wrote down every assumption.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The slowest part of the deploy was waiting for a health check that checked nothing. I started with the simplest version that could possibly work and wrote down every assumption. A budget for each page kept the bundle from growing one harmless dependency at a time.

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

A budget for each page kept the bundle from growing one harmless dependency at a time. The real constraint was not the CPU but the number of open file descriptors. Small, frequent releases made each change easy to reason about and easy to revert.
