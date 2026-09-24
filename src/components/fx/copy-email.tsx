'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

/** Email pill that copies to the clipboard, falling back to `mailto:`. */
export function CopyEmail({ email }: { email: string }): React.ReactElement {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success('Email copied to clipboard')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="Copy"
      className="group inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-background/60 py-2 pr-2 pl-5 font-mono text-sm backdrop-blur transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="truncate">{email}</span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
        {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
      </span>
      <span className="sr-only">{copied ? 'Copied' : 'Copy email address'}</span>
    </button>
  )
}
