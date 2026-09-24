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
export const CATEGORY_ORDER: readonly PerformanceCategory[] = [
  'Caching',
  'Assets',
  'Rendering',
  'Data',
  'Delivery',
  'Build',
]

export function categoryId(category: PerformanceCategory): string {
  return `performance-category-${category.toLowerCase()}`
}

/**
 * Renders all 19 `performanceItems`, grouped by category in a fixed order,
 * as a keyboard-operable accordion. Each item's expanded/collapsed state is
 * announced by the underlying Radix Accordion (aria-expanded on the
 * trigger, content hidden via `hidden` when collapsed). The five items with
 * a non-null `demo` mount their live demo via `DemoMount` when expanded.
 *
 * The accordion primitives merge classes with plain `cn` (no
 * tailwind-merge), so overrides of their built-in utilities use Tailwind's
 * `!` important suffix.
 */
export function PerformanceChecklist() {
  let running = 0

  return (
    <div className="space-y-20">
      {CATEGORY_ORDER.map((category, categoryIndex) => {
        const items = performanceItems.filter((item) => item.category === category)
        if (items.length === 0) return null

        const id = categoryId(category)

        return (
          <section key={category} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
              <h3 id={`${id}-heading`} className="font-display-wide text-3xl font-bold sm:text-4xl">
                <span aria-hidden="true" className="mr-3 font-mono text-sm font-medium text-brand">
                  {String(categoryIndex + 1).padStart(2, '0')}
                </span>
                {category}
              </h3>
              <span className="pb-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <Accordion type="multiple" className="gap-3">
              {items.map((item) => {
                const Icon = ICONS[item.icon]
                running += 1
                const number = String(running).padStart(2, '0')

                return (
                  <AccordionItem
                    key={item.slug}
                    value={item.slug}
                    className="group/item rounded-2xl border border-border bg-card/50 px-4 backdrop-blur-sm transition-colors duration-300 hover:border-foreground/20 data-[state=open]:border-brand/40 data-[state=open]:bg-card data-[state=open]:shadow-[0_20px_60px_-30px_var(--brand)] sm:px-6"
                  >
                    <AccordionTrigger className="items-center! gap-4 py-5! hover:no-underline!">
                      <span className="flex min-w-0 flex-1 items-center gap-4">
                        <span aria-hidden="true" className="hidden w-6 shrink-0 font-mono text-xs text-muted-foreground sm:block">
                          {number}
                        </span>
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-300 group-hover/item:text-foreground group-data-[state=open]/item:border-brand group-data-[state=open]/item:text-brand group-data-[state=open]/item:shadow-[0_0_20px_-6px_var(--brand)]">
                          {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
                        </span>
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground sm:text-lg">
                            {item.title}
                            {item.demo ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand-muted px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.16em] text-brand uppercase">
                                <span aria-hidden="true" className="animate-led size-1.5 rounded-full bg-brand" />
                                Live demo
                              </span>
                            ) : null}
                          </span>
                          <span className="text-sm font-normal text-muted-foreground">{item.summary}</span>
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6! sm:pl-[6.25rem]">
                      <p className="max-w-[70ch] leading-relaxed text-muted-foreground">{item.detail}</p>

                      <div className="mt-5 rounded-xl border-l-2 border-brand bg-brand-muted/40 py-4 pr-4 pl-5">
                        <p className="font-mono text-[11px] tracking-[0.2em] text-brand uppercase">
                          Applied here
                        </p>
                        <p className="mt-2 leading-relaxed text-foreground">{item.appliedHere}</p>
                      </div>

                      {item.evidence ? (
                        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground">
                          <span aria-hidden="true" className="text-brand">
                            ✓
                          </span>
                          {item.evidence}
                        </p>
                      ) : null}

                      {item.demo ? (
                        <div className="mt-6">
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
