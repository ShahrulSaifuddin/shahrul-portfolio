'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Heading text that rises word by word out of a clipping mask when it enters
 * the viewport. Words listed in `accent` are set in the italic serif. The
 * heading's text content stays a plain, contiguous string for assistive tech
 * (each word is a real text node separated by real spaces).
 */
export function RevealWords({
  text,
  accent = [],
  className,
}: {
  text: string
  accent?: readonly string[]
  className?: string
}): React.ReactElement {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const marks = new Set(accent)

  return (
    <motion.span
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.06 }}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={
                marks.has(word.replace(/[^\p{L}\p{N}-]/gu, ''))
                  ? 'inline-block pr-[0.05em] font-serif font-normal tracking-normal text-brand italic'
                  : 'inline-block'
              }
              variants={{
                hidden: { y: '110%', rotate: 4 },
                visible: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </motion.span>
  )
}
