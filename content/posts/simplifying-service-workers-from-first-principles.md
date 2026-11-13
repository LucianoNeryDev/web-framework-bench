---
title: "Simplifying service workers from first principles"
slug: simplifying-service-workers-from-first-principles
date: 2026-06-26
summary: "Every abstraction leaked a little, and the leaks were where the bugs lived. Writing the test first forced me to decide what correct behaviour actually meant."
tags: [css, security]
cover: /images/simplifying-service-workers-from-first-principles.webp
---
Writing the test first forced me to decide what correct behaviour actually meant. I wrote a short runbook so the next incident starts with steps instead of guesses. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The benchmark looked impressive until I ran it on the same hardware as production.

Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation. Every abstraction leaked a little, and the leaks were where the bugs lived. A small reproduction in an empty repository removed every distraction from the real problem. I deleted more code than I added, and the system got faster and easier to read.

## What I would do differently

The slowest part of the deploy was waiting for a health check that checked nothing. Most of the latency came from a single synchronous call that nobody remembered adding. I deleted more code than I added, and the system got faster and easier to read. I kept the old path behind a flag for a week so I could compare both under real traffic.

The migration ran in batches so it could be paused, resumed and verified at each step. Small, frequent releases made each change easy to reason about and easy to revert. A small reproduction in an empty repository removed every distraction from the real problem. The first measurement was misleading because the cache was already warm.

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

Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic. Most of the latency came from a single synchronous call that nobody remembered adding.

## Takeaways

Moving the work off the request path made the page fast and the queue honest. Every abstraction leaked a little, and the leaks were where the bugs lived. The real constraint was not the CPU but the number of open file descriptors. Retries without jitter turned a short blip into a synchronised wave of traffic.

Clear error messages saved more time than any clever optimisation. Small, frequent releases made each change easy to reason about and easy to revert. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

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

- Small, frequent releases made each change easy to reason about and easy to revert.
- The fix itself was three lines; finding where to put them took two days.
- Measuring before and after turned a hunch into a result I could defend.
- Writing the test first forced me to decide what correct behaviour actually meant.

Logs were useful only after every line carried a request identifier. The migration ran in batches so it could be paused, resumed and verified at each step. Small, frequent releases made each change easy to reason about and easy to revert. I wrote a short runbook so the next incident starts with steps instead of guesses.

## What actually fixed it

The error only appeared when two requests raced for the same row inside one transaction. Logs were useful only after every line carried a request identifier. A small reproduction in an empty repository removed every distraction from the real problem. The first measurement was misleading because the cache was already warm. Most of the latency came from a single synchronous call that nobody remembered adding.

A budget for each page kept the bundle from growing one harmless dependency at a time. Writing the test first forced me to decide what correct behaviour actually meant. Most tools default to settings that are reasonable for a laptop and surprising on a server.

> Every abstraction leaked a little, and the leaks were where the bugs lived.

Tail latency told a different story from the average, which looked perfectly healthy. Every abstraction leaked a little, and the leaks were where the bugs lived. The first measurement was misleading because the cache was already warm.

## The first attempt

The configuration file had grown three ways to say the same thing. A budget for each page kept the bundle from growing one harmless dependency at a time. Measuring before and after turned a hunch into a result I could defend. The fix itself was three lines; finding where to put them took two days.

Tail latency told a different story from the average, which looked perfectly healthy. Small, frequent releases made each change easy to reason about and easy to revert. A small reproduction in an empty repository removed every distraction from the real problem. The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step.

The migration ran in batches so it could be paused, resumed and verified at each step. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The configuration file had grown three ways to say the same thing. Moving the work off the request path made the page fast and the queue honest. Reading the source was faster than searching for a blog post that matched my exact version.
