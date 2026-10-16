import Image from 'next/image'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { ScrubText } from '@/components/fx/scrub-text'
import { Perspective } from '@/components/fx/perspective'
import { TiltCard } from '@/components/fx/tilt-card'
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
        03
      </span>
      <Container className="relative">
        <SectionHeader
          id="about"
          index="03"
          eyebrow="About"
          title="One engineer, the whole circuit."
          accent={['circuit.']}
        />

        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
          <ScrubText
            text={profile.summary}
            highlight={['production', 'hardware', 'payment']}
            className="font-display-wide max-w-[24em] text-[clamp(1.4rem,2.9vw,2.4rem)] leading-[1.2] font-semibold tracking-[-0.02em]"
          />

          <Perspective depth={0.7} className="mx-auto w-full max-w-[19rem] lg:mt-2">
            <TiltCard className="rounded-[28px]" max={12}>
              <figure className="border-border bg-card relative aspect-[4/5] overflow-hidden rounded-[28px] border shadow-[0_30px_80px_-30px_var(--glow)]">
                <Image
                  src="/images/profile.jpg"
                  alt={`Portrait of ${profile.displayName}`}
                  fill
                  sizes="(min-width: 1024px) 304px, 80vw"
                  className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tilt:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(0.145_0.012_255/0.92),transparent_55%)]" />
                <figcaption className="absolute inset-x-5 bottom-5 text-white">
                  <span className="font-display-wide block text-xl font-bold">
                    {profile.displayName}
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-white/75 uppercase">
                    <span className="animate-led size-1.5 rounded-full bg-[#2ff4ac]" />
                    Kuala Lumpur · Remote-friendly
                  </span>
                </figcaption>
              </figure>
            </TiltCard>
          </Perspective>
        </div>

        <div className="mt-24 sm:mt-32">
          <p className="text-muted-foreground mb-10 font-mono text-[11px] tracking-[0.22em] uppercase">
            Owned end to end
          </p>
          <SignalChain items={ownEndToEndItems} />
        </div>
      </Container>
    </section>
  )
}
