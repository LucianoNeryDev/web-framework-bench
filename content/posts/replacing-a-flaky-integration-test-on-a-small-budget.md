---
title: "Replacing a flaky integration test on a small budget"
slug: replacing-a-flaky-integration-test-on-a-small-budget
date: 2026-07-21
summary: "The first measurement was misleading because the cache was already warm. Logs were useful only after every line carried a request identifier."
tags: [databases, devops, security]
cover: /images/replacing-a-flaky-integration-test-on-a-small-budget.webp
---
The real constraint was not the CPU but the number of open file descriptors. I started with the simplest version that could possibly work and wrote down every assumption. Most tools default to settings that are reasonable for a laptop and surprising on a server. Tail latency told a different story from the average, which looked perfectly healthy.

A budget for each page kept the bundle from growing one harmless dependency at a time. Measuring before and after turned a hunch into a result I could defend. Small, frequent releases made each change easy to reason about and easy to revert. The migration ran in batches so it could be paused, resumed and verified at each step. The error only appeared when two requests raced for the same row inside one transaction.

## Numbers after the change

Small, frequent releases made each change easy to reason about and easy to revert. A budget for each page kept the bundle from growing one harmless dependency at a time. The benchmark looked impressive until I ran it on the same hardware as production. Most of the latency came from a single synchronous call that nobody remembered adding. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

Reading the source was faster than searching for a blog post that matched my exact version. The documentation described the happy path well and said nothing about what happens on timeout. The slowest part of the deploy was waiting for a health check that checked nothing. Writing the test first forced me to decide what correct behaviour actually meant. Clear error messages saved more time than any clever optimisation.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

The real constraint was not the CPU but the number of open file descriptors. Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic. The documentation described the happy path well and said nothing about what happens on timeout. The configuration file had grown three ways to say the same thing.

## Measuring the problem

A small reproduction in an empty repository removed every distraction from the real problem. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The migration ran in batches so it could be paused, resumed and verified at each step. The benchmark looked impressive until I ran it on the same hardware as production. Measuring before and after turned a hunch into a result I could defend. I started with the simplest version that could possibly work and wrote down every assumption.

The documentation described the happy path well and said nothing about what happens on timeout. Small, frequent releases made each change easy to reason about and easy to revert. The migration ran in batches so it could be paused, resumed and verified at each step. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

- The configuration file had grown three ways to say the same thing.
- Every abstraction leaked a little, and the leaks were where the bugs lived.
- Reading the source was faster than searching for a blog post that matched my exact version.
- Most tools default to settings that are reasonable for a laptop and surprising on a server.

Small, frequent releases made each change easy to reason about and easy to revert. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Every abstraction leaked a little, and the leaks were where the bugs lived. The migration ran in batches so it could be paused, resumed and verified at each step.

## Takeaways

I deleted more code than I added, and the system got faster and easier to read. Reading the source was faster than searching for a blog post that matched my exact version. The first measurement was misleading because the cache was already warm. The real constraint was not the CPU but the number of open file descriptors. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

I deleted more code than I added, and the system got faster and easier to read. A budget for each page kept the bundle from growing one harmless dependency at a time. I kept the old path behind a flag for a week so I could compare both under real traffic. Reading the source was faster than searching for a blog post that matched my exact version. Every abstraction leaked a little, and the leaks were where the bugs lived.

> Pinning the versions made the build reproducible and the upgrade a deliberate decision.

A small reproduction in an empty repository removed every distraction from the real problem. I wrote a short runbook so the next incident starts with steps instead of guesses. Every abstraction leaked a little, and the leaks were where the bugs lived. Clear error messages saved more time than any clever optimisation.

## The first attempt

The benchmark looked impressive until I ran it on the same hardware as production. Reading the source was faster than searching for a blog post that matched my exact version. The profiler pointed at serialisation, which was not where I would have guessed. I kept the old path behind a flag for a week so I could compare both under real traffic.

A small reproduction in an empty repository removed every distraction from the real problem. Writing the test first forced me to decide what correct behaviour actually meant. Most of the latency came from a single synchronous call that nobody remembered adding. The error only appeared when two requests raced for the same row inside one transaction. The fix itself was three lines; finding where to put them took two days.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Every abstraction leaked a little, and the leaks were where the bugs lived. Most tools default to settings that are reasonable for a laptop and surprising on a server. I deleted more code than I added, and the system got faster and easier to read. The fix itself was three lines; finding where to put them took two days.
