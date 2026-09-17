import { test, expect } from '@playwright/test'

test.describe('Keyboard accessibility', () => {
  test('Tab from the top of the page focuses "Skip to content" first, and activating it moves focus to main', async ({
    page,
  }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')

    const skipLink = page.getByRole('link', { name: 'Skip to content' })
    await expect(skipLink).toBeFocused()

    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/#main$/)
    await expect(page.locator('#main')).toBeFocused()
  })
})
