'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { GitHubIcon } from '@/components/layout/icons'
import { cn } from '@/lib/utils'
import { profile } from '@/lib/data/profile'
import type { NavItem } from '@/lib/types'

function isLinkActive(pathname: string, href: string): boolean {
  if (href.startsWith('/#')) return pathname === '/'
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * The `<768px` nav: a full-height panel with oversized, numbered links.
 * Built on shadcn's `Sheet` (Radix Dialog) for focus trapping, `Esc` to
 * close, focus return and scroll locking.
 */
export function MobileNav({
  links,
  githubHref,
}: {
  links: readonly NavItem[]
  githubHref: string
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="inline-flex size-11 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-l-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="px-6 pt-6 pb-2 text-left">
          <SheetTitle className="font-mono text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Menu
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="bg-grid flex flex-1 flex-col justify-center gap-1 px-6">
          {links.map((link, i) => {
            const active = isLinkActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-baseline gap-4 rounded-lg py-2 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  active ? 'text-brand' : 'text-foreground hover:text-brand'
                )}
              >
                <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="font-display-wide text-4xl font-bold uppercase">{link.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="space-y-4 border-t border-border px-6 py-5">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
          >
            {profile.email}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <div className="flex items-center justify-between">
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="inline-flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="GitHub profile"
            >
              <GitHubIcon className="size-5" />
            </a>
            <ThemeToggle className="rounded-full border border-border" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
