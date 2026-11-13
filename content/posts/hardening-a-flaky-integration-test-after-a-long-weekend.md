---
title: "Hardening a flaky integration test after a long weekend"
slug: hardening-a-flaky-integration-test-after-a-long-weekend
date: 2026-08-16
summary: "The documentation described the happy path well and said nothing about what happens on timeout. The migration ran in batches so it could be paused, resumed and verified at each step."
tags: [databases]
cover: /images/hardening-a-flaky-integration-test-after-a-long-weekend.webp
---
The slowest part of the deploy was waiting for a health check that checked nothing. The profiler pointed at serialisation, which was not where I would have guessed. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The fix itself was three lines; finding where to put them took two days.

I started with the simplest version that could possibly work and wrote down every assumption. I wrote a short runbook so the next incident starts with steps instead of guesses. Tail latency told a different story from the average, which looked perfectly healthy. Reading the source was faster than searching for a blog post that matched my exact version. A small reproduction in an empty repository removed every distraction from the real problem.

## What actually fixed it

The documentation described the happy path well and said nothing about what happens on timeout. Logs were useful only after every line carried a request identifier. Measuring before and after turned a hunch into a result I could defend. The real constraint was not the CPU but the number of open file descriptors. Tail latency told a different story from the average, which looked perfectly healthy.

Measuring before and after turned a hunch into a result I could defend. The real constraint was not the CPU but the number of open file descriptors. Small, frequent releases made each change easy to reason about and easy to revert. I kept the old path behind a flag for a week so I could compare both under real traffic. A budget for each page kept the bundle from growing one harmless dependency at a time.

The error only appeared when two requests raced for the same row inside one transaction. Moving the work off the request path made the page fast and the queue honest. Most of the latency came from a single synchronous call that nobody remembered adding.

## Numbers after the change

Moving the work off the request path made the page fast and the queue honest. Logs were useful only after every line carried a request identifier. Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic.

Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation. Tail latency told a different story from the average, which looked perfectly healthy.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

- Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.
- The real constraint was not the CPU but the number of open file descriptors.
- Measuring before and after turned a hunch into a result I could defend.
- A budget for each page kept the bundle from growing one harmless dependency at a time.

A budget for each page kept the bundle from growing one harmless dependency at a time. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The documentation described the happy path well and said nothing about what happens on timeout. I deleted more code than I added, and the system got faster and easier to read. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Takeaways

The migration ran in batches so it could be paused, resumed and verified at each step. Most tools default to settings that are reasonable for a laptop and surprising on a server. Reading the source was faster than searching for a blog post that matched my exact version. Logs were useful only after every line carried a request identifier. A small reproduction in an empty repository removed every distraction from the real problem.

Logs were useful only after every line carried a request identifier. The documentation described the happy path well and said nothing about what happens on timeout. Every abstraction leaked a little, and the leaks were where the bugs lived. I kept the old path behind a flag for a week so I could compare both under real traffic.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

> The slowest part of the deploy was waiting for a health check that checked nothing.

Writing the test first forced me to decide what correct behaviour actually meant. The error only appeared when two requests raced for the same row inside one transaction. The configuration file had grown three ways to say the same thing.

## What I would do differently

Reading the source was faster than searching for a blog post that matched my exact version. The real constraint was not the CPU but the number of open file descriptors. Most of the latency came from a single synchronous call that nobody remembered adding. The benchmark looked impressive until I ran it on the same hardware as production. Moving the work off the request path made the page fast and the queue honest.

Most tools default to settings that are reasonable for a laptop and surprising on a server. The first measurement was misleading because the cache was already warm. Measuring before and after turned a hunch into a result I could defend.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The fix itself was three lines; finding where to put them took two days. The profiler pointed at serialisation, which was not where I would have guessed. The benchmark looked impressive until I ran it on the same hardware as production. Reading the source was faster than searching for a blog post that matched my exact version.
