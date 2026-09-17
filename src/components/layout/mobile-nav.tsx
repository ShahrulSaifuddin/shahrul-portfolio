'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
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
import type { NavItem } from '@/lib/types'

function isLinkActive(pathname: string, href: string): boolean {
  if (href.startsWith('/#')) return pathname === '/'
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * The `<768px` nav surface. Built on shadcn's `Sheet` (Radix Dialog), which
 * already provides focus trapping, `Esc`-to-close, focus return to the
 * trigger, and body scroll locking.
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
          className="inline-flex size-12 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-3/4 flex-col gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border px-6 py-4 text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 px-4 py-6">
          {links.map((link) => {
            const active = isLinkActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                  active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setOpen(false)}
            className="inline-flex size-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="GitHub profile"
          >
            <GitHubIcon className="size-5" />
          </a>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
