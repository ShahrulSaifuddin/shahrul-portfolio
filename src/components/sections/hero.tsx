import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { Magnetic } from '@/components/fx/magnetic'
import { HeroName } from '@/components/fx/hero-name'
import { Reveal } from '@/components/motion/reveal'
import { RollLabel } from '@/components/fx/roll-label'
import { RotatingWord } from '@/components/fx/rotating-word'
import { LocalTime } from '@/components/fx/local-time'
import { ShapeSwitcher } from '@/components/scene/shape-switcher'
import { freelance, heroMetrics, profile } from '@/lib/data/profile'

const [firstName, lastName] = profile.displayName.split(' ')

/**
 * Transparent on purpose: the particle swarm (SceneBackdrop, fixed behind
 * the page) is the hero's visual. Layers: giant 3D-flipping name → pitch and
 * CTAs → shape switcher → instrument-panel metrics.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-hud="Hello"
      aria-label="Introduction"
      className="relative isolate overflow-hidden"
    >
      <Container className="relative flex min-h-[100svh] flex-col pt-24 pb-10 sm:pt-28">
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em] uppercase">
          <span className="border-border bg-background/60 flex items-center gap-2.5 rounded-full border py-1 pr-4 pl-1 backdrop-blur-md">
            <span className="ring-border relative size-8 overflow-hidden rounded-full ring-1">
              <Image
                src="/images/profile.jpg"
                alt=""
                fill
                sizes="32px"
                priority
                className="object-cover object-top"
              />
            </span>
            <span aria-hidden="true" className="relative flex size-2">
              <span className="bg-brand absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
              <span className="bg-brand relative inline-flex size-2 rounded-full" />
            </span>
            <span className="text-foreground">
              {freelance.status.replace(/ projects$/, '')}
              <span className="max-sm:hidden"> projects</span>
            </span>
          </span>
          <span className="hidden sm:inline">
            {profile.location} · <LocalTime /> MYT
          </span>
        </div>

        <h1 className="mt-12 sm:mt-10">
          <span className="sr-only">{profile.displayName}</span>
          <HeroName
            className="font-display-wide text-[12.2vw] leading-[0.86] font-extrabold uppercase sm:text-[10.6vw] lg:text-[clamp(4rem,10vw,8.75rem)]"
            lines={[
              { text: firstName },
              {
                text: lastName,
                className: 'text-brand [text-shadow:0_0_60px_var(--glow)] sm:pl-[0.7em]',
              },
            ]}
          />
        </h1>

        <div className="mt-10 grid flex-1 items-end gap-8 sm:mt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal delay={0.25}>
            <p className="font-display-wide text-xl leading-tight font-semibold tracking-[-0.02em] sm:text-2xl">
              {freelance.role}.
              <br />
              <span className="text-muted-foreground">I build </span>
              <RotatingWord
                words={freelance.builds}
                className="text-brand font-serif font-normal tracking-normal italic"
              />
            </p>
            <p className="text-muted-foreground mt-5 max-w-[54ch] text-[0.98rem] leading-relaxed sm:text-lg">
              {freelance.pitch}
            </p>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Magnetic className="block sm:inline-block">
                <Link
                  href="/contact"
                  data-cursor="Let's go"
                  className="group bg-brand text-brand-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative flex h-14 items-center justify-between gap-3 overflow-hidden rounded-full pr-2 pl-7 text-sm font-semibold shadow-[0_0_0_1px_var(--brand),0_14px_44px_-12px_var(--brand)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_var(--brand),0_18px_60px_-10px_var(--brand)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] sm:inline-flex sm:justify-start"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,oklch(1_0_0/0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <RollLabel>Start a project</RollLabel>
                  <span className="bg-brand-foreground text-brand flex size-10 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </span>
                </Link>
              </Magnetic>
              <Magnetic className="block sm:inline-block">
                <a
                  href="#projects"
                  className="group border-border bg-background/50 hover:border-foreground/40 focus-visible:ring-ring focus-visible:ring-offset-background flex h-14 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium backdrop-blur-md transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] sm:inline-flex"
                >
                  <RollLabel>See my work</RollLabel>
                  <ArrowDown
                    aria-hidden="true"
                    className="size-4 transition-transform duration-500 group-hover:translate-y-0.5"
                  />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <ShapeSwitcher className="lg:justify-self-end" />
        </div>

        <Reveal delay={0.4} className="mt-10 sm:mt-12">
          {/*
            Deliberately NOT `countUp`: these are factual claims about a
            person's career, and counting from 0 means the hero briefly reads
            "0 Products live on App Store & Google Play". See
            e2e/hero-metrics.spec.ts.
          */}
          <MetricRail metrics={heroMetrics} />
        </Reveal>
      </Container>
    </section>
  )
}
