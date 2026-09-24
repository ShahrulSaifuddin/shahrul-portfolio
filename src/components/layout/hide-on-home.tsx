'use client'

import { usePathname } from 'next/navigation'

/** Renders its children everywhere except the given paths (default: `/`, which draws its own nav). */
export function HideOnHome({
  children,
  paths = ['/'],
}: {
  children: React.ReactNode
  paths?: readonly string[]
}): React.ReactNode {
  return paths.includes(usePathname()) ? null : children
}
