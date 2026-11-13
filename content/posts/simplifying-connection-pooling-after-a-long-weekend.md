---
title: "Simplifying connection pooling after a long weekend"
slug: simplifying-connection-pooling-after-a-long-weekend
date: 2026-06-13
summary: "I deleted more code than I added, and the system got faster and easier to read. The profiler pointed at serialisation, which was not where I would have guessed."
tags: [rust, devops]
cover: /images/simplifying-connection-pooling-after-a-long-weekend.webp
---
The error only appeared when two requests raced for the same row inside one transaction. Pinning the versions made the build reproducible and the upgrade a deliberate decision. A small reproduction in an empty repository removed every distraction from the real problem. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

Most tools default to settings that are reasonable for a laptop and surprising on a server. A small reproduction in an empty repository removed every distraction from the real problem. The migration ran in batches so it could be paused, resumed and verified at each step. I deleted more code than I added, and the system got faster and easier to read. Small, frequent releases made each change easy to reason about and easy to revert.

## Where it started

Clear error messages saved more time than any clever optimisation. I deleted more code than I added, and the system got faster and easier to read. Retries without jitter turned a short blip into a synchronised wave of traffic. The migration ran in batches so it could be paused, resumed and verified at each step.

Logs were useful only after every line carried a request identifier. Tail latency told a different story from the average, which looked perfectly healthy. Retries without jitter turned a short blip into a synchronised wave of traffic. The slowest part of the deploy was waiting for a health check that checked nothing. Clear error messages saved more time than any clever optimisation.

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

Tail latency told a different story from the average, which looked perfectly healthy. I kept the old path behind a flag for a week so I could compare both under real traffic. The benchmark looked impressive until I ran it on the same hardware as production. A small reproduction in an empty repository removed every distraction from the real problem.

## What actually fixed it

I deleted more code than I added, and the system got faster and easier to read. Tail latency told a different story from the average, which looked perfectly healthy. The configuration file had grown three ways to say the same thing. Most of the latency came from a single synchronous call that nobody remembered adding.

I kept the old path behind a flag for a week so I could compare both under real traffic. The migration ran in batches so it could be paused, resumed and verified at each step. The slowest part of the deploy was waiting for a health check that checked nothing. The real constraint was not the CPU but the number of open file descriptors.

- A small reproduction in an empty repository removed every distraction from the real problem.
- Measuring before and after turned a hunch into a result I could defend.
- The migration ran in batches so it could be paused, resumed and verified at each step.
- The error only appeared when two requests raced for the same row inside one transaction.

Writing the test first forced me to decide what correct behaviour actually meant. Every abstraction leaked a little, and the leaks were where the bugs lived. The configuration file had grown three ways to say the same thing.

## What I would do differently

I wrote a short runbook so the next incident starts with steps instead of guesses. The real constraint was not the CPU but the number of open file descriptors. The benchmark looked impressive until I ran it on the same hardware as production. Every abstraction leaked a little, and the leaks were where the bugs lived.

Every abstraction leaked a little, and the leaks were where the bugs lived. I started with the simplest version that could possibly work and wrote down every assumption. Reading the source was faster than searching for a blog post that matched my exact version. The fix itself was three lines; finding where to put them took two days. The slowest part of the deploy was waiting for a health check that checked nothing.

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

> I kept the old path behind a flag for a week so I could compare both under real traffic.

The real constraint was not the CPU but the number of open file descriptors. Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Measuring the problem

The profiler pointed at serialisation, which was not where I would have guessed. The configuration file had grown three ways to say the same thing. Retries without jitter turned a short blip into a synchronised wave of traffic. I started with the simplest version that could possibly work and wrote down every assumption. The slowest part of the deploy was waiting for a health check that checked nothing. The error only appeared when two requests raced for the same row inside one transaction.

I deleted more code than I added, and the system got faster and easier to read. Most tools default to settings that are reasonable for a laptop and surprising on a server. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

Measuring before and after turned a hunch into a result I could defend. I kept the old path behind a flag for a week so I could compare both under real traffic. Moving the work off the request path made the page fast and the queue honest.

## Numbers after the change

Pinning the versions made the build reproducible and the upgrade a deliberate decision. Reading the source was faster than searching for a blog post that matched my exact version. Measuring before and after turned a hunch into a result I could defend. A small reproduction in an empty repository removed every distraction from the real problem. The migration ran in batches so it could be paused, resumed and verified at each step.

Writing the test first forced me to decide what correct behaviour actually meant. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

The fix itself was three lines; finding where to put them took two days. The configuration file had grown three ways to say the same thing. Tail latency told a different story from the average, which looked perfectly healthy. Most of the latency came from a single synchronous call that nobody remembered adding.
