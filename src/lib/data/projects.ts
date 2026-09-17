import type { Project, ProjectSlug } from '@/lib/types'

/**
 * All four shipped projects, in resume order. `/projects` renders all of
 * them; the home page renders only `featuredProjects`.
 */
export const projects = [
  {
    slug: 'fastev',
    name: 'FastEV',
    subtitle: 'EV charging network',
    status: 'Live on the App Store & Google Play',
    company: 'Karuna Sarawak Enterprise Sdn Bhd',
    client: null,
    period: 'Aug 2024 – Present',
    startDate: '2024-08',
    endDate: null,
    role: 'Sole mobile developer; lead backend contributor',
    links: [
      {
        label: 'View platform page',
        href: 'https://karunaventure.co/platforms/fastev',
        kind: 'live',
      },
    ],
    metrics: [
      { value: '450', label: 'of 494 app commits' },
      { value: '42', label: 'screens · 5 Redux slices' },
      { value: '402', label: 'of 830 backend commits' },
      { value: '90', label: 'API routes · 42 models' },
      { value: '~3×', label: 'faster push notifications' },
    ],
    highlights: [
      'Integrated OCPP 1.6/2.0 charge-point hardware — remote start/stop commands plus live meter and status events — mapped onto prepaid billing priced per kWh or per minute.',
      'Shipped four payment and fiscal integrations: SenangPay, S-Pay Global (with a bridged Android native module and an iOS deep-link return), Finexus card pre-authorisation, and LHDN MyInvois e-invoicing.',
      'Delivered the Android 16 KB page-size migration ahead of the Google Play deadline: React Native 0.71 → 0.81, React 18 → 19, AGP 8.13, compileSdk 36, NDK 27.',
      'Cut push-notification latency roughly 3× with FCM OAuth token caching and pooled multi-device delivery; made wallet billing safe against duplicate concurrent hardware events.',
    ],
    tech: [
      'React Native 0.81',
      'Redux Toolkit',
      'React Navigation',
      'Laravel 10',
      'PHP 8',
      'MySQL',
      'Firebase Cloud Messaging',
      'OCPP 1.6/2.0',
      'Kotlin',
      'Swift',
    ],
    featured: true,
  },
  {
    slug: 'sd-engage',
    name: 'SD Engage',
    subtitle: 'Event ticketing platform',
    status: 'Live on the App Store & Google Play',
    company: 'Karuna Sarawak Enterprise Sdn Bhd',
    client: 'Sarawak Digital Economy Corporation Berhad',
    period: 'Aug 2024 – Present',
    startDate: '2024-08',
    endDate: null,
    role: 'Core engineer on a 15-developer platform',
    // No store or case-study links were supplied for this project — do not
    // fabricate one. Empty on purpose.
    links: [],
    metrics: [
      { value: '413', label: 'commits' },
      { value: '~26', label: 'of 38 mobile API controllers owned' },
      { value: '15', label: 'developers on the platform' },
    ],
    highlights: [
      'Owned the Sanctum-authenticated REST API and the push and realtime layer serving the published iOS and Android clients.',
      'Built mobile checkout and payments (Stripe PaymentIntents with webhooks, S-Pay Global), QR ticket check-in, business matching, 1:1 messaging and e-certificates.',
      'Batched Expo push delivery and Pusher realtime events.',
    ],
    tech: [
      'React Native',
      'Laravel',
      'Sanctum',
      'Stripe',
      'S-Pay Global',
      'Expo Push',
      'Pusher',
      'MySQL',
    ],
    featured: false,
  },
  {
    slug: 'karuna-growth-suite',
    name: 'Karuna Growth Suite',
    subtitle: 'Corporate web platform',
    status: 'Live in production',
    company: null,
    client: null,
    period: 'Aug 2024 – Present',
    startDate: '2024-08',
    endDate: null,
    role: 'Sole developer',
    links: [{ label: 'Visit site', href: 'https://karunaventure.co/', kind: 'live' }],
    metrics: [
      { value: '100', label: 'Accessibility · Best Practices · SEO' },
      { value: '90+', label: 'Lighthouse Performance' },
      { value: '35', label: 'routes prerendered to static HTML' },
    ],
    highlights: [
      'Headless WordPress (WPGraphQL) and a React 19 / Vite front end prerendered to static HTML across 35 routes, letting non-technical staff manage every page without touching code.',
      'Migrated the product off a low-code backend onto a self-built Express / SQLite API (JWT auth, bcrypt, rate limiting, SMTP) with zero call-site changes.',
      'Shipped an admin CRM and GitHub Actions CI/CD to a CloudPanel / Nginx VPS with a PM2-managed API.',
    ],
    tech: [
      'React 19',
      'Vite',
      'WPGraphQL',
      'Apollo Client',
      'Tailwind CSS',
      'Express',
      'SQLite',
      'JWT',
      'GitHub Actions',
      'CloudPanel',
      'Nginx',
      'PM2',
    ],
    featured: true,
  },
  {
    slug: 'ctapps-digital',
    name: 'CTApps Digital',
    subtitle: 'Commercial platform',
    status: 'Live in production',
    company: null,
    client: null,
    period: 'Aug 2024 – Present',
    startDate: '2024-08',
    endDate: null,
    role: 'Sole developer',
    links: [{ label: 'Visit site', href: 'https://ctappsdigital.com/', kind: 'live' }],
    metrics: [
      { value: '8', label: 'product catalogue' },
      { value: '3', label: 'authentication methods' },
    ],
    highlights: [
      'Built the customer-facing platform and the admin inquiry dashboard.',
      'Eight-product catalogue with gated lead capture and a product-grounded LLM assistant.',
      'Full authentication: email, Google OAuth and OTP.',
      'DPR-aware responsive image pipeline.',
    ],
    tech: ['React 18', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'Express', 'LLM integration'],
    featured: true,
  },
] as const satisfies readonly Project[]

/**
 * The three projects surfaced on the home page, in the order specified by
 * the content brief: FastEV, Karuna Growth Suite, CTApps Digital.
 */
export const featuredProjects = projects.filter((project) => project.featured)

/**
 * Look up a project by its route slug. Typed against the literal slug union
 * so callers get autocomplete and `/projects/[slug]` can validate params.
 */
export function getProjectBySlug(slug: ProjectSlug): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/**
 * Every distinct tech token across all projects, deduplicated and sorted
 * alphabetically. Drives the `/projects` tech filter.
 */
export const allProjectTech: readonly string[] = Array.from(
  new Set(projects.flatMap((project) => project.tech)),
).sort((a, b) => a.localeCompare(b))
