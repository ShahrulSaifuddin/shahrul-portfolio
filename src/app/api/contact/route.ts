import { NextResponse } from 'next/server'

import { sendContactEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
import { contactSchema, type ContactApiResponse } from '@/lib/validation'

export const runtime = 'nodejs'

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const [first] = forwardedFor.split(',')
    if (first && first.trim().length > 0) return first.trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}

export async function POST(request: Request): Promise<NextResponse<ContactApiResponse>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'The request body could not be read. Please try again.' },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please fix the highlighted fields and try again.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const { honeypot, name, email, subject, message } = parsed.data

  // A filled honeypot means a bot auto-filled every field. Accept silently
  // and do nothing further — never reveal that the trap was tripped.
  if (honeypot && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(`contact:${ip}`)
  if (!rateLimit.ok) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { ok: false, error: 'Too many messages sent recently. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    )
  }

  const result = await sendContactEmail({ name, email, subject, message })

  if (result.skipped) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Email delivery is not configured on this deployment yet. Please reach out directly by email instead.',
      },
      { status: 503 }
    )
  }

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: 'The message could not be sent right now. Please try again shortly.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
