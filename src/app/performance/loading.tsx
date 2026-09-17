import { Container } from '@/components/layout/container'
import { PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/** One category's worth of closed accordion rows. */
function CategorySkeleton({ items }: { items: number }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="border-t border-border">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-border py-4">
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full max-w-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Mirrors the real category sizes from src/lib/data/performance.ts
// (Caching 3, Assets 2, Rendering 3, Data 3, Delivery 3, Build 5 — 19 total)
// so the skeleton's height roughly matches the real content's.
const CATEGORY_SIZES = [3, 2, 3, 3, 3, 5]

/**
 * Shown instantly on navigation to /performance, before the real page has
 * rendered — mirrors the header, intro copy and the six grouped, closed
 * accordion sections at their real dimensions.
 */
export default function PerformanceLoading() {
  return (
    <Container as="div" className="py-20 sm:py-28 lg:py-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading performance checklist…
      </span>

      <PageHeaderSkeleton />

      <div className="mb-12 max-w-[68ch] space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="space-y-12">
        {CATEGORY_SIZES.map((count, i) => (
          <CategorySkeleton key={i} items={count} />
        ))}
      </div>
    </Container>
  )
}
