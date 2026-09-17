# Design Spec — Shahrul Saifuddin Portfolio

## 0. Scaffold facts (verified by the foreman — do not re-derive, do not "fix")

- **Next.js 15.5.25, React 19.1.0, Tailwind v4.3.3, TypeScript 5.9.3, framer-motion 13.4.0.**
- **Tailwind v4 is CSS-first. There is NO `tailwind.config.ts` and you must not create one.**
  All tokens live in `src/app/globals.css` (`:root`, `.dark`, and the `@theme inline` block).
- `src/lib/utils.ts` is `export { cn } from "cn"`. The `cn` package (from the official
  `shadcn-ui/cn` repo) replaces `clsx` + `tailwind-merge`. **Import `cn` from `@/lib/utils`.**
  Do NOT `import { clsx }` or `import { twMerge }` — they are not installed.
- shadcn primitives already installed in `src/components/ui/`, style `radix-nova`, built on the
  consolidated `radix-ui` package: button, card, badge, input, textarea, label, sheet, dialog,
  tabs, skeleton, separator, tooltip, accordion, progress, sonner.
  **These are READ-ONLY. Do NOT run `shadcn add` — it mutates `components.json` + `package.json`
  and would collide with other workers.** Need a primitive that is missing? Build it by hand
  inside your own write set.
- **`package.json` is FROZEN.** Every dependency and script the project needs is already there.
  Do not install, uninstall, or add scripts. If you believe something is missing, report
  `NEEDS_CONTEXT` instead of installing it.
- This machine's global `~/.npmrc` sets `package-lock=false`. Irrelevant unless you install
  something — which you must not.
- `globals.css` expects the font variables **`--font-sans`** and **`--font-geist-mono`**. T2a wires
  these with `next/font/google` (Geist + Geist_Mono) in `src/app/layout.tsx`.
- `<TooltipProvider>` is not yet mounted. **T2a** mounts it in the root layout.
- Playwright is installed but **browser binaries are not downloaded** — T3b must run
  `npx playwright install --with-deps chromium` before running tests.
- The `lint` script is `next lint`, which prints a deprecation notice on Next 15 but exits 0.
  Leave it alone.

---

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

All tokens live in `src/app/globals.css` as CSS custom properties, exposed to Tailwind v4 via the
existing `@theme inline` block. Owned by **T2a**. Everyone else consumes them via Tailwind utility
classes (`bg-background`, `text-muted-foreground`, `border-border`, `text-brand`, …).

> **FOREMAN AMENDMENT (post-scaffold).** shadcn/ui already defines `--accent` and it means
> *"neutral hover surface"* — its ghost/outline buttons, dropdown items, and tab triggers all use
> `bg-accent` on hover. If we overloaded `--accent` with the teal brand color, every hover state in
> the site would flood teal. So:
>
> - `--accent` / `--accent-foreground` **keep shadcn's neutral semantics — do not repurpose them.**
> - `--primary` / `--primary-foreground` become the **brand teal** (shadcn's default `<Button>` is
>   the primary CTA, so this is exactly right).
> - New `--brand` / `--brand-foreground` / `--brand-muted` tokens carry brand color anywhere that
>   is not a button: rails, active indicators, metric highlights, badges.
> - `--ring` becomes brand teal so focus rings are on-brand.

### Color — light (`:root`)

```
--background:            oklch(0.995 0 0)        /* near-white, not pure */
--foreground:            oklch(0.205 0.005 285)  /* near-black ink */
--card:                  oklch(1 0 0)
--card-foreground:       oklch(0.205 0.005 285)
--popover:               oklch(1 0 0)
--popover-foreground:    oklch(0.205 0.005 285)
--muted:                 oklch(0.968 0.002 285)
--muted-foreground:      oklch(0.505 0.008 285)  /* passes 4.5:1 on --background */
--accent:                oklch(0.968 0.002 285)  /* NEUTRAL hover surface — shadcn semantics */
--accent-foreground:     oklch(0.205 0.005 285)
--secondary:             oklch(0.968 0.002 285)
--secondary-foreground:  oklch(0.205 0.005 285)
--border:                oklch(0.918 0.004 285)
--input:                 oklch(0.918 0.004 285)
--destructive:           oklch(0.58 0.21 27)

--primary:               oklch(0.58 0.12 168)    /* BRAND teal — CTA fill; 4.5:1 vs white text */
--primary-foreground:    oklch(0.99 0.01 168)
--brand:                 oklch(0.52 0.12 168)    /* brand INK on light bg — 4.5:1 on --background */
--brand-foreground:      oklch(0.99 0.01 168)
--brand-muted:           oklch(0.955 0.03 168)   /* tints, badge fills, rails */
--ring:                  oklch(0.58 0.12 168)
--success:               oklch(0.52 0.12 168)
```

