# Cross-Worker API Contracts — Wave 2

Four workers build in parallel. Some of them **import modules that another worker is writing at the
same moment**. That only works if everyone honours these signatures exactly.

**If you own a contract below, implement it EXACTLY as written — same file path, same export name,
same props.** Other workers are already calling it.
**If you consume a contract below, import it and use it. Do NOT create your own copy** — a duplicate
`Container` or a second `Reveal` is a build break and a review rejection.

Your own build may fail while your peers are still writing their files. That is expected. Verify
with `npx tsc --noEmit` and fix only errors inside YOUR write set; leave "module not found" errors
for files owned by another worker — the foreman runs the full build once everyone lands.

---

## Owned by T2a (layout) — consumed by T2b, T2c, T2d

### `src/lib/motion.ts` (no `'use client'`; plain constants)

```ts
import type { Variants } from 'framer-motion'

export const EASE: readonly [number, number, number, number] // [0.16, 1, 0.3, 1]
export const DUR: { readonly fast: 0.18; readonly base: 0.34; readonly slow: 0.55 }
export const fadeUp: Variants        // hidden: { opacity: 0, y: 14 } / visible: { opacity: 1, y: 0 }
export const staggerParent: (staggerChildren?: number) => Variants
export const cardHoverSpring: { type: 'spring'; stiffness: 400; damping: 30 }
```

### `src/components/motion/reveal.tsx` (`'use client'`)

```tsx
type RevealTag = 'div' | 'section' | 'article' | 'li' | 'ul' | 'header'

export function Reveal(props: {
  children: React.ReactNode
  delay?: number          // seconds, default 0
  as?: RevealTag          // default 'div'
  className?: string
}): React.ReactElement

export function RevealGroup(props: {
  children: React.ReactNode
  stagger?: number        // default 0.06
  as?: RevealTag          // default 'div'
  className?: string
}): React.ReactElement

export function RevealItem(props: {
  children: React.ReactNode
  as?: RevealTag          // default 'div'
  className?: string
}): React.ReactElement
```

Behaviour: `Reveal` animates itself on `whileInView` with `viewport={{ once: true, margin: '-80px' }}`.
`RevealGroup` orchestrates `RevealItem` children via `staggerChildren`. **All three must call
`useReducedMotion()` and render the final state with no transform and no transition when it is true.**

### `src/components/layout/container.tsx` (server component)

```tsx
export function Container(props: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'main' | 'footer' | 'header'   // default 'div'
}): React.ReactElement
```
Renders `mx-auto w-full max-w-6xl px-6 sm:px-8` merged with `className` via `cn`.

### `src/components/layout/section-header.tsx` (server component)

```tsx
export function SectionHeader(props: {
  id: string                 // the <h2> gets id={`${id}-heading`}
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'  // default 'left'
  className?: string
}): React.ReactElement
```

### `src/components/layout/metric-rail.tsx` (`'use client'`)

```tsx
export function MetricRail(props: {
  metrics: readonly { value: string; label: string }[]
  className?: string
  countUp?: boolean          // default false; when true, integer-leading values count up once in view
}): React.ReactElement
```
Values are strings like `'450'`, `'~3×'`, `'100'`, `'5'`. When `countUp` is true, animate only the
leading integer and preserve any prefix/suffix. Respect `useReducedMotion()` → render final value.
Use `tabular-nums` so the layout never jitters.

### `src/components/layout/icons.tsx` (server component)

```tsx
export function GitHubIcon(props: React.SVGProps<SVGSVGElement>): React.ReactElement
```
`lucide-react@1.47` has **no brand icons**, so this is a hand-written inline SVG GitHub mark with
`aria-hidden="true"`, `focusable="false"`, `fill="currentColor"`, default `className="size-4"`.

---

## Owned by T2c (projects) — consumed by T2b

### `src/components/projects/project-card.tsx`

```tsx
import type { Project } from '@/lib/types'

export function ProjectCard(props: {
  project: Project
  className?: string
}): React.ReactElement
```
Self-contained card: name, subtitle, status, role, metric rail, tech pills, and a stretched link
overlay to `/projects/${project.slug}` so the whole card is ONE tab stop. Must look correct both in
a 3-up grid (home page) and a 2-up grid (/projects). Do not require any wrapper to style it.

---

## Route map (fixed — everyone links to these exact paths)

| Path | Owner |
|---|---|
| `/` | T2b |
| `/projects` | T2c |
| `/projects/[slug]` | T2c |
| `/performance` | T2d |
| `/contact` | T2d |
| `/api/contact` | T2d |

Home-page section anchor ids (T2b creates them; T2a's nav links to them):
`#about`, `#projects`, `#skills`, `#experience`, `#education`, `#contact`

Nav (T2a): `About → /#about`, `Projects → /projects`, `Performance → /performance`,
`Contact → /contact`. Plus a theme toggle and a GitHub icon link.

Project slugs: `fastev`, `sd-engage`, `karuna-growth-suite`, `ctapps-digital`.

---

## Shared rules for all four Wave 2 workers

- `import { cn } from '@/lib/utils'`. `clsx` and `tailwind-merge` are NOT installed.
- Content comes from `@/lib/data/*` and `@/lib/site`. **Never hardcode a fact in a component.**
- Server Components by default. Add `'use client'` only to the smallest leaf that needs it.
  A page file should almost never be a client component.
- Tailwind v4: no `tailwind.config.ts`, and do not create one.
- `src/components/ui/**` (shadcn) is READ-ONLY. Do not run `shadcn add`. `package.json` is FROZEN.
- Every animation respects `useReducedMotion()`.
- Icons: `import { Zap } from 'lucide-react'` — named imports only, never `import * as`.
- Data modules store lucide icon NAMES as strings. Resolve them with an explicit local map, e.g.
  `const ICONS = { Smartphone, Globe, Server } as const` — **never** `Icons[name]` over a namespace
  import, which defeats tree-shaking and pulls the entire icon set into the bundle.
