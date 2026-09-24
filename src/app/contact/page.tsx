import type { Metadata } from 'next'
import { ArrowUpRight, Mail, Phone } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { PageBackdrop } from '@/components/layout/page-backdrop'
import { SectionHeader } from '@/components/layout/section-header'
import { GitHubIcon } from '@/components/layout/icons'
import { ContactForm } from '@/components/contact/contact-form'
import { LocalTime } from '@/components/fx/local-time'
import { CopyEmail } from '@/components/fx/copy-email'
import { profile } from '@/lib/data/profile'
import { siteConfig } from '@/lib/site'

const description = `Get in touch with ${profile.displayName}, a ${profile.title.toLowerCase()} based in ${profile.location}.`

export const metadata: Metadata = {
  // Bare title: the root layout's `title.template` appends the site name.
  // Repeating it here produced "Contact — Shahrul Saifuddin — Shahrul Saifuddin".
  // The Open Graph title stays fully qualified — no template applies to it.
  title: 'Contact',
  description,
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/contact`,
    type: 'website',
  },
}

const INCLUDE = [
  'The role or project, and the team behind it',
  'Where it stands today — idea, build, or in production',
  'The stack, if it is already chosen',
] as const

export default function ContactPage() {
  const telHref = `tel:${profile.phone.replace(/[^+\d]/g, '')}`

  const lines = [
    { href: `mailto:${profile.email}`, label: 'Email', value: profile.email, Icon: Mail, external: false },
    { href: telHref, label: 'Phone', value: profile.phone, Icon: Phone, external: false },
    {
      href: profile.github,
      label: 'GitHub',
      value: 'github.com/ShahrulSaifuddin',
      Icon: GitHubIcon,
      external: true,
    },
  ] as const

  return (
    <div className="relative isolate">
      <PageBackdrop />
      <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32">
        <SectionHeader
          as="h1"
          id="contact"
          index="/contact"
          eyebrow="Get in touch"
          title="Contact — open a channel."
          accent={['channel.']}
          description="Open to full-stack, mobile and backend roles. The form below goes straight to my inbox, or reach out directly using the details alongside it."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <div>
            <ContactForm />
          </div>

          <aside aria-labelledby="direct-contact-heading" className="space-y-5">
            {/* Availability */}
            <div className="rounded-2xl border border-brand/30 bg-brand-muted/40 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-brand uppercase">
                <span aria-hidden="true" className="animate-led size-2 rounded-full bg-brand shadow-[0_0_10px_var(--brand)]" />
                Available
              </p>
              <p className="font-display-wide mt-4 text-xl leading-snug font-bold">
                Full-stack, mobile &amp; backend roles.
              </p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {profile.location} · <LocalTime /> MYT
              </p>
            </div>

            {/* Direct lines */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
              <h2
                id="direct-contact-heading"
                className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
              >
                Direct contact
              </h2>
              <ul className="mt-4 divide-y divide-border">
                {lines.map(({ href, label, value, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                      className="group flex items-center gap-4 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all group-hover:border-brand group-hover:text-brand">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                          {label}
                        </span>
                        <span className="block truncate text-sm text-foreground">{value}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                      />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <CopyEmail email={profile.email} />
              </div>
            </div>

            {/* Helpful context */}
            <div className="rounded-2xl border border-dashed border-border p-6">
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                Useful to include
              </p>
              <ul className="mt-4 space-y-3">
                {INCLUDE.map((line, i) => (
                  <li key={line} className="flex gap-3 text-sm text-muted-foreground">
                    <span aria-hidden="true" className="font-mono text-xs text-brand">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}
