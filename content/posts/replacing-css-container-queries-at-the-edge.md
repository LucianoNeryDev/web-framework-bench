---
title: "Replacing CSS container queries at the edge"
slug: replacing-css-container-queries-at-the-edge
date: 2026-09-03
summary: "I wrote a short runbook so the next incident starts with steps instead of guesses. Writing the test first forced me to decide what correct behaviour actually meant."
tags: [performance, databases, security]
cover: /images/replacing-css-container-queries-at-the-edge.webp
---
Most of the latency came from a single synchronous call that nobody remembered adding. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The profiler pointed at serialisation, which was not where I would have guessed. Writing the test first forced me to decide what correct behaviour actually meant.

The documentation described the happy path well and said nothing about what happens on timeout. The slowest part of the deploy was waiting for a health check that checked nothing. The benchmark looked impressive until I ran it on the same hardware as production. Most tools default to settings that are reasonable for a laptop and surprising on a server. Tail latency told a different story from the average, which looked perfectly healthy.

## Takeaways

Retries without jitter turned a short blip into a synchronised wave of traffic. The configuration file had grown three ways to say the same thing. Clear error messages saved more time than any clever optimisation. Most of the latency came from a single synchronous call that nobody remembered adding. Writing the test first forced me to decide what correct behaviour actually meant. Tail latency told a different story from the average, which looked perfectly healthy.

Most tools default to settings that are reasonable for a laptop and surprising on a server. I deleted more code than I added, and the system got faster and easier to read. A budget for each page kept the bundle from growing one harmless dependency at a time. Writing the test first forced me to decide what correct behaviour actually meant. I wrote a short runbook so the next incident starts with steps instead of guesses.

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

I wrote a short runbook so the next incident starts with steps instead of guesses. I started with the simplest version that could possibly work and wrote down every assumption. I deleted more code than I added, and the system got faster and easier to read. Logs were useful only after every line carried a request identifier.

## Where it started

Clear error messages saved more time than any clever optimisation. Moving the work off the request path made the page fast and the queue honest. Tail latency told a different story from the average, which looked perfectly healthy. Most tools default to settings that are reasonable for a laptop and surprising on a server.

The configuration file had grown three ways to say the same thing. Pinning the versions made the build reproducible and the upgrade a deliberate decision. Writing the test first forced me to decide what correct behaviour actually meant. The first measurement was misleading because the cache was already warm. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

- Most of the latency came from a single synchronous call that nobody remembered adding.
- A budget for each page kept the bundle from growing one harmless dependency at a time.
- Logs were useful only after every line carried a request identifier.
- The migration ran in batches so it could be paused, resumed and verified at each step.

The configuration file had grown three ways to say the same thing. I started with the simplest version that could possibly work and wrote down every assumption. Clear error messages saved more time than any clever optimisation. The migration ran in batches so it could be paused, resumed and verified at each step. The benchmark looked impressive until I ran it on the same hardware as production.

## Trade-offs

A budget for each page kept the bundle from growing one harmless dependency at a time. I kept the old path behind a flag for a week so I could compare both under real traffic. The fix itself was three lines; finding where to put them took two days. Writing the test first forced me to decide what correct behaviour actually meant.

Retries without jitter turned a short blip into a synchronised wave of traffic. I wrote a short runbook so the next incident starts with steps instead of guesses. I kept the old path behind a flag for a week so I could compare both under real traffic. Measuring before and after turned a hunch into a result I could defend. A budget for each page kept the bundle from growing one harmless dependency at a time.

> The configuration file had grown three ways to say the same thing.

Measuring before and after turned a hunch into a result I could defend. Writing the test first forced me to decide what correct behaviour actually meant. The migration ran in batches so it could be paused, resumed and verified at each step.

## Measuring the problem

The configuration file had grown three ways to say the same thing. Every abstraction leaked a little, and the leaks were where the bugs lived. The real constraint was not the CPU but the number of open file descriptors. Moving the work off the request path made the page fast and the queue honest. Retries without jitter turned a short blip into a synchronised wave of traffic. I started with the simplest version that could possibly work and wrote down every assumption.

I started with the simplest version that could possibly work and wrote down every assumption. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Retries without jitter turned a short blip into a synchronised wave of traffic. Every abstraction leaked a little, and the leaks were where the bugs lived.

Every abstraction leaked a little, and the leaks were where the bugs lived. The error only appeared when two requests raced for the same row inside one transaction. Writing the test first forced me to decide what correct behaviour actually meant.

## What I would do differently

The configuration file had grown three ways to say the same thing. The slowest part of the deploy was waiting for a health check that checked nothing. Clear error messages saved more time than any clever optimisation. The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived. A small reproduction in an empty repository removed every distraction from the real problem.

I deleted more code than I added, and the system got faster and easier to read. I started with the simplest version that could possibly work and wrote down every assumption. The error only appeared when two requests raced for the same row inside one transaction. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

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

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Most tools default to settings that are reasonable for a laptop and surprising on a server. The error only appeared when two requests raced for the same row inside one transaction.
