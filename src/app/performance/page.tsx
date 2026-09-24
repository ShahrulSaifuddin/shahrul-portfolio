import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { PageBackdrop } from '@/components/layout/page-backdrop'
import { SectionHeader } from '@/components/layout/section-header'
import { CATEGORY_ORDER, categoryId, PerformanceChecklist } from '@/components/performance/checklist'
import { CategoryIndex } from '@/components/performance/category-index'
import { performanceItems } from '@/lib/data/performance'
import { siteConfig } from '@/lib/site'

const description =
  'A 19-item engineering checklist covering caching, assets, rendering, data, delivery and build optimizations, with five live interactive demos.'

export const metadata: Metadata = {
  // Bare title: the root layout's `title.template` appends the site name.
  // Repeating it here produced "… — Shahrul Saifuddin — Shahrul Saifuddin".
  // The Open Graph title stays fully qualified — no template applies to it.
  title: 'Performance checklist',
  description,
  openGraph: {
    title: `Performance checklist — ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/performance`,
    type: 'website',
  },
}

const DEMO_COUNT = performanceItems.filter((item) => item.demo !== null).length

const CATEGORIES = CATEGORY_ORDER.map((category) => ({
  id: categoryId(category),
  label: category,
  count: performanceItems.filter((item) => item.category === category).length,
})).filter((c) => c.count > 0)

const STATS = [
  { value: String(performanceItems.length), label: 'Techniques documented' },
  { value: String(CATEGORIES.length), label: 'Categories' },
  { value: String(DEMO_COUNT), label: 'With a live, working demo' },
]

/** One bar, one segment per category, width proportional to its item count. */
function CategoryBreakdown() {
  const total = performanceItems.length
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        Distribution
      </p>
      <div aria-hidden="true" className="flex h-3 gap-1 overflow-hidden rounded-full">
        {CATEGORIES.map((c, i) => (
          <span
            key={c.id}
            className="h-full rounded-full bg-brand"
            style={{ width: `${(c.count / total) * 100}%`, opacity: 1 - i * 0.12 }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <li key={c.id} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" style={{ opacity: 1 - i * 0.12 }} />
            {c.label}
            <span className="ml-auto font-mono text-xs text-foreground">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PerformancePage() {
  return (
    <div className="relative isolate">
      <PageBackdrop />
      <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32">
        <SectionHeader
          as="h1"
          id="performance"
          index="/performance"
          eyebrow="Engineering checklist"
          title="Performance, stated honestly."
          accent={['honestly.']}
          description={`${performanceItems.length} optimization techniques, grouped by category, ${DEMO_COUNT} of them with a live demo you can try below.`}
        />

        <MetricRail metrics={STATS} countUp />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
          <div className="max-w-[68ch] space-y-4 leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              This page is an engineering checklist, not a claim that this static site does all 19 of
              these things itself. Each item below states plainly whether it is live on this
              portfolio or documents production work on another system — FastEV&apos;s and SD
              Engage&apos;s Laravel APIs, Karuna Growth Suite&apos;s Express/SQLite API, and the
              CloudPanel/Nginx/PM2 VPS infrastructure behind them. Nothing here is rounded up: a
              static, prerendered site genuinely has no database and nothing to load-balance, and
              that is stated outright rather than glossed over.
            </p>
            <p>
              Five items include a real, working demo you can interact with directly — look for
              the <span className="font-mono text-sm text-brand">LIVE DEMO</span> tag, then expand
              the item.
            </p>
          </div>
          <div className="self-start rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
            <CategoryBreakdown />
          </div>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <CategoryIndex categories={CATEGORIES} targetId="performance-checklist" />
            </div>
          </aside>
          <div id="performance-checklist">
            <PerformanceChecklist />
          </div>
        </div>
      </Container>
    </div>
  )
}
