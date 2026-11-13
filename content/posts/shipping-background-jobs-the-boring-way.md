---
title: "Shipping background jobs the boring way"
slug: shipping-background-jobs-the-boring-way
date: 2026-05-22
summary: "The slowest part of the deploy was waiting for a health check that checked nothing. I started with the simplest version that could possibly work and wrote down every assumption."
tags: [security]
cover: /images/shipping-background-jobs-the-boring-way.webp
---
Writing the test first forced me to decide what correct behaviour actually meant. Every abstraction leaked a little, and the leaks were where the bugs lived. Most of the latency came from a single synchronous call that nobody remembered adding. I deleted more code than I added, and the system got faster and easier to read.

Most tools default to settings that are reasonable for a laptop and surprising on a server. The migration ran in batches so it could be paused, resumed and verified at each step. I started with the simplest version that could possibly work and wrote down every assumption. The fix itself was three lines; finding where to put them took two days. A small reproduction in an empty repository removed every distraction from the real problem.

## Measuring the problem

The configuration file had grown three ways to say the same thing. I kept the old path behind a flag for a week so I could compare both under real traffic. The fix itself was three lines; finding where to put them took two days. Small, frequent releases made each change easy to reason about and easy to revert.

Tail latency told a different story from the average, which looked perfectly healthy. Every abstraction leaked a little, and the leaks were where the bugs lived. I started with the simplest version that could possibly work and wrote down every assumption. Writing the test first forced me to decide what correct behaviour actually meant. I wrote a short runbook so the next incident starts with steps instead of guesses.

Measuring before and after turned a hunch into a result I could defend. The documentation described the happy path well and said nothing about what happens on timeout. Tail latency told a different story from the average, which looked perfectly healthy. The benchmark looked impressive until I ran it on the same hardware as production. I wrote a short runbook so the next incident starts with steps instead of guesses.

## Takeaways

Retries without jitter turned a short blip into a synchronised wave of traffic. A small reproduction in an empty repository removed every distraction from the real problem. Measuring before and after turned a hunch into a result I could defend. Reading the source was faster than searching for a blog post that matched my exact version. Logs were useful only after every line carried a request identifier. The documentation described the happy path well and said nothing about what happens on timeout.

The first measurement was misleading because the cache was already warm. Writing the test first forced me to decide what correct behaviour actually meant. The slowest part of the deploy was waiting for a health check that checked nothing. Retries without jitter turned a short blip into a synchronised wave of traffic. Logs were useful only after every line carried a request identifier.

- Most tools default to settings that are reasonable for a laptop and surprising on a server.
- I deleted more code than I added, and the system got faster and easier to read.
- The profiler pointed at serialisation, which was not where I would have guessed.
- The first measurement was misleading because the cache was already warm.

The error only appeared when two requests raced for the same row inside one transaction. The profiler pointed at serialisation, which was not where I would have guessed. Tail latency told a different story from the average, which looked perfectly healthy. Measuring before and after turned a hunch into a result I could defend.

## What actually fixed it

I deleted more code than I added, and the system got faster and easier to read. I kept the old path behind a flag for a week so I could compare both under real traffic. The error only appeared when two requests raced for the same row inside one transaction. Clear error messages saved more time than any clever optimisation.

Reading the source was faster than searching for a blog post that matched my exact version. The first measurement was misleading because the cache was already warm. Retries without jitter turned a short blip into a synchronised wave of traffic. Every abstraction leaked a little, and the leaks were where the bugs lived. I started with the simplest version that could possibly work and wrote down every assumption.

```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

@container (min-width: 40rem) {
  .card { grid-template-columns: 1fr 2fr; }
}
```

> The configuration file had grown three ways to say the same thing.

A small reproduction in an empty repository removed every distraction from the real problem. Retries without jitter turned a short blip into a synchronised wave of traffic. The first measurement was misleading because the cache was already warm.

## What I would do differently

Most tools default to settings that are reasonable for a laptop and surprising on a server. I deleted more code than I added, and the system got faster and easier to read. The benchmark looked impressive until I ran it on the same hardware as production. Most of the latency came from a single synchronous call that nobody remembered adding. Clear error messages saved more time than any clever optimisation.

Most of the latency came from a single synchronous call that nobody remembered adding. The fix itself was three lines; finding where to put them took two days. The documentation described the happy path well and said nothing about what happens on timeout.

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

The error only appeared when two requests raced for the same row inside one transaction. Reading the source was faster than searching for a blog post that matched my exact version. Small, frequent releases made each change easy to reason about and easy to revert. Clear error messages saved more time than any clever optimisation. Moving the work off the request path made the page fast and the queue honest.
