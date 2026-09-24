import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { GitHubIcon } from '@/components/layout/icons'
import { Magnetic } from '@/components/fx/magnetic'
import { RevealWords } from '@/components/fx/reveal-words'
import { CopyEmail, FinaleBackdrop, KineticLines } from '@/components/sections/contact-finale'
import { profile } from '@/lib/data/profile'

/**
 * The finale — a forced-dark island like the hero, so the page ends where it
 * began. By the time a visitor gets here the HUD reads 100%: fully charged.
 */
export function ContactCta() {
  return (
    <section
      id="contact"
      data-hud="Connect"
      aria-labelledby="contact-heading"
      className="dark relative isolate overflow-hidden bg-background py-28 text-foreground sm:py-36"
    >
      <FinaleBackdrop />

      <KineticLines lines={["Let's build", 'something', 'that ships.']} />

      <Container className="relative mt-16 grid items-end gap-12 sm:mt-24 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            <span className="text-brand">06</span>
            <span aria-hidden="true" className="h-px w-10 bg-border" />
            Get in touch
          </p>
          <h2
            id="contact-heading"
            className="font-display-wide mt-5 max-w-[20ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] font-bold"
          >
            <RevealWords text="Start a conversation — fully charged and ready." accent={['conversation']} />
          </h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Questions about a role, a project, or one of the systems above — email or GitHub, both
            direct.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmail email={profile.email} />
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-brand hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </div>
        </div>

        <Magnetic strength={0.4} className="justify-self-start lg:justify-self-end">
          <Link
            href="/contact"
            data-cursor="Say hi"
            className="group relative flex size-44 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-[0_0_80px_-10px_var(--brand)] transition-transform duration-500 hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none sm:size-52"
          >
            <span aria-hidden="true" className="animate-spin-slow absolute inset-2 rounded-full border border-dashed border-brand-foreground/30" />
            <span className="flex flex-col items-center gap-1 text-center">
              <ArrowUpRight aria-hidden="true" className="size-8 transition-transform duration-500 group-hover:rotate-45" />
              <span className="font-display-wide text-lg font-bold">Get in touch</span>
            </span>
          </Link>
        </Magnetic>
      </Container>
    </section>
  )
}
