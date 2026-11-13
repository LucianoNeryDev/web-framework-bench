# /// script
# requires-python = ">=3.12"
# dependencies = ["markdown==3.7", "pillow==11.1.0"]
# ///
"""Generate the shared benchmark content.

Deterministic: the same seed always produces byte-identical output, so every
framework renders the same posts, images and metadata.

Outputs
  content/posts/<slug>.md       front matter + Markdown (Hugo, Ghost, WordPress imports)
  content/posts.json            the canonical dataset, with pre-rendered HTML
  shared/public/images/*.webp   hero, avatar, covers and card thumbnails

Run: uv run content/generate.py
"""

from __future__ import annotations

import json
import math
import random
import re
from datetime import date, timedelta
from pathlib import Path

import markdown
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "posts"
IMAGES_DIR = ROOT / "shared" / "public" / "images"
SEED = 20261113
POST_COUNT = 40

SITE = {
    "title": "Field Notes",
    "description": "Notes from a developer's workbench: small discoveries, build logs and longer write-ups.",
    "url": "https://bench.example",
    "author": "Ada Fieldwork",
    "heroTitle": "Notes from the workbench",
    "heroText": "Small daily discoveries, build logs and longer project write-ups about the web, tooling and the systems underneath.",
    "aboutHtml": (
        "<p>I build web software and the infrastructure it runs on. This site collects what I learn along the way, "
        "from a one-line shell trick to a month-long migration.</p>"
        "<p>Every post is written to be useful a year from now: what I tried, what broke, what the numbers said "
        "and what I would do differently.</p>"
        "<p>If something here saved you an afternoon, or you think I got it wrong, write to "
        "<a href=\"mailto:ada@bench.example\">ada@bench.example</a>.</p>"
    ),
}

TAGS = [
    ("go", "Go"),
    ("rust", "Rust"),
    ("javascript", "JavaScript"),
    ("css", "CSS"),
    ("performance", "Performance"),
    ("databases", "Databases"),
    ("devops", "DevOps"),
    ("security", "Security"),
    ("testing", "Testing"),
    ("tooling", "Tooling"),
]
TAG_NAMES = dict(TAGS)

SUBJECTS = [
    "connection pooling", "cache invalidation", "a flaky integration test", "cold starts", "the build pipeline",
    "structured logging", "feature flags", "database migrations", "rate limiting", "image optimisation",
    "a memory leak", "TLS termination", "background jobs", "the release checklist", "container images",
    "CSS container queries", "service workers", "a slow query", "dependency updates", "error budgets",
]
VERBS = [
    "Debugging", "Measuring", "Rethinking", "Shipping", "Untangling", "Profiling", "Simplifying",
    "Hardening", "Automating", "Replacing",
]
QUALIFIERS = [
    "in production", "without downtime", "on a small budget", "with fewer moving parts", "the boring way",
    "after a long weekend", "from first principles", "at the edge", "under load", "step by step",
]

SENTENCES = [
    "The first measurement was misleading because the cache was already warm.",
    "I started with the simplest version that could possibly work and wrote down every assumption.",
    "Most of the latency came from a single synchronous call that nobody remembered adding.",
    "The fix itself was three lines; finding where to put them took two days.",
    "Reading the source was faster than searching for a blog post that matched my exact version.",
    "Once the numbers were on a dashboard, the conversation changed from opinions to trade-offs.",
    "I kept the old path behind a flag for a week so I could compare both under real traffic.",
    "The documentation described the happy path well and said nothing about what happens on timeout.",
    "A small reproduction in an empty repository removed every distraction from the real problem.",
    "Tail latency told a different story from the average, which looked perfectly healthy.",
    "The error only appeared when two requests raced for the same row inside one transaction.",
    "Writing the test first forced me to decide what correct behaviour actually meant.",
    "Most tools default to settings that are reasonable for a laptop and surprising on a server.",
    "I deleted more code than I added, and the system got faster and easier to read.",
    "The profiler pointed at serialisation, which was not where I would have guessed.",
    "Retries without jitter turned a short blip into a synchronised wave of traffic.",
    "Pinning the versions made the build reproducible and the upgrade a deliberate decision.",
    "Logs were useful only after every line carried a request identifier.",
    "The slowest part of the deploy was waiting for a health check that checked nothing.",
    "Moving the work off the request path made the page fast and the queue honest.",
    "A budget for each page kept the bundle from growing one harmless dependency at a time.",
    "The benchmark looked impressive until I ran it on the same hardware as production.",
    "Every abstraction leaked a little, and the leaks were where the bugs lived.",
    "I wrote a short runbook so the next incident starts with steps instead of guesses.",
    "The migration ran in batches so it could be paused, resumed and verified at each step.",
    "Measuring before and after turned a hunch into a result I could defend.",
    "Clear error messages saved more time than any clever optimisation.",
    "The configuration file had grown three ways to say the same thing.",
    "Small, frequent releases made each change easy to reason about and easy to revert.",
    "The real constraint was not the CPU but the number of open file descriptors.",
]

