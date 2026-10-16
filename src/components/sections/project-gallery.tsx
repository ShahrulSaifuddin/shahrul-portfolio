'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowRight, ArrowUpRight, MoveRight } from 'lucide-react'

import { SpotlightCard } from '@/components/fx/spotlight-card'
import { ProjectVisual } from '@/components/projects/project-visual'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

type Mode = 'pin' | 'deck' | 'static'

/**
 * Selected work, three ways:
 * - `pin` (lg+): a pinned horizontal track driven by vertical scroll, with
 *   each panel swinging through a 3D coverflow as it crosses the screen.
 * - `deck` (phones/tablets): sticky cards that stack into a deck, the ones
 *   underneath tipping back and shrinking as the next slides over.
 * - `static` (reduced motion): the same markup as a plain vertical list.
 */
export function ProjectGallery({
  header,
  projects,
}: {
  header: React.ReactNode
  projects: readonly Project[]
}): React.ReactElement {
  const reduce = useReducedMotion()
  const [mode, setMode] = React.useState<Mode>('static')

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setMode(reduce ? 'static' : mq.matches ? 'pin' : 'deck')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduce])

  return mode === 'pin' ? (
    <PinnedTrack header={header} projects={projects} />
  ) : (
    <Deck header={header} projects={projects} animated={mode === 'deck'} />
  )
}

/* ------------------------------------------------------------------ pin */

function PinnedTrack({
  header,
  projects,
}: {
  header: React.ReactNode
  projects: readonly Project[]
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [distance, setDistance] = React.useState(0)
  const [vw, setVw] = React.useState(1440)

  React.useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      setVw(window.innerWidth)
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const distanceMV = useMotionValue(0)
  React.useEffect(() => distanceMV.set(distance), [distance, distanceMV])
  const x = useTransform(() => -eased.get() * distanceMV.get())
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={sectionRef} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-stretch gap-8 pr-[12vw] pl-[max(2rem,calc((100vw-72rem)/2+2rem))]"
        >
          <div className="flex w-[30rem] shrink-0 flex-col justify-center">{header}</div>

          {projects.map((project, i) => (
            <Coverflow key={project.slug} x={x} vw={vw}>
              <ProjectPanel project={project} index={i} total={projects.length} layout="wide" />
            </Coverflow>
          ))}

          <Coverflow x={x} vw={vw}>
            <AllProjectsLink className="h-full w-[22rem]" />
          </Coverflow>
        </motion.div>

        <div className="mx-auto mt-10 flex w-full max-w-6xl items-center gap-6 px-8">
          <span className="text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase">
            <MoveRight aria-hidden="true" className="text-brand size-4" />
            Keep scrolling
          </span>
          <span className="bg-border relative h-px flex-1">
            <motion.span
              className="bg-brand absolute inset-y-0 left-0 shadow-[0_0_10px_var(--brand)]"
              style={{ width: bar }}
            />
          </span>
        </div>
      </div>
    </div>
  )
}

