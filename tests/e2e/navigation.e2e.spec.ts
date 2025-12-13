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
      await page.goto('/fr', { waitUntil: 'networkidle' })

      // Extra wait to ensure React hydration is complete
      await page.waitForTimeout(2000)

      const hamburger = page.locator(`button[aria-label="${frMessages.mobileMenu.open}"]`)
      await expect(hamburger).toBeVisible()
      await expect(hamburger).toBeEnabled()

      // Click and wait for dialog to appear
      await hamburger.click()

      // Wait for the Sheet to be visible
      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible({ timeout: 10000 })

      // Close button uses translated label from mobileMenu.close
      const closeButton = sheet.getByRole('button', { name: frMessages.mobileMenu.close })
      await expect(closeButton).toBeVisible()
      await closeButton.click()

      // Wait for sheet to disappear
      await expect(sheet).not.toBeVisible()
    })

    test('Escape key closes mobile menu', async ({ page }) => {
      await page.goto('/fr', { waitUntil: 'networkidle' })

      // Extra wait to ensure React hydration is complete
      await page.waitForTimeout(2000)

      const hamburger = page.locator(`button[aria-label="${frMessages.mobileMenu.open}"]`)
      await expect(hamburger).toBeVisible()
      await expect(hamburger).toBeEnabled()

      // Click and wait for dialog to appear
      await hamburger.click()

      // Wait for the Sheet to be visible
      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible({ timeout: 10000 })

      // Press Escape
      await page.keyboard.press('Escape')

      // Wait for sheet to disappear
      await expect(sheet).not.toBeVisible()
    })
  })

  test.describe('Language Switcher', () => {
    test.beforeEach(async ({ page }) => {
      // Set desktop viewport for language switcher tests (hidden on mobile)
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('language switcher dropdown is visible', async ({ page }) => {
      await page.goto('/fr')

      // Language switcher trigger button should be visible
      const langSwitcher = page
        .locator('header')
        .getByRole('button', { name: frMessages.language.switch })
      await expect(langSwitcher).toBeVisible()
    })

    test('dropdown shows language options when opened', async ({ page }) => {
      await page.goto('/fr')

      // Wait for React hydration to complete
      await page.waitForLoadState('networkidle')

      // Wait for and open the language dropdown
      const langSwitcher = page
        .locator('header')
        .getByRole('button', { name: frMessages.language.switch })
      await expect(langSwitcher).toBeVisible()
      await langSwitcher.click()

      // Both language options should be visible in the dropdown menu
      await expect(page.getByRole('menuitem', { name: 'Français' })).toBeVisible({ timeout: 5000 })
      await expect(page.getByRole('menuitem', { name: 'English' })).toBeVisible({ timeout: 5000 })
    })

    test('current language is highlighted', async ({ page }) => {
      await page.goto('/fr')

      // Wait for React hydration to complete
      await page.waitForLoadState('networkidle')

      // Wait for and open the language dropdown
      const langSwitcher = page
        .locator('header')
        .getByRole('button', { name: frMessages.language.switch })
      await expect(langSwitcher).toBeVisible()
      await langSwitcher.click()

      // Wait for menu to open and French item to be visible
      const frItem = page.getByRole('menuitem', { name: 'Français' })
      await expect(frItem).toBeVisible({ timeout: 5000 })

      // French should have aria-current="true"
      await expect(frItem).toHaveAttribute('aria-current', 'true')
    })

    test.skip('switching to English updates URL', async ({ page }) => {
      await page.goto('/fr', { waitUntil: 'load' })

      // Wait for React hydration to complete
      await page.waitForTimeout(1000)

      // Wait for and open the language dropdown
      const langSwitcher = page
        .locator('header')
        .getByRole('button', { name: frMessages.language.switch })
      await expect(langSwitcher).toBeVisible()
      await langSwitcher.click()

      // Wait for English option to be visible and clickable
      const englishItem = page.getByRole('menuitem', { name: 'English' })
      await expect(englishItem).toBeVisible({ timeout: 10000 })

      // Click and wait for navigation to complete
      await englishItem.click()
      await page.waitForURL('/en', { timeout: 10000 })

      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    })

    test.skip('switching to French updates URL', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'load' })

      // Wait for React hydration to complete
      await page.waitForTimeout(1000)

      // Wait for and open the language dropdown
      const langSwitcher = page
        .locator('header')
        .getByRole('button', { name: enMessages.language.switch })
      await expect(langSwitcher).toBeVisible()
      await langSwitcher.click()

      // Wait for French option to be visible and clickable
      const frenchItem = page.getByRole('menuitem', { name: 'Français' })
      await expect(frenchItem).toBeVisible({ timeout: 10000 })

      // Click and wait for navigation to complete
      await frenchItem.click()
      await page.waitForURL('/fr', { timeout: 10000 })

      await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
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
  })
})
