'use client'

import * as React from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * Tactile hover: the card tilts toward the cursor in 3D and a soft glare
 * slides across it. Mouse only — touch keeps a still card. Children with
 * `[transform:translateZ(…)]` float above the surface for parallax depth.
 */
export function TiltCard({
  children,
  className,
  max = 9,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 18, mass: 0.5 })
  const sry = useSpring(ry, { stiffness: 200, damping: 18, mass: 0.5 })

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 2 * max)
    rx.set(-(py - 0.5) * 2 * max)
    ref.current.style.setProperty('--gx', `${px * 100}%`)
    ref.current.style.setProperty('--gy', `${py * 100}%`)
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      className={cn('group/tilt relative [transform-style:preserve-3d]', className)}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(520px_circle_at_var(--gx,50%)_var(--gy,50%),oklch(1_0_0/0.09),transparent_45%)] group-hover/tilt:opacity-100"
      />
    </motion.div>
  )
}
