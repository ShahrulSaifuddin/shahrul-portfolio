import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * The eyebrow → h2 → description block that opens every section. Keeps
 * heading ids consistent with `aria-labelledby` on the enclosing `<section>`.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}): React.ReactElement {
  return (
    <div
      className={cn(
        'mb-12 space-y-3 sm:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2
        id={`${id}-heading`}
        className="text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
