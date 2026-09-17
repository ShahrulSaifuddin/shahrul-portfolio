import { Check } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { Reveal } from '@/components/motion/reveal'
import { profile } from '@/lib/data/profile'

// Derived from the verbatim summary's "owns end to end —" clause, not
// re-authored, so the list stays a strict restatement of the same facts.
const ownEndToEndItems = profile.summary
  .replace(/^.*end to end\s*—\s*/, '')
  .replace(/\.$/, '')
  .split(/,\s*(?:and\s+)?/)
  .map((item) => item.trim())
  .filter(Boolean)
  .map((item) => item.charAt(0).toUpperCase() + item.slice(1))

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeader
          id="about"
          eyebrow="About"
          title="Engineering restraint, shipped."
          description="Who's building this, and what they own end to end."
        />
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
              {profile.summary}
            </p>

            <ul className="grid gap-3 sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
              {ownEndToEndItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-sm text-foreground"
                >
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
