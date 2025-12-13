import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
  test.describe('Typography', () => {
    test('headings use Nunito Sans font', async ({ page }) => {
      await page.goto('/fr')

      const h1 = page.locator('h1').first()
      const fontFamily = await h1.evaluate((el) => window.getComputedStyle(el).fontFamily)

      // Nunito Sans should be in the font stack
      expect(fontFamily.toLowerCase()).toContain('nunito')
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
  // Admin panel tests are slower due to Payload's heavy JS bundle
  test.setTimeout(90000)

  test('admin panel loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Wait for page to load with extended timeout
    await page.goto('/admin', { timeout: 60000 })

    // Should redirect to login or show admin UI
    await expect(page).toHaveURL(/\/admin/)

    // Wait for Payload admin to render - look for login form or dashboard
    // Try multiple selectors as Payload may use different field IDs
    try {
      await page.waitForSelector('input[name="email"]', { timeout: 45000, state: 'visible' })
    } catch {
      // Fallback to alternative selector
      await page.waitForSelector('input[id="field-email"]', { timeout: 45000, state: 'visible' })
    }

    // Give a moment for any late errors to surface
    await page.waitForTimeout(2000)

    // Filter out expected errors (like auth-related)
    const unexpectedErrors = errors.filter(
      (e) => !e.includes('401') && !e.includes('authentication') && !e.includes('Unauthorized'),
    )

    expect(unexpectedErrors).toHaveLength(0)
  })

  test('admin panel uses its own styles (not frontend theme)', async ({ page }) => {
    // Wait for page to load with extended timeout
    await page.goto('/admin', { timeout: 60000 })

    // Wait for Payload admin to render
    // Try multiple selectors as Payload may use different field IDs
    try {
      await page.waitForSelector('input[name="email"]', { timeout: 45000, state: 'visible' })
    } catch {
      // Fallback to alternative selector
      await page.waitForSelector('input[id="field-email"]', { timeout: 45000, state: 'visible' })
    }

    // Wait for styles to be fully applied
    await page.waitForTimeout(1000)

    // Admin should NOT have our custom anthracite background (#1A1D23)
    // because admin panel has isolated styles
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor)

    // Admin panel uses Payload's own styling, not our dark theme
    expect(bgColor).not.toBe('rgb(26, 29, 35)')
  })
})
