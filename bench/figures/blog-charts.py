# /// script
# requires-python = ">=3.12"
# dependencies = ["matplotlib==3.10.0", "pillow==11.1.0"]
# ///
"""Blog figures for the web framework benchmark, from results/summary.json.

Run: uv run bench/figures/blog-charts.py results/summary.json <output-dir>
"""
import io
import json
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from PIL import Image

summary = {t["id"]: t for t in json.load(open(sys.argv[1]))}
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
SURFACE, INK, MUTED, GRID, BAR, REF = "#0d100e", "#edf1e9", "#9ca39a", "#232823", "#65a30d", "#6b7280"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13, "text.color": INK, "axes.labelcolor": MUTED,
                     "xtick.color": MUTED, "ytick.color": INK, "axes.edgecolor": GRID})

def save(fig, name):
    buf = io.BytesIO(); fig.savefig(buf, dpi=144, facecolor=SURFACE); plt.close(fig)
    Image.open(buf).convert("RGB").resize((1440, 810), Image.LANCZOS).save(out / name, "WEBP", quality=88, method=6)

# 1. Posts per second when every page is rendered on request.
rows = [("Go net/http", "go"), ("Astro", "astro-server"), ("SvelteKit", "sveltekit-server"),
        ("React Router", "react-router-server"), ("Nuxt", "nuxt-server"), ("Qwik City", "qwik-server"),
        ("Laravel (Octane)", "laravel-octane"), ("Next.js", "next-server"), ("Laravel (PHP-FPM)", "laravel"),
        ("Angular", "angular-server"), ("WordPress", "wordpress"), ("Ghost", "ghost")]
vals = [summary[i]["load"]["post@100"]["rps"] for _, i in rows]
static = min(summary[i]["load"]["post@100"]["rps"] for i in summary if i.endswith("static") or i in ("static-html", "hugo"))
fig, ax = plt.subplots(figsize=(10, 5.625), facecolor=SURFACE)
fig.subplots_adjust(left=0.2, right=0.96, top=0.86, bottom=0.12)
ax.set_facecolor(SURFACE)
y = range(len(rows))[::-1]
ax.barh(list(y), vals, height=0.62, color=BAR)
for yi, v in zip(y, vals):
    ax.text(v * 1.08, yi, f"{v:,.0f}", va="center", fontsize=11.5, color=INK)
ax.axvline(static, color=REF, linewidth=1.5)
ax.text(static / 1.07, 0.35, "every static build:\n16,600-18,300", ha="right", va="center", fontsize=11, color=MUTED)
ax.set_xscale("log"); ax.set_xlim(30, 30000)
ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:,.0f}"))
ax.set_yticks(list(y), [r[0] for r in rows])
ax.tick_params(axis="y", length=0)
ax.grid(axis="x", color=GRID, linewidth=1); ax.set_axisbelow(True)
for s in ("top", "right", "left"): ax.spines[s].set_visible(False)
ax.set_xlabel("requests per second, post page, 100 connections (log scale)")
fig.text(0.02, 0.95, "Rendering every page on request, on a 2-vCPU VM", fontsize=17, weight="bold")
fig.text(0.02, 0.905, "Same blog, same content, no cache. Static builds, served by nginx, shown for reference.", fontsize=12, color=MUTED)
save(fig, "server-throughput.webp")

# 2. JavaScript shipped vs time until the filter responds (static builds).
pts = [("Astro", "astro-static", (8, -16)), ("HTML, Hugo, Go,\nLaravel, WordPress, Ghost", "static-html", (10, 6)),
       ("Go + htmx", "go-htmx", (8, -14)), ("SvelteKit", "sveltekit-static", (8, 8)), ("Qwik City", "qwik-static", (8, -16)),
       ("Nuxt", "nuxt-static", (-40, 8)), ("Angular", "angular-static", (10, -16)), ("React Router", "react-router-static", (-104, 2)),
       ("Next.js", "next-static", (-58, 8))]
fig, ax = plt.subplots(figsize=(10, 5.625), facecolor=SURFACE)
fig.subplots_adjust(left=0.1, right=0.96, top=0.86, bottom=0.12)
ax.set_facecolor(SURFACE)
for label, i, off in pts:
    x = summary[i]["lighthouse"]["blog"]["scriptKB"]; yv = summary[i]["interact"]["filterReadyMs"]
    ax.scatter([x], [yv], s=90, color=BAR, edgecolors=SURFACE, linewidths=2, zorder=3)
    ax.annotate(label, (x, yv), xytext=off, textcoords="offset points", fontsize=11.5, color=INK)
ax.set_xlim(-8, 160); ax.set_ylim(0, 2100)
ax.grid(color=GRID, linewidth=1); ax.set_axisbelow(True)
for s in ("top", "right"): ax.spines[s].set_visible(False)
ax.set_xlabel("JavaScript files downloaded on /blog (KB, compressed)")
ax.set_ylabel("filter ready (ms)")
fig.text(0.02, 0.95, "More JavaScript, later interactivity", fontsize=17, weight="bold")
fig.text(0.02, 0.905, "Throttled phone (4x slower CPU, 150 ms RTT, 1.6 Mbps): time until the tag filter works.", fontsize=12, color=MUTED)
save(fig, "javascript-vs-ready.webp")
print("ok")
