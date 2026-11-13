---
title: "Simplifying structured logging after a long weekend"
slug: simplifying-structured-logging-after-a-long-weekend
date: 2026-10-05
summary: "The profiler pointed at serialisation, which was not where I would have guessed. Measuring before and after turned a hunch into a result I could defend."
tags: [go, testing]
cover: /images/simplifying-structured-logging-after-a-long-weekend.webp
---
Most tools default to settings that are reasonable for a laptop and surprising on a server. The error only appeared when two requests raced for the same row inside one transaction. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I deleted more code than I added, and the system got faster and easier to read.

I started with the simplest version that could possibly work and wrote down every assumption. Retries without jitter turned a short blip into a synchronised wave of traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The error only appeared when two requests raced for the same row inside one transaction. I deleted more code than I added, and the system got faster and easier to read.

## What I would do differently

I started with the simplest version that could possibly work and wrote down every assumption. Small, frequent releases made each change easy to reason about and easy to revert. The error only appeared when two requests raced for the same row inside one transaction. I deleted more code than I added, and the system got faster and easier to read.

Clear error messages saved more time than any clever optimisation. A small reproduction in an empty repository removed every distraction from the real problem. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The configuration file had grown three ways to say the same thing.

Reading the source was faster than searching for a blog post that matched my exact version. The first measurement was misleading because the cache was already warm. The migration ran in batches so it could be paused, resumed and verified at each step. The real constraint was not the CPU but the number of open file descriptors. The benchmark looked impressive until I ran it on the same hardware as production.

## Measuring the problem

I started with the simplest version that could possibly work and wrote down every assumption. A small reproduction in an empty repository removed every distraction from the real problem. I deleted more code than I added, and the system got faster and easier to read. The migration ran in batches so it could be paused, resumed and verified at each step.

Retries without jitter turned a short blip into a synchronised wave of traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Small, frequent releases made each change easy to reason about and easy to revert. Every abstraction leaked a little, and the leaks were where the bugs lived. I kept the old path behind a flag for a week so I could compare both under real traffic.

- Most tools default to settings that are reasonable for a laptop and surprising on a server.
- The fix itself was three lines; finding where to put them took two days.
- I deleted more code than I added, and the system got faster and easier to read.
- A budget for each page kept the bundle from growing one harmless dependency at a time.

The slowest part of the deploy was waiting for a health check that checked nothing. The error only appeared when two requests raced for the same row inside one transaction. I wrote a short runbook so the next incident starts with steps instead of guesses. The real constraint was not the CPU but the number of open file descriptors.

## Numbers after the change

A small reproduction in an empty repository removed every distraction from the real problem. The migration ran in batches so it could be paused, resumed and verified at each step. The slowest part of the deploy was waiting for a health check that checked nothing. I kept the old path behind a flag for a week so I could compare both under real traffic. Small, frequent releases made each change easy to reason about and easy to revert. A budget for each page kept the bundle from growing one harmless dependency at a time.

The benchmark looked impressive until I ran it on the same hardware as production. Most tools default to settings that are reasonable for a laptop and surprising on a server. Measuring before and after turned a hunch into a result I could defend.

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

I wrote a short runbook so the next incident starts with steps instead of guesses. Most of the latency came from a single synchronous call that nobody remembered adding. Reading the source was faster than searching for a blog post that matched my exact version. The benchmark looked impressive until I ran it on the same hardware as production.

## Takeaways

Moving the work off the request path made the page fast and the queue honest. Small, frequent releases made each change easy to reason about and easy to revert. The error only appeared when two requests raced for the same row inside one transaction. I deleted more code than I added, and the system got faster and easier to read. The fix itself was three lines; finding where to put them took two days.

Reading the source was faster than searching for a blog post that matched my exact version. The configuration file had grown three ways to say the same thing. Measuring before and after turned a hunch into a result I could defend.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

A small reproduction in an empty repository removed every distraction from the real problem. Measuring before and after turned a hunch into a result I could defend. The profiler pointed at serialisation, which was not where I would have guessed.

## The first attempt

I started with the simplest version that could possibly work and wrote down every assumption. I wrote a short runbook so the next incident starts with steps instead of guesses. Tail latency told a different story from the average, which looked perfectly healthy. Every abstraction leaked a little, and the leaks were where the bugs lived. The slowest part of the deploy was waiting for a health check that checked nothing. Most of the latency came from a single synchronous call that nobody remembered adding.

The migration ran in batches so it could be paused, resumed and verified at each step. A budget for each page kept the bundle from growing one harmless dependency at a time. The benchmark looked impressive until I ran it on the same hardware as production. The slowest part of the deploy was waiting for a health check that checked nothing. Moving the work off the request path made the page fast and the queue honest.

Small, frequent releases made each change easy to reason about and easy to revert. Logs were useful only after every line carried a request identifier. I kept the old path behind a flag for a week so I could compare both under real traffic.
