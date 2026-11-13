---
title: "Simplifying error budgets after a long weekend"
slug: simplifying-error-budgets-after-a-long-weekend
date: 2026-04-27
summary: "I kept the old path behind a flag for a week so I could compare both under real traffic. Tail latency told a different story from the average, which looked perfectly healthy."
tags: [go, javascript, devops]
cover: /images/simplifying-error-budgets-after-a-long-weekend.webp
---
Most of the latency came from a single synchronous call that nobody remembered adding. A budget for each page kept the bundle from growing one harmless dependency at a time. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. A small reproduction in an empty repository removed every distraction from the real problem.

Most of the latency came from a single synchronous call that nobody remembered adding. Retries without jitter turned a short blip into a synchronised wave of traffic. Every abstraction leaked a little, and the leaks were where the bugs lived. The profiler pointed at serialisation, which was not where I would have guessed. I kept the old path behind a flag for a week so I could compare both under real traffic.

## The first attempt

I deleted more code than I added, and the system got faster and easier to read. Clear error messages saved more time than any clever optimisation. I started with the simplest version that could possibly work and wrote down every assumption. Every abstraction leaked a little, and the leaks were where the bugs lived. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

The configuration file had grown three ways to say the same thing. Retries without jitter turned a short blip into a synchronised wave of traffic. I started with the simplest version that could possibly work and wrote down every assumption. The slowest part of the deploy was waiting for a health check that checked nothing. Reading the source was faster than searching for a blog post that matched my exact version.

Logs were useful only after every line carried a request identifier. The documentation described the happy path well and said nothing about what happens on timeout. Writing the test first forced me to decide what correct behaviour actually meant. Small, frequent releases made each change easy to reason about and easy to revert.

## Takeaways

The configuration file had grown three ways to say the same thing. The real constraint was not the CPU but the number of open file descriptors. I wrote a short runbook so the next incident starts with steps instead of guesses. Retries without jitter turned a short blip into a synchronised wave of traffic.

I started with the simplest version that could possibly work and wrote down every assumption. Most of the latency came from a single synchronous call that nobody remembered adding. Most tools default to settings that are reasonable for a laptop and surprising on a server. Logs were useful only after every line carried a request identifier. Reading the source was faster than searching for a blog post that matched my exact version.

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

- The benchmark looked impressive until I ran it on the same hardware as production.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- The slowest part of the deploy was waiting for a health check that checked nothing.
- Retries without jitter turned a short blip into a synchronised wave of traffic.

Reading the source was faster than searching for a blog post that matched my exact version. Most of the latency came from a single synchronous call that nobody remembered adding. The error only appeared when two requests raced for the same row inside one transaction. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I wrote a short runbook so the next incident starts with steps instead of guesses.

## What I would do differently

A small reproduction in an empty repository removed every distraction from the real problem. The benchmark looked impressive until I ran it on the same hardware as production. Reading the source was faster than searching for a blog post that matched my exact version. I deleted more code than I added, and the system got faster and easier to read. Moving the work off the request path made the page fast and the queue honest.

The documentation described the happy path well and said nothing about what happens on timeout. The profiler pointed at serialisation, which was not where I would have guessed. Reading the source was faster than searching for a blog post that matched my exact version. Retries without jitter turned a short blip into a synchronised wave of traffic.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

> Most of the latency came from a single synchronous call that nobody remembered adding.

Moving the work off the request path made the page fast and the queue honest. I started with the simplest version that could possibly work and wrote down every assumption. Every abstraction leaked a little, and the leaks were where the bugs lived.

## Numbers after the change

Writing the test first forced me to decide what correct behaviour actually meant. Moving the work off the request path made the page fast and the queue honest. The error only appeared when two requests raced for the same row inside one transaction. The first measurement was misleading because the cache was already warm.

Small, frequent releases made each change easy to reason about and easy to revert. I deleted more code than I added, and the system got faster and easier to read. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Most tools default to settings that are reasonable for a laptop and surprising on a server.

I started with the simplest version that could possibly work and wrote down every assumption. The profiler pointed at serialisation, which was not where I would have guessed. Clear error messages saved more time than any clever optimisation. The benchmark looked impressive until I ran it on the same hardware as production.
