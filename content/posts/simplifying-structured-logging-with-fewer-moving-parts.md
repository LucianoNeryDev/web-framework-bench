---
title: "Simplifying structured logging with fewer moving parts"
slug: simplifying-structured-logging-with-fewer-moving-parts
date: 2026-08-18
summary: "The slowest part of the deploy was waiting for a health check that checked nothing. A budget for each page kept the bundle from growing one harmless dependency at a time."
tags: [rust, testing]
cover: /images/simplifying-structured-logging-with-fewer-moving-parts.webp
---
Every abstraction leaked a little, and the leaks were where the bugs lived. The benchmark looked impressive until I ran it on the same hardware as production. Small, frequent releases made each change easy to reason about and easy to revert. Most of the latency came from a single synchronous call that nobody remembered adding.

Measuring before and after turned a hunch into a result I could defend. Most of the latency came from a single synchronous call that nobody remembered adding. The migration ran in batches so it could be paused, resumed and verified at each step. The slowest part of the deploy was waiting for a health check that checked nothing. A small reproduction in an empty repository removed every distraction from the real problem.

## Where it started

Tail latency told a different story from the average, which looked perfectly healthy. Moving the work off the request path made the page fast and the queue honest. Most tools default to settings that are reasonable for a laptop and surprising on a server. The configuration file had grown three ways to say the same thing. The migration ran in batches so it could be paused, resumed and verified at each step.

Most tools default to settings that are reasonable for a laptop and surprising on a server. A small reproduction in an empty repository removed every distraction from the real problem. The profiler pointed at serialisation, which was not where I would have guessed. Moving the work off the request path made the page fast and the queue honest.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

The error only appeared when two requests raced for the same row inside one transaction. Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time. The slowest part of the deploy was waiting for a health check that checked nothing.

## Numbers after the change

Measuring before and after turned a hunch into a result I could defend. The fix itself was three lines; finding where to put them took two days. Retries without jitter turned a short blip into a synchronised wave of traffic. I kept the old path behind a flag for a week so I could compare both under real traffic. Clear error messages saved more time than any clever optimisation.

Writing the test first forced me to decide what correct behaviour actually meant. Logs were useful only after every line carried a request identifier. I kept the old path behind a flag for a week so I could compare both under real traffic.

- The migration ran in batches so it could be paused, resumed and verified at each step.
- Every abstraction leaked a little, and the leaks were where the bugs lived.
- The documentation described the happy path well and said nothing about what happens on timeout.
- The fix itself was three lines; finding where to put them took two days.

The real constraint was not the CPU but the number of open file descriptors. The fix itself was three lines; finding where to put them took two days. The configuration file had grown three ways to say the same thing.

## What actually fixed it

Retries without jitter turned a short blip into a synchronised wave of traffic. Small, frequent releases made each change easy to reason about and easy to revert. Tail latency told a different story from the average, which looked perfectly healthy. The benchmark looked impressive until I ran it on the same hardware as production.

Reading the source was faster than searching for a blog post that matched my exact version. The benchmark looked impressive until I ran it on the same hardware as production. Small, frequent releases made each change easy to reason about and easy to revert.

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

> I started with the simplest version that could possibly work and wrote down every assumption.

The real constraint was not the CPU but the number of open file descriptors. The slowest part of the deploy was waiting for a health check that checked nothing. The documentation described the happy path well and said nothing about what happens on timeout. The first measurement was misleading because the cache was already warm.

## Trade-offs

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Retries without jitter turned a short blip into a synchronised wave of traffic. Reading the source was faster than searching for a blog post that matched my exact version. Every abstraction leaked a little, and the leaks were where the bugs lived. I wrote a short runbook so the next incident starts with steps instead of guesses.

Most tools default to settings that are reasonable for a laptop and surprising on a server. Clear error messages saved more time than any clever optimisation. The error only appeared when two requests raced for the same row inside one transaction.

The first measurement was misleading because the cache was already warm. Most of the latency came from a single synchronous call that nobody remembered adding. Clear error messages saved more time than any clever optimisation.

## What I would do differently

Retries without jitter turned a short blip into a synchronised wave of traffic. The migration ran in batches so it could be paused, resumed and verified at each step. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I started with the simplest version that could possibly work and wrote down every assumption. The benchmark looked impressive until I ran it on the same hardware as production. Every abstraction leaked a little, and the leaks were where the bugs lived.

Measuring before and after turned a hunch into a result I could defend. A budget for each page kept the bundle from growing one harmless dependency at a time. The slowest part of the deploy was waiting for a health check that checked nothing. Most of the latency came from a single synchronous call that nobody remembered adding. Writing the test first forced me to decide what correct behaviour actually meant.

I started with the simplest version that could possibly work and wrote down every assumption. Logs were useful only after every line carried a request identifier. Small, frequent releases made each change easy to reason about and easy to revert. I wrote a short runbook so the next incident starts with steps instead of guesses. Moving the work off the request path made the page fast and the queue honest.
