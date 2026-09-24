import { Container } from '@/components/layout/container'
import { MetricRailSkeleton, PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown instantly on navigation to /projects, before the real page has
 * rendered — mirrors the header, the stat rail, `ProjectFilter`'s control
 * panel and the 4-card grid at their real dimensions, so nothing shifts
 * when the real content swaps in.
 */
export default function ProjectsLoading() {
  return (
    <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading projects…
      </span>

      <PageHeaderSkeleton />

      <div className="mb-12 sm:mb-16">
        <MetricRailSkeleton count={3} />
      </div>

      <div className="rounded-3xl border border-border p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Skeleton className="mb-3 h-3 w-36" />
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
          <Skeleton className="h-14 w-48" />
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <Skeleton className="mb-4 h-3 w-52" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex h-full flex-col rounded-2xl border border-border p-6 sm:p-8">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="mt-6 h-8 w-44" />
            <Skeleton className="mt-3 h-4 w-40" />
            <Skeleton className="mt-2 h-4 w-56" />
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-5">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="mt-1.5 h-3 w-16" />
                </div>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
              {Array.from({ length: 5 }).map((_, k) => (
                <Skeleton key={k} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
