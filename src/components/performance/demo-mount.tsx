'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import type { PerformanceDemo } from '@/lib/types'

function DemoLoadingFallback() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

const DebounceDemo = dynamic(() => import('./demos/debounce-demo').then((m) => m.DebounceDemo), {
  loading: DemoLoadingFallback,
  ssr: false,
})

const SkeletonDemo = dynamic(() => import('./demos/skeleton-demo').then((m) => m.SkeletonDemo), {
  loading: DemoLoadingFallback,
  ssr: false,
})

const PaginationDemo = dynamic(() => import('./demos/pagination-demo').then((m) => m.PaginationDemo), {
  loading: DemoLoadingFallback,
  ssr: false,
})

const LazyImageDemo = dynamic(() => import('./demos/lazy-image-demo').then((m) => m.LazyImageDemo), {
  loading: DemoLoadingFallback,
  ssr: false,
})

const MemoDemo = dynamic(() => import('./demos/memo-demo').then((m) => m.MemoDemo), {
  loading: DemoLoadingFallback,
  ssr: false,
})

const DEMOS: Record<Exclude<PerformanceDemo, null>, ComponentType> = {
  debounce: DebounceDemo,
  skeleton: SkeletonDemo,
  pagination: PaginationDemo,
  'lazy-image': LazyImageDemo,
  memo: MemoDemo,
}

/**
 * Mounts one of the five live demos by key. This is the ONLY client
 * boundary the checklist needs — each demo module is code-split via
 * `next/dynamic` (`ssr: false`) with a `Skeleton` fallback so none of the
 * five demos bloat the initial `/performance` bundle; they load only when
 * this component mounts on the client.
 */
export function DemoMount({ demo }: { demo: Exclude<PerformanceDemo, null> }) {
  const Demo = DEMOS[demo]
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <Demo />
    </div>
  )
}
