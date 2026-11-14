// Measurement harness. Every phase writes results/raw/<target>/<phase>.json.
//
//   node bench/run.mjs <phase> [target|app ...]      targets: see bench/targets.mjs, or "all"
//
// Phases
//   conformance  the contract check (must pass before anything is measured)
//   build        cold image build time, step split, image and output size
//   load         throughput, latency and resource use per route and concurrency; cold start and restart
//   lighthouse   Lighthouse mobile lab metrics through the gzip edge, median of N runs
//   interact     Playwright on a throttled phone profile: time until the filter responds, INP
//   robust       overload, soak, malformed requests, crash recovery, database outage
//   code         source size, dependency counts, known vulnerabilities (npm/composer/go + Trivy image scan)
//   all          every phase above, in order
//
// Environment: WFB_DURATION (s per load run, default 20), WFB_RUNS (Lighthouse/interaction runs, default 3/5),
// WFB_SOAK (s, default 180), WFB_CONCURRENCY (default "10,100").
import { request } from "node:http";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import {
  CLIENT_CPUS, PORT, ROOT, TARGET_CPUS, containersOf, edgeBase, targetBase, log, loadResult, memoryNow, oha, posts, restartTarget, saveResult,
  serviceContainer, sh, shAsync, sleep, startEdge, startSampler, startTarget, stopTarget, waitFor,
} from "./lib.mjs";
import { select } from "./targets.mjs";

// Pin the harness (and the browsers it launches) to the client cores, away from the target.
if (!process.env.WFB_PINNED) {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync("taskset", ["-c", CLIENT_CPUS, process.execPath, ...process.argv.slice(1)], {
    stdio: "inherit", env: { ...process.env, WFB_PINNED: "1" },
  });
  process.exit(r.status ?? 1);
}

