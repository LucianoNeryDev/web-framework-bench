---
title: "Profiling dependency updates on a small budget"
slug: profiling-dependency-updates-on-a-small-budget
date: 2026-07-19
summary: "Clear error messages saved more time than any clever optimisation. I deleted more code than I added, and the system got faster and easier to read."
tags: [go, css, devops]
cover: /images/profiling-dependency-updates-on-a-small-budget.webp
---
The benchmark looked impressive until I ran it on the same hardware as production. Small, frequent releases made each change easy to reason about and easy to revert. Retries without jitter turned a short blip into a synchronised wave of traffic. The fix itself was three lines; finding where to put them took two days.

Measuring before and after turned a hunch into a result I could defend. I deleted more code than I added, and the system got faster and easier to read. The benchmark looked impressive until I ran it on the same hardware as production. Logs were useful only after every line carried a request identifier. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## The first attempt

I wrote a short runbook so the next incident starts with steps instead of guesses. A budget for each page kept the bundle from growing one harmless dependency at a time. Most tools default to settings that are reasonable for a laptop and surprising on a server. A small reproduction in an empty repository removed every distraction from the real problem. The slowest part of the deploy was waiting for a health check that checked nothing. The first measurement was misleading because the cache was already warm.

The documentation described the happy path well and said nothing about what happens on timeout. Tail latency told a different story from the average, which looked perfectly healthy. I started with the simplest version that could possibly work and wrote down every assumption. The configuration file had grown three ways to say the same thing.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

I kept the old path behind a flag for a week so I could compare both under real traffic. I deleted more code than I added, and the system got faster and easier to read. The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step.

## Takeaways

Writing the test first forced me to decide what correct behaviour actually meant. The migration ran in batches so it could be paused, resumed and verified at each step. A budget for each page kept the bundle from growing one harmless dependency at a time. The first measurement was misleading because the cache was already warm. Most tools default to settings that are reasonable for a laptop and surprising on a server. Most of the latency came from a single synchronous call that nobody remembered adding.

I started with the simplest version that could possibly work and wrote down every assumption. Writing the test first forced me to decide what correct behaviour actually meant. Measuring before and after turned a hunch into a result I could defend. Small, frequent releases made each change easy to reason about and easy to revert.

```js
export async function retry(fn, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const delay = 2 ** i * 100 + Math.random() * 100;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('retry budget exhausted');
}
```

- Every abstraction leaked a little, and the leaks were where the bugs lived.
- I started with the simplest version that could possibly work and wrote down every assumption.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- The benchmark looked impressive until I ran it on the same hardware as production.

The benchmark looked impressive until I ran it on the same hardware as production. Writing the test first forced me to decide what correct behaviour actually meant. Retries without jitter turned a short blip into a synchronised wave of traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## What actually fixed it

A budget for each page kept the bundle from growing one harmless dependency at a time. The slowest part of the deploy was waiting for a health check that checked nothing. The documentation described the happy path well and said nothing about what happens on timeout. The migration ran in batches so it could be paused, resumed and verified at each step.

The real constraint was not the CPU but the number of open file descriptors. The migration ran in batches so it could be paused, resumed and verified at each step. I wrote a short runbook so the next incident starts with steps instead of guesses. The first measurement was misleading because the cache was already warm. Most of the latency came from a single synchronous call that nobody remembered adding.

> A small reproduction in an empty repository removed every distraction from the real problem.

The slowest part of the deploy was waiting for a health check that checked nothing. A small reproduction in an empty repository removed every distraction from the real problem. I kept the old path behind a flag for a week so I could compare both under real traffic. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

## Measuring the problem

Clear error messages saved more time than any clever optimisation. Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. The slowest part of the deploy was waiting for a health check that checked nothing. Measuring before and after turned a hunch into a result I could defend. Logs were useful only after every line carried a request identifier.

The error only appeared when two requests raced for the same row inside one transaction. Small, frequent releases made each change easy to reason about and easy to revert. The real constraint was not the CPU but the number of open file descriptors. I started with the simplest version that could possibly work and wrote down every assumption. Logs were useful only after every line carried a request identifier.

Retries without jitter turned a short blip into a synchronised wave of traffic. Most tools default to settings that are reasonable for a laptop and surprising on a server. The profiler pointed at serialisation, which was not where I would have guessed. Logs were useful only after every line carried a request identifier. The migration ran in batches so it could be paused, resumed and verified at each step.
