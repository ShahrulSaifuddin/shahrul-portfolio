import { Container } from '@/components/layout/container'
import { PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown instantly on navigation to /projects, before the real page has
 * rendered — mirrors `ProjectFilter`'s search input, tech-filter chip row,
 * result count and the 4-card grid at their real dimensions, so nothing
 * shifts when the real content swaps in.
 */
export default function ProjectsLoading() {
  return (
    <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading projects…
      </span>

      <PageHeaderSkeleton />

      <div className="max-w-sm">
        <Skeleton className="mb-1.5 h-3 w-28" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="mt-6">
        <Skeleton className="mb-2 h-3 w-44" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <Skeleton className="mt-6 h-4 w-40" />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex h-full flex-col rounded-xl border border-border p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
            <Skeleton className="mt-3 h-5 w-20 rounded-full" />
            <Skeleton className="mt-3 h-4 w-40" />

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-6 w-10" />
                  <Skeleton className="mt-1.5 h-3 w-14" />
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {Array.from({ length: 4 }).map((_, k) => (
                <Skeleton key={k} className="h-5 w-16 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
