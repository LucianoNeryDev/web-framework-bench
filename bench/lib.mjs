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
// i7-4790S: 4 cores x 2 threads; logical CPUs n and n+4 share a physical core. The target owns physical cores 0
// and 1 (CPUs 0,1) with their SMT siblings 4,5 left idle; clients use physical cores 2 and 3 (CPUs 2,3,6,7).
export const TARGET_CPUS = process.env.WFB_TARGET_CPUS || "0,1";
export const CLIENT_CPUS = process.env.WFB_CLIENT_CPUS || "2,3,6,7";
export const TARGET_MEM = process.env.WFB_TARGET_MEM || "1g";
// oha 1.16.0 release binary (bench/bin/oha, see bench/setup.sh); runs on the host, pinned with the harness.
export const OHA = process.env.WFB_OHA || join(dirname(fileURLToPath(import.meta.url)), "bin", "oha");

// Remote mode (the published runs): the harness, oha and Chromium run on a load-generator VM and drive the target
// VM's Docker over SSH. WFB_TARGET_SSH is the SSH host of the target VM, WFB_TARGET_IP the address clients use to
// reach it, and WFB_REMOTE_ROOT the repository checkout on it (relative to the SSH user's home).
export const REMOTE = process.env.WFB_TARGET_SSH || null;
export const TARGET_IP = process.env.WFB_TARGET_IP || "127.0.0.1";
const REMOTE_ROOT = process.env.WFB_REMOTE_ROOT || "web-framework-bench";
const SSH = ["-o", "BatchMode=yes", "-o", "ServerAliveInterval=30"];
export const targetUrl = () => `http://${TARGET_IP}:${PORT}`;

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

const q = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const remoteCmd = (cmd, env) => {
  const vars = Object.entries(env || {}).map(([k, v]) => `${k}=${q(v)}`).join(" ");
  return `ssh ${SSH.join(" ")} ${REMOTE} ${q(`cd ${REMOTE_ROOT} && ${vars ? `export ${vars} && ` : ""}${cmd}`)}`;
};

/** Run a command where the target's Docker lives: locally, or on the target VM over SSH. */
export function dsh(cmd, opts = {}) {
  return REMOTE ? sh(remoteCmd(cmd, opts.env), { ...opts, env: undefined }) : sh(cmd, opts);
}

export function dshAsync(cmd, opts = {}) {
  return REMOTE ? shAsync(remoteCmd(cmd, opts.env)) : shAsync(cmd, opts);
}

