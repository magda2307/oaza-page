# Page CRO + Site Architecture + Marketing Psychology
# Cat Charity Poland

> Run after reading product-marketing-context.md

---

# PART 1: Site Architecture

## Task

Design the complete information architecture for the cat charity website. We are building a multi-page site in Polish, hosted on Hetzner, frontend on Cloudflare Pages, backend FastAPI + PostgreSQL.

### Deliverables

**A) Full page hierarchy**
Map every page, its URL slug, primary purpose, primary conversion goal, and which pages link to it.

**B) Navigation structure**
Design the main navigation (max 5–6 items) and footer navigation. In Polish. Consider:
- Most visitors come for cat adoption — the path to /koty must be one click from anywhere
- Donors and volunteers are secondary — don't bury them but don't compete with adoption
- Mobile-first — most Polish users will arrive from Instagram/Facebook on mobile

**C) User journey maps**
Map 4 key journeys:
1. "Chcę adoptować kota" — arrives from Instagram, sees a cat, wants to apply
2. "Szukam kota dla rodziny" — arrives from Google, needs to browse and filter
3. "Chcę pomóc ale nie mogę adoptować" — looking for donate/volunteer options
4. "Znalazłem kota na ulicy" — looking for help/contacts

For each journey: entry point → key pages → conversion action → potential drop-off points → how to reduce friction.

**D) /koty filtering system**
Design the filter/search UX for the cat listing page. Consider:
- Age (kocię / dorosły / senior)
- Płeć (samica / samiec)
- Charakter (spokojny / aktywny / towarzyski / nieśmiały)
- Odpowiedni dla (dzieci / inne koty / alergicy / pierwsze zwierzę)
- Dostępność (od zaraz / wkrótce)

Which filters matter most to Polish adopters? Which create friction?

---

# PART 2: Page CRO — Homepage

## Task

Audit and optimise the homepage for maximum adoption applications and foster/donor sign-ups.

### Homepage Section-by-Section CRO

For each section, specify:
- Purpose of the section
- What emotion/action it should trigger
- Specific copy + design recommendations
- What to avoid

**Section 1: Hero**
- Primary goal: get visitor to /koty within 5 seconds
- What makes Polish adopters click vs bounce?
- Should we show a featured cat in the hero? (yes — face, name, CTA — research shows this outperforms generic charity imagery)
- Above-the-fold requirements on mobile

**Section 2: Featured Cats (3–4 cats)**
- Which cats to feature? (not just the cutest — include a senior, a shy one, a bonded pair)
- Card design: what information converts? (name, age, one-line personality description, "Poznaj [imię]" button)
- Rotation strategy: change featured cats weekly

**Section 3: Stats / Social Proof**
- What numbers matter to Polish adopters? (cats rehomed, years operating, foster homes, TNR numbers)
- Consider a live "szuka domu: X kotów" counter
- Testimonials from adopters — format and placement

**Section 4: How to Adopt (process preview)**
- 4-step visual, warm tone
- Reduce the #1 fear: "czy mnie zaakceptują?"
- Link to full /adoptuj page

**Section 5: 1.5% Podatku CTA**
- This is the highest-value, lowest-friction donation action
- Design as a distinct section, not buried in footer
- Include: what it is, how to do it, KRS number, deadline reminder (April 30 each year)

**Section 6: Foster Programme Teaser**
- Many people who can't adopt could foster
- Short pitch + CTA → /domy-tymczasowe

**Section 7: Latest Adoption Stories**
- 2–3 recent success stories
- Photo of cat in new home (the most powerful social proof)
- Links to /aktualnosci

---

# PART 3: Marketing Psychology

## Task

Apply the following psychological principles specifically to a Polish cat adoption charity context. For each principle, give 3–5 concrete implementation examples on the website.

### Principles to Apply

**A) Identifiable Victim Effect**
Individual named cats with photos and stories convert dramatically better than statistics. Specific implementation:
- Every cat has a name prominent in the URL, title, and H1
- Hero section features one specific cat, not a generic cat
- Donation page: "adoptuj wirtualnie Mochiego" not "wesprzyj nasze koty"
- Email: "Zuzia czeka na ciebie" not "mamy 28 kotów do adopcji"

