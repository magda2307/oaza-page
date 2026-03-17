# Oaza — Comprehensive Frontend Plan

> **How to use this document:** This is the single source of truth for building and evolving the frontend. `FRONTEND_STRATEGY.md` covers brand values and high-level decisions. This document covers *implementation*: every component, every page layout, every technical choice.
>
> **Source of truth for aesthetics:** `.impeccable.md` in the project root. Every design decision should be cross-referenced there. The single question: *does this give the photo room to speak?*

---

## 0. Implementation Priority Order

Build in this sequence — each layer unblocks the next.

| Phase | Deliverable |
|---|---|
| **1 — Foundation** | Fonts, Tailwind tokens, global utilities, base component library |
| **2 — Core pages** | Homepage, `/koty`, `/koty/[id]`, `/koty/[id]/aplikuj` |
| **3 — Convert & engage** | `/wspieraj`, `/jak-adoptowac`, `/kontakt` |
| **4 — Story & trust** | `/o-nas`, `/sukcesy`, `/partnerzy`, `/blog` |
| **5 — Auth & account** | `/logowanie`, `/rejestracja`, `/moje-podania`, middleware |
| **6 — Admin polish** | Admin CRUD pages, photo upload, stats dashboard |
| **7 — SEO & perf** | Schema markup, sitemap, image optimization, Core Web Vitals |

---

## 1. Foundation: Design Tokens & Globals

### 1.1 Fonts

Add to `app/layout.tsx` via `next/font/google`:

```ts
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],   // latin-ext covers Polish diacritics
  weight: ['400', '700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})
```

Apply both CSS variables to `<html>` tag. **Verify** Polish diacritics render at display sizes: ą ę ó ś ź ż ć ń ł

### 1.2 Tailwind Config (`tailwind.config.ts`)

```ts
fontFamily: {
  display: ['var(--font-display)', 'Georgia', 'serif'],
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
},
colors: {
  'oaza-green':  '#2D6A4F',
  'oaza-warm':   '#F4E8D1',
  'oaza-rust':   '#C1440E',
  brand: {
    50:  '#f0f7f3', 100: '#d9ede3', 200: '#b3dac7', 300: '#80c0a3',
    400: '#4da07d', 500: '#2D6A4F', 600: '#245840', 700: '#1c4632',
    800: '#153524', 900: '#0e2318',
  },
},
```

### 1.3 Typography Scale

| Role | Tailwind classes | Use |
|---|---|---|
| Display | `font-display font-black text-5xl lg:text-7xl xl:text-8xl leading-[0.95]` | Hero headline |
| H1 | `font-display font-bold text-4xl lg:text-5xl leading-tight` | Page titles |
| H2 | `font-display font-bold text-3xl lg:text-4xl leading-tight` | Section headings |
| H3 | `font-display font-bold text-2xl leading-snug` | Card/subsection headings |
| H4 | `font-sans font-semibold text-xl` | Intra-section headings |
| Eyebrow | `font-sans font-medium text-xs uppercase tracking-widest text-oaza-rust` | Labels above headings |
| Body | `font-sans text-base leading-relaxed text-stone-700` | Default text |
| Body large | `font-sans text-lg leading-relaxed text-stone-700` | Intro paragraphs |
| Small | `font-sans text-sm text-stone-500` | Metadata, captions |
| Caption | `font-sans text-xs text-stone-400` | Badges, timestamps |

**Text-on-background rules:**
- On `oaza-green`: use `text-white` (headlines) and `text-green-100/80` (body)
- On `oaza-warm`: use `text-stone-900` (headlines) and `text-stone-700` (body)
- On `white`: use `text-stone-900` (headlines) and `text-stone-700` (body)

### 1.4 Spacing Rhythm

| Context | Vertical padding |
|---|---|
| Hero sections | `py-20 lg:py-28` |
| Major content sections | `py-16 lg:py-24` |
| Compact sections (stats, CTA strip) | `py-12 lg:py-16` |
| Card internal | `p-5 lg:p-6` |
| Between sibling elements in section | `mt-8 lg:mt-12` |

**Max-width containers:**

| Context | Class |
|---|---|
| Full-width sections | none (background bleeds) |
| Hero inner content | `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` |
| General page content | `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8` |
| Text-heavy (blog, legal) | `max-w-2xl mx-auto px-4` |
| Form pages | `max-w-lg mx-auto px-4` |

### 1.5 Section Background Alternation

Apply consistently in this order across all pages:
1. Hero — `oaza-green` text (or photo)
2. First content section — `oaza-warm` (`bg-[#F4E8D1]`)
3. Second content section — `white` (`bg-white`)
4. Impact/stats — `oaza-green` text (`bg-[#2D6A4F]`)
5. Testimonials/stories — `oaza-warm`
6. Final CTA strip — `oaza-rust` (`bg-[#C1440E]`)

---

## 2. Base Component Library

### 2.1 Buttons

```
btn-primary   → bg-oaza-rust text-white rounded-full px-7 py-3 font-sans font-semibold
                hover:bg-[#a33a0b] transition-colors duration-200

btn-secondary → border-2 border-oaza-green text-oaza-green rounded-full px-7 py-3
                hover:bg-oaza-green hover:text-white transition-colors duration-200

btn-ghost     → border-2 border-white text-white rounded-full px-7 py-3
                hover:bg-white hover:text-oaza-green transition-colors duration-200
                (use on oaza-green or dark backgrounds only)

btn-sm        → same patterns but px-5 py-2 text-sm

Link buttons  → no border, just text + underline on hover; use for secondary nav links
```

**Rules:** ALL buttons use `rounded-full`. No rectangular buttons anywhere. No box shadows on buttons. No gradients on buttons.

### 2.2 Cat Card — Three Sizes

**Small (grid card)** — used in `/koty` grid, related cats:
```
Aspect ratio:  4:3 (aspect-[4/3])
Container:     rounded-2xl overflow-hidden relative group cursor-pointer
Photo:         fill + object-cover, scale-105 on group-hover, duration-500
Badge (age):   top-right, bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium
Badge (adopted): top-left, bg-oaza-rust/90 text-white rounded-full px-2.5 py-1 text-xs
Tag chips:     bottom-left, flex gap-1.5, first 3 tags only (CatTagsCompact)
Gradient:      absolute inset-0 bg-gradient-to-t from-black/40 to-transparent
Name overlay:  absolute bottom-3 left-3 text-white font-display font-bold text-xl
```

**Medium (spotlight card)** — used on homepage, `/koty` featured:
```
Layout:        flex row on lg+ (photo left 55%, details right 45%), stacked on mobile
Photo aspect:  16:9 on desktop (rounded-2xl left side), 4:3 on mobile
Details panel: p-8, bg-oaza-warm
Headline:      font-display font-bold text-3xl text-stone-900
Tags:          full CatTags component (all tags, categorized)
CTAs:          btn-primary "Adoptuj [imię]" + secondary link "Więcej o [imię]"
```

**Large (cat profile hero)** — used in `/koty/[id]`:
```
Layout:        60% photo / 40% details panel at lg+, stacked on mobile
Photo aspect:  3:4 portrait on desktop, 4:3 on mobile
Details panel: sticky position on desktop (top-8), bg-white, rounded-2xl, p-8, shadow-sm
Tags:          prominent, full width, all categories shown
CTA:           btn-primary full-width on mobile
```

