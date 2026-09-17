import { test, expect } from '@playwright/test'

test.describe('Theme toggle', () => {
  test('toggling switches the dark class on <html> and survives a reload', async ({ page }) => {
    await page.goto('/')

    const toggle = page.getByRole('button', { name: /Switch to (light|dark) theme/ })
    await expect(toggle).toBeVisible()

    const html = page.locator('html')
    const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false

    await toggle.click()

    if (initiallyDark) {
      await expect(html).not.toHaveClass(/dark/)
    } else {
      await expect(html).toHaveClass(/dark/)
    }

    const nowDark = !initiallyDark

    await page.reload()

    if (nowDark) {
      await expect(html).toHaveClass(/dark/)
    } else {
      await expect(html).not.toHaveClass(/dark/)
    }
  })
})
