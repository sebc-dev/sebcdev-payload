import { expect, test } from '@playwright/test'

import frMessages from '../../messages/fr.json' with { type: 'json' }

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

    // Use localized string from i18n resources to avoid hardcoded English regex
    const heading = page.locator('h1').first()
    await expect(heading).toContainText(frMessages.home.welcome)
  })

  test('homepage uses design system CSS variables', async ({ page }) => {
    await page.goto('/fr')

    // Verify CSS custom properties are defined on :root
    // This decouples tests from specific RGB values - palette changes won't break tests
    const root = page.locator(':root')

    // Check that --background variable is defined (anthracite theme)
    const backgroundVar = await root.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--background').trim(),
    )
    expect(backgroundVar).toBeTruthy()

    // Check that --foreground variable is defined (off-white text)
    const foregroundVar = await root.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--foreground').trim(),
    )
    expect(foregroundVar).toBeTruthy()

    // Verify body uses the background variable (not a hardcoded color)
    const body = page.locator('body')
    const bodyBgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bodyBgColor).not.toBe('rgba(0, 0, 0, 0)') // Not transparent
    expect(bodyBgColor).not.toBe('rgb(255, 255, 255)') // Not default white
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
