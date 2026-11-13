---
title: "Simplifying error budgets on a small budget"
slug: simplifying-error-budgets-on-a-small-budget
date: 2026-10-26
summary: "Most of the latency came from a single synchronous call that nobody remembered adding. The migration ran in batches so it could be paused, resumed and verified at each step."
tags: [css, performance, security]
cover: /images/simplifying-error-budgets-on-a-small-budget.webp
---
A budget for each page kept the bundle from growing one harmless dependency at a time. Small, frequent releases made each change easy to reason about and easy to revert. I started with the simplest version that could possibly work and wrote down every assumption. Logs were useful only after every line carried a request identifier.

Tail latency told a different story from the average, which looked perfectly healthy. The first measurement was misleading because the cache was already warm. Every abstraction leaked a little, and the leaks were where the bugs lived. The slowest part of the deploy was waiting for a health check that checked nothing. I kept the old path behind a flag for a week so I could compare both under real traffic.

## What I would do differently

I deleted more code than I added, and the system got faster and easier to read. The documentation described the happy path well and said nothing about what happens on timeout. The migration ran in batches so it could be paused, resumed and verified at each step. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Writing the test first forced me to decide what correct behaviour actually meant. The documentation described the happy path well and said nothing about what happens on timeout.

Moving the work off the request path made the page fast and the queue honest. Small, frequent releases made each change easy to reason about and easy to revert. I kept the old path behind a flag for a week so I could compare both under real traffic.

## Trade-offs

The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived. I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier.

Moving the work off the request path made the page fast and the queue honest. I deleted more code than I added, and the system got faster and easier to read. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

- A budget for each page kept the bundle from growing one harmless dependency at a time.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- The error only appeared when two requests raced for the same row inside one transaction.
- Most of the latency came from a single synchronous call that nobody remembered adding.

The real constraint was not the CPU but the number of open file descriptors. The documentation described the happy path well and said nothing about what happens on timeout. The first measurement was misleading because the cache was already warm. Small, frequent releases made each change easy to reason about and easy to revert.

## Numbers after the change

The configuration file had grown three ways to say the same thing. Most of the latency came from a single synchronous call that nobody remembered adding. The slowest part of the deploy was waiting for a health check that checked nothing. I kept the old path behind a flag for a week so I could compare both under real traffic. Clear error messages saved more time than any clever optimisation.

A budget for each page kept the bundle from growing one harmless dependency at a time. The benchmark looked impressive until I ran it on the same hardware as production. The migration ran in batches so it could be paused, resumed and verified at each step. Writing the test first forced me to decide what correct behaviour actually meant.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

> Tail latency told a different story from the average, which looked perfectly healthy.

Logs were useful only after every line carried a request identifier. Small, frequent releases made each change easy to reason about and easy to revert. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## The first attempt

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Moving the work off the request path made the page fast and the queue honest. A budget for each page kept the bundle from growing one harmless dependency at a time. Most tools default to settings that are reasonable for a laptop and surprising on a server. I started with the simplest version that could possibly work and wrote down every assumption. I wrote a short runbook so the next incident starts with steps instead of guesses.

The error only appeared when two requests raced for the same row inside one transaction. Retries without jitter turned a short blip into a synchronised wave of traffic. The slowest part of the deploy was waiting for a health check that checked nothing. Reading the source was faster than searching for a blog post that matched my exact version. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

The fix itself was three lines; finding where to put them took two days. A budget for each page kept the bundle from growing one harmless dependency at a time. Most of the latency came from a single synchronous call that nobody remembered adding. The benchmark looked impressive until I ran it on the same hardware as production. Small, frequent releases made each change easy to reason about and easy to revert.

## Where it started

I deleted more code than I added, and the system got faster and easier to read. Writing the test first forced me to decide what correct behaviour actually meant. The fix itself was three lines; finding where to put them took two days. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Moving the work off the request path made the page fast and the queue honest.

Every abstraction leaked a little, and the leaks were where the bugs lived. The profiler pointed at serialisation, which was not where I would have guessed. Moving the work off the request path made the page fast and the queue honest.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

I started with the simplest version that could possibly work and wrote down every assumption. Retries without jitter turned a short blip into a synchronised wave of traffic. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Moving the work off the request path made the page fast and the queue honest.
