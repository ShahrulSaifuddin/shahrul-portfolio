import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * The eyebrow → heading → description block that opens every section. Keeps
 * heading ids consistent with `aria-labelledby` on the enclosing `<section>`.
 * Renders an `<h2>` by default; pass `as="h1"` when this header is the
 * page's visible title (e.g. `/projects`) so it doubles as the page's `<h1>`.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  as = 'h2',
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  as?: 'h1' | 'h2'
}): React.ReactElement {
  const Heading = as
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
      <Heading
        id={`${id}-heading`}
        className={
          as === 'h1'
            ? 'text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-foreground'
            : 'text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl'
        }
      >
        {title}
      </Heading>
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
