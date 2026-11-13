---
title: "Debugging TLS termination in production"
slug: debugging-tls-termination-in-production
date: 2026-10-11
summary: "The configuration file had grown three ways to say the same thing. Small, frequent releases made each change easy to reason about and easy to revert."
tags: [go, devops, testing]
cover: /images/debugging-tls-termination-in-production.webp
---
Every abstraction leaked a little, and the leaks were where the bugs lived. Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time. Clear error messages saved more time than any clever optimisation.

Clear error messages saved more time than any clever optimisation. The configuration file had grown three ways to say the same thing. Writing the test first forced me to decide what correct behaviour actually meant. The slowest part of the deploy was waiting for a health check that checked nothing. Tail latency told a different story from the average, which looked perfectly healthy.

## What I would do differently

The first measurement was misleading because the cache was already warm. The real constraint was not the CPU but the number of open file descriptors. Most of the latency came from a single synchronous call that nobody remembered adding. Writing the test first forced me to decide what correct behaviour actually meant. The profiler pointed at serialisation, which was not where I would have guessed. Tail latency told a different story from the average, which looked perfectly healthy.

Small, frequent releases made each change easy to reason about and easy to revert. Reading the source was faster than searching for a blog post that matched my exact version. Most tools default to settings that are reasonable for a laptop and surprising on a server. Logs were useful only after every line carried a request identifier. A budget for each page kept the bundle from growing one harmless dependency at a time.

The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step. The configuration file had grown three ways to say the same thing. Moving the work off the request path made the page fast and the queue honest.

## The first attempt

I wrote a short runbook so the next incident starts with steps instead of guesses. The profiler pointed at serialisation, which was not where I would have guessed. A budget for each page kept the bundle from growing one harmless dependency at a time. A small reproduction in an empty repository removed every distraction from the real problem.

Most of the latency came from a single synchronous call that nobody remembered adding. Most tools default to settings that are reasonable for a laptop and surprising on a server. The configuration file had grown three ways to say the same thing.

- The slowest part of the deploy was waiting for a health check that checked nothing.
- The profiler pointed at serialisation, which was not where I would have guessed.
- The real constraint was not the CPU but the number of open file descriptors.
- A budget for each page kept the bundle from growing one harmless dependency at a time.

I wrote a short runbook so the next incident starts with steps instead of guesses. Tail latency told a different story from the average, which looked perfectly healthy. The first measurement was misleading because the cache was already warm. Measuring before and after turned a hunch into a result I could defend. The error only appeared when two requests raced for the same row inside one transaction.

## Measuring the problem

Clear error messages saved more time than any clever optimisation. Writing the test first forced me to decide what correct behaviour actually meant. A small reproduction in an empty repository removed every distraction from the real problem. Measuring before and after turned a hunch into a result I could defend. Logs were useful only after every line carried a request identifier.

I deleted more code than I added, and the system got faster and easier to read. Writing the test first forced me to decide what correct behaviour actually meant. The error only appeared when two requests raced for the same row inside one transaction. A budget for each page kept the bundle from growing one harmless dependency at a time.

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

> Small, frequent releases made each change easy to reason about and easy to revert.

Most of the latency came from a single synchronous call that nobody remembered adding. Most tools default to settings that are reasonable for a laptop and surprising on a server. The slowest part of the deploy was waiting for a health check that checked nothing. Pinning the versions made the build reproducible and the upgrade a deliberate decision. A small reproduction in an empty repository removed every distraction from the real problem.

## Takeaways

Writing the test first forced me to decide what correct behaviour actually meant. Retries without jitter turned a short blip into a synchronised wave of traffic. The migration ran in batches so it could be paused, resumed and verified at each step. The first measurement was misleading because the cache was already warm. The real constraint was not the CPU but the number of open file descriptors.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Most of the latency came from a single synchronous call that nobody remembered adding. Reading the source was faster than searching for a blog post that matched my exact version.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

The real constraint was not the CPU but the number of open file descriptors. The migration ran in batches so it could be paused, resumed and verified at each step. A budget for each page kept the bundle from growing one harmless dependency at a time.
