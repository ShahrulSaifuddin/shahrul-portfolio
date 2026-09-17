import {
  Clock,
  Database,
  FileCode,
  Gauge,
  Globe,
  Image as ImageIcon,
  Images,
  ListOrdered,
  ListTree,
  Minimize2,
  MousePointerClick,
  Network,
  PackageMinus,
  RefreshCw,
  Repeat,
  Rows3,
  Scissors,
  Server,
  Timer,
  type LucideIcon,
} from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { performanceItems } from '@/lib/data/performance'
import type { PerformanceCategory } from '@/lib/types'
import { DemoMount } from './demo-mount'

// Explicit name -> component map. Never index a namespace import (`Icons[name]`)
// — that drags the entire icon set into the bundle and defeats tree-shaking.
const ICONS: Record<string, LucideIcon> = {
  RefreshCw,
  Network,
  Database,
  Image: ImageIcon,
  Rows3,
  Timer,
  ListTree,
  MousePointerClick,
  Scissors,
  Globe,
  Server,
  ListOrdered,
  Gauge,
  Minimize2,
  Repeat,
  FileCode,
  Images,
  Clock,
  PackageMinus,
}

// Fixed display order — matches `PerformanceCategory` in src/lib/types.ts.
const CATEGORY_ORDER: readonly PerformanceCategory[] = [
  'Caching',
  'Assets',
  'Rendering',
  'Data',
  'Delivery',
  'Build',
]

/**
 * Renders all 19 `performanceItems`, grouped by category in a fixed order,
 * as a keyboard-operable accordion. Each item's expanded/collapsed state is
 * announced by the underlying Radix Accordion (aria-expanded on the
 * trigger, content hidden via `hidden` when collapsed). The five items with
 * a non-null `demo` mount their live demo via `DemoMount` when expanded.
 */
export function PerformanceChecklist() {
  return (
    <div className="space-y-12">
      {CATEGORY_ORDER.map((category) => {
        const items = performanceItems.filter((item) => item.category === category)
        if (items.length === 0) return null

        const categoryId = `performance-category-${category.toLowerCase()}`

        return (
          <section key={category} aria-labelledby={`${categoryId}-heading`}>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h3
                id={`${categoryId}-heading`}
                className="text-base font-semibold tracking-[-0.01em] sm:text-lg"
              >
                {category}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <Accordion type="multiple" className="border-t border-border">
              {items.map((item) => {
                const Icon = ICONS[item.icon]

                return (
                  <AccordionItem key={item.slug} value={item.slug}>
                    <AccordionTrigger className="py-4">
                      <span className="flex items-start gap-3">
                        {Icon ? (
                          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        ) : null}
                        <span className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-foreground sm:text-base">
                            {item.title}
                          </span>
                          <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                            {item.summary}
                          </span>
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-7">
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>

                      <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                          Applied here
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">
                          {item.appliedHere}
                        </p>
                      </div>

                      {item.evidence ? (
                        <div className="mt-3">
                          <Badge variant="outline" className="font-mono">
                            {item.evidence}
                          </Badge>
                        </div>
                      ) : null}

                      {item.demo ? (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                            Live demo
                          </p>
                          <DemoMount demo={item.demo} />
                        </div>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </section>
        )
      })}
    </div>
  )
}
