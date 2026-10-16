import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Button-label micro-interaction: on hover of the nearest `.group`, the text
 * rolls up and an identical copy rolls in from below. Pure CSS; the copy is
 * `aria-hidden`, so the accessible name is read once.
 */
export function RollLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}): React.ReactElement {
  return (
    <span className={cn('relative block overflow-hidden', className)}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 motion-reduce:transition-none"
      >
        {children}
      </span>
    </span>
  )
}
