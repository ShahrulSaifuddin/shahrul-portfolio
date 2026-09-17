import { Container } from '@/components/layout/container'
import { PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown instantly on navigation to /contact, before the real page has
 * rendered — mirrors the form fields and the direct-contact sidebar at their
 * real dimensions, so nothing shifts when the real content swaps in.
 */
export default function ContactLoading() {
  return (
    <Container as="div" className="py-20 sm:py-28 lg:py-32" aria-busy="true">
      <span className="sr-only" role="status">
        Loading contact page…
      </span>

      <PageHeaderSkeleton />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="max-w-3xl space-y-5">
          {/* Name, Email, Subject: label + single-line input */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
          {/* Message: label + 6-row textarea */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-2.5 w-14" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </Container>
  )
}
