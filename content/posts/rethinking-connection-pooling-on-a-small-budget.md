---
title: "Rethinking connection pooling on a small budget"
slug: rethinking-connection-pooling-on-a-small-budget
date: 2026-10-30
summary: "Clear error messages saved more time than any clever optimisation. The real constraint was not the CPU but the number of open file descriptors."
tags: [go, security]
cover: /images/rethinking-connection-pooling-on-a-small-budget.webp
---
Most of the latency came from a single synchronous call that nobody remembered adding. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days.

I started with the simplest version that could possibly work and wrote down every assumption. Most tools default to settings that are reasonable for a laptop and surprising on a server. Logs were useful only after every line carried a request identifier. The fix itself was three lines; finding where to put them took two days. Moving the work off the request path made the page fast and the queue honest.

## Where it started

Measuring before and after turned a hunch into a result I could defend. I started with the simplest version that could possibly work and wrote down every assumption. Retries without jitter turned a short blip into a synchronised wave of traffic. The configuration file had grown three ways to say the same thing. The migration ran in batches so it could be paused, resumed and verified at each step.

The error only appeared when two requests raced for the same row inside one transaction. The benchmark looked impressive until I ran it on the same hardware as production. I wrote a short runbook so the next incident starts with steps instead of guesses. Tail latency told a different story from the average, which looked perfectly healthy.

Measuring before and after turned a hunch into a result I could defend. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Small, frequent releases made each change easy to reason about and easy to revert.

## The first attempt

Writing the test first forced me to decide what correct behaviour actually meant. Retries without jitter turned a short blip into a synchronised wave of traffic. The migration ran in batches so it could be paused, resumed and verified at each step. Measuring before and after turned a hunch into a result I could defend.

A small reproduction in an empty repository removed every distraction from the real problem. Measuring before and after turned a hunch into a result I could defend. Most tools default to settings that are reasonable for a laptop and surprising on a server. The error only appeared when two requests raced for the same row inside one transaction.

- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- I started with the simplest version that could possibly work and wrote down every assumption.
- The profiler pointed at serialisation, which was not where I would have guessed.
- The benchmark looked impressive until I ran it on the same hardware as production.

I deleted more code than I added, and the system got faster and easier to read. Writing the test first forced me to decide what correct behaviour actually meant. Logs were useful only after every line carried a request identifier. The profiler pointed at serialisation, which was not where I would have guessed. The fix itself was three lines; finding where to put them took two days.

## What actually fixed it

Clear error messages saved more time than any clever optimisation. A small reproduction in an empty repository removed every distraction from the real problem. The first measurement was misleading because the cache was already warm. I wrote a short runbook so the next incident starts with steps instead of guesses. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The benchmark looked impressive until I ran it on the same hardware as production. The configuration file had grown three ways to say the same thing. Reading the source was faster than searching for a blog post that matched my exact version. Most of the latency came from a single synchronous call that nobody remembered adding.

> Retries without jitter turned a short blip into a synchronised wave of traffic.

Reading the source was faster than searching for a blog post that matched my exact version. Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic. Most tools default to settings that are reasonable for a laptop and surprising on a server.

## Takeaways

The benchmark looked impressive until I ran it on the same hardware as production. The documentation described the happy path well and said nothing about what happens on timeout. I kept the old path behind a flag for a week so I could compare both under real traffic. I deleted more code than I added, and the system got faster and easier to read. The error only appeared when two requests raced for the same row inside one transaction.

The configuration file had grown three ways to say the same thing. The slowest part of the deploy was waiting for a health check that checked nothing. The migration ran in batches so it could be paused, resumed and verified at each step.

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

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Clear error messages saved more time than any clever optimisation. Moving the work off the request path made the page fast and the queue honest. The documentation described the happy path well and said nothing about what happens on timeout. Every abstraction leaked a little, and the leaks were where the bugs lived.

## Trade-offs

I deleted more code than I added, and the system got faster and easier to read. Clear error messages saved more time than any clever optimisation. Every abstraction leaked a little, and the leaks were where the bugs lived. The configuration file had grown three ways to say the same thing. Moving the work off the request path made the page fast and the queue honest. I wrote a short runbook so the next incident starts with steps instead of guesses.

Measuring before and after turned a hunch into a result I could defend. Reading the source was faster than searching for a blog post that matched my exact version. The configuration file had grown three ways to say the same thing.

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

Moving the work off the request path made the page fast and the queue honest. Logs were useful only after every line carried a request identifier. A budget for each page kept the bundle from growing one harmless dependency at a time. Clear error messages saved more time than any clever optimisation. The first measurement was misleading because the cache was already warm.
