import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { PageBackdrop } from '@/components/layout/page-backdrop'
import { SectionHeader } from '@/components/layout/section-header'
import { ProjectFilter } from '@/components/projects/project-filter'
import { allProjectTech, projects } from '@/lib/data/projects'
import { siteConfig } from '@/lib/site'

// Every figure is counted from the data layer, not typed in.
const STATS = [
  { value: String(projects.length), label: 'Production systems shipped end to end' },
  {
    value: String(projects.filter((p) => p.status.includes('App Store')).length),
    label: 'Apps live on both mobile stores',
  },
  { value: String(allProjectTech.length), label: 'Technologies across the four stacks' },
]

// The root layout sets `title.template` to `%s — <name>`, so a page title must
// NOT repeat the site name — doing so rendered
// "Projects — Shahrul Saifuddin — Shahrul Saifuddin" in the browser tab and in
// search results. `socialTitle` stays fully qualified because an Open Graph
// title appears on its own in a shared card, with no template applied.
const title = 'Projects'
const socialTitle = `Projects — ${siteConfig.name}`
// Every claim here must be traceable to src/lib/data/projects.ts. An earlier
// revision said "two Lighthouse-100 web platforms" — only ONE project
// (Karuna Growth Suite) has a documented Lighthouse score, so that was an
// invented credential sitting in a crawlable meta description. Do not add a
// number to this string that the data layer cannot back.
const description =
  'Four production systems shipped end to end — EV-charging hardware and OCPP integration, event-ticketing payments, and corporate web platforms. Filter by technology or search by name, role and stack.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: socialTitle,
    description,
    url: `${siteConfig.url}/projects`,
    type: 'website',
  },
}

export default function ProjectsPage() {
  return (
    <div className="relative isolate">
      <PageBackdrop />
      <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32">
        <SectionHeader
          id="projects"
          index="/projects"
          eyebrow="Selected work"
          title="Projects, in production."
          accent={['production.']}
          description="Mobile apps, backend APIs, and web platforms shipped end to end — filter by technology or search across role, stack and highlights."
          as="h1"
        />

        <MetricRail metrics={STATS} countUp className="mb-12 sm:mb-16" />

        <ProjectFilter projects={projects} allTech={allProjectTech} />
      </Container>
    </div>
  )
}
