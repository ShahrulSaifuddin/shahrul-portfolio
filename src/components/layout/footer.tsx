import Link from 'next/link'
import { FadeIn } from '@/components/home/fade-in'
import { ContactButton, OutlineButton } from '@/components/home/buttons'
import { GitHubIcon } from '@/components/layout/icons'
import { HideOnHome } from '@/components/layout/hide-on-home'
import { profile } from '@/lib/data/profile'

const FOOTER_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Performance', href: '/performance' },
  { label: 'Contact', href: '/contact' },
] as const

/**
 * Server component — the copyright year is computed once, at render time,
 * on the server. It never re-renders on the client, so there is no
 * server/client mismatch to guard against.
 */
export function Footer(): React.ReactElement {
  const year = new Date().getFullYear()
  const telHref = `tel:${profile.phone.replace(/[^\d+]/g, '')}`

  return (
    <footer className="relative z-10 -mt-10 rounded-t-[40px] border-t-2 border-[#D7E2EA]/20 bg-[#0C0C0C] px-5 pt-10 pb-10 text-[#D7E2EA] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10">
      {/* The contact page is itself the call to action — skip repeating it there. */}
      <HideOnHome paths={['/contact']}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 pt-10 pb-20 text-center sm:gap-12 sm:pb-24 md:pt-18">
          <FadeIn
            as="p"
            y={40}
            className="hero-heading leading-none font-black tracking-tight uppercase"
            style={{ fontSize: 'clamp(2.75rem, 10vw, 140px)' }}
          >
            Let&apos;s talk
          </FadeIn>
          <p className="max-w-md leading-relaxed font-light text-[#D7E2EA]/70">
            Open to full-stack, mobile and backend roles. Based in {profile.location}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ContactButton />
            <OutlineButton href={profile.resumeUrl}>Resume</OutlineButton>
          </div>
        </div>
      </HideOnHome>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 pt-8 text-sm md:flex-row md:items-center md:justify-between">
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 tracking-wider uppercase"
        >
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-opacity hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-light text-[#D7E2EA]/70">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-[#D7E2EA]">
            {profile.email}
          </a>
          <a href={telHref} className="transition-colors hover:text-[#D7E2EA]">
            {profile.phone}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[#D7E2EA]"
          >
            <GitHubIcon className="size-4" />
            GitHub
          </a>
          <p>
            © {year} {profile.displayName}
          </p>
        </div>
      </div>
    </footer>
  )
}