const DURATION = Number(process.env.WFB_DURATION || 20);
const CONCURRENCY = (process.env.WFB_CONCURRENCY || "10,100").split(",").map(Number);
const SOAK = Number(process.env.WFB_SOAK || 180);
const POST = `/blog/${posts[0].slug}`;
const ROUTES = {
  home: "/",
  blog: "/blog",
  post: POST,
  filtered: "/blog?q=the&tag=go",
  notFound: "/this-page-does-not-exist",
};
const median = (xs) => {
  const v = xs.filter((x) => x != null && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

// --- conformance ---------------------------------------------------------------------------------

async function conformance(t) {
  await startTarget(t);
  try {
    const out = sh(`node bench/conformance.mjs http://127.0.0.1:${PORT} ${t.server ? "--server" : ""} 2>&1 || true`);
    const last = out.split("\n").at(-1);
    const [passed, total] = last.match(/(\d+)\/(\d+)/).slice(1).map(Number);
    saveResult(t, "conformance", { passed, total, ok: passed === total, failures: out.split("\n").filter((l) => l.startsWith("FAIL")) });
    log(`${t.id}: ${last}`);
  } finally {
    stopTarget(t);
  }
}

// --- build -----------------------------------------------------------------------------------

function parseSteps(plain) {
  const names = {}, durations = {};
  for (const line of plain.split("\n")) {
    let m = line.match(/^#(\d+) \[[^\]]+\] (.+)$/);
    if (m) names[m[1]] = m[2];
    m = line.match(/^#(\d+) DONE ([\d.]+)s$/);
    if (m) durations[m[1]] = Number(m[2]);
  }
  const steps = Object.entries(durations).filter(([id]) => names[id]).map(([id, s]) => ({ step: names[id].slice(0, 120), seconds: s }));
  const isInstall = (s) => /\b(npm (ci|install)|pnpm (install|i)\b|bun install|yarn( install)?\b|composer install|go mod download)/.test(s);
  const isBuild = (s) => /\b(run build|build\b|generate|go build|hugo\b|artisan (optimize|view:cache|config:cache))/.test(s) && !isInstall(s);
  const sum = (f) => +steps.filter((x) => f(x.step)).reduce((a, x) => a + x.seconds, 0).toFixed(1);
  return { steps, installSeconds: sum(isInstall), buildSeconds: sum(isBuild) };
}

async function build(t) {
  if (t.buildShared) return saveResult(t, "build", { sharedWith: t.buildShared });
  const runs = [];
  let result;
  for (let i = 0; i < Number(process.env.WFB_BUILD_RUNS || 1); i++) {
    const t0 = Date.now();
    let out;
    if (t.kind === "image") {
      out = await shAsync(`docker build --no-cache --progress=plain -f ${t.dockerfile} ${t.buildTarget ? `--target ${t.buildTarget}` : ""} -t ${t.image} . 2>&1`);
    } else {
      out = await shAsync(`docker compose -p wfb-${t.id} -f ${t.compose} --progress plain build --no-cache 2>&1`, { env: { ...t.env, WFB_PORT: String(PORT) } });
    }
    runs.push((Date.now() - t0) / 1000);
    result = parseSteps(out);
  }
  const images = t.kind === "image"
    ? [t.image]
    : sh(`docker compose -p wfb-${t.id} -f ${t.compose} config --images`, { env: { ...t.env, WFB_PORT: String(PORT) } }).split("\n").filter(Boolean);
  const imageMB = +(images.reduce((s, img) => s + Number(sh(`docker image inspect -f '{{.Size}}' ${img}`, { allowFail: true }) || 0), 0) / 2 ** 20).toFixed(1);
  let outputKB = null, outputJsKB = null;
  if (t.mode === "static") {
    const shared = Number(sh(`du -sb shared/public | cut -f1`));
    const total = Number(sh(`docker run --rm --entrypoint sh ${t.image} -c 'du -sb /usr/share/nginx/html | cut -f1'`));
    outputKB = +((total - shared) / 1024).toFixed(1);
    outputJsKB = +(Number(sh(`docker run --rm --entrypoint sh ${t.image} -c "find /usr/share/nginx/html -name '*.js' ! -path '*/app.js' -exec cat {} + | wc -c"`)) / 1024).toFixed(1);
  }
  saveResult(t, "build", {
    coldBuildSeconds: +median(runs).toFixed(1), runs, installSeconds: result.installSeconds, buildSeconds: result.buildSeconds,
    steps: result.steps, images, imageMB, outputKB, outputJsKB,
  });
  log(`${t.id}: cold build ${median(runs).toFixed(1)}s, image ${imageMB} MB`);
}

// --- load ------------------------------------------------------------------------------------

async function load(t) {
  const start = await startTarget(t);
  try {
    const containers = containersOf(t);
    await sleep(5000);
    const idleMemMB = +(memoryNow(containers) / 2 ** 20).toFixed(1);
    const runs = {};
    for (const [name, path] of Object.entries(ROUTES)) {
      await oha(t, path, { concurrency: 10, seconds: 5 }); // warm up this route (JIT, opcache, template caches)
      for (const c of CONCURRENCY) {
        const sampler = startSampler(containers);
        const r = await oha(t, path, { concurrency: c, seconds: DURATION });
        runs[`${name}@${c}`] = { route: path, concurrency: c, ...r, ...sampler.stop() };
        log(`${t.id} ${name}@${c}: ${r.rps} rps, p50 ${r.p50} ms, p99 ${r.p99} ms, errors ${r.errors}, non-2xx ${JSON.stringify(r.status)}`);
        await sleep(2000);
      }
    }
    const afterLoadMemMB = +(memoryNow(containers) / 2 ** 20).toFixed(1);
    const restartMs = await restartTarget(t);
    saveResult(t, "load", { ...start, restartMs, idleMemMB, afterLoadMemMB, durationSeconds: DURATION, runs });
  } finally {
    stopTarget(t);
  }
}

// --- lighthouse ------------------------------------------------------------------------------

function chromePath() {
  const base = join(process.env.HOME, ".cache/ms-playwright");
  const dirs = sh(`ls -d ${base}/chromium-* 2>/dev/null | sort -V`).split("\n").filter(Boolean);
  for (const d of dirs.reverse()) {
    for (const p of ["chrome-linux64/chrome", "chrome-linux/chrome"]) if (existsSync(join(d, p))) return join(d, p);
  }
  throw new Error("no Playwright Chromium found; run `npx playwright install chromium` in bench/");
}

async function lighthouse(t) {
  const { default: lh } = await import("lighthouse");
  const chromeLauncher = await import("chrome-launcher");
  await startTarget(t);
  await startEdge();
  const runsPerPage = Number(process.env.WFB_RUNS || 3);
  const pages = { home: "/", blog: "/blog", post: POST };
  const result = {};
  try {
    for (const [name, path] of Object.entries(pages)) {
      const url = `${edgeBase()}${path}`;
      await fetch(url).then((r) => r.arrayBuffer()); // warm the server
      const runs = [];
      for (let i = -1; i < runsPerPage; i++) { // run -1 warms Chrome and the server and is discarded
        const chrome = await chromeLauncher.launch({ chromePath: chromePath(), chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"], maxConnectionPollTries: 240, connectionPollInterval: 500 });
        try {
          const { lhr } = await lh(url, { port: chrome.port, output: "json", logLevel: "error" });
          const a = lhr.audits;
          const reqs = a["network-requests"]?.details?.items ?? [];
          const byType = (type) => reqs.filter((r) => r.resourceType === type).reduce((s, r) => s + (r.transferSize || 0), 0);
          if (i >= 0) runs.push({
            performance: lhr.categories.performance?.score * 100,
            accessibility: lhr.categories.accessibility?.score * 100,
            bestPractices: lhr.categories["best-practices"]?.score * 100,
            seo: lhr.categories.seo?.score * 100,
            fcp: a["first-contentful-paint"]?.numericValue,
            lcp: a["largest-contentful-paint"]?.numericValue,
            tbt: a["total-blocking-time"]?.numericValue,
            cls: a["cumulative-layout-shift"]?.numericValue,
            si: a["speed-index"]?.numericValue,
            tti: a["interactive"]?.numericValue ?? null,
            totalKB: a["total-byte-weight"]?.numericValue / 1024,
            scriptKB: byType("Script") / 1024,
            documentKB: byType("Document") / 1024,
            requests: reqs.length,
            scriptRequests: reqs.filter((r) => r.resourceType === "Script").length,
            bootupMs: a["bootup-time"]?.numericValue,
            mainThreadMs: a["mainthread-work-breakdown"]?.numericValue,
            domSize: a["dom-size"]?.numericValue ?? a["dom-size-insight"]?.numericValue ?? null,
            lighthouseVersion: lhr.lighthouseVersion,
          });
        } finally {
          await chrome.kill();
        }
      }
      const keys = Object.keys(runs[0]).filter((k) => typeof runs[0][k] === "number");
      result[name] = Object.fromEntries(keys.map((k) => [k, +median(runs.map((r) => r[k])).toFixed(k === "cls" ? 4 : 1)]));
      result[name].lighthouseVersion = runs[0].lighthouseVersion;
      result[name].runs = runs;
      log(`${t.id} ${name}: perf ${result[name].performance}, LCP ${result[name].lcp} ms, TBT ${result[name].tbt} ms, JS ${result[name].scriptKB} KB`);
    }
    saveResult(t, "lighthouse", { runsPerPage, formFactor: "mobile (Lighthouse default, simulated throttling)", pages: result });
  } finally {
    stopTarget(t);
  }
}

// --- interaction -----------------------------------------------------------------------------

async function interact(t) {
  const { chromium } = await import("playwright");
  await startTarget(t);
  await startEdge();
  const runs = Number(process.env.WFB_RUNS || 5);
  const goCount = posts.filter((p) => p.tags.includes("go")).length;
  const browser = await chromium.launch({ headless: true });
  const samples = [];
  try {
    for (let i = 0; i < runs; i++) {
      const context = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75 });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await page.addInitScript(() => {
        window.__events = [];
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (e.interactionId) window.__events.push({ id: e.interactionId, d: e.duration, n: e.name });
        }).observe({ type: "event", durationThreshold: 16, buffered: true });
      });

      // Time until the blog filter responds: click the "Go" chip until the list shows only Go posts.
      // Some islands filter through the server (htmx, React Router loaders), so after each click wait for the
      // fetch/XHR requests that click started before clicking again; re-clicking would cancel them.
      const xhr = new Map();
      const isXhr = (r) => ["fetch", "xhr"].includes(r.resourceType());
      page.on("request", (r) => isXhr(r) && xhr.set(r, Date.now()));
      page.on("requestfinished", (r) => xhr.delete(r));
      page.on("requestfailed", (r) => xhr.delete(r));
      await page.goto(`${edgeBase()}/blog`, { waitUntil: "commit" });
      let readyMs = null;
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline) {
        const clickedAt = Date.now();
        readyMs = await page.evaluate((want) => {
          const chip = [...document.querySelectorAll(".tag-filter .chip")].find((c) => c.textContent.trim() === "Go");
          const visible = [...document.querySelectorAll("[data-post-list] .card")].filter((c) => c.offsetParent !== null).length;
          if (chip && visible === want && chip.getAttribute("aria-pressed") === "true") return performance.now();
          chip?.click();
          return null;
        }, goCount).catch(() => null);
        if (readyMs != null) break;
        await sleep(100);
        const started = () => [...xhr.values()].some((t) => t >= clickedAt - 5);
        if (started()) {
          while (started() && Date.now() < deadline) await sleep(25);
          await sleep(100); // let the response render before checking again
        }
      }
      await page.waitForLoadState("networkidle").catch(() => {});
      const nav = await page.evaluate(() => {
        const n = performance.getEntriesByType("navigation")[0];
        const paint = Object.fromEntries(performance.getEntriesByType("paint").map((p) => [p.name, p.startTime]));
        const scripts = performance.getEntriesByType("resource").filter((r) => r.initiatorType === "script" || r.name.endsWith(".js"));
        return {
          domContentLoaded: n.domContentLoadedEventEnd, load: n.loadEventEnd, fcp: paint["first-contentful-paint"] ?? null,
          scriptBytes: scripts.reduce((s, r) => s + (r.transferSize || 0), 0), scriptCount: scripts.length,
        };
      });

      // INP proxy: a short scripted session of the interactions the page offers.
      await page.evaluate(() => (window.__events = []));
      await page.click('.tag-filter .chip:text-is("All")');
      await page.click("#q");
      await page.keyboard.type("cache", { delay: 120 });
      await page.fill("#q", "");
      for (const chip of ["Rust", "DevOps", "All"]) await page.click(`.tag-filter .chip:text-is("${chip}")`);
      await page.click("button.theme-toggle");
      await sleep(1000);
      const events = await page.evaluate(() => window.__events);
      const perInteraction = {};
      for (const e of events) perInteraction[e.id] = Math.max(perInteraction[e.id] || 0, e.d);
      const durations = Object.values(perInteraction);
      samples.push({ filterReadyMs: readyMs, ...nav, inpMs: durations.length ? Math.max(...durations) : 0, interactions: durations.length });
      await context.close();
    }
  } finally {
    await browser.close();
    stopTarget(t);
  }
  const keys = Object.keys(samples[0]);
  const summary = Object.fromEntries(keys.map((k) => [k, median(samples.map((s) => s[k]))]));
  saveResult(t, "interact", { profile: "412x823, 4x CPU slowdown, 150 ms RTT, 1.6 Mbps down", runs, summary, samples });
  log(`${t.id}: filter ready ${summary.filterReadyMs?.toFixed(0)} ms, INP ${summary.inpMs?.toFixed(0)} ms, JS ${(summary.scriptBytes / 1024).toFixed(1)} KB`);
}

// --- robustness ------------------------------------------------------------------------------

function rawRequest(method, path, headers = {}) {
  return new Promise((resolve) => {
    const req = request({ host: "127.0.0.1", port: PORT, method, path, headers, timeout: 15_000 }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (d) => (body += d.length + body.length < 2e6 ? d : ""));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("timeout", () => { req.destroy(); resolve({ status: "timeout", body: "" }); });
    req.on("error", (e) => resolve({ status: `error:${e.code}`, body: "" }));
    req.end();
  });
}

const PROBES = [
  ["traversal-encoded", "GET", "/blog/%2e%2e/%2e%2e/%2e%2e/etc/passwd"],
  ["traversal-slash", "GET", "/..%2f..%2f..%2fetc%2fpasswd"],
  ["null-byte", "GET", "/blog/%00"],
  ["invalid-utf8", "GET", "/blog/%ff%fe"],
  // Breaks out of an attribute or lands in text: either way an unescaped `"><script>` is exploitable. A bare
  // <script> inside a quoted attribute value is inert, so the payload must try to close the attribute first.
  ["xss-query", "GET", "/blog?q=x%22%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E"],
  ["array-param", "GET", "/blog?tag[]=go&q[]=x"],
  ["long-query", "GET", `/blog?q=${"a".repeat(6000)}`],
  ["long-path", "GET", `/${"a".repeat(9000)}`],
  ["huge-cookie", "GET", "/", { Cookie: `x=${"a".repeat(16_000)}` }],
  ["head", "HEAD", "/"],
  ["post-page", "POST", "/blog"],
  ["options", "OPTIONS", "/"],
  ["delete", "DELETE", "/about"],
  ["trailing-slash", "GET", "/blog/"],
  ["uppercase", "GET", "/BLOG"],
  ["dotenv", "GET", "/.env"],
  ["git-config", "GET", "/.git/config"],
  ["package-json", "GET", "/package.json"],
  ["composer-json", "GET", "/composer.json"],
  ["server-source", "GET", "/server.js"],
];

async function robust(t) {
  await startTarget(t);
  const out = {};
  try {
    const containers = containersOf(t);

    // 1. Malformed and hostile requests: no 5xx, no reflected script, no source or secret exposure.
    out.probes = [];
    for (const [name, method, path, headers] of PROBES) {
      const r = await rawRequest(method, path, headers);
      const reflected = name === "xss-query" && r.body.includes('"><script>alert(1)</script>');
      const exposed = ["dotenv", "git-config", "package-json", "composer-json", "server-source"].includes(name) && r.status === 200 && !/<html/i.test(r.body);
      out.probes.push({ name, method, status: r.status, serverError: typeof r.status !== "number" || r.status >= 500, reflected, exposed });
    }
    out.probeSummary = {
      serverErrors: out.probes.filter((p) => p.serverError).map((p) => `${p.name}:${p.status}`),
      reflectedXss: out.probes.some((p) => p.reflected),
      exposedFiles: out.probes.filter((p) => p.exposed).map((p) => p.name),
    };
    log(`${t.id} probes: ${JSON.stringify(out.probeSummary)}`);
    if (process.env.WFB_ROBUST_STEPS === "probes") {
      // Re-run only the probes and keep the other robustness results.
      saveResult(t, "robust", { ...(loadResult(t.id, "robust") ?? {}), probes: out.probes, probeSummary: out.probeSummary });
      return;
    }

    // 2. Overload: 1000 concurrent connections on a post page.
    {
      const sampler = startSampler(containers);
      const r = await oha(t, POST, { concurrency: 1000, seconds: 15 });
      out.overload = { ...r, ...sampler.stop() };
      const alive = await rawRequest("GET", "/");
      out.overload.healthyAfter = alive.status === 200;
      log(`${t.id} overload: ${r.rps} rps, success ${r.successRate}, p99 ${r.p99} ms`);
    }

    // 3. Soak: every page in rotation at moderate load; watch memory.
    {
      const urls = [...["/", "/blog", "/about", "/blog?q=cache"], ...posts.map((p) => `/blog/${p.slug}`)].map((p) => `${targetBase(t)}${p}`);
      writeFileSync(join(ROOT, "results/tmp/soak-urls.txt"), urls.join("\n") + "\n", { mode: 0o644 });
      const memStart = memoryNow(containers);
      const sampler = startSampler(containers, 1000);
      const r = await oha(t, null, { concurrency: 50, seconds: SOAK, urlsFile: join(ROOT, "results/tmp/soak-urls.txt") });
      const s = sampler.stop();
      out.soak = { seconds: SOAK, ...r, ...s, memStartMB: +(memStart / 2 ** 20).toFixed(1), memGrowthMB: +(s.memEndMB - memStart / 2 ** 20).toFixed(1) };
      log(`${t.id} soak: ${r.rps} rps, errors ${r.errors}, memory ${out.soak.memStartMB} -> ${s.memEndMB} MB`);
    }

    // 4. Crash: SIGKILL the application container, start it again, time until / is 200.
    {
      const victim = serviceContainer(t, t.appService ?? null);
      sh(`docker kill -s KILL ${victim} >/dev/null`);
      const during = await rawRequest("GET", "/");
      const t0 = Date.now();
      sh(`docker start ${victim} >/dev/null`);
      if (t.kind === "image") sh(`docker update --cpuset-cpus ${TARGET_CPUS} ${victim} >/dev/null`, { allowFail: true });
      // Recovery is checked on a cache-busting URL: a page cache answering from memory is not a recovered backend.
      await waitFor(`http://127.0.0.1:${PORT}/?wfb-recovery=${Date.now()}`, { timeout: 300_000 });
      out.crash = { statusWhileDown: during.status, recoveryMs: Date.now() - t0 };
      log(`${t.id} crash: while down ${during.status}, recovered in ${out.crash.recoveryMs} ms`);
    }

    // 5. Database outage, for targets that have one.
    if (t.db) {
      const db = serviceContainer(t, t.db);
      sh(`docker stop -t 5 ${db} >/dev/null`);
      await sleep(2000);
      const home = await rawRequest("GET", "/");
      const post = await rawRequest("GET", POST);
      const t0 = Date.now();
      sh(`docker start ${db} >/dev/null`);
      let recoveredMs = null;
      try { await waitFor(`http://127.0.0.1:${PORT}${POST}?wfb-recovery=${Date.now()}`, { timeout: 180_000 }); recoveredMs = Date.now() - t0; } catch {}
      out.dbOutage = { homeWhileDown: home.status, postWhileDown: post.status, recoveredWithoutAppRestartMs: recoveredMs };
      log(`${t.id} db outage: / ${home.status}, post ${post.status}, recovered ${recoveredMs} ms`);
    }
    saveResult(t, "robust", out);
  } finally {
    stopTarget(t);
  }
}

// --- code ------------------------------------------------------------------------------------

const LOCKFILES = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "composer.lock", "go.sum"]);
const SKIP = (f) => LOCKFILES.has(basename(f)) || /\.lock$/.test(f) || /\.min\.(js|css)$/.test(f) || /(^|\/)(NOTES|README)\.md$/.test(f) || /\.(webp|png|jpg|ico|svg|woff2?)$/.test(f);

