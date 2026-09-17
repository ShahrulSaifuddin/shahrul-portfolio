'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const SIMULATED_LOAD_MS = 1200

interface FakeCard {
  id: number
  title: string
  detail: string
}

const RESULT_ROWS: readonly FakeCard[] = [
  { id: 1, title: 'Charge session #4821', detail: 'Completed · 18.2 kWh' },
  { id: 2, title: 'Charge session #4822', detail: 'In progress · 6.4 kWh' },
  { id: 3, title: 'Charge session #4823', detail: 'Completed · 11.9 kWh' },
]

/**
 * A "Load" button simulates a ~1.2s fetch. While pending, skeleton rows are
 * sized to match the real rows exactly (same height, gap and padding) so
 * swapping content in causes zero layout shift.
 */
export function SkeletonDemo() {
  const [state, setState] = useState<'idle' | 'loading' | 'loaded'>('idle')

  const handleLoad = () => {
    setState('loading')
    window.setTimeout(() => setState('loaded'), SIMULATED_LOAD_MS)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Simulates a ~1.2s network fetch.</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleLoad}
          disabled={state === 'loading'}
        >
          {state === 'loading' ? 'Loading…' : 'Load'}
        </Button>
      </div>

      <div aria-busy={state === 'loading'} aria-live="polite" className="space-y-2">
        {state === 'loading'
          ? RESULT_ROWS.map((row) => (
              <div key={row.id} className="flex h-12 items-center gap-3 rounded-lg border border-border px-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))
          : null}

        {state === 'loaded'
          ? RESULT_ROWS.map((row) => (
              <div
                key={row.id}
                className="flex h-12 items-center justify-between gap-3 rounded-lg border border-border px-3 text-sm"
              >
                <span className="font-medium text-foreground">{row.title}</span>
                <span className="text-muted-foreground">{row.detail}</span>
              </div>
            ))
          : null}

        {state === 'idle' ? (
          <p className="text-sm text-muted-foreground">Press Load to see the skeleton state.</p>
        ) : null}
      </div>
    </div>
  )
}
