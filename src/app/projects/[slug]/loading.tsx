import { Container } from '@/components/layout/container'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown instantly on navigation to a project case study, before the real
 * page has rendered — mirrors the back link, header block, metric rail,
 * "What I built" list, tech pills and prev/next nav at their real
 * dimensions, so nothing shifts when the real content swaps in.
 */
export default function ProjectCaseStudyLoading() {
  return (
    <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading project…
      </span>

      <Skeleton className="h-5 w-32" />

      <div className="mt-8 max-w-3xl">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="mt-4 h-10 w-64 sm:h-12 sm:w-80" />
        <Skeleton className="mt-3 h-5 w-72" />

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-1.5 h-4 w-28" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 divide-x divide-border border-y border-border sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1 px-4 py-4 first:pl-0 sm:px-6">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-[68ch]">
        <Skeleton className="h-7 w-44 sm:h-8" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <Skeleton className="h-7 w-32 sm:h-8" />
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-5 w-28" />
        </div>
        <div className="rounded-xl border border-border p-5">
          <Skeleton className="ml-auto h-3 w-12" />
          <Skeleton className="mt-2 ml-auto h-5 w-28" />
        </div>
      </div>
    </Container>
  )
}