**B) Reduce Friction / Paradox of Choice**
Polish shelter sites often show 50+ cats at once — this paralyses visitors. Recommendations:
- Homepage shows max 4 featured cats
- /koty default view: 12 cats, load more
- Quiz: "Jaki kot pasuje do twojego stylu życia?" — 5 questions → 3 matching cats
- Don't ask for too much info in the first contact form

**C) Social Proof (Polish-specific)**
Poles are sceptical of overly polished testimonials. Make social proof feel real:
- Real first names + city (not "Anna K., Warszawa")
- Show imperfect photos (cat hiding under bed during first week = authentic)
- Show numbers: "W tym roku 47 kotów znalazło dom. Ostatni — 3 dni temu."
- Link to real Facebook/Instagram posts from adopters

**D) Reciprocity**
Give value before asking for anything:
- Free downloadable: "Przewodnik pierwszego adoptującego" (PDF)
- Free tool: "Sprawdź czy jesteś gotowy na kota" (quiz)
- Free advice: detailed /adoptuj FAQ page
- This earns trust before asking for adoption application or donation

**E) Authority + Trust Signals**
Polish adopters need to trust the charity is legitimate:
- KRS number visible in footer
- NGO status clear on About page
- Vet partner name and logo
- Press mentions or awards
- "Zaufało nam X rodzin od roku [rok założenia]"
- SSL, clear privacy policy, GDPR compliance notice

**F) Urgency without Manipulation**
Real urgency only — never fake scarcity:
- "Misia jest u nas już 8 miesięcy." (real, factual, emotional)
- "Ten miesiąc jest szczególnie trudny — mamy 6 kociąt z jednego miotu i szukamy 6 domów."
- Never: "Zostało tylko kilka miejsc!" for adoptions

**G) 1.5% Podatku — Loss Aversion Framing**
Frame the 1.5% podatku as money the adopter is already giving to the state anyway:
- "I tak oddajesz te pieniądze. Możesz zdecydować, komu."
- Include a calculator: "Jeśli zarabiasz X zł, twój 1,5% to Y zł — to tyle, ile kosztuje miesiąc jedzenia dla 3 kotów."

---

# PART 4: Colour + Visual Identity Psychology

## Task

Analyse our brand colours (terracotta #c4603a, cream #fdf6ed, sage #8aaa82, dark brown #2a1f1a) and provide:

**A) Psychological associations**
What do these colours communicate to a Polish urban audience?
- Terracotta: warmth, earthiness, handmade, trustworthy, slightly bohemian
- Cream: softness, safety, home, natural
- Sage: calm, nature, wellness, balance
- Dark brown: stability, seriousness, depth

Does this palette work for a cat charity? What does it signal vs a clinical blue-and-white charity palette?

**B) CTA button colour strategy**
Which colour should primary CTAs use? Where should we use terracotta vs sage vs a different accent?
Consider: "Adoptuj" buttons (high emotion, primary) vs "Dowiedz się więcej" (secondary) vs "Wesprzyj" (donation — should feel different from adoption CTA).

**C) Photography art direction guidelines**
What style of cat photos works best for adoption? Based on research from US shelters (Oregon Humane Society) and German shelters (Tierheim Berlin):
- Bright, warm light (not shelter fluorescents)
- Cat at eye level or slightly above
- Showing personality: cat playing, sleeping, exploring — not stiff posed shots
- Include home environment when possible (cat on a sofa = "I could see this cat in my home")
- Don't show cages or shelter environments in adoption profile photos
- Consistent editing style: warm tones, medium contrast — matches brand palette

**D) Typography recommendations**
Suggest 2 Google Fonts that match the brand:
- Display / headline font: distinctive, warm, not corporate
- Body font: highly readable in Polish (includes ą, ę, ó, ś, ź, ż, ć, ń, ł)
- Already using: Playfair Display (serif) + DM Sans — evaluate if these are right

**E) Overall vibe in one sentence**
Write a one-sentence "vibe brief" that a designer could use to make every visual decision:
Example: "Like a warm, slightly worn independent bookshop in Mokotów that also happens to rescue cats — personal, human, never corporate."
