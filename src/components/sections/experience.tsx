import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { ExperienceTimeline } from '@/components/sections/experience-timeline'
import { experience } from '@/lib/data/experience'

export function Experience() {
  return (
    <section
      id="experience"
      data-hud="Career"
      aria-labelledby="experience-heading"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      <Container>
        <SectionHeader
          id="experience"
          index="04"
          eyebrow="Career"
          title="Five years on the wire."
          accent={['wire.']}
          description="Three roles, most recent first."
        />
        <ExperienceTimeline items={experience} />
      </Container>
    </section>
  )
}
