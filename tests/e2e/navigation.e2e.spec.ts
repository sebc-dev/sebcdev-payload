import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

import enMessages from '../../messages/en.json' with { type: 'json' }
import frMessages from '../../messages/fr.json' with { type: 'json' }

/**
 * Navigation E2E Tests
 *
 * Comprehensive tests for the navigation system:
 * - Header visibility and functionality
 * - Desktop navigation links
 * - Mobile menu (Sheet) behavior
 * - Language switcher functionality
 * - Skip link accessibility
 * - Keyboard navigation
 * - axe-core accessibility audit
 *
 * @see docs/specs/epics/epic_3/story_3_3/story_3.3.md
 */

test.describe('Navigation', () => {
  test.describe('Header', () => {
    test('header is visible on French homepage', async ({ page }) => {
      await page.goto('/fr')
      await expect(page.locator('header')).toBeVisible()
    })

    test('header is visible on English homepage', async ({ page }) => {
      await page.goto('/en')
      await expect(page.locator('header')).toBeVisible()
    })

    test('header is sticky on scroll', async ({ page }) => {
      await page.goto('/fr')

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500))

      // Header should still be visible at top
      const header = page.locator('header')
      const headerBox = await header.boundingBox()
      expect(headerBox?.y).toBeLessThanOrEqual(0)
    })

    test('logo links to homepage', async ({ page }) => {
      await page.goto('/fr')

      // Verify logo is a link to homepage
      const logo = page.locator('header a').filter({ hasText: 'sebc.dev' })
      await expect(logo).toBeVisible()
      await expect(logo).toHaveAttribute('href', '/fr')
    })
  })

  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('navigation links are visible on desktop', async ({ page }) => {
      await page.goto('/fr')

      // Desktop navigation should be visible (header nav)
      const headerNav = page.locator('header nav')
      await expect(headerNav).toBeVisible()
      // Use .first() to get header nav link (not footer)
      await expect(
        page.locator('header nav').getByRole('link', { name: frMessages.navigation.articles }),
      ).toBeVisible()
    })

    test('Articles link navigates correctly', async ({ page }) => {
      await page.goto('/fr')

      await page
        .locator('header nav')
        .getByRole('link', { name: frMessages.navigation.articles })
        .click()

      await expect(page).toHaveURL('/fr/articles')
    })

    test('hamburger menu is hidden on desktop', async ({ page }) => {
      await page.goto('/fr')

      // Hamburger should not be visible (lg:hidden class)
      const hamburger = page.locator(`button[aria-label="${frMessages.mobileMenu.open}"]`)
      await expect(hamburger).not.toBeVisible()
    })
  })

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('hamburger menu is visible on mobile', async ({ page }) => {
      await page.goto('/fr')

      const hamburger = page.locator(`button[aria-label="${frMessages.mobileMenu.open}"]`)
      await expect(hamburger).toBeVisible()
    })

    test('desktop navigation is hidden on mobile', async ({ page }) => {
      await page.goto('/fr')

      // Desktop nav has class lg:flex which means hidden on mobile
      const desktopNav = page.locator('header nav.hidden')
      await expect(desktopNav).toBeHidden()
    })

    test('mobile menu opens and closes', async ({ page }) => {
      await page.goto('/fr')

      // Open menu
      await page.click(`button[aria-label="${frMessages.mobileMenu.open}"]`)

      // Sheet should be visible
      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()

      // Close button (shadcn Sheet has "Close" as sr-only text)
      await sheet.getByRole('button', { name: 'Close' }).click()
      await expect(sheet).not.toBeVisible()
    })

    test('mobile menu closes on navigation', async ({ page }) => {
      await page.goto('/fr')

      // Open menu
      await page.click(`button[aria-label="${frMessages.mobileMenu.open}"]`)

      // Click navigation link
      const sheet = page.getByRole('dialog')
      await sheet.getByRole('link', { name: frMessages.navigation.articles }).click()

      // Sheet should close
      await expect(sheet).not.toBeVisible()
      await expect(page).toHaveURL('/fr/articles')
    })

    test('Escape key closes mobile menu', async ({ page }) => {
      await page.goto('/fr')

      // Open menu
      await page.click(`button[aria-label="${frMessages.mobileMenu.open}"]`)

      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      await expect(sheet).not.toBeVisible()
    })
  })

  test.describe('Language Switcher', () => {
    test('language switcher is visible', async ({ page }) => {
      await page.goto('/fr')

      // Both language options should be visible
      await expect(page.locator('header').getByRole('link', { name: 'Français' })).toBeVisible()
      await expect(page.locator('header').getByRole('link', { name: 'English' })).toBeVisible()
    })

    test('current language is highlighted', async ({ page }) => {
      await page.goto('/fr')

      const frLink = page.locator('header').getByRole('link', { name: 'Français' })

      // French should have aria-current="true"
      await expect(frLink).toHaveAttribute('aria-current', 'true')
    })

    test('switching to English updates URL', async ({ page }) => {
      await page.goto('/fr')

      await page.locator('header').getByRole('link', { name: 'English' }).click()

      await expect(page).toHaveURL('/en')
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    })

    test('switching to French updates URL', async ({ page }) => {
      await page.goto('/en')

      await page.locator('header').getByRole('link', { name: 'Français' }).click()

      await expect(page).toHaveURL('/fr')
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    })

    test('language links have correct href', async ({ page }) => {
      await page.goto('/fr')

      // Verify English link goes to /en
      const enLink = page.locator('header').getByRole('link', { name: 'English' })
      await expect(enLink).toHaveAttribute('href', '/en')

      // Verify French link goes to /fr
      const frLink = page.locator('header').getByRole('link', { name: 'Français' })
      await expect(frLink).toHaveAttribute('href', '/fr')
    })
  })

  test.describe('Skip Link', () => {
    test('skip link is first focusable element', async ({ page }) => {
      await page.goto('/fr')

      // Tab once
      await page.keyboard.press('Tab')

      // First focused element should be skip link
      const focused = page.locator(':focus')
      await expect(focused).toContainText(frMessages.accessibility.skipToContent)
    })

    test('skip link is visible when focused', async ({ page }) => {
      await page.goto('/fr')

      // Tab to skip link
      await page.keyboard.press('Tab')

      const skipLink = page.getByRole('link', {
        name: frMessages.accessibility.skipToContent,
      })
      await expect(skipLink).toBeVisible()
    })

    test('skip link navigates to main content', async ({ page }) => {
      await page.goto('/fr')

      // Tab to skip link
      await page.keyboard.press('Tab')

      // Activate skip link
      await page.keyboard.press('Enter')

      // Main content should have focus
      const main = page.locator('#main-content')
      await expect(main).toBeFocused()
    })

    test('skip link is translated in English', async ({ page }) => {
      await page.goto('/en')

      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')
      await expect(focused).toContainText(enMessages.accessibility.skipToContent)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('Tab navigates through interactive elements', async ({ page }) => {
      await page.goto('/fr')

      // Track focused elements
      const focusedElements: string[] = []

      for (let i = 0; i < 7; i++) {
        await page.keyboard.press('Tab')
        const tagName = await page.evaluate(() => document.activeElement?.tagName)
        focusedElements.push(tagName || 'none')
      }

      // Should have navigated through multiple elements
      expect(focusedElements.filter((el) => el !== 'none').length).toBeGreaterThan(5)
    })

    test('focus rings are visible', async ({ page }) => {
      await page.goto('/fr')

      // Tab to an interactive element (skip past skip link)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')
      const boxShadow = await focused.evaluate((el) => getComputedStyle(el).boxShadow)

      // Should have visible focus ring
      expect(boxShadow).not.toBe('none')
    })
  })

  test.describe('Accessibility', () => {
    test('homepage FR passes axe-core audit', async ({ page }) => {
      await page.goto('/fr')

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

      if (results.violations.length > 0) {
        console.log('Violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    })

    test('homepage EN passes axe-core audit', async ({ page }) => {
      await page.goto('/en')

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

      if (results.violations.length > 0) {
        console.log('Violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    })

    test('mobile menu passes axe-core audit when open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/fr')

      // Open mobile menu
      await page.click(`button[aria-label="${frMessages.mobileMenu.open}"]`)
      await page.waitForSelector('[role="dialog"]')

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

      if (results.violations.length > 0) {
        console.log('Mobile menu violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    })

    test('correct ARIA landmarks are present', async ({ page }) => {
      await page.goto('/fr')

      // Header has banner role
      await expect(page.getByRole('banner')).toBeVisible()

      // Navigation role present (header nav)
      await expect(page.locator('header').getByRole('navigation')).toBeVisible()

      // Main role present
      await expect(page.getByRole('main')).toBeVisible()

      // Footer has contentinfo role
      await expect(page.getByRole('contentinfo')).toBeVisible()
    })
  })

  test.describe('Footer', () => {
    test('footer is visible on all pages', async ({ page }) => {
      await page.goto('/fr')
      await expect(page.locator('footer')).toBeVisible()

      await page.goto('/en')
      await expect(page.locator('footer')).toBeVisible()
    })

    test('footer links work', async ({ page }) => {
      await page.goto('/fr')

      // Click Articles link in footer (uses footer.links.articles key)
      const footer = page.locator('footer')
      await footer.getByRole('link', { name: frMessages.footer.links.articles }).click()

      await expect(page).toHaveURL('/fr/articles')
    })
  })
})
