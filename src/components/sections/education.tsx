import { Award, GraduationCap } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { SpotlightCard } from '@/components/fx/spotlight-card'
import { CircuitToCode } from '@/components/sections/circuit-to-code'
import { certifications, education } from '@/lib/data/education'

// Explicit named-import maps, resolved by the icon-name strings the data
// modules carry ('GraduationCap', 'Award').
const EDUCATION_ICONS = { GraduationCap } as const
const CERT_ICONS = { Award } as const

export function Education() {
  return (
    <section
      id="education"
      data-hud="Origin"
      aria-labelledby="education-heading"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      <Container>
        <SectionHeader
          id="education"
          index="05"
          eyebrow="Foundation"
          title="Where the current started."
          accent={['current']}
          description="Trained as an electrical and electronic engineer, then moved into software — circuits first, code after."
        />

        <div className="mb-16 max-w-3xl">
          <CircuitToCode />
        </div>

        <RevealGroup as="div" className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {education.map((item) => {
            const Icon = EDUCATION_ICONS[item.icon as keyof typeof EDUCATION_ICONS]
            return (
              <RevealItem key={item.institution} as="div">
                <SpotlightCard className="h-full p-6 sm:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-brand">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      {item.period}
                    </span>
                  </div>
                  <h3 className="font-display-wide mt-8 text-2xl leading-tight font-bold sm:text-3xl">
                    {item.degree}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {item.institution} · {item.location}
                  </p>
                  <p className="mt-8 flex items-baseline gap-3">
                    <span className="font-display-wide text-5xl font-bold text-brand">
                      {item.detail.replace(/^CGPA\s*/, '').split(' ')[0]}
                    </span>
                    <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                      {item.detail}
                    </span>
                  </p>
                </SpotlightCard>
              </RevealItem>
            )
          })}

          <RevealItem as="div">
            <SpotlightCard className="h-full p-6 sm:p-10">
              <h3 className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                Certifications
              </h3>
              <ul className="mt-6 space-y-5">
                {certifications.map((cert) => {
                  const Icon = CERT_ICONS[cert.icon as keyof typeof CERT_ICONS]
                  return (
                    <li key={cert.name} className="flex items-start gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-brand">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{cert.name}</p>
                        {cert.issuer ? <p className="mt-0.5 text-sm text-muted-foreground">{cert.issuer}</p> : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </SpotlightCard>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  )
}
