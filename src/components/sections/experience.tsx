import { Briefcase } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { experience } from '@/lib/data/experience'

// Explicit named-import map — every `icon` value in the experience data is
// currently 'Briefcase', but resolving through a map keeps this correct if
// that ever changes, without a namespace import.
const ICONS = { Briefcase } as const

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <SectionHeader
          id="experience"
          eyebrow="Career"
          title="Experience"
          description="Three roles, most recent first."
        />

        {/* RevealGroup's `as` union has no 'ol' option, so the group wraps a
            genuine <ol>/<li> list rather than becoming the list itself —
            list semantics stay intact while stagger still orchestrates the
            inner RevealItem for each entry. */}
        <RevealGroup as="div">
          <ol className="relative border-l border-border pl-8 sm:pl-10">
            {experience.map((item) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS]
              return (
                <li key={item.company} className="relative pb-12 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-0.5 -left-[calc(2rem+1px)] flex size-6 items-center justify-center rounded-full bg-brand-muted text-brand ring-4 ring-background sm:-left-[calc(2.5rem+1px)]"
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <RevealItem as="div">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
                        {item.role} · {item.company}
                      </h3>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.location}</p>
                    <ul className="mt-3 max-w-[68ch] space-y-2">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </RevealItem>
                </li>
              )
            })}
          </ol>
        </RevealGroup>
      </Container>
    </section>
  )
}
