'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

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
 * Floating glass nav. Tucks away while scrolling down, returns on any scroll
 * up (and whenever focus enters it, so keyboard users never lose it). The
 * desktop row keeps a shared-layout active pill; `<768px` hands off to
 * `MobileNav`.
 */
export function Navigation(): React.ReactElement {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [hoverHref, setHoverHref] = React.useState<string | null>(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 8)
    setHidden(y > 320 && y > prev + 2)
  })

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
      animate={{ y: hidden && !reduceMotion ? '-120%' : '0%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      onFocusCapture={() => setHidden(false)}
    >
      <Container>
        <div
          className={cn(
            'flex h-14 items-center justify-between rounded-full border pr-1.5 pl-2 transition-[background-color,border-color,box-shadow] duration-500',
            scrolled
              ? 'border-border bg-background/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          )}
        >
          <Link
            href="/"
            aria-label={`${profile.displayName} — home`}
            className="group flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-foreground font-mono text-xs font-bold text-background">
              <span className="transition-transform duration-500 group-hover:-translate-y-8">SS</span>
              <span className="absolute translate-y-8 text-brand transition-transform duration-500 group-hover:translate-y-0">
                ⚡
              </span>
            </span>
            <span className="hidden text-sm font-semibold tracking-[-0.01em] sm:inline">
              {profile.displayName}
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center rounded-full border border-border/70 bg-background/40 p-1 backdrop-blur md:flex"
            onPointerLeave={() => setHoverHref(null)}
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href)
              const highlighted = hoverHref ? hoverHref === link.href : active
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onPointerEnter={() => setHoverHref(link.href)}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    highlighted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {highlighted && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-muted"
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-1.5 size-1 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_6px_var(--brand)]"
                    />
                  ) : null}
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="hidden size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:inline-flex"
            >
              <GitHubIcon className="size-4" />
            </a>
            <div className="hidden md:inline-flex">
              <ThemeToggle className="size-11 rounded-full" />
            </div>
            <Link
              href="/contact"
              className="ml-1 hidden h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
            <MobileNav links={NAV_LINKS} githubHref={profile.github} />
          </div>
        </div>
      </Container>
    </motion.header>
  )
}
