'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import type { Project } from '@/lib/types'

const MAX_VISIBLE_TECH = 5

/**
 * One numbered row of the /projects list, styled after the home page's
 * Services list: huge index, name + details, key metrics, arrow.
 *
 * Wrapped in `React.memo`: `ProjectFilter` re-renders on every keystroke (its
 * `query` state), but `project` objects come from the module-level `projects`
 * array and keep a stable reference across renders where a given row is
 * still in the filtered list. Without memo, every visible row would
 * re-render on every keystroke for no reason — this is the real, live
 * instance of the pattern demonstrated on /performance's "Reduce Unnecessary
 * Re-Renders" item, not just a contrived demo.
 */
function ProjectCardImpl({ project, index }: { project: Project; index: number }) {
  const visibleTech = project.tech.slice(0, MAX_VISIBLE_TECH)
  const overflowTechCount = project.tech.length - visibleTech.length
  const visibleMetrics = project.metrics.slice(0, 2)

  return (
    <div
      className="group relative grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-6 border-b py-10 first:border-t sm:gap-x-10 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-x-12 md:py-12"
      style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
    >
      <span
        className="leading-none font-black transition-colors group-hover:text-[#7621B0]"
        style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex min-w-0 flex-col gap-2 md:gap-3">
        <p className="text-xs font-light tracking-[0.25em] uppercase opacity-60 sm:text-sm">
          {project.subtitle} · {project.status}
        </p>
        <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1.25rem, 2.6vw, 2.4rem)' }}>
          {/* Stretched-link overlay: the ONLY link in the row, so the row is a
              single tab stop; `after:inset-0` makes the whole row clickable. */}
          <Link
            href={`/projects/${project.slug}`}
            className="rounded-sm after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-[#0C0C0C] focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>
        <p
          className="max-w-2xl leading-relaxed font-light opacity-60"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
        >
          {project.role} · {project.period}
        </p>
        <ul className="mt-1 flex flex-wrap gap-2">
          {visibleTech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[#0C0C0C]/20 px-3 py-1 text-xs tracking-wide uppercase"
            >
              {tech}
            </li>
          ))}
          {overflowTechCount > 0 && (
            <li
              className="rounded-full border border-[#0C0C0C]/20 px-3 py-1 text-xs tracking-wide uppercase opacity-60"
              aria-label={`plus ${overflowTechCount} more technologies`}
            >
              +{overflowTechCount}
            </li>
          )}
        </ul>
      </div>

      <div className="hidden items-center gap-10 md:flex">
        <dl className="flex gap-8 text-right">
          {visibleMetrics.map((metric) => (
            <div key={metric.label} className="w-24">
              <dt className="sr-only">{metric.label}</dt>
              <dd
                className="leading-none font-black"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                {metric.value}
              </dd>
              <dd aria-hidden className="mt-1 text-[11px] leading-snug uppercase opacity-60">
                {metric.label}
              </dd>
            </div>
          ))}
        </dl>
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#0C0C0C] transition-colors group-hover:bg-[#0C0C0C] group-hover:text-white">
          <ArrowUpRight aria-hidden="true" className="size-6" />
        </span>
      </div>
    </div>
  )
}

export const ProjectCard = memo(ProjectCardImpl)
