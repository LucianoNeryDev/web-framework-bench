---
title: "Debugging connection pooling without downtime"
slug: debugging-connection-pooling-without-downtime
date: 2026-05-27
summary: "Writing the test first forced me to decide what correct behaviour actually meant. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs."
tags: [go, performance]
cover: /images/debugging-connection-pooling-without-downtime.webp
---
Retries without jitter turned a short blip into a synchronised wave of traffic. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I started with the simplest version that could possibly work and wrote down every assumption. Reading the source was faster than searching for a blog post that matched my exact version.

Moving the work off the request path made the page fast and the queue honest. I deleted more code than I added, and the system got faster and easier to read. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The benchmark looked impressive until I ran it on the same hardware as production. The fix itself was three lines; finding where to put them took two days.

## The first attempt

Most tools default to settings that are reasonable for a laptop and surprising on a server. The first measurement was misleading because the cache was already warm. Retries without jitter turned a short blip into a synchronised wave of traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The benchmark looked impressive until I ran it on the same hardware as production.

Most of the latency came from a single synchronous call that nobody remembered adding. Clear error messages saved more time than any clever optimisation. The migration ran in batches so it could be paused, resumed and verified at each step. I started with the simplest version that could possibly work and wrote down every assumption.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

The documentation described the happy path well and said nothing about what happens on timeout. The benchmark looked impressive until I ran it on the same hardware as production. The error only appeared when two requests raced for the same row inside one transaction.

## Trade-offs

Small, frequent releases made each change easy to reason about and easy to revert. Retries without jitter turned a short blip into a synchronised wave of traffic. Most tools default to settings that are reasonable for a laptop and surprising on a server. I wrote a short runbook so the next incident starts with steps instead of guesses.

Most of the latency came from a single synchronous call that nobody remembered adding. Logs were useful only after every line carried a request identifier. The fix itself was three lines; finding where to put them took two days. I kept the old path behind a flag for a week so I could compare both under real traffic. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

- Moving the work off the request path made the page fast and the queue honest.
- Logs were useful only after every line carried a request identifier.
- I deleted more code than I added, and the system got faster and easier to read.
- Tail latency told a different story from the average, which looked perfectly healthy.

Measuring before and after turned a hunch into a result I could defend. Most of the latency came from a single synchronous call that nobody remembered adding. The profiler pointed at serialisation, which was not where I would have guessed. Reading the source was faster than searching for a blog post that matched my exact version.

## What I would do differently

The benchmark looked impressive until I ran it on the same hardware as production. I started with the simplest version that could possibly work and wrote down every assumption. Small, frequent releases made each change easy to reason about and easy to revert. Writing the test first forced me to decide what correct behaviour actually meant. I kept the old path behind a flag for a week so I could compare both under real traffic. The documentation described the happy path well and said nothing about what happens on timeout.

Retries without jitter turned a short blip into a synchronised wave of traffic. The slowest part of the deploy was waiting for a health check that checked nothing. The configuration file had grown three ways to say the same thing. A budget for each page kept the bundle from growing one harmless dependency at a time. Small, frequent releases made each change easy to reason about and easy to revert.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

> The profiler pointed at serialisation, which was not where I would have guessed.

Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. The fix itself was three lines; finding where to put them took two days. Small, frequent releases made each change easy to reason about and easy to revert. The documentation described the happy path well and said nothing about what happens on timeout.

## Measuring the problem

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time. Most tools default to settings that are reasonable for a laptop and surprising on a server. Most of the latency came from a single synchronous call that nobody remembered adding. I wrote a short runbook so the next incident starts with steps instead of guesses.

Most of the latency came from a single synchronous call that nobody remembered adding. The documentation described the happy path well and said nothing about what happens on timeout. The error only appeared when two requests raced for the same row inside one transaction.

Most tools default to settings that are reasonable for a laptop and surprising on a server. Writing the test first forced me to decide what correct behaviour actually meant. A small reproduction in an empty repository removed every distraction from the real problem.
