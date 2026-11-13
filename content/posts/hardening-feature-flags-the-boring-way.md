---
title: "Hardening feature flags the boring way"
slug: hardening-feature-flags-the-boring-way
date: 2026-08-30
summary: "The configuration file had grown three ways to say the same thing. Logs were useful only after every line carried a request identifier."
tags: [javascript, databases]
cover: /images/hardening-feature-flags-the-boring-way.webp
---
Writing the test first forced me to decide what correct behaviour actually meant. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I kept the old path behind a flag for a week so I could compare both under real traffic. Most tools default to settings that are reasonable for a laptop and surprising on a server.

The first measurement was misleading because the cache was already warm. I started with the simplest version that could possibly work and wrote down every assumption. The fix itself was three lines; finding where to put them took two days. Measuring before and after turned a hunch into a result I could defend. Tail latency told a different story from the average, which looked perfectly healthy.

## Trade-offs

Tail latency told a different story from the average, which looked perfectly healthy. The migration ran in batches so it could be paused, resumed and verified at each step. I deleted more code than I added, and the system got faster and easier to read. Most of the latency came from a single synchronous call that nobody remembered adding. Reading the source was faster than searching for a blog post that matched my exact version.

Measuring before and after turned a hunch into a result I could defend. A budget for each page kept the bundle from growing one harmless dependency at a time. Reading the source was faster than searching for a blog post that matched my exact version. Most tools default to settings that are reasonable for a laptop and surprising on a server.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

The error only appeared when two requests raced for the same row inside one transaction. Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic. Small, frequent releases made each change easy to reason about and easy to revert. The configuration file had grown three ways to say the same thing.

## Where it started

Writing the test first forced me to decide what correct behaviour actually meant. Moving the work off the request path made the page fast and the queue honest. Small, frequent releases made each change easy to reason about and easy to revert. The benchmark looked impressive until I ran it on the same hardware as production. Tail latency told a different story from the average, which looked perfectly healthy.

Writing the test first forced me to decide what correct behaviour actually meant. Reading the source was faster than searching for a blog post that matched my exact version. I kept the old path behind a flag for a week so I could compare both under real traffic. The slowest part of the deploy was waiting for a health check that checked nothing. I wrote a short runbook so the next incident starts with steps instead of guesses.

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

- Most tools default to settings that are reasonable for a laptop and surprising on a server.
- The first measurement was misleading because the cache was already warm.
- Tail latency told a different story from the average, which looked perfectly healthy.
- The real constraint was not the CPU but the number of open file descriptors.

Tail latency told a different story from the average, which looked perfectly healthy. Every abstraction leaked a little, and the leaks were where the bugs lived. The profiler pointed at serialisation, which was not where I would have guessed. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Measuring the problem

The first measurement was misleading because the cache was already warm. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I deleted more code than I added, and the system got faster and easier to read. The real constraint was not the CPU but the number of open file descriptors. The benchmark looked impressive until I ran it on the same hardware as production.

I wrote a short runbook so the next incident starts with steps instead of guesses. Most tools default to settings that are reasonable for a laptop and surprising on a server. Retries without jitter turned a short blip into a synchronised wave of traffic. Writing the test first forced me to decide what correct behaviour actually meant.

> Most of the latency came from a single synchronous call that nobody remembered adding.

I started with the simplest version that could possibly work and wrote down every assumption. Small, frequent releases made each change easy to reason about and easy to revert. I kept the old path behind a flag for a week so I could compare both under real traffic. A small reproduction in an empty repository removed every distraction from the real problem.

## Takeaways

Every abstraction leaked a little, and the leaks were where the bugs lived. Logs were useful only after every line carried a request identifier. Reading the source was faster than searching for a blog post that matched my exact version. The documentation described the happy path well and said nothing about what happens on timeout.

Small, frequent releases made each change easy to reason about and easy to revert. I wrote a short runbook so the next incident starts with steps instead of guesses. Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time.

The documentation described the happy path well and said nothing about what happens on timeout. Logs were useful only after every line carried a request identifier. The slowest part of the deploy was waiting for a health check that checked nothing. Reading the source was faster than searching for a blog post that matched my exact version.

## Numbers after the change

Writing the test first forced me to decide what correct behaviour actually meant. Every abstraction leaked a little, and the leaks were where the bugs lived. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The error only appeared when two requests raced for the same row inside one transaction.

Measuring before and after turned a hunch into a result I could defend. Tail latency told a different story from the average, which looked perfectly healthy. I wrote a short runbook so the next incident starts with steps instead of guesses. I started with the simplest version that could possibly work and wrote down every assumption.

Retries without jitter turned a short blip into a synchronised wave of traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The fix itself was three lines; finding where to put them took two days. A small reproduction in an empty repository removed every distraction from the real problem. I deleted more code than I added, and the system got faster and easier to read.
