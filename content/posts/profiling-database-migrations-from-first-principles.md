---
title: "Profiling database migrations from first principles"
slug: profiling-database-migrations-from-first-principles
date: 2026-05-12
summary: "The documentation described the happy path well and said nothing about what happens on timeout. Retries without jitter turned a short blip into a synchronised wave of traffic."
tags: [databases, security]
cover: /images/profiling-database-migrations-from-first-principles.webp
---
Tail latency told a different story from the average, which looked perfectly healthy. The benchmark looked impressive until I ran it on the same hardware as production. Every abstraction leaked a little, and the leaks were where the bugs lived. Most tools default to settings that are reasonable for a laptop and surprising on a server.

I started with the simplest version that could possibly work and wrote down every assumption. The documentation described the happy path well and said nothing about what happens on timeout. The migration ran in batches so it could be paused, resumed and verified at each step. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. A budget for each page kept the bundle from growing one harmless dependency at a time.

## What actually fixed it

Retries without jitter turned a short blip into a synchronised wave of traffic. I deleted more code than I added, and the system got faster and easier to read. The slowest part of the deploy was waiting for a health check that checked nothing. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Measuring before and after turned a hunch into a result I could defend. The fix itself was three lines; finding where to put them took two days. The error only appeared when two requests raced for the same row inside one transaction.

I wrote a short runbook so the next incident starts with steps instead of guesses. Every abstraction leaked a little, and the leaks were where the bugs lived. Logs were useful only after every line carried a request identifier. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Where it started

A budget for each page kept the bundle from growing one harmless dependency at a time. The first measurement was misleading because the cache was already warm. The fix itself was three lines; finding where to put them took two days. The configuration file had grown three ways to say the same thing. The error only appeared when two requests raced for the same row inside one transaction.

The benchmark looked impressive until I ran it on the same hardware as production. The first measurement was misleading because the cache was already warm. The documentation described the happy path well and said nothing about what happens on timeout. Measuring before and after turned a hunch into a result I could defend.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

- The configuration file had grown three ways to say the same thing.
- Logs were useful only after every line carried a request identifier.
- The slowest part of the deploy was waiting for a health check that checked nothing.
- Every abstraction leaked a little, and the leaks were where the bugs lived.

The benchmark looked impressive until I ran it on the same hardware as production. I kept the old path behind a flag for a week so I could compare both under real traffic. Moving the work off the request path made the page fast and the queue honest. Small, frequent releases made each change easy to reason about and easy to revert. Reading the source was faster than searching for a blog post that matched my exact version.

## What I would do differently

A small reproduction in an empty repository removed every distraction from the real problem. Small, frequent releases made each change easy to reason about and easy to revert. I deleted more code than I added, and the system got faster and easier to read. The fix itself was three lines; finding where to put them took two days.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Every abstraction leaked a little, and the leaks were where the bugs lived. A budget for each page kept the bundle from growing one harmless dependency at a time. I deleted more code than I added, and the system got faster and easier to read. The first measurement was misleading because the cache was already warm.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

> I started with the simplest version that could possibly work and wrote down every assumption.

I kept the old path behind a flag for a week so I could compare both under real traffic. The fix itself was three lines; finding where to put them took two days. A small reproduction in an empty repository removed every distraction from the real problem. A budget for each page kept the bundle from growing one harmless dependency at a time.

## Trade-offs

Clear error messages saved more time than any clever optimisation. I kept the old path behind a flag for a week so I could compare both under real traffic. The first measurement was misleading because the cache was already warm. Writing the test first forced me to decide what correct behaviour actually meant. The migration ran in batches so it could be paused, resumed and verified at each step. Moving the work off the request path made the page fast and the queue honest.

Most tools default to settings that are reasonable for a laptop and surprising on a server. The real constraint was not the CPU but the number of open file descriptors. The configuration file had grown three ways to say the same thing. Writing the test first forced me to decide what correct behaviour actually meant.

Measuring before and after turned a hunch into a result I could defend. The benchmark looked impressive until I ran it on the same hardware as production. The slowest part of the deploy was waiting for a health check that checked nothing. Logs were useful only after every line carried a request identifier.

## Numbers after the change

The fix itself was three lines; finding where to put them took two days. Measuring before and after turned a hunch into a result I could defend. Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm. I started with the simplest version that could possibly work and wrote down every assumption. Small, frequent releases made each change easy to reason about and easy to revert.

I kept the old path behind a flag for a week so I could compare both under real traffic. Retries without jitter turned a short blip into a synchronised wave of traffic. The slowest part of the deploy was waiting for a health check that checked nothing.

Writing the test first forced me to decide what correct behaviour actually meant. Retries without jitter turned a short blip into a synchronised wave of traffic. Clear error messages saved more time than any clever optimisation. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Small, frequent releases made each change easy to reason about and easy to revert.
