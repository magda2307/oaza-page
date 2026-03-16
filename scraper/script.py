"""
Cat Charity Facebook Page Scraper
===================================
Scrapes a public Facebook page and saves post text + URL to CSV.
No API keys needed.

SETUP:
  pip install playwright beautifulsoup4
  playwright install chromium

USAGE: 
  python script.py
  python script.py --url https://www.facebook.com/Kociooaza/ --max-posts 100
  python script.py --no-headless   # watch the browser (good for debugging)
"""

import argparse
import csv
import datetime
import random
import time
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ─────────────────────────────────────────────
# DEFAULTS (override via CLI args)
# ─────────────────────────────────────────────
DEFAULT_URL      = "https://www.facebook.com/Kociooaza/"
DEFAULT_OUTPUT   = "cat_posts.csv"
DEFAULT_HEADLESS = True
DEFAULT_MAX      = None   # None = scroll until the very end
SCROLL_PAUSE     = 4      # seconds between scrolls (be polite)

# Optional – fill in if FB shows a login wall
FACEBOOK_EMAIL    = ""
FACEBOOK_PASSWORD = ""
# ─────────────────────────────────────────────


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Scrape a public Facebook page to CSV.")
    p.add_argument("--url",        default=DEFAULT_URL,    help="Facebook page URL")
    p.add_argument("--output",     default=DEFAULT_OUTPUT, help="Output CSV path")
    p.add_argument("--max-posts",  type=int, default=DEFAULT_MAX, metavar="N",
                   help="Stop after N posts (default: scroll to the end)")
    p.add_argument("--no-headless", dest="headless", action="store_false",
                   help="Show the browser window (useful for debugging)")
    p.set_defaults(headless=DEFAULT_HEADLESS)
    return p.parse_args()


def login_if_needed(page) -> None:
    if not FACEBOOK_EMAIL or not FACEBOOK_PASSWORD:
        return
    try:
        page.wait_for_selector('input[name="email"]', timeout=5000)
        print("[FB] Login wall detected – logging in ...")
        page.fill('input[name="email"]', FACEBOOK_EMAIL)
        page.fill('input[name="pass"]', FACEBOOK_PASSWORD)
        page.click('button[name="login"]')
        page.wait_for_load_state("networkidle")
        time.sleep(3)
        print("[FB] Logged in.")
    except PlaywrightTimeout:
        pass


def dismiss_login_modal(page) -> bool:
    """
    Close the 'Log in or sign up' overlay Facebook shows mid-scroll.
    Returns True if a modal was found and dismissed.
    """
    # Pressing Escape is the most reliable universal dismissal
    page.keyboard.press("Escape")
    time.sleep(0.5)

    # Then try explicit close buttons inside any dialog
    for selector in [
        'div[role="dialog"] [aria-label="Close"]',
        '[aria-label="Close"]',
        'div[role="dialog"] button:has-text("Not now")',
        'div[role="dialog"] button:has-text("Close")',
    ]:
        try:
            btn = page.query_selector(selector)
            if btn and btn.is_visible():
                btn.click()
                time.sleep(1)
                return True
        except Exception:
            pass

    return False


def parse_article(article) -> dict | None:
    """Extract post data from a single article element. Returns None to skip."""
    text_el = article.find("div", attrs={"data-ad-preview": "message"})
    text = (text_el or article).get_text(separator=" ", strip=True)
    if not text or len(text) < 20:
        return None

    # Permalink — prefer /posts/ or /permalink/ links
    url = ""
    for a in article.find_all("a", href=True):
        href = a["href"]
        if "/posts/" in href or "/permalink/" in href or "story_fbid" in href:
            url = href.split("?")[0]
            break

    # Date — Facebook embeds Unix timestamp in abbr[data-utime]
    date = ""
    abbr = article.find("abbr", attrs={"data-utime": True})
    if abbr:
        ts = int(abbr["data-utime"])
        date = datetime.datetime.fromtimestamp(
            ts, tz=datetime.timezone.utc
        ).strftime("%Y-%m-%d %H:%M")

    return {"date": date, "url": url, "text": text}


def scrape_facebook_page(page_url: str, max_posts: int | None, headless: bool) -> list[dict]:
    results: list[dict] = []
    seen_urls: set[str] = set()   # primary dedup key when URL is available
    seen_texts: set[str] = set()  # fallback for posts without a permalink

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=headless,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/121.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        print(f"[Scraper] Opening: {page_url}")
        page.goto(page_url, wait_until="domcontentloaded", timeout=30000)
        time.sleep(4)

        # Dismiss cookie banner
        for selector in [
            'button[data-cookiebanner="accept_button"]',
            'button:has-text("Accept all")',
            'button:has-text("Allow all cookies")',
            '[aria-label="Allow all cookies"]',
        ]:
            try:
                page.click(selector, timeout=2000)
                time.sleep(1)
                break
            except PlaywrightTimeout:
                pass

        login_if_needed(page)

        # Try to navigate to the Posts tab
        for selector in ['a:has-text("Posts")', 'a[href*="/posts"]']:
            try:
                page.click(selector, timeout=3000)
                time.sleep(2)
                break
            except PlaywrightTimeout:
                pass

        last_height = 0
        stall_count = 0

        print("[Scraper] Scrolling ...")
        while True:
            soup = BeautifulSoup(page.content(), "html.parser")

            for article in soup.find_all("div", role="article"):
                post = parse_article(article)
                if post is None:
                    continue

                # Deduplicate: prefer URL, fall back to text
                if post["url"]:
                    if post["url"] in seen_urls:
                        continue
                    seen_urls.add(post["url"])
                else:
                    if post["text"] in seen_texts:
                        continue
                    seen_texts.add(post["text"])

                results.append(post)

            print(f"  ... {len(results)} posts collected", end="\r", flush=True)

            if max_posts and len(results) >= max_posts:
                break

            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(SCROLL_PAUSE + random.uniform(0, 2))

            new_height = page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
                stall_count += 1
                if stall_count >= 3:
                    print("\n[Scraper] End of page reached.")
                    break
            else:
                stall_count = 0
            last_height = new_height

        browser.close()

    return results[:max_posts] if max_posts else results


def save_csv(posts: list[dict], output_path: str) -> None:
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["date", "url", "text"])
        writer.writeheader()
        writer.writerows(posts)
    print(f"Saved {len(posts)} posts → {output_path}")


if __name__ == "__main__":
    args = parse_args()

    posts = scrape_facebook_page(args.url, args.max_posts, args.headless)

    if not posts:
        print("No posts collected.")
        print("Tips: use --no-headless to see what the browser sees,")
        print("      or add FACEBOOK_EMAIL/PASSWORD at the top if there is a login wall.")
        raise SystemExit(1)

    save_csv(posts, args.output)
