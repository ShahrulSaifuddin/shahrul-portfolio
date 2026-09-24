'use client'

import * as React from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function Char({
  char,
  progress,
  range,
}: {
  char: string
  progress: MotionValue<number>
  range: [number, number]
}): React.ReactElement {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <motion.span className="absolute top-0 left-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  )
}

/** Reveals a paragraph character by character as it scrolls through the viewport. */
export function AnimatedText({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
}): React.ReactElement {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const words = text.split(' ')
  const total = text.length
  let index = 0

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, w) => (
        // Words are kept whole so line breaks never split them mid-word.
        <span key={w} aria-hidden className="inline-block whitespace-pre">
          {(word + (w < words.length - 1 ? ' ' : '')).split('').map((char) => {
            const start = index / total
            index += 1
            return (
              <Char
                key={index}
                char={char}
                progress={scrollYProgress}
                range={[start, start + 1 / total]}
              />
            )
          })}
        </span>
      ))}
    </p>
  )
}
