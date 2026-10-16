'use client'

import * as React from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * Scroll-linked 3D: the block tips up out of the page as it enters, lies flat
 * while you read it, then tips away as it leaves — in both scroll
 * directions, because it is driven by position rather than a one-shot
 * trigger. `depth` scales every angle and distance.
 */
export function Perspective({
  children,
  className,
  depth = 1,
  origin = 'center bottom',
}: {
  children: React.ReactNode
  className?: string
  depth?: number
  origin?: string
}): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.35 })
  const rotateX = useTransform(p, [0, 0.32, 0.72, 1], [26 * depth, 0, 0, -12 * depth])
  const y = useTransform(p, [0, 0.32], [90 * depth, 0])
  const scale = useTransform(p, [0, 0.32, 0.72, 1], [1 - 0.08 * depth, 1, 1, 1 - 0.05 * depth])
  const opacity = useTransform(p, [0, 0.22, 0.85, 1], [0, 1, 1, 0.35])

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={cn('[perspective:1400px]', className)}>
      <motion.div
        style={{ rotateX, y, scale, opacity, transformOrigin: origin }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
