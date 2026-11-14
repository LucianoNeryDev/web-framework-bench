// Aggregate results/raw into results/summary.json and docs/results.md.
//   node bench/report.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadResult } from "./lib.mjs";
import { targets } from "./targets.mjs";

const effortFile = join(ROOT, "results", "effort.json");
const effort = existsSync(effortFile) ? JSON.parse(readFileSync(effortFile, "utf8")) : {};

const get = (o, path) => path.split(".").reduce((v, k) => (v == null ? v : v[k]), o);
const fmt = (v, digits = 0) => (v == null || Number.isNaN(v) ? "–" : typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits }) : String(v));

const rows = targets.map((t) => {
  const r = Object.fromEntries(["conformance", "build", "load", "lighthouse", "interact", "robust", "code"].map((p) => [p, loadResult(t.id, p)]));
  const shared = (phase) => (r[phase]?.sharedWith ? loadResult(targets.find((x) => x.app === r[phase].sharedWith && !x.buildShared)?.id, phase) : r[phase]);
  return { t, ...r, build: shared("build"), code: shared("code"), effort: effort[t.app] ?? null };
}).filter((row) => row.conformance || row.load || row.build);

const summary = rows.map(({ t, conformance, build, load, lighthouse, interact, robust, code, effort }) => ({
  id: t.id, app: t.app, label: t.label, mode: t.mode,
  conformance: conformance && `${conformance.passed}/${conformance.total}`,
  build: build && { coldSeconds: build.coldBuildSeconds, installSeconds: build.installSeconds, buildSeconds: build.buildSeconds, imageMB: build.imageMB, outputKB: build.outputKB, outputJsKB: build.outputJsKB },
  start: load && { coldStartMs: load.coldStartMs, restartMs: load.restartMs, idleMemMB: load.idleMemMB, afterLoadMemMB: load.afterLoadMemMB },
  load: load && Object.fromEntries(Object.entries(load.runs).map(([k, v]) => [k, { rps: v.rps, p50: v.p50, p99: v.p99, errors: v.errors, non2xx: Object.entries(v.status).filter(([c]) => !c.startsWith("2") && !k.startsWith("notFound")).reduce((a, [, n]) => a + n, 0), cpuCores: v.cpuCores, memPeakMB: v.memPeakMB }])),
  lighthouse: lighthouse && Object.fromEntries(Object.entries(lighthouse.pages).map(([k, v]) => [k, (({ runs, ...rest }) => rest)(v)])),
  interact: interact?.summary ?? null,
  robust: robust && { probes: robust.probeSummary, overload: robust.overload && { successRate: robust.overload.successRate, rps: robust.overload.rps, p99: robust.overload.p99, healthyAfter: robust.overload.healthyAfter, memPeakMB: robust.overload.memPeakMB }, soak: robust.soak && { rps: robust.soak.rps, errors: robust.soak.errors, memStartMB: robust.soak.memStartMB, memEndMB: robust.soak.memEndMB, memGrowthMB: robust.soak.memGrowthMB }, crash: robust.crash, dbOutage: robust.dbOutage ?? null },
  code: code && { lines: code.source.lines, files: code.source.files, directDeps: code.dependencies.direct, transitiveDeps: code.dependencies.transitive, npmAudit: code.npmAudit, trivy: code.trivy },
  effort,
}));
writeFileSync(join(ROOT, "results", "summary.json"), JSON.stringify(summary, null, 2) + "\n");

// --- markdown ---------------------------------------------------------------------------------

const table = (headers, data) =>
  [`| ${headers.join(" | ")} |`, `|${headers.map((h, i) => (i === 0 ? "---" : "---:")).join("|")}|`, ...data.map((r) => `| ${r.join(" | ")} |`)].join("\n");

const s = (id) => summary.find((x) => x.id === id);
const by = (f) => [...summary].sort((a, b) => (f(b) ?? -Infinity) - (f(a) ?? -Infinity));

const md = [];
md.push("# Results", "", `Generated ${new Date().toISOString().slice(0, 10)} by \`node bench/report.mjs\` from \`results/raw/\`. How each number is produced: [methodology](methodology.md).`, "");

md.push("## Overview", "");
md.push(table(
  ["Target", "Checks", "Post rps @100", "Post p99 ms @100", "Idle MB", "Lighthouse (post)", "JS KB (/blog)", "Filter ready ms", "Cold build s", "Image MB", "Source lines", "Packages"],
  summary.map((x) => [
    x.label, x.conformance ?? "–",
    fmt(get(x, "load.post@100.rps")), fmt(get(x, "load.post@100.p99"), 1), fmt(get(x, "start.idleMemMB"), 1),
    fmt(get(x, "lighthouse.post.performance")), fmt(get(x, "lighthouse.blog.scriptKB"), 1), fmt(get(x, "interact.filterReadyMs")),
    fmt(get(x, "build.coldSeconds"), 1), fmt(get(x, "build.imageMB")), fmt(get(x, "code.lines")), fmt(get(x, "code.transitiveDeps")),
  ]),
), "");

