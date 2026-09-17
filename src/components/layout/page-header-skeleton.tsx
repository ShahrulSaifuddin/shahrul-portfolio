import { Skeleton } from '@/components/ui/skeleton'

/**
 * Placeholder for `SectionHeader` (eyebrow → heading → description), sized to
 * match its real dimensions so nothing shifts when the real header replaces
 * it. Used by every route's `loading.tsx`.
 */
export function PageHeaderSkeleton({ as = 'h1' }: { as?: 'h1' | 'h2' }) {
  return (
    <div className="mb-12 space-y-3 sm:mb-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className={as === 'h1' ? 'h-9 w-64 sm:h-10 sm:w-80' : 'h-8 w-56 sm:h-9 sm:w-72'} />
      <Skeleton className="h-4 w-full max-w-[68ch]" />
      <Skeleton className="h-4 w-2/3 max-w-[40ch]" />
    </div>
  )
}