CODE_SAMPLES = [
    ("go", 'func handler(w http.ResponseWriter, r *http.Request) {\n\tctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)\n\tdefer cancel()\n\tif err := work(ctx); err != nil {\n\t\thttp.Error(w, "upstream timeout", http.StatusGatewayTimeout)\n\t\treturn\n\t}\n\tw.WriteHeader(http.StatusNoContent)\n}'),
    ("js", "export async function retry(fn, attempts = 4) {\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      const delay = 2 ** i * 100 + Math.random() * 100;\n      await new Promise((r) => setTimeout(r, delay));\n    }\n  }\n  throw new Error('retry budget exhausted');\n}"),
    ("sql", "SELECT p.slug, count(v.id) AS views\nFROM posts p\nLEFT JOIN views v ON v.post_id = p.id\n  AND v.created_at > now() - interval '7 days'\nGROUP BY p.slug\nORDER BY views DESC\nLIMIT 10;"),
    ("bash", "set -euo pipefail\nfor host in $(cat hosts.txt); do\n  ssh \"$host\" 'systemctl is-active app' || echo \"$host down\"\ndone"),
    ("css", ".card-grid {\n  display: grid;\n  gap: 1.5rem;\n  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));\n}\n\n@container (min-width: 40rem) {\n  .card { grid-template-columns: 1fr 2fr; }\n}"),
    ("rust", "fn parse_line(line: &str) -> Option<(&str, u64)> {\n    let (key, value) = line.split_once('=')?;\n    let value = value.trim().parse().ok()?;\n    Some((key.trim(), value))\n}"),
]

HEADINGS = [
    "Where it started", "Measuring the problem", "The first attempt", "What actually fixed it",
    "Numbers after the change", "What I would do differently", "Trade-offs", "Takeaways",
]


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def paragraph(rng: random.Random, n: int) -> str:
    return " ".join(rng.sample(SENTENCES, n))


def build_markdown(rng: random.Random) -> str:
    parts: list[str] = [paragraph(rng, 4), paragraph(rng, 5)]
    headings = rng.sample(HEADINGS, rng.randint(4, 5))
    code_at = set(rng.sample(range(len(headings)), 2))
    for i, heading in enumerate(headings):
        parts.append(f"## {heading}")
        parts.append(paragraph(rng, rng.randint(4, 6)))
        parts.append(paragraph(rng, rng.randint(3, 5)))
        if i in code_at:
            lang, code = rng.choice(CODE_SAMPLES)
            parts.append(f"```{lang}\n{code}\n```")
        if i == 1:
            items = rng.sample(SENTENCES, 4)
            parts.append("\n".join(f"- {s}" for s in items))
        if i == 2:
            parts.append(f"> {rng.choice(SENTENCES)}")
        parts.append(paragraph(rng, rng.randint(3, 5)))
    return "\n\n".join(parts) + "\n"


