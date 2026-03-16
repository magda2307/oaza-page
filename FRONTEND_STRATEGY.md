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
| `brand-500` / `oaza-green` | `#2D6A4F` | Hero background, footer, accents, bookend sections |
| `oaza-warm` | `#F4E8D1` | Section backgrounds, card backgrounds, warm mid-body |
| `oaza-rust` | `#C1440E` | CTAs, hover highlights, ring on active cards |

In `tailwind.config.ts`, these are registered under `extend.colors`. Always use the semantic token names — never hardcode hex values in components.

### Typography

| Role | Font | Notes |
|---|---|---|
| Display / Headings | Playfair Display (serif) | Verify Polish diacritics at display sizes: ą ę ó ś ź ż ć ń ł |
| Body / UI | DM Sans | Clean, readable at small sizes; use for all body copy and labels |

- Both fonts loaded via `next/font/google` with `display: 'swap'`
- Heading scale: `text-5xl` (hero) → `text-4xl` (section) → `text-2xl` (card) → `text-xl` (subsection)
- Body copy: `text-base` (16px), line-height `leading-relaxed` (1.625)
- Never use system sans-serif for body — DM Sans is part of the brand feel

---

## 3. Visual Design Language

This section governs how the site looks and feels. Every visual decision should reinforce the brand truth: warmth, honesty, defiant compassion.

### Cat-Forward Principle

Cats are not decoration. Every page section should feature a specific named cat — a photo, a face, a story. Generic shelter imagery (rows of cages, nameless kittens) is forbidden.

