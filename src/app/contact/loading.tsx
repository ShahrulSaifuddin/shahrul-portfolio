import { Container } from '@/components/layout/container'
import { PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown instantly on navigation to /contact, before the real page has
 * rendered — mirrors the console-framed form and the three sidebar panels
 * at their real dimensions, so nothing shifts when the real content swaps in.
 */
export default function ContactLoading() {
  return (
    <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading contact page…
      </span>

      <PageHeaderSkeleton />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div className="overflow-hidden rounded-3xl border border-border">
          <Skeleton className="h-11 w-full rounded-none" />
          <div className="space-y-6 p-5 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-13 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-13 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
            <div className="flex justify-end border-t border-border pt-6">
              <Skeleton className="h-14 w-44 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </Container>
  )
}
