import Link from 'next/link'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Magnetic } from '@/components/fx/magnetic'
import { PressureText } from '@/components/fx/pressure-text'
import { RevealWords } from '@/components/fx/reveal-words'
import { RollLabel } from '@/components/fx/roll-label'
import { CopyEmail } from '@/components/fx/copy-email'
import { freelance, profile } from '@/lib/data/profile'

const RING = 'START A PROJECT · START A PROJECT · '

/**
 * The finale, framed by the swarm's portal. The giant "LET'S TALK" swells
 * toward the cursor; below it, every way to start a conversation — the form,
 * WhatsApp, email — so no visitor leaves without a next step.
 */
export function ContactCta() {
  return (
    <section
      id="contact"
      data-hud="Let's talk"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      <Container>
        <p className="text-muted-foreground flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase">
          <span className="text-brand">08</span>
          <span aria-hidden="true" className="bg-border h-px w-10" />
          Start a project
        </p>

        <PressureText
          text="LET'S TALK"
          className="text-foreground mt-8 text-[12.8vw] leading-[0.9] uppercase [text-shadow:0_0_80px_var(--glow)] lg:text-[min(12.6vw,10rem)]"
        />

        <div className="mt-14 grid items-end gap-12 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2
              id="contact-heading"
              className="font-display-wide max-w-[20ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] font-bold"
            >
              <RevealWords text="Have a project in mind? Let's ship it." accent={['ship']} />
            </h2>
            <p className="text-muted-foreground mt-5 max-w-[54ch] text-base leading-relaxed sm:text-lg">
              Send a few lines about what you&apos;re building — a new app, a website, an API, or a
              payment flow that has to just work. I&apos;ll come back with questions, a plan and a
              quote.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group bg-brand text-brand-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-13 items-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_40px_-12px_var(--brand)] transition-shadow hover:shadow-[0_16px_56px_-10px_var(--brand)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
              >
                <RollLabel>Start a project</RollLabel>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 group-hover:rotate-45"
                />
              </Link>
              <a
                href={freelance.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="group border-border bg-background/60 hover:border-brand hover:text-brand focus-visible:ring-ring inline-flex h-13 items-center gap-2 rounded-full border px-5 text-sm font-medium backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
              >
                <MessageCircle
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 group-hover:-rotate-12"
                />
                <RollLabel>WhatsApp</RollLabel>
              </a>
              <CopyEmail email={profile.email} />
            </div>
          </div>

          <Magnetic strength={0.4} className="justify-self-start lg:justify-self-end">
            <Link
              href="/contact"
              data-cursor="Say hi"
              aria-label="Start a project"
              className="group bg-brand text-brand-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative flex size-44 items-center justify-center rounded-full shadow-[0_0_90px_-12px_var(--brand)] transition-transform duration-500 hover:scale-105 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:outline-none sm:size-52"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="animate-spin-slow absolute inset-0 size-full p-2"
              >
                <defs>
                  <path id="cta-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                </defs>
                <text className="fill-current font-mono text-[11.5px] tracking-[0.32em] opacity-70">
                  <textPath href="#cta-ring">{RING}</textPath>
                </text>
              </svg>
              <ArrowUpRight
                aria-hidden="true"
                className="size-12 transition-transform duration-500 group-hover:rotate-45"
              />
            </Link>
          </Magnetic>
        </div>
      </Container>
    </section>
  )
}
