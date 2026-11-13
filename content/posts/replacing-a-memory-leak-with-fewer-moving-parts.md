---
title: "Replacing a memory leak with fewer moving parts"
slug: replacing-a-memory-leak-with-fewer-moving-parts
date: 2026-04-08
summary: "The fix itself was three lines; finding where to put them took two days. The first measurement was misleading because the cache was already warm."
tags: [javascript, security, tooling]
cover: /images/replacing-a-memory-leak-with-fewer-moving-parts.webp
---
Moving the work off the request path made the page fast and the queue honest. Measuring before and after turned a hunch into a result I could defend. A small reproduction in an empty repository removed every distraction from the real problem. Logs were useful only after every line carried a request identifier.

Logs were useful only after every line carried a request identifier. I wrote a short runbook so the next incident starts with steps instead of guesses. Reading the source was faster than searching for a blog post that matched my exact version. A budget for each page kept the bundle from growing one harmless dependency at a time. Moving the work off the request path made the page fast and the queue honest.

## What I would do differently

Most of the latency came from a single synchronous call that nobody remembered adding. The error only appeared when two requests raced for the same row inside one transaction. Writing the test first forced me to decide what correct behaviour actually meant. The documentation described the happy path well and said nothing about what happens on timeout. Measuring before and after turned a hunch into a result I could defend.

A budget for each page kept the bundle from growing one harmless dependency at a time. Retries without jitter turned a short blip into a synchronised wave of traffic. The fix itself was three lines; finding where to put them took two days. The profiler pointed at serialisation, which was not where I would have guessed. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

```js
export async function retry(fn, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const delay = 2 ** i * 100 + Math.random() * 100;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('retry budget exhausted');
}
```

The profiler pointed at serialisation, which was not where I would have guessed. Tail latency told a different story from the average, which looked perfectly healthy. Moving the work off the request path made the page fast and the queue honest.

## What actually fixed it

Most of the latency came from a single synchronous call that nobody remembered adding. Tail latency told a different story from the average, which looked perfectly healthy. I wrote a short runbook so the next incident starts with steps instead of guesses. The documentation described the happy path well and said nothing about what happens on timeout. A budget for each page kept the bundle from growing one harmless dependency at a time.

The first measurement was misleading because the cache was already warm. Reading the source was faster than searching for a blog post that matched my exact version. Most tools default to settings that are reasonable for a laptop and surprising on a server. The error only appeared when two requests raced for the same row inside one transaction.

- Small, frequent releases made each change easy to reason about and easy to revert.
- The real constraint was not the CPU but the number of open file descriptors.
- Reading the source was faster than searching for a blog post that matched my exact version.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.

The first measurement was misleading because the cache was already warm. The fix itself was three lines; finding where to put them took two days. The slowest part of the deploy was waiting for a health check that checked nothing.

## Measuring the problem

Small, frequent releases made each change easy to reason about and easy to revert. I started with the simplest version that could possibly work and wrote down every assumption. Clear error messages saved more time than any clever optimisation. Retries without jitter turned a short blip into a synchronised wave of traffic.

Clear error messages saved more time than any clever optimisation. The profiler pointed at serialisation, which was not where I would have guessed. I deleted more code than I added, and the system got faster and easier to read.

> The real constraint was not the CPU but the number of open file descriptors.

Moving the work off the request path made the page fast and the queue honest. Small, frequent releases made each change easy to reason about and easy to revert. I deleted more code than I added, and the system got faster and easier to read. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The benchmark looked impressive until I ran it on the same hardware as production.

## Numbers after the change

I deleted more code than I added, and the system got faster and easier to read. Reading the source was faster than searching for a blog post that matched my exact version. Most of the latency came from a single synchronous call that nobody remembered adding. I kept the old path behind a flag for a week so I could compare both under real traffic. The profiler pointed at serialisation, which was not where I would have guessed.

The fix itself was three lines; finding where to put them took two days. The first measurement was misleading because the cache was already warm. The documentation described the happy path well and said nothing about what happens on timeout.

Reading the source was faster than searching for a blog post that matched my exact version. A budget for each page kept the bundle from growing one harmless dependency at a time. The error only appeared when two requests raced for the same row inside one transaction. Small, frequent releases made each change easy to reason about and easy to revert. Most of the latency came from a single synchronous call that nobody remembered adding.

## Where it started

The documentation described the happy path well and said nothing about what happens on timeout. Logs were useful only after every line carried a request identifier. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Clear error messages saved more time than any clever optimisation. I kept the old path behind a flag for a week so I could compare both under real traffic. The real constraint was not the CPU but the number of open file descriptors.

I kept the old path behind a flag for a week so I could compare both under real traffic. I deleted more code than I added, and the system got faster and easier to read. The fix itself was three lines; finding where to put them took two days.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

Reading the source was faster than searching for a blog post that matched my exact version. The real constraint was not the CPU but the number of open file descriptors. Tail latency told a different story from the average, which looked perfectly healthy. I wrote a short runbook so the next incident starts with steps instead of guesses. I kept the old path behind a flag for a week so I could compare both under real traffic.
