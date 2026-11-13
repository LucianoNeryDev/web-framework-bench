---
title: "Profiling feature flags step by step"
slug: profiling-feature-flags-step-by-step
date: 2026-04-29
summary: "Measuring before and after turned a hunch into a result I could defend. Clear error messages saved more time than any clever optimisation."
tags: [css]
cover: /images/profiling-feature-flags-step-by-step.webp
---
The real constraint was not the CPU but the number of open file descriptors. Retries without jitter turned a short blip into a synchronised wave of traffic. Logs were useful only after every line carried a request identifier. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days. The slowest part of the deploy was waiting for a health check that checked nothing. Moving the work off the request path made the page fast and the queue honest. I deleted more code than I added, and the system got faster and easier to read.

## Where it started

Writing the test first forced me to decide what correct behaviour actually meant. The benchmark looked impressive until I ran it on the same hardware as production. The documentation described the happy path well and said nothing about what happens on timeout. Measuring before and after turned a hunch into a result I could defend.

The documentation described the happy path well and said nothing about what happens on timeout. The benchmark looked impressive until I ran it on the same hardware as production. I wrote a short runbook so the next incident starts with steps instead of guesses. Most tools default to settings that are reasonable for a laptop and surprising on a server. Clear error messages saved more time than any clever optimisation.

Most of the latency came from a single synchronous call that nobody remembered adding. The configuration file had grown three ways to say the same thing. Logs were useful only after every line carried a request identifier. Moving the work off the request path made the page fast and the queue honest.

## What actually fixed it

Moving the work off the request path made the page fast and the queue honest. I wrote a short runbook so the next incident starts with steps instead of guesses. The documentation described the happy path well and said nothing about what happens on timeout. I kept the old path behind a flag for a week so I could compare both under real traffic. Most tools default to settings that are reasonable for a laptop and surprising on a server.

The error only appeared when two requests raced for the same row inside one transaction. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Small, frequent releases made each change easy to reason about and easy to revert. The migration ran in batches so it could be paused, resumed and verified at each step.

- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- I kept the old path behind a flag for a week so I could compare both under real traffic.
- Reading the source was faster than searching for a blog post that matched my exact version.
- I deleted more code than I added, and the system got faster and easier to read.

Retries without jitter turned a short blip into a synchronised wave of traffic. A budget for each page kept the bundle from growing one harmless dependency at a time. Small, frequent releases made each change easy to reason about and easy to revert. Every abstraction leaked a little, and the leaks were where the bugs lived.

## Measuring the problem

The migration ran in batches so it could be paused, resumed and verified at each step. I started with the simplest version that could possibly work and wrote down every assumption. I kept the old path behind a flag for a week so I could compare both under real traffic. The real constraint was not the CPU but the number of open file descriptors. Reading the source was faster than searching for a blog post that matched my exact version.

Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time. I wrote a short runbook so the next incident starts with steps instead of guesses. Retries without jitter turned a short blip into a synchronised wave of traffic.

> The profiler pointed at serialisation, which was not where I would have guessed.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The error only appeared when two requests raced for the same row inside one transaction. The first measurement was misleading because the cache was already warm.

## What I would do differently

I wrote a short runbook so the next incident starts with steps instead of guesses. Moving the work off the request path made the page fast and the queue honest. Most tools default to settings that are reasonable for a laptop and surprising on a server. The profiler pointed at serialisation, which was not where I would have guessed. Writing the test first forced me to decide what correct behaviour actually meant. I kept the old path behind a flag for a week so I could compare both under real traffic.

Measuring before and after turned a hunch into a result I could defend. The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived. I deleted more code than I added, and the system got faster and easier to read. A budget for each page kept the bundle from growing one harmless dependency at a time.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

The real constraint was not the CPU but the number of open file descriptors. Most of the latency came from a single synchronous call that nobody remembered adding. Measuring before and after turned a hunch into a result I could defend.

## The first attempt

The profiler pointed at serialisation, which was not where I would have guessed. Every abstraction leaked a little, and the leaks were where the bugs lived. The slowest part of the deploy was waiting for a health check that checked nothing. Clear error messages saved more time than any clever optimisation.

The error only appeared when two requests raced for the same row inside one transaction. Most of the latency came from a single synchronous call that nobody remembered adding. Most tools default to settings that are reasonable for a laptop and surprising on a server.

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

The profiler pointed at serialisation, which was not where I would have guessed. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I kept the old path behind a flag for a week so I could compare both under real traffic. Small, frequent releases made each change easy to reason about and easy to revert.
