---
title: "Rethinking a slow query after a long weekend"
slug: rethinking-a-slow-query-after-a-long-weekend
date: 2026-06-18
summary: "A budget for each page kept the bundle from growing one harmless dependency at a time. The slowest part of the deploy was waiting for a health check that checked nothing."
tags: [go, css]
cover: /images/rethinking-a-slow-query-after-a-long-weekend.webp
---
Writing the test first forced me to decide what correct behaviour actually meant. The profiler pointed at serialisation, which was not where I would have guessed. I deleted more code than I added, and the system got faster and easier to read. Tail latency told a different story from the average, which looked perfectly healthy.

Writing the test first forced me to decide what correct behaviour actually meant. Most of the latency came from a single synchronous call that nobody remembered adding. Moving the work off the request path made the page fast and the queue honest. Logs were useful only after every line carried a request identifier. The slowest part of the deploy was waiting for a health check that checked nothing.

## Trade-offs

Moving the work off the request path made the page fast and the queue honest. Most of the latency came from a single synchronous call that nobody remembered adding. Reading the source was faster than searching for a blog post that matched my exact version. I kept the old path behind a flag for a week so I could compare both under real traffic. The slowest part of the deploy was waiting for a health check that checked nothing. I wrote a short runbook so the next incident starts with steps instead of guesses.

The configuration file had grown three ways to say the same thing. Tail latency told a different story from the average, which looked perfectly healthy. A small reproduction in an empty repository removed every distraction from the real problem.

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

I wrote a short runbook so the next incident starts with steps instead of guesses. The benchmark looked impressive until I ran it on the same hardware as production. The migration ran in batches so it could be paused, resumed and verified at each step. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

## What actually fixed it

Measuring before and after turned a hunch into a result I could defend. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I deleted more code than I added, and the system got faster and easier to read. The configuration file had grown three ways to say the same thing.

Writing the test first forced me to decide what correct behaviour actually meant. The documentation described the happy path well and said nothing about what happens on timeout. The real constraint was not the CPU but the number of open file descriptors. Tail latency told a different story from the average, which looked perfectly healthy.

- I started with the simplest version that could possibly work and wrote down every assumption.
- The slowest part of the deploy was waiting for a health check that checked nothing.
- A budget for each page kept the bundle from growing one harmless dependency at a time.
- Reading the source was faster than searching for a blog post that matched my exact version.

Logs were useful only after every line carried a request identifier. The configuration file had grown three ways to say the same thing. Most of the latency came from a single synchronous call that nobody remembered adding.

## Takeaways

The real constraint was not the CPU but the number of open file descriptors. Measuring before and after turned a hunch into a result I could defend. I deleted more code than I added, and the system got faster and easier to read. Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm.

Most tools default to settings that are reasonable for a laptop and surprising on a server. The first measurement was misleading because the cache was already warm. The configuration file had grown three ways to say the same thing. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

> Tail latency told a different story from the average, which looked perfectly healthy.

Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. I wrote a short runbook so the next incident starts with steps instead of guesses. The documentation described the happy path well and said nothing about what happens on timeout.

## Measuring the problem

Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic. I started with the simplest version that could possibly work and wrote down every assumption. The fix itself was three lines; finding where to put them took two days. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

The documentation described the happy path well and said nothing about what happens on timeout. The migration ran in batches so it could be paused, resumed and verified at each step. Clear error messages saved more time than any clever optimisation.

The real constraint was not the CPU but the number of open file descriptors. The configuration file had grown three ways to say the same thing. I kept the old path behind a flag for a week so I could compare both under real traffic.

## What I would do differently

The first measurement was misleading because the cache was already warm. The configuration file had grown three ways to say the same thing. Small, frequent releases made each change easy to reason about and easy to revert. The documentation described the happy path well and said nothing about what happens on timeout. I deleted more code than I added, and the system got faster and easier to read. The fix itself was three lines; finding where to put them took two days.

The configuration file had grown three ways to say the same thing. The fix itself was three lines; finding where to put them took two days. A budget for each page kept the bundle from growing one harmless dependency at a time. I started with the simplest version that could possibly work and wrote down every assumption.

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

The benchmark looked impressive until I ran it on the same hardware as production. Reading the source was faster than searching for a blog post that matched my exact version. I wrote a short runbook so the next incident starts with steps instead of guesses.
