import { test, expect } from '@playwright/test'

test.describe('Contact form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('submitting empty shows validation errors', async ({ page }) => {
    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByText('Enter your full name (at least 2 characters).')).toBeVisible()
    await expect(page.getByText('Enter your email address.')).toBeVisible()
    await expect(page.getByText('Subject must be at least 3 characters.')).toBeVisible()
    await expect(page.getByText('Message must be at least 20 characters.')).toBeVisible()
  })

  test('an invalid email is rejected', async ({ page }) => {
    await page.getByLabel('Name').fill('Jane Doe')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Subject').fill('Hello there')
    await page
      .getByLabel('Message')
      .fill('This message is definitely long enough to pass the minimum length check.')

    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  })

  test('a too-short message is rejected', async ({ page }) => {
    await page.getByLabel('Name').fill('Jane Doe')
    await page.getByLabel('Email').fill('jane@example.com')
    await page.getByLabel('Subject').fill('Hello there')
    await page.getByLabel('Message').fill('Too short')

    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByText('Message must be at least 20 characters.')).toBeVisible()
  })

  test('a valid submission fails gracefully with no RESEND_API_KEY configured', async ({
    page,
  }) => {
    // This environment intentionally has no RESEND_API_KEY set (see
    // playwright.config.ts). POST /api/contact must therefore return 503,
    // and the UI must surface a clear failure message via the status live
    // region rather than hang, crash, or claim success.
    await page.getByLabel('Name').fill('Jane Doe')
    await page.getByLabel('Email').fill('jane@example.com')
    await page.getByLabel('Subject').fill('Hello there')
    await page
      .getByLabel('Message')
      .fill('This message is definitely long enough to pass the minimum length check.')

    const responsePromise = page.waitForResponse('/api/contact')
    await page.getByRole('button', { name: 'Send message' }).click()
    const response = await responsePromise

    expect(response.status()).toBe(503)

    const status = page.getByRole('status')
    await expect(status).toHaveText(
      'Email delivery is not configured on this deployment yet. Please reach out directly by email instead.'
    )
  })
})
