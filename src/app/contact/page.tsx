import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { GitHubIcon } from '@/components/layout/icons'
import { ContactForm } from '@/components/contact/contact-form'
import { profile } from '@/lib/data/profile'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with ${profile.displayName}, a ${profile.title.toLowerCase()} based in ${profile.location}.`,
}

export default function ContactPage() {
  const telHref = `tel:${profile.phone.replace(/[^+\d]/g, '')}`

  return (
    <Container as="div" className="py-20 sm:py-28 lg:py-32">
      <SectionHeader
        as="h1"
        id="contact"
        eyebrow="Get in touch"
        title="Contact"
        description="Open to full-stack, mobile and backend roles. The form below goes straight to my inbox, or reach out directly using the details on the right."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="max-w-3xl">
          <ContactForm />
        </div>

        <aside aria-labelledby="direct-contact-heading" className="space-y-4">
          <h3
            id="direct-contact-heading"
            className="text-base font-semibold tracking-[-0.01em] sm:text-lg"
          >
            Direct contact
          </h3>

          <ul className="space-y-3">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </span>
                  <span className="block text-foreground">{profile.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={telHref}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Phone
                  </span>
                  <span className="block text-foreground">{profile.phone}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <GitHubIcon className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    GitHub
                  </span>
                  <span className="block text-foreground">github.com/ShahrulSaifuddin</span>
                </span>
              </a>
            </li>
          </ul>

          <p className="max-w-[36ch] text-xs text-muted-foreground">
            Based in {profile.location}.
          </p>
        </aside>
      </div>
    </Container>
  )
}
