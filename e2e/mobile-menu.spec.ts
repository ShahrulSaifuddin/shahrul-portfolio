import { test, expect } from '@playwright/test'

test.describe('Mobile menu', () => {
  test('the hamburger opens the sheet, a link navigates and closes it', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await expect(trigger).toBeVisible()
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('link', { name: 'Projects', exact: true }).click()

    await expect(page).toHaveURL(/\/projects$/)
    await expect(dialog).not.toBeVisible()
  })

  test('Escape closes the menu', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Open menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(dialog).not.toBeVisible()
  })
})
