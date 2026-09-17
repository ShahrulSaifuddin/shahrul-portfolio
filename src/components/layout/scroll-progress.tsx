'use client'

import * as React from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * A 2px brand-colored progress bar pinned to the very top of the viewport.
 * Fixed positioning keeps it out of document flow, so it never shifts
 * layout.
 */
export function ScrollProgress(): React.ReactElement {
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  const scaleX = useSpring(
    scrollYProgress,
    reduceMotion
      ? { stiffness: 1000, damping: 100, restDelta: 0.001 }
      : { stiffness: 200, damping: 30, restDelta: 0.001 }
  )

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand"
    />
  )
}
