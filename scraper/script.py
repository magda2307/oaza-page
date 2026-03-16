"""
Cat Charity Facebook Page Scraper
===================================
Scrapes a public Facebook page and saves post text + URL to CSV.
No API keys needed.

SETUP:
  pip install playwright beautifulsoup4
  playwright install chromium

USAGE:
  python cat_scraper.py
"""

import time
import csv
import random
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
FACEBOOK_PAGE_URL = "https://www.facebook.com/Kociooaza/"
OUTPUT_CSV        = "cat_posts.csv"

# Optional – fill in if FB shows a login wall
FACEBOOK_EMAIL    = ""
FACEBOOK_PASSWORD = ""

# False = watch the browser (good for debugging)
HEADLESS = True

# None = scroll until the very end
MAX_POSTS = None

# Pause between scrolls in seconds (be polite)
SCROLL_PAUSE = 4
# ─────────────────────────────────────────────


def login_if_needed(page):
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


def scrape_facebook_page(page_url: str, max_posts) -> list[dict]:
    results = []
    seen = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=HEADLESS,
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

        # Try to click into the Posts tab
        for selector in ['a:has-text("Posts")', 'a[href*="/posts"]']:
            try:
                page.click(selector, timeout=3000)
                time.sleep(2)
                break
            except PlaywrightTimeout:
                pass

        # ── Scroll & collect ──
        last_height = 0
        stall_count = 0

        print("[Scraper] Scrolling ...")
        while True:
            soup = BeautifulSoup(page.content(), "html.parser")

            # Grab every article block
            articles = soup.find_all("div", role="article")
            for article in articles:
                # Post text
                text_el = article.find("div", attrs={"data-ad-preview": "message"})
                text = (text_el or article).get_text(separator=" ", strip=True)

                if not text or len(text) < 20 or text in seen:
                    continue
                seen.add(text)

                # Post URL – look for a permalink <a> with a timestamp inside
                url = ""
                for a in article.find_all("a", href=True):
                    href = a["href"]
                    if "/posts/" in href or "/permalink/" in href or "story_fbid" in href:
                        # Strip tracking params
                        url = href.split("?")[0]
                        break

                # Date – Facebook puts Unix timestamp in abbr[data-utime]
                date = ""
                abbr = article.find("abbr", attrs={"data-utime": True})
                if abbr:
                    import datetime
                    ts = int(abbr["data-utime"])
                    date = datetime.datetime.utcfromtimestamp(ts).strftime("%Y-%m-%d %H:%M")

                results.append({"date": date, "url": url, "text": text})

            print(f"  ... {len(results)} posts", end="\r")

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


def save_csv(posts: list[dict], output_path: str):
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["date", "url", "text"])
        writer.writeheader()
        writer.writerows(posts)
    print(f"Saved {len(posts)} posts to {output_path}")


if __name__ == "__main__":
    if "YOUR_" in FACEBOOK_PAGE_URL:
        print("Fill in FACEBOOK_PAGE_URL in the CONFIG section.")
        exit(1)

    posts = scrape_facebook_page(FACEBOOK_PAGE_URL, MAX_POSTS)

    if not posts:
        print("No posts collected.")
        print("Tips: set HEADLESS=False to see what the browser sees,")
        print("      or add FACEBOOK_EMAIL/PASSWORD if there's a login wall.")
        exit(1)

    save_csv(posts, OUTPUT_CSV)