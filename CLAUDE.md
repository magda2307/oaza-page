# Oaza — Claude Instructions

## Design Context

### Users

**Primary — hesitant adopters.** People who want a cat but worry about taking on illness, age, or trauma. They arrive uncertain. The interface should feel like talking to someone honest who's on their side — not a sales pitch. Often on mobile, emotionally invested, may visit multiple times before deciding.

**Secondary — donors.** Can't adopt but want to contribute. Need impact quickly and feel the weight of individual stories, not statistics.

**Job to be done:** Adopters want to know if *this specific cat* is right for *their specific life*. Donors want to feel their money lands in a real place.

### Brand Personality

**Defiant. Warm. Honest.**

Oaza says yes when everyone else says no — FIV, FeLV, cancer, road accidents, terminally ill, dying cats. Never use phrases like "healthy, affectionate" or generic shelter language. Tell the truth and lean into it.

Voice: direct, unhurried, human. Warm but never saccharine. Defiant without being aggressive.

### Aesthetic Direction

**Reference: editorial / magazine — Kinfolk, NYT.** Generous whitespace. Strong typography. Photography carries emotion — cats are the subject, not decorations.

**Anti-reference:** Generic shelter sites, clipart paw prints, busy layouts, anything that looks like a form with a database behind it.

**Color palette:**
- `#2D6A4F` (`oaza-green`) — primary brand green
- `#F4E8D1` (`oaza-warm`) — warm cream background
- `#C1440E` (`oaza-rust`) — CTA and accent color
- `stone-*` — body text and subtle borders

**Visual patterns to preserve:**
- Pill / `rounded-full` buttons always (never rectangular)
- Frosted badge overlays on photos (`bg-white/90 backdrop-blur-sm`)
- Bottom gradient fade on cat photos (`from-black/30 to-transparent`)
- Colored tag chips overlaid bottom-left on photos
- Alternating full-bleed sections: `oaza-warm → white → oaza-green`
- Left green border accent on blockquotes
- Large ornamental serif quote mark in `text-oaza-green/40`
- Stats as oversized bold numerals

**Theme:** Light only. No dark mode.

**Motion:** Subtle and purposeful. Image zoom `duration-500`. Carousel pauses on hover.

### Design Principles

1. **The cat is the hero.** Photography leads, copy explains, UI gets out of the way.
2. **Honesty over comfort.** Show the diagnosis. Name the illness. The audience came for the truth.
3. **Breathe.** Generous whitespace. When in doubt, add space, not remove it.
4. **One action per section.** Single CTA per section. Secondary actions are visually quieter.
5. **Never look corporate.** Clean, warm, human. No gradients on buttons, no shadows on shadows.
