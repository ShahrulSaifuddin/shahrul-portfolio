'use client'

import * as React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * Sticky table of contents for the checklist: one row per category, lit
 * while that category crosses the middle of the viewport, with a progress
 * wire that fills as the whole list is read. Plain in-page anchors, so it
 * works without JavaScript too.
 */
export function CategoryIndex({
  categories,
  targetId,
}: {
  categories: readonly { id: string; label: string; count: number }[]
  targetId: string
}): React.ReactElement {
  const [active, setActive] = React.useState(categories[0]?.id)
  const targetRef = React.useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start 0.5', 'end 0.5'] })
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })

  React.useEffect(() => {
    targetRef.current = document.getElementById(targetId)
    const els = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -54% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [categories, targetId])

  return (
    <nav aria-label="Checklist categories" className="relative">
      <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Index</p>
      <div className="relative">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
        <motion.span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-brand shadow-[0_0_8px_var(--brand)]"
          style={{ scaleY: fill }}
        />
        <ol className="space-y-1">
          {categories.map((c) => {
            const on = c.id === active
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? 'location' : undefined}
                  className={cn(
                    'group flex items-center gap-4 rounded-lg py-2 pr-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    on ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative z-10 size-[11px] shrink-0 rounded-full border transition-all duration-300',
                      on ? 'scale-125 border-brand bg-brand shadow-[0_0_10px_var(--brand)]' : 'border-border bg-background'
                    )}
                  />
                  <span className="flex-1 font-medium">{c.label}</span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {String(c.count).padStart(2, '0')}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
