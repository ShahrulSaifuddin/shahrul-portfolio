import Image from 'next/image'
import { FadeIn } from '@/components/home/fade-in'
import { Magnet } from '@/components/home/magnet'
import { ContactButton } from '@/components/home/buttons'
import { SiteNav } from '@/components/layout/site-nav'
import { profile } from '@/lib/data/profile'

export function HeroSection(): React.ReactElement {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <SiteNav />

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full text-center text-[11.5vw] leading-none font-black tracking-tight whitespace-nowrap uppercase sm:mt-4 sm:text-[12vw] md:-mt-5 md:text-[12.5vw] lg:text-[13vw]"
        >
          Hi, i&apos;m shahrul
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] leading-snug font-light tracking-wide text-[#D7E2EA] uppercase sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          a {profile.title.toLowerCase()} shipping production mobile and web systems
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <FadeIn
        delay={0.6}
        y={30}
        className="absolute top-1/2 left-1/2 z-10 w-[220px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[280px] sm:translate-y-0 md:w-[340px] lg:w-[400px]"
      >
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <Image
            src="/images/profile.jpg"
            alt={`Portrait of ${profile.displayName}`}
            width={800}
            height={800}
            priority
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 340px, (min-width: 640px) 280px, 220px"
            className="block aspect-[4/5] w-full rounded-t-full rounded-b-[40px] object-cover object-top sm:rounded-b-none"
          />
        </Magnet>
      </FadeIn>
    </section>
  )
}
