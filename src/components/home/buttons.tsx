import Link from 'next/link'

export function ContactButton({ href = '/contact' }: { href?: string }): React.ReactElement {
  return (
    <Link
      href={href}
      className="inline-block rounded-full px-8 py-3 text-xs font-medium tracking-widest text-white uppercase outline-2 -outline-offset-3 outline-white transition-transform duration-200 outline-solid hover:scale-[1.03] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      }}
    >
      Contact Me
    </Link>
  )
}

/** Ghost pill button. External hrefs open in a new tab. */
export function OutlineButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}): React.ReactElement {
  const external = /^https?:\/\//.test(href) || href.endsWith('.pdf')
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="inline-block rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium tracking-widest text-[#D7E2EA] uppercase transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      {children}
    </Link>
  )
}
