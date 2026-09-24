import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'

import { LightPanel, PageHero } from '@/components/layout/page-hero'
import { ContactForm } from '@/components/contact/contact-form'
import { FadeIn } from '@/components/home/fade-in'
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

const HEADING = 'leading-none font-black tracking-tight uppercase'

export default function ContactPage() {
  const telHref = `tel:${profile.phone.replace(/[^+\d]/g, '')}`

  const channels = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, external: false },
    { label: 'Phone', value: profile.phone, href: telHref, external: false },
    {
      label: 'GitHub',
      value: 'github.com/ShahrulSaifuddin',
      href: profile.github,
      external: true,
    },
    { label: 'Resume', value: 'Download PDF', href: profile.resumeUrl, external: true },
  ]

  return (
    <>
      <PageHero
        id="contact"
        title="Contact"
        intro="Open to full-stack, mobile and backend roles"
        aside={
          <p className="text-xs font-light tracking-[0.3em] text-[#D7E2EA]/70 uppercase sm:text-right sm:text-sm">
            Based in
            <span className="mt-1 block text-base font-medium tracking-wider text-[#D7E2EA] sm:text-xl">
              {profile.location}
            </span>
          </p>
        }
      />

      <LightPanel>
        <div className="mx-auto grid max-w-6xl gap-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn
              as="h2"
              y={40}
              className={`mb-10 ${HEADING}`}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 88px)' }}
            >
              Reach me
            </FadeIn>
            <ul>
              {channels.map((channel, i) => (
                <FadeIn
                  as="li"
                  key={channel.label}
                  delay={i * 0.1}
                  className="border-b first:border-t"
                  style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
                >
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                    className="group flex items-center gap-6 py-6 focus-visible:ring-2 focus-visible:ring-[#0C0C0C] focus-visible:outline-none sm:gap-8 sm:py-8"
                  >
                    <span
                      className="leading-none font-black transition-colors group-hover:text-[#7621B0]"
                      style={{ fontSize: 'clamp(2.5rem, 6vw, 80px)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-xs font-light tracking-[0.3em] text-[#0C0C0C]/70 uppercase">
                        {channel.label}
                      </span>
                      <span
                        className="truncate font-medium"
                        style={{ fontSize: 'clamp(1rem, 1.8vw, 1.5rem)' }}
                      >
                        {channel.value}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>
                </FadeIn>
              ))}
            </ul>
          </div>

          <div>
            <FadeIn
              as="h2"
              y={40}
              className={`mb-10 ${HEADING}`}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 88px)' }}
            >
              Write me
            </FadeIn>
            <p className="mb-10 max-w-md leading-relaxed font-light text-[#0C0C0C]/70">
              The form goes straight to my inbox — I reply personally by email.
            </p>
            <ContactForm />
          </div>
        </div>
      </LightPanel>
    </>
  )
}
