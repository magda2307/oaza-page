# Frontend Strategy — Oaza

Single source of truth for frontend design, UX, and content decisions.
Resolves conflicts between planning docs in `marketing/` and the actual implementation.

---

## 1. Brand

**Name:** Oaza (Polish for "oasis")
**Core truth:** We never say no — we accept FIV, FeLV, cancer, road accidents, terminally ill, and dying cats.
**Tone:** Warm but honest. Defiant compassion. Never generic, never pity-baiting.
**Audience:** Two equal groups — adopters willing to take a complex cat, and donors funding medical care.

---

## 2. Design Tokens

These are the canonical values. Use these, not what's in `marketing/product-marketing-context.md` (that document predates the implementation).

### Colors (Tailwind custom tokens)

| Token | Hex | Use |
|---|---|---|
| `brand-500` | `#2D6A4F` | Primary green — CTAs, active states, headings |
| `oaza-warm` | `#F4E8D1` | Background warmth — hero backgrounds, cards |
| `oaza-rust` | `#C1440E` | Accent rust — secondary CTAs, highlights |

### Typography

- Headings: **Playfair Display** (serif) — verify Polish diacritics render correctly at display sizes (ą, ę, ó, ś, ź, ż, ć, ń, ł)
- Body: **DM Sans** — clean, readable at small sizes
- Both fonts must be loaded with `font-display: swap`

---

## 3. URL Map

All routes use Polish slugs. This is the implemented structure — do not use the older `/adoptuj` or `/formularz-adopcyjny` paths from planning docs.

| Route | Page |
|---|---|
| `/` | Homepage |
| `/koty` | Cat listings with filters |
| `/koty/[id]` | Cat profile |
| `/koty/[id]/aplikuj` | Adoption application form |
| `/jak-adoptowac` | How to adopt (step-by-step) |
| `/wspieraj` | Donate |
| `/o-nas` | About |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog post |
| `/kontakt` | Contact |
| `/logowanie` | Login |
| `/rejestracja` | Register |
| `/moje-podania` | My applications (authenticated) |
| `/admin` | Admin dashboard |
| `/admin/koty` | Manage cats |
| `/admin/koty/nowy` | Add cat |
| `/admin/koty/[id]/edytuj` | Edit cat |
| `/admin/podania` | Manage applications |
| `/prywatnosc` | Privacy policy |
| `/regulamin` | Terms of use |

---

## 4. Navigation

- Max 5–6 items in the main nav
- `/koty` must be reachable in one click from anywhere
- CTA button sits rightmost in the header
- Mobile-first — most traffic arrives from Instagram/Facebook on mobile
- No mega-menu; simple header only

---

## 5. Homepage

### Section order

1. **Hero** — one cat, close-up, with a visible sign of illness or recovery
2. **Stats bar** — social proof counter (e.g. "W tym roku X kotów znalazło dom. Ostatni — 3 dni temu.")
3. **Featured cats** — 3–4 cards, rotated weekly
4. **How to adopt** — 4-step visual flow
5. **1.5% Podatku CTA** — standalone section, not buried in the donate page
6. **"Can't adopt? You can still help"** — donation section
7. **Latest adoption stories** — 2–3 testimonials or posts

### Hero CTAs

Both buttons are **equal weight** — no primary/secondary hierarchy. The two audiences (adopters and donors) are equally valuable.

- Button 1: **"Poznaj koty"** → `/koty`
  Micro-copy below: "Bez zobowiązań — po prostu przejrzyj."
- Button 2: **"Wesprzyj opiekę"** → `/wspieraj`
  Micro-copy below: "Nawet 20 zł pokrywa dzień leczenia."

---

## 6. Cat Listings (`/koty`)

### Filters

| Filter | Options |
|---|---|
| Wiek | Kocię / Dorosły / Senior |
| Płeć | Samica / Samiec |
| Charakter | Spokojny / Aktywny / Towarzyski / Nieśmiały |
| Odpowiedni dla | Dzieci / Inne koty / Alergicy / Pierwsze zwierzę |
| Dostępność | Od zaraz / Wkrótce |

- Default view: max 12 cats, then load-more
- Canonical tags required on all filtered URL variants to prevent duplicate indexing

### Future: Cat quiz

5-question quiz "Jaki kot pasuje do twojego stylu życia?" → 3 matching cat profiles. Not yet implemented; note here for planning.

---

## 7. Cat Profile Page

Five sections in order:

**A. Opening hook** — 2–3 sentences capturing personality, not medical history.
**B. Character traits** — 4–6 bullets. At least one "not for everyone" trait required; avoids false advertising.
**C. History** — factual, not overdramatised.
**D. Home requirements** — specific (e.g. "no small children", "single-cat household"), not generic.
**E. CTA** — Primary: "Chcę adoptować [imię]" → `/koty/[id]/aplikuj`. Secondary: "Napisz do nas w sprawie [imię]" → `/kontakt`.

---

## 8. Photography Art Direction

- **Hero image:** one cat, close-up, showing visible signs of illness or recovery. No cage shots. No staged "perfect cat" photos.
- **Profile photos:** bright warm light, cat at eye level, personality-showing action (playing, sleeping, curious). No shelter environments visible.
- **Editing:** warm tones, medium contrast — consistent across all cats.
- **Rationale:** Showing difficult reality builds trust (Pratfall Effect), not pity.
- **Alt text formula:** `[Cat name], [breed], [city/region]` — required for SEO and accessibility.

---

## 9. Trust Signals

Required on the site, placement noted:

| Signal | Location |
|---|---|
| KRS number | Footer |
| NGO status | About page + footer |
| Vet partner name + logo | About page |
| SSL + GDPR notice | Footer |
| Stats counter | Homepage stats bar |

---

## 10. Conversion Priority

In order of importance:

1. Submit adoption application for a specific cat
2. Redirect 1.5% podatku (lowest friction — a checkbox on a tax form)
3. Donate (one-time or monthly)
4. Sign up as foster home
5. Sign up as volunteer
6. Share a cat profile on social media

---

## 11. SEO Requirements

### Core Web Vitals targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

### Schema markup (JSON-LD)

| Schema type | Page |
|---|---|
| `Organization` | Homepage |
| `Animal` / adoption schema | Cat profiles |
| `FAQPage` | `/jak-adoptowac` |
| `BreadcrumbList` | All pages |
| `Article` | Blog posts |

### robots.txt

- Block: `/admin`, adoption confirmation pages
- Allow AI crawlers explicitly: `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bingbot`

---

## 12. Tech Stack Reference

- Next.js 16.1.6 App Router + TypeScript + Tailwind CSS
- Package manager: **pnpm**
- API client: `frontend/lib/api.ts`
- Types: `frontend/types/index.ts`
- Auth: JWT in `localStorage` (`oaza_token`, `oaza_is_admin`)
- `useSearchParams()` must be wrapped in `<Suspense>` (already done in `/logowanie`)
- `next.config.ts` has `output: 'standalone'` and allows all HTTPS image hosts (tighten for production)

---

## 13. Source Files

Detailed rationale and copy live in these files. This document reflects the decisions; go there for the reasoning.

| File | Contains |
|---|---|
| `marketing/homepage-hero.md` | Final hero copy with psychology annotations |
| `marketing/copywriting.md` | Cat profile copy template |
| `marketing/cro-architecture-psychology.md` | CRO decisions, section-by-section |
| `marketing/seo-strategy.md` | Full SEO strategy |
| `marketing/social-content-strategy.md` | Social media + email sequences |
| `marketing/product-marketing-context.md` | Original positioning (some values superseded) |
