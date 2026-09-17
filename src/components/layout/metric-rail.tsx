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
  const [display, setDisplay] = React.useState(int !== null && countUp && !reduceMotion ? 0 : int)

  React.useEffect(() => {
    if (int === null || !countUp || reduceMotion || !inView) return
    const controls = animate(0, int, {
      duration: DUR.slow,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
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
 * A row of mono-numeral metrics with labels beneath. Used for the hero
 * headline stats and per-project metric strips.
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
  return (
    <div
      className={cn(
        'grid grid-cols-2 divide-x divide-border border-y border-border sm:grid-cols-4',
        className
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col gap-1 px-4 py-4 first:pl-0 sm:px-6">
          <span className="font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <MetricValue value={metric.value} countUp={countUp} />
          </span>
          <span className="text-xs text-muted-foreground">{metric.label}</span>
        </div>
      ))}
    </div>
  )
}
