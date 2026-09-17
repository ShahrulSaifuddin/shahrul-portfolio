import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { ProjectCard } from '@/components/projects/project-card'
import { featuredProjects } from '@/lib/data/projects'

export function FeaturedProjects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <SectionHeader
          id="projects"
          eyebrow="Selected work"
          title="Featured projects"
          description="Production systems shipped end to end, from hardware protocol to payment rail."
        />

        <RevealGroup as="div" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <RevealItem key={project.slug} as="div">
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View all projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
