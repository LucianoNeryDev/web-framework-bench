# Video brief

- **Purpose**: an ~80 s explainer of the benchmark results, for the blog post and social posts after review.
- **Look**: 2D motion graphics in the lucianonery.dev style: background #080a09, accent #a8ff3e, bars #65a30d
  (the accent stepped down to pass contrast checks), Manrope and IBM Plex Mono.
- **Format**: 1920×1080, 30 fps, H.264 + AAC, narration normalised to -16 LUFS.
- **Narration**: ElevenLabs, stock voice "Daniel" (eleven_multilingual_v2), third person; text in
  `narration.json`. Clip lengths set the beat times (`src/beats.ts`); word timings from the
  with-timestamps endpoint time the callouts (`marks.json`).
- **Data**: `src/data.ts`, generated from `../results/summary.json` (cloud run, 2026-11-14).
- **Route**: Revideo 0.11 (Motion Canvas fork), one scene in `src/scenes/main.tsx`.

## Beats

| Start (s) | Beat | On screen |
|---|---|---|
| 0.8 | intro | "Same blog. 13 stacks." and the stack chips |
| 9.1 | setup | the two VMs, packets from load generator to target |
| 19.6 | static | nine static builds at 16,600-18,300 req/s, "≈17,000" |
| 30.2 | server | log-scale bars; Go, Astro, Next.js, WordPress spotlighted as named |
| 47.5 | cache | WordPress bar jumps from 50 to 13,791 |
| 54.3 | browser | JavaScript vs filter-ready scatter; no-framework and Next.js callouts |
| 69.1 | outro | "Prerender. Ship as little JavaScript as you can." then the end card |

## Render

```bash
npm install
DISABLE_TELEMETRY=true npx tsx src/render.ts --out renders/web-framework-bench.mp4
ffmpeg -i renders/web-framework-bench.mp4 -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 192k out.mp4
```
