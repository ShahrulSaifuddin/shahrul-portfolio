import Link from 'next/link'
import { ArrowUpRight, Check, CreditCard, Globe, Server, Smartphone } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { Perspective } from '@/components/fx/perspective'
import { TiltCard } from '@/components/fx/tilt-card'
import { RollLabel } from '@/components/fx/roll-label'
import { services } from '@/lib/data/services'

const ICONS = { Smartphone, Globe, Server, CreditCard } as const

/**
 * What a client can hire for. Desktop: the pitch stays pinned on the left
 * (over the swarm's lattice) while the four offers tip up out of the page on
 * the right. Every proof line points at shipped work.
 */
export function Services() {
  return (
    <section
      id="services"
      data-hud="Services"
      aria-labelledby="services-heading"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            id="services"
            index="01"
            eyebrow="Services"
            title="What I can build for you."
            accent={['you.']}
            description="One engineer across the whole product — so the app, the API and the payment flow are designed together, not stitched together."
            className="mb-10 sm:mb-10"
          />
          <Link
            href="/contact"
            className="group border-border bg-background/50 hover:border-brand hover:text-brand focus-visible:ring-ring inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <RollLabel>Tell me about your project</RollLabel>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 group-hover:rotate-45"
            />
          </Link>
        </div>

        <ul className="grid gap-5">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS]
            return (
              <li key={service.id}>
                <Perspective depth={0.8}>
                  <TiltCard className="rounded-3xl">
                    <article className="group/svc border-border bg-card/75 hover:border-brand/50 relative overflow-hidden rounded-3xl border p-6 backdrop-blur-md transition-colors duration-500 sm:p-8">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-0 transition-opacity duration-700 group-hover/svc:opacity-100"
                      />
                      <div className="flex [transform:translateZ(30px)] items-start justify-between gap-6">
                        <span className="border-border bg-background text-brand group-hover/svc:border-brand flex size-14 items-center justify-center rounded-2xl border transition-all duration-500 group-hover/svc:shadow-[0_0_30px_-6px_var(--brand)]">
                          <Icon
                            aria-hidden="true"
                            className="size-6 transition-transform duration-500 group-hover/svc:scale-110"
                          />
                        </span>
                        <span
                          aria-hidden="true"
                          className="font-display-wide text-outline text-6xl leading-none font-black sm:text-7xl"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-display-wide mt-6 [transform:translateZ(40px)] text-2xl leading-tight font-bold sm:text-3xl">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mt-3 max-w-[52ch] leading-relaxed">
                        {service.summary}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {service.deliverables.map((d) => (
                          <li
                            key={d}
                            className="border-border bg-background/60 text-muted-foreground group-hover/svc:border-brand/30 group-hover/svc:text-foreground rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-300"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                      <p className="border-border text-foreground mt-6 flex items-center gap-2 border-t pt-5 text-sm">
                        <span className="bg-brand text-brand-foreground flex size-5 shrink-0 items-center justify-center rounded-full">
                          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                        </span>
                        {service.proof}
                      </p>
                    </article>
                  </TiltCard>
                </Perspective>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
