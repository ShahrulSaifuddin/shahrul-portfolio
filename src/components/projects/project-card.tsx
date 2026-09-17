'use client'

import { memo } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

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
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors duration-200',
        'hover:border-brand/40 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]',
        'dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]',
        className,
      )}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      transition={cardHoverSpring}
    >
      <div>
        <h3 className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
          {/* Stretched-link overlay: this is the ONLY link in the card, so the
              card is a single tab stop. `after:inset-0` covers the whole
              relatively-positioned card; the visible text stays inline here. */}
          <Link
            href={`/projects/${project.slug}`}
            className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>

        <span className="mt-3 inline-flex w-fit items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
          {project.status}
        </span>

        <p className="mt-3 text-sm text-muted-foreground">{project.role}</p>
      </div>

      <div
        className={cn(
          'mt-5 grid gap-3 border-t border-border pt-5',
          METRIC_GRID_COLS[visibleMetrics.length] ?? 'grid-cols-3',
        )}
      >
        {visibleMetrics.map((metric) => (
          <div key={metric.label}>
            <p className="font-mono text-lg font-semibold tracking-tight tabular-nums sm:text-xl">
              {metric.value}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {visibleTech.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground"
          >
            {tech}
          </span>
        ))}
        {overflowTechCount > 0 && (
          <span
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground"
            aria-label={`plus ${overflowTechCount} more technologies`}
          >
            +{overflowTechCount}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export const ProjectCard = memo(ProjectCardImpl)
