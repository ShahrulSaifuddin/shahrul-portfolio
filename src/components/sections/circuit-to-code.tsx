'use client'

import * as React from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * A PCB trace — resistor, capacitor, ground — that draws itself with scroll
 * and terminates in a code bracket: electrical engineering running straight
 * into software. Pure decoration.
 */
export function CircuitToCode(): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.45'] })
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const codeOpacity = useTransform(draw, [0.75, 1], [0, 1])
  const pathLength = reduce ? 1 : draw

  const trace =
    'M10 120 H70 l8 -14 l12 28 l12 -28 l12 28 l12 -28 l8 14 H190 V60 H250 M250 44 V76 M262 44 V76 M262 60 H330 V120 H370'
  const ground = 'M190 120 V160 M174 160 H206 M180 168 H200 M186 176 H194'

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full">
      <svg viewBox="0 0 520 200" className="w-full overflow-visible">
        <defs>
          <filter id="trace-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={trace} fill="none" stroke="var(--border)" strokeWidth="2" />
        <path d={ground} fill="none" stroke="var(--border)" strokeWidth="2" />
        <motion.path
          d={trace}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#trace-glow)"
          style={{ pathLength }}
        />
        <motion.path
          d={ground}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        {[
          [10, 120],
          [190, 120],
          [370, 120],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="5" fill="var(--background)" stroke="var(--brand)" strokeWidth="2" />
        ))}
        <motion.text
          x="382"
          y="140"
          className="font-mono"
          fontSize="58"
          fontWeight="700"
          fill="var(--brand)"
          style={{ opacity: reduce ? 1 : codeOpacity }}
        >
          {'</>'}
        </motion.text>
        <text x="10" y="100" fontSize="11" letterSpacing="2" fill="var(--muted-foreground)" className="font-mono">
          B.ENG · EEE
        </text>
        <text x="330" y="100" fontSize="11" letterSpacing="2" fill="var(--muted-foreground)" className="font-mono">
          SOFTWARE
        </text>
      </svg>
    </div>
  )
}
