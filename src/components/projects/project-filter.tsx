'use client'

import { useId, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'

import { ProjectCard } from '@/components/projects/project-card'
import { useDebouncedValue } from '@/components/projects/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProjectFilterProps {
  projects: readonly Project[]
  allTech: readonly string[]
}

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
  const debouncedQuery = useDebouncedValue(query, 200)

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
      current.includes(tech) ? current.filter((item) => item !== tech) : [...current, tech],
    )
  }

  function clearFilters() {
    setQuery('')
    setSelectedTech([])
  }

  return (
    <div>
      <div className="max-w-sm">
        <label
          htmlFor={searchInputId}
          className="mb-1.5 block text-xs font-mono tracking-[0.18em] text-muted-foreground uppercase"
        >
          Search projects
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={searchInputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, role, tech…"
            className="h-10 pr-9 pl-8"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground before:absolute before:-inset-[9px] before:content-[''] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6" role="group" aria-label="Filter by technology (matches all selected)">
        <p className="mb-2 text-xs font-mono tracking-[0.18em] text-muted-foreground uppercase">
          Filter by tech <span className="normal-case">— matches all selected</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {allTech.map((tech) => {
            const isActive = selectedTech.includes(tech)
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                aria-pressed={isActive}
                className={cn(
                  'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-3 py-1.5 text-xs font-mono transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                  isActive
                    ? 'border-brand/40 bg-brand-muted text-brand'
                    : 'border-border bg-muted text-muted-foreground hover:bg-accent',
                )}
              >
                {tech}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <p aria-live="polite" className="text-sm text-muted-foreground">
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
            className="rounded-sm text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Try a different search term, or clear the tech filters.
          </p>
          <Button type="button" variant="outline" onClick={clearFilters} className="mt-4">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
