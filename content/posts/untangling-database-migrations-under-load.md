---
title: "Untangling database migrations under load"
slug: untangling-database-migrations-under-load
date: 2026-08-10
summary: "Reading the source was faster than searching for a blog post that matched my exact version. Retries without jitter turned a short blip into a synchronised wave of traffic."
tags: [go]
cover: /images/untangling-database-migrations-under-load.webp
---
The configuration file had grown three ways to say the same thing. The benchmark looked impressive until I ran it on the same hardware as production. Logs were useful only after every line carried a request identifier. Writing the test first forced me to decide what correct behaviour actually meant.

I started with the simplest version that could possibly work and wrote down every assumption. Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

## Measuring the problem

The first measurement was misleading because the cache was already warm. Most of the latency came from a single synchronous call that nobody remembered adding. Small, frequent releases made each change easy to reason about and easy to revert. A small reproduction in an empty repository removed every distraction from the real problem. Moving the work off the request path made the page fast and the queue honest. Clear error messages saved more time than any clever optimisation.

The fix itself was three lines; finding where to put them took two days. Moving the work off the request path made the page fast and the queue honest. The configuration file had grown three ways to say the same thing. The benchmark looked impressive until I ran it on the same hardware as production.

Logs were useful only after every line carried a request identifier. Small, frequent releases made each change easy to reason about and easy to revert. The fix itself was three lines; finding where to put them took two days.

## The first attempt

Retries without jitter turned a short blip into a synchronised wave of traffic. Writing the test first forced me to decide what correct behaviour actually meant. Small, frequent releases made each change easy to reason about and easy to revert. Tail latency told a different story from the average, which looked perfectly healthy. The fix itself was three lines; finding where to put them took two days. The migration ran in batches so it could be paused, resumed and verified at each step.

The real constraint was not the CPU but the number of open file descriptors. Reading the source was faster than searching for a blog post that matched my exact version. The profiler pointed at serialisation, which was not where I would have guessed. Every abstraction leaked a little, and the leaks were where the bugs lived.

- Writing the test first forced me to decide what correct behaviour actually meant.
- The benchmark looked impressive until I ran it on the same hardware as production.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- I wrote a short runbook so the next incident starts with steps instead of guesses.

The first measurement was misleading because the cache was already warm. The migration ran in batches so it could be paused, resumed and verified at each step. Retries without jitter turned a short blip into a synchronised wave of traffic. I deleted more code than I added, and the system got faster and easier to read. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## Takeaways

Logs were useful only after every line carried a request identifier. Every abstraction leaked a little, and the leaks were where the bugs lived. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. The fix itself was three lines; finding where to put them took two days.

Measuring before and after turned a hunch into a result I could defend. The benchmark looked impressive until I ran it on the same hardware as production. Most tools default to settings that are reasonable for a laptop and surprising on a server. The profiler pointed at serialisation, which was not where I would have guessed.

> The profiler pointed at serialisation, which was not where I would have guessed.

Logs were useful only after every line carried a request identifier. Most of the latency came from a single synchronous call that nobody remembered adding. Tail latency told a different story from the average, which looked perfectly healthy. Measuring before and after turned a hunch into a result I could defend. The fix itself was three lines; finding where to put them took two days.

## Numbers after the change

A small reproduction in an empty repository removed every distraction from the real problem. The profiler pointed at serialisation, which was not where I would have guessed. The fix itself was three lines; finding where to put them took two days. The error only appeared when two requests raced for the same row inside one transaction.

The configuration file had grown three ways to say the same thing. The benchmark looked impressive until I ran it on the same hardware as production. Moving the work off the request path made the page fast and the queue honest. Most tools default to settings that are reasonable for a laptop and surprising on a server. I started with the simplest version that could possibly work and wrote down every assumption.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

I deleted more code than I added, and the system got faster and easier to read. Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days. Tail latency told a different story from the average, which looked perfectly healthy. The benchmark looked impressive until I ran it on the same hardware as production.

## Trade-offs

Writing the test first forced me to decide what correct behaviour actually meant. Reading the source was faster than searching for a blog post that matched my exact version. The benchmark looked impressive until I ran it on the same hardware as production. Tail latency told a different story from the average, which looked perfectly healthy. The real constraint was not the CPU but the number of open file descriptors. The profiler pointed at serialisation, which was not where I would have guessed.

The first measurement was misleading because the cache was already warm. A small reproduction in an empty repository removed every distraction from the real problem. The profiler pointed at serialisation, which was not where I would have guessed. The configuration file had grown three ways to say the same thing. Most of the latency came from a single synchronous call that nobody remembered adding.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

Reading the source was faster than searching for a blog post that matched my exact version. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The documentation described the happy path well and said nothing about what happens on timeout. The benchmark looked impressive until I ran it on the same hardware as production.
