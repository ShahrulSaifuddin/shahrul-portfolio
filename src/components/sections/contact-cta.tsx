import Link from 'next/link'
import { Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { GitHubIcon } from '@/components/layout/icons'
import { Reveal } from '@/components/motion/reveal'
import { profile } from '@/lib/data/profile'

export function ContactCta() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeader
          id="contact"
          eyebrow="Get in touch"
          title="Start a conversation"
          description="Questions about a role, a project, or one of the systems above — email or GitHub, both direct."
          align="center"
        />

        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center">
            <Button asChild size="lg">
              <Link href="/contact">
                <Mail aria-hidden="true" />
                Get in Touch
              </Link>
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Mail aria-hidden="true" className="size-4" />
                {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <GitHubIcon className="size-4" />
                GitHub
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
