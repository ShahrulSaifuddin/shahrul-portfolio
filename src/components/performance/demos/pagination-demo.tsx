'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'

const TOTAL_ITEMS = 19
const PAGE_SIZE = 5

interface ChecklistRow {
  id: number
  label: string
}

const ALL_ROWS: readonly ChecklistRow[] = Array.from({ length: TOTAL_ITEMS }, (_, index) => ({
  id: index + 1,
  label: `Checklist item #${index + 1}`,
}))

const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / PAGE_SIZE)

/**
 * Paginates an in-memory list of this same checklist's 19 items, five per
 * page, entirely client-side. Only the current page's slice is rendered —
 * a real version of this pattern renders a bounded slice instead of every
 * row at once.
 */
export function PaginationDemo() {
  const [page, setPage] = useState(1)

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return ALL_ROWS.slice(start, start + PAGE_SIZE)
  }, [page])

  const isFirstPage = page === 1
  const isLastPage = page === TOTAL_PAGES

  return (
    <div className="space-y-3">
      <ul className="space-y-1.5">
        {pageRows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
          >
            {row.label}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={isFirstPage}
        >
          Previous
        </Button>

        <p aria-live="polite" className="font-mono text-xs tabular-nums text-muted-foreground">
          Page {page} of {TOTAL_PAGES}
        </p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setPage((current) => Math.min(TOTAL_PAGES, current + 1))}
          disabled={isLastPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
