---
title: "Replacing a flaky integration test in production"
slug: replacing-a-flaky-integration-test-in-production
date: 2026-07-12
summary: "The error only appeared when two requests raced for the same row inside one transaction. Writing the test first forced me to decide what correct behaviour actually meant."
tags: [css, performance, devops]
cover: /images/replacing-a-flaky-integration-test-in-production.webp
---
The benchmark looked impressive until I ran it on the same hardware as production. The documentation described the happy path well and said nothing about what happens on timeout. The error only appeared when two requests raced for the same row inside one transaction. The configuration file had grown three ways to say the same thing.

The fix itself was three lines; finding where to put them took two days. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The slowest part of the deploy was waiting for a health check that checked nothing. Most of the latency came from a single synchronous call that nobody remembered adding. A budget for each page kept the bundle from growing one harmless dependency at a time.

## Takeaways

Moving the work off the request path made the page fast and the queue honest. Tail latency told a different story from the average, which looked perfectly healthy. A budget for each page kept the bundle from growing one harmless dependency at a time. Clear error messages saved more time than any clever optimisation.

I kept the old path behind a flag for a week so I could compare both under real traffic. Logs were useful only after every line carried a request identifier. I started with the simplest version that could possibly work and wrote down every assumption. The benchmark looked impressive until I ran it on the same hardware as production. I deleted more code than I added, and the system got faster and easier to read.

Every abstraction leaked a little, and the leaks were where the bugs lived. The error only appeared when two requests raced for the same row inside one transaction. Logs were useful only after every line carried a request identifier.

## Numbers after the change

The fix itself was three lines; finding where to put them took two days. The real constraint was not the CPU but the number of open file descriptors. The documentation described the happy path well and said nothing about what happens on timeout. I wrote a short runbook so the next incident starts with steps instead of guesses. Tail latency told a different story from the average, which looked perfectly healthy.

The first measurement was misleading because the cache was already warm. I wrote a short runbook so the next incident starts with steps instead of guesses. Most tools default to settings that are reasonable for a laptop and surprising on a server. The fix itself was three lines; finding where to put them took two days. Clear error messages saved more time than any clever optimisation.

- Measuring before and after turned a hunch into a result I could defend.
- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- Logs were useful only after every line carried a request identifier.
- I deleted more code than I added, and the system got faster and easier to read.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The slowest part of the deploy was waiting for a health check that checked nothing. Clear error messages saved more time than any clever optimisation. The documentation described the happy path well and said nothing about what happens on timeout. The error only appeared when two requests raced for the same row inside one transaction.

## What actually fixed it

Clear error messages saved more time than any clever optimisation. The error only appeared when two requests raced for the same row inside one transaction. The documentation described the happy path well and said nothing about what happens on timeout. Retries without jitter turned a short blip into a synchronised wave of traffic.

The benchmark looked impressive until I ran it on the same hardware as production. The profiler pointed at serialisation, which was not where I would have guessed. The migration ran in batches so it could be paused, resumed and verified at each step. Small, frequent releases made each change easy to reason about and easy to revert. The configuration file had grown three ways to say the same thing.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

> Writing the test first forced me to decide what correct behaviour actually meant.

Every abstraction leaked a little, and the leaks were where the bugs lived. The configuration file had grown three ways to say the same thing. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

## Trade-offs

The migration ran in batches so it could be paused, resumed and verified at each step. Clear error messages saved more time than any clever optimisation. Measuring before and after turned a hunch into a result I could defend. A small reproduction in an empty repository removed every distraction from the real problem. I kept the old path behind a flag for a week so I could compare both under real traffic. Writing the test first forced me to decide what correct behaviour actually meant.

Small, frequent releases made each change easy to reason about and easy to revert. Moving the work off the request path made the page fast and the queue honest. A budget for each page kept the bundle from growing one harmless dependency at a time. A small reproduction in an empty repository removed every distraction from the real problem. Retries without jitter turned a short blip into a synchronised wave of traffic.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

The documentation described the happy path well and said nothing about what happens on timeout. Clear error messages saved more time than any clever optimisation. Moving the work off the request path made the page fast and the queue honest. Every abstraction leaked a little, and the leaks were where the bugs lived.
