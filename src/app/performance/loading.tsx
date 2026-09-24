import { Container } from '@/components/layout/container'
import { MetricRailSkeleton, PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/** One category's worth of closed accordion cards. */
function CategorySkeleton({ items }: { items: number }) {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border px-4 py-5 sm:px-6">
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3.5 w-full max-w-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Mirrors the real category sizes from src/lib/data/performance.ts
// (Caching 3, Assets 2, Rendering 4, Data 3, Delivery 3, Build 4 — 19 total)
// so the skeleton's height roughly matches the real content's.
const CATEGORY_SIZES = [3, 2, 4, 3, 3, 4]

/**
 * Shown instantly on navigation to /performance, before the real page has
 * rendered — mirrors the header, stat rail, intro and distribution panel,
 * the sticky index and the six grouped, closed accordion sections.
 */
export default function PerformanceLoading() {
  return (
    <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading performance checklist…
      </span>

      <PageHeaderSkeleton />
      <MetricRailSkeleton count={3} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
        <div className="max-w-[68ch] space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={i === 5 ? 'h-4 w-2/3' : 'h-4 w-full'} />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>

      <div className="mt-24 grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="space-y-20">
          {CATEGORY_SIZES.map((count, i) => (
            <CategorySkeleton key={i} items={count} />
          ))}
        </div>
      </div>
    </Container>
  )
}
