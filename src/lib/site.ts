import type { SiteConfig } from '@/lib/types'

/**
 * Global site configuration: metadata, primary navigation, and social links.
 * Consumed by the root layout (metadata), the header/footer nav, and contact
 * surfaces.
 */
export const siteConfig = {
  name: 'Shahrul Saifuddin',
  title: 'Shahrul Saifuddin — Full-Stack Engineer',
  description:
    'Full-stack engineer with 5 years shipping production mobile and web systems across EV charging, fintech and event ticketing — React Native and React front ends, Laravel and Node.js APIs, and CI/CD onto Linux VPS infrastructure.',
  // Placeholder — the owner should point this at the real production domain
  // before deploying. Not supplied by the content brief.
  url: 'https://shahrulsaifuddin.com',
  // Served by the `src/app/opengraph-image.tsx` file convention, which Next
  // wires into every page's metadata automatically — this string is kept
  // only to satisfy `SiteConfig` and for anything that wants the path as
  // plain text; it is intentionally NOT referenced in `layout.tsx`'s
  // `openGraph.images` / `twitter.images` (see comment there).
  ogImage: '/opengraph-image',
  nav: [
    { label: 'Projects', href: '/projects' },
    { label: 'Performance', href: '/performance' },
    { label: 'Contact', href: '/contact' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/ShahrulSaifuddin', icon: 'Code' },
    { label: 'Email', href: 'mailto:saifuddinshahrul@gmail.com', icon: 'Mail' },
  ],
} as const satisfies SiteConfig
