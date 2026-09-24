import type { Metadata } from 'next'

import { HeroSection } from '@/components/home/hero-section'
import { MarqueeSection } from '@/components/home/marquee-section'
import { AboutSection } from '@/components/home/about-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function Home() {
  return (
    <div className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
    </div>
  )
}
