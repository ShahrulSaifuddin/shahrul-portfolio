# Design Spec — Shahrul Saifuddin Portfolio

**Authored by the foreman. This is not a suggestion — it is the contract.** Four workers build
different surfaces of one site in parallel. If you deviate, the site looks like four sites.
Do not invent colors, fonts, spacing values, easing curves, or shadow recipes. Use what is here.

---

## 1. Brand read

Shahrul ships EV-charging infrastructure, payment rails, and 100-Lighthouse marketing sites.
The portfolio should feel like **engineering restraint**, not a designer's showreel: precise,
quiet, fast, confident. Hard evidence over adjectives. Real numbers everywhere.

The one permitted flourish is a slow, low-contrast ambient gradient behind the hero — a nod to
electric current. Everywhere else: whitespace, typography, and hairline borders do the work.

**Explicitly forbidden:** purple/blue SaaS gradient soup, glassmorphism everywhere, neon glow
on every card, animated blobs, parallax, typewriter effects, confetti, emoji as iconography,
"Hi, I'm ..." waving-hand hero, drop shadows larger than the element casting them.

---

## 2. Tokens

All tokens live in `src/app/globals.css` as CSS custom properties under Tailwind v4's
`@theme inline`. Owned by **T2a**. Everyone else consumes them via Tailwind utility classes
(`bg-background`, `text-muted-foreground`, `border-border`, `text-accent`, …).

### Color — light

```
--background:            oklch(0.995 0 0)        /* near-white, not pure */
--foreground:            oklch(0.205 0.005 285)  /* near-black ink */
--muted:                 oklch(0.968 0.002 285)
--muted-foreground:      oklch(0.505 0.008 285)  /* passes 4.5:1 on background */
--card:                  oklch(1 0 0)
--card-foreground:       oklch(0.205 0.005 285)
--border:                oklch(0.918 0.004 285)
--input:                 oklch(0.918 0.004 285)
--ring:                  oklch(0.62 0.13 168)
--accent:                oklch(0.62 0.13 168)    /* teal-emerald — "charged" */
--accent-foreground:     oklch(0.99 0.01 168)
--accent-muted:          oklch(0.94 0.035 168)   /* tints, badges, rails */
--destructive:           oklch(0.58 0.21 27)
--success:               oklch(0.62 0.13 168)
```

### Color — dark

```
--background:            oklch(0.165 0.004 285)
--foreground:            oklch(0.955 0.002 285)
--muted:                 oklch(0.225 0.005 285)
--muted-foreground:      oklch(0.715 0.008 285)  /* passes 4.5:1 on dark background */
--card:                  oklch(0.205 0.005 285)
--card-foreground:       oklch(0.955 0.002 285)
--border:                oklch(0.285 0.006 285)
--input:                 oklch(0.285 0.006 285)
--ring:                  oklch(0.72 0.14 168)
--accent:                oklch(0.76 0.14 168)    /* lifted for dark-bg contrast */
--accent-foreground:     oklch(0.17 0.03 168)
--accent-muted:          oklch(0.28 0.05 168)
--destructive:           oklch(0.66 0.19 27)
--success:               oklch(0.76 0.14 168)
```

**Accent discipline:** accent is a *spice*. Per viewport, at most ~3 accent-colored elements.
Primary CTA, active nav indicator, and one data highlight. Never accent-color body text.
Never accent-fill a large surface.

### Typography

- Sans: `Geist` via `next/font/google` → `--font-geist-sans`. Mono: `Geist_Mono` → `--font-geist-mono`.
- Mono is for **metrics, code, tech tokens, section eyebrow labels** — it is the "engineering" signal.
- Scale (mobile → desktop, use the fluid classes):
  - Display (hero h1): `text-4xl sm:text-5xl lg:text-6xl`, `font-semibold`, `tracking-[-0.03em]`, `leading-[1.05]`
  - h2 (section): `text-2xl sm:text-3xl`, `font-semibold`, `tracking-[-0.02em]`
  - h3 (card): `text-base sm:text-lg`, `font-semibold`, `tracking-[-0.01em]`
  - Body: `text-[0.9375rem] sm:text-base`, `leading-relaxed`, `text-muted-foreground`
  - Eyebrow: `text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground`
  - Metric numeral: `font-mono text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight`
- Max measure on prose: `max-w-[68ch]`. Never a full-width paragraph.

### Spacing & layout

- Container: `mx-auto w-full max-w-6xl px-6 sm:px-8`. Prose-heavy blocks narrow to `max-w-3xl`.
- Section rhythm: `py-20 sm:py-28 lg:py-32`. Never two different rhythms adjacent.
- Section header block: eyebrow → h2 → one-line description, `space-y-3`, `mb-12 sm:mb-16`.
- Grid gap: `gap-6`. Card padding: `p-6`. Radius: `rounded-xl` (12px) for cards, `rounded-lg`
  for buttons/inputs, `rounded-full` for pills/avatar.
- Borders do the separating, not shadows: `border border-border`. Shadow only on hover/raised.

### Elevation

```
rest:   (none) — border only
hover:  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]
dark hover: shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]
```

---

## 3. Motion