### 2.3 Form Inputs

```
input base:    w-full rounded-xl border border-stone-200 px-4 py-3 font-sans text-base
               text-stone-900 placeholder:text-stone-400
               focus:outline-none focus:ring-2 focus:ring-oaza-green focus:border-transparent
               transition-shadow duration-200

input error:   ring-2 ring-oaza-rust border-oaza-rust

input disabled: opacity-50 cursor-not-allowed bg-stone-50

textarea:      same as input + resize-none min-h-[120px]

label:         font-sans font-medium text-sm text-stone-700 mb-1 block

error message: text-xs text-oaza-rust mt-1 flex items-center gap-1
```

### 2.4 Status Badges

```
pending:   bg-amber-100 text-amber-800 border border-amber-200
approved:  bg-emerald-100 text-emerald-800 border border-emerald-200
rejected:  bg-red-100 text-red-800 border border-red-200

All:       rounded-full px-3 py-1 text-xs font-sans font-medium inline-flex items-center gap-1.5
```

### 2.5 Blockquotes

```
border-l-4 border-oaza-green pl-6 relative
Ornamental quote mark: before: content-['"'] font-display text-8xl text-oaza-green/20
                       absolute -top-4 -left-2
Quote text:   font-display text-xl lg:text-2xl italic text-stone-800 leading-relaxed
Attribution:  mt-4 font-sans text-sm text-stone-500 not-italic
```

### 2.6 Section Header Pattern

Use consistently before major content blocks:
```
Eyebrow (optional): text-xs font-medium uppercase tracking-widest text-oaza-rust mb-3
Headline:           font-display font-bold text-3xl lg:text-4xl text-stone-900
                    (on dark bg: text-white)
Subheadline (opt):  font-sans text-lg text-stone-600 mt-4 max-w-2xl
                    (on dark bg: text-green-100)
Spacing after:      mb-10 lg:mb-14
```

### 2.7 Tag Chips — Category Colors

| Category | Background | Text | Border |
|---|---|---|---|
| Health critical (fiv, felv, nowotwor…) | `bg-red-100` | `text-red-800` | `border-red-200` |
| Personality (przytulasek, spokojny…) | `bg-emerald-100` | `text-emerald-800` | `border-emerald-200` |
| Compatibility (lubi_koty, lubi_dzieci…) | `bg-sky-100` | `text-sky-800` | `border-sky-200` |
| Behavioral caution (plochliwy, jako_jedynak…) | `bg-amber-100` | `text-amber-800` | `border-amber-200` |
| Special needs (senior, trojnog, gluchy…) | `bg-violet-100` | `text-violet-800` | `border-violet-200` |

All chips: `rounded-full px-2.5 py-0.5 text-xs font-medium border inline-flex items-center gap-1`

---

## 3. Page-by-Page Specifications

### 3.1 Homepage (`/`)

**Server Component.** Fetch featured cats server-side.

#### Section order:
1. Hero
2. Stats bar
3. Featured cats (Urgent cases)
4. How it works (teaser)
5. Impact numbers
6. 1.5% podatku CTA
7. Latest success story
8. Donate CTA strip

#### Hero Section
```
Background:     bg-[#2D6A4F] (oaza-green)
Layout:         Split — copy left (55%) / hero photo right (45%) at lg+
                Stacked photo-first on mobile

Left side:
  Eyebrow:      "Schronisko z prawdziwymi historiami"
  Headline:     font-display font-black text-5xl lg:text-7xl text-white leading-[0.95]
                "Nigdy nie mówimy nie."
  Subheadline:  text-lg text-green-100/90 mt-6 max-w-md
                (from marketing/homepage-hero.md)
  CTAs:         Two equal-weight pill buttons side by side:
                  btn-ghost "Poznaj koty" → /koty
                  btn-ghost "Wesprzyj opiekę" → /wspieraj
                Micro-copy under each (text-xs text-green-100/70)
  Scroll hint:  animated arrow at bottom on desktop

Right side:
  Cat photo:    rounded-2xl overflow-hidden aspect-[3/4]
                Priority image (above fold), width=600
                Frosted badge overlay: age (top-right), diagnosis tag (bottom-left)
                Bottom gradient: from-black/40 to-transparent
```

#### Stats Bar
```
Background:     bg-oaza-warm
Layout:         flex row, 4 stats across on desktop, 2×2 on mobile
Each stat:
  Number:       font-display font-black text-5xl text-oaza-green (AnimatedCounter)
  Label:        font-sans text-sm text-stone-600 mt-1
Stats:          [N] kotów pod opieką  |  [N] adopcji  |  [N] lat działalności  |  "Ostatnia — [X] dni temu"
```

#### Featured Cats Section
```
Background:     bg-white
Header:         Section Header pattern — eyebrow "Pilne przypadki", headline "Czekają na dom"
Layout:         CatCarousel component (marquee, pauses on hover)
                Pass 8–12 cats with urgent tags (fiv/felv/nowotwor/terminalnie_chory first)
CTA below:      btn-secondary centered "Zobacz wszystkie [N] kotów" → /koty
```

#### How It Works Teaser
```
Background:     bg-oaza-warm
Header:         "Jak wygląda adopcja?" — H2 centered
Layout:         3 steps in a row at md+, vertical on mobile
                StepConnector between steps on desktop
Each step:
  Number:       Large circle, bg-oaza-green/10, text-oaza-green font-display font-black text-3xl
  Title:        font-sans font-semibold text-stone-900
  Copy:         1–2 sentences, text-stone-600
CTA:            btn-secondary "Poznaj cały proces" → /jak-adoptowac
```

#### Impact Numbers
```
Background:     bg-[#2D6A4F]
Layout:         4 oversized numbers in a row
Numbers:        AnimatedCounter — font-display font-black text-7xl text-white
Labels:         text-green-200 text-sm font-sans
Example stats:  "4 lata" / "340+ kotów" / "22 zł miesięczne leczenie" / "8 stałych partnerów"
```

#### 1.5% Podatku CTA
```
Background:     bg-oaza-warm
Layout:         Centered, single column, max-w-2xl
Headline:       "Przekaż 1,5% podatku — bez kosztów"
Copy:           2–3 sentences on how simple it is
KRS number:     Prominently displayed in a styled callout box
CTA:            btn-primary "Dowiedz się jak" → /wspieraj#podatek
```

#### Latest Success Story Teaser
```
Background:     bg-white
Layout:         1 featured SuccessStoryCard (large, with full quote)
CTA:            btn-secondary "Więcej historii" → /sukcesy
```

#### Donate CTA Strip
```
Background:     bg-[#C1440E] (oaza-rust)
Layout:         centered text + single CTA
Headline:       text-white font-display font-bold text-3xl "Twoje 22 zł = miesiąc leczenia"
CTA:            btn-ghost "Wesprzyj teraz" → /wspieraj
```

---

### 3.2 Cat Listings (`/koty`)

**Server Component** wrapping client `<CatFilterBar>`.

