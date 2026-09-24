'use client'

import { useId, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'

import { ProjectCard } from '@/components/projects/project-card'
import { useDebouncedValue } from '@/components/projects/use-debounced-value'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProjectFilterProps {
  projects: readonly Project[]
  allTech: readonly string[]
}

/** How many tech chips show before "Show all". */
const COLLAPSED_TECH_COUNT = 10

const LABEL = 'text-xs font-light tracking-[0.3em] uppercase opacity-60'

/** Builds one lowercase haystack per project so search only runs the join once per render. */
function buildSearchHaystack(project: Project): string {
  return [project.name, project.subtitle, project.role, ...project.highlights, ...project.tech]
    .join(' ')
    .toLowerCase()
}

export function ProjectFilter({ projects, allTech }: ProjectFilterProps) {
  const searchInputId = useId()
  const [query, setQuery] = useState('')
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [showAllTech, setShowAllTech] = useState(false)
  const debouncedQuery = useDebouncedValue(query, 200)

  // Most-used tech first, so the collapsed row is the most useful filters.
  const techByUsage = useMemo(() => {
    const count = (tech: string) => projects.filter((p) => p.tech.includes(tech)).length
    return [...allTech].sort((a, b) => count(b) - count(a) || a.localeCompare(b))
  }, [projects, allTech])

  const visibleTech = showAllTech
    ? techByUsage
    : Array.from(new Set([...techByUsage.slice(0, COLLAPSED_TECH_COUNT), ...selectedTech]))

  const filteredProjects = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesQuery =
        normalizedQuery.length === 0 || buildSearchHaystack(project).includes(normalizedQuery)

      // AND semantics: a project must include every selected tech, not just one.
      const matchesTech =
        selectedTech.length === 0 || selectedTech.every((tech) => project.tech.includes(tech))

      return matchesQuery && matchesTech
    })
  }, [projects, debouncedQuery, selectedTech])

  const hasActiveFilters = query.length > 0 || selectedTech.length > 0

  function toggleTech(tech: string) {
    setSelectedTech((current) =>
      current.includes(tech) ? current.filter((item) => item !== tech) : [...current, tech]
    )
  }

  function clearFilters() {
    setQuery('')
    setSelectedTech([])
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="w-full md:max-w-sm">
          <label htmlFor={searchInputId} className={cn('mb-3 block', LABEL)}>
            Search projects
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 opacity-60"
            />
            <input
              id={searchInputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, role, tech…"
              className="h-14 w-full rounded-full border-2 border-[#0C0C0C]/50 bg-transparent pr-12 pl-12 text-base placeholder:text-[#0C0C0C]/50 focus-visible:border-[#0C0C0C] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full before:absolute before:-inset-2 before:content-[''] hover:bg-[#0C0C0C]/10 focus-visible:ring-2 focus-visible:ring-[#0C0C0C] focus-visible:outline-none"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div
          className="flex-1"
          role="group"
          aria-label="Filter by technology (matches all selected)"
        >
          <p className={cn('mb-3', LABEL)}>
            Filter by tech <span className="normal-case">— matches all selected</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {visibleTech.map((tech) => {
              const isActive = selectedTech.includes(tech)
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex min-h-11 items-center justify-center rounded-full border-2 px-4 text-xs tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-[#0C0C0C] focus-visible:ring-offset-2 focus-visible:outline-none',
                    isActive
                      ? 'border-[#0C0C0C] bg-[#0C0C0C] text-white'
                      : 'border-[#0C0C0C]/20 hover:border-[#0C0C0C]'
                  )}
                >
                  {tech}
                </button>
              )
            })}
            {techByUsage.length > COLLAPSED_TECH_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllTech((current) => !current)}
                aria-expanded={showAllTech}
                className="flex min-h-11 items-center rounded-full px-4 text-xs font-medium tracking-wide uppercase underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#0C0C0C] focus-visible:outline-none"
              >
                {showAllTech ? 'Show less' : `Show all ${techByUsage.length}`}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 mb-2 flex flex-wrap items-center gap-4">
        <p aria-live="polite" className={LABEL}>
          {filteredProjects.length === 0
            ? 'No projects match your filters.'
            : `Showing ${filteredProjects.length} of ${projects.length} project${
                projects.length === 1 ? '' : 's'
              }`}
        </p>
        {hasActiveFilters && filteredProjects.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-sm text-xs font-medium tracking-[0.2em] uppercase underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#0C0C0C] focus-visible:outline-none"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[40px] border-2 border-dashed border-[#0C0C0C]/20 p-12 text-center">
          <p className="font-light opacity-60">
            Try a different search term, or clear the tech filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-full border-2 border-[#0C0C0C] px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors hover:bg-[#0C0C0C] hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
