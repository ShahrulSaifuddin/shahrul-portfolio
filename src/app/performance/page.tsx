import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { PerformanceChecklist } from '@/components/performance/checklist'
import { performanceItems } from '@/lib/data/performance'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: `Performance checklist — ${siteConfig.name}`,
  description:
    'A 19-item engineering checklist covering caching, assets, rendering, data, delivery and build optimizations, with five live interactive demos.',
}

const DEMO_COUNT = performanceItems.filter((item) => item.demo !== null).length

export default function PerformancePage() {
  return (
    <Container as="div" className="py-20 sm:py-28 lg:py-32">
      <SectionHeader
        id="performance"
        eyebrow="Engineering checklist"
        title="Performance"
        description={`${performanceItems.length} optimization techniques, grouped by category, ${DEMO_COUNT} of them with a live demo you can try below.`}
      />

      <div className="mb-12 max-w-[68ch] space-y-3 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
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
          &quot;Live demo&quot; inside an expanded item.
        </p>
      </div>

      <PerformanceChecklist />
    </Container>
  )
}