```
Layout:         Full page, max-w-6xl container

Top:
  H1:           "Koty szukające domu"  (font-display font-bold text-4xl)
  Subheadline:  Count of available cats: "X kotów czeka na nowego właściciela"

Filter bar:     Sticky below nav (top-[64px] z-10 bg-white/95 backdrop-blur-sm border-b)
                Horizontal scroll on mobile, wrap on desktop
                Pills: Wiek / Płeć / Charakter / Odpowiedni dla / Dostępność
                Active filter: bg-oaza-green text-white
                Clear all: ghost text link (visible only when filters active)

Grid:           3 cols on lg+, 2 cols on sm+, 1 col on mobile
                gap-6
                CatCard (small) for each cat

Spotlight:      One "featured" or most urgent cat gets a CatCard (medium) spanning full width
                Placed before the grid

Adopted section: Separate section below, bg-oaza-warm/50
                 Header: "Dom znaleziony ✓"
                 CatCarousel of adopted cats (grayscale filter, striped badge)

Pagination:     Pagination component below grid
                Show: "Strona X z Y" + prev/next + page numbers

Empty state:    EmptyState component with cat illustration, "Brak kotów spełniających kryteria"
                CTA: "Wyczyść filtry"
```

---

### 3.3 Cat Profile (`/koty/[id]`)

**Server Component.** `generateStaticParams` + ISR `revalidate: 3600`.

```
SEO:            generateMetadata: title "[Imię] — kot do adopcji w Oaza"
                description: first 160 chars of cat description
                OG image: cat photo_url

Hero section:   bg-white
  Layout:       60% photo (left) / 40% sticky panel (right) at lg+
                Stacked on mobile (photo first)

  Photo area:
    Main photo:   aspect-[3/4] on desktop, aspect-[4/3] on mobile
                  rounded-2xl overflow-hidden
                  Priority image
    Photo gallery: thumbnail strip below main (if multiple photos — future)

  Details panel: sticky top-8 bg-oaza-warm rounded-2xl p-8
    Name:         font-display font-black text-4xl text-stone-900
    Breed + age:  font-sans text-stone-500 text-sm mt-1
    Tags:         CatTags full component (all categories, grouped)
    CTA:          btn-primary full-width "Chcę adoptować [imię]" → /koty/[id]/aplikuj
                  (disabled with "Znalazł dom ✓" if is_adopted)
    Secondary:    link "Napisz do nas w sprawie [imię]" → /kontakt

Story section:  bg-oaza-warm py-16
  Layout:       max-w-2xl mx-auto (reading column)
  Sections A–E: per FRONTEND_STRATEGY section 7
  Each subsection has an H3 eyebrow label

Requirements section: bg-white py-16
  Layout:       2-column spec grid at md+
  Items:        "Dobre dla dzieci" / "Dobre dla kotów" / "Tylko w domu" etc.
                icon + label + yes/no/maybe indicator

Related cats:   bg-oaza-warm py-12
  Header:       "Inne koty, które mogą Cię zainteresować"
  Layout:       3 CatCards (small) — same tags as this cat, excluding this cat
  (Static mock until backend supports /cats/{id}/related)

Mobile sticky bar: StickyAdoptCTA — fixed bottom-0, bg-white border-t shadow-lg
  Only visible on mobile (lg:hidden)
  Contains: cat name + btn-primary "Adoptuj"
```

---

### 3.4 Adoption Application (`/koty/[id]/aplikuj`)

**Server Component** wrapper → **Client** `<ApplicationForm>`.

```
Background:     bg-oaza-warm min-h-screen

Layout:         max-w-lg mx-auto py-16 px-4

Cat reminder card:
  bg-white rounded-2xl p-5 flex items-center gap-4 mb-8
  Photo (64px square, rounded-xl) + name + top diagnosis tag

Form:
  Heading:      "Opowiedz nam o sobie"
  Label:        "Dlaczego chcesz adoptować [imię]?"
  Textarea:     min-h-[200px], placeholder hints (lifestyle, home, experience)
  Note below:   text-xs text-stone-500 "Odpiszemy w ciągu 2–3 dni roboczych."
  Auth gate:    if not logged in → show login prompt card instead of form
  Submit:       btn-primary full-width "Wyślij podanie"
                Loading: spinner in button, disabled

Success state:  Replace form with success card
  Checkmark illustration + "Podanie wysłane!" + what happens next + link → /moje-podania
```

---

### 3.5 Donation Page (`/wspieraj`)

**Currently only 54 lines — this needs a full build.**

```
Background sequence: oaza-green hero → oaza-warm → white → oaza-green → oaza-warm

Section 1 — Hero:
  bg-oaza-green
  Headline:     "Twoje wsparcie ratuje życie"
  Subheadline:  "Każda złotówka trafia bezpośrednio do kasy leczenia."
  Stats strip:  3 quick impact facts inline

Section 2 — Donation Widget (oaza-warm):
  DonationWidget (CLIENT component):
    Tabs:         "Jednorazowo" / "Co miesiąc" (toggles recurring flag)
    Amount pills: 22 / 50 / 100 / 200 zł + "Inna kwota" (shows text input)
    Active pill:  bg-oaza-rust text-white
    Impact line:  dynamic text below pills showing what that amount covers
    CTA:          btn-primary "Wesprzyj [X] zł"

  Trust note:   Beneath widget — org registration number, vet partner

Section 3 — Impact Breakdown (white):
  Heading:      "Co kupuje Twoja wpłata?"
  ImpactTier list:
    22 zł → "Miesiąc tabletek dla kota z FIV"
    50 zł → "Wizyta kontrolna u weterynarza"
    100 zł → "Badanie krwi + USG jamy brzusznej"
    200 zł → "Tydzień intensywnej terapii po wypadku"
    500 zł → "Operacja lub kurs chemioterapii"
  Layout:       2-col at md+, 1-col mobile — each tier in a card with icon

Section 4 — Urgent Cases (oaza-green):
  Heading:      "Teraz potrzebują Twojej pomocy" (text-white)
  Layout:       3 cat cards (showing cats with fiv/felv/nowotwor/terminalnie_chory tags)
  Each card:    adapted for dark background (white card)
  CTA per card: "Pomóż [imię]" → /koty/[id]

Section 5 — Bank Transfer (oaza-warm):
  id="podatek" (for anchor link from homepage)
  Styled callout card: white bg, oaza-green left border, rounded-2xl
  Content:      "Przelew bankowy" — account number, BIC, reference format
  1.5% section: KRS number in large bold + how to enter on PIT form

Section 6 — Transparency note:
  bg-white, centered text
  "Jesteśmy organizacją pożytku publicznego. Każde wydanie jest jawne."
  Link to financial reports (if exists)
```

---

### 3.6 How to Adopt (`/jak-adoptowac`)

```
Hero:         bg-oaza-warm, H1 "Jak wygląda adopcja?", text-stone-900
              Subheadline: "Uczciwie, bez ściemy."

Steps section: bg-white
  5 steps (or 4 from current implementation), vertical timeline on mobile
  StepConnector between steps on desktop (horizontal)
  Each step:
    Number badge: 40px circle bg-oaza-green text-white font-display font-bold text-xl
    Title:        font-sans font-semibold text-lg text-stone-900
    Copy:         text-stone-600 leading-relaxed max-w-sm

FAQ section:  bg-oaza-warm
  Accordion component (client)
  Questions sourced from real adopter questions (see marketing docs)
  Schema: FAQPage JSON-LD in page metadata

End CTA:      bg-oaza-green
  "Gotowy? Poznaj koty." → btn-ghost → /koty
```

