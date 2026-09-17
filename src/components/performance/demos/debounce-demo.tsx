'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hand-written debounce hook — no lodash. Returns a value that only updates
 * `delayMs` after the caller stops changing `value`.
 */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}

/**
 * Two inputs fed by the same keystrokes: one updates its "handled" counter
 * on every keystroke, the other only after typing pauses for ~300ms. The
 * counters make the difference visible without needing to inspect network
 * calls.
 */
export function DebounceDemo() {
  const [rawValue, setRawValue] = useState('')
  const [rawCount, setRawCount] = useState(0)

  const debouncedValue = useDebouncedValue(rawValue, 300)
  const [debouncedCount, setDebouncedCount] = useState(0)
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    setDebouncedCount((count) => count + 1)
  }, [debouncedValue])

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="debounce-raw" className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Raw (every keystroke)
        </label>
        <input
          id="debounce-raw"
          type="text"
          value={rawValue}
          onChange={(event) => {
            setRawValue(event.target.value)
            setRawCount((count) => count + 1)
          }}
          placeholder="Type here…"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="font-mono text-xs text-muted-foreground">
          handler calls: <span className="tabular-nums text-foreground">{rawCount}</span>
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="debounce-debounced" className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Debounced (~300ms after you pause)
        </label>
        <input
          id="debounce-debounced"
          type="text"
          value={rawValue}
          onChange={(event) => setRawValue(event.target.value)}
          placeholder="Same input, debounced…"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="font-mono text-xs text-muted-foreground">
          handler calls: <span className="tabular-nums text-foreground">{debouncedCount}</span>
        </p>
      </div>
    </div>
  )
}
