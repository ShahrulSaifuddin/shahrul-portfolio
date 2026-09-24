'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * A card with a pointer-tracking radial glow and a glowing border that
 * follows the cursor (after React Bits' <SpotlightCard />). Position is
 * written straight to CSS variables — no React state, no re-render per move.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}): React.ReactElement {
  const ref = React.useRef<HTMLElement>(null)

  function onMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      onPointerMove={onMove}
      className={cn(
        'group/spot relative isolate overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm',
        // Glow fill
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-100",
        'before:bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),var(--glow),transparent_60%)]',
        // Border glow (masked to a 1px ring)
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-px after:opacity-0 after:transition-opacity after:duration-500 after:content-[''] hover:after:opacity-100",
        'after:bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),var(--brand),transparent_70%)]',
        'after:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]',
        className
      )}
    >
      {children}
    </Tag>
  )
}
