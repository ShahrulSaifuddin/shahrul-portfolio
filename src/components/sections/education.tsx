import { Award, GraduationCap } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { certifications, education } from '@/lib/data/education'

// Explicit named-import maps, resolved by the icon-name strings the data
// modules carry ('GraduationCap', 'Award').
const EDUCATION_ICONS = { GraduationCap } as const
const CERT_ICONS = { Award } as const

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <SectionHeader
          id="education"
          eyebrow="Foundation"
          title="Education & certifications"
        />

        <RevealGroup as="div" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {education.map((item) => {
            const Icon = EDUCATION_ICONS[item.icon as keyof typeof EDUCATION_ICONS]
            return (
              <RevealItem key={item.institution} as="div">
                <div className="h-full rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                      <Icon aria-hidden="true" className="size-4.5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
                        {item.degree}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.institution} · {item.location}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                        <span>{item.detail}</span>
                        <span>{item.period}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>
            )
          })}

          <RevealItem as="div">
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
                Certifications
              </h3>
              <ul className="mt-4 space-y-4">
                {certifications.map((cert) => {
                  const Icon = CERT_ICONS[cert.icon as keyof typeof CERT_ICONS]
                  return (
                    <li key={cert.name} className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                        <Icon aria-hidden="true" className="size-4.5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cert.name}</p>
                        {cert.issuer ? (
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  )
}
