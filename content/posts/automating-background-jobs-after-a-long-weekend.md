---
title: "Automating background jobs after a long weekend"
slug: automating-background-jobs-after-a-long-weekend
date: 2026-09-30
summary: "Most of the latency came from a single synchronous call that nobody remembered adding. I deleted more code than I added, and the system got faster and easier to read."
tags: [css, testing, tooling]
cover: /images/automating-background-jobs-after-a-long-weekend.webp
---
I started with the simplest version that could possibly work and wrote down every assumption. The configuration file had grown three ways to say the same thing. Clear error messages saved more time than any clever optimisation. The fix itself was three lines; finding where to put them took two days.

The first measurement was misleading because the cache was already warm. I wrote a short runbook so the next incident starts with steps instead of guesses. The error only appeared when two requests raced for the same row inside one transaction. Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic.

## Takeaways

Clear error messages saved more time than any clever optimisation. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived.

The configuration file had grown three ways to say the same thing. The benchmark looked impressive until I ran it on the same hardware as production. The first measurement was misleading because the cache was already warm. Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation.

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

Measuring before and after turned a hunch into a result I could defend. Most tools default to settings that are reasonable for a laptop and surprising on a server. Most of the latency came from a single synchronous call that nobody remembered adding. The migration ran in batches so it could be paused, resumed and verified at each step. The real constraint was not the CPU but the number of open file descriptors.

## The first attempt

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The configuration file had grown three ways to say the same thing. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Most tools default to settings that are reasonable for a laptop and surprising on a server.

Retries without jitter turned a short blip into a synchronised wave of traffic. Measuring before and after turned a hunch into a result I could defend. Every abstraction leaked a little, and the leaks were where the bugs lived. I wrote a short runbook so the next incident starts with steps instead of guesses. Writing the test first forced me to decide what correct behaviour actually meant.

- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- The benchmark looked impressive until I ran it on the same hardware as production.
- Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.
- The real constraint was not the CPU but the number of open file descriptors.

Clear error messages saved more time than any clever optimisation. Most of the latency came from a single synchronous call that nobody remembered adding. The profiler pointed at serialisation, which was not where I would have guessed. Reading the source was faster than searching for a blog post that matched my exact version.

## Where it started

The fix itself was three lines; finding where to put them took two days. Most tools default to settings that are reasonable for a laptop and surprising on a server. The benchmark looked impressive until I ran it on the same hardware as production. I deleted more code than I added, and the system got faster and easier to read.

The error only appeared when two requests raced for the same row inside one transaction. I started with the simplest version that could possibly work and wrote down every assumption. The documentation described the happy path well and said nothing about what happens on timeout. A small reproduction in an empty repository removed every distraction from the real problem. The benchmark looked impressive until I ran it on the same hardware as production.

> Clear error messages saved more time than any clever optimisation.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic. The documentation described the happy path well and said nothing about what happens on timeout.

## What actually fixed it

Retries without jitter turned a short blip into a synchronised wave of traffic. The error only appeared when two requests raced for the same row inside one transaction. Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days. I wrote a short runbook so the next incident starts with steps instead of guesses. Clear error messages saved more time than any clever optimisation.

Most of the latency came from a single synchronous call that nobody remembered adding. The migration ran in batches so it could be paused, resumed and verified at each step. The benchmark looked impressive until I ran it on the same hardware as production. Retries without jitter turned a short blip into a synchronised wave of traffic.

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

Measuring before and after turned a hunch into a result I could defend. The real constraint was not the CPU but the number of open file descriptors. A budget for each page kept the bundle from growing one harmless dependency at a time. Tail latency told a different story from the average, which looked perfectly healthy. The error only appeared when two requests raced for the same row inside one transaction.
