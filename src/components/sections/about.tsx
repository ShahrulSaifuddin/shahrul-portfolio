import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { ScrubText } from '@/components/fx/scrub-text'
import { SignalChain } from '@/components/sections/signal-chain'
import { profile } from '@/lib/data/profile'

// Derived from the verbatim summary's "owns end to end —" clause, not
// re-authored, so the chain stays a strict restatement of the same facts.
const ownEndToEndItems = profile.summary
  .replace(/^.*end to end\s*—\s*/, '')
  .replace(/\.$/, '')
  .split(/,\s*(?:and\s+)?/)
  .map((item) => item.trim())
  .filter(Boolean)
  .map((item) => item.charAt(0).toUpperCase() + item.slice(1))

export function About() {
  return (
    <section
      id="about"
      data-hud="About"
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-28 sm:py-36 lg:py-44"
    >
      <span
        aria-hidden="true"
        className="font-display-wide text-outline pointer-events-none absolute -top-6 -right-10 text-[26vw] leading-none font-black select-none"
      >
        01
      </span>
      <Container className="relative">
        <SectionHeader
          id="about"
          index="01"
          eyebrow="About"
          title="One engineer, the whole circuit."
          accent={['circuit.']}
        />

        <ScrubText
          text={profile.summary}
          highlight={['production', 'hardware', 'payment']}
          className="font-display-wide max-w-[24em] text-[clamp(1.4rem,2.9vw,2.4rem)] leading-[1.2] font-semibold tracking-[-0.02em]"
        />

        <div className="mt-24 sm:mt-32">
          <p className="mb-10 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            Owned end to end
          </p>
          <SignalChain items={ownEndToEndItems} />
        </div>
      </Container>
    </section>
  )
}