Rules:
- Each hero, card, and feature section is anchored by a real cat from Oaza's roster
- Cat name is always visible near the cat's image — never anonymous
- If a section cannot feature a specific cat, it should feature a human moment (a volunteer's hands, a vet visit) rather than stock imagery

### Generous Imagery

- Use large, full-bleed or half-bleed photos — not thumbnail grids except in the compact carousel
- Minimum photo height on desktop: `400px` for section heroes, `300px` for cards
- Never crop a cat's face — give faces room to breathe
- White space around images: at least `32px` (8 Tailwind units) on all sides for cards, zero for full-bleed sections

### Warm but Honest Art Direction

- Light: warm, natural — golden hour or soft indoor window light
- Real situations: a cat in recovery with a shaved patch, a blind eye, a feeding tube — shown with dignity, not shock
- Never: cage bars, shelter kennel environments, tight fearful poses
- Never: artificially brightened eyes, heavy filters, "perfect cat" presentation
- The Pratfall Effect applies here — showing imperfection builds deeper trust than showing idealism

### Soft-Edge Transitions

Cat images should feel like they belong in the scene, not like they were pasted in. Achieve this with:

- Gradient overlays on one or two edges (usually the edge where image meets a colored background)
- CSS: a `div` with `bg-gradient-to-r from-oaza-green to-transparent` absolutely positioned over the left edge of the image in the hero
- `mix-blend-mode: multiply` can help blend warm-tone photos into warm backgrounds in card contexts
- Never use hard rectangular borders on editorial images — `overflow-hidden` with `rounded-2xl` for cards, no rounding for full-bleed panels

### Shape Language

| Element | Shape token | Rationale |
|---|---|---|
| Carousel avatars | `rounded-full` | Approachable, soft — circles signal friendliness |
| Hero / primary CTAs | `rounded-full` | Same energy as avatars — inviting, not corporate |
| Cards | `rounded-2xl` | Softer than standard `rounded-lg`, warmer than square |
| Input fields | `rounded-xl` | Consistent with card softness |
| Stats chips | `rounded-full` | Compact, badge-like |
| Images in cards | Top edge `rounded-t-2xl`, matches parent | Flush with card, no gap |

Never use `rounded-none` for user-facing elements. Square corners signal corporate coldness — the opposite of Oaza's personality.

---

## 4. Hero Design

The hero is the most critical section. It must communicate the brand truth in under 3 seconds and offer both audiences an immediate next step.

### Layout Wireframe

```
┌─────────────────────────── bg-oaza-green ────────────────────────────┐
│                                          │                           │
│  [small label — e.g. "Kocia Oaza        │   [cat photo              │
│   Warszawa"]                            │    full height,           │
│                                          │    right 45%,            │
│  Koty, których nikt                      │    object-cover,         │
│  inny nie chciał,                        │    left edge fades       │
│  żyją tutaj.                             │    into green via        │
│                                          │    gradient overlay]     │
│  [body text — 2 sentences max]           │                          │
│                                          │                          │
│  [Poznaj koty]   [Wesprzyj opiekę →]    │                          │
│                                          │                          │
│  [micro-copy]    [micro-copy]            │                          │
│                                          │                          │
└──────────────────────────────────────────┴──────────────────────────┘
```

### Proportions

| Viewport | Text column | Image column |
|---|---|---|
| Desktop (`lg+`) | Left 55% | Right 45% |
| Tablet (`md`) | Left 60% | Right 40% |
| Mobile (`< md`) | Full width | Hidden (`hidden md:block`) |

On mobile, the text must stand alone with full persuasive weight. Do not rely on the image for emotional impact on small screens — the copy must carry it.

### Image Implementation

The cat photo uses absolute positioning inside a `relative` container that spans the full hero height. This allows the image to bleed top-to-bottom without affecting the text layout flow.

```tsx
// Hero image container — place inside the outer relative section wrapper
<div className="absolute inset-y-0 right-0 w-[45%] hidden md:block">
  {/* Gradient overlay — fades left edge of image into oaza-green */}
  <div className="absolute inset-y-0 left-0 w-32 z-10
                  bg-gradient-to-r from-[#2D6A4F] to-transparent" />
  <Image
    src="/images/hero-cat.jpg"
    alt="Mruczek, kot ze złamaną łapą, który szuka domu w Warszawie"
    fill
    className="object-cover object-center"
    priority
  />
</div>
```

Key points:
- The gradient div sits on top of the image (`z-10`) and is exactly the width needed to create a smooth blend — typically `w-24` to `w-40` depending on the photo
- `object-center` is the default; adjust to `object-top` if the cat's face is in the upper portion of the photo
- `priority` on the `<Image>` tag is required — this is LCP content
- The outer `<section>` must have `relative overflow-hidden` and an explicit `min-h-[600px]` or `min-h-screen` to give the absolute image something to fill

### Image Source (Placeholder Phase)

Use existing photos from the CDN already referenced in `CatCarousel.tsx`:

```
https://static.pomagam.pl/...
```

These real Oaza cats are already in the codebase. Use them as hero images until production-quality cutout PNGs are available.

### Production Upgrade Path

When cutout PNGs (transparent background) are ready:
- Remove the gradient overlay div entirely
- The cat PNG sits directly on the `oaza-green` background — natural edge, no fade needed
- Cat should be photographed or masked to face slightly toward the text (toward the left) — creates visual tension toward the CTA

### Hero Text Specification

```
[Label — small caps, DM Sans, text-oaza-warm/60]
Kocia Oaza · Warszawa

[Headline — Playfair Display, text-5xl lg:text-6xl, text-white, leading-tight]
Koty, których nikt
inny nie chciał,
żyją tutaj.

[Body — DM Sans, text-lg, text-oaza-warm/80, max-w-md, mt-6]
Przyjmujemy koty chore, po wypadkach, z FIV i FeLV.
Każdy zasługuje na szansę — i każdy ją tu dostaje.

[CTAs — mt-8, flex gap-4]
```

### Hero CTAs

Both buttons carry equal visual weight — there is no primary/secondary hierarchy. The two audiences are equally valuable.

```tsx
// CTA row
<div className="flex flex-col sm:flex-row gap-4 mt-8">
  <Link
    href="/koty"
    className="rounded-full px-8 py-4 bg-oaza-rust text-white
               font-semibold text-base hover:opacity-90
               transition-opacity duration-150 text-center"
  >
    Poznaj koty
  </Link>
  <Link
    href="/wspieraj"
    className="rounded-full px-8 py-4 bg-white text-oaza-green
               font-semibold text-base hover:bg-oaza-warm
               transition-colors duration-150 text-center"
  >
    Wesprzyj opiekę →
  </Link>
</div>

// Micro-copy beneath CTAs
<div className="flex flex-col sm:flex-row gap-4 mt-3">
  <p className="text-sm text-oaza-warm/60 w-full sm:w-[200px] text-center">
    Bez zobowiązań — po prostu przejrzyj.
  </p>
  <p className="text-sm text-oaza-warm/60 w-full sm:w-[200px] text-center">
    Nawet 20 zł pokrywa dzień leczenia.
  </p>
</div>
```

Note: On mobile, the two CTAs stack vertically (`flex-col`), each full width.

---

## 5. Section Rhythm

The homepage follows a deliberate alternating pattern. Green sections bookend the page; warm sections form the body. This creates a "warm sandwich" composition — the user arrives and leaves in the brand's strongest color, with warmth in between.

| # | Section | Background | Purpose |
|---|---|---|---|
| 1 | Hero | `bg-[#2D6A4F]` (oaza-green) | First impression, dual CTA |
| 2 | Cat carousel | `bg-oaza-warm/30` | Immediate cat faces — human connection |
| 3 | Stats bar | `bg-white` | Social proof, clean numbers |
| 4 | Featured cats | `bg-oaza-warm` | Editorial cards, adoption entry point |
| 5 | Mission band | `bg-white` | Centered bold quote — brand truth moment |
| 6 | How to adopt | `bg-oaza-warm/40` | Process clarity, reduce friction |
| 7 | Testimonials | `bg-oaza-warm/40` | Third-party trust |
| 8 | Donate CTA | `bg-[#2D6A4F]` (oaza-green) | Bookend — matches hero energy |

Implementation notes:
- Sections 6 and 7 share the same background — use a thin divider (`border-t border-oaza-warm`) rather than a color break
- The stats bar (section 3) between the carousel and featured cats acts as a visual "breath" — keep it minimal (3–4 numbers, no images)
- The mission band (section 5) should use a large Playfair Display quote, centered, max 2 lines, with a rust-colored pull-quote mark or horizontal rule

---

## 6. Cat Card Design

### Carousel (compact, horizontal strip)

The carousel shows 5–8 cats. This is the first place users see real cats after the hero.

- Avatar: `w-36 h-36 rounded-full` — circular crop, `object-cover object-top`
- Container: `ring-2 ring-transparent hover:ring-oaza-rust transition-all duration-300`
- Name: `text-sm font-semibold text-center mt-3 font-sans` (DM Sans, not Playfair)
- Breed or brief tag: `text-xs text-gray-500 text-center`
- The ring on hover acts as the primary interactive signal — no underline, no background change
- Clicking the avatar navigates to `/koty/[id]`

### Spotlight Card (editorial, full-width)

Used for a single featured cat — the "cat of the week" placement between the carousel and the grid.

```
┌─────────────────────────────────────────────────────┐
│  [photo — 40% left, aspect-[3/4], rounded-l-2xl]   │  [story — 60% right]
│                                                     │  [name — Playfair, text-3xl]
│                                                     │  [tags — breed, age, status]
│                                                     │  [2–3 sentence hook]
│                                                     │  [Poznaj [imię] →]
└─────────────────────────────────────────────────────┘
```

- Layout: `flex flex-col md:flex-row` — stacks on mobile
- Photo: `rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none`
- Story side: `bg-oaza-warm rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none p-8`
- CTA at bottom of story: rust-colored text link with arrow, not a full button

### Grid Cards (listings page, `/koty`)

Used in the featured cats section on homepage and as the primary layout on `/koty`.

```
┌───────────────────┐
│  [photo           │
│   aspect-[4/3]    │
│   rounded-t-2xl   │
│   object-cover]   │
├───────────────────┤
│  [name — Playfair │
│   text-xl]        │
│  [breed · age]    │
│  [2-line desc]    │
│                   │
│  [Poznaj →]       │  ← rust color, DM Sans
└───────────────────┘
```

Tailwind classes for the card wrapper:
```
rounded-2xl overflow-hidden shadow-sm hover:shadow-md
transition-shadow duration-300 bg-white
```

Photo hover effect (applied to the `<Image>` or its wrapper):
```
hover:scale-105 transition-transform duration-300
```

The card's `<Link>` wraps the entire card — no separate CTA button needed on hover. The rust arrow at the bottom is always visible, not revealed on hover.

---

## 7. URL Map

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

## 8. Navigation

- Max 5–6 items in the main nav
- `/koty` must be reachable in one click from anywhere
- CTA button sits rightmost in the header
- Mobile-first — most traffic arrives from Instagram/Facebook on mobile
- No mega-menu; simple header only
- Active page indicator: `border-b-2 border-oaza-green` underline on the nav item
- Header background: `bg-white` with `shadow-sm` on scroll (add class via scroll event listener)

---

## 9. Component States and Interaction

### Buttons

| Variant | Classes |
|---|---|
| Solid rust (primary CTA) | `rounded-full px-8 py-4 bg-oaza-rust text-white font-semibold hover:opacity-90 transition-opacity duration-150` |
| Solid white (equal-weight CTA on green bg) | `rounded-full px-8 py-4 bg-white text-oaza-green font-semibold hover:bg-oaza-warm transition-colors duration-150` |
| Solid green (standard CTA on white bg) | `rounded-full px-8 py-4 bg-oaza-green text-white font-semibold hover:opacity-90 transition-opacity duration-150` |
| Text link with arrow | `text-oaza-rust font-semibold hover:underline` + static `→` character |

Rules:
- Never use ghost/outline buttons as the sole CTA — they read as low-confidence
- Outline buttons are acceptable as secondary options when a solid primary is present beside them
- `rounded-full` is mandatory for all buttons — no exceptions for brand consistency
- Minimum touch target: `44px` height — `py-4` (16px padding each side) on `text-base` (16px) = 48px, which passes

### Card Interactions

| State | Classes |
|---|---|
| Default | `shadow-sm` |
| Hover | `shadow-md` |
| Transition | `transition-shadow duration-300` |
| Photo zoom on hover | `hover:scale-105 transition-transform duration-300` |
| Carousel ring on hover | `ring-2 ring-oaza-rust transition-all duration-300` |

Never use sharp `box-shadow` values — always use Tailwind's shadow scale, which uses soft blur.

### Navigation Active State

```tsx
// In Nav component — conditionally apply based on current pathname
className={`pb-1 transition-colors duration-150 ${
  pathname === href
    ? 'border-b-2 border-oaza-green text-oaza-green font-semibold'
    : 'text-gray-700 hover:text-oaza-green'
}`}
```

### Form Elements

| Element | Classes |
|---|---|
| Input | `rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-oaza-green` |
| Textarea | Same as input + `resize-none` |
| Select | Same as input + custom arrow via `appearance-none` + SVG background |
| Submit button | Solid green or solid rust, `rounded-full`, full width on mobile |

### Transitions — Timing Reference

| Interaction type | Duration |
|---|---|
| Color / opacity changes | `duration-150` |
| Transforms (scale, translate) | `duration-300` |
| Shadow changes | `duration-300` |
| Nav drawer / modal open | `duration-200` |
| Page transitions (if used) | `duration-300` |

Keep all transitions under 300ms for UI responses. Only use 300ms for spatial transforms where the eye needs to track movement.

---

## 10. Homepage

### Section Order

1. **Hero** — one specific cat, close-up, with a visible sign of illness or recovery (see Section 4 for full spec)
2. **Cat carousel** — circular avatars, 5–8 cats, horizontal scroll on mobile
3. **Stats bar** — social proof counter (e.g. "W tym roku X kotów znalazło dom. Ostatni — 3 dni temu.")
4. **Featured cats** — 3–4 grid cards, rotated weekly
5. **Mission band** — centered bold quote, brand truth statement
6. **How to adopt** — 4-step visual flow
7. **1.5% Podatku CTA** — standalone section, not buried in the donate page
8. **"Can't adopt? You can still help"** — donation section
9. **Latest adoption stories** — 2–3 testimonials or posts

### Hero CTAs

Both buttons are equal weight — no primary/secondary hierarchy. The two audiences (adopters and donors) are equally valuable. See Section 4 for full implementation spec.

- Button 1: "Poznaj koty" → `/koty` | Micro-copy: "Bez zobowiązań — po prostu przejrzyj."
- Button 2: "Wesprzyj opiekę" → `/wspieraj` | Micro-copy: "Nawet 20 zł pokrywa dzień leczenia."

---

## 11. Cat Listings (`/koty`)

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

### Future: Cat Quiz

5-question quiz "Jaki kot pasuje do twojego stylu życia?" → 3 matching cat profiles. Not yet implemented; note here for planning.

---

## 12. Cat Profile Page

Five sections in order:

**A. Opening hook** — 2–3 sentences capturing personality, not medical history.
**B. Character traits** — 4–6 bullets. At least one "not for everyone" trait required; avoids false advertising.
**C. History** — factual, not overdramatised.
**D. Home requirements** — specific (e.g. "no small children", "single-cat household"), not generic.
**E. CTA** — Primary: "Chcę adoptować [imię]" → `/koty/[id]/aplikuj`. Secondary: "Napisz do nas w sprawie [imię]" → `/kontakt`.

---

## 13. Photography Art Direction

- **Hero image:** one specific named cat, close-up, showing visible signs of illness or recovery. No cage shots. No staged "perfect cat" photos.
- **Profile photos:** bright warm light, cat at eye level, personality-showing action (playing, sleeping, curious). No shelter environments visible.
- **Editing:** warm tones, medium contrast — consistent across all cats. Do not over-brighten eyes or add unnatural saturation.
- **Rationale:** Showing difficult reality builds trust (Pratfall Effect), not pity.
- **Alt text formula:** `[Cat name], [breed or description], [situation]` — e.g. "Mruczek, szary kot z amputowaną łapą, szukający domu w Warszawie" — required for SEO and accessibility.

### Image Sizing for Performance

| Context | Recommended dimensions | Next.js sizes prop |
|---|---|---|
| Hero (right panel) | `1200 × 900px` max | `(max-width: 768px) 0px, 45vw` |
| Spotlight card photo | `800 × 1067px` (portrait) | `(max-width: 768px) 100vw, 40vw` |
| Grid card | `600 × 450px` | `(max-width: 768px) 100vw, 33vw` |
| Carousel avatar | `288 × 288px` (square, will crop to circle) | `144px` |

All images must use `next/image` — never raw `<img>` tags. Set `priority` on hero and above-the-fold images.

---

## 14. Trust Signals

Required on the site, placement noted:

| Signal | Location |
|---|---|
| KRS number | Footer |
| NGO status | About page + footer |
| Vet partner name + logo | About page |
| SSL + GDPR notice | Footer |
| Stats counter | Homepage stats bar |

---

## 15. Conversion Priority

In order of importance:

1. Submit adoption application for a specific cat
2. Redirect 1.5% podatku (lowest friction — a checkbox on a tax form)
3. Donate (one-time or monthly)
4. Sign up as foster home
5. Sign up as volunteer
6. Share a cat profile on social media

---

## 16. SEO Requirements

### Core Web Vitals Targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

### Schema Markup (JSON-LD)

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

## 17. Tech Stack Reference

- Next.js 16.1.6 App Router + TypeScript + Tailwind CSS
- Package manager: **pnpm**
- API client: `frontend/lib/api.ts`
- Types: `frontend/types/index.ts`
- Auth: JWT in `localStorage` (`oaza_token`, `oaza_is_admin`)
- `useSearchParams()` must be wrapped in `<Suspense>` (already done in `/logowanie`)
- `next.config.ts` has `output: 'standalone'` and allows all HTTPS image hosts (tighten for production)

---

## 18. Source Files

Detailed rationale and copy live in these files. This document reflects the decisions; go there for the reasoning.

| File | Contains |
|---|---|
| `marketing/homepage-hero.md` | Final hero copy with psychology annotations |
| `marketing/copywriting.md` | Cat profile copy template |
| `marketing/cro-architecture-psychology.md` | CRO decisions, section-by-section |
| `marketing/seo-strategy.md` | Full SEO strategy |
| `marketing/social-content-strategy.md` | Social media + email sequences |
| `marketing/product-marketing-context.md` | Original positioning (some values superseded) |
