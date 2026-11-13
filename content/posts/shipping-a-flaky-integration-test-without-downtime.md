---
title: "Shipping a flaky integration test without downtime"
slug: shipping-a-flaky-integration-test-without-downtime
date: 2026-04-20
summary: "Pinning the versions made the build reproducible and the upgrade a deliberate decision. The fix itself was three lines; finding where to put them took two days."
tags: [go, performance, security]
cover: /images/shipping-a-flaky-integration-test-without-downtime.webp
---
Retries without jitter turned a short blip into a synchronised wave of traffic. The slowest part of the deploy was waiting for a health check that checked nothing. The first measurement was misleading because the cache was already warm. Moving the work off the request path made the page fast and the queue honest.

The slowest part of the deploy was waiting for a health check that checked nothing. The benchmark looked impressive until I ran it on the same hardware as production. The profiler pointed at serialisation, which was not where I would have guessed. Most of the latency came from a single synchronous call that nobody remembered adding. I kept the old path behind a flag for a week so I could compare both under real traffic.

## Trade-offs

I started with the simplest version that could possibly work and wrote down every assumption. Writing the test first forced me to decide what correct behaviour actually meant. Logs were useful only after every line carried a request identifier. The profiler pointed at serialisation, which was not where I would have guessed. Most tools default to settings that are reasonable for a laptop and surprising on a server.

I kept the old path behind a flag for a week so I could compare both under real traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The profiler pointed at serialisation, which was not where I would have guessed. The benchmark looked impressive until I ran it on the same hardware as production.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. The slowest part of the deploy was waiting for a health check that checked nothing. The fix itself was three lines; finding where to put them took two days. I wrote a short runbook so the next incident starts with steps instead of guesses.

## The first attempt

I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier. Reading the source was faster than searching for a blog post that matched my exact version. Measuring before and after turned a hunch into a result I could defend. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The migration ran in batches so it could be paused, resumed and verified at each step.

I started with the simplest version that could possibly work and wrote down every assumption. The slowest part of the deploy was waiting for a health check that checked nothing. Retries without jitter turned a short blip into a synchronised wave of traffic.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

- Logs were useful only after every line carried a request identifier.
- Moving the work off the request path made the page fast and the queue honest.
- The error only appeared when two requests raced for the same row inside one transaction.
- Measuring before and after turned a hunch into a result I could defend.

A small reproduction in an empty repository removed every distraction from the real problem. Moving the work off the request path made the page fast and the queue honest. A budget for each page kept the bundle from growing one harmless dependency at a time. The documentation described the happy path well and said nothing about what happens on timeout. The profiler pointed at serialisation, which was not where I would have guessed.

## What I would do differently

Tail latency told a different story from the average, which looked perfectly healthy. Reading the source was faster than searching for a blog post that matched my exact version. The configuration file had grown three ways to say the same thing. The benchmark looked impressive until I ran it on the same hardware as production. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Most of the latency came from a single synchronous call that nobody remembered adding.

Writing the test first forced me to decide what correct behaviour actually meant. A small reproduction in an empty repository removed every distraction from the real problem. Clear error messages saved more time than any clever optimisation. A budget for each page kept the bundle from growing one harmless dependency at a time.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

> The fix itself was three lines; finding where to put them took two days.

Every abstraction leaked a little, and the leaks were where the bugs lived. Most of the latency came from a single synchronous call that nobody remembered adding. The benchmark looked impressive until I ran it on the same hardware as production. The configuration file had grown three ways to say the same thing. The first measurement was misleading because the cache was already warm.

## Numbers after the change

The configuration file had grown three ways to say the same thing. I wrote a short runbook so the next incident starts with steps instead of guesses. The real constraint was not the CPU but the number of open file descriptors. The migration ran in batches so it could be paused, resumed and verified at each step. A small reproduction in an empty repository removed every distraction from the real problem. The slowest part of the deploy was waiting for a health check that checked nothing.

Reading the source was faster than searching for a blog post that matched my exact version. The profiler pointed at serialisation, which was not where I would have guessed. I wrote a short runbook so the next incident starts with steps instead of guesses. The error only appeared when two requests raced for the same row inside one transaction. Logs were useful only after every line carried a request identifier.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Moving the work off the request path made the page fast and the queue honest. The configuration file had grown three ways to say the same thing. The migration ran in batches so it could be paused, resumed and verified at each step. I wrote a short runbook so the next incident starts with steps instead of guesses.
