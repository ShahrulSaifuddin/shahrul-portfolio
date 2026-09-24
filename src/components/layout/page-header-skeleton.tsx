import { Skeleton } from '@/components/ui/skeleton'

/**
 * Placeholder for `SectionHeader` (index/eyebrow → display heading →
 * description), sized to match its real dimensions so nothing shifts when
 * the real header replaces it. Used by every route's `loading.tsx`.
 */
export function PageHeaderSkeleton({ as = 'h1' }: { as?: 'h1' | 'h2' }) {
  return (
    <div className="mb-14 sm:mb-20">
      <Skeleton className="h-3 w-40" />
      <div className="mt-5 space-y-3">
        <Skeleton className={as === 'h1' ? 'h-12 w-72 sm:h-16 sm:w-[32rem] lg:h-20' : 'h-10 w-64 sm:h-14 sm:w-[28rem]'} />
        <Skeleton className={as === 'h1' ? 'h-12 w-56 sm:h-16 sm:w-80 lg:h-20' : 'h-10 w-48 sm:h-14 sm:w-72'} />
      </div>
      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-full max-w-[60ch]" />
        <Skeleton className="h-4 w-2/3 max-w-[40ch]" />
      </div>
    </div>
  )
}

/** Placeholder for a `MetricRail` of `count` cells. */
export function MetricRailSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 bg-background p-5 sm:p-6">
          <Skeleton className="h-10 w-14 sm:h-12" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  )
}
