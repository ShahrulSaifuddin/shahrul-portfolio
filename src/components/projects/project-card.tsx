'use client'

import { memo } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { SpotlightCard } from '@/components/fx/spotlight-card'
import { cardHoverSpring } from '@/lib/motion'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

/** Tailwind grid-cols classes keyed by visible metric count (2 or 3 in practice). */
const METRIC_GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

const MAX_VISIBLE_TECH = 5
const MAX_VISIBLE_METRICS = 3

/**
 * Wrapped in `React.memo`: `ProjectFilter` re-renders on every keystroke (its
 * `query` state), but `project` objects come from the module-level `projects`
 * array and keep a stable reference across renders where a given card is
 * still in the filtered list. Without memo, every visible card would
 * re-render on every keystroke for no reason — this is the real, live
 * instance of the pattern demonstrated on /performance's "Reduce Unnecessary
 * Re-Renders" item, not just a contrived demo.
 */
function ProjectCardImpl({ project, className }: { project: Project; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  const visibleMetrics = project.metrics.slice(0, MAX_VISIBLE_METRICS)
  const visibleTech = project.tech.slice(0, MAX_VISIBLE_TECH)
  const overflowTechCount = project.tech.length - visibleTech.length

  return (
    <motion.div
      className={cn('h-full', className)}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={cardHoverSpring}
    >
      <SpotlightCard as="article" className="flex h-full flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <span className="animate-led size-1.5 rounded-full bg-brand" />
            {project.status}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 transition-all duration-500 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5 group-hover/spot:text-brand"
          />
        </div>

        <h3 className="font-display-wide mt-6 text-2xl leading-tight font-bold sm:text-3xl">
          {/* Stretched-link overlay: this is the ONLY link in the card, so the
              card is a single tab stop. `after:inset-0` covers the whole
              relatively-positioned card; the visible text stays inline here. */}
          <Link
            href={`/projects/${project.slug}`}
            data-cursor="View"
            className="rounded-sm after:absolute after:inset-0 after:z-20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-muted-foreground">{project.subtitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{project.role}</p>

        <div
          className={cn(
            'mt-6 grid gap-3 border-y border-border py-5',
            METRIC_GRID_COLS[visibleMetrics.length] ?? 'grid-cols-3',
          )}
        >
          {visibleMetrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-display-wide text-xl font-bold tabular-nums sm:text-2xl">{metric.value}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {overflowTechCount > 0 && (
            <span
              className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
              aria-label={`plus ${overflowTechCount} more technologies`}
            >
              +{overflowTechCount}
            </span>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

export const ProjectCard = memo(ProjectCardImpl)
