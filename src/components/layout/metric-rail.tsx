'use client'

import * as React from 'react'
import { useInView, useReducedMotion, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DUR } from '@/lib/motion'

/** Splits `'~3×'` into prefix `'~'`, integer `3`, suffix `'×'`. Non-numeric
 * values (no leading integer anywhere) are returned with `int: null`. */
function splitValue(value: string): {
  prefix: string
  int: number | null
  suffix: string
} {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  if (!match) return { prefix: '', int: null, suffix: value }
  const [, prefix, digits, suffix] = match
  return { prefix, int: Number(digits), suffix }
}

function MetricValue({
  value,
  countUp,
}: {
  value: string
  countUp: boolean
}): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const { prefix, int, suffix } = splitValue(value)

  // The initial state is the TRUE value, never 0.
  //
  // This is a factual-integrity requirement, not a style preference. These
  // numbers are claims about a real person ("5 years shipping production
  // systems"). If the count-up starts from 0 as the default state, then the
  // server-rendered HTML, the no-JavaScript render, a missed IntersectionObserver
  // callback, or a hydration hiccup all leave a visitor reading "0 years
  // shipping production systems" — a false statement, presented confidently.
  // That was a real, observed bug: after a reload every metric sat at 0
  // indefinitely.
  //
  // So: render the truth, and treat counting up as a pure enhancement that can
  // only ever fail *back* to the truth. Worst case is "no animation", never
  // "wrong number".
  const [display, setDisplay] = React.useState<number | null>(int)

  React.useEffect(() => {
    if (int === null || !countUp || reduceMotion || !inView) return

    // Only now, with the animation definitely about to run, drop to 0.
    setDisplay(0)
    const controls = animate(0, int, {
      duration: DUR.slow,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      // Pin the exact final value rather than trusting the last frame's rounding.
      onComplete: () => setDisplay(int),
    })
    return () => {
      controls.stop()
      // Interrupted mid-count (unmount, re-run, navigation) must restore the
      // real number, never leave a partial one on screen.
      setDisplay(int)
    }
  }, [int, countUp, reduceMotion, inView])

  if (int === null) {
    return (
      <span ref={ref} className="tabular-nums">
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/**
 * A strip of instrument-panel readouts: big display numerals, a mono label
 * beneath, hairline cells, and a small lit "LED" per cell. Used for the hero
 * headline stats and per-project metric strips.
 *
 * DOM contract (e2e/hero-metrics.spec.ts): each label <span> is a direct
 * child of its cell, and that cell holds exactly one `.tabular-nums` numeral.
 */
export function MetricRail({
  metrics,
  className,
  countUp = false,
}: {
  metrics: readonly { value: string; label: string }[]
  className?: string
  countUp?: boolean
}): React.ReactElement {
  const cols = metrics.length >= 4 ? 'lg:grid-cols-4' : metrics.length === 3 ? 'lg:grid-cols-3' : ''
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border',
        metrics.length === 5 ? 'lg:grid-cols-5' : cols,
        className
      )}
    >
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className="group relative flex flex-col gap-2 bg-background/80 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-card sm:p-6"
        >
          <span
            aria-hidden="true"
            className="animate-led absolute top-5 right-5 size-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
          <span className="font-display-wide text-4xl leading-none font-bold text-foreground transition-colors duration-300 group-hover:text-brand sm:text-5xl">
            <MetricValue value={metric.value} countUp={countUp} />
          </span>
          <span className="max-w-[26ch] font-mono text-[11px] leading-snug tracking-wide text-muted-foreground uppercase">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  )
}
