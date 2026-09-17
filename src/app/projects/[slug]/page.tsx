import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { getProjectBySlug, projects } from '@/lib/data/projects'
import { siteConfig } from '@/lib/site'
import type { ProjectSlug } from '@/lib/types'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug as ProjectSlug)

  if (!project) {
    return { title: `Project not found — ${siteConfig.name}` }
  }

  const title = `${project.name} — ${siteConfig.name}`
  const description = `${project.subtitle}. ${project.role}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/projects/${project.slug}`,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug as ProjectSlug)

  if (!project) {
    notFound()
  }

  const currentIndex = projects.findIndex((candidate) => candidate.slug === project.slug)
  const previousProject = projects[(currentIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <Container as="div" className="py-20 sm:py-28 lg:py-32">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to projects
      </Link>

      <header className="mt-8 max-w-3xl">
        <span className="inline-flex w-fit items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
          {project.status}
        </span>

        <h1 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl">
          {project.name}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">{project.subtitle}</p>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Role
            </dt>
            <dd className="mt-1">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Period
            </dt>
            <dd className="mt-1">{project.period}</dd>
          </div>
          {project.company && (
            <div>
              <dt className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Company
              </dt>
              <dd className="mt-1">{project.company}</dd>
            </div>
          )}
          {project.client && (
            <div>
              <dt className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Client
              </dt>
              <dd className="mt-1">{project.client}</dd>
            </div>
          )}
        </dl>

        {/* SD Engage ships with an empty `links` array (no store or
            case-study URL was supplied) — this block simply renders nothing
            for it, so the header layout stays intact without a broken or
            empty-looking link row. */}
        {project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="mt-12">
        <MetricRail metrics={project.metrics} countUp />
      </div>

      <section className="mt-16 max-w-[68ch]" aria-labelledby="what-i-built-heading">
        <h2 id="what-i-built-heading" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          What I built
        </h2>
        <ul className="mt-6 list-disc space-y-4 pl-5 marker:text-border">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base"
            >
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="tech-stack-heading">
        <h2 id="tech-stack-heading" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          Tech stack
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        <Link
          href={`/projects/${previousProject.slug}`}
          className="group rounded-xl border border-border p-5 transition-colors hover:border-brand/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <span className="flex items-center gap-1.5 text-xs font-mono tracking-[0.18em] text-muted-foreground uppercase">
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Previous
          </span>
          <span className="mt-2 block text-base font-semibold">{previousProject.name}</span>
        </Link>
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group rounded-xl border border-border p-5 text-right transition-colors hover:border-brand/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs font-mono tracking-[0.18em] text-muted-foreground uppercase">
            Next
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
          <span className="mt-2 block text-base font-semibold">{nextProject.name}</span>
        </Link>
      </nav>
    </Container>
  )
}
