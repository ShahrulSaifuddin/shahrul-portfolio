import { SectionHeader } from '@/components/layout/section-header'
import { ProjectGallery } from '@/components/sections/project-gallery'
import { featuredProjects } from '@/lib/data/projects'

export function FeaturedProjects() {
  return (
    <section
      id="projects"
      data-hud="Work"
      aria-labelledby="projects-heading"
      className="relative py-16 lg:py-0"
    >
      <ProjectGallery
        projects={featuredProjects}
        header={
          <SectionHeader
            id="projects"
            index="02"
            eyebrow="Selected work"
            title="Systems running in production."
            accent={['production.']}
            description="Shipped end to end, from hardware protocol to payment rail."
            className="mb-0 sm:mb-0"
          />
        }
      />
    </section>
  )
}
