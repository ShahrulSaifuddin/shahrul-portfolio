'use client'

import * as React from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { CreditCard, Rocket, Server, Smartphone } from 'lucide-react'

import { cn } from '@/lib/utils'

const ICONS = [Smartphone, Server, CreditCard, Rocket] as const
const STAGES = ['Client', 'API', 'Integrations', 'Delivery'] as const

/**
 * What the summary says is owned "end to end", drawn as a signal chain: four
 * stages on one wire. The current is scrubbed to scroll — the wire fills and
 * each stage lights as the charge reaches it. Semantically it is just an
 * ordered list; the wire is decoration.
 */
export function SignalChain({ items }: { items: readonly string[] }): React.ReactElement {
  const ref = React.useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const [progressLit, setLit] = React.useState(0)
  const lit = reduce ? items.length : progressLit

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setLit(Math.min(items.length, Math.floor(v * (items.length + 0.2) + 0.15)))
  })

  return (
    <ol ref={ref} className="relative grid gap-4 lg:grid-cols-4 lg:gap-5">
      {/* The wire: horizontal on desktop, vertical on phones. */}
      <span
        aria-hidden="true"
        className="absolute top-8 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block"
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-8 left-[12.5%] hidden h-px origin-left bg-brand shadow-[0_0_12px_var(--brand)] lg:block"
        style={{ width: '75%', scaleX: reduce ? 1 : fill }}
      />
      <span aria-hidden="true" className="absolute top-8 bottom-8 left-8 w-px bg-border lg:hidden" />
      <motion.span
        aria-hidden="true"
        className="absolute top-8 bottom-8 left-8 w-px origin-top bg-brand shadow-[0_0_12px_var(--brand)] lg:hidden"
        style={{ scaleY: reduce ? 1 : fill }}
      />

      {items.map((item, i) => {
        const Icon = ICONS[i % ICONS.length]
        const on = i < lit
        return (
          <li key={item} className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
            <span
              className={cn(
                'relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl border bg-background transition-all duration-500',
                on
                  ? 'border-brand text-brand shadow-[0_0_0_4px_var(--background),0_0_28px_-4px_var(--brand)]'
                  : 'border-border text-muted-foreground shadow-[0_0_0_4px_var(--background)]'
              )}
            >
              <Icon aria-hidden="true" className="size-6" />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-background transition-colors duration-500',
                  on ? 'bg-brand' : 'bg-muted'
                )}
              />
            </span>
            <div className="pt-1 lg:pt-4">
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                0{i + 1} · {STAGES[i] ?? 'Stage'}
              </p>
              <p
                className={cn(
                  'mt-2 text-lg leading-snug font-medium transition-colors duration-500 lg:mx-auto lg:max-w-[20ch]',
                  on ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {item}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
