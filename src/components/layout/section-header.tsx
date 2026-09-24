import * as React from 'react'

import { RevealWords } from '@/components/fx/reveal-words'
import { cn } from '@/lib/utils'

/**
 * The index → eyebrow → heading → description block that opens every
 * section. Keeps heading ids consistent with `aria-labelledby` on the
 * enclosing `<section>`. Renders an `<h2>` by default; pass `as="h1"` when
 * this header is the page's visible title (e.g. `/projects`).
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  index,
  accent,
  align = 'left',
  className,
  as = 'h2',
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  /** Two-digit section number, e.g. `'02'`. */
  index?: string
  /** Words of `title` set in the italic accent face. */
  accent?: readonly string[]
  align?: 'left' | 'center'
  className?: string
  as?: 'h1' | 'h2'
}): React.ReactElement {
  const Heading = as
  return (
    <div
      className={cn(
        'mb-14 sm:mb-20',
        align === 'center' && 'flex flex-col items-center text-center',
        className
      )}
    >
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
        {index ? <span className="text-brand">{index}</span> : null}
        <span aria-hidden="true" className="h-px w-10 bg-border" />
        {eyebrow}
      </p>
      <Heading
        id={`${id}-heading`}
        className={cn(
          'font-display-wide mt-5 max-w-[18ch] font-bold text-balance text-foreground',
          as === 'h1'
            ? 'text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95]'
            : 'text-[clamp(2.1rem,5.4vw,4.25rem)] leading-[0.98]'
        )}
      >
        <RevealWords text={title} accent={accent} />
      </Heading>
      {description ? (
        <p
          className={cn(
            'mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground sm:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
