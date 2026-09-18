'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE } from '@/lib/motion'

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
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
