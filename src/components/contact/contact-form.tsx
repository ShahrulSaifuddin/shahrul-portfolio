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
import { contactSchema, type ContactApiResponse, type ContactFormValues } from '@/lib/validation'

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
      const errorMessage = 'Could not reach the server. Check your connection and try again.'
      setStatus({ kind: 'error', message: errorMessage })
      toast.error(errorMessage)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-1.5">
        <Label
          className="text-xs font-light tracking-[0.3em] text-[#0C0C0C]/70 uppercase"
          htmlFor="contact-name"
        >
          Name
        </Label>
        <Input
          className="aria-invalid:border-destructive h-14 rounded-none border-0 border-b-2 border-[#0C0C0C]/50 bg-transparent px-0 text-lg text-[#0C0C0C] shadow-none focus-visible:border-[#0C0C0C] focus-visible:ring-0 md:text-lg dark:bg-transparent dark:aria-invalid:ring-0"
          id="contact-name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
        />
        {errors.name ? (
          <p id="contact-name-error" className="text-destructive text-xs">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-xs font-light tracking-[0.3em] text-[#0C0C0C]/70 uppercase"
          htmlFor="contact-email"
        >
          Email
        </Label>
        <Input
          className="aria-invalid:border-destructive h-14 rounded-none border-0 border-b-2 border-[#0C0C0C]/50 bg-transparent px-0 text-lg text-[#0C0C0C] shadow-none focus-visible:border-[#0C0C0C] focus-visible:ring-0 md:text-lg dark:bg-transparent dark:aria-invalid:ring-0"
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p id="contact-email-error" className="text-destructive text-xs">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-xs font-light tracking-[0.3em] text-[#0C0C0C]/70 uppercase"
          htmlFor="contact-subject"
        >
          Subject
        </Label>
        <Input
          className="aria-invalid:border-destructive h-14 rounded-none border-0 border-b-2 border-[#0C0C0C]/50 bg-transparent px-0 text-lg text-[#0C0C0C] shadow-none focus-visible:border-[#0C0C0C] focus-visible:ring-0 md:text-lg dark:bg-transparent dark:aria-invalid:ring-0"
          id="contact-subject"
          autoComplete="off"
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          {...register('subject')}
        />
        {errors.subject ? (
          <p id="contact-subject-error" className="text-destructive text-xs">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-xs font-light tracking-[0.3em] text-[#0C0C0C]/70 uppercase"
          htmlFor="contact-message"
        >
          Message
        </Label>
        <Textarea
          className="aria-invalid:border-destructive min-h-40 rounded-none border-0 border-b-2 border-[#0C0C0C]/50 bg-transparent px-0 py-3 text-lg text-[#0C0C0C] shadow-none focus-visible:border-[#0C0C0C] focus-visible:ring-0 md:text-lg dark:bg-transparent dark:aria-invalid:ring-0"
          id="contact-message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-destructive text-xs">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: invisible and unreachable by keyboard/AT for humans, but
          present in the DOM and auto-filled by most naive form-filling bots. */}
      <div
        aria-hidden="true"
        className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('honeypot')}
        />
      </div>

      <div className="flex items-center gap-4 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-auto min-w-44 rounded-full px-10 py-3.5 text-sm font-medium tracking-widest text-white uppercase outline-2 -outline-offset-3 outline-white outline-solid"
          style={{
            background:
              'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
            boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
          }}
        >
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
          status.kind === 'success' && 'text-[#7621B0]'
        )}
      >
        {status.message}
      </p>
    </form>
  )
}
