import { z } from 'zod'

/**
 * Single source of truth for the contact form shape. Imported by BOTH the
 * client form (`ContactForm`, via `zodResolver`) and the API route
 * (`POST /api/contact`) so client and server validation can never drift.
 *
 * `honeypot` is intentionally left unconstrained here (a bot trap, not a
 * public-facing field) — the API route decides what to do when it is
 * non-empty, rather than surfacing a validation error that would tip a bot
 * off that it was detected.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your full name (at least 2 characters).')
    .max(80, 'Name must be 80 characters or fewer.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .max(160, 'Email must be 160 characters or fewer.')
    .email('Enter a valid email address.'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters.')
    .max(120, 'Subject must be 120 characters or fewer.'),
  message: z
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters.')
    .max(4000, 'Message must be 4000 characters or fewer.'),
  /** Must stay empty. Filled in only by bots that auto-fill every field. */
  honeypot: z.string().max(200).optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export interface ContactApiSuccess {
  ok: true
}

export interface ContactApiError {
  ok: false
  error: string
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>
}

export type ContactApiResponse = ContactApiSuccess | ContactApiError