---

### 3.7 About (`/o-nas`)

```
Hero:           bg-oaza-green
  Eyebrow:      "O nas"
  Headline:     "Kiedy wszyscy mówią nie — my mówimy tak."
  Subheadline:  1–2 sentences on origin

Origin story:   bg-oaza-warm
  Layout:       prose max-w-2xl — honest, specific, no corporate language
  Photo:        founder/team photo (if available), rounded-2xl

"What makes us different":  bg-white
  Layout:       2-col grid at md+ with icon + text pairs
  Items:        Specific: "Przyjmujemy koty z FIV i FeLV" / "Koty po wypadkach" /
                "Opieka paliatywna" / "Bez limitu wiekowego" / etc.

Stats bar:      bg-oaza-green (AnimatedCounter, same as homepage)

Partners/vets:  bg-oaza-warm
  Heading:      "Nasi partnerzy"
  PartnerLogoStrip: grayscale logos, color on hover

Trust signals:  bg-white, centered
  KRS, NGO status, registration date

Team (optional): cards with photos if team content exists
```

---

### 3.8 Blog (`/blog`)

```
Layout:         max-w-5xl

Featured post:  Full-width BlogCard (large) — most recent or pinned
                Photo left 60%, content right 40% at lg+
                Category tag, H2 title, excerpt, date + read time

Category tabs:  horizontal scroll pill tabs below featured post
                All / Adopcje / Zdrowie / Historie / Fundacja

Grid:           3-col at lg+, 2-col at md+, 1-col mobile
                BlogCard (medium) for remaining posts

Each card:      photo (4:3), category chip, title, excerpt, date, estimated read time

Pagination:     below grid

Schema:         Organization + Article schema per post
```

**Backend note:** Blog posts are likely static MDX or a future endpoint. For now, use static data in `app/blog/data.ts` or MDX files in `content/blog/`.

---

### 3.9 Blog Post (`/blog/[slug]`)

```
generateStaticParams: build all slugs at build time
generateMetadata:     dynamic from post frontmatter

Hero:           full-width image, max-h-[500px] object-cover
                category chip overlaid bottom-left (same as cat tags style)

Article body:   max-w-2xl mx-auto px-4 py-12
  H1:           font-display font-bold text-4xl text-stone-900 mb-4
  Meta:         date + author + read time — text-sm text-stone-500
  Body:         font-sans text-base leading-relaxed text-stone-700
                prose-headings:font-display
                Block quotes → existing blockquote style
                Inline cat cards: if cat ID mentioned, show CatCard (small)

Share bar:      ShareBar component — sticky left rail on desktop, below article on mobile
                Links: Twitter/X, Facebook, copy link

Related posts:  3 cards at bottom (same category)

CTA footer:     If post mentions a specific cat → link to cat profile
                General: "Zainspirowany? Poznaj koty" → /koty
```

---

### 3.10 Contact (`/kontakt`)

```
Background:     bg-oaza-warm min-h-screen

Layout:         2-col at lg+ (form 55%, info 45%), single col on mobile

Form side:
  Heading:      "Napisz do nas"
  ContactForm (CLIENT):
    Fields:     Imię i nazwisko, Email, Temat (select), Wiadomość
    Validation: inline, Polish error messages
    Submit:     btn-primary "Wyślij wiadomość"
    Success:    replace form with success card (no redirect)

Info side:
  Email address (styled)
  Social media links
  Optional: embedded map or address
  Response time note: "Odpisujemy w ciągu 1–2 dni roboczych"
```

---

### 3.11 Auth Pages (`/logowanie`, `/rejestracja`)

```
Background:   bg-oaza-warm min-h-screen

Layout:       Centered single column, max-w-sm

Top:          Oaza logo/wordmark (linked to /)
Heading:      "Zaloguj się" / "Zarejestruj się"
Social proof: text-sm text-stone-500 "Dołącz do X osób, które adoptowały koty"

Form:         AuthForm (CLIENT) — email + password + submit
              /logowanie: "Zapomniane hasło?" link (future)
              /rejestracja: password confirmation field, GDPR checkbox
Submit:       btn-primary full-width
              Loading: spinner + disabled

Link below:   "Nie masz konta? Zarejestruj się" ↔ vice versa
```

---

### 3.12 My Applications (`/moje-podania`)

**Client Component** (reads auth token from localStorage).

```
Auth guard:   Redirect to /logowanie?next=/moje-podania if no token

Heading:      "Moje podania"

Application cards:
  Layout:     single column list, gap-4
  Each card:  bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm
    Photo:    64px cat thumbnail (or placeholder)
    Content:  Cat name (H3), status badge, application date, message preview (2 lines)
    CTA:      link to cat profile

Empty state:  EmptyState — "Nie złożyłeś jeszcze żadnego podania"
              CTA: btn-primary "Znajdź kota" → /koty

Status badge colors: per section 2.4
```

---

### 3.13 Success Stories (`/sukcesy`)

```
Hero:         bg-oaza-green
  Headline:   "Koty, które znalazły dom"
  Subheadline: "Każda historia zaczęła się od diagnozy, która brzmiała jak wyrok."

Filter tabs:  SuccessFilter component — by story_type:
              Wszystkie / FIV i FeLV / Po wypadku / Terminal / Seniory / Specjalne potrzeby

Grid:         2-col at lg+, 1-col mobile, gap-8
  SuccessStoryCard:
    Photo:    aspect-square rounded-2xl, diagnosis tag chips overlaid
    Quote:    blockquote style (large, italic)
    Attribution: adopter_name, adopter_city, adoption_year
    CTA:      "Przeczytaj pełną historię" → /blog/[story_slug] (if exists)

Backend note: SuccessStory data is static for now (hardcoded in page or JSON file)
              Future endpoint: GET /success-stories
```

---

### 3.14 Partners (`/partnerzy`)

```
Minimal page:
  Hero:       bg-oaza-warm, "Nasi partnerzy"
  Partners:   grid of logo cards, each with name + description + link
  CTA:        contact form link for new partner inquiries
```

---

### 3.15 Admin Pages (`/admin/*`)

Functional over beautiful. Clean, minimal admin UI using existing `.card`, `.badge-*`, `.btn-*` classes.

```
/admin:           Quick stats (total cats, pending applications) + links to sections
/admin/koty:      Table of cats — name, tags, status, edit/delete actions
/admin/koty/nowy: Cat form — name, age, breed, description, TagPicker, photo upload
/admin/koty/[id]/edytuj: Same form pre-filled
/admin/podania:   Table of applications — cat name, applicant email, date, status badge
                  Approve/Reject buttons inline

Admin guard:      Redirect non-admins to / (client-side check on mount)
```

---

## 4. Component Architecture

### 4.1 New Components to Create

