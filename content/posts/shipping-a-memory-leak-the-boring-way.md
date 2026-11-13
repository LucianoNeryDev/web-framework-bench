---
title: "Shipping a memory leak the boring way"
slug: shipping-a-memory-leak-the-boring-way
date: 2026-07-24
summary: "The documentation described the happy path well and said nothing about what happens on timeout. A budget for each page kept the bundle from growing one harmless dependency at a time."
tags: [databases]
cover: /images/shipping-a-memory-leak-the-boring-way.webp
---
I started with the simplest version that could possibly work and wrote down every assumption. The documentation described the happy path well and said nothing about what happens on timeout. The migration ran in batches so it could be paused, resumed and verified at each step. The configuration file had grown three ways to say the same thing.

Most tools default to settings that are reasonable for a laptop and surprising on a server. I deleted more code than I added, and the system got faster and easier to read. The documentation described the happy path well and said nothing about what happens on timeout. The slowest part of the deploy was waiting for a health check that checked nothing. The profiler pointed at serialisation, which was not where I would have guessed.

## Measuring the problem

Moving the work off the request path made the page fast and the queue honest. I deleted more code than I added, and the system got faster and easier to read. Most tools default to settings that are reasonable for a laptop and surprising on a server. Writing the test first forced me to decide what correct behaviour actually meant.

The documentation described the happy path well and said nothing about what happens on timeout. The fix itself was three lines; finding where to put them took two days. The slowest part of the deploy was waiting for a health check that checked nothing.

The migration ran in batches so it could be paused, resumed and verified at each step. The first measurement was misleading because the cache was already warm. I kept the old path behind a flag for a week so I could compare both under real traffic.

## Takeaways

The first measurement was misleading because the cache was already warm. Small, frequent releases made each change easy to reason about and easy to revert. Moving the work off the request path made the page fast and the queue honest. A budget for each page kept the bundle from growing one harmless dependency at a time. Retries without jitter turned a short blip into a synchronised wave of traffic. The profiler pointed at serialisation, which was not where I would have guessed.

A small reproduction in an empty repository removed every distraction from the real problem. Every abstraction leaked a little, and the leaks were where the bugs lived. The fix itself was three lines; finding where to put them took two days.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

- Most tools default to settings that are reasonable for a laptop and surprising on a server.
- I deleted more code than I added, and the system got faster and easier to read.
- The configuration file had grown three ways to say the same thing.
- The documentation described the happy path well and said nothing about what happens on timeout.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. A small reproduction in an empty repository removed every distraction from the real problem. I started with the simplest version that could possibly work and wrote down every assumption.

## Trade-offs

The migration ran in batches so it could be paused, resumed and verified at each step. A budget for each page kept the bundle from growing one harmless dependency at a time. Tail latency told a different story from the average, which looked perfectly healthy. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

The real constraint was not the CPU but the number of open file descriptors. The first measurement was misleading because the cache was already warm. I kept the old path behind a flag for a week so I could compare both under real traffic. Writing the test first forced me to decide what correct behaviour actually meant. Retries without jitter turned a short blip into a synchronised wave of traffic.

> Small, frequent releases made each change easy to reason about and easy to revert.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I started with the simplest version that could possibly work and wrote down every assumption. The benchmark looked impressive until I ran it on the same hardware as production. Tail latency told a different story from the average, which looked perfectly healthy.

## What actually fixed it

I started with the simplest version that could possibly work and wrote down every assumption. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The migration ran in batches so it could be paused, resumed and verified at each step. The slowest part of the deploy was waiting for a health check that checked nothing. Every abstraction leaked a little, and the leaks were where the bugs lived.

The slowest part of the deploy was waiting for a health check that checked nothing. Every abstraction leaked a little, and the leaks were where the bugs lived. Retries without jitter turned a short blip into a synchronised wave of traffic. Measuring before and after turned a hunch into a result I could defend. Tail latency told a different story from the average, which looked perfectly healthy.

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

Writing the test first forced me to decide what correct behaviour actually meant. The documentation described the happy path well and said nothing about what happens on timeout. Small, frequent releases made each change easy to reason about and easy to revert. The error only appeared when two requests raced for the same row inside one transaction.

## Where it started

Measuring before and after turned a hunch into a result I could defend. I deleted more code than I added, and the system got faster and easier to read. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The profiler pointed at serialisation, which was not where I would have guessed. The real constraint was not the CPU but the number of open file descriptors.

Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation. Retries without jitter turned a short blip into a synchronised wave of traffic. The profiler pointed at serialisation, which was not where I would have guessed.

Tail latency told a different story from the average, which looked perfectly healthy. Small, frequent releases made each change easy to reason about and easy to revert. Reading the source was faster than searching for a blog post that matched my exact version.
