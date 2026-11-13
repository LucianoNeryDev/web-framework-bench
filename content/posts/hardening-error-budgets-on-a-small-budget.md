---
title: "Hardening error budgets on a small budget"
slug: hardening-error-budgets-on-a-small-budget
date: 2026-08-22
summary: "Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I started with the simplest version that could possibly work and wrote down every assumption."
tags: [rust, devops]
cover: /images/hardening-error-budgets-on-a-small-budget.webp
---
Moving the work off the request path made the page fast and the queue honest. I kept the old path behind a flag for a week so I could compare both under real traffic. I wrote a short runbook so the next incident starts with steps instead of guesses. Most tools default to settings that are reasonable for a laptop and surprising on a server.

Clear error messages saved more time than any clever optimisation. Measuring before and after turned a hunch into a result I could defend. The slowest part of the deploy was waiting for a health check that checked nothing. I wrote a short runbook so the next incident starts with steps instead of guesses. I started with the simplest version that could possibly work and wrote down every assumption.

## Measuring the problem

I wrote a short runbook so the next incident starts with steps instead of guesses. Logs were useful only after every line carried a request identifier. Every abstraction leaked a little, and the leaks were where the bugs lived. Writing the test first forced me to decide what correct behaviour actually meant. Most tools default to settings that are reasonable for a laptop and surprising on a server.

Most of the latency came from a single synchronous call that nobody remembered adding. I started with the simplest version that could possibly work and wrote down every assumption. Writing the test first forced me to decide what correct behaviour actually meant.

The benchmark looked impressive until I ran it on the same hardware as production. I wrote a short runbook so the next incident starts with steps instead of guesses. I kept the old path behind a flag for a week so I could compare both under real traffic.

## Trade-offs

Most tools default to settings that are reasonable for a laptop and surprising on a server. I started with the simplest version that could possibly work and wrote down every assumption. The configuration file had grown three ways to say the same thing. Reading the source was faster than searching for a blog post that matched my exact version. Logs were useful only after every line carried a request identifier. The real constraint was not the CPU but the number of open file descriptors.

Measuring before and after turned a hunch into a result I could defend. The real constraint was not the CPU but the number of open file descriptors. Reading the source was faster than searching for a blog post that matched my exact version.

- The fix itself was three lines; finding where to put them took two days.
- Moving the work off the request path made the page fast and the queue honest.
- The first measurement was misleading because the cache was already warm.
- The configuration file had grown three ways to say the same thing.

Logs were useful only after every line carried a request identifier. The real constraint was not the CPU but the number of open file descriptors. Most tools default to settings that are reasonable for a laptop and surprising on a server. Measuring before and after turned a hunch into a result I could defend. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Takeaways

The profiler pointed at serialisation, which was not where I would have guessed. The configuration file had grown three ways to say the same thing. The error only appeared when two requests raced for the same row inside one transaction. Most of the latency came from a single synchronous call that nobody remembered adding. Most tools default to settings that are reasonable for a laptop and surprising on a server. The benchmark looked impressive until I ran it on the same hardware as production.

Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm. A budget for each page kept the bundle from growing one harmless dependency at a time.

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

> Pinning the versions made the build reproducible and the upgrade a deliberate decision.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. A small reproduction in an empty repository removed every distraction from the real problem. I deleted more code than I added, and the system got faster and easier to read.

## The first attempt

Retries without jitter turned a short blip into a synchronised wave of traffic. Measuring before and after turned a hunch into a result I could defend. The slowest part of the deploy was waiting for a health check that checked nothing. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The benchmark looked impressive until I ran it on the same hardware as production. Most tools default to settings that are reasonable for a laptop and surprising on a server.

Measuring before and after turned a hunch into a result I could defend. The documentation described the happy path well and said nothing about what happens on timeout. The error only appeared when two requests raced for the same row inside one transaction. Reading the source was faster than searching for a blog post that matched my exact version. Clear error messages saved more time than any clever optimisation.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

Logs were useful only after every line carried a request identifier. The configuration file had grown three ways to say the same thing. The slowest part of the deploy was waiting for a health check that checked nothing. I deleted more code than I added, and the system got faster and easier to read.
