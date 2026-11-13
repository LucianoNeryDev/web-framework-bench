---
title: "Profiling container images at the edge"
slug: profiling-container-images-at-the-edge
date: 2026-07-05
summary: "The error only appeared when two requests raced for the same row inside one transaction. Pinning the versions made the build reproducible and the upgrade a deliberate decision."
tags: [javascript, devops, security]
cover: /images/profiling-container-images-at-the-edge.webp
---
Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The slowest part of the deploy was waiting for a health check that checked nothing. Most tools default to settings that are reasonable for a laptop and surprising on a server. Retries without jitter turned a short blip into a synchronised wave of traffic.

The configuration file had grown three ways to say the same thing. The slowest part of the deploy was waiting for a health check that checked nothing. The error only appeared when two requests raced for the same row inside one transaction. The real constraint was not the CPU but the number of open file descriptors. Clear error messages saved more time than any clever optimisation.

## What I would do differently

The documentation described the happy path well and said nothing about what happens on timeout. The first measurement was misleading because the cache was already warm. Tail latency told a different story from the average, which looked perfectly healthy. Moving the work off the request path made the page fast and the queue honest. Most of the latency came from a single synchronous call that nobody remembered adding.

Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The profiler pointed at serialisation, which was not where I would have guessed. I kept the old path behind a flag for a week so I could compare both under real traffic.

The configuration file had grown three ways to say the same thing. Measuring before and after turned a hunch into a result I could defend. I wrote a short runbook so the next incident starts with steps instead of guesses. Small, frequent releases made each change easy to reason about and easy to revert.

## Measuring the problem

The first measurement was misleading because the cache was already warm. Tail latency told a different story from the average, which looked perfectly healthy. The documentation described the happy path well and said nothing about what happens on timeout. I deleted more code than I added, and the system got faster and easier to read. Clear error messages saved more time than any clever optimisation.

I wrote a short runbook so the next incident starts with steps instead of guesses. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. A small reproduction in an empty repository removed every distraction from the real problem. Most of the latency came from a single synchronous call that nobody remembered adding.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

- Every abstraction leaked a little, and the leaks were where the bugs lived.
- Most tools default to settings that are reasonable for a laptop and surprising on a server.
- I wrote a short runbook so the next incident starts with steps instead of guesses.
- The real constraint was not the CPU but the number of open file descriptors.

Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. I started with the simplest version that could possibly work and wrote down every assumption. Every abstraction leaked a little, and the leaks were where the bugs lived.

## Trade-offs

The migration ran in batches so it could be paused, resumed and verified at each step. Logs were useful only after every line carried a request identifier. Most tools default to settings that are reasonable for a laptop and surprising on a server. I kept the old path behind a flag for a week so I could compare both under real traffic.

The real constraint was not the CPU but the number of open file descriptors. Reading the source was faster than searching for a blog post that matched my exact version. Most tools default to settings that are reasonable for a laptop and surprising on a server. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The first measurement was misleading because the cache was already warm.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

> The slowest part of the deploy was waiting for a health check that checked nothing.

The migration ran in batches so it could be paused, resumed and verified at each step. Logs were useful only after every line carried a request identifier. I wrote a short runbook so the next incident starts with steps instead of guesses.

## Numbers after the change

Reading the source was faster than searching for a blog post that matched my exact version. Clear error messages saved more time than any clever optimisation. The profiler pointed at serialisation, which was not where I would have guessed. I deleted more code than I added, and the system got faster and easier to read. Most of the latency came from a single synchronous call that nobody remembered adding.

Retries without jitter turned a short blip into a synchronised wave of traffic. The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step. Most of the latency came from a single synchronous call that nobody remembered adding.

The first measurement was misleading because the cache was already warm. Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days. I started with the simplest version that could possibly work and wrote down every assumption.