function sourceStats(app) {
  const files = sh(`git ls-files -co --exclude-standard apps/${app}`).split("\n").filter(Boolean).filter((f) => !SKIP(f) && existsSync(join(ROOT, f)));
  const byExt = {};
  let lines = 0;
  for (const f of files) {
    if (statSync(join(ROOT, f)).size > 2e6) continue;
    const n = readFileSync(join(ROOT, f), "utf8").split("\n").filter((l) => l.trim()).length;
    const ext = extname(f) || basename(f);
    byExt[ext] = (byExt[ext] || 0) + n;
    lines += n;
  }
  return { files: files.length, lines, byExt };
}

function dependencyStats(app) {
  const dir = join(ROOT, "apps", app);
  const r = { direct: 0, transitive: 0, ecosystems: [] };
  const findAll = (name) => sh(`find ${dir} -name ${name} -not -path '*/node_modules/*' -not -path '*/vendor/*'`).split("\n").filter(Boolean);
  for (const f of findAll("package.json")) {
    const p = JSON.parse(readFileSync(f, "utf8"));
    r.direct += Object.keys(p.dependencies || {}).length + Object.keys(p.devDependencies || {}).length;
  }
  for (const f of findAll("package-lock.json")) {
    r.transitive += Object.keys(JSON.parse(readFileSync(f, "utf8")).packages || {}).filter((k) => k).length;
    r.ecosystems.push("npm");
  }
  for (const f of findAll("pnpm-lock.yaml")) {
    const text = readFileSync(f, "utf8");
    const section = text.split(/^packages:\s*$/m)[1]?.split(/^snapshots:\s*$/m)[0] ?? "";
    r.transitive += (section.match(/^ {2}\S.*:$/gm) || []).length;
    r.ecosystems.push("pnpm");
  }
  for (const f of findAll("composer.json")) {
    const c = JSON.parse(readFileSync(f, "utf8"));
    r.direct += Object.keys({ ...c.require, ...c["require-dev"] }).filter((k) => k !== "php" && !k.startsWith("ext-")).length;
  }
  for (const f of findAll("composer.lock")) {
    const c = JSON.parse(readFileSync(f, "utf8"));
    r.transitive += (c.packages || []).length + (c["packages-dev"] || []).length;
    r.ecosystems.push("composer");
  }
  for (const f of findAll("go.mod")) {
    r.direct += (readFileSync(f, "utf8").match(/^\s+\S+ v\S+(?! \/\/ indirect)$/gm) || []).length;
    r.ecosystems.push("go");
  }
  for (const f of findAll("go.sum")) {
    r.transitive += new Set(readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => l.split(" ")[0])).size;
  }
  return r;
}

