'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

import { freelance } from '@/lib/data/profile'

/**
 * Phones only: a floating "hire me" bar that rises once the visitor has
 * scrolled past the hero, and steps aside while the closing contact section
 * (or the contact page itself) is on screen — there is already a CTA there.
 */
export function HireBar(): React.ReactElement | null {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = React.useState(false)
  const [contactInView, setContactInView] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const target = document.getElementById('contact') ?? document.querySelector('footer')
    const io = target
      ? new IntersectionObserver(([e]) => setContactInView(e.isIntersecting), {
          rootMargin: '0px 0px -20% 0px',
        })
      : null
    if (target) io?.observe(target)
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [pathname])

  if (pathname === '/contact') return null
  const show = scrolled && !contactInView

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden"
        >
          <div className="border-border bg-background/85 flex items-center gap-2 rounded-full border p-1.5 pl-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <span aria-hidden="true" className="relative flex size-2 shrink-0">
              <span className="bg-brand absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
              <span className="bg-brand relative inline-flex size-2 rounded-full" />
            </span>
            <span className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-[10px] tracking-[0.14em] uppercase">
              Available now
            </span>
            <a
              href={freelance.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Message on WhatsApp"
              className="border-border text-foreground active:bg-accent flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
            </a>
            <Link
              href="/contact"
              className="bg-brand text-brand-foreground flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold shadow-[0_8px_24px_-8px_var(--brand)] active:scale-[0.97]"
            >
              Hire me
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