| Component | Path | Type | Props summary | Pages |
|---|---|---|---|---|
| `CatCard` | `components/CatCard.tsx` | Server | `cat: Cat, size: 'small'\|'medium'\|'large'` | All cat displays |
| `CatProfileHero` | `components/CatProfileHero.tsx` | Server | `cat: Cat` | `/koty/[id]` |
| `StickyAdoptCTA` | `components/StickyAdoptCTA.tsx` | Client | `catId: number, isAdopted: boolean, catName: string` | `/koty/[id]` |
| `ApplicationForm` | `components/ApplicationForm.tsx` | Client | `catId: number, catName: string` | `/koty/[id]/aplikuj` |
| `DonationWidget` | `components/DonationWidget.tsx` | Client | `amounts: number[]` | `/wspieraj` |
| `ImpactTier` | `components/ImpactTier.tsx` | Server | `amount: number, description: string, icon: string` | `/wspieraj` |
| `ContactForm` | `components/ContactForm.tsx` | Client | none | `/kontakt` |
| `Accordion` | `components/Accordion.tsx` | Client | `items: {question, answer}[]` | `/jak-adoptowac` |
| `Pagination` | `components/Pagination.tsx` | Client | `page, pages, onPageChange` | `/koty`, `/blog` |
| `BlogCard` | `components/BlogCard.tsx` | Server | `post: BlogPost, size: 'small'\|'large'` | `/blog` |
| `BlogPostBody` | `components/BlogPostBody.tsx` | Server | `content: string` | `/blog/[slug]` |
| `ShareBar` | `components/ShareBar.tsx` | Client | `url: string, title: string` | `/blog/[slug]` |
| `StatsSection` | `components/StatsSection.tsx` | Server (client counter) | `stats: StatItem[]` | Homepage, `/o-nas` |
| `PartnerLogoStrip` | `components/PartnerLogoStrip.tsx` | Server | `partners: Partner[]` | `/o-nas`, `/partnerzy` |
| `EmptyState` | `components/EmptyState.tsx` | Server | `title, description, ctaLabel, ctaHref` | Multiple |
| `Breadcrumb` | `components/Breadcrumb.tsx` | Server | `items: {label, href}[]` | `/koty/[id]`, blog |
| `SkeletonCard` | `components/SkeletonCard.tsx` | Server | `count?: number` | Loading states |
| `Toast` | `components/Toast.tsx` | Client | `message, type: 'success'\|'error'` | After form submits |
| `Modal` | `components/Modal.tsx` | Client | `isOpen, onClose, children` | Lightbox, confirms |
| `AuthGuard` | `components/AuthGuard.tsx` | Client | `children, requireAdmin?` | Auth pages |

### 4.2 Server vs Client Rules

**Server Components** (default — no `'use client'`):
- All page files (`app/*/page.tsx`) unless they need auth/browser APIs
- CatCard, CatProfileHero, BlogCard, ImpactTier, StatsSection layout, EmptyState, Breadcrumb, SkeletonCard

**Client Components** (`'use client'`):
- All forms (ContactForm, ApplicationForm, DonationWidget, auth forms)
- All interactive filters (CatFilterBar, SuccessFilter, category tabs)
- StickyAdoptCTA (checks adopted state, scroll behavior)
- Toast, Modal, Accordion
- AnimatedCounter (already client), CatCarousel (already client), Nav (already client)
- AuthGuard (reads localStorage)

**Pattern — server page + client island:**
```
// app/koty/[id]/page.tsx (Server)
const cat = await getCat(id)
return (
  <CatProfileHero cat={cat} />        {/* Server */}
  <StickyAdoptCTA                      {/* Client island */}
    catId={cat.id}
    isAdopted={cat.is_adopted}
    catName={cat.name}
  />
)
```

---

## 5. Type System Additions (`types/index.ts`)

```typescript
// Blog
interface BlogPost {
  slug: string
  title: string
  excerpt: string
  body: string                    // HTML or MDX string
  cover_image: string | null
  cover_image_alt: string
  category: 'adopcje' | 'zdrowie' | 'historie' | 'fundacja'
  tags: string[]
  published_at: string            // ISO date
  author: string
  read_time_minutes: number
  related_cat_ids?: number[]      // Link to cat profiles
}

// Partners
interface Partner {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  description: string
  type: 'weterynarz' | 'sponsor' | 'media' | 'ngo'
}

// Contact form
interface ContactFormData {
  name: string
  email: string
  subject: 'adopcja' | 'wolontariat' | 'sponsoring' | 'inne'
  message: string
}

// Stats (for homepage counters)
interface SiteStats {
  cats_available: number
  cats_adopted_total: number
  cats_adopted_this_year: number
  years_active: number
  days_since_last_adoption: number
}

// Donation
interface DonationOption {
  amount: number
  impact_description: string      // "Miesiąc tabletek dla kota z FIV"
}

// Extended cat for profile page
interface CatWithRelated extends Cat {
  related_cats: Cat[]
}

// Pagination with URL support
interface FilterState {
  age?: 'kociak' | 'dorosly' | 'senior'
  gender?: 'samica' | 'samiec'
  character?: string[]
  compatible_with?: string[]
  availability?: 'od_zaraz' | 'wkrotce'
}
```

---

## 6. API Client Additions (`lib/api.ts`)

```typescript
// Blog — static data until backend supports it
export async function getBlogPosts(category?: string, page = 1): Promise<Page<BlogPost>>
export async function getBlogPost(slug: string): Promise<BlogPost>

// Contact
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean }>

// Stats
export async function getSiteStats(): Promise<SiteStats>
  // Fallback: return static values if endpoint doesn't exist

// Success stories
export async function getSuccessStories(filter?: string): Promise<SuccessStory[]>

// Partners
export async function getPartners(): Promise<Partner[]>

// Newsletter
export async function subscribeNewsletter(email: string): Promise<{ success: boolean }>

// Admin
export async function uploadPhoto(file: File, token: string): Promise<{ url: string }>
export async function getAdminStats(token: string): Promise<SiteStats>

// Related cats (until backend supports it — client-side filter)
export function getRelatedCats(cat: Cat, allCats: Cat[], limit = 3): Cat[]
```

---

## 7. Utilities & Hooks (`lib/` additions)

### New utility files:

**`lib/tagUtils.ts`**
```typescript
export function tagToLabel(tag: string): string    // 'fiv' → 'FIV'
export function tagToCategory(tag: string): TagCategory
export function tagsToChips(tags: string[]): TagChip[]
export const TAG_CATEGORIES: Record<TagCategory, string[]>
```

**`lib/dateUtils.ts`**
```typescript
export function formatPolishDate(iso: string): string   // '15 marca 2025'
export function daysAgo(iso: string): number
export function polishPlural(n: number, forms: [string,string,string]): string
  // polishPlural(5, ['kot','koty','kotów']) → 'kotów'
```

**`lib/catUtils.ts`**
```typescript
export function getCatAge(age_years: number | null): string  // '2 lata' | 'Nieznany'
export function getUrgentTags(tags: string[]): string[]       // health-critical tags first
export function catMatchesFilter(cat: Cat, filter: FilterState): boolean
```

