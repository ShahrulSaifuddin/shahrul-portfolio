/**
 * Shared TypeScript types for the portfolio content data layer.
 *
 * Pure types only — no React, no runtime imports. Every data module under
 * `src/lib/data/**` and `src/lib/site.ts` is typed against these interfaces so
 * consuming components get precise autocomplete and compile-time checks.
 */

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  /** Full URL, or a `mailto:` / `tel:` URI. */
  href: string
  /** lucide-react icon name (e.g. `'Mail'`), not an imported component. */
  icon: string
}

export interface SiteConfig {
  name: string
  title: string
  description: string
  url: string
  ogImage: string
  nav: readonly NavItem[]
  social: readonly SocialLink[]
}

// ---------------------------------------------------------------------------
// Profile / hero
// ---------------------------------------------------------------------------

export interface Profile {
  fullName: string
  displayName: string
  title: string
  tagline: string
  location: string
  email: string
  phone: string
  github: string
  /** Path to the resume PDF under `public/`. */
  resumeUrl: string
  /** Fallback initials shown when the profile photo is unavailable. */
  avatarInitials: string
  summary: string
}

export interface HeroMetric {
  value: string
  label: string
  /** lucide-react icon name. */
  icon: string
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectSlug =
  | 'fastev'
  | 'sd-engage'
  | 'karuna-growth-suite'
  | 'ctapps-digital'

export type ProjectLinkKind = 'live' | 'app-store' | 'play-store' | 'case-study'

export interface ProjectLink {
  label: string
  href: string
  kind: ProjectLinkKind
}

export interface ProjectMetric {
  /** Short value for a metric-rail card, e.g. `'450'` or `'~3×'`. */
  value: string
  label: string
}

export interface Project {
  slug: ProjectSlug
  name: string
  subtitle: string
  status: string
  /** Employer/agency delivering the project, or `null` when none applies. */
  company: string | null
  /** External client commissioning the project, or `null` when none applies. */
  client: string | null
  /** Human-readable display period, e.g. `'Aug 2024 – Present'`. */
  period: string
  /** ISO `YYYY-MM` start date. */
  startDate: string
  /** ISO `YYYY-MM` end date, or `null` when ongoing. */
  endDate: string | null
  role: string
  links: readonly ProjectLink[]
  metrics: readonly ProjectMetric[]
  highlights: readonly string[]
  tech: readonly string[]
  /** Whether the project appears in the home page's featured rail. */
  featured: boolean
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export interface SkillCategory {
  name: string
  /** lucide-react icon name. */
  icon: string
  skills: readonly string[]
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export interface ExperienceItem {
  company: string
  role: string
  location: string
  /** Human-readable display period, e.g. `'Jul 2022 – Jul 2024'`. */
  period: string
  /** ISO `YYYY-MM` start date. */
  startDate: string
  /** ISO `YYYY-MM` end date, or `null` when ongoing. */
  endDate: string | null
  /** lucide-react icon name. */
  icon: string
  bullets: readonly string[]
}

// ---------------------------------------------------------------------------
// Education & certifications
// ---------------------------------------------------------------------------

export interface EducationItem {
  institution: string
  degree: string
  location: string
  /** Freeform supporting detail, e.g. `'CGPA 3.70 / 4.00'`. */
  detail: string
  /** Human-readable display period, e.g. `'Mar 2016 – Jul 2019'`. */
  period: string
  /** ISO `YYYY-MM` start date. */
  startDate: string
  /** ISO `YYYY-MM` end date, or `null` when ongoing. */
  endDate: string | null
  /** lucide-react icon name. */
  icon: string
}

export interface Certification {
  name: string
  /** Issuing body, or `null` when none was supplied. */
  issuer: string | null
  /** lucide-react icon name. */
  icon: string
}

// ---------------------------------------------------------------------------
// Performance checklist
// ---------------------------------------------------------------------------

export type PerformanceCategory =
  | 'Caching'
  | 'Assets'
  | 'Rendering'
  | 'Data'
  | 'Delivery'
  | 'Build'

export type PerformanceDemo =
  | 'debounce'
  | 'skeleton'
  | 'pagination'
  | 'lazy-image'
  | 'memo'
  | null

export interface PerformanceItem {
  slug: string
  title: string
  category: PerformanceCategory
  /** One sentence, <= 130 chars: what the technique does. */
  summary: string
  /** 2-3 sentences: the mechanism and when it matters. */
  detail: string
  /** How THIS portfolio applies it — must be truthful, never invented. */
  appliedHere: string
  /** A concrete number/config where one genuinely exists, else `null`. */
  evidence: string | null
  /** Which live demo (if any) this item drives on `/performance`. */
  demo: PerformanceDemo
  /** lucide-react icon name. */
  icon: string
}
