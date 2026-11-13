---
title: "Debugging dependency updates after a long weekend"
slug: debugging-dependency-updates-after-a-long-weekend
date: 2026-10-14
summary: "Logs were useful only after every line carried a request identifier. Measuring before and after turned a hunch into a result I could defend."
tags: [go, javascript, databases]
cover: /images/debugging-dependency-updates-after-a-long-weekend.webp
---
Measuring before and after turned a hunch into a result I could defend. A budget for each page kept the bundle from growing one harmless dependency at a time. I kept the old path behind a flag for a week so I could compare both under real traffic. Every abstraction leaked a little, and the leaks were where the bugs lived.

The slowest part of the deploy was waiting for a health check that checked nothing. The fix itself was three lines; finding where to put them took two days. A budget for each page kept the bundle from growing one harmless dependency at a time. Most of the latency came from a single synchronous call that nobody remembered adding. The first measurement was misleading because the cache was already warm.

## What I would do differently

I wrote a short runbook so the next incident starts with steps instead of guesses. Every abstraction leaked a little, and the leaks were where the bugs lived. Most of the latency came from a single synchronous call that nobody remembered adding. The error only appeared when two requests raced for the same row inside one transaction.

The configuration file had grown three ways to say the same thing. Clear error messages saved more time than any clever optimisation. The error only appeared when two requests raced for the same row inside one transaction. Logs were useful only after every line carried a request identifier.

Measuring before and after turned a hunch into a result I could defend. The migration ran in batches so it could be paused, resumed and verified at each step. Clear error messages saved more time than any clever optimisation.

## What actually fixed it

The slowest part of the deploy was waiting for a health check that checked nothing. Measuring before and after turned a hunch into a result I could defend. The fix itself was three lines; finding where to put them took two days. The documentation described the happy path well and said nothing about what happens on timeout. The configuration file had grown three ways to say the same thing. Tail latency told a different story from the average, which looked perfectly healthy.

The migration ran in batches so it could be paused, resumed and verified at each step. The documentation described the happy path well and said nothing about what happens on timeout. I deleted more code than I added, and the system got faster and easier to read. The configuration file had grown three ways to say the same thing. Reading the source was faster than searching for a blog post that matched my exact version.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

- Small, frequent releases made each change easy to reason about and easy to revert.
- The slowest part of the deploy was waiting for a health check that checked nothing.
- I wrote a short runbook so the next incident starts with steps instead of guesses.
- Clear error messages saved more time than any clever optimisation.

I wrote a short runbook so the next incident starts with steps instead of guesses. Writing the test first forced me to decide what correct behaviour actually meant. A budget for each page kept the bundle from growing one harmless dependency at a time.

## The first attempt

Retries without jitter turned a short blip into a synchronised wave of traffic. Every abstraction leaked a little, and the leaks were where the bugs lived. Logs were useful only after every line carried a request identifier. The slowest part of the deploy was waiting for a health check that checked nothing. Tail latency told a different story from the average, which looked perfectly healthy. The documentation described the happy path well and said nothing about what happens on timeout.

Measuring before and after turned a hunch into a result I could defend. Tail latency told a different story from the average, which looked perfectly healthy. Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation.

> Pinning the versions made the build reproducible and the upgrade a deliberate decision.

The error only appeared when two requests raced for the same row inside one transaction. I deleted more code than I added, and the system got faster and easier to read. Reading the source was faster than searching for a blog post that matched my exact version.

## Measuring the problem

Moving the work off the request path made the page fast and the queue honest. The profiler pointed at serialisation, which was not where I would have guessed. Most of the latency came from a single synchronous call that nobody remembered adding. The real constraint was not the CPU but the number of open file descriptors. The documentation described the happy path well and said nothing about what happens on timeout.

A budget for each page kept the bundle from growing one harmless dependency at a time. The benchmark looked impressive until I ran it on the same hardware as production. Measuring before and after turned a hunch into a result I could defend.

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

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Measuring before and after turned a hunch into a result I could defend. The benchmark looked impressive until I ran it on the same hardware as production.
