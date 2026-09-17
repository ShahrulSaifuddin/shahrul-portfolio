import * as React from 'react'
import { cn } from '@/lib/utils'

type ContainerTag = 'div' | 'section' | 'main' | 'footer' | 'header'

/**
 * The single page-width primitive. Every section on every route wraps its
 * content in this instead of hand-rolling `mx-auto max-w-*` classes.
 */
export function Container({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: ContainerTag
}): React.ReactElement {
  const Tag = as
  return (
    <Tag className={cn('mx-auto w-full max-w-6xl px-6 sm:px-8', className)}>
      {children}
    </Tag>
  )
}
