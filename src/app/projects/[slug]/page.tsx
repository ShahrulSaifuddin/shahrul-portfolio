import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { ProjectVisual } from '@/components/projects/project-visual'
import { getProjectBySlug, projects } from '@/lib/data/projects'
import { siteConfig } from '@/lib/site'
import type { ProjectSlug } from '@/lib/types'

// Projects that have an instrument in ProjectVisual.
const HAS_VISUAL = new Set<ProjectSlug>(['fastev', 'karuna-growth-suite', 'ctapps-digital'])

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// All four real slugs are enumerated above and fully static — there is no
// reason to ever render this route on demand for a slug outside that set.
// This matters beyond tidiness: with `loading.tsx` present in this segment,
// Next streams a 200 response immediately for the Suspense fallback, before
// the async page component runs — so by the time an unmatched slug reaches
// `notFound()` below, the 200 status is already committed and can't become a
// 404. `dynamicParams = false` rejects anything outside generateStaticParams
// at the routing layer itself, before that streaming response ever starts,
// which is what keeps a real 404 on unknown slugs. Caught by
// e2e/navigation.spec.ts's "an unknown project slug returns a 404" test,
// which went from a proven regression back to green after this line.
export const dynamicParams = false

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug as ProjectSlug)

  if (!project) {
    return { title: 'Project not found' }
  }

  // Bare title: the root layout's `title.template` appends the site name, so
  // repeating it here rendered "FastEV — Shahrul Saifuddin — Shahrul Saifuddin".
  // `socialTitle` stays fully qualified — an Open Graph title appears alone in
  // a shared card and no template is applied to it.
  const title = project.name
  const socialTitle = `${project.name} — ${siteConfig.name}`
  const description = `${project.subtitle}. ${project.role}.`

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
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
    <Container as="div" className="pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-32">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to projects
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
      <header className="max-w-3xl">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="animate-led size-1.5 rounded-full bg-brand" />
          {project.status}
        </span>

        <h1 className="font-display-wide mt-6 text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-extrabold">
          {project.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">{project.subtitle}</p>

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

      {HAS_VISUAL.has(project.slug) ? (
        <div className="hidden h-80 lg:block">
          <ProjectVisual slug={project.slug} />
        </div>
      ) : null}
      </div>

      <div className="mt-14">
        <MetricRail metrics={project.metrics} countUp />
      </div>

      <section className="mt-24" aria-labelledby="what-i-built-heading">
        <h2
          id="what-i-built-heading"
          className="font-display-wide text-[clamp(1.75rem,4vw,3rem)] leading-none font-bold"
        >
          What I built
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {project.highlights.map((highlight, i) => (
            <li
              key={highlight}
              className="relative rounded-2xl border border-border bg-card/60 p-6 pt-14 leading-relaxed text-muted-foreground sm:p-8 sm:pt-16"
            >
              <span
                aria-hidden="true"
                className="absolute top-5 left-6 font-mono text-[11px] tracking-[0.2em] text-brand sm:left-8"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {highlight}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24" aria-labelledby="tech-stack-heading">
        <h2
          id="tech-stack-heading"
          className="font-display-wide text-[clamp(1.75rem,4vw,3rem)] leading-none font-bold"
        >
          Tech stack
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background/60 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <nav aria-label="More projects" className="mt-28 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        <Link
          href={`/projects/${previousProject.slug}`}
          className="group rounded-2xl border border-border p-6 transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:p-8"
        >
          <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Previous
          </span>
          <span className="font-display-wide mt-3 block text-2xl font-bold transition-colors group-hover:text-brand sm:text-3xl">
            {previousProject.name}
          </span>
        </Link>
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group rounded-2xl border border-border p-6 text-right transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:p-8"
        >
          <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Next
            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="font-display-wide mt-3 block text-2xl font-bold transition-colors group-hover:text-brand sm:text-3xl">
            {nextProject.name}
          </span>
        </Link>
      </nav>
    </Container>
  )
}
