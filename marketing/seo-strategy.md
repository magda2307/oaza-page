# SEO + AI SEO Prompt — Cat Charity Poland

> Run after reading product-marketing-context.md

---

## Context

Polish cat adoption charity. Primary language: Polish. Target cities: Warszawa, Kraków, Wrocław, Poznań, Gdańsk, Łódź. We want to rank for people actively searching to adopt a cat in Poland, and to appear in AI-generated answers (ChatGPT, Gemini, Perplexity) when someone asks "jak adoptować kota w Polsce."

---

## Part 1: Keyword Strategy

Research and produce a complete keyword map for the following intent clusters:

**Cluster A — Adopcja kota (highest priority)**
Seed: "adopcja kota"
Find: city-specific variants, long-tail ("adoptuj kota warszawa", "schronisko koty do adopcji"), question variants ("jak adoptować kota", "co potrzeba żeby adoptować kota"), and comparison variants ("adoptować czy kupić kota")

**Cluster B — Koty do adopcji [miasto]**
One page per major Polish city. Map keywords for:
Warszawa, Kraków, Wrocław, Poznań, Gdańsk, Łódź, Katowice, Lublin

**Cluster C — Gatunki / typy (cat types people search for)**
"kotek do adopcji", "kot dorosły adopcja", "stary kot adopcja", "kocięta do adopcji bezpłatnie", "kot dachowiec adopcja"

**Cluster D — Informational / educational**
"jak przygotować mieszkanie na kota", "ile kosztuje utrzymanie kota", "kot dla alergika adopcja", "kot dla dziecka jaki wybrać", "1.5 procent podatku na zwierzęta"

**Cluster E — Volunteering / donation**
"wolontariat ze zwierzętami warszawa", "jak wesprzeć schronisko", "dom tymczasowy dla kota"

For each cluster: primary keyword, 5–10 secondary keywords, estimated intent (adopt / donate / learn / volunteer), suggested page to target.

---

## Part 2: On-Page SEO — Page-by-Page Requirements

For each of these pages, write:
- SEO title tag (max 60 chars, Polish)
- Meta description (max 155 chars, Polish, includes CTA)
- H1
- Suggested H2 structure
- Internal linking suggestions

Pages:
1. `/` — Strona główna
2. `/koty` — Wszystkie koty
3. `/adoptuj` — Jak adoptować
4. `/wspieraj` — Wesprzyj nas
5. `/domy-tymczasowe` — Domy tymczasowe
6. `/o-nas` — O nas
7. `/koty/warszawa` — (city landing page template)
8. `/aktualnosci` — Blog / aktualności

---

## Part 3: City Landing Pages Strategy

We should have a page for each major Polish city even if we are Warsaw-based. These pages help us rank for "[miasto] + adopcja kota" searches and funnel people to our central adoption process.

For each city page template, specify:
- What unique local content to include (local shelters to reference, local 500+ programme details if applicable)
- How to differentiate from the main /koty page
- Local schema markup requirements

---

## Part 4: Technical SEO Checklist

Audit and produce implementation instructions for:

- [ ] Hreflang (Polish only, but future-proof for English summary pages)
- [ ] Canonical tags on filtered /koty pages (prevent duplicate content from filters)
- [ ] Image alt text strategy for cat photos (include cat name, breed, location)
- [ ] Page speed — critical for Hetzner VPS + Cloudflare setup
- [ ] Sitemap.xml structure
- [ ] robots.txt — block /admin, /formularz-adopcyjny confirmation pages
- [ ] Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Structured data (see Part 5)

---

## Part 5: Schema Markup

Write complete JSON-LD schema for:

**A) Organisation schema (homepage)**
Include: name, url, logo, description, sameAs (social profiles), contactPoint, address

**B) Animal adoption listing (individual cat profile)**
Use schema.org/Animal or closest applicable type. Include: name, description, image, offers (adoption fee if any), location

**C) FAQ schema (/adoptuj page)**
Write 8–10 realistic FAQs a Polish adopter would search for, with answers. These also feed into AI search visibility.

**D) BreadcrumbList (all pages)**

**E) Article schema (/aktualnosci posts)**

---

## Part 6: AI SEO (AEO / GEO / LLMO)

Goal: appear in ChatGPT, Gemini, and Perplexity answers when someone asks:
- "jak adoptować kota w Polsce"
- "gdzie adoptować kota w Warszawie"
- "najlepsze schroniska dla kotów Polska"
- "1.5 procent podatku na zwierzęta"

Actions:
1. Write a comprehensive /adoptuj page that directly and completely answers "jak adoptować kota w Polsce" — structured as question/answer pairs, thorough, factual, linkable
2. Write an /o-nas page that establishes authority: founding year, number of cats rehomed, TNR numbers, team credentials
3. Identify 5 specific Polish animal welfare facts/statistics we should publish as original content to get cited by AI systems
4. Suggest a Wikipedia-style "about the organisation" content structure
5. List 10 authoritative Polish websites we should seek backlinks from (animal welfare orgs, city councils, vet associations, Polish media)

---

## Part 7: Blog / Content Strategy (SEO-driven)

Produce a 6-month content calendar with:
- 2 posts per month
- Mix of: adopter guides, cat care tips, success stories, local news, educational
- Each post mapped to a keyword cluster
- Suggested internal linking for each post
- Estimated search volume potential

Priority articles to write first:
1. "Jak adoptować kota krok po kroku — kompletny przewodnik 2025"
2. "Adoptuj zamiast kupuj — dlaczego warto wybrać schronisko"
3. "Kot w bloku — co musisz wiedzieć przed adopcją"
4. "1,5% podatku na fundację — jak to zrobić w 5 minut"
5. "Jak przygotować mieszkanie na przybycie kota"
