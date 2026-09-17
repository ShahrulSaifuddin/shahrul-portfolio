'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Thin wrapper over `next-themes`. Mounted once in the root layout around
 * `<body>`'s children so any client component can call `useTheme()`.
 */
export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
