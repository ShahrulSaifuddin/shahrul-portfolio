'use client'

import { useId, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'

import { ProjectCard } from '@/components/projects/project-card'
import { useDebouncedValue } from '@/components/projects/use-debounced-value'
import { Button } from '@/components/ui/button'
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

const pad = (n: number) => String(n).padStart(2, '0')

export function ProjectFilter({ projects, allTech }: ProjectFilterProps) {
  const searchInputId = useId()
  const reduce = useReducedMotion()
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
      {/* Control panel */}
      <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <label
              htmlFor={searchInputId}
              className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
            >
              <span aria-hidden="true" className="text-brand">
                &gt;_
              </span>
              Search projects
            </label>
            <div className="group relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand"
              />
              <input
                id={searchInputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, role, stack, highlight…"
                className="h-14 w-full rounded-full border border-input bg-background/70 pr-14 pl-13 text-base text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-brand focus:shadow-[0_0_0_4px_var(--glow)] [&::-webkit-search-cancel-button]:hidden"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground before:absolute before:-inset-[6px] before:content-[''] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Readout */}
          <div className="flex items-end gap-5 lg:justify-end">
            <p aria-hidden="true" className="font-display-wide text-6xl leading-none font-bold tabular-nums">
              <span className={filteredProjects.length ? 'text-brand' : 'text-destructive'}>
                {pad(filteredProjects.length)}
              </span>
              <span className="text-muted-foreground/50">/{pad(projects.length)}</span>
            </p>
            <div className="pb-1">
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
                  className="mt-1 rounded-sm text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6" role="group" aria-label="Filter by technology (matches all selected)">
          <p className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            <SlidersHorizontal aria-hidden="true" className="size-3.5 text-brand" />
            Filter by tech <span className="normal-case tracking-normal">— matches all selected</span>
            {selectedTech.length > 0 ? (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] tracking-normal text-brand-foreground">
                {selectedTech.length} on
              </span>
            ) : null}
          </p>
          {/* Phones: a three-row strip that scrolls sideways, so 30+ chips
              don't push the results a screen away. sm+: a normal wrap. */}
          <div className="-mx-5 grid auto-cols-max grid-flow-col grid-rows-3 gap-2 overflow-x-auto px-5 pb-2 [mask-image:linear-gradient(90deg,#000_88%,transparent)] [scrollbar-width:none] sm:mx-0 sm:flex sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 sm:[mask-image:none]">
            {allTech.map((tech) => {
              const isActive = selectedTech.includes(tech)
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  aria-pressed={isActive}
                  className={cn(
                    'group/chip flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                    isActive
                      ? 'border-brand bg-brand-muted text-brand shadow-[0_0_20px_-6px_var(--brand)]'
                      : 'border-border bg-background/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-1.5 rounded-full transition-all duration-300',
                      isActive ? 'bg-brand shadow-[0_0_8px_var(--brand)]' : 'bg-border group-hover/chip:bg-muted-foreground',
                    )}
                  />
                  {tech}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <motion.div layout={!reduce} className="mt-10 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-display-wide text-3xl font-bold">No signal.</p>
          <p className="mt-3 max-w-[40ch] text-sm text-muted-foreground">
            Try a different search term, or clear the tech filters.
          </p>
          <Button type="button" variant="outline" onClick={clearFilters} className="mt-6 rounded-full">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
