'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Cycles through `words` with a vertical slot-machine roll (after React Bits'
 * <RotatingText />). Screen readers get the full list once, as plain text,
 * instead of a live region announcing every change.
 */
export function RotatingWord({
  words,
  interval = 2200,
  className,
}: {
  words: readonly string[]
  interval?: number
  className?: string
}): React.ReactElement {
  const reduce = useReducedMotion()
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => window.clearInterval(id)
  }, [reduce, words.length, interval])

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="relative inline-flex overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[index]}
            className="inline-block whitespace-nowrap"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
