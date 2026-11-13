---
title: "Debugging rate limiting after a long weekend"
slug: debugging-rate-limiting-after-a-long-weekend
date: 2026-08-02
summary: "Clear error messages saved more time than any clever optimisation. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs."
tags: [javascript, css, security]
cover: /images/debugging-rate-limiting-after-a-long-weekend.webp
---
Most tools default to settings that are reasonable for a laptop and surprising on a server. The slowest part of the deploy was waiting for a health check that checked nothing. Retries without jitter turned a short blip into a synchronised wave of traffic. A small reproduction in an empty repository removed every distraction from the real problem.

The first measurement was misleading because the cache was already warm. Writing the test first forced me to decide what correct behaviour actually meant. The fix itself was three lines; finding where to put them took two days. Logs were useful only after every line carried a request identifier. I kept the old path behind a flag for a week so I could compare both under real traffic.

## What actually fixed it

The migration ran in batches so it could be paused, resumed and verified at each step. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Every abstraction leaked a little, and the leaks were where the bugs lived. The benchmark looked impressive until I ran it on the same hardware as production.

I wrote a short runbook so the next incident starts with steps instead of guesses. Logs were useful only after every line carried a request identifier. Every abstraction leaked a little, and the leaks were where the bugs lived.

```js
export async function retry(fn, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const delay = 2 ** i * 100 + Math.random() * 100;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('retry budget exhausted');
}
```

Logs were useful only after every line carried a request identifier. The fix itself was three lines; finding where to put them took two days. The benchmark looked impressive until I ran it on the same hardware as production. Writing the test first forced me to decide what correct behaviour actually meant. Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.

## Takeaways

The fix itself was three lines; finding where to put them took two days. The profiler pointed at serialisation, which was not where I would have guessed. The error only appeared when two requests raced for the same row inside one transaction. Every abstraction leaked a little, and the leaks were where the bugs lived. Most tools default to settings that are reasonable for a laptop and surprising on a server.

Retries without jitter turned a short blip into a synchronised wave of traffic. The configuration file had grown three ways to say the same thing. Clear error messages saved more time than any clever optimisation.

```bash
set -euo pipefail
for host in $(cat hosts.txt); do
  ssh "$host" 'systemctl is-active app' || echo "$host down"
done
```

- Pinning the versions made the build reproducible and the upgrade a deliberate decision.
- Small, frequent releases made each change easy to reason about and easy to revert.
- Clear error messages saved more time than any clever optimisation.
- The first measurement was misleading because the cache was already warm.

The real constraint was not the CPU but the number of open file descriptors. Logs were useful only after every line carried a request identifier. Retries without jitter turned a short blip into a synchronised wave of traffic.

## Where it started

Logs were useful only after every line carried a request identifier. Retries without jitter turned a short blip into a synchronised wave of traffic. Most of the latency came from a single synchronous call that nobody remembered adding. Pinning the versions made the build reproducible and the upgrade a deliberate decision. A budget for each page kept the bundle from growing one harmless dependency at a time.

Clear error messages saved more time than any clever optimisation. Logs were useful only after every line carried a request identifier. I kept the old path behind a flag for a week so I could compare both under real traffic. The migration ran in batches so it could be paused, resumed and verified at each step. I started with the simplest version that could possibly work and wrote down every assumption.

> The fix itself was three lines; finding where to put them took two days.

The benchmark looked impressive until I ran it on the same hardware as production. Most of the latency came from a single synchronous call that nobody remembered adding. Retries without jitter turned a short blip into a synchronised wave of traffic. Writing the test first forced me to decide what correct behaviour actually meant.

## Trade-offs

The benchmark looked impressive until I ran it on the same hardware as production. I wrote a short runbook so the next incident starts with steps instead of guesses. Most tools default to settings that are reasonable for a laptop and surprising on a server. Every abstraction leaked a little, and the leaks were where the bugs lived. Writing the test first forced me to decide what correct behaviour actually meant.

The error only appeared when two requests raced for the same row inside one transaction. The configuration file had grown three ways to say the same thing. A small reproduction in an empty repository removed every distraction from the real problem. I started with the simplest version that could possibly work and wrote down every assumption.

Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs. Retries without jitter turned a short blip into a synchronised wave of traffic. The error only appeared when two requests raced for the same row inside one transaction. Clear error messages saved more time than any clever optimisation. Reading the source was faster than searching for a blog post that matched my exact version.
