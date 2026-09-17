import { test, expect } from '@playwright/test'

const VALID_PAYLOAD = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  subject: 'Hello there',
  message: 'This message is definitely long enough to pass the minimum length check.',
  honeypot: '',
}

test.describe('POST /api/contact', () => {
  test('an invalid payload returns 400 with field errors', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { name: '', email: 'not-an-email', subject: '', message: 'too short' },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(body.fieldErrors).toBeTruthy()
    expect(body.fieldErrors.name).toBeTruthy()
    expect(body.fieldErrors.email).toBeTruthy()
    expect(body.fieldErrors.subject).toBeTruthy()
    expect(body.fieldErrors.message).toBeTruthy()
  })

  test('a filled honeypot is silently accepted with 200, bot not told it was caught', async ({
    request,
  }) => {
    const response = await request.post('/api/contact', {
      data: { ...VALID_PAYLOAD, honeypot: 'I am a bot filling every field' },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.ok).toBe(true)
  })

  test('a valid payload returns 503 when no RESEND_API_KEY is configured', async ({ request }) => {
    // This environment intentionally has no RESEND_API_KEY set (see
    // playwright.config.ts) — the route's designed fallback is a 503 with a
    // clear error, not a crash or a false 200.
    const response = await request.post('/api/contact', { data: VALID_PAYLOAD })

    expect(response.status()).toBe(503)
    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(body.error).toBe(
      'Email delivery is not configured on this deployment yet. Please reach out directly by email instead.'
    )
  })
})
