import type { SkillCategory } from '@/lib/types'

/**
 * The five skill groupings, verbatim from the resume. No proficiency
 * percentages — grouping and listing is the whole design.
 */
export const skillCategories = [
  {
    name: 'Mobile',
    icon: 'Smartphone',
    skills: [
      'React Native 0.81',
      'React Navigation',
      'Redux Toolkit',
      'Reanimated',
      'Firebase Cloud Messaging',
      'Pusher',
      'Vision Camera (QR)',
      'Google & Apple Sign-In',
      'Native module bridging (Kotlin / Swift)',
      'App Store & Google Play releases',
    ],
  },
  {
    name: 'Web',
    icon: 'Globe',
    skills: [
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'shadcn/Radix UI',
      'Apollo Client & GraphQL',
      'Framer Motion',
      'React Query',
      'Static prerendering (SSG)',
      'Vue.js',
    ],
  },
  {
    name: 'Backend & Data',
    icon: 'Database',
    skills: [
      'Laravel 10',
      'PHP 8',
      'Node.js',
      'Express',
      'REST API design',
      'Sanctum & JWT',
      'Eloquent ORM',
      'Queued jobs & schedulers',
      'MySQL',
      'MongoDB',
      'SQLite',
      'Firebase',
    ],
  },
  {
    name: 'Integrations',
    icon: 'Plug',
    skills: [
      'OCPP 1.6 / 2.0 (EV charging)',
      'Stripe',
      'SenangPay',
      'S-Pay Global',
      'Finexus',
      'LHDN MyInvois e-Invoicing',
      'FCM & Expo Push',
      'Twilio / Vonage',
      'Headless WordPress (WPGraphQL)',
    ],
  },
  {
    name: 'DevOps & Tools',
    icon: 'Wrench',
    skills: [
      'Git & GitHub',
      'GitHub Actions CI/CD',
      'CloudPanel',
      'Nginx',
      'PM2',
      'Linux VPS',
      'Gradle / AGP / NDK',
      'CocoaPods',
      'Jira',
      'Agile & Scrum',
    ],
  },
] as const satisfies readonly SkillCategory[]
