'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const HIT_AREA = 'inline-flex size-12 items-center justify-center rounded-lg'
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/**
 * Sun/moon toggle. Renders a stable, unlabeled placeholder until mounted so
 * the resolved theme (client-only) never causes a hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span aria-hidden="true" className={cn(HIT_AREA, className)}>
        <span className="size-5" />
      </span>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        HIT_AREA,
        FOCUS_RING,
        'text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
        className
      )}
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  )
}
