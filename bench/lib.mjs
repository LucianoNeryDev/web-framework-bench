// Shared harness helpers: shell, container lifecycle, cgroup sampling, result files.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const RESULTS = join(ROOT, "results", "raw");
export const PORT = 18999; // target, published on the host
export const EDGE_PORT = 18998; // gzip edge proxy in front of the target, for browser measurements
export const NET = "wfb-bench";
export const RUN = "wfb-run"; // container name / network alias of the target entry point
export const EDGE = "wfb-edge";
// The target gets two dedicated cores; load generators and browsers run on the others.
export const TARGET_CPUS = process.env.WFB_TARGET_CPUS || "0,1";
export const CLIENT_CPUS = process.env.WFB_CLIENT_CPUS || "4-7";
export const TARGET_MEM = process.env.WFB_TARGET_MEM || "1g";
export const OHA = process.env.WFB_OHA_IMAGE || "ghcr.io/hatoo/oha:latest";

export const posts = JSON.parse(readFileSync(join(ROOT, "content/posts.json"), "utf8")).posts;
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const log = (...a) => console.error(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

export function sh(cmd, { env, allowFail = false, timeout = 30 * 60_000, cwd = ROOT } = {}) {
  try {
    return execFileSync("bash", ["-c", cmd], {
      cwd, env: { ...process.env, ...env }, encoding: "utf8", timeout, maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (e) {
    if (allowFail) return null;
    throw new Error(`command failed: ${cmd}\n${e.stderr || e.message}`);
  }
}

/** Run a command, capturing output, without blocking the event loop (so samplers keep running). */
export function shAsync(cmd, { env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", cmd], { cwd: ROOT, env: { ...process.env, ...env } });
    let out = "", err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", (code) => (code === 0 ? resolve(out.trim()) : reject(new Error(`exit ${code}: ${cmd}\n${err}`))));
  });
}

export function saveResult(target, phase, data) {
  const dir = join(RESULTS, target.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${phase}.json`), JSON.stringify({ target: target.id, phase, at: new Date().toISOString(), ...data }, null, 2) + "\n");
}

export function loadResult(id, phase) {
  const file = join(RESULTS, id, `${phase}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}

const envFlags = (env) => Object.entries(env || {}).map(([k, v]) => `-e ${k}=${JSON.stringify(v)}`).join(" ");
const composeEnv = (t) => ({ ...t.env, WFB_PORT: String(PORT) });
const composeCmd = (t) => `docker compose -p wfb-${t.id} -f ${t.compose}`;

export function ensureNetwork() {
  sh(`docker network inspect ${NET} >/dev/null 2>&1 || docker network create ${NET} >/dev/null`);
}

export async function waitFor(url, { timeout = 180_000, status = 200 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      await res.arrayBuffer();
      if (res.status === status) return Date.now() - start;
    } catch {}
    await sleep(50);
  }
  throw new Error(`timed out waiting for ${url}`);
}

/** Container names that belong to a running target. */
export function containersOf(t) {
  if (t.kind === "image") return [RUN];
  return sh(`${composeCmd(t)} ps -q`, { env: composeEnv(t) }).split("\n").filter(Boolean)
    .map((id) => sh(`docker inspect -f '{{.Name}}' ${id}`).replace(/^\//, ""));
}

export function serviceContainer(t, service) {
  if (t.kind === "image") return RUN;
  const id = sh(`${composeCmd(t)} ps -q ${service}`, { env: composeEnv(t) });
  return sh(`docker inspect -f '{{.Name}}' ${id}`).replace(/^\//, "");
}

/** Start a target, pinned to the target cores, and return how long until / answered 200. */
export async function startTarget(t) {
  stopTarget(t);
  ensureNetwork();
  const t0 = Date.now();
  if (t.kind === "image") {
    sh(`docker run -d --name ${RUN} --network ${NET} --network-alias ${RUN} --cpuset-cpus ${TARGET_CPUS} ` +
      `--memory ${TARGET_MEM} --memory-swap ${TARGET_MEM} -p 127.0.0.1:${PORT}:8080 ${envFlags(t.env)} ${t.image}`);
  } else {
    sh(`${composeCmd(t)} up -d --wait --wait-timeout 600`, { env: composeEnv(t), timeout: 15 * 60_000 });
  }
  const readyMs = await waitFor(`http://127.0.0.1:${PORT}/`, { timeout: 600_000 });
  const coldStartMs = Date.now() - t0;
  if (t.kind === "compose") {
    // Same per-container limits as single-image targets; the whole stack shares the target cores.
    for (const c of containersOf(t)) sh(`docker update --cpuset-cpus ${TARGET_CPUS} --memory ${TARGET_MEM} --memory-swap ${TARGET_MEM} ${c} >/dev/null`);
    const entry = serviceContainer(t, t.entry);
    sh(`docker network connect --alias ${RUN} ${NET} ${entry}`, { allowFail: true });
  }
  return { coldStartMs, readyMs };
}

export function stopTarget(t) {
  stopEdge();
  if (t.kind === "image") sh(`docker rm -f ${RUN} >/dev/null 2>&1`, { allowFail: true });
  else sh(`${composeCmd(t)} down -v --remove-orphans >/dev/null 2>&1`, { env: composeEnv(t), allowFail: true });
}

/** Restart the target's containers (data kept) and time until / answers 200 again. */
export async function restartTarget(t) {
  const t0 = Date.now();
  if (t.kind === "image") sh(`docker restart -t 10 ${RUN} >/dev/null`);
  else sh(`${composeCmd(t)} restart -t 10 >/dev/null`, { env: composeEnv(t) });
  await waitFor(`http://127.0.0.1:${PORT}/`, { timeout: 300_000 });
  return Date.now() - t0;
}

const EDGE_CONF = `
server {
  listen 8080;
  gzip on; gzip_comp_level 5; gzip_min_length 256; gzip_vary on; gzip_proxied any;
  gzip_types text/css application/javascript text/javascript application/json image/svg+xml application/xml text/xml application/rss+xml;
  location / {
    proxy_pass http://${RUN}:8080;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto http;
    proxy_set_header Accept-Encoding "";
    proxy_buffering on;
  }
}`;

/** A gzip-compressing nginx in front of the target: every target gets the same "CDN" for browser tests. */
export async function startEdge() {
  stopEdge();
  const conf = join(ROOT, "results", "tmp", "edge.conf");
  mkdirSync(dirname(conf), { recursive: true });
  writeFileSync(conf, EDGE_CONF, { mode: 0o644 });
  sh(`docker run -d --name ${EDGE} --network ${NET} --cpuset-cpus ${CLIENT_CPUS} -p 127.0.0.1:${EDGE_PORT}:8080 ` +
    `-v ${conf}:/etc/nginx/conf.d/default.conf:ro nginx:1.29-alpine`);
  await waitFor(`http://127.0.0.1:${EDGE_PORT}/`);
}

export function stopEdge() {
  sh(`docker rm -f ${EDGE} >/dev/null 2>&1`, { allowFail: true });
}

// --- cgroup sampling -------------------------------------------------------------------------

function cgroupDir(container) {
  const id = sh(`docker inspect -f '{{.Id}}' ${container}`);
  for (const dir of [`/sys/fs/cgroup/system.slice/docker-${id}.scope`, `/sys/fs/cgroup/docker/${id}`]) {
    if (existsSync(join(dir, "memory.current"))) return dir;
  }
  throw new Error(`no cgroup for ${container}`);
}

const readNum = (file, key) => {
  const text = readFileSync(file, "utf8");
  if (!key) return Number(text.trim());
  return Number(text.match(new RegExp(`^${key} (\\d+)`, "m"))[1]);
};

/** Memory (bytes, summed over containers) right now. Uses anon+file minus inactive file, like `docker stats`. */
export function memoryNow(containers) {
  return containers.map(cgroupDir).reduce((sum, dir) => {
    const current = readNum(join(dir, "memory.current"));
    const inactive = readNum(join(dir, "memory.stat"), "inactive_file");
    return sum + Math.max(0, current - inactive);
  }, 0);
}

/** Sample memory and CPU of a set of containers every `interval` ms until stopped. */
export function startSampler(containers, interval = 500) {
  const dirs = containers.map(cgroupDir);
  const cpu = () => dirs.reduce((s, d) => s + readNum(join(d, "cpu.stat"), "usage_usec"), 0);
  const mem = () => dirs.reduce((s, d) => s + Math.max(0, readNum(join(d, "memory.current")) - readNum(join(d, "memory.stat"), "inactive_file")), 0);
  const samples = [];
  const cpu0 = cpu(), t0 = performance.now();
  const timer = setInterval(() => samples.push(mem()), interval);
  return {
    stop() {
      clearInterval(timer);
      const seconds = (performance.now() - t0) / 1000;
      const cpuCores = (cpu() - cpu0) / 1e6 / seconds;
      samples.push(mem());
      return {
        memPeakMB: +(Math.max(...samples) / 2 ** 20).toFixed(1),
        memAvgMB: +(samples.reduce((a, b) => a + b, 0) / samples.length / 2 ** 20).toFixed(1),
        memEndMB: +(samples.at(-1) / 2 ** 20).toFixed(1),
        cpuCores: +cpuCores.toFixed(3),
      };
    },
  };
}

// --- load generation ---------------------------------------------------------------------------

/** Run oha inside the bench network on the client cores and return a compact summary. */
export async function oha(path, { concurrency, seconds, urlsFile, extra = "" }) {
  const target = urlsFile ? `--urls-from-file /work/${urlsFile}` : `'http://${RUN}:8080${path}'`;
  const mount = urlsFile ? `-v ${join(ROOT, "results", "tmp")}:/work:ro` : "";
  const out = await shAsync(
    `docker run --rm --network ${NET} --cpuset-cpus ${CLIENT_CPUS} ${mount} ${OHA} ` +
    `--no-tui --output-format json -z ${seconds}s -c ${concurrency} -t 10s ${extra} ${target}`,
  );
  const r = JSON.parse(out);
  const codes = r.statusCodeDistribution || {};
  const total = Object.values(codes).reduce((a, b) => a + b, 0);
  const errors = Object.values(r.errorDistribution || {}).reduce((a, b) => a + b, 0);
  const p = r.latencyPercentiles || {};
  const ms = (v) => (v == null ? null : +(v * 1000).toFixed(2));
  return {
    rps: +(r.summary.requestsPerSec || 0).toFixed(1),
    successRate: r.summary.successRate,
    requests: total,
    errors,
    status: codes,
    errorKinds: r.errorDistribution || {},
    p50: ms(p.p50), p90: ms(p.p90), p99: ms(p.p99), p999: ms(p["p99.9"]),
    max: ms(r.summary.slowest), mean: ms(r.summary.average),
    bytesPerReq: r.summary.sizePerRequest ?? null,
  };
}
