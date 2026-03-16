#!/usr/bin/env python3
"""
Kocia Oaza — Facebook Post Diary Builder
=========================================
Run once with any batch of scraped posts. Keeps a running database.
Already-processed posts are skipped automatically.

Usage:
    python tools/analyze_posts.py posts.json
    python tools/analyze_posts.py posts.json --summaries   # also write monthly .md diaries
    python tools/analyze_posts.py --summary-only 2026/03   # regenerate one month's diary

Output (all in data/diary/):
    processed_ids.json          — tracks what's been done (idempotent)
    cats.json                   — every cat ever mentioned
    crises.json                 — crisis timeline
    fundraisers.json            — all fundraising campaigns
    YYYY/MM/posts.jsonl         — extracted post data by month
    YYYY/MM/summary.md          — narrative diary entry per month (optional)
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import anthropic

# ---------------------------------------------------------------------------
DIARY_DIR = Path(__file__).parent.parent / "data" / "diary"
MODEL_EXTRACT = "claude-haiku-4-5-20251001"   # cheap, fast for per-post extraction
MODEL_SUMMARY = "claude-sonnet-4-6"           # richer prose for monthly diary
# ---------------------------------------------------------------------------

EXTRACT_PROMPT = """\
You are helping build a diary for Kocia Oaza (Koci Raj) — a Warsaw-based cat rescue
that never turns a cat away, no matter how sick or complex.

Analyze this Facebook post and return a JSON object (no markdown fences, just raw JSON):

POST DATE: {date}
POST TEXT (Polish): {text}
ENGAGEMENT: {likes} likes / {comments} comments / {shares} shares

Return exactly this schema (null for unknown fields):
{{
  "event_types": [],          // list of: adoption, rescue, death, medical, fundraising,
                              //   crisis_appeal, renovation, partnership, community_event,
                              //   memorial, food_appeal, temp_home_needed, general_update
  "cats": [
    {{
      "name": null,           // Polish name kept as-is; null if unnamed
      "status": null,         // rescued | adopted | died | medical | looking | temp_needed | unknown
      "story_en": null,       // 1–2 sentence English summary of this cat's situation
      "health_notes": null    // injuries, illness, special needs if mentioned
    }}
  ],
  "financial": {{
    "is_fundraising": false,
    "campaign_name": null,
    "campaign_url": null,
    "crisis_level": "none",   // none | minor | major | emergency
    "crisis_description": null
  }},
  "is_crisis": false,
  "crisis_summary": null,     // short English description of the crisis
  "key_quote_pl": null,       // most powerful/emotional sentence in Polish
  "key_quote_en": null,       // English translation of above
  "story_worthy": false,      // true if this post contains a genuinely compelling story
  "story_summary_en": null,   // 2–3 sentence English story summary if story_worthy
  "sentiment": "neutral",     // positive | neutral | urgent | desperate | celebratory | grief
  "volunteers_mentioned": [], // names of volunteers/staff
  "donors_mentioned": [],     // names of donors/helpers
  "orgs_mentioned": [],       // partner organizations
  "tags": []                  // any other useful descriptive tags
}}
"""

SUMMARY_PROMPT = """\
You are writing a monthly chapter in the diary of Kocia Oaza (Koci Raj), a Warsaw
cat rescue that accepts every cat others refuse — road accidents, FIV, cancer,
dying cats, abandoned animals. Their motto is "never say no."

Based on the {count} posts below from {month_label}, write a beautiful, honest
narrative diary entry in English. This will become part of a public-facing "our story"
section of their website.

Tone: warm, honest, sometimes heartbreaking, always dignified. Do not sanitize.
Show the real weight of the work alongside the joy.

Include:
- A vivid opening paragraph capturing the month's overall mood
- Key rescues and their stories (use cat names)
- Adoptions and departures (joy)
- Deaths and difficult losses (grief)
- Financial situation and any crises
- Community moments (donations, partners, volunteers)
- A closing paragraph — what the month means in the bigger picture
- Month stats summary at the very end (markdown table):
  | Metric | Count |
  where relevant metrics might be: cats rescued, adopted, passed away, still in care, fundraisers active

Format as clean Markdown. No fluff. No filler. This is a real diary.

---

POSTS DATA:
{posts_data}
"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def post_to_text(post: dict) -> str:
    """Best-effort text extraction from a post object."""
    text = post.get("text") or post.get("previewDescription") or ""
    if post.get("previewTitle") and post["previewTitle"] not in text:
        text = post["previewTitle"] + "\n" + text
    return text.strip()


def photo_urls(post: dict) -> list[str]:
    """Extract all Photo URIs from a post."""
    urls = []
    for m in post.get("media", []):
        if m.get("__typename") == "Photo":
            uri = (m.get("photo_image") or {}).get("uri") or m.get("thumbnail")
            if uri:
                urls.append(uri)
    return urls


