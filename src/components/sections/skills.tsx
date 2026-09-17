import { Database, Globe, Plug, Smartphone, Wrench } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { skillCategories } from '@/lib/data/skills'

// Explicit named-import map — never a namespace import — so tree-shaking
// still works and the bundle only carries the five icons actually used.
const ICONS = { Smartphone, Globe, Database, Plug, Wrench } as const

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeader
          id="skills"
          eyebrow="Toolset"
          title="Skills"
          description="Grouped the way the resume groups them — no self-graded proficiency bars."
        />

        <RevealGroup as="div" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS]
            return (
              <RevealItem key={category.name} as="div">
                <div className="h-full rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                      <Icon aria-hidden="true" className="size-4.5" />
                    </span>
                    <h3 className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
                      {category.name}
                    </h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <li key={skill}>
                        <span className="inline-flex rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </Container>
    </section>
  )
}
