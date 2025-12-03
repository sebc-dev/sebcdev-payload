import { expect, test } from '@playwright/test'

/**
 * Frontend E2E Tests
 *
 * Tests for the public-facing frontend pages.
 * Uses the new design system (Anthracite & Vert Canard theme).
 */
test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('/fr')

    await expect(page).toHaveTitle(/sebc\.dev/)

    const heading = page.locator('h1').first()
    await expect(heading).toHaveText(/Welcome/)
  })

  test('homepage has correct brand colors', async ({ page }) => {
    await page.goto('/fr')

    // Verify the page uses anthracite background
    const body = page.locator('body')
    await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')

    // Verify heading uses off-white text
    const heading = page.locator('h1').first()
    await expect(heading).toHaveCSS('color', 'rgb(248, 250, 252)')
  })

  test('locale switching works', async ({ page }) => {
    // French homepage
    await page.goto('/fr')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')

    // English homepage
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})
