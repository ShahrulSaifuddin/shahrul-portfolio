'use client'

import * as React from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

function wrap(min: number, max: number, v: number): number {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Row({
  children,
  baseVelocity,
  className,
}: {
  children: React.ReactNode
  baseVelocity: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  // Rows lean into the direction of travel — the faster the scroll, the more skew.
  const skew = useTransform(smooth, [-2500, 0, 2500], [-8, 0, 8])
  const copyRef = React.useRef<HTMLSpanElement>(null)
  const [copyWidth, setCopyWidth] = React.useState(0)
  const direction = React.useRef(1)

  React.useLayoutEffect(() => {
    const el = copyRef.current
    if (!el) return
    const update = () => setCopyWidth(el.offsetWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const x = useTransform(baseX, (v) => (copyWidth ? `${wrap(-copyWidth, 0, v)}px` : '0px'))

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) direction.current = -1
    else if (f > 0) direction.current = 1
    moveBy += direction.current * moveBy * f
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="relative overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x, skewX: reduce ? 0 : skew }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} ref={i === 0 ? copyRef : undefined} className={`flex shrink-0 ${className ?? ''}`}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * Infinite marquee rows whose speed and direction follow scroll velocity,
 * adapted from React Bits' <ScrollVelocity />. Decorative duplicate content,
 * so the whole block is `aria-hidden`; the same facts live in real lists
 * elsewhere on the page.
 */
export function VelocityMarquee({
  rows,
  velocity = 60,
  className,
  rowClassName,
}: {
  rows: readonly React.ReactNode[]
  velocity?: number
  className?: string
  rowClassName?: string
}): React.ReactElement {
  return (
    <div aria-hidden="true" className={className}>
      {rows.map((row, i) => (
        <Row key={i} baseVelocity={i % 2 ? -velocity : velocity} className={rowClassName}>
          {row}
        </Row>
      ))}
    </div>
  )
}