def parse_time(post: dict) -> datetime | None:
    t = post.get("time")
    if not t:
        return None
    try:
        return datetime.fromisoformat(t.replace("Z", "+00:00"))
    except ValueError:
        return None


def month_key(dt: datetime) -> str:
    return f"{dt.year}/{dt.month:02d}"


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

def extract_post(client: anthropic.Anthropic, post: dict) -> dict:
    text = post_to_text(post)
    dt = parse_time(post)
    date_str = dt.strftime("%Y-%m-%d") if dt else "unknown"

    prompt = EXTRACT_PROMPT.format(
        date=date_str,
        text=text[:3000],
        likes=post.get("likes", 0),
        comments=post.get("comments", 0),
        shares=post.get("shares", 0),
    )

    for attempt in range(3):
        try:
            resp = client.messages.create(
                model=MODEL_EXTRACT,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            raw = resp.content[0].text.strip()
            # strip accidental markdown fences
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            analysis = json.loads(raw)
            break
        except (json.JSONDecodeError, anthropic.APIError) as e:
            if attempt == 2:
                analysis = {"error": str(e), "event_types": ["parse_error"]}
            else:
                time.sleep(2 ** attempt)

    return {
        "post_id": post.get("postId"),
        "url": post.get("url"),
        "time": post.get("time"),
        "timestamp": post.get("timestamp"),
        "text_pl": text,
        "metrics": {
            "likes": post.get("likes", 0),
            "comments": post.get("comments", 0),
            "shares": post.get("shares", 0),
        },
        "photos": photo_urls(post),
        "analysis": analysis,
    }


def update_aggregates(result: dict, cats: dict, crises: list, fundraisers: list):
    """Update the three running databases in-place."""
    analysis = result.get("analysis", {})
    date = result.get("time", "")
    post_id = result.get("post_id", "")
    url = result.get("url", "")

    # Cats
    for cat in analysis.get("cats", []):
        name = cat.get("name")
        if not name or name == "null":
            continue
        if name not in cats:
            cats[name] = {
                "status": cat.get("status"),
                "story_en": cat.get("story_en"),
                "health_notes": cat.get("health_notes"),
                "first_seen": date,
                "appearances": [],
            }
        cats[name]["appearances"].append({"date": date, "post_id": post_id, "status": cat.get("status")})
        # keep latest status/story
        if cat.get("status"):
            cats[name]["status"] = cat["status"]
        if cat.get("story_en"):
            cats[name]["story_en"] = cat["story_en"]

    # Crises
    if analysis.get("is_crisis"):
        crises.append({
            "date": date,
            "post_id": post_id,
            "url": url,
            "level": analysis.get("financial", {}).get("crisis_level", "unknown"),
            "summary": analysis.get("crisis_summary"),
        })

    # Fundraisers
    fin = analysis.get("financial", {})
    if fin.get("is_fundraising"):
        fundraisers.append({
            "date": date,
            "post_id": post_id,
            "campaign": fin.get("campaign_name"),
            "campaign_url": fin.get("campaign_url"),
            "crisis_level": fin.get("crisis_level", "none"),
        })


def generate_monthly_summary(client: anthropic.Anthropic, year: str, month: str) -> str:
    """Read posts.jsonl for a month and generate a narrative diary."""
    posts_file = DIARY_DIR / year / month / "posts.jsonl"
    if not posts_file.exists():
        return f"# {year}/{month}\n\nNo posts found.\n"

    posts_data = []
    with open(posts_file, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    posts_data.append(json.loads(line))
                except json.JSONDecodeError:
                    continue

    if not posts_data:
        return f"# {year}/{month}\n\nNo posts found.\n"

    # Build a compact representation for the summary prompt
    snippets = []
    for p in sorted(posts_data, key=lambda x: x.get("timestamp", 0)):
        a = p.get("analysis", {})
        snippets.append(
            f"[{p.get('time','')[:10]}] "
            f"events={a.get('event_types',[])} "
            f"sentiment={a.get('sentiment','?')} "
            f"cats={[c.get('name') for c in a.get('cats',[])]} "
            f"crisis={a.get('is_crisis',False)} "
            f"story={a.get('story_summary_en','')[:300]}\n"
            f"  quote: {a.get('key_quote_pl','')[:200]}"
        )

    month_dt = datetime(int(year), int(month), 1)
    month_label = month_dt.strftime("%B %Y")

    prompt = SUMMARY_PROMPT.format(
        count=len(posts_data),
        month_label=month_label,
        posts_data="\n\n".join(snippets[:40]),  # cap to avoid token overflow
    )

    resp = client.messages.create(
        model=MODEL_SUMMARY,
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.content[0].text


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def cmd_analyze(args):
    client = anthropic.Anthropic()

    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"Error: file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    with open(input_path, encoding="utf-8") as f:
        posts = json.load(f)

    if not isinstance(posts, list):
        print("Error: JSON must be a top-level array of posts.", file=sys.stderr)
        sys.exit(1)

    # Load state
    processed_ids_file = DIARY_DIR / "processed_ids.json"
    cats_file          = DIARY_DIR / "cats.json"
    crises_file        = DIARY_DIR / "crises.json"
    fundraisers_file   = DIARY_DIR / "fundraisers.json"

    processed_ids  = set(load_json(processed_ids_file, []))
    cats           = load_json(cats_file, {})
    crises         = load_json(crises_file, [])
    fundraisers    = load_json(fundraisers_file, [])

    # Filter already-processed
    new_posts = [p for p in posts if p.get("postId") not in processed_ids]
    print(f"  {len(posts)} posts in file — {len(new_posts)} new, {len(posts)-len(new_posts)} already processed")

    if not new_posts:
        print("Nothing to do. Pass --summaries to regenerate monthly diaries.")
        return

    months_touched = set()

    for i, post in enumerate(new_posts):
        post_id = post.get("postId", f"unknown_{i}")
        dt = parse_time(post)
        date_str = dt.strftime("%Y-%m-%d") if dt else "?"
        print(f"  [{i+1:>3}/{len(new_posts)}] {post_id}  {date_str}", end=" ... ", flush=True)

        result = extract_post(client, post)

        # Write to monthly jsonl
        if dt:
            mk = month_key(dt)
            months_touched.add(mk)
            month_dir = DIARY_DIR / mk
            month_dir.mkdir(parents=True, exist_ok=True)
            with open(month_dir / "posts.jsonl", "a", encoding="utf-8") as f:
                f.write(json.dumps(result, ensure_ascii=False) + "\n")

        update_aggregates(result, cats, crises, fundraisers)
        processed_ids.add(post_id)

        sentiment = result.get("analysis", {}).get("sentiment", "?")
        events    = result.get("analysis", {}).get("event_types", [])
        print(f"{sentiment}  {events}")

        # Light rate-limit buffer
        time.sleep(0.3)

    # Persist aggregates
    DIARY_DIR.mkdir(parents=True, exist_ok=True)
    save_json(processed_ids_file, list(processed_ids))
    save_json(cats_file, cats)
    save_json(crises_file, crises)
    save_json(fundraisers_file, fundraisers)

    print(f"\n✓ Cats tracked  : {len(cats)}")
    print(f"✓ Crises logged : {len(crises)}")
    print(f"✓ Fundraisers   : {len(fundraisers)}")
    print(f"✓ Months touched: {sorted(months_touched)}")

    if args.summaries:
        print("\nGenerating monthly narrative summaries...")
        for mk in sorted(months_touched):
            year, month = mk.split("/")
            print(f"  Summarizing {mk} ...", end=" ", flush=True)
            summary = generate_monthly_summary(client, year, month)
            summary_path = DIARY_DIR / year / month / "summary.md"
            summary_path.write_text(summary, encoding="utf-8")
            print("done")


def cmd_summary_only(args):
    client = anthropic.Anthropic()
    year, month = args.month.split("/")
    print(f"Generating summary for {year}/{month} ...", end=" ", flush=True)
    summary = generate_monthly_summary(client, year, month)
    summary_path = DIARY_DIR / year / month / "summary.md"
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    summary_path.write_text(summary, encoding="utf-8")
    print(f"done → {summary_path}")


# ---------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kocia Oaza diary builder")
    sub = parser.add_subparsers(dest="cmd")

    # Default: analyze
    p_analyze = sub.add_parser("analyze", help="Process a JSON file of posts")
    p_analyze.add_argument("input_file", help="Path to JSON file with posts array")
    p_analyze.add_argument("--summaries", action="store_true",
                           help="Also generate monthly narrative summaries")

    # Summary-only
    p_sum = sub.add_parser("summary", help="Regenerate one month's summary.md")
    p_sum.add_argument("month", help="Month in YYYY/MM format, e.g. 2026/03")

    # Allow bare: python analyze_posts.py posts.json [--summaries]
    parser.add_argument("input_file", nargs="?", help=argparse.SUPPRESS)
    parser.add_argument("--summaries", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--summary-only", metavar="YYYY/MM",
                        help="Just regenerate one month's narrative summary")

    args = parser.parse_args()

    if args.summary_only:
        args.month = args.summary_only
        cmd_summary_only(args)
    elif args.cmd == "summary":
        cmd_summary_only(args)
    elif args.input_file:
        cmd_analyze(args)
    else:
        parser.print_help()
