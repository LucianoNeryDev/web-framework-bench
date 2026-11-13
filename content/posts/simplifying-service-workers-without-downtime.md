---
title: "Simplifying service workers without downtime"
slug: simplifying-service-workers-without-downtime
date: 2026-09-25
summary: "The documentation described the happy path well and said nothing about what happens on timeout. Measuring before and after turned a hunch into a result I could defend."
tags: [databases, tooling]
cover: /images/simplifying-service-workers-without-downtime.webp
---
The real constraint was not the CPU but the number of open file descriptors. Small, frequent releases made each change easy to reason about and easy to revert. I started with the simplest version that could possibly work and wrote down every assumption. Reading the source was faster than searching for a blog post that matched my exact version.

The documentation described the happy path well and said nothing about what happens on timeout. I wrote a short runbook so the next incident starts with steps instead of guesses. I deleted more code than I added, and the system got faster and easier to read. The migration ran in batches so it could be paused, resumed and verified at each step. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Takeaways

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Every abstraction leaked a little, and the leaks were where the bugs lived. The error only appeared when two requests raced for the same row inside one transaction. The slowest part of the deploy was waiting for a health check that checked nothing.

I started with the simplest version that could possibly work and wrote down every assumption. Measuring before and after turned a hunch into a result I could defend. A small reproduction in an empty repository removed every distraction from the real problem. The slowest part of the deploy was waiting for a health check that checked nothing.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

Most of the latency came from a single synchronous call that nobody remembered adding. The benchmark looked impressive until I ran it on the same hardware as production. The profiler pointed at serialisation, which was not where I would have guessed.

## Trade-offs

Moving the work off the request path made the page fast and the queue honest. I kept the old path behind a flag for a week so I could compare both under real traffic. Tail latency told a different story from the average, which looked perfectly healthy. The fix itself was three lines; finding where to put them took two days. I deleted more code than I added, and the system got faster and easier to read.

The real constraint was not the CPU but the number of open file descriptors. The profiler pointed at serialisation, which was not where I would have guessed. A budget for each page kept the bundle from growing one harmless dependency at a time. Retries without jitter turned a short blip into a synchronised wave of traffic. Writing the test first forced me to decide what correct behaviour actually meant.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

- Tail latency told a different story from the average, which looked perfectly healthy.
- Every abstraction leaked a little, and the leaks were where the bugs lived.
- The real constraint was not the CPU but the number of open file descriptors.
- Small, frequent releases made each change easy to reason about and easy to revert.

A small reproduction in an empty repository removed every distraction from the real problem. The benchmark looked impressive until I ran it on the same hardware as production. The profiler pointed at serialisation, which was not where I would have guessed.

## Numbers after the change

Tail latency told a different story from the average, which looked perfectly healthy. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Most of the latency came from a single synchronous call that nobody remembered adding. A budget for each page kept the bundle from growing one harmless dependency at a time. The error only appeared when two requests raced for the same row inside one transaction. Writing the test first forced me to decide what correct behaviour actually meant.

I started with the simplest version that could possibly work and wrote down every assumption. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The migration ran in batches so it could be paused, resumed and verified at each step. The slowest part of the deploy was waiting for a health check that checked nothing. Reading the source was faster than searching for a blog post that matched my exact version.

> The configuration file had grown three ways to say the same thing.

The first measurement was misleading because the cache was already warm. Retries without jitter turned a short blip into a synchronised wave of traffic. Tail latency told a different story from the average, which looked perfectly healthy.

## What actually fixed it

Most of the latency came from a single synchronous call that nobody remembered adding. The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step. The slowest part of the deploy was waiting for a health check that checked nothing. I deleted more code than I added, and the system got faster and easier to read. A small reproduction in an empty repository removed every distraction from the real problem.

The first measurement was misleading because the cache was already warm. Every abstraction leaked a little, and the leaks were where the bugs lived. Most of the latency came from a single synchronous call that nobody remembered adding.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Small, frequent releases made each change easy to reason about and easy to revert. The migration ran in batches so it could be paused, resumed and verified at each step.
