'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE } from '@/lib/motion'
import { scrollToTop } from '@/components/fx/smooth-scroll'

const EASE_ARR = [...EASE] as [number, number, number, number]

/**
 * Next.js remounts `template.tsx` on every navigation (unlike `layout.tsx`,
 * which persists), so this is what gives each page visit a fresh entrance
 * animation and a reset scroll position — including back/forward navigation,
 * which browsers otherwise restore mid-scroll.
 */
export default function Template({ children }: { children: React.ReactNode }): React.ReactElement {
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    // An in-page anchor (e.g. /#about from another route) owns the scroll
    // position; resetting to the top would throw it away. Everything else —
    // links, reloads, back/forward — starts at the top (see BOOT_INIT_SCRIPT,
    // which turns off the browser's own scroll restoration).
    if (window.location.hash) return
    scrollToTop(true)
    // Late layout (fonts, the pinned gallery measuring itself) can nudge the
    // position after the first frame; pin it once more.
    const id = window.requestAnimationFrame(() => scrollToTop(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.slow, ease: EASE_ARR }}
    >
      {children}
    </motion.div>
  )
}
