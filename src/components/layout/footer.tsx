import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { GitHubIcon } from '@/components/layout/icons'
import { siteConfig } from '@/lib/site'
import { profile } from '@/lib/data/profile'
import type { NavItem } from '@/lib/types'

const NAV_LINKS: readonly NavItem[] = [{ label: 'About', href: '/#about' }, ...siteConfig.nav]

/**
 * Server component — the copyright year is computed once, at render time,
 * on the server. It never re-renders on the client, so there is no
 * server/client mismatch to guard against.
 */
export function Footer(): React.ReactElement {
  const year = new Date().getFullYear()
  const telHref = `tel:${profile.phone.replace(/[^\d+]/g, '')}`

  return (
    <footer className="border-t border-border">
      <Container as="footer" className="flex flex-col gap-10 py-12 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm space-y-3">
            <p className="text-base font-semibold tracking-[-0.01em] text-foreground">
              {profile.displayName}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{profile.tagline}</p>
            <p className="text-sm text-muted-foreground">{profile.location}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm sm:items-end">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={`mailto:${profile.email}`} className="transition-colors hover:text-foreground">
              {profile.email}
            </a>
            <a href={telHref} className="transition-colors hover:text-foreground">
              {profile.phone}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </div>
          <p>
            © {year} {profile.displayName}
          </p>
        </div>
      </Container>
    </footer>
  )
}
