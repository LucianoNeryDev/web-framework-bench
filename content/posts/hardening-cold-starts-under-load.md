---
title: "Hardening cold starts under load"
slug: hardening-cold-starts-under-load
date: 2026-06-09
summary: "A small reproduction in an empty repository removed every distraction from the real problem. The fix itself was three lines; finding where to put them took two days."
tags: [tooling]
cover: /images/hardening-cold-starts-under-load.webp
---
Moving the work off the request path made the page fast and the queue honest. Logs were useful only after every line carried a request identifier. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Small, frequent releases made each change easy to reason about and easy to revert.

Most of the latency came from a single synchronous call that nobody remembered adding. The real constraint was not the CPU but the number of open file descriptors. The migration ran in batches so it could be paused, resumed and verified at each step. I deleted more code than I added, and the system got faster and easier to read. I wrote a short runbook so the next incident starts with steps instead of guesses.

## Trade-offs

Reading the source was faster than searching for a blog post that matched my exact version. The configuration file had grown three ways to say the same thing. The slowest part of the deploy was waiting for a health check that checked nothing. Moving the work off the request path made the page fast and the queue honest. Clear error messages saved more time than any clever optimisation.

The profiler pointed at serialisation, which was not where I would have guessed. Every abstraction leaked a little, and the leaks were where the bugs lived. Most of the latency came from a single synchronous call that nobody remembered adding. I kept the old path behind a flag for a week so I could compare both under real traffic. The real constraint was not the CPU but the number of open file descriptors.

A small reproduction in an empty repository removed every distraction from the real problem. The migration ran in batches so it could be paused, resumed and verified at each step. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## What actually fixed it

Clear error messages saved more time than any clever optimisation. Writing the test first forced me to decide what correct behaviour actually meant. Most tools default to settings that are reasonable for a laptop and surprising on a server. Retries without jitter turned a short blip into a synchronised wave of traffic. The configuration file had grown three ways to say the same thing. Most of the latency came from a single synchronous call that nobody remembered adding.

I started with the simplest version that could possibly work and wrote down every assumption. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Retries without jitter turned a short blip into a synchronised wave of traffic. Clear error messages saved more time than any clever optimisation.

- The slowest part of the deploy was waiting for a health check that checked nothing.
- I wrote a short runbook so the next incident starts with steps instead of guesses.
- Tail latency told a different story from the average, which looked perfectly healthy.
- Retries without jitter turned a short blip into a synchronised wave of traffic.

Writing the test first forced me to decide what correct behaviour actually meant. The migration ran in batches so it could be paused, resumed and verified at each step. Clear error messages saved more time than any clever optimisation.

## The first attempt

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I started with the simplest version that could possibly work and wrote down every assumption. Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm. Most tools default to settings that are reasonable for a laptop and surprising on a server. A budget for each page kept the bundle from growing one harmless dependency at a time.

Most tools default to settings that are reasonable for a laptop and surprising on a server. Moving the work off the request path made the page fast and the queue honest. The slowest part of the deploy was waiting for a health check that checked nothing.

> Small, frequent releases made each change easy to reason about and easy to revert.

Tail latency told a different story from the average, which looked perfectly healthy. Measuring before and after turned a hunch into a result I could defend. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The profiler pointed at serialisation, which was not where I would have guessed. Most tools default to settings that are reasonable for a laptop and surprising on a server.

## What I would do differently

The migration ran in batches so it could be paused, resumed and verified at each step. Most of the latency came from a single synchronous call that nobody remembered adding. I deleted more code than I added, and the system got faster and easier to read. The configuration file had grown three ways to say the same thing.

Writing the test first forced me to decide what correct behaviour actually meant. Moving the work off the request path made the page fast and the queue honest. Logs were useful only after every line carried a request identifier.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

Retries without jitter turned a short blip into a synchronised wave of traffic. Measuring before and after turned a hunch into a result I could defend. Moving the work off the request path made the page fast and the queue honest. The configuration file had grown three ways to say the same thing. The benchmark looked impressive until I ran it on the same hardware as production.

## Measuring the problem

Retries without jitter turned a short blip into a synchronised wave of traffic. The first measurement was misleading because the cache was already warm. A budget for each page kept the bundle from growing one harmless dependency at a time. Moving the work off the request path made the page fast and the queue honest. A small reproduction in an empty repository removed every distraction from the real problem. Clear error messages saved more time than any clever optimisation.

The first measurement was misleading because the cache was already warm. Small, frequent releases made each change easy to reason about and easy to revert. The benchmark looked impressive until I ran it on the same hardware as production. Clear error messages saved more time than any clever optimisation.

```rust
fn parse_line(line: &str) -> Option<(&str, u64)> {
    let (key, value) = line.split_once('=')?;
    let value = value.trim().parse().ok()?;
    Some((key.trim(), value))
}
```

The fix itself was three lines; finding where to put them took two days. Retries without jitter turned a short blip into a synchronised wave of traffic. The error only appeared when two requests raced for the same row inside one transaction. The real constraint was not the CPU but the number of open file descriptors. Most tools default to settings that are reasonable for a laptop and surprising on a server.