async function npmAudit(app) {
  const dir = join(ROOT, "apps", app);
  const locks = sh(`find ${dir} -name package-lock.json -not -path '*/node_modules/*'`).split("\n").filter(Boolean);
  if (!locks.length) return null;
  const totals = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
  for (const lock of locks) {
    const out = sh(`cd ${join(lock, "..")} && npm audit --omit=dev --json 2>/dev/null || true`);
    const v = JSON.parse(out || "{}").metadata?.vulnerabilities || {};
    for (const k of Object.keys(totals)) totals[k] += v[k] || 0;
  }
  return totals;
}

function trivy(images) {
  const totals = { os: { HIGH: 0, CRITICAL: 0 }, lang: { HIGH: 0, CRITICAL: 0 } };
  for (const img of images) {
    const out = sh(`docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v wfb-trivy-cache:/root/.cache aquasec/trivy:0.76.2 ` +
      `image --quiet --format json --scanners vuln --severity HIGH,CRITICAL ${img}`, { allowFail: true, timeout: 20 * 60_000 });
    if (!out) { totals.errors = [...(totals.errors || []), img]; continue; }
    for (const res of JSON.parse(out).Results || []) {
      const cls = res.Class === "os-pkgs" ? "os" : "lang";
      for (const v of res.Vulnerabilities || []) totals[cls][v.Severity] = (totals[cls][v.Severity] || 0) + 1;
    }
  }
  return totals;
}

