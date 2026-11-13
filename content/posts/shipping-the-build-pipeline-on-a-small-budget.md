---
title: "Shipping the build pipeline on a small budget"
slug: shipping-the-build-pipeline-on-a-small-budget
date: 2026-05-31
summary: "Moving the work off the request path made the page fast and the queue honest. Tail latency told a different story from the average, which looked perfectly healthy."
tags: [rust, javascript, databases]
cover: /images/shipping-the-build-pipeline-on-a-small-budget.webp
---
A small reproduction in an empty repository removed every distraction from the real problem. Pinning the versions made the build reproducible and the upgrade a deliberate decision. The documentation described the happy path well and said nothing about what happens on timeout. Every abstraction leaked a little, and the leaks were where the bugs lived.

The documentation described the happy path well and said nothing about what happens on timeout. The first measurement was misleading because the cache was already warm. A budget for each page kept the bundle from growing one harmless dependency at a time. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Most tools default to settings that are reasonable for a laptop and surprising on a server.

## Measuring the problem

A budget for each page kept the bundle from growing one harmless dependency at a time. Retries without jitter turned a short blip into a synchronised wave of traffic. Writing the test first forced me to decide what correct behaviour actually meant. Most tools default to settings that are reasonable for a laptop and surprising on a server. Most of the latency came from a single synchronous call that nobody remembered adding.

The documentation described the happy path well and said nothing about what happens on timeout. I kept the old path behind a flag for a week so I could compare both under real traffic. The real constraint was not the CPU but the number of open file descriptors. Retries without jitter turned a short blip into a synchronised wave of traffic. The migration ran in batches so it could be paused, resumed and verified at each step.

Clear error messages saved more time than any clever optimisation. Measuring before and after turned a hunch into a result I could defend. The profiler pointed at serialisation, which was not where I would have guessed. A budget for each page kept the bundle from growing one harmless dependency at a time. Most of the latency came from a single synchronous call that nobody remembered adding.

## Where it started

Writing the test first forced me to decide what correct behaviour actually meant. Moving the work off the request path made the page fast and the queue honest. Most of the latency came from a single synchronous call that nobody remembered adding. The fix itself was three lines; finding where to put them took two days. Most tools default to settings that are reasonable for a laptop and surprising on a server. The profiler pointed at serialisation, which was not where I would have guessed.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Tail latency told a different story from the average, which looked perfectly healthy. The slowest part of the deploy was waiting for a health check that checked nothing. The documentation described the happy path well and said nothing about what happens on timeout.

- Tail latency told a different story from the average, which looked perfectly healthy.
- Retries without jitter turned a short blip into a synchronised wave of traffic.
- Clear error messages saved more time than any clever optimisation.
- A small reproduction in an empty repository removed every distraction from the real problem.

The first measurement was misleading because the cache was already warm. Retries without jitter turned a short blip into a synchronised wave of traffic. Writing the test first forced me to decide what correct behaviour actually meant. Logs were useful only after every line carried a request identifier. Clear error messages saved more time than any clever optimisation.

## What I would do differently

A small reproduction in an empty repository removed every distraction from the real problem. Reading the source was faster than searching for a blog post that matched my exact version. The profiler pointed at serialisation, which was not where I would have guessed. The fix itself was three lines; finding where to put them took two days.

I wrote a short runbook so the next incident starts with steps instead of guesses. Logs were useful only after every line carried a request identifier. Small, frequent releases made each change easy to reason about and easy to revert.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

> I deleted more code than I added, and the system got faster and easier to read.

Logs were useful only after every line carried a request identifier. I started with the simplest version that could possibly work and wrote down every assumption. I deleted more code than I added, and the system got faster and easier to read. The migration ran in batches so it could be paused, resumed and verified at each step. Reading the source was faster than searching for a blog post that matched my exact version.

## Takeaways

The slowest part of the deploy was waiting for a health check that checked nothing. Logs were useful only after every line carried a request identifier. The error only appeared when two requests raced for the same row inside one transaction. I wrote a short runbook so the next incident starts with steps instead of guesses.

The benchmark looked impressive until I ran it on the same hardware as production. The profiler pointed at serialisation, which was not where I would have guessed. The first measurement was misleading because the cache was already warm.

```go
func handler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if err := work(ctx); err != nil {
		http.Error(w, "upstream timeout", http.StatusGatewayTimeout)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
```

The first measurement was misleading because the cache was already warm. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Measuring before and after turned a hunch into a result I could defend. Clear error messages saved more time than any clever optimisation. Tail latency told a different story from the average, which looked perfectly healthy.
