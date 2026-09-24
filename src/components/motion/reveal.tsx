'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, staggerParent } from '@/lib/motion'

type RevealTag = 'div' | 'section' | 'article' | 'li' | 'ul' | 'header'

// Typed as one motion component rather than `React.ElementType`: with
// @react-three/fiber installed, the global JSX namespace also carries every
// three.js element, and the `ElementType` prop intersection collapses to
// `never`. All six share the same HTML motion props for what we pass.
const MOTION_TAG = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  ul: motion.ul,
  header: motion.header,
} as unknown as Record<RevealTag, typeof motion.div>

const EASE_ARR = [...EASE] as [number, number, number, number]

const VIEWPORT = { once: true, margin: '-80px' } as const

/**
 * Animates itself into view once, on `whileInView`. Respects reduced motion
 * by rendering the final state immediately with no transform/transition.
 */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: {
  children: React.ReactNode
  delay?: number
  as?: RevealTag
  className?: string
}): React.ReactElement {
  const reduceMotion = useReducedMotion()
  const MotionTag = MOTION_TAG[as]

  if (reduceMotion) {
    const StaticTag = as
    return <StaticTag className={className}>{children}</StaticTag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE_ARR, delay }}
    >
      {children}
    </MotionTag>
  )
}

/** Orchestrates `RevealItem` children via `staggerChildren`. */
export function RevealGroup({
  children,
  stagger = 0.06,
  as = 'div',
  className,
}: {
  children: React.ReactNode
  stagger?: number
  as?: RevealTag
  className?: string
}): React.ReactElement {
  const reduceMotion = useReducedMotion()
  const MotionTag = MOTION_TAG[as]

  if (reduceMotion) {
    const StaticTag = as
    return <StaticTag className={className}>{children}</StaticTag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerParent(stagger)}
    >
      {children}
    </MotionTag>
  )
}

/** A single staggered child of `RevealGroup`. Must be a direct/descendant child. */
export function RevealItem({
  children,
  as = 'div',
  className,
}: {
  children: React.ReactNode
  as?: RevealTag
  className?: string
}): React.ReactElement {
  const reduceMotion = useReducedMotion()
  const MotionTag = MOTION_TAG[as]

  if (reduceMotion) {
    const StaticTag = as
    return <StaticTag className={className}>{children}</StaticTag>
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DUR.slow, ease: EASE_ARR },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}
