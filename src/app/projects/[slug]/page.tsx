import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { FadeIn } from '@/components/home/fade-in'
import { OutlineButton } from '@/components/home/buttons'
import { getProjectBySlug, projects } from '@/lib/data/projects'
import { siteConfig } from '@/lib/site'
import type { ProjectSlug } from '@/lib/types'

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

const LABEL = 'text-xs font-light uppercase tracking-[0.3em] text-muted-foreground'
const PANEL =
  'rounded-[40px] border-2 border-[#D7E2EA]/20 bg-card p-6 sm:rounded-[50px] sm:p-10 md:rounded-[60px] md:p-12'

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug as ProjectSlug)

  if (!project) {
    notFound()
  }

  const currentIndex = projects.findIndex((candidate) => candidate.slug === project.slug)
  const previousProject = projects[(currentIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const facts = [
    { label: 'Role', value: project.role },
    { label: 'Period', value: project.period },
    ...(project.company ? [{ label: 'Company', value: project.company }] : []),
    ...(project.client ? [{ label: 'Client', value: project.client }] : []),
  ]

  return (
    <Container as="div" className="pt-12 pb-24 sm:pt-16 sm:pb-32">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-sm text-sm font-medium tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to projects
      </Link>

      <header className="mt-10 flex flex-col items-center gap-6 text-center">
        <span className="text-muted-foreground inline-flex w-fit items-center rounded-full border border-[#D7E2EA]/30 px-4 py-1.5 text-xs tracking-widest uppercase">
          {project.status}
        </span>
        <FadeIn
          as="h1"
          y={40}
          className="hero-heading leading-none font-black tracking-tight uppercase"
          style={{ fontSize: 'clamp(2.75rem, 10vw, 140px)' }}
        >
          {project.name}
        </FadeIn>
        <p className="text-foreground/80 font-light tracking-wide uppercase sm:text-lg">
          {project.subtitle}
        </p>

        {/* SD Engage ships with an empty `links` array (no store or
            case-study URL was supplied) — this block simply renders nothing
            for it, so the header layout stays intact without a broken or
            empty-looking link row. */}
        {project.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {project.links.map((link) => (
              <OutlineButton key={link.href} href={link.href}>
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </OutlineButton>
            ))}
          </div>
        )}
      </header>

      <dl className="border-border mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 border-y py-8 text-center sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className={LABEL}>{fact.label}</dt>
            <dd className="mt-2 font-medium tracking-wide uppercase">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14">
        <MetricRail metrics={project.metrics} countUp />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section className={PANEL} aria-labelledby="what-i-built-heading">
          <h2
            id="what-i-built-heading"
            className="hero-heading leading-none font-black tracking-tight uppercase"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            What I built
          </h2>
          <ul className="mt-8 flex flex-col gap-5">
            {project.highlights.map((highlight, i) => (
              <li
                key={highlight}
                className="border-border text-foreground/85 flex gap-5 border-b pb-5 leading-relaxed font-light last:border-0 last:pb-0 sm:text-lg"
              >
                <span className="text-muted-foreground font-black">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <section className={PANEL} aria-labelledby="tech-stack-heading">
          <h2
            id="tech-stack-heading"
            className="hero-heading leading-none font-black tracking-tight uppercase"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Tech stack
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#D7E2EA]/30 px-4 py-1.5 text-sm tracking-wide uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>

      <nav aria-label="More projects" className="mt-16 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/projects/${previousProject.slug}`}
          className="group focus-visible:ring-ring focus-visible:ring-offset-background rounded-[40px] border-2 border-[#D7E2EA]/20 p-6 transition-colors hover:border-[#D7E2EA] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-8"
        >
          <span className={`flex items-center gap-2 ${LABEL}`}>
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Previous
          </span>
          <span className="mt-3 block text-xl font-medium uppercase sm:text-2xl">
            {previousProject.name}
          </span>
        </Link>
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group focus-visible:ring-ring focus-visible:ring-offset-background rounded-[40px] border-2 border-[#D7E2EA]/20 p-6 text-right transition-colors hover:border-[#D7E2EA] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-8"
        >
          <span className={`flex items-center justify-end gap-2 ${LABEL}`}>
            Next
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
          <span className="mt-3 block text-xl font-medium uppercase sm:text-2xl">
            {nextProject.name}
          </span>
        </Link>
      </nav>
    </Container>
  )
}
