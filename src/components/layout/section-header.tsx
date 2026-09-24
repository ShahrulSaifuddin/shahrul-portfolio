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
  align = 'center',
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
        'mb-14 flex flex-col gap-5 sm:mb-20',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      <p className="text-muted-foreground text-xs font-light tracking-[0.3em] uppercase sm:text-sm">
        {eyebrow}
      </p>
      <Heading
        id={`${id}-heading`}
        className="hero-heading leading-none font-black tracking-tight uppercase"
        style={{
          fontSize: as === 'h1' ? 'clamp(3rem, 12vw, 160px)' : 'clamp(2.5rem, 7vw, 96px)',
        }}
      >
        {title}
      </Heading>
      {description ? (
        <p className="text-foreground/80 max-w-[60ch] leading-relaxed font-light sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