async function code(t) {
  if (t.buildShared) return saveResult(t, "code", { sharedWith: t.buildShared });
  const images = loadResult(t.id, "build")?.images ?? [t.image];
  const data = {
    source: sourceStats(t.app),
    dependencies: dependencyStats(t.app),
    npmAudit: await npmAudit(t.app),
    trivy: trivy(images),
  };
  saveResult(t, "code", data);
  log(`${t.id}: ${data.source.lines} lines, ${data.dependencies.transitive} packages, trivy ${JSON.stringify(data.trivy)}`);
}

// --- main ------------------------------------------------------------------------------------

const PHASES = { conformance, build, load, lighthouse, interact, robust, code };
const [phase, ...ids] = process.argv.slice(2);
if (!phase || !(phase in PHASES || phase === "all")) {
  console.error(`usage: node bench/run.mjs <${Object.keys(PHASES).join("|")}|all> [target ...]`);
  process.exit(2);
}
const list = select(ids);
const phases = phase === "all" ? ["conformance", "build", "load", "lighthouse", "interact", "robust", "code"] : [phase];
let failed = 0;
for (const t of list) {
  for (const p of phases) {
    if (p !== "conformance" && p !== "build" && p !== "code" && loadResult(t.id, "conformance")?.ok === false && !process.env.WFB_FORCE) {
      log(`${t.id}: skipping ${p}, conformance failed (set WFB_FORCE=1 to override)`);
      continue;
    }
    try {
      log(`${t.id}: ${p}`);
      await PHASES[p](t);
    } catch (e) {
      failed++;
      log(`${t.id}: ${p} failed: ${e.message.split("\n").slice(0, 3).join(" | ")}`);
      try { stopTarget(t); } catch {}
    }
  }
}
process.exit(failed ? 1 : 0);
