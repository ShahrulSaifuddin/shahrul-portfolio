import type { HeroMetric, Profile } from '@/lib/types'

/**
 * Core identity/contact facts, verbatim from the content brief.
 */
export const profile = {
  fullName: 'Shahrul Saifuddin Bin Ahmad Rosli',
  displayName: 'Shahrul Saifuddin',
  title: 'Full-Stack Engineer',
  tagline: 'Full-Stack Engineer · React Native · Laravel · Node.js',
  location: 'Kuala Lumpur, Malaysia',
  email: 'saifuddinshahrul@gmail.com',
  phone: '+60 17-275 0530',
  github: 'https://github.com/ShahrulSaifuddin',
  resumeUrl: '/Shahrul_Saifuddin_Resume_2026.pdf',
  avatarInitials: 'SS',
  summary:
    'Full-stack engineer with 5 years shipping production mobile and web systems across EV charging, fintech and event ticketing, with two products live on the App Store and Google Play. Owns features end to end — React Native and React front ends, Laravel and Node.js APIs, payment gateway and hardware protocol integrations, and CI/CD onto Linux VPS infrastructure.',
} as const satisfies Profile

/**
 * The four headline stats for the hero metric rail. Exactly these four —
 * do not add more without a corresponding fact in the content brief.
 */
export const heroMetrics = [
  { value: '5', label: 'Years shipping production systems', icon: 'Clock' },
  { value: '2', label: 'Products live on App Store & Google Play', icon: 'Smartphone' },
  { value: '4', label: 'Payment & fiscal integrations shipped', icon: 'CreditCard' },
  {
    value: '100',
    label: 'Lighthouse Accessibility, Best Practices & SEO on karunaventure.co',
    icon: 'Gauge',
  },
] as const satisfies readonly HeroMetric[]
