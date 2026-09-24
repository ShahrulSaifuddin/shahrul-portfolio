'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'

const Lightning = dynamic(() => import('@/components/fx/lightning'), { ssr: false })

/**
 * The hero's living background: a WebGL lightning arc (React Bits), an
 * engineering grid, grain, and a vignette. As the hero scrolls away the arc
 * sinks and fades — parallax that sells depth without moving any content.
 */
export function HeroBackdrop(): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <Lightning hue={158} xOffset={-1.05} speed={0.6} intensity={0.38} size={1.4} className="block size-full" />
      </motion.div>
      {/* Keep the arc off the nav bar. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="bg-grid bg-grid-fade absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_20%_35%,var(--glow),transparent_70%)] opacity-60" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
