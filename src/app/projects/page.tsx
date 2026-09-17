import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { ProjectFilter } from '@/components/projects/project-filter'
import { allProjectTech, projects } from '@/lib/data/projects'
import { siteConfig } from '@/lib/site'

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
    <Container as="div" className="py-20 sm:py-28 lg:py-32">
      <SectionHeader
        id="projects"
        eyebrow="Selected work"
        title="Projects"
        description="Mobile apps, backend APIs, and web platforms shipped end to end — filter by technology or search across role, stack and highlights."
        as="h1"
      />

      <ProjectFilter projects={projects} allTech={allProjectTech} />
    </Container>
  )
}