**`hooks/useAuth.ts`** (Client hook)
```typescript
export function useAuth(): {
  token: string | null
  isAdmin: boolean
  isLoggedIn: boolean
  logout: () => void
}
// Reads from localStorage, handles SSR (returns null server-side)
```

**`hooks/useDebounce.ts`**
```typescript
export function useDebounce<T>(value: T, delay: number): T
```

**`constants/cats.ts`**
```typescript
export const DONATION_AMOUNTS = [22, 50, 100, 200]
export const NAV_LINKS = [...]
export const FILTER_OPTIONS = { age: [...], gender: [...], ... }
```

---

## 8. Auth & Route Protection

### Middleware (`middleware.ts`)

```typescript
// Protect /moje-podania and /admin/* routes
// Check for oaza_token cookie (requires switching to httpOnly cookie for security)
// Until cookies are used: client-side redirect in AuthGuard component

export const config = {
  matcher: ['/moje-podania', '/admin/:path*']
}
```

**Current approach (localStorage-based):** Use `AuthGuard` client component that reads localStorage on mount and redirects if no token. This is the pattern already used.

**Token expiry:** Catch 401 responses in `apiFetch()` → clear localStorage + redirect to `/logowanie?next=[current-path]`.

### Auth Context (optional but recommended)

```typescript
// context/AuthContext.tsx
// Wraps the app, reads localStorage once on mount
// Provides: token, isAdmin, isLoggedIn, login(), logout()
// Prevents multiple localStorage reads across components
```

---

## 9. SEO & Metadata

### Per-page `generateMetadata`

| Page | Title | Description | OG Image |
|---|---|---|---|
| `/` | "Oaza — schronisko dla kotów z trudną historią" | 155 char brand statement | Hero cat photo |
| `/koty` | "Koty do adopcji — Oaza" | "Poznaj [N] kotów szukających domu..." | Grid collage |
| `/koty/[id]` | `"[Imię] — kot do adopcji \| Oaza"` | First 155 chars of description | `cat.photo_url` |
| `/wspieraj` | "Wesprzyj Oazę — pomóż kotom w leczeniu" | Impact statement | Urgent cat photo |
| `/jak-adoptowac` | "Jak adoptować kota — Oaza" | "Uczciwy przewodnik krok po kroku" | — |
| `/o-nas` | "O Oazie — kto jesteśmy i dlaczego to robimy" | Origin story excerpt | — |
| `/blog` | "Blog Oazy — historie adopcji i zdrowia kotów" | — | Featured post image |
| `/blog/[slug]` | `"[Post title] \| Blog Oaza"` | Post excerpt | `cover_image` |
| `/sukcesy` | "Historie adopcji — koty, które znalazły dom" | — | Gallery collage |
| `/kontakt` | "Kontakt — Oaza" | — | — |

### JSON-LD Schema (add to each page's `<Script type="application/ld+json">`)

| Page | Schema type |
|---|---|
| `/` | `Organization` |
| `/koty/[id]` | `Animal` (or generic `Thing` with adoption context) |
| `/jak-adoptowac` | `FAQPage` |
| `/blog/[slug]` | `Article` + `BreadcrumbList` |
| All pages | `BreadcrumbList` |

### robots.txt additions
```
Disallow: /admin
Disallow: /moje-podania
Allow: GPTBot
Allow: ClaudeBot
Allow: PerplexityBot
Allow: Google-Extended
```

---

## 10. Performance

