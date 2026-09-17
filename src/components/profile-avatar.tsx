'use client'

import * as React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

const AVATAR_SRC = '/images/profile.jpg'

/**
 * Hero LCP candidate. Renders the profile photo when present; degrades to an
 * "SS" monogram on a `--brand-muted` field when the file is missing or fails
 * to load, at the same fixed size, so nothing shifts either way.
 */
export function ProfileAvatar({
  size = 176,
  initials,
  name,
  className,
}: {
  size?: number
  initials: string
  name: string
  className?: string
}) {
  const [errored, setErrored] = React.useState(false)

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full ring-1 ring-border',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {!errored ? (
        <Image
          src={AVATAR_SRC}
          alt={`Portrait of ${name}`}
          width={size}
          height={size}
          priority
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={`Portrait of ${name}`}
          className="flex size-full items-center justify-center bg-brand-muted"
        >
          <span className="font-mono text-2xl font-semibold tracking-tight text-brand">
            {initials}
          </span>
        </div>
      )}
    </div>
  )
}