/** Swings its child through 3D by how far it sits from the screen centre. */
function Coverflow({
  x,
  vw,
  children,
}: {
  x: MotionValue<number>
  vw: number
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const box = React.useRef({ left: 0, width: 1 })

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      box.current = { left: el.offsetLeft, width: el.offsetWidth }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const offset = (v: number) => {
    const centre = box.current.left + box.current.width / 2 + v
    return Math.max(-1.4, Math.min(1.4, (centre - vw / 2) / vw))
  }
  const rotateY = useTransform(x, (v) => offset(v) * -32)
  const scale = useTransform(x, (v) => 1 - Math.min(0.14, Math.abs(offset(v)) * 0.16))
  const z = useTransform(x, (v) => -Math.abs(offset(v)) * 160)
  const opacity = useTransform(
    x,
    (v) => 1 - Math.min(0.55, Math.max(0, Math.abs(offset(v)) - 0.35) * 0.9)
  )

  return (
    <motion.div
      ref={ref}
      style={{ rotateY, scale, z, opacity, transformPerspective: 1600 }}
      className="flex shrink-0 will-change-transform"
    >
      {children}
    </motion.div>
  )
}

/* ----------------------------------------------------------------- deck */

function Deck({
  header,
  projects,
  animated,
}: {
  header: React.ReactNode
  projects: readonly Project[]
  animated: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = projects.length

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8">
      <div className="mb-10">{header}</div>
      <div ref={ref} className="relative">
        {projects.map((project, i) => (
          <DeckCard
            key={project.slug}
            index={i}
            total={n}
            progress={scrollYProgress}
            animated={animated}
          >
            <ProjectPanel project={project} index={i} total={n} layout="compact" />
          </DeckCard>
        ))}
      </div>
      <AllProjectsLink className="mt-6 min-h-44" />
    </div>
  )
}

function DeckCard({
  index,
  total,
  progress,
  animated,
  children,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  animated: boolean
  children: React.ReactNode
}) {
  const start = index / total
  const target = 1 - (total - index - 1) * 0.06
  const scale = useTransform(progress, [start, 1], [1, target])
  const rotateX = useTransform(progress, [start, 1], [0, (total - index - 1) * 6])
  const dim = useTransform(progress, [start, 1], [0, (total - index - 1) * 0.18])

  if (!animated) return <div className="mb-6">{children}</div>

  return (
    <div className="sticky mb-6 [perspective:1200px]" style={{ top: `${88 + index * 18}px` }}>
      <motion.div
        style={{ scale, rotateX, transformOrigin: 'center top' }}
        className="relative will-change-transform"
      >
        {children}
        <motion.span
          aria-hidden="true"
          className="bg-background pointer-events-none absolute inset-0 rounded-2xl"
          style={{ opacity: dim }}
        />
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------- shared */

function AllProjectsLink({ className }: { className?: string }) {
  return (
    <Link
      href="/projects"
      data-cursor="All"
      className={cn(
        'group border-border bg-background/40 hover:border-brand focus-visible:ring-ring relative flex shrink-0 flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-dashed p-8 backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
    >
      <span className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
        + SD Engage and more
      </span>
      <span className="font-display-wide group-hover:text-brand text-4xl leading-none font-bold transition-colors">
        View all projects
      </span>
      <ArrowRight
        aria-hidden="true"
        className="text-brand size-10 transition-transform duration-500 group-hover:translate-x-3"
      />
    </Link>
  )
}

function ProjectPanel({
  project,
  index,
  total,
  layout,
}: {
  project: Project
  index: number
  total: number
  layout: 'wide' | 'compact'
}) {
  const wide = layout === 'wide'
  const metrics = project.metrics.slice(0, 3)
  const tech = project.tech.slice(0, wide ? 6 : 4)

  return (
    <SpotlightCard
      as="article"
      className={cn(
        'bg-card/80 shrink-0 p-6 sm:p-8',
        wide
          ? 'grid h-[min(72vh,40rem)] w-[min(76vw,64rem)] grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-8'
          : 'grid gap-6'
      )}
    >
      <div className="flex min-h-0 flex-col">
        <div className="text-muted-foreground flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.2em] uppercase">
          <span>
            <span className="text-brand">{String(index + 1).padStart(2, '0')}</span> /{' '}
            {String(total).padStart(2, '0')}
          </span>
          <span className="flex items-center gap-2 text-right">
            <span className="animate-led bg-brand size-1.5 shrink-0 rounded-full" />
            {project.status}
          </span>
        </div>

        <h3
          className={cn(
            'font-display-wide leading-[0.95] font-bold',
            wide ? 'mt-8 text-[clamp(2.25rem,4.4vw,4rem)]' : 'mt-5 text-4xl'
          )}
        >
          {/* Stretched link: the one tab stop for the whole panel. */}
          <Link
            href={`/projects/${project.slug}`}
            data-cursor="View"
            className="focus-visible:ring-ring rounded-sm after:absolute after:inset-0 after:z-20 focus-visible:ring-2 focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>
        <p className={cn('text-muted-foreground', wide ? 'mt-3 text-lg' : 'mt-2')}>
          {project.subtitle} <span className="text-border">·</span> {project.role}
        </p>

        <dl
          className={cn(
            'border-border grid grid-cols-3 gap-4 border-y',
            wide ? 'mt-8 py-5' : 'mt-5 py-4'
          )}
        >
          {metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="font-display-wide text-foreground block text-2xl font-bold sm:text-3xl">
                  {m.value}
                </span>
                <span
                  aria-hidden="true"
                  className="text-muted-foreground mt-1 block text-xs leading-snug"
                >
                  {m.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {wide ? (
          <p className="text-muted-foreground mt-6 line-clamp-3 text-[0.95rem] leading-relaxed">
            {project.highlights[0]}
          </p>
        ) : null}

        <div className={cn('mt-auto flex flex-wrap items-center gap-1.5', wide ? 'pt-6' : 'pt-5')}>
          {tech.map((t) => (
            <span
              key={t}
              className="border-border bg-muted/60 text-muted-foreground rounded-full border px-2.5 py-1 font-mono text-[11px]"
            >
              {t}
            </span>
          ))}
          <ArrowUpRight
            aria-hidden="true"
            className="text-muted-foreground group-hover/spot:text-brand ml-auto size-7 transition-all duration-500 group-hover/spot:translate-x-1 group-hover/spot:-translate-y-1"
          />
        </div>
      </div>

      <div className={wide ? 'min-h-0' : 'h-44 sm:h-56'}>
        <ProjectVisual slug={project.slug} />
      </div>
    </SpotlightCard>
  )
}
