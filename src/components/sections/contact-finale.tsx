'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const Lightning = dynamic(() => import('@/components/fx/lightning'), { ssr: false })

/** Oversized closing statement whose lines slide in opposite directions with scroll. */
export function KineticLines({ lines }: { lines: readonly string[] }): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const a = useTransform(scrollYProgress, [0, 1], ['-12%', '6%'])
  const b = useTransform(scrollYProgress, [0, 1], ['14%', '-8%'])

  return (
    <div ref={ref} aria-hidden="true" className="select-none">
      {lines.map((line, i) => (
        <motion.span
          key={line}
          style={reduce ? undefined : { x: i % 2 ? b : a }}
          className={
            i === lines.length - 1
              ? 'font-display-wide block text-[clamp(3rem,13vw,12rem)] leading-[0.9] font-extrabold whitespace-nowrap text-brand uppercase [text-shadow:0_0_60px_var(--glow)]'
              : 'font-display-wide block text-[clamp(3rem,13vw,12rem)] leading-[0.9] font-extrabold whitespace-nowrap uppercase'
          }
        >
          {line}
        </motion.span>
      ))}
    </div>
  )
}

export function FinaleBackdrop(): React.ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <Lightning hue={160} xOffset={-0.35} speed={0.5} intensity={0.28} size={1.1} className="block size-full" />
      </div>
      <div className="bg-grid bg-grid-fade absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
