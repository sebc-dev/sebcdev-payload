import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

import frMessages from '../../messages/fr.json' with { type: 'json' }

/**
 * Design System E2E Tests
 *
 * Validates the "Anthracite & Vert Canard" design system implementation:
 * - Visual correctness (brand colors, typography)
 * - Accessibility compliance (WCAG 2.1 AA via axe-core)
 * - Dark mode configuration
 * - Admin panel isolation
 *
 * @see docs/specs/UX_UI_Spec.md Section 7: Design System
 */
test.describe('Design System', () => {
  test.describe('Visual Validation', () => {
    test('homepage displays correct anthracite background', async ({ page }) => {
      await page.goto('/fr')

      // Verify background color is anthracite (#1A1D23 = rgb(26, 29, 35))
      const body = page.locator('body')
      await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')
    })

    test('primary text uses correct off-white foreground', async ({ page }) => {
      await page.goto('/fr')

      // Check main heading color - off-white (hsl(210, 40%, 98%) ≈ rgb(248, 250, 252))
      const h1 = page.locator('h1').first()
      await expect(h1).toHaveCSS('color', 'rgb(248, 250, 252)')
    })

    test('primary button uses teal accent', async ({ page }) => {
      await page.goto('/fr')

      // Check primary button background (teal hsl(174, 72%, 40%) ≈ rgb(29, 175, 161))
      // Use localized button name from i18n resources
      const button = page
        .getByRole('button', { name: frMessages.components.buttons.variant.default })
        .first()
      await expect(button).toHaveCSS('background-color', 'rgb(29, 175, 161)')
    })
  })

  test.describe('Typography', () => {
    test('headings use Nunito Sans font', async ({ page }) => {
      await page.goto('/fr')

      const h1 = page.locator('h1').first()
      const fontFamily = await h1.evaluate((el) => window.getComputedStyle(el).fontFamily)

      // Nunito Sans should be in the font stack
      expect(fontFamily.toLowerCase()).toContain('nunito')
    })

    test('code elements use JetBrains Mono font', async ({ page }) => {
      await page.goto('/fr')

      const code = page.locator('code').first()

      // Ensure at least one code element exists - fail explicitly if missing
      // The homepage should always have a <code> element in the "edit this page" section
      expect(await code.count()).toBeGreaterThan(0)

      const fontFamily = await code.evaluate((el) => window.getComputedStyle(el).fontFamily)

      // JetBrains Mono should be in the font stack
      expect(fontFamily.toLowerCase()).toContain('jetbrains')
    })
  })

  test.describe('Accessibility', () => {
    test('homepage FR passes axe-core WCAG 2.1 AA audit', async ({ page }) => {
      await page.goto('/fr')

      const accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      // Log violations for debugging if any exist
      if (accessibilityResults.violations.length > 0) {
        console.log(
          'Accessibility violations:',
          JSON.stringify(accessibilityResults.violations, null, 2),
        )
      }

      expect(accessibilityResults.violations).toHaveLength(0)
    })

    test('homepage EN passes axe-core WCAG 2.1 AA audit', async ({ page }) => {
      await page.goto('/en')

      const accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      // Log violations for debugging if any exist
      if (accessibilityResults.violations.length > 0) {
        console.log(
          'Accessibility violations:',
          JSON.stringify(accessibilityResults.violations, null, 2),
        )
      }

      expect(accessibilityResults.violations).toHaveLength(0)
    })

    test('focus rings are visible on interactive elements', async ({ page }) => {
      await page.goto('/fr')

      // Tab to first focusable element
      await page.keyboard.press('Tab')

      // Ensure an element received focus - fail explicitly if nothing is focusable
      const focusedElement = page.locator(':focus')
      expect(await focusedElement.count()).toBeGreaterThan(0)

      const boxShadow = await focusedElement.evaluate((el) => window.getComputedStyle(el).boxShadow)

      // Should have visible focus indicator (box-shadow from :focus-visible)
      // The focus ring uses box-shadow, not outline
      expect(boxShadow).not.toBe('none')
    })
  })

  test.describe('Dark Mode', () => {
    test('html element has dark color-scheme', async ({ page }) => {
      await page.goto('/fr')

      const html = page.locator('html')
      await expect(html).toHaveCSS('color-scheme', 'dark')
    })

    test('CSS variables are correctly defined', async ({ page }) => {
      await page.goto('/fr')

      // Check that --background CSS variable is set
      const bgVariable = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
      })

      // Should be HSL value for anthracite
      expect(bgVariable).toContain('hsl')
    })
  })
})

test.describe('Admin Panel Isolation', () => {
  test('admin panel loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/admin')

    // Should redirect to login or show admin UI
    await expect(page).toHaveURL(/\/admin/)

    await page.waitForLoadState('networkidle')

    // Filter out expected errors (like auth-related)
    const unexpectedErrors = errors.filter(
      (e) => !e.includes('401') && !e.includes('authentication') && !e.includes('Unauthorized'),
    )

    expect(unexpectedErrors).toHaveLength(0)
  })

  test('admin panel uses its own styles (not frontend theme)', async ({ page }) => {
    await page.goto('/admin')

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Admin should NOT have our custom anthracite background (#1A1D23)
    // because admin panel has isolated styles
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor)

    // Admin panel uses Payload's own styling, not our dark theme
    expect(bgColor).not.toBe('rgb(26, 29, 35)')
  })
})
