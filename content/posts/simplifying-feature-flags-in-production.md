---
title: "Simplifying feature flags in production"
slug: simplifying-feature-flags-in-production
date: 2026-09-19
summary: "Tail latency told a different story from the average, which looked perfectly healthy. Every abstraction leaked a little, and the leaks were where the bugs lived."
tags: [go]
cover: /images/simplifying-feature-flags-in-production.webp
---
Every abstraction leaked a little, and the leaks were where the bugs lived. The error only appeared when two requests raced for the same row inside one transaction. The configuration file had grown three ways to say the same thing. The first measurement was misleading because the cache was already warm.

Most tools default to settings that are reasonable for a laptop and surprising on a server. I kept the old path behind a flag for a week so I could compare both under real traffic. Writing the test first forced me to decide what correct behaviour actually meant. I started with the simplest version that could possibly work and wrote down every assumption. Moving the work off the request path made the page fast and the queue honest.

## Trade-offs

The migration ran in batches so it could be paused, resumed and verified at each step. The profiler pointed at serialisation, which was not where I would have guessed. A small reproduction in an empty repository removed every distraction from the real problem. The first measurement was misleading because the cache was already warm. The fix itself was three lines; finding where to put them took two days. Retries without jitter turned a short blip into a synchronised wave of traffic.

Clear error messages saved more time than any clever optimisation. I deleted more code than I added, and the system got faster and easier to read. Every abstraction leaked a little, and the leaks were where the bugs lived. Tail latency told a different story from the average, which looked perfectly healthy.

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

The migration ran in batches so it could be paused, resumed and verified at each step. Clear error messages saved more time than any clever optimisation. Every abstraction leaked a little, and the leaks were where the bugs lived. The error only appeared when two requests raced for the same row inside one transaction.

## Numbers after the change

I deleted more code than I added, and the system got faster and easier to read. Clear error messages saved more time than any clever optimisation. Most tools default to settings that are reasonable for a laptop and surprising on a server. The benchmark looked impressive until I ran it on the same hardware as production. Every abstraction leaked a little, and the leaks were where the bugs lived. The error only appeared when two requests raced for the same row inside one transaction.

I started with the simplest version that could possibly work and wrote down every assumption. Measuring before and after turned a hunch into a result I could defend. Moving the work off the request path made the page fast and the queue honest. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

- The first measurement was misleading because the cache was already warm.
- A budget for each page kept the bundle from growing one harmless dependency at a time.
- The slowest part of the deploy was waiting for a health check that checked nothing.
- I kept the old path behind a flag for a week so I could compare both under real traffic.

The real constraint was not the CPU but the number of open file descriptors. Most tools default to settings that are reasonable for a laptop and surprising on a server. The profiler pointed at serialisation, which was not where I would have guessed.

## What I would do differently

I wrote a short runbook so the next incident starts with steps instead of guesses. Logs were useful only after every line carried a request identifier. Most of the latency came from a single synchronous call that nobody remembered adding. Tail latency told a different story from the average, which looked perfectly healthy.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Clear error messages saved more time than any clever optimisation. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

> Measuring before and after turned a hunch into a result I could defend.

A budget for each page kept the bundle from growing one harmless dependency at a time. I deleted more code than I added, and the system got faster and easier to read. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## What actually fixed it

The slowest part of the deploy was waiting for a health check that checked nothing. The real constraint was not the CPU but the number of open file descriptors. Small, frequent releases made each change easy to reason about and easy to revert. I deleted more code than I added, and the system got faster and easier to read.

Reading the source was faster than searching for a blog post that matched my exact version. Logs were useful only after every line carried a request identifier. Most tools default to settings that are reasonable for a laptop and surprising on a server.

Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days. The slowest part of the deploy was waiting for a health check that checked nothing. Tail latency told a different story from the average, which looked perfectly healthy.

## Where it started

I started with the simplest version that could possibly work and wrote down every assumption. The first measurement was misleading because the cache was already warm. I kept the old path behind a flag for a week so I could compare both under real traffic. I deleted more code than I added, and the system got faster and easier to read. Small, frequent releases made each change easy to reason about and easy to revert.

I wrote a short runbook so the next incident starts with steps instead of guesses. The slowest part of the deploy was waiting for a health check that checked nothing. The migration ran in batches so it could be paused, resumed and verified at each step. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Every abstraction leaked a little, and the leaks were where the bugs lived.

Writing the test first forced me to decide what correct behaviour actually meant. The migration ran in batches so it could be paused, resumed and verified at each step. Every abstraction leaked a little, and the leaks were where the bugs lived.
