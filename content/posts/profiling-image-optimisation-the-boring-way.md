---
title: "Profiling image optimisation the boring way"
slug: profiling-image-optimisation-the-boring-way
date: 2026-04-01
summary: "The profiler pointed at serialisation, which was not where I would have guessed. Logs were useful only after every line carried a request identifier."
tags: [rust, css, security]
cover: /images/profiling-image-optimisation-the-boring-way.webp
---
Small, frequent releases made each change easy to reason about and easy to revert. The configuration file had grown three ways to say the same thing. A budget for each page kept the bundle from growing one harmless dependency at a time. The first measurement was misleading because the cache was already warm.

I deleted more code than I added, and the system got faster and easier to read. I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier. I wrote a short runbook so the next incident starts with steps instead of guesses. A small reproduction in an empty repository removed every distraction from the real problem.

## Numbers after the change

Every abstraction leaked a little, and the leaks were where the bugs lived. I wrote a short runbook so the next incident starts with steps instead of guesses. The documentation described the happy path well and said nothing about what happens on timeout. Clear error messages saved more time than any clever optimisation. Measuring before and after turned a hunch into a result I could defend. Logs were useful only after every line carried a request identifier.

A small reproduction in an empty repository removed every distraction from the real problem. The benchmark looked impressive until I ran it on the same hardware as production. The migration ran in batches so it could be paused, resumed and verified at each step. Most tools default to settings that are reasonable for a laptop and surprising on a server. Most of the latency came from a single synchronous call that nobody remembered adding.

The first measurement was misleading because the cache was already warm. Most tools default to settings that are reasonable for a laptop and surprising on a server. The configuration file had grown three ways to say the same thing.

## What actually fixed it

Most of the latency came from a single synchronous call that nobody remembered adding. The documentation described the happy path well and said nothing about what happens on timeout. Most tools default to settings that are reasonable for a laptop and surprising on a server. I kept the old path behind a flag for a week so I could compare both under real traffic.

I started with the simplest version that could possibly work and wrote down every assumption. The error only appeared when two requests raced for the same row inside one transaction. Most tools default to settings that are reasonable for a laptop and surprising on a server. A budget for each page kept the bundle from growing one harmless dependency at a time.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

- The real constraint was not the CPU but the number of open file descriptors.
- The error only appeared when two requests raced for the same row inside one transaction.
- I started with the simplest version that could possibly work and wrote down every assumption.
- Most tools default to settings that are reasonable for a laptop and surprising on a server.

The migration ran in batches so it could be paused, resumed and verified at each step. I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier. The documentation described the happy path well and said nothing about what happens on timeout.

## Trade-offs

Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time. The fix itself was three lines; finding where to put them took two days. The configuration file had grown three ways to say the same thing. Logs were useful only after every line carried a request identifier.

The first measurement was misleading because the cache was already warm. The real constraint was not the CPU but the number of open file descriptors. Most of the latency came from a single synchronous call that nobody remembered adding.

> Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

Most of the latency came from a single synchronous call that nobody remembered adding. Logs were useful only after every line carried a request identifier. I wrote a short runbook so the next incident starts with steps instead of guesses. The profiler pointed at serialisation, which was not where I would have guessed.

## What I would do differently

A small reproduction in an empty repository removed every distraction from the real problem. A budget for each page kept the bundle from growing one harmless dependency at a time. The first measurement was misleading because the cache was already warm. The fix itself was three lines; finding where to put them took two days. Retries without jitter turned a short blip into a synchronised wave of traffic. Logs were useful only after every line carried a request identifier.

Most tools default to settings that are reasonable for a laptop and surprising on a server. The real constraint was not the CPU but the number of open file descriptors. The benchmark looked impressive until I ran it on the same hardware as production. The error only appeared when two requests raced for the same row inside one transaction.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

The real constraint was not the CPU but the number of open file descriptors. Writing the test first forced me to decide what correct behaviour actually meant. The error only appeared when two requests raced for the same row inside one transaction. I deleted more code than I added, and the system got faster and easier to read. A budget for each page kept the bundle from growing one harmless dependency at a time.

## Measuring the problem

I wrote a short runbook so the next incident starts with steps instead of guesses. Reading the source was faster than searching for a blog post that matched my exact version. The slowest part of the deploy was waiting for a health check that checked nothing. Most of the latency came from a single synchronous call that nobody remembered adding. A budget for each page kept the bundle from growing one harmless dependency at a time.

Every abstraction leaked a little, and the leaks were where the bugs lived. The first measurement was misleading because the cache was already warm. The benchmark looked impressive until I ran it on the same hardware as production. Logs were useful only after every line carried a request identifier.

Reading the source was faster than searching for a blog post that matched my exact version. Most tools default to settings that are reasonable for a laptop and surprising on a server. The error only appeared when two requests raced for the same row inside one transaction. The real constraint was not the CPU but the number of open file descriptors. Tail latency told a different story from the average, which looked perfectly healthy.
