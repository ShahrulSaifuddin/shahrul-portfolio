'use client'

import * as React from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'

import type { ExperienceItem } from '@/lib/types'
import { cn } from '@/lib/utils'

function Role({ item, index }: { item: ExperienceItem; index: number }) {
  const ref = React.useRef<HTMLLIElement>(null)
  const reached = useInView(ref, { margin: '0px 0px -50% 0px' })
  const reduce = useReducedMotion()
  const on = reduce || reached
  const current = item.endDate === null
  const [startYear] = item.startDate.split('-')

  return (
    <li ref={ref} className="relative grid gap-4 pb-20 pl-14 last:pb-0 sm:pl-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      {/* Node on the wire */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-2 left-[13px] flex size-[22px] items-center justify-center rounded-full border-2 bg-background transition-all duration-500 sm:left-[21px]',
          on ? 'border-brand shadow-[0_0_20px_var(--brand)]' : 'border-border'
        )}
      >
        <span className={cn('size-2 rounded-full transition-colors duration-500', on ? 'bg-brand' : 'bg-transparent')} />
      </span>

      <div className="lg:sticky lg:top-32 lg:self-start">
        <p
          className={cn(
            'font-display-wide text-5xl leading-none font-bold transition-colors duration-500 sm:text-6xl',
            on ? 'text-foreground' : 'text-muted-foreground/40'
          )}
        >
          {startYear}
        </p>
        <p className="mt-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {item.period}
        </p>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
        className={cn(
          'rounded-2xl border bg-card/60 p-6 backdrop-blur-sm transition-colors duration-500 sm:p-8',
          on ? 'border-brand/30' : 'border-border'
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          {current ? (
            <span className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand-muted px-2.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
              <span className="animate-led size-1.5 rounded-full bg-brand" />
              Current
            </span>
          ) : null}
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {item.location}
          </span>
        </div>
        <h3 className="font-display-wide mt-4 text-2xl leading-tight font-bold sm:text-3xl">
          {item.role}
          <span className="block text-lg font-semibold text-muted-foreground sm:text-xl">{item.company}</span>
        </h3>
        <ul className="mt-5 space-y-3">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-[0.975rem] leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-brand" />
              {bullet}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  )
}

/** Career timeline on a live wire that fills with scroll. */
export function ExperienceTimeline({ items }: { items: readonly ExperienceItem[] }): React.ReactElement {
  const ref = React.useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute top-2 bottom-0 left-6 w-px bg-border sm:left-8" />
      <motion.span
        aria-hidden="true"
        className="absolute top-2 bottom-0 left-6 w-px origin-top bg-gradient-to-b from-brand via-brand to-arc shadow-[0_0_14px_var(--brand)] sm:left-8"
        style={{ scaleY: reduce ? 1 : fill }}
      />
      {items.map((item, i) => (
        <Role key={item.company} item={item} index={i} />
      ))}
    </ol>
  )
}
