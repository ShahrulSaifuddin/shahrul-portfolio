'use client'

import { memo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

function useRenderCount(): number {
  const countRef = useRef(0)
  countRef.current += 1
  return countRef.current
}

function ChildCard({ label, renders }: { label: string; renders: number }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="font-mono text-xs text-muted-foreground">
        renders: <span className="tabular-nums text-foreground">{renders}</span>
      </p>
    </div>
  )
}

function NonMemoChild() {
  const renders = useRenderCount()
  return <ChildCard label="No React.memo" renders={renders} />
}

const MemoChild = memo(function MemoChild() {
  const renders = useRenderCount()
  return <ChildCard label="React.memo" renders={renders} />
})

/**
 * A parent re-renders on every click of its own counter and passes NO props
 * to either child. The plain child re-renders every time its parent does;
 * the `React.memo`-wrapped child bails out because its props never change,
 * so its render count stays fixed after the first paint.
 */
export function MemoDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" variant="outline" onClick={() => setCount((current) => current + 1)}>
          Re-render parent ({count})
        </Button>
        <p className="text-xs text-muted-foreground">Neither child receives changing props.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <NonMemoChild />
        <MemoChild />
      </div>
    </div>
  )
}
