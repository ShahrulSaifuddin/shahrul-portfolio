'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

type FadeInTag = 'div' | 'section' | 'h1' | 'h2' | 'p' | 'nav' | 'li' | 'span'

const MOTION_TAG = {
  div: motion.create('div'),
  section: motion.create('section'),
  h1: motion.create('h1'),
  h2: motion.create('h2'),
  p: motion.create('p'),
  nav: motion.create('nav'),
  li: motion.create('li'),
  span: motion.create('span'),
} as const

/** Fades + slides its children in once, the first time they enter the viewport. */
export function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: {
  children: React.ReactNode
  as?: FadeInTag
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
}): React.ReactElement {
  const MotionTag = MOTION_TAG[as] as React.ElementType

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}
