---
title: "Untangling structured logging from first principles"
slug: untangling-structured-logging-from-first-principles
date: 2026-10-22
summary: "Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm."
tags: [devops]
cover: /images/untangling-structured-logging-from-first-principles.webp
---
Logs were useful only after every line carried a request identifier. Small, frequent releases made each change easy to reason about and easy to revert. Reading the source was faster than searching for a blog post that matched my exact version. The error only appeared when two requests raced for the same row inside one transaction.

Moving the work off the request path made the page fast and the queue honest. The first measurement was misleading because the cache was already warm. Logs were useful only after every line carried a request identifier. Most of the latency came from a single synchronous call that nobody remembered adding. The fix itself was three lines; finding where to put them took two days.

## Measuring the problem

The documentation described the happy path well and said nothing about what happens on timeout. Pinning the versions made the build reproducible and the upgrade a deliberate decision. I kept the old path behind a flag for a week so I could compare both under real traffic. I wrote a short runbook so the next incident starts with steps instead of guesses. The slowest part of the deploy was waiting for a health check that checked nothing. Reading the source was faster than searching for a blog post that matched my exact version.

The slowest part of the deploy was waiting for a health check that checked nothing. A small reproduction in an empty repository removed every distraction from the real problem. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. The error only appeared when two requests raced for the same row inside one transaction.

Logs were useful only after every line carried a request identifier. Retries without jitter turned a short blip into a synchronised wave of traffic. The fix itself was three lines; finding where to put them took two days. Every abstraction leaked a little, and the leaks were where the bugs lived.

## What I would do differently

The real constraint was not the CPU but the number of open file descriptors. Clear error messages saved more time than any clever optimisation. The configuration file had grown three ways to say the same thing. Reading the source was faster than searching for a blog post that matched my exact version. Logs were useful only after every line carried a request identifier.

The real constraint was not the CPU but the number of open file descriptors. Most tools default to settings that are reasonable for a laptop and surprising on a server. The slowest part of the deploy was waiting for a health check that checked nothing. I deleted more code than I added, and the system got faster and easier to read. Small, frequent releases made each change easy to reason about and easy to revert.

```sql
SELECT p.slug, count(v.id) AS views
FROM posts p
LEFT JOIN views v ON v.post_id = p.id
  AND v.created_at > now() - interval '7 days'
GROUP BY p.slug
ORDER BY views DESC
LIMIT 10;
```

- Most of the latency came from a single synchronous call that nobody remembered adding.
- Moving the work off the request path made the page fast and the queue honest.
- The benchmark looked impressive until I ran it on the same hardware as production.
- The migration ran in batches so it could be paused, resumed and verified at each step.

A small reproduction in an empty repository removed every distraction from the real problem. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I wrote a short runbook so the next incident starts with steps instead of guesses.

## The first attempt

The benchmark looked impressive until I ran it on the same hardware as production. The fix itself was three lines; finding where to put them took two days. Moving the work off the request path made the page fast and the queue honest. Most of the latency came from a single synchronous call that nobody remembered adding.

Most tools default to settings that are reasonable for a laptop and surprising on a server. Clear error messages saved more time than any clever optimisation. I started with the simplest version that could possibly work and wrote down every assumption.

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

> The benchmark looked impressive until I ran it on the same hardware as production.

The error only appeared when two requests raced for the same row inside one transaction. Moving the work off the request path made the page fast and the queue honest. I kept the old path behind a flag for a week so I could compare both under real traffic. Pinning the versions made the build reproducible and the upgrade a deliberate decision.

## Trade-offs

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. I started with the simplest version that could possibly work and wrote down every assumption. Writing the test first forced me to decide what correct behaviour actually meant. The slowest part of the deploy was waiting for a health check that checked nothing. The migration ran in batches so it could be paused, resumed and verified at each step.

Pinning the versions made the build reproducible and the upgrade a deliberate decision. A small reproduction in an empty repository removed every distraction from the real problem. Reading the source was faster than searching for a blog post that matched my exact version. The slowest part of the deploy was waiting for a health check that checked nothing. Most tools default to settings that are reasonable for a laptop and surprising on a server.

The error only appeared when two requests raced for the same row inside one transaction. I kept the old path behind a flag for a week so I could compare both under real traffic. Small, frequent releases made each change easy to reason about and easy to revert. The migration ran in batches so it could be paused, resumed and verified at each step.