### Color — dark (`.dark`)

```
--background:            oklch(0.165 0.004 285)
--foreground:            oklch(0.955 0.002 285)
--card:                  oklch(0.205 0.005 285)
--card-foreground:       oklch(0.955 0.002 285)
--popover:               oklch(0.205 0.005 285)
--popover-foreground:    oklch(0.955 0.002 285)
--muted:                 oklch(0.245 0.005 285)
--muted-foreground:      oklch(0.735 0.008 285)  /* passes 4.5:1 on dark --background */
--accent:                oklch(0.265 0.005 285)  /* NEUTRAL hover surface — shadcn semantics */
--accent-foreground:     oklch(0.955 0.002 285)
--secondary:             oklch(0.265 0.005 285)
--secondary-foreground:  oklch(0.955 0.002 285)
--border:                oklch(0.295 0.006 285)
--input:                 oklch(0.305 0.006 285)
--destructive:           oklch(0.66 0.19 27)

--primary:               oklch(0.76 0.13 168)    /* BRAND teal, lifted for dark bg */
--primary-foreground:    oklch(0.17 0.03 168)    /* dark ink on teal fill */
--brand:                 oklch(0.78 0.13 168)    /* brand ink on dark bg — 4.5:1+ */
--brand-foreground:      oklch(0.17 0.03 168)
--brand-muted:           oklch(0.27 0.045 168)
--ring:                  oklch(0.76 0.13 168)
--success:               oklch(0.78 0.13 168)
```

**T2a must also register the new tokens in the `@theme inline` block** so the utilities exist:

```
--color-brand: var(--brand);
--color-brand-foreground: var(--brand-foreground);
--color-brand-muted: var(--brand-muted);
--color-success: var(--success);
```

### FOREMAN AMENDMENT 2 — measured contrast corrections (2026-09-17)

The foreman converted every token pair from OKLCH → sRGB and computed real WCAG 2.1 ratios
(script: `.foreman/scratch/contrast.mjs`). **Two of the values originally specified above failed.**
They are corrected here; these corrected values are authoritative.

| Token | Was | **Now** | Measured | Why |
|---|---|---|---|---|
| light `--primary` | `oklch(0.58 0.12 168)` | **`oklch(0.53 0.12 168)`** | 4.76:1 | `--primary-foreground` on the CTA fill measured **3.92:1 — FAIL**. The main "Get in touch" button had illegible label text in light mode. |
| light `--brand` | `oklch(0.52 0.12 168)` | **`oklch(0.50 0.12 168)`** | 4.87:1 on `--brand-muted` | Was exactly 4.50:1 on the badge tint — dead on the line, no rounding margin. |
| light `--ring` | `oklch(0.58 0.12 168)` | **`oklch(0.53 0.12 168)`** | — | Track `--primary`. |
| light `--input` | `oklch(0.918 0.004 285)` | **`oklch(0.65 0.004 285)`** | 3.21:1 | Form-control borders fall under WCAG **1.4.11 non-text contrast (3:1)**. At the old value they measured **1.26:1 — FAIL**. |
| dark `--input` | `oklch(0.305 0.006 285)` | **`oklch(0.52 0.006 285)`** | 3.49:1 | Same rule, dark theme. Was 1.39:1. |
| dark `--ring` | `oklch(0.76 0.13 168)` | unchanged | 9.50:1 | Already passing. |

**`--border` stays as specified and is deliberately NOT raised to 3:1.** WCAG 1.4.11 governs UI
component boundaries and meaningful graphics — not decorative hairline dividers between cards.
Forcing every card edge to 3:1 would make the site look like a wireframe. **`--input` is therefore
now a genuinely different value from `--border`** — do not "tidy" them back together.

Everything else measured clean, with generous margins:
body text 17.67:1 light / 16.90:1 dark; secondary text 5.80:1 / 8.20:1; brand ink 5.00:1 / 10.18:1.

**Brand discipline:** brand color is a *spice*. Per viewport, at most ~3 brand-colored elements —
typically the primary CTA, the active nav indicator, and one data highlight. Never brand-color body
text. Never brand-fill a large surface. Hover states stay neutral (`bg-accent`).

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
