---
title: "Profiling structured logging from first principles"
slug: profiling-structured-logging-from-first-principles
date: 2026-09-05
summary: "Writing the test first forced me to decide what correct behaviour actually meant. Pinning the versions made the build reproducible and the upgrade a deliberate decision."
tags: [go, performance, databases]
cover: /images/profiling-structured-logging-from-first-principles.webp
---
The migration ran in batches so it could be paused, resumed and verified at each step. I started with the simplest version that could possibly work and wrote down every assumption. Reading the source was faster than searching for a blog post that matched my exact version. I kept the old path behind a flag for a week so I could compare both under real traffic.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. I wrote a short runbook so the next incident starts with steps instead of guesses. Reading the source was faster than searching for a blog post that matched my exact version. The migration ran in batches so it could be paused, resumed and verified at each step. The documentation described the happy path well and said nothing about what happens on timeout.

## What I would do differently

Clear error messages saved more time than any clever optimisation. I kept the old path behind a flag for a week so I could compare both under real traffic. Writing the test first forced me to decide what correct behaviour actually meant. The documentation described the happy path well and said nothing about what happens on timeout. Reading the source was faster than searching for a blog post that matched my exact version.

Measuring before and after turned a hunch into a result I could defend. A budget for each page kept the bundle from growing one harmless dependency at a time. The documentation described the happy path well and said nothing about what happens on timeout.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

A small reproduction in an empty repository removed every distraction from the real problem. The slowest part of the deploy was waiting for a health check that checked nothing. Writing the test first forced me to decide what correct behaviour actually meant.

## Measuring the problem

A budget for each page kept the bundle from growing one harmless dependency at a time. Most of the latency came from a single synchronous call that nobody remembered adding. The real constraint was not the CPU but the number of open file descriptors. Small, frequent releases made each change easy to reason about and easy to revert. The configuration file had grown three ways to say the same thing.

I kept the old path behind a flag for a week so I could compare both under real traffic. The benchmark looked impressive until I ran it on the same hardware as production. Every abstraction leaked a little, and the leaks were where the bugs lived. Moving the work off the request path made the page fast and the queue honest. I wrote a short runbook so the next incident starts with steps instead of guesses.

- The error only appeared when two requests raced for the same row inside one transaction.
- Most of the latency came from a single synchronous call that nobody remembered adding.
- Most tools default to settings that are reasonable for a laptop and surprising on a server.
- The real constraint was not the CPU but the number of open file descriptors.

I deleted more code than I added, and the system got faster and easier to read. A small reproduction in an empty repository removed every distraction from the real problem. The error only appeared when two requests raced for the same row inside one transaction.

## Where it started

Logs were useful only after every line carried a request identifier. I wrote a short runbook so the next incident starts with steps instead of guesses. A budget for each page kept the bundle from growing one harmless dependency at a time. Most tools default to settings that are reasonable for a laptop and surprising on a server. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The fix itself was three lines; finding where to put them took two days.

Tail latency told a different story from the average, which looked perfectly healthy. Moving the work off the request path made the page fast and the queue honest. A small reproduction in an empty repository removed every distraction from the real problem.

> A small reproduction in an empty repository removed every distraction from the real problem.

The documentation described the happy path well and said nothing about what happens on timeout. Tail latency told a different story from the average, which looked perfectly healthy. Writing the test first forced me to decide what correct behaviour actually meant.

## The first attempt

A budget for each page kept the bundle from growing one harmless dependency at a time. Reading the source was faster than searching for a blog post that matched my exact version. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Every abstraction leaked a little, and the leaks were where the bugs lived. I started with the simplest version that could possibly work and wrote down every assumption. The fix itself was three lines; finding where to put them took two days.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. The error only appeared when two requests raced for the same row inside one transaction. Small, frequent releases made each change easy to reason about and easy to revert. The configuration file had grown three ways to say the same thing.

The profiler pointed at serialisation, which was not where I would have guessed. I wrote a short runbook so the next incident starts with steps instead of guesses. The configuration file had grown three ways to say the same thing. The first measurement was misleading because the cache was already warm.

## Trade-offs

The slowest part of the deploy was waiting for a health check that checked nothing. Tail latency told a different story from the average, which looked perfectly healthy. Writing the test first forced me to decide what correct behaviour actually meant. The real constraint was not the CPU but the number of open file descriptors. A budget for each page kept the bundle from growing one harmless dependency at a time.

I wrote a short runbook so the next incident starts with steps instead of guesses. Clear error messages saved more time than any clever optimisation. The error only appeared when two requests raced for the same row inside one transaction. Measuring before and after turned a hunch into a result I could defend.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. The migration ran in batches so it could be paused, resumed and verified at each step. I kept the old path behind a flag for a week so I could compare both under real traffic. Most of the latency came from a single synchronous call that nobody remembered adding.
