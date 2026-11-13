---
title: "Hardening CSS container queries under load"
slug: hardening-css-container-queries-under-load
date: 2026-09-14
summary: "Reading the source was faster than searching for a blog post that matched my exact version. I deleted more code than I added, and the system got faster and easier to read."
tags: [css]
cover: /images/hardening-css-container-queries-under-load.webp
---
A small reproduction in an empty repository removed every distraction from the real problem. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Measuring before and after turned a hunch into a result I could defend. Most of the latency came from a single synchronous call that nobody remembered adding.

The migration ran in batches so it could be paused, resumed and verified at each step. The profiler pointed at serialisation, which was not where I would have guessed. Reading the source was faster than searching for a blog post that matched my exact version. Small, frequent releases made each change easy to reason about and easy to revert. I started with the simplest version that could possibly work and wrote down every assumption.

## Trade-offs

The benchmark looked impressive until I ran it on the same hardware as production. The migration ran in batches so it could be paused, resumed and verified at each step. I deleted more code than I added, and the system got faster and easier to read. Small, frequent releases made each change easy to reason about and easy to revert.

The first measurement was misleading because the cache was already warm. The migration ran in batches so it could be paused, resumed and verified at each step. I deleted more code than I added, and the system got faster and easier to read.

Every abstraction leaked a little, and the leaks were where the bugs lived. Clear error messages saved more time than any clever optimisation. The configuration file had grown three ways to say the same thing. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The benchmark looked impressive until I ran it on the same hardware as production.

## Takeaways

I started with the simplest version that could possibly work and wrote down every assumption. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The profiler pointed at serialisation, which was not where I would have guessed. The first measurement was misleading because the cache was already warm. Small, frequent releases made each change easy to reason about and easy to revert.

Reading the source was faster than searching for a blog post that matched my exact version. Clear error messages saved more time than any clever optimisation. Tail latency told a different story from the average, which looked perfectly healthy. Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm.

- Logs were useful only after every line carried a request identifier.
- The first measurement was misleading because the cache was already warm.
- Every abstraction leaked a little, and the leaks were where the bugs lived.
- A small reproduction in an empty repository removed every distraction from the real problem.

The migration ran in batches so it could be paused, resumed and verified at each step. Tail latency told a different story from the average, which looked perfectly healthy. I deleted more code than I added, and the system got faster and easier to read. Most tools default to settings that are reasonable for a laptop and surprising on a server. Reading the source was faster than searching for a blog post that matched my exact version.

## Measuring the problem

The documentation described the happy path well and said nothing about what happens on timeout. Retries without jitter turned a short blip into a synchronised wave of traffic. I deleted more code than I added, and the system got faster and easier to read. The real constraint was not the CPU but the number of open file descriptors. Reading the source was faster than searching for a blog post that matched my exact version. I wrote a short runbook so the next incident starts with steps instead of guesses.

The error only appeared when two requests raced for the same row inside one transaction. The migration ran in batches so it could be paused, resumed and verified at each step. The documentation described the happy path well and said nothing about what happens on timeout.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

> I kept the old path behind a flag for a week so I could compare both under real traffic.

The slowest part of the deploy was waiting for a health check that checked nothing. Moving the work off the request path made the page fast and the queue honest. A small reproduction in an empty repository removed every distraction from the real problem. The benchmark looked impressive until I ran it on the same hardware as production. Small, frequent releases made each change easy to reason about and easy to revert.

## What actually fixed it

The benchmark looked impressive until I ran it on the same hardware as production. Measuring before and after turned a hunch into a result I could defend. A budget for each page kept the bundle from growing one harmless dependency at a time. The real constraint was not the CPU but the number of open file descriptors. Most of the latency came from a single synchronous call that nobody remembered adding.

The configuration file had grown three ways to say the same thing. A budget for each page kept the bundle from growing one harmless dependency at a time. The benchmark looked impressive until I ran it on the same hardware as production.

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

Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic. The migration ran in batches so it could be paused, resumed and verified at each step. The documentation described the happy path well and said nothing about what happens on timeout. The error only appeared when two requests raced for the same row inside one transaction.

## The first attempt

The configuration file had grown three ways to say the same thing. I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier. The benchmark looked impressive until I ran it on the same hardware as production.

I kept the old path behind a flag for a week so I could compare both under real traffic. A budget for each page kept the bundle from growing one harmless dependency at a time. Reading the source was faster than searching for a blog post that matched my exact version. Logs were useful only after every line carried a request identifier. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

The real constraint was not the CPU but the number of open file descriptors. Retries without jitter turned a short blip into a synchronised wave of traffic. The documentation described the happy path well and said nothing about what happens on timeout. I kept the old path behind a flag for a week so I could compare both under real traffic. Reading the source was faster than searching for a blog post that matched my exact version.
