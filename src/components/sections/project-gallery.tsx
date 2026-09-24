'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, MoveRight } from 'lucide-react'

import { SpotlightCard } from '@/components/fx/spotlight-card'
import { ProjectVisual } from '@/components/projects/project-visual'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Pinned horizontal gallery. On `lg+` the section is as tall as the track is
 * wide; a sticky viewport stays put while vertical scroll drives the track
 * sideways. Below `lg`, or under reduced motion, the very same markup is just
 * a vertical stack — distance measures to 0 and nothing pins.
 */
export function ProjectGallery({
  header,
  projects,
}: {
  header: React.ReactNode
  projects: readonly Project[]
}): React.ReactElement {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // Layout mode first (media query), measurement second: the track only
  // lays out horizontally in pin mode, so measuring it to *decide* the mode
  // would always read the stacked width and never pin.
  const [pinMode, setPinMode] = React.useState(false)
  const [distance, setDistance] = React.useState(0)

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setPinMode(mq.matches && !reduce)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduce])

  React.useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || !pinMode) {
      setDistance(0)
      return
    }
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinMode])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const distanceMV = useMotionValue(0)
  React.useEffect(() => distanceMV.set(distance), [distance, distanceMV])
  const x = useTransform(() => -eased.get() * distanceMV.get())
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const pinned = pinMode

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={cn(pinned && 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden')}>
        <motion.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={cn(
            'flex gap-6',
            // Pinned: the first column lines up with the site's content column.
            pinned
              ? 'w-max items-stretch pr-[12vw] pl-[max(2rem,calc((100vw-72rem)/2+2rem))]'
              : 'mx-auto max-w-6xl flex-col px-6 sm:px-8'
          )}
        >
          <div className={cn('flex shrink-0 flex-col justify-center', pinned && 'w-[30rem]')}>{header}</div>

          {projects.map((project, i) => (
            <ProjectPanel key={project.slug} project={project} index={i} total={projects.length} pinned={pinned} />
          ))}

          <Link
            href="/projects"
            data-cursor="All"
            className={cn(
              'group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-border p-8 transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              pinned ? 'w-[22rem]' : 'min-h-56'
            )}
          >
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              + SD Engage and more
            </span>
            <span className="font-display-wide text-4xl leading-none font-bold transition-colors group-hover:text-brand">
              View all projects
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-10 text-brand transition-transform duration-500 group-hover:translate-x-3"
            />
          </Link>
        </motion.div>

        {pinned ? (
          <div className="mx-auto mt-10 flex w-full max-w-6xl items-center gap-6 px-8">
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              <MoveRight aria-hidden="true" className="size-4 text-brand" />
              Keep scrolling
            </span>
            <span className="relative h-px flex-1 bg-border">
              <motion.span
                className="absolute inset-y-0 left-0 bg-brand shadow-[0_0_10px_var(--brand)]"
                style={{ width: bar }}
              />
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ProjectPanel({
  project,
  index,
  total,
  pinned,
}: {
  project: Project
  index: number
  total: number
  pinned: boolean
}) {
  const metrics = project.metrics.slice(0, 3)
  const tech = project.tech.slice(0, 6)

  return (
    <SpotlightCard
      as="article"
      className={cn(
        'shrink-0 p-6 sm:p-8',
        pinned ? 'grid h-[min(72vh,40rem)] w-[min(76vw,64rem)] grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-8' : 'grid gap-8'
      )}
    >
      <div className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          <span>
            <span className="text-brand">{String(index + 1).padStart(2, '0')}</span> /{' '}
            {String(total).padStart(2, '0')}
          </span>
          <span className="flex items-center gap-2">
            <span className="animate-led size-1.5 rounded-full bg-brand" />
            {project.status}
          </span>
        </div>

        <h3 className="font-display-wide mt-8 text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.95] font-bold">
          {/* Stretched link: the one tab stop for the whole panel. */}
          <Link
            href={`/projects/${project.slug}`}
            data-cursor="View"
            className="rounded-sm after:absolute after:inset-0 after:z-20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-3 text-lg text-muted-foreground">
          {project.subtitle} <span className="text-border">·</span> {project.role}
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-5">
          {metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="font-display-wide block text-2xl font-bold text-foreground sm:text-3xl">
                  {m.value}
                </span>
                <span aria-hidden="true" className="mt-1 block text-xs leading-snug text-muted-foreground">
                  {m.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
          {project.highlights[0]}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-6">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
          <ArrowUpRight
            aria-hidden="true"
            className="ml-auto size-7 text-muted-foreground transition-all duration-500 group-hover/spot:translate-x-1 group-hover/spot:-translate-y-1 group-hover/spot:text-brand"
          />
        </div>
      </div>

      <div className={cn('min-h-72', pinned && 'min-h-0')}>
        <ProjectVisual slug={project.slug} />
      </div>
    </SpotlightCard>
  )
}
