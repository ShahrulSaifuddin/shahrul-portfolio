import type { ExperienceItem } from '@/lib/types'

/**
 * Employment history, most recent first.
 */
export const experience = [
  {
    company: 'Karuna Sarawak Enterprise Sdn Bhd',
    role: 'Full-Stack Developer',
    location: 'Sarawak, Malaysia',
    period: 'Aug 2024 – Present',
    startDate: '2024-08',
    endDate: null,
    icon: 'Briefcase',
    bullets: [
      'Delivers FastEV, SD Engage, Karuna Growth Suite and CTApps Digital.',
    ],
  },
  {
    company: 'Thunder Software (M) Sdn Bhd',
    role: 'Software Engineer',
    location: 'Georgetown, Penang',
    period: 'Jul 2022 – Jul 2024',
    startDate: '2022-07',
    endDate: '2024-07',
    icon: 'Briefcase',
    bullets: [
      'Led full-stack development of a MERN scheduling application (React, Node.js / Express, MongoDB), raising measured application performance from 55% to 95–100%.',
      'Ran Agile delivery in Jira, building custom workflow configurations and automations that streamlined releases across the team.',
    ],
  },
  {
    company: 'Skymind CNS Sdn Bhd',
    role: 'Junior AI Engineer',
    location: 'Georgetown, Penang',
    period: 'Sep 2021 – May 2022',
    startDate: '2021-09',
    endDate: '2022-05',
    icon: 'Briefcase',
    bullets: [
      'Performed data annotation and validation testing for computer-vision training pipelines.',
      'Contributed as a hybrid mobile front-end engineer adapting web applications for mobile.',
    ],
  },
] as const satisfies readonly ExperienceItem[]
