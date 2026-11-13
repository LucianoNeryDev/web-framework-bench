---
title: "Shipping background jobs without downtime"
slug: shipping-background-jobs-without-downtime
date: 2026-10-07
summary: "Logs were useful only after every line carried a request identifier. The benchmark looked impressive until I ran it on the same hardware as production."
tags: [devops]
cover: /images/shipping-background-jobs-without-downtime.webp
---
Every abstraction leaked a little, and the leaks were where the bugs lived. Most of the latency came from a single synchronous call that nobody remembered adding. Moving the work off the request path made the page fast and the queue honest. The real constraint was not the CPU but the number of open file descriptors.

Tail latency told a different story from the average, which looked perfectly healthy. The first measurement was misleading because the cache was already warm. A budget for each page kept the bundle from growing one harmless dependency at a time. Retries without jitter turned a short blip into a synchronised wave of traffic. The slowest part of the deploy was waiting for a health check that checked nothing.

## Numbers after the change

A small reproduction in an empty repository removed every distraction from the real problem. Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic. Every abstraction leaked a little, and the leaks were where the bugs lived. The documentation described the happy path well and said nothing about what happens on timeout. The slowest part of the deploy was waiting for a health check that checked nothing.

I wrote a short runbook so the next incident starts with steps instead of guesses. The fix itself was three lines; finding where to put them took two days. Most tools default to settings that are reasonable for a laptop and surprising on a server. Writing the test first forced me to decide what correct behaviour actually meant.

Every abstraction leaked a little, and the leaks were where the bugs lived. The first measurement was misleading because the cache was already warm. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

## The first attempt

Every abstraction leaked a little, and the leaks were where the bugs lived. I kept the old path behind a flag for a week so I could compare both under real traffic. The real constraint was not the CPU but the number of open file descriptors. The migration ran in batches so it could be paused, resumed and verified at each step. The first measurement was misleading because the cache was already warm.

Tail latency told a different story from the average, which looked perfectly healthy. Clear error messages saved more time than any clever optimisation. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Reading the source was faster than searching for a blog post that matched my exact version. The real constraint was not the CPU but the number of open file descriptors.

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

- I wrote a short runbook so the next incident starts with steps instead of guesses.
- The error only appeared when two requests raced for the same row inside one transaction.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- The benchmark looked impressive until I ran it on the same hardware as production.

Moving the work off the request path made the page fast and the queue honest. Logs were useful only after every line carried a request identifier. Small, frequent releases made each change easy to reason about and easy to revert. The documentation described the happy path well and said nothing about what happens on timeout. Measuring before and after turned a hunch into a result I could defend.

## Measuring the problem

Small, frequent releases made each change easy to reason about and easy to revert. I started with the simplest version that could possibly work and wrote down every assumption. Logs were useful only after every line carried a request identifier. The migration ran in batches so it could be paused, resumed and verified at each step. Measuring before and after turned a hunch into a result I could defend. The fix itself was three lines; finding where to put them took two days.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Retries without jitter turned a short blip into a synchronised wave of traffic. Measuring before and after turned a hunch into a result I could defend. A small reproduction in an empty repository removed every distraction from the real problem.

> Reading the source was faster than searching for a blog post that matched my exact version.

The slowest part of the deploy was waiting for a health check that checked nothing. Small, frequent releases made each change easy to reason about and easy to revert. Tail latency told a different story from the average, which looked perfectly healthy.

## What actually fixed it

The real constraint was not the CPU but the number of open file descriptors. Logs were useful only after every line carried a request identifier. I started with the simplest version that could possibly work and wrote down every assumption. The configuration file had grown three ways to say the same thing.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Moving the work off the request path made the page fast and the queue honest. The profiler pointed at serialisation, which was not where I would have guessed. I kept the old path behind a flag for a week so I could compare both under real traffic. Clear error messages saved more time than any clever optimisation.

The fix itself was three lines; finding where to put them took two days. Small, frequent releases made each change easy to reason about and easy to revert. I started with the simplest version that could possibly work and wrote down every assumption. The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived.

## Takeaways

Pinning the versions made the build reproducible and the upgrade a deliberate decision. I started with the simplest version that could possibly work and wrote down every assumption. The first measurement was misleading because the cache was already warm. I deleted more code than I added, and the system got faster and easier to read. Measuring before and after turned a hunch into a result I could defend.

Most of the latency came from a single synchronous call that nobody remembered adding. I started with the simplest version that could possibly work and wrote down every assumption. Small, frequent releases made each change easy to reason about and easy to revert. The first measurement was misleading because the cache was already warm. I wrote a short runbook so the next incident starts with steps instead of guesses.

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

Moving the work off the request path made the page fast and the queue honest. Most tools default to settings that are reasonable for a laptop and surprising on a server. I kept the old path behind a flag for a week so I could compare both under real traffic. The first measurement was misleading because the cache was already warm.