/** Write a file (path relative to the repository root) where the target's Docker can read it. */
function putFile(rel, content) {
  if (!REMOTE) {
    mkdirSync(dirname(join(ROOT, rel)), { recursive: true });
    writeFileSync(join(ROOT, rel), content, { mode: 0o644 });
    return;
  }
  execFileSync("ssh", [...SSH, REMOTE, `cd ${REMOTE_ROOT} && mkdir -p ${dirname(rel)} && cat > ${rel}`], { input: content });
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
// Docker's json-file log pipeline costs dockerd a full core at tens of thousands of access-log lines per second,
// on unpinned cores. Every target therefore runs with the "none" log driver: the app still writes its logs, Docker
// just drops them. Compose targets get a generated override file that does the same for each service.
const noLogOverride = new Map();
function composeOverride(t) {
  if (!noLogOverride.has(t.id)) {
    const services = dsh(`docker compose -f ${t.compose} config --services`, { env: composeEnv(t) }).split("\n").filter(Boolean);
    const file = `results/tmp/nolog-${t.id}.yaml`;
    putFile(file, `services:\n${services.map((s) => `  ${s}:\n    logging:\n      driver: none\n`).join("")}`);
    noLogOverride.set(t.id, file);
  }
  return noLogOverride.get(t.id);
}
const composeCmd = (t) => `docker compose -p wfb-${t.id} -f ${t.compose} -f ${composeOverride(t)}`;

export function ensureNetwork(run = dsh) {
  run(`docker network inspect ${NET} >/dev/null 2>&1 || docker network create ${NET} >/dev/null`);
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
  return dsh(`${composeCmd(t)} ps -q`, { env: composeEnv(t) }).split("\n").filter(Boolean)
    .map((id) => dsh(`docker inspect -f '{{.Name}}' ${id}`).replace(/^\//, ""));
}

export function serviceContainer(t, service) {
  if (t.kind === "image") return RUN;
  const id = dsh(`${composeCmd(t)} ps -q ${service}`, { env: composeEnv(t) });
  return dsh(`docker inspect -f '{{.Name}}' ${id}`).replace(/^\//, "");
}

/** Start a target, pinned to the target cores, and return how long until / answered 200. */
export async function startTarget(t) {
  stopTarget(t);
  ensureNetwork();
  const t0 = Date.now();
  if (t.kind === "image") {
    dsh(`docker run -d --name ${RUN} --log-driver none --network ${NET} --network-alias ${RUN} --cpuset-cpus ${TARGET_CPUS} ` +
      `--memory ${TARGET_MEM} --memory-swap ${TARGET_MEM} -p ${REMOTE ? "" : "127.0.0.1:"}${PORT}:8080 ${envFlags(t.env)} ${t.image}`);
  } else {
    dsh(`${composeCmd(t)} up -d --wait --wait-timeout 2400`, { env: composeEnv(t), timeout: 45 * 60_000 });
  }
  const readyMs = await waitFor(`${targetUrl()}/`, { timeout: 2_400_000 });
  const coldStartMs = Date.now() - t0;
  if (t.kind === "compose") {
    // Same per-container limits as single-image targets; the whole stack shares the target cores.
    for (const c of containersOf(t)) dsh(`docker update --cpuset-cpus ${TARGET_CPUS} --memory ${TARGET_MEM} --memory-swap ${TARGET_MEM} ${c} >/dev/null`);
    const entry = serviceContainer(t, t.entry);
    dsh(`docker network connect --alias ${RUN} ${NET} ${entry}`, { allowFail: true });
  }
  return { coldStartMs, readyMs };
}

export function stopTarget(t) {
  stopEdge();
  if (t.kind === "image") dsh(`docker rm -f ${RUN} >/dev/null 2>&1`, { allowFail: true });
  else dsh(`${composeCmd(t)} down -v --remove-orphans >/dev/null 2>&1`, { env: composeEnv(t), allowFail: true });
}

/** Restart the target's containers (data kept) and time until / answers 200 again. */
export async function restartTarget(t) {
  const t0 = Date.now();
  if (t.kind === "image") dsh(`docker restart -t 10 ${RUN} >/dev/null`);
  else dsh(`${composeCmd(t)} restart -t 10 >/dev/null`, { env: composeEnv(t) });
  await waitFor(`${targetUrl()}/`, { timeout: 300_000 });
  return Date.now() - t0;
}

const edgeConf = () => `
server {
  listen 8080;
  gzip on; gzip_comp_level 5; gzip_min_length 256; gzip_vary on; gzip_proxied any;
  gzip_types text/css application/javascript text/javascript application/json image/svg+xml application/xml text/xml application/rss+xml;
  location / {
    proxy_pass ${REMOTE ? targetUrl() : `http://${RUN}:8080`};
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
  writeFileSync(conf, edgeConf(), { mode: 0o644 });
  ensureNetwork(sh);
  sh(`docker run -d --name ${EDGE} --log-driver none --network ${NET} --cpuset-cpus ${CLIENT_CPUS} -p 127.0.0.1:${EDGE_PORT}:8080 ` +
    `-v ${conf}:/etc/nginx/conf.d/default.conf:ro nginx:1.30-alpine`);
  await waitFor(`http://127.0.0.1:${EDGE_PORT}/`);
}

export function stopEdge() {
  sh(`docker rm -f ${EDGE} >/dev/null 2>&1`, { allowFail: true });
}

// --- cgroup sampling -------------------------------------------------------------------------
// A small shell loop reads cgroup v2 counters where the containers run (locally, or on the target VM over SSH)
// and prints "<ns> <cpu usage_usec> <memory bytes>" per sample. Memory is current minus inactive file cache, like
// `docker stats`.
const SAMPLER = `
iv=$1; n=$2; shift 2; dirs=()
for c in "$@"; do
  id=$(docker inspect -f '{{.Id}}' "$c")
  for d in /sys/fs/cgroup/system.slice/docker-$id.scope /sys/fs/cgroup/docker/$id; do
    if [ -f "$d/memory.current" ]; then dirs+=("$d"); break; fi
  done
done
i=0
while :; do
  cpu=0; mem=0
  for d in "\${dirs[@]}"; do
    u=$(awk '/^usage_usec/{print $2}' "$d/cpu.stat"); m=$(cat "$d/memory.current"); f=$(awk '/^inactive_file/{print $2}' "$d/memory.stat")
    cpu=$((cpu+u)); x=$((m-f)); [ $x -lt 0 ] && x=0; mem=$((mem+x))
  done
  echo "$(date +%s%N) $cpu $mem"
  i=$((i+1)); [ "$n" -gt 0 ] && [ $i -ge "$n" ] && exit 0
  sleep "$iv"
done`;

const samplerArgv = (interval, count, containers) => {
  const args = [String(interval / 1000), String(count), ...containers];
  return REMOTE ? ["ssh", [...SSH, REMOTE, `bash -s -- ${args.join(" ")}`]] : ["bash", ["-s", "--", ...args]];
};

/** Memory (bytes, summed over containers) right now. */
export function memoryNow(containers) {
  const [cmd, argv] = samplerArgv(0, 1, containers);
  const line = execFileSync(cmd, argv, { input: SAMPLER, encoding: "utf8" }).trim();
  return Number(line.split(" ")[2]);
}

/** Sample memory and CPU of a set of containers every `interval` ms until stopped. Resolves once sampling runs. */
export function startSampler(containers, interval = 500) {
  const [cmd, argv] = samplerArgv(interval, 0, containers);
  const child = spawn(cmd, argv, { stdio: ["pipe", "pipe", "ignore"] });
  child.stdin.end(SAMPLER);
  const samples = [];
  let buf = "";
  return new Promise((resolve) => {
    child.stdout.on("data", (d) => {
      buf += d;
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const l of lines) {
        const [ns, cpu, mem] = l.split(" ").map(Number);
        samples.push({ ns, cpu, mem });
        if (samples.length === 1) resolve(sampler);
      }
    });
    const sampler = {
      async stop() {
        await sleep(interval + 200); // one more sample after the load ends
        child.kill();
        const first = samples[0], last = samples.at(-1);
        const seconds = (last.ns - first.ns) / 1e9;
        const mems = samples.map((x) => x.mem);
        return {
          memPeakMB: +(Math.max(...mems) / 2 ** 20).toFixed(1),
          memAvgMB: +(mems.reduce((a, b) => a + b, 0) / mems.length / 2 ** 20).toFixed(1),
          memEndMB: +(mems.at(-1) / 2 ** 20).toFixed(1),
          cpuCores: +((last.cpu - first.cpu) / 1e6 / seconds).toFixed(3),
        };
      },
    };
  });
}

// --- load generation ---------------------------------------------------------------------------

/** IP of a container on the bench network, so local clients skip Docker's userland port proxy. */
export function ipOf(container, run = dsh) {
  return run(`docker inspect -f '{{(index .NetworkSettings.Networks "${NET}").IPAddress}}' ${container}`);
}

// Remote: clients reach the target VM's published port over the VPC. Local: the container IP on the bench network.
export const targetBase = (t) => (REMOTE ? targetUrl() : `http://${ipOf(t.kind === "image" ? RUN : serviceContainer(t, t.entry))}:8080`);
export const edgeBase = () => `http://${ipOf(EDGE, sh)}:8080`;

/** Run oha on the client cores against the target's network IP and return a compact summary. */
export async function oha(t, path, { concurrency, seconds, urlsFile, extra = "" }) {
  const target = urlsFile ? `--urls-from-file ${urlsFile}` : `'${targetBase(t)}${path}'`;
  const out = await shAsync(
    `taskset -c ${CLIENT_CPUS} ${OHA} --no-tui --output-format json --disable-compression -w -z ${seconds}s -c ${concurrency} -t 10s ${extra} ${target}`,
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
