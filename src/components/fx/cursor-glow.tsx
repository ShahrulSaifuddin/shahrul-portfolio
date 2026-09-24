'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

/**
 * A trailing ring + dot that follows a fine pointer and swells over anything
 * interactive. The native cursor stays visible — this is garnish, never a
 * replacement — and it only mounts for mouse/trackpad users without
 * reduced motion.
 */
export function CursorGlow(): React.ReactElement | null {
  const [enabled, setEnabled] = React.useState(false)
  const [hovering, setHovering] = React.useState(false)
  const [label, setLabel] = React.useState<string | null>(null)
  const [visible, setVisible] = React.useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 })

  React.useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(fine && !reduce)
  }, [])

  React.useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null
      setHovering(Boolean(target))
      setLabel(target?.getAttribute('data-cursor') ?? null)
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-brand/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: label ? 88 : hovering ? 52 : 30,
          height: label ? 88 : hovering ? 52 : 30,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? 'var(--brand)' : 'rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {label ? (
          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-brand-foreground uppercase">
            {label}
          </span>
        ) : null}
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-brand"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
      />
    </div>
  )
}
