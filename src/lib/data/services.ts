/**
 * What a client can hire for. Every "proof" line points at shipped work in
 * `projects.ts` / the résumé — no invented clients, numbers or testimonials.
 * Owner: edit freely; the layout adapts to any count.
 */
export const services = [
  {
    id: 'mobile',
    icon: 'Smartphone',
    title: 'Mobile apps',
    summary:
      'iOS and Android apps in React Native, built to production and taken through App Store and Google Play review.',
    deliverables: ['React Native', 'Push notifications', 'Native modules', 'Store release'],
    proof: 'FastEV and SD Engage — both live in the stores',
  },
  {
    id: 'web',
    icon: 'Globe',
    title: 'Websites & web apps',
    summary:
      'Fast, accessible marketing sites and web platforms in React and Next.js, with a CMS your team can edit without a developer.',
    deliverables: ['React / Next.js', 'Headless CMS', 'SEO', 'Admin dashboards'],
    proof: '100 Lighthouse Accessibility, Best Practices & SEO on karunaventure.co',
  },
  {
    id: 'backend',
    icon: 'Server',
    title: 'Backends & APIs',
    summary:
      'Laravel and Node.js APIs with auth, realtime, queues and an admin panel — deployed with CI/CD onto a server you own.',
    deliverables: ['Laravel / Node.js', 'MySQL', 'Realtime', 'CI/CD & VPS'],
    proof: '90 API routes and 42 models behind FastEV',
  },
  {
    id: 'payments',
    icon: 'CreditCard',
    title: 'Payments & integrations',
    summary:
      'Payment gateways, e-invoicing and hardware protocols wired in end to end, including the edge cases that cost money.',
    deliverables: ['Stripe', 'SenangPay · S-Pay', 'LHDN MyInvois', 'OCPP 1.6 / 2.0'],
    proof: 'Four payment and fiscal integrations shipped',
  },
] as const

export type Service = (typeof services)[number]

/** How an engagement runs. Owner: adjust to how you actually like to work. */
export const processSteps = [
  {
    title: 'Discover',
    body: 'A call about the goal, the users and the constraints. You get a written scope, a timeline and a quote.',
  },
  {
    title: 'Design & build',
    body: 'Short milestones with a live preview link, so you see real progress every week — not a big reveal at the end.',
  },
  {
    title: 'Launch',
    body: 'Deployment, App Store and Google Play submission, and a handover your team can actually run with.',
  },
  {
    title: 'Support',
    body: 'Fixes, improvements and new features after launch, whenever you need them.',
  },
] as const
