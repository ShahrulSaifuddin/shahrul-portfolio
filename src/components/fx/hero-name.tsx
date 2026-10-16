'use client'

import * as React from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * The giant two-line name. Entrance: every letter flips up out of the floor
 * in 3D, staggered (pure CSS, keyed off `html[data-boot]` so it waits for the
 * loader — and without JavaScript it simply renders lit). Exit: as the hero
 * scrolls away the two lines shear apart and tip backwards.
 *
 * The visible letters are `aria-hidden`; the `<h1>` carries the real name.
 */
export function HeroName({
  lines,
  className,
}: {
  lines: readonly { text: string; className?: string }[]
  className?: string
}): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.25', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  const xs = [useTransform(p, [0, 1], ['0%', '-14%']), useTransform(p, [0, 1], ['0%', '16%'])]
  const rotateX = useTransform(p, [0, 1], [0, 38])
  const opacity = useTransform(p, [0, 0.9], [1, 0.15])

  let charIndex = 0
  return (
    <span ref={ref} aria-hidden="true" className={cn('block [perspective:900px]', className)}>
      {lines.map((line, li) => (
        <motion.span
          key={line.text}
          className={cn('block origin-bottom whitespace-nowrap', line.className)}
          style={reduce ? undefined : { x: xs[li % 2], rotateX, opacity }}
        >
          {Array.from(line.text).map((ch, ci) => {
            const d = 120 + charIndex++ * 55
            return (
              <span key={ci} className="char-3d" style={{ '--d': `${d}ms` } as React.CSSProperties}>
                {ch}
              </span>
            )
          })}
        </motion.span>
      ))}
    </span>
  )
}