md.push("## Server throughput and latency", "", "Requests per second and p99 latency (ms) at 10 and 100 concurrent connections, on a 2-vCPU VM. Static targets are nginx serving files.", "");
const routes = ["home", "blog", "post", "filtered", "notFound"];
md.push(table(
  ["Target", ...routes.flatMap((r) => [`${r} rps @10`, `${r} rps @100`, `${r} p99 @100`])],
  by((x) => get(x, "load.post@100.rps")).map((x) => [x.label, ...routes.flatMap((r) => [fmt(get(x, `load.${r}@10.rps`)), fmt(get(x, `load.${r}@100.rps`)), fmt(get(x, `load.${r}@100.p99`), 1)])]),
), "");
md.push(table(
  ["Target", "Cold start ms", "Restart ms", "Idle MB", "Peak MB under load", "CPU cores @100 (post)", "Requests per CPU-second (post @100)"],
  by((x) => get(x, "load.post@100.rps")).map((x) => {
    const rps = get(x, "load.post@100.rps"), cores = get(x, "load.post@100.cpuCores");
    const peak = Math.max(...Object.values(x.load ?? {}).map((v) => v.memPeakMB ?? 0));
    return [x.label, fmt(get(x, "start.coldStartMs")), fmt(get(x, "start.restartMs")), fmt(get(x, "start.idleMemMB"), 1), fmt(peak || null, 1), fmt(cores, 2), fmt(rps && cores ? rps / cores : null)];
  }),
), "");

md.push("## Browser", "", "Lighthouse mobile, median of three runs, through the shared gzip edge.", "");
for (const page of ["home", "blog", "post"]) {
  md.push(`### ${page === "home" ? "Home" : page === "blog" ? "Blog index" : "Post"}`, "");
  md.push(table(
    ["Target", "Perf", "FCP ms", "LCP ms", "TBT ms", "CLS", "JS KB", "Total KB", "Requests", "Boot-up ms", "A11y", "SEO", "Best practices"],
    by((x) => get(x, `lighthouse.${page}.performance`)).map((x) => {
      const l = get(x, `lighthouse.${page}`) ?? {};
      return [x.label, fmt(l.performance), fmt(l.fcp), fmt(l.lcp), fmt(l.tbt), fmt(l.cls, 3), fmt(l.scriptKB, 1), fmt(l.totalKB, 1), fmt(l.requests), fmt(l.bootupMs), fmt(l.accessibility), fmt(l.seo), fmt(l.bestPractices)];
    }),
  ), "");
}
md.push("### Interaction on a throttled phone", "", "Median of five runs: 4x CPU slowdown, 150 ms RTT, 1.6 Mbps.", "");
md.push(table(
  ["Target", "Filter ready ms", "INP proxy ms", "FCP ms", "Load event ms", "Script KB", "Scripts"],
  by((x) => -(get(x, "interact.filterReadyMs") ?? Infinity)).map((x) => {
    const i = x.interact ?? {};
    return [x.label, fmt(i.filterReadyMs), fmt(i.inpMs), fmt(i.fcp), fmt(i.load), fmt(i.scriptBytes != null ? i.scriptBytes / 1024 : null, 1), fmt(i.scriptCount)];
  }),
), "");

md.push("## Robustness", "");
md.push(table(
  ["Target", "Probe 5xx", "Reflected XSS", "Exposed files", "Overload success", "Overload p99 ms", "Healthy after", "Soak errors", "Soak memory growth MB", "Crash recovery ms", "DB down: home / post", "DB recovery ms"],
  summary.map((x) => {
    const r = x.robust;
    if (!r) return [x.label, ...Array(11).fill("–")];
    return [
      x.label, r.probes?.serverErrors?.length ? r.probes.serverErrors.join(", ") : "none", r.probes?.reflectedXss ? "**yes**" : "no",
      r.probes?.exposedFiles?.length ? `**${r.probes.exposedFiles.join(", ")}**` : "none",
      r.overload ? `${fmt(r.overload.successRate * 100, 1)}%` : "–", fmt(r.overload?.p99), r.overload?.healthyAfter ? "yes" : "**no**",
      fmt(r.soak?.errors), fmt(r.soak?.memGrowthMB, 1), fmt(r.crash?.recoveryMs),
      r.dbOutage ? `${r.dbOutage.homeWhileDown} / ${r.dbOutage.postWhileDown}` : "n/a", r.dbOutage ? fmt(r.dbOutage.recoveredWithoutAppRestartMs) : "n/a",
    ];
  }),
), "");

md.push("## Build, code and dependencies", "");
md.push(table(
  ["Target", "Cold build s", "Install s", "Build s", "Image MB", "Output KB", "Output JS KB", "Source lines", "Files", "Direct deps", "Packages", "npm audit (prod) H/C", "Trivy OS H/C", "Trivy lang H/C"],
  summary.filter((x) => x.build || x.code).map((x) => [
    x.label, fmt(get(x, "build.coldSeconds"), 1), fmt(get(x, "build.installSeconds"), 1), fmt(get(x, "build.buildSeconds"), 1), fmt(get(x, "build.imageMB")),
    fmt(get(x, "build.outputKB")), fmt(get(x, "build.outputJsKB"), 1), fmt(get(x, "code.lines")), fmt(get(x, "code.files")), fmt(get(x, "code.directDeps")), fmt(get(x, "code.transitiveDeps")),
    x.code?.npmAudit ? `${x.code.npmAudit.high}/${x.code.npmAudit.critical}` : "n/a",
    x.code?.trivy ? `${x.code.trivy.os.HIGH}/${x.code.trivy.os.CRITICAL}` : "–", x.code?.trivy ? `${x.code.trivy.lang.HIGH}/${x.code.trivy.lang.CRITICAL}` : "–",
  ]),
), "");

if (Object.keys(effort).length) {
  md.push("## Implementation effort (AI agents, see methodology)", "");
  md.push(table(
    ["App", "Wall-clock min", "Build-check-fix iterations", "Deviations", "Main friction"],
    Object.entries(effort).map(([app, e]) => [app, fmt(e.minutes), fmt(e.iterations), e.deviations ?? "–", e.friction ?? "–"]),
  ), "");
}

writeFileSync(join(ROOT, "docs", "results.md"), md.join("\n") + "\n");
console.log(`summary for ${summary.length} targets -> results/summary.json, docs/results.md`);