### Image Strategy
- All above-fold images: `priority` prop on `next/image`
- Hero cat photo: `sizes="(max-width: 768px) 100vw, 50vw"` + `priority`
- Cat grid cards: `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Adopted cat carousel: `loading="lazy"`, smaller sizes
- Partner logos: `width` + `height` explicit, lazy

### Code Splitting
Dynamic imports for heavy client components:
```typescript
const CatCarousel = dynamic(() => import('@/components/CatCarousel'), { ssr: false })
const DonationWidget = dynamic(() => import('@/components/DonationWidget'), { ssr: false })
```

### ISR Strategy
| Page | Strategy |
|---|---|
| `/koty` | `revalidate: 300` (5 min) |
| `/koty/[id]` | `revalidate: 3600` (1 hr) + `generateStaticParams` |
| `/blog/[slug]` | `revalidate: 86400` (24 hr) + `generateStaticParams` |
| `/` | `revalidate: 600` (10 min) |

---

## 11. Missing Backend Features & Interim Fallbacks

| Feature | Status | Interim approach |
|---|---|---|
| Blog endpoints | Not built | Static MDX in `content/blog/` |
| Contact form endpoint | Not built | Mailto link or Formspree |
| Newsletter endpoint | Not built | Mailchimp embedded form |
| Stats endpoint | Not built | Hardcoded numbers in `constants/stats.ts` |
| Partners endpoint | Not built | Static data in `constants/partners.ts` |
| Success stories endpoint | Not built | Static data in `constants/successStories.ts` |
| Tag-based filtering | Client-only | CatFilterBar already does this client-side |
| Featured cat flag | Not in schema | Sort by urgency tags (fiv/felv/nowotwor first) |
| Related cats endpoint | Not built | Client-side tag matching in `catUtils.ts` |
| Cat gender field | Not in schema | Add `gender?: 'samica' \| 'samiec'` to Cat type + migration |
| Multiple photos per cat | Not in schema | `photo_url` is single — gallery UI deferred |

---

## 12. File Structure Additions

```
frontend/
├── app/
│   ├── wspieraj/page.tsx          ← needs full rebuild
│   ├── o-nas/page.tsx             ← needs build
│   ├── sukcesy/page.tsx           ← needs build
│   ├── partnerzy/page.tsx         ← needs build
│   ├── blog/
│   │   ├── page.tsx               ← needs build
│   │   └── [slug]/page.tsx        ← needs build
│   └── not-found.tsx              ← needs design
│
├── components/
│   ├── CatCard.tsx                ← extract + enhance
│   ├── CatProfileHero.tsx         ← new
│   ├── StickyAdoptCTA.tsx         ← new
│   ├── ApplicationForm.tsx        ← extract from page
│   ├── DonationWidget.tsx         ← new
│   ├── ImpactTier.tsx             ← new
│   ├── ContactForm.tsx            ← new
│   ├── Accordion.tsx              ← new
│   ├── Pagination.tsx             ← new
│   ├── BlogCard.tsx               ← new
│   ├── BlogPostBody.tsx           ← new
│   ├── ShareBar.tsx               ← new
│   ├── StatsSection.tsx           ← new
│   ├── PartnerLogoStrip.tsx       ← new
│   ├── EmptyState.tsx             ← new
│   ├── Breadcrumb.tsx             ← new
│   ├── SkeletonCard.tsx           ← new
│   ├── Toast.tsx                  ← new
│   ├── Modal.tsx                  ← new
│   └── AuthGuard.tsx              ← new
│
├── hooks/
│   ├── useAuth.ts                 ← new
│   └── useDebounce.ts             ← new
│
├── constants/
│   ├── cats.ts                    ← filter options, donation amounts
│   ├── stats.ts                   ← fallback stat numbers
│   ├── partners.ts                ← static partner data
│   └── successStories.ts          ← static success story data
│
├── lib/
│   ├── api.ts                     ← expand with new endpoints
│   ├── tagUtils.ts                ← new
│   ├── dateUtils.ts               ← new
│   └── catUtils.ts                ← new
│
├── content/
│   └── blog/                      ← MDX blog posts
│       └── *.mdx
│
├── context/
│   └── AuthContext.tsx            ← optional, add if localStorage reads proliferate
│
├── middleware.ts                  ← route protection
└── FRONTEND_PLAN.md               ← this file
```

---

## 13. Animation Spec

| Element | Animation | Trigger | Duration |
|---|---|---|---|
| Section headings | `fadeInUp` (RevealOnScroll) | Scroll into view | 0.8s, delay 0ms |
| Content cards | `fadeInUp` (RevealOnScroll, stagger) | Scroll into view | 0.8s, delay 100ms each |
| Stats counters | AnimatedCounter ease-out | Scroll into view | 1.5s |
| Cat photo (hover) | `scale-[1.05]` | hover | 500ms ease |
| CatCarousel | marquee, 40s loop | auto | Pause on hover |
| Nav transparent→white | opacity + shadow | scroll > 80px | 300ms |
| Mobile menu | slide-down + fade | hamburger tap | 200ms |
| Accordion items | max-height expand | click | 300ms ease-out |
| Form success state | `fadeIn` | after submit | 400ms |
| StickyAdoptCTA | slide-up from bottom | scroll past hero | 300ms |
| Toast | slide-in from top-right | after action | 300ms, auto-dismiss 4s |
| Page load | none | — | No page transitions |

---

## 14. Mobile-First Checklist

For each page, verify before shipping:

- [ ] Navigation collapses to hamburger, full-screen overlay
- [ ] Cat cards fill full width on mobile (1-col grid)
- [ ] All CTAs are finger-tap sized (min 44px height)
- [ ] Cat filter bar scrolls horizontally (no wrap on mobile)
- [ ] StickyAdoptCTA visible on cat profile mobile
- [ ] DonationWidget amounts fit in a 2×2 grid on mobile
- [ ] Blog post body max-width uses full screen width on mobile
- [ ] Footer stacks to single column
- [ ] Photo aspect ratios stay correct (no squishing)
- [ ] All form inputs are at least 16px font size (prevents iOS zoom)
- [ ] No horizontal overflow anywhere (test with devtools)

---

## 15. Anti-AI-Generic Design Audit

> Cross-referenced against `.impeccable.md`. These rules have equal weight to sections 1–14. The test for every decision: *does this give the photo room to speak, and does it look like a form with a database behind it?*

---

### 15.1 Five Highest-Impact Changes (Do These First)

1. **Remove `group-hover:scale-105` from every photo.** The zoom-on-hover is the single most recognizable AI-template behaviour. Remove from `CatFilterBar.tsx`, `CatCarousel.tsx`, `page.tsx`. Replace with: `group-hover:brightness-[1.04] transition-[filter] duration-700`.

2. **Cat profile photo: full-bleed, zero border radius.** The contained `rounded-2xl aspect-[16/9]` photo inside `max-w-5xl px-4` looks like a database record. Replace with a photo that bleeds to the left viewport edge, `rounded-none`, with the text panel floating right.

3. **Delete the `.card` CSS utility class from `globals.css`.** Every card shares one class → every section looks identical. Write inline Tailwind per card type. Grid card, spotlight card, sidebar panel, and donation callout must each have distinct visual language.

4. **Hero h1 is undersized.** Current `text-2xl sm:text-3xl` is the same size as a section subheading. Must be `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl` minimum. Editorial design depends on brutal size contrast.

5. **`text-oaza-rust` eyebrow labels: one per page maximum.** The `text-xs font-semibold uppercase tracking-widest text-oaza-rust` appearing before every section heading is the most repeated AI-generic pattern in the codebase. One section per page earns it. All others: no eyebrow, or `text-stone-400` instead.

---

### 15.2 Layout Asymmetry

Never use 50/50 column splits. Editorial layouts use tension:

| Split | Tailwind | Use |
|---|---|---|
| 7:5 | `grid-cols-[minmax(0,7fr)_minmax(0,5fr)]` | Hero, cat profile |
| 3:5 | `grid-cols-[minmax(0,3fr)_minmax(0,5fr)]` | Text-heavy info sections |
| 5:3 | `grid-cols-[minmax(0,5fr)_minmax(0,3fr)]` | Photo-led sections |
| Full bleed + float | photo `lg:-mr-[calc(50vw-50%)]` | Spotlight moments |

**Break the grid intentionally:**
- Hero cat photo bleeds to the right edge at `lg+` via negative margin
- Pull quote in blog: `lg:-ml-12` to jut into the left margin
- Stats: left stat at `text-9xl` dwarfs right stat at `text-5xl` — intentional imbalance is the point

**Dead space is structural.** A section with one large quote and 30% empty width is not wasted — it is the design.

---

### 15.3 Typography Contrast

**Size contrast is the editorial tool:**
- Stats: `text-8xl font-black` number + `text-sm` label. Never `text-2xl` + `text-base`.
- Drop cap on blog opening paragraph:
  `first-letter:float-left first-letter:font-display first-letter:font-black first-letter:text-7xl first-letter:leading-none first-letter:mr-2 first-letter:text-oaza-green`

**Italics are rare and powerful:**
- `font-display italic` ONLY for: pull quotes, cat names in body copy, specific emotional emphasis
- Never on UI labels, badges, or navigation

**AI tells to avoid:**
- Every `<section>` with the identical `eyebrow → H2 → p.subheadline → content` hierarchy
- `text-stone-600` at the same weight and size for every paragraph (invisible hierarchy)
- `font-semibold` as the only emphasis tool instead of size or spacing contrast

**Playfair Display sizing:**
- At `text-5xl+`: apply `tracking-tight` or `tracking-[-0.02em]`
- Never `tracking-wide` with Playfair — it destroys the serif economy

---

### 15.4 Photo Integration

**Photo IS the layout, not a slot in the layout.**

Full-bleed escape: `w-screen relative left-1/2 -translate-x-1/2`

**Aspect ratios by context:**

| Context | Ratio | Reason |
|---|---|---|
| Profile hero | `aspect-[3/4]` | Portrait — intimate, editorial |
| Grid card | `aspect-[4/3]` | Standard |
| Spotlight card | `aspect-[16/9]` | Cinematic feature |
| Blog hero | `aspect-[2/1]` | Wide editorial |
| Thumbnail | `aspect-square` 64×64 | Compact list |

**Never put captions inside cards.** Captions go below the photo, outside its container: `text-xs text-stone-400 mt-2 pl-1`.

**Photo overlay gradient:** `from-black/50 via-black/20 to-transparent` — current `from-black/30` is too light for legible overlaid text.

---

### 15.5 Micro-details That Signal Handcrafted

**Borders:**
- `border-stone-200/60` (opacity variant) not `border-stone-200` solid — more delicate
- `divide-y divide-stone-100` for list-style sections instead of card grids
- Blockquote: `border-l-[3px] border-oaza-green/40 pl-6`

**Subtle background variation:**
- Alternate `bg-[#F4E8D1]` and `bg-[#F0E4CA]` (slightly darker) within warm sections to create hierarchy
- Use `bg-[#FAF9F7]` (barely warm white) instead of pure `bg-white` for body sections

**Letter-spacing rules:**
- `tracking-[-0.02em]` on large Playfair headings
- `tracking-widest` ONLY on all-caps labels of max 3 words
- Never `tracking-wide` in body copy

**Use `divide-y` instead of cards for:** FAQ, diagnosis lists, step lists, `/moje-podania` application list

---

### 15.6 Motion That Feels Human

**Stop doing:**
- `hover:-translate-y-1 hover:shadow-sm` — float-up card hover. Remove everywhere.
- `hover:shadow-md transition-shadow` on `.card` — remove
- `scale-[1.02]` on hover — too subtle to read, too present to ignore
- 4+ staggered `animate-fade-in-up` on hero load — portfolio demo pattern. One only: the `h1`.
- `animate-bounce` anywhere

**Do instead:**
- Photo hover: `group-hover:brightness-[1.04] transition-[filter] duration-700`
- Link underline: `decoration-oaza-rust/0 hover:decoration-oaza-rust/100 transition-[text-decoration-color] duration-300 underline underline-offset-4`
- Primary CTA: `hover:tracking-wide transition-[letter-spacing] duration-300` — text breathes out on hover (one CTA per page only)
- `RevealOnScroll` on section headings and pull quotes ONLY. Cards appear immediately.

**One parallax allowed:** Homepage hero photo at 0.3× scroll speed. Nowhere else.

---

### 15.7 Color Restraint

**Oaza-rust: one prominent use per page.**

| Page | Where rust lives |
|---|---|
| Homepage | Final donate CTA strip (background) |
| `/koty` | Active filter pill only |
| `/koty/[id]` | Primary adopt button only |
| `/wspieraj` | Opening headline accent word |
| `/jak-adoptowac` | Step number accents |
| `/blog/[slug]` | Category chip on hero photo |

**Rules:**
- Most of the site is stone + cream + white. Color is punctuation, not wallpaper.
- `text-oaza-green` on `bg-oaza-warm`: use `text-stone-800` for body text — contrast is insufficient
- `bg-oaza-rust` on buttons: only the single primary CTA per page. All others: outlined (`border-2 border-oaza-green`) or text links.
- A page that uses `bg-oaza-green` once is more powerful than one that uses it three times.

---

### 15.8 Sections That Break the Template

**"Just a quote" section** (once — homepage or `/o-nas`):
```
bg-oaza-warm py-24
max-w-3xl mx-auto px-8
Ornamental mark: font-display text-[120px] leading-none text-oaza-green/15 select-none
Body: font-display italic text-3xl lg:text-4xl text-stone-900 leading-snug
Attribution: mt-8 text-sm text-stone-400 not-italic
```
No eyebrow. No heading. No CTA. Nothing else in the section.

**"One stat" anchor section** (once — `/wspieraj`):
```
bg-white py-32 text-center
Number: font-display font-black text-[120px] lg:text-[180px] leading-none text-oaza-green
Label: text-base text-stone-500 mt-4 max-w-xs mx-auto
```
One number. One sentence. That is the section.

**Diagnosis list** (replaces icon grid on homepage):
```
divide-y divide-stone-100
Each row: flex items-baseline gap-6 py-5
  Left col: font-display italic text-2xl text-stone-900 w-32 shrink-0
  Right col: text-stone-600 text-base leading-relaxed
Column label (rotated): text-xs uppercase tracking-widest text-stone-300 [writing-mode:vertical-rl] rotate-180
```
No card backgrounds, no hover effects, no icons.

---

### 15.9 The Specific > Generic Principle

Every text element must be specific to Oaza — not substitutable into any other website.

**CTAs:**

| Generic (AI) | Specific (Oaza) |
|---|---|
| "Wesprzyj teraz" | "Wesprzyj opiekę Mieczysława" |
| "Dowiedz się więcej" | "Jak wygląda pierwsza wizyta?" |
| "Adoptuj" | "Chcę wziąć Dragnę do domu" |
| "Poznaj naszą misję" | "Skąd się wzięła Oaza" |

**Stats:**

| Generic | Specific |
|---|---|
| "340+ adoptions" | "340 kotów znalazło dom — ostatni 3 dni temu" |
| "4 years of experience" | "Od 2022 roku. Zaczęło się od jednego kota z FIV." |

**Empty states in brand voice:**
- No cats: "Żaden kot nie spełnia tych kryteriów — może rozszerzyć wyszukiwanie?"
- No applications: "Nie złożyłeś jeszcze podania. Może któryś z kotów Cię zainteresuje?"
- Never: "No results found", "You have no applications"

**Error messages — Polish, specific, never apologetic:**
- Required field: "To pole jest wymagane"
- Invalid email: "Sprawdź adres email"
- Server error: "Coś poszło nie tak — spróbuj ponownie lub napisz do nas"

---

### 15.10 Hard Delete List

Remove these with no replacement:

**Hover effects:**
- `group-hover:scale-105 transition-transform duration-500` on all images → brightness instead
- `hover:shadow-md transition-shadow` on `.card` in `globals.css`
- `hover:-translate-y-1 hover:shadow-sm` from any card
- `group-hover:scale-110` on icons in the trust strip

**Section patterns to simplify:**
- Trust strip: four icon-circle containers → replace with `divide-x` text-only row or remove section
- SVG icons above step numerals in adoption steps → remove icons, oversized numerals carry the structure
- Cat emoji placeholder for missing photos → `bg-stone-100` plain, no emoji

**Component patterns to flatten:**
- `.card` utility class → DELETE from `globals.css`. Write per-context inline styles.
- Four staggered `animate-fade-in-up` on hero → keep only `h1`, everything else immediate
- `bg-oaza-green/10` placeholder with emoji → `bg-stone-100`, no emoji, cat name in `text-stone-400`

---

### 15.11 Page-Specific Anti-Generic Calls

**Homepage:** Replace the 2-column diagnosis icon grid with a `divide-y` list. Diagnosis name in `font-display italic` as left column, one honest sentence as right column. No cards, no icons, no hover.

**Cat Profile:** Remove the "Charakterystyka" database-field label. Tags become a footnote (`text-xs text-stone-400`, no heading). Breed and age go inline below the cat name — "Dragon, 5 lat, dachowiec" in `text-stone-500 text-base mt-1`. Sidebar contains only: adopt CTA + contact link.

**Donate (`/wspieraj`):** Remove the four amount cards formatted like a pricing grid. Replace with prose sentences naming each amount. Open the page with a full-bleed photo and cat's name in large overlay type before any heading.

**Cat Listings (`/koty`):** Spotlight card uses `rounded-none` (photo bleeds to edges). Grid cards use `rounded-xl`. Every 3rd card uses `aspect-video` instead of `aspect-[3/4]` to break rhythm: `{i % 3 === 0 ? 'aspect-video' : 'aspect-[3/4]'}`.

**Blog Post (`/blog/[slug]`):** Hero photo full-bleed, zero border radius, no container. Body column `max-w-[62ch]` not `max-w-2xl`. Pull quotes are part of text flow with left-border accent — not callout cards. Drop cap on opening paragraph.
