import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { GitHubIcon } from '@/components/layout/icons'
import { LocalTime } from '@/components/fx/local-time'
import { siteConfig } from '@/lib/site'
import { profile } from '@/lib/data/profile'
import type { NavItem } from '@/lib/types'

const NAV_LINKS: readonly NavItem[] = [{ label: 'About', href: '/#about' }, ...siteConfig.nav]

/**
 * Server component — the copyright year is computed once, at render time,
 * on the server. The only client leaf is the live Kuala Lumpur clock.
 */
export function Footer(): React.ReactElement {
  const year = new Date().getFullYear()
  const telHref = `tel:${profile.phone.replace(/[^\d+]/g, '')}`

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <Container className="grid gap-12 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-2">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Currently</p>
          <p className="font-display-wide max-w-[24ch] text-2xl leading-tight font-bold">
            {profile.title} in {profile.location.split(',')[0]} —{' '}
            <span className="font-serif font-normal text-brand italic">open to new roles.</span>
          </p>
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="animate-led size-1.5 rounded-full bg-brand" />
            Local time <LocalTime /> MYT
          </p>
        </div>

        <nav aria-label="Footer" className="space-y-3">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Index</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Direct line</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href={`mailto:${profile.email}`} className="break-all transition-colors hover:text-foreground">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={telHref} className="transition-colors hover:text-foreground">
                {profile.phone}
              </a>
            </li>
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div aria-hidden="true" className="relative select-none">
        <p className="font-display-wide text-outline px-4 text-center text-[13.5vw] leading-[0.8] font-black whitespace-nowrap uppercase">
          {profile.displayName.split(' ')[0]}
        </p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Extra bottom room so the fixed HUD and back-to-top button never sit
          on top of this row at the very end of the page. */}
      <Container className="flex flex-col gap-2 border-t border-border pt-6 pb-24 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.displayName}
        </p>
        <p>Next.js · Three.js · Rapier · Framer Motion · React Bits</p>
      </Container>
    </footer>
  )
}
