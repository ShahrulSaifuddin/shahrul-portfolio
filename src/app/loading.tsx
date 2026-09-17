import type { ReactNode } from 'react'

import { Container } from '@/components/layout/container'
import { PageHeaderSkeleton } from '@/components/layout/page-header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * A generic below-the-fold section placeholder: eyebrow/heading/description
 * plus a caller-provided content block. Used for the home page's later
 * sections (About, Featured Projects, Skills), which a visitor reaches by
 * scrolling — exact per-section fidelity matters far less here than above
 * the fold, so one shared shape covers all three.
 */
function SectionSkeleton({ children }: { children?: ReactNode }) {
  return (
    <Container className="py-20 sm:py-28 lg:py-32">
      <PageHeaderSkeleton as="h2" />
      {children}
    </Container>
  )
}

/** A row of `count` equal-height card-shaped placeholders. */
function CardGridSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-xl" />
      ))}
    </div>
  )
}

/**
 * Shown instantly when navigating TO `/` from elsewhere (the wordmark, or a
 * browser back/forward), before the real page has rendered. The hero — what
 * is actually visible on arrival — mirrors `Hero`'s real layout closely;
 * sections below the fold use the lighter generic shape above.
 */
export default function HomeLoading() {
  return (
    <div aria-busy="true">
      <span className="sr-only" role="status">
        Loading…
      </span>

      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Skeleton className="h-10 w-72 sm:h-12 sm:w-96 lg:h-14 lg:w-[28rem]" />
            <Skeleton className="mt-4 h-6 w-64 sm:h-7 sm:w-80" />
            <Skeleton className="mt-6 h-4 w-full max-w-[68ch]" />
            <Skeleton className="mt-2 h-4 w-2/3 max-w-[50ch]" />

            <div className="mt-10 grid grid-cols-2 divide-x divide-border border-y border-border sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1 px-4 py-4 first:pl-0 sm:px-6">
                  <Skeleton className="h-7 w-10" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-40 rounded-lg" />
              <Skeleton className="h-11 w-36 rounded-lg" />
            </div>
          </div>

          <Skeleton className="mx-auto size-44 shrink-0 rounded-full lg:mx-0" />
        </div>
      </Container>

      <SectionSkeleton>
        <div className="max-w-[68ch] space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </SectionSkeleton>

      <SectionSkeleton>
        <CardGridSkeleton count={3} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
      </SectionSkeleton>

      <SectionSkeleton>
        <CardGridSkeleton count={5} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" />
      </SectionSkeleton>
    </div>
  )
}
