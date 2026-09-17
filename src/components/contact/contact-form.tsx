'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

type SubmitStatus = {
  kind: 'idle' | 'success' | 'error'
  message: string
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
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  })

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
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
        />
        {errors.name ? (
          <p id="contact-name-error" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p id="contact-email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          autoComplete="off"
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          {...register('subject')}
        />
        {errors.subject ? (
          <p id="contact-subject-error" className="text-xs text-destructive">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: invisible and unreachable by keyboard/AT for humans, but
          present in the DOM and auto-filled by most naive form-filling bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
      </div>

      <div className="flex items-center gap-4 pt-1">
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </div>

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
    </form>
  )
}
