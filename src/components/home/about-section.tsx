import { FadeIn } from '@/components/home/fade-in'
import { AnimatedText } from '@/components/home/animated-text'
import { ContactButton, OutlineButton } from '@/components/home/buttons'
import { heroMetrics, profile } from '@/lib/data/profile'

const ASSET_BASE =
  'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7'

// Purely decorative 3D shapes — part of the visual design, not content.
const DECOR = [
  {
    src: `${ASSET_BASE}/moon_icon.11395d36.png`,
    className: 'top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    src: `${ASSET_BASE}/p59_1.4659672e.png`,
    className:
      'bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    src: `${ASSET_BASE}/lego_icon-1.703bb594.png`,
    className:
      'top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    src: `${ASSET_BASE}/Group_134-1.2e04f3ce.png`,
    className:
      'bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
] as const

export function AboutSection(): React.ReactElement {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-32 sm:px-8 md:px-10"
    >
      {DECOR.map((item) => (
        <FadeIn
          key={item.src}
          delay={item.delay}
          x={item.x}
          y={0}
          duration={0.9}
          className={`pointer-events-none absolute opacity-60 md:opacity-100 ${item.className}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt="" loading="lazy" className="block w-full" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            delay={0}
            y={40}
            className="hero-heading text-center leading-none font-black tracking-tight uppercase"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </FadeIn>
          <AnimatedText
            text={profile.summary}
            className="max-w-[640px] text-center leading-relaxed font-medium text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <dl className="grid w-full max-w-4xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {heroMetrics.map((metric, i) => (
            <FadeIn key={metric.label} delay={i * 0.1} className="flex flex-col items-center gap-2">
              <dt className="sr-only">{metric.label}</dt>
              <dd
                className="hero-heading leading-none font-black"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                {metric.value}
              </dd>
              <dd
                aria-hidden
                className="max-w-[200px] text-center text-xs leading-snug font-light tracking-wide text-[#D7E2EA]/70 uppercase sm:text-sm"
              >
                {metric.label}
              </dd>
            </FadeIn>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <ContactButton />
          <OutlineButton href={profile.resumeUrl}>Resume</OutlineButton>
        </div>
      </div>
    </section>
  )
}
