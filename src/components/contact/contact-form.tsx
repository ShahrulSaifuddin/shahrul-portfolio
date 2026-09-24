'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowUpRight, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  contactSchema,
  type ContactApiResponse,
  type ContactFormValues,
} from '@/lib/validation'

const DEFAULT_VALUES: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  honeypot: '',
}

// Mirrors the schema's minimum (see src/lib/validation.ts) for the meter only;
// validation itself is still entirely `contactSchema`.
const MESSAGE_MIN = 20

type SubmitStatus = {
  kind: 'idle' | 'success' | 'error'
  message: string
}

const FIELD =
  'block w-full rounded-xl border border-input bg-background/70 px-4 py-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--glow)] aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:shadow-none'

function FieldLabel({ index, htmlFor, children }: { index: string; htmlFor: string; children: string }) {
  return (
    <div className="mb-2 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
      <span aria-hidden="true" className="text-brand">
        {index}
      </span>
      <label htmlFor={htmlFor}>{children}</label>
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
      <span aria-hidden="true">↳</span>
      {message}
    </p>
  )
}

/**
 * Contact form: react-hook-form + zodResolver sharing `contactSchema` with
 * `POST /api/contact`, so client and server validation can never drift.
 * `'use client'` because it needs form state, focus management and a
 * live-updating submit/result status.
 */
export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle', message: '' })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  })

  const messageLength = watch('message')?.length ?? 0
  const charge = Math.min(1, messageLength / MESSAGE_MIN)

  const onSubmit = async (values: ContactFormValues) => {
    setStatus({ kind: 'idle', message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = (await response.json()) as ContactApiResponse

      if (response.ok && data.ok) {
        const successMessage = "Message sent. I'll reply to you directly by email."
        setStatus({ kind: 'success', message: successMessage })
        toast.success(successMessage)
        reset(DEFAULT_VALUES)
        return
      }

      const errorMessage =
        !data.ok && data.error ? data.error : 'Something went wrong. Please try again.'
      setStatus({ kind: 'error', message: errorMessage })
      toast.error(errorMessage)
    } catch {
      const errorMessage =
        'Could not reach the server. Check your connection and try again.'
      setStatus({ kind: 'error', message: errorMessage })
      toast.error(errorMessage)
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/60 shadow-[0_40px_120px_-60px_var(--brand)] backdrop-blur-sm">
      {/* Console chrome — decorative. */}
      <div aria-hidden="true" className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-5 py-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-brand" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
          POST /api/contact
        </span>
        <span className="hidden font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase sm:inline">
          new_message
        </span>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="relative space-y-6 p-5 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel index="01" htmlFor="contact-name">
              Name
            </FieldLabel>
            <input
              id="contact-name"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={FIELD}
              {...register('name')}
            />
            <FieldError id="contact-name-error" message={errors.name?.message} />
          </div>

          <div>
            <FieldLabel index="02" htmlFor="contact-email">
              Email
            </FieldLabel>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={FIELD}
              {...register('email')}
            />
            <FieldError id="contact-email-error" message={errors.email?.message} />
          </div>
        </div>

        <div>
          <FieldLabel index="03" htmlFor="contact-subject">
            Subject
          </FieldLabel>
          <input
            id="contact-subject"
            autoComplete="off"
            placeholder="Full-stack role, a project, a question…"
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            className={FIELD}
            {...register('subject')}
          />
          <FieldError id="contact-subject-error" message={errors.subject?.message} />
        </div>

        <div>
          <FieldLabel index="04" htmlFor="contact-message">
            Message
          </FieldLabel>
          <textarea
            id="contact-message"
            rows={7}
            placeholder="What are you building, and where could I help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={cn(FIELD, 'resize-y')}
            {...register('message')}
          />
          {/* Charge meter: fills to the schema's minimum length. Visual only —
              the real rule and its error message come from contactSchema. */}
          <div aria-hidden="true" className="mt-2 flex items-center gap-3">
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  'block h-full rounded-full transition-[width,background-color] duration-300',
                  charge >= 1 ? 'bg-brand shadow-[0_0_10px_var(--brand)]' : 'bg-muted-foreground/50'
                )}
                style={{ width: `${charge * 100}%` }}
              />
            </span>
            <span className={cn('font-mono text-[11px] tabular-nums', charge >= 1 ? 'text-brand' : 'text-muted-foreground')}>
              {messageLength}/{MESSAGE_MIN}+
            </span>
          </div>
          <FieldError id="contact-message-error" message={errors.message?.message} />
        </div>

        {/* Honeypot: invisible and unreachable by keyboard/AT for humans, but
            present in the DOM and auto-filled by most naive form-filling bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p
            role="status"
            aria-live="polite"
            className={cn(
              'min-h-5 text-sm',
              status.kind === 'error' && 'text-destructive',
              status.kind === 'success' && 'text-brand'
            )}
          >
            {status.message}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            data-cursor="Send"
            className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-[0_0_0_1px_var(--brand),0_10px_40px_-10px_var(--brand)] transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send message
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
