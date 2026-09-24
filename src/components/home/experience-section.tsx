import { FadeIn } from '@/components/home/fade-in'
import { experience } from '@/lib/data/experience'

export function ExperienceSection(): React.ReactElement {
  return (
    <section
      id="experience"
      className="rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="mb-16 text-center leading-none font-black tracking-tight uppercase sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Experience
      </FadeIn>

      <ul className="mx-auto max-w-5xl">
        {experience.map((job, i) => (
          <FadeIn
            as="li"
            key={job.company}
            delay={i * 0.1}
            className="flex items-start gap-6 border-b py-8 first:border-t sm:gap-10 sm:py-10 md:gap-14 md:py-12"
            style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
          >
            <span
              className="shrink-0 leading-none font-black"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 md:gap-3">
              <h3
                className="font-medium uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {job.role}
              </h3>
              <p
                className="font-normal tracking-wide uppercase opacity-80"
                style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}
              >
                {job.company} · {job.location} · {job.period}
              </p>
              <ul
                className="flex max-w-2xl flex-col gap-2 leading-relaxed font-light opacity-60"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  )
}
