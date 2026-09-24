import { Database, Globe, Plug, Smartphone, Wrench } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { SpotlightCard } from '@/components/fx/spotlight-card'
import { skillCategories } from '@/lib/data/skills'
import { cn } from '@/lib/utils'

// Explicit named-import map — never a namespace import — so tree-shaking
// still works and the bundle only carries the five icons actually used.
const ICONS = { Smartphone, Globe, Database, Plug, Wrench } as const

// Bento spans for the five categories, in data order.
const SPANS = [
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
] as const

/** A tiny looping waveform — each card's "signal". Phase-shifted per card. */
function Waveform({ phase }: { phase: number }) {
  const d = Array.from({ length: 41 }, (_, i) => {
    const x = i * 3
    const y = 12 + Math.sin(i * 0.55 + phase) * 7 * Math.sin((i / 40) * Math.PI)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg aria-hidden="true" viewBox="0 0 120 24" className="h-6 w-28 overflow-visible">
      <path
        d={d}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="animate-current opacity-50 transition-opacity duration-500 group-hover/spot:opacity-100"
      />
    </svg>
  )
}

export function Skills() {
  return (
    <section
      id="skills"
      data-hud="Stack"
      aria-labelledby="skills-heading"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      <Container>
        <SectionHeader
          id="skills"
          index="03"
          eyebrow="Toolset"
          title="The stack, wired together."
          accent={['wired']}
          description="Grouped the way the résumé groups them — no self-graded proficiency bars."
        />

        <RevealGroup as="div" stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {skillCategories.map((category, i) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS]
            return (
              <RevealItem key={category.name} as="div" className={cn(SPANS[i], i === 0 && 'sm:col-span-2 lg:col-span-3')}>
                <SpotlightCard className="h-full p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-brand transition-all duration-500 group-hover/spot:border-brand group-hover/spot:shadow-[0_0_24px_-6px_var(--brand)]">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <Waveform phase={i * 1.3} />
                  </div>
                  <h3 className="font-display-wide mt-6 text-2xl font-bold">{category.name}</h3>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                    {category.skills.length} tools
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {category.skills.map((skill, si) => (
                      <li key={skill}>
                        <span
                          className="inline-flex rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover/spot:border-brand/40 group-hover/spot:text-foreground"
                          style={{ transitionDelay: `${si * 25}ms` }}
                        >
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </Container>
    </section>
  )
}
