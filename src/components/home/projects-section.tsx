'use client'

import * as React from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { FadeIn } from '@/components/home/fade-in'
import { OutlineButton } from '@/components/home/buttons'
import { featuredProjects } from '@/lib/data/projects'

type Project = (typeof featuredProjects)[number]

const PANEL =
  'rounded-[40px] border border-[#D7E2EA]/15 bg-[#141414] p-5 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:px-8 md:py-6'

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
}): React.ReactElement {
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])
  const [lead, ...restMetrics] = project.metrics
  const link = project.links[0]

  return (
    <div className="sticky top-20 flex min-h-[85vh] items-start justify-center md:top-24">
      <motion.article
        className="w-full origin-top rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 text-[#D7E2EA] sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale, top: `${index * 28}px`, position: 'relative' }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-2 sm:mb-5 md:px-4">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="hero-heading leading-none font-black"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 96px)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light tracking-widest text-[#D7E2EA]/60 uppercase sm:text-sm">
                {project.subtitle} · {project.status}
              </span>
              <h3
                className="font-medium uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
              <span className="text-xs font-light text-[#D7E2EA]/60 sm:text-sm">
                {project.role}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {link && <OutlineButton href={link.href}>Live Project</OutlineButton>}
            <OutlineButton href={`/projects/${project.slug}`}>Case Study</OutlineButton>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
          <div className="flex flex-col gap-3 sm:gap-4 md:w-[40%]">
            <div className={`${PANEL} flex flex-col justify-center`}>
              <span
                className="hero-heading leading-none font-black"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              >
                {lead.value}
              </span>
              <span className="mt-2 text-sm font-light tracking-wide text-[#D7E2EA]/70 uppercase">
                {lead.label}
              </span>
              {restMetrics.length > 0 && (
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  {restMetrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="text-xl font-semibold">{metric.value}</dt>
                      <dd className="text-xs font-light text-[#D7E2EA]/60 uppercase">
                        {metric.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className={PANEL}>
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-[#D7E2EA]/30 px-3 py-1 text-xs tracking-wide uppercase sm:text-sm"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`${PANEL} md:w-[60%]`}>
            <ul className="flex flex-col gap-3 leading-relaxed font-light">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="border-b border-[#D7E2EA]/10 pb-3 last:border-0 last:pb-0"
                  style={{ fontSize: 'clamp(0.8rem, 1vw, 0.95rem)' }}
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export function ProjectsSection(): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-10 text-center leading-none font-black tracking-tight uppercase sm:mb-14 md:mb-16"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Projects
      </FadeIn>

      <div ref={ref} className="mx-auto max-w-6xl">
        {featuredProjects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            total={featuredProjects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <OutlineButton href="/projects">All projects</OutlineButton>
      </div>
    </section>
  )
}