Framer Motion. **Every animation must respect `useReducedMotion()`** — when reduced, render the
final state immediately with no transform and no transition. This is non-negotiable and is an
acceptance criterion.

```ts
export const EASE = [0.16, 1, 0.3, 1] as const;   // expo-out; the house curve
export const DUR  = { fast: 0.18, base: 0.34, slow: 0.55 };
```

- **Section entrance:** `opacity 0→1`, `y 14→0`, `duration DUR.slow`, `ease EASE`,
  `whileInView` with `viewport={{ once: true, margin: '-80px' }}`. Stagger children by `0.06`.
- **Card hover:** `y: -2`, border brightens to `--accent-muted`, shadow fades in.
  Spring: `{ type: 'spring', stiffness: 400, damping: 30 }`. No scale on cards.
- **Button press:** `whileTap={{ scale: 0.98 }}`, `whileHover={{ y: -1 }}`.
- **Link underline:** `background-size` 0%→100% on a 1px gradient underline, `DUR.base`, `EASE`.
  Not `text-decoration`.
- **Nav active indicator:** shared `layoutId` pill that slides between items.
- **Mobile menu:** slide-in from right with a backdrop fade; trap focus; `Esc` closes.
- **Counters:** metrics count up once on first view, `DUR.slow`, integers only, `tabular-nums`
  so the layout never jitters. Reduced motion → render the final number.

**Budget:** no animation longer than 600ms. Nothing animates on page load above the fold except
the hero, and the hero's entrance must not delay LCP text paint (animate opacity/transform only
— never `width`, `height`, `top`, or `left`).

---

## 4. Component patterns

- **Card:** `rounded-xl border border-border bg-card p-6` + hover elevation. Interactive cards use
  a single stretched `<a>` overlay (`after:absolute after:inset-0`) so the whole card is one
  tab stop, not five.
- **Badge / tech pill:** `rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono
  text-muted-foreground`. Active/selected → `border-accent/40 bg-accent-muted text-accent-foreground`.
- **Metric block:** mono numeral + `text-xs text-muted-foreground` label beneath. Group in a
  `grid grid-cols-2 sm:grid-cols-4 divide-x divide-border` rail.
- **Section:** every section is `<section id="…" aria-labelledby="…-heading">` with a matching
  `<h2 id="…-heading">`. Heading order never skips a level.

---

## 5. Accessibility — acceptance criteria, not aspirations

1. Body text ≥ 4.5:1 contrast; large text and UI borders ≥ 3:1. Both themes. `--muted-foreground`
   values above are chosen to clear this — do not darken/lighten them ad hoc.
2. Visible focus on every interactive element:
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
   focus-visible:ring-offset-background`. Never `outline: none` without a replacement.
3. One `<h1>` per page. Heading levels descend without gaps.
4. Every interactive target ≥ 44×44px effective hit area (pad small icon buttons out).
5. All images have meaningful `alt`; decorative ones get `alt=""` + `aria-hidden`.
6. Icon-only buttons carry `aria-label`. Toggles carry `aria-pressed` or `aria-expanded`.
7. Keyboard: full operability, logical tab order, focus trapped in the mobile menu and any
   dialog, `Esc` closes overlays, focus returns to the trigger on close.
8. `<a href="#main" class="sr-only focus:not-sr-only …">Skip to content</a>` first in `<body>`.
9. Live regions: form submission results announce via `role="status"` / `aria-live="polite"`;
   validation errors bind with `aria-describedby` + `aria-invalid`.
10. Nothing conveyed by color alone — pair every color signal with text or an icon.

---

## 6. Performance — acceptance criteria

- Zero layout shift: every image has explicit `width`/`height` or a fixed aspect-ratio box.
- `next/image` everywhere, `priority` **only** on the hero avatar, `loading="lazy"` elsewhere.
- Server Components by default. `'use client'` only where interactivity genuinely requires it,
  and pushed to the smallest possible leaf — never on a whole page.
- No barrel-file re-exports that drag unrelated client code into a bundle.
- Heavy/below-fold interactive widgets: `next/dynamic` with a skeleton placeholder.
- Icons: import named icons from `lucide-react` individually. Never `import * as Icons`.
- No moment.js, no lodash (write the 6-line debounce), no chart library unless a ticket names one.

---

## 7. Routes (fixed — nav and links must match exactly)

| Path | Contents |
|---|---|
| `/` | Hero, About, Featured projects (3), Skills, Experience, Education, Contact CTA |
| `/projects` | All 4 projects, filter by tech, text search |
| `/projects/[slug]` | Full case study |
| `/performance` | The 19-item optimization checklist with live demos |
| `/contact` | Contact form |

Project slugs (exact): `fastev`, `sd-engage`, `karuna-growth-suite`, `ctapps-digital`.

Nav items: Projects · Performance · Contact, plus in-page anchors on `/` for About/Skills/Experience.

---

## 8. Voice

Third-person-free, first-person-light. State facts and numbers. No "passionate about clean code",
no "I love turning coffee into code", no exclamation marks. Example of the register:

> Sole mobile developer on FastEV — 450+ commits across 42 screens, integrating OCPP 1.6/2.0
> charge points with four Malaysian payment and fiscal systems.
