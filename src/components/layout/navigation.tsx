'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/container'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { GitHubIcon } from '@/components/layout/icons'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'
import { profile } from '@/lib/data/profile'
import type { NavItem } from '@/lib/types'

const NAV_LINKS: readonly NavItem[] = [{ label: 'About', href: '/#about' }, ...siteConfig.nav]

function isLinkActive(pathname: string, href: string): boolean {
  if (href.startsWith('/#')) return pathname === '/'
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Sticky top nav. Owns the desktop link row with a shared `layoutId` active
 * pill, and hands the `<768px` link list off to `MobileNav`.
 */
export function Navigation(): React.ReactElement {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur transition-colors supports-backdrop-filter:bg-background/70',
        scrolled ? 'border-border' : 'border-transparent'
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="rounded-lg text-base font-semibold tracking-[-0.01em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {profile.displayName}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-muted"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 400, damping: 30 }
                    }
                  />
                )}
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub profile"
            className="hidden size-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
          >
            <GitHubIcon className="size-4" />
          </a>
          <div className="hidden md:inline-flex">
            <ThemeToggle />
          </div>
          <MobileNav links={NAV_LINKS} githubHref={profile.github} />
        </div>
      </Container>
    </header>
  )
}