def render_markdown(md: str) -> str:
    html = markdown.markdown(md, extensions=["fenced_code"], output_format="html")
    # python-markdown emits class="language-x" on <code>; keep it, it is what every highlighter expects.
    return html


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def gradient_image(w: int, h: int, hue_seed: int, label: str | None) -> Image.Image:
    rng = random.Random(hue_seed)
    c1 = [rng.randint(20, 90) for _ in range(3)]
    c2 = [rng.randint(90, 220) for _ in range(3)]
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / w * 0.6 + y / h * 0.4)
            wave = 0.08 * math.sin((x + y) / (w / 9))
            t = min(1.0, max(0.0, t + wave))
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    draw = ImageDraw.Draw(img)
    for _ in range(14):
        r = rng.randint(h // 12, h // 3)
        cx, cy = rng.randint(0, w), rng.randint(0, h)
        tone = tuple(min(255, v + 35) for v in c2)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=tone, width=max(2, h // 160))
    if label:
        f = font(max(18, h // 11))
        draw.text((w // 16, h - h // 4), label, fill=(250, 250, 250), font=f)
    return img


def save_webp(img: Image.Image, path: Path, quality: int = 72) -> None:
    img.save(path, "WEBP", quality=quality, method=6)


def main() -> None:
    rng = random.Random(SEED)
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    for old in POSTS_DIR.glob("*.md"):
        old.unlink()

    titles: set[str] = set()
    posts = []
    day = date(2026, 10, 30)
    for i in range(POST_COUNT):
        while True:
            title = f"{rng.choice(VERBS)} {rng.choice(SUBJECTS)} {rng.choice(QUALIFIERS)}"
            if title not in titles:
                titles.add(title)
                break
        slug = slugify(title)
        tags = sorted(rng.sample([t for t, _ in TAGS], rng.randint(1, 3)), key=lambda t: [x for x, _ in TAGS].index(t))
        md = build_markdown(rng)
        html = render_markdown(md)
        words = len(re.sub(r"<[^>]+>", " ", html).split())
        summary = paragraph(rng, 2)
        posts.append({
            "slug": slug,
            "title": title,
            "summary": summary,
            "date": day.isoformat(),
            "dateLabel": f"{day.day} {day.strftime('%b')} {day.year}",
            "tags": tags,
            "readingMinutes": max(1, round(words / 220)),
            "cover": {
                "src": f"/images/{slug}.webp",
                "thumb": f"/images/{slug}-thumb.webp",
                "alt": f"Abstract cover illustration for “{title}”",
                "width": 1200, "height": 630,
                "thumbWidth": 600, "thumbHeight": 315,
            },
            "markdown": md,
            "html": html,
        })
        day -= timedelta(days=rng.randint(2, 9))

    # Newest first. prev = older post, next = newer post.
    for i, post in enumerate(posts):
        post["prev"] = posts[i + 1]["slug"] if i + 1 < len(posts) else None
        post["next"] = posts[i - 1]["slug"] if i > 0 else None
        scored = []
        for j, other in enumerate(posts):
            if j == i:
                continue
            shared = len(set(post["tags"]) & set(other["tags"]))
            scored.append((-shared, abs(i - j), other["slug"]))
        post["related"] = [s for _, _, s in sorted(scored)[:3]]

    for post in posts:
        fm = [
            "---",
            f"title: {json.dumps(post['title'])}",
            f"slug: {post['slug']}",
            f"date: {post['date']}",
            f"summary: {json.dumps(post['summary'])}",
            f"tags: [{', '.join(post['tags'])}]",
            f"cover: {post['cover']['src']}",
            "---",
            "",
        ]
        (POSTS_DIR / f"{post['slug']}.md").write_text("\n".join(fm) + post["markdown"], encoding="utf-8")

    dataset = {
        "site": SITE,
        "tags": [{"slug": s, "name": n} for s, n in TAGS],
        "posts": [{k: v for k, v in p.items() if k != "markdown"} for p in posts],
    }
    (ROOT / "content" / "posts.json").write_text(json.dumps(dataset, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # Images
    save_webp(gradient_image(1600, 900, SEED, None), IMAGES_DIR / "hero.webp", 70)
    save_webp(gradient_image(480, 480, SEED + 1, None), IMAGES_DIR / "avatar.webp", 75)
    for idx, post in enumerate(posts):
        cover = gradient_image(1200, 630, SEED + 100 + idx, TAG_NAMES[post["tags"][0]])
        save_webp(cover, IMAGES_DIR / f"{post['slug']}.webp")
        save_webp(cover.resize((600, 315), Image.LANCZOS), IMAGES_DIR / f"{post['slug']}-thumb.webp")

    print(f"{len(posts)} posts, {sum(1 for _ in IMAGES_DIR.glob('*.webp'))} images")


if __name__ == "__main__":
    main()
