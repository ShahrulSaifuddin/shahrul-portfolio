import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { Magnetic } from '@/components/fx/magnetic'
import { NeonText } from '@/components/fx/neon-text'
import { Reveal } from '@/components/motion/reveal'
import { RotatingWord } from '@/components/fx/rotating-word'
import { HeroBadgeCanvas, HeroBadgeProvider, HeroPortrait } from '@/components/fx/lanyard/hero-badge'
import { HeroBackdrop } from '@/components/sections/hero-backdrop'
import { LocalTime } from '@/components/fx/local-time'
import { heroMetrics, profile } from '@/lib/data/profile'

// Derived, not invented: the first sentence of the verbatim profile summary.
const [heroPositioningLine] = profile.summary.split(/(?<=\.)\s+/)
const [firstName, lastName] = profile.displayName.split(' ')

const ROTATING = ['React Native', 'Laravel', 'Node.js', 'OCPP 1.6 / 2.0', 'payment rails'] as const

const BADGE = {
  firstName,
  lastName,
  title: profile.title,
  location: profile.location,
  email: profile.email,
  github: profile.github,
  photoSrc: '/images/profile.jpg',
}

/**
 * A forced-dark "island" in both themes (`class="dark"`): the lab is always
 * dark. Layers, back to front: lightning backdrop → giant neon name → the
 * physics badge (desktop) → copy, CTAs and the instrument-panel metrics.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-hud="Power on"
      aria-label="Introduction"
      className="dark relative isolate overflow-hidden bg-background text-foreground"
    >
      <HeroBackdrop />

      <HeroBadgeProvider data={BADGE}>
        {/* 3D badge layer: right half, full hero height so the strap hangs
            from the top edge. Above the name, below the copy. */}
        <HeroBadgeCanvas className="absolute inset-y-0 right-0 z-10 hidden w-[46%] lg:block" />

        <Container className="pointer-events-none relative z-20 flex min-h-[100svh] flex-col pt-28 pb-12 sm:pt-32">
          <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            <span className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 backdrop-blur">
              <span className="animate-led size-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
              Open to full-stack, mobile &amp; backend roles
            </span>
            <span className="hidden sm:inline">
              {profile.location} · <LocalTime /> MYT
            </span>
          </div>

          <h1 className="mt-10 sm:mt-14">
            <span className="sr-only">{profile.displayName}</span>
            <NeonText
              className="font-display-wide block text-[clamp(2.1rem,10vw,7.5rem)] leading-[0.88] font-extrabold whitespace-nowrap uppercase sm:text-[clamp(2.1rem,8.6vw,7.5rem)]"
              lines={[
                { text: firstName },
                {
                  text: lastName,
                  className: 'sm:pl-[0.9em]',
                  style: { '--neon-color': 'var(--brand)' } as React.CSSProperties,
                },
              ]}
            />
          </h1>

          <div className="mt-10 grid flex-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <Reveal delay={0.2} className="pointer-events-auto order-2 lg:order-1">
              <p className="font-display-wide text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                {profile.title}
                <span className="text-muted-foreground"> / </span>
                <RotatingWord words={ROTATING} className="text-brand" />
              </p>
              <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
                {heroPositioningLine}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link
                    href="/projects"
                    data-cursor="Open"
                    className="group inline-flex h-13 items-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground shadow-[0_0_0_1px_var(--brand),0_10px_40px_-10px_var(--brand)] transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  >
                    View projects
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.resumeUrl}
                    download
                    aria-label="Download resume (PDF)"
                    className="inline-flex h-13 items-center gap-2 rounded-full border border-border bg-background/50 px-6 text-sm font-medium backdrop-blur transition-colors hover:border-brand/60 hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  >
                    <Download aria-hidden="true" className="size-4" />
                    Résumé
                  </a>
                </Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex h-13 items-center px-3 text-sm font-medium text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Get in touch
                </Link>
              </div>
            </Reveal>

            <div className="pointer-events-auto order-1 flex justify-center lg:order-2 lg:justify-end lg:pr-10">
              <HeroPortrait name={profile.displayName} initials={profile.avatarInitials} />
            </div>
          </div>

          <Reveal delay={0.35} className="pointer-events-auto mt-12">
            {/*
              Deliberately NOT `countUp`: these are factual claims about a
              person's career, and counting from 0 means the hero briefly reads
              "0 Products live on App Store & Google Play". The numbers light
              up with the section instead. See e2e/hero-metrics.spec.ts.
            */}
            <MetricRail metrics={heroMetrics} />
          </Reveal>

          <a
            href="#about"
            className="pointer-events-auto mt-10 inline-flex items-center gap-3 self-start font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-brand"
          >
            <span className="relative flex h-9 w-5 justify-center rounded-full border border-border">
              <span className="mt-1.5 h-2 w-0.5 rounded-full bg-brand motion-safe:animate-bounce" />
            </span>
            Scroll to charge
            <ArrowDownRight aria-hidden="true" className="size-3.5" />
          </a>
        </Container>
      </HeroBadgeProvider>
    </section>
  )
}
