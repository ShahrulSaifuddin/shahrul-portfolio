import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { ProjectFilter } from '@/components/projects/project-filter'
import { allProjectTech, projects } from '@/lib/data/projects'
import { siteConfig } from '@/lib/site'

const title = `Projects — ${siteConfig.name}`
const description =
  'Four production systems shipped end to end — EV-charging hardware, event-ticketing payments, and two Lighthouse-100 web platforms. Filter by technology or search by name, role and stack.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/projects`,
    type: 'website',
  },
}

export default function ProjectsPage() {
  return (
    <Container as="div" className="py-20 sm:py-28 lg:py-32">
      {/* SectionHeader (T2a) always renders its title as an <h2>, which is
          correct for an in-page section but this route needs exactly one
          <h1>. A visually-hidden h1 gives the page its landmark heading
          without duplicating the visible title text. */}
      <h1 className="sr-only">Projects</h1>

      <SectionHeader
        id="projects"
        eyebrow="Selected work"
        title="Projects"
        description="Mobile apps, backend APIs, and web platforms shipped end to end — filter by technology or search across role, stack and highlights."
      />

      <ProjectFilter projects={projects} allTech={allProjectTech} />
    </Container>
  )
}
