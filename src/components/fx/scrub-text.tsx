'use client'

import * as React from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  highlight: boolean
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span
      style={{ opacity }}
      className={highlight ? 'font-serif text-brand italic' : undefined}
    >
      {children}
    </motion.span>
  )
}

/**
 * Paragraph whose words light up one by one as it scrolls through the
 * viewport — scrubbed to scroll position, so reading speed is the reader's
 * own (after React Bits' <ScrollReveal />, rebuilt on Framer Motion instead
 * of GSAP to avoid a second animation runtime).
 */
export function ScrubText({
  text,
  highlight = [],
  className,
}: {
  text: string
  /** Words (exact, punctuation-stripped) to set in the italic accent face. */
  highlight?: readonly string[]
  className?: string
}): React.ReactElement {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(/\s+/)
  const marks = new Set(highlight.map((w) => w.toLowerCase()))

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          const bare = word.replace(/[^\p{L}\p{N}-]/gu, '').toLowerCase()
          return (
            <React.Fragment key={i}>
              <Word progress={scrollYProgress} range={[start, end]} highlight={marks.has(bare)}>
                {word}
              </Word>{' '}
            </React.Fragment>
          )
        })}
      </span>
    </p>
  )
}
