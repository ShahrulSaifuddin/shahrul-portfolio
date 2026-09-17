import { profile } from '@/lib/data/profile'
import type { ContactFormValues } from '@/lib/validation'

export interface SendContactEmailResult {
  ok: boolean
  /** True when no send was attempted because RESEND_API_KEY is unset. */
  skipped?: boolean
}

type ContactPayload = Pick<ContactFormValues, 'name' | 'email' | 'subject' | 'message'>

/**
 * Sends a contact-form submission via Resend.
 *
 * The Resend client is constructed lazily, INSIDE this function body, and
 * only after confirming `RESEND_API_KEY` exists. It must never be
 * constructed at module scope (e.g. `const resend = new Resend(...)` as a
 * top-level `const`) — that would throw the moment this module is imported,
 * which would break `next build` and every request whenever the key is
 * absent. A portfolio site with zero env vars set must still build and run.
 */
export async function sendContactEmail(data: ContactPayload): Promise<SendContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[contact] RESEND_API_KEY is not set — email was not sent. Submission payload:',
        data
      )
    }
    return { ok: false, skipped: true }
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const fromAddress = process.env.CONTACT_FROM_EMAIL ?? 'Portfolio Contact <onboarding@resend.dev>'

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: profile.email,
    replyTo: data.email,
    subject: `[Portfolio contact] ${data.subject}`,
    text: `New message from the portfolio contact form.\n\nName: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  })

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[contact] Resend returned an error:', error)
    }
    return { ok: false }
  }

  return { ok: true }
}
