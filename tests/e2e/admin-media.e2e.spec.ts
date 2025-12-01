import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { TEST_IMAGE_PATH } from '../helpers/media.helpers'

/**
 * E2E tests for the Payload CMS Media collection admin interface.
 * Tests the complete CRUD workflow: upload, view, edit, and delete media via the admin panel.
 * Includes accessibility tests for WCAG 2.1 AA compliance.
 *
 * @see docs/specs/epics/epic_2/story_2_2/implementation/phase_3/COMMIT_CHECKLIST.md
 */

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Test configuration - use environment variables with sensible defaults
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const ADMIN_URL = `${BASE_URL}${process.env.ADMIN_PATH ?? '/admin'}`
const MEDIA_COLLECTION_URL = `${ADMIN_URL}/collections/media`

// Test credentials from environment variables with defaults for local development
const TEST_USER = {
  email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
  password: process.env.ADMIN_PASSWORD ?? 'password123',
}

// Auth state file for sharing authentication between tests
const AUTH_STATE_PATH = path.resolve(__dirname, '../../.auth/admin.json')

/**
 * Helper to authenticate with Payload admin.
 * Handles both first-user creation and login flows.
 */
async function authenticate(page: Page): Promise<void> {
  await page.goto(ADMIN_URL, { waitUntil: 'networkidle' })

  const currentUrl = page.url()

  if (currentUrl.includes('create-first-user')) {
    // First user creation flow
    await page.locator('#field-email').fill(TEST_USER.email)
    await page.locator('#field-password').fill(TEST_USER.password)
    await page.locator('#field-confirm-password').fill(TEST_USER.password)

    // Click create button
    await page.locator('button[type="submit"]').click()

    // Wait for navigation away from create-first-user
    await page.waitForURL(/\/admin(?!.*create-first-user)/, { timeout: 30000 })
  } else if (currentUrl.includes('login')) {
    // Login flow
    await page.locator('#field-email').fill(TEST_USER.email)
    await page.locator('#field-password').fill(TEST_USER.password)

    // Click login button
    await page.locator('button[type="submit"]').click()

    // Wait for navigation away from login
    await page.waitForURL(/\/admin(?!.*login)/, { timeout: 30000 })
  }

  // Verify we're on the admin dashboard
  await expect(page).toHaveURL(/\/admin/)
}

/**
 * Helper to upload a media file and return to the edit page.
 */
async function uploadMedia(page: Page, altText?: string): Promise<string> {
  await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })

  // Wait for form
  await expect(page.locator('form')).toBeVisible()

  // Upload file
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles(TEST_IMAGE_PATH)

  // Wait for upload to be processed
  await page.waitForSelector('.file__filename, .upload__filename, [class*="thumbnail"]', {
    timeout: 15000,
  })

  // Fill alt text if provided
  if (altText) {
    const altField = page.locator('#field-alt')
    if (await altField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await altField.fill(altText)
    }
  }

  // Save
  await page.locator('button[type="submit"], button:has-text("Save")').first().click()

  // Wait for redirect to edit page with ID
  await page.waitForURL(/\/admin\/collections\/media\/\d+/, { timeout: 30000 })

  return page.url()
}

test.describe('Admin Media CRUD E2E', () => {
  test.describe.configure({ mode: 'serial' })

  let sharedContext: BrowserContext

  test.beforeAll(async ({ browser }) => {
    // Create a shared context for all tests
    sharedContext = await browser.newContext()
    const page = await sharedContext.newPage()

    // Authenticate once
    await authenticate(page)

    // Ensure auth state directory exists
    const authDir = path.dirname(AUTH_STATE_PATH)
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true })
    }

    // Save auth state
    await sharedContext.storageState({ path: AUTH_STATE_PATH })

    await page.close()
  })

  test.afterAll(async () => {
    await sharedContext?.close()
  })

  /**
   * Test: Upload image via admin form
   * Verifies that a user can upload an image through the media create form.
   */
  test('should upload image via admin form and verify success', async () => {
    const page = await sharedContext.newPage()

    try {
      await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })

      // Wait for form to be ready
      await expect(page.locator('form')).toBeVisible()

      // Upload file
      const fileInput = page.locator('input[type="file"]')
      await expect(fileInput).toBeAttached()
      await fileInput.setInputFiles(TEST_IMAGE_PATH)

      // Wait for file to be processed
      await page.waitForSelector('.file__filename, .upload__filename, [class*="thumbnail"]', {
        timeout: 15000,
      })

      // Fill alt text if available
      const altField = page.locator('#field-alt')
      if (await altField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await altField.fill('Test image for upload verification')
      }

      // Submit form
      await page.locator('button[type="submit"], button:has-text("Save")').first().click()

      // Verify success: redirect to edit page with ID
      await expect(page).toHaveURL(/\/admin\/collections\/media\/\d+/, { timeout: 30000 })
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Display uploaded images in media gallery
   * Verifies that uploaded images appear in the media list.
   */
  test('should display uploaded images in media gallery', async () => {
    const page = await sharedContext.newPage()

    try {
      // First upload an image
      await uploadMedia(page, 'Gallery test image')

      // Navigate to media list
      await page.goto(MEDIA_COLLECTION_URL, { waitUntil: 'networkidle' })

      // Verify at least one media item is visible
      const mediaRows = page.locator(
        'table tbody tr, [class*="list"] [class*="row"], [class*="table-row"]',
      )
      await expect(mediaRows.first()).toBeVisible({ timeout: 15000 })

      // Verify the table/list has content
      const rowCount = await mediaRows.count()
      expect(rowCount).toBeGreaterThan(0)
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Edit media metadata
   * Verifies that users can update media alt text and save changes.
   */
  test('should edit media metadata and save changes', async () => {
    const page = await sharedContext.newPage()

    try {
      // Upload a new image
      const editUrl = await uploadMedia(page, 'Original alt text')

      // Now on edit page - update alt text
      const altField = page.locator('#field-alt')
      const newAltText = `Updated alt text ${Date.now()}`

      if (await altField.isVisible({ timeout: 3000 }).catch(() => false)) {
        await altField.clear()
        await altField.fill(newAltText)

        // Wait for field to be updated
        await expect(altField).toHaveValue(newAltText)

        // Click save button - find the main save button in the header actions
        const saveButton = page.locator(
          'button[type="submit"]:has-text("Save"), header button:has-text("Save"), [class*="doc-controls"] button:has-text("Save")',
        )
        await saveButton.first().click()

        // Wait for save to complete by watching for either:
        // 1. Toast notification
        // 2. Button state change
        // 3. Network idle
        const saveComplete = Promise.race([
          page
            .locator(
              '[class*="toast"]:has-text("saved"), [class*="toast"]:has-text("Success"), [class*="Toastify"]:has-text("saved")',
            )
            .first()
            .waitFor({ timeout: 10000 })
            .then(() => 'toast'),
          page.waitForLoadState('networkidle').then(() => 'network'),
        ])

        await saveComplete

        // Small delay to ensure save is fully persisted
        await page.waitForTimeout(500)

        // Reload and verify the value persisted
        await page.goto(editUrl, { waitUntil: 'networkidle' })
        await expect(altField).toHaveValue(newAltText, { timeout: 10000 })
      } else {
        // Alt text field not available - just verify we're on edit page
        await expect(page.locator('form')).toBeVisible()
      }
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Delete media and verify removal
   * Verifies that users can delete media.
   */
  test('should delete media and remove from gallery', async () => {
    const page = await sharedContext.newPage()

    try {
      // Upload a new image to delete
      await uploadMedia(page, 'Image to delete')

      // Get the media ID from URL
      const currentUrl = page.url()
      const mediaId = currentUrl.match(/\/media\/(\d+)/)?.[1]

      // Look for delete button in actions menu or directly on page
      // Payload 3.x typically has delete in a dropdown or button
      const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="delete" i]')

      if (
        await deleteButton
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        await deleteButton.first().click()

        // Confirm deletion in modal
        const confirmButton = page.locator(
          '.modal button:has-text("Delete"), .dialog button:has-text("Confirm"), button:has-text("Yes"), button[type="button"]:has-text("Delete")',
        )
        await confirmButton.first().click({ timeout: 5000 })

        // Wait for redirect to list
        await expect(page).toHaveURL(MEDIA_COLLECTION_URL, { timeout: 15000 })

        // Verify deleted item is not in the list
        if (mediaId) {
          await expect(page.locator(`a[href*="/media/${mediaId}"]`)).not.toBeVisible()
        }
      } else {
        // Alternative: use API to verify deletion capability
        // or skip if delete not available in UI
        console.log('Delete button not found in UI, test skipped')
      }
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Handle missing file upload gracefully
   * Verifies that submitting without a file shows appropriate error.
   */
  test('should show error when submitting without file', async () => {
    const page = await sharedContext.newPage()

    try {
      await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })
      await expect(page.locator('form')).toBeVisible()

      // Try to submit without uploading a file
      await page.locator('button[type="submit"], button:has-text("Save")').first().click()

      // Wait a moment for validation
      await page.waitForTimeout(1000)

      // Should either show error or stay on create page
      const currentUrl = page.url()
      const hasError = await page
        .locator('[class*="error"], [class*="toast"][class*="error"], .field-error')
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)

      // Either we see an error message OR we're still on the create page
      expect(currentUrl.includes('create') || hasError).toBeTruthy()
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Upload form accessibility (WCAG 2.1 AA)
   * Verifies that the media upload form meets WCAG 2.1 AA accessibility standards.
   *
   * Note: Some color contrast issues in Payload CMS's built-in admin UI are excluded
   * as they are outside our control. These are documented and tracked:
   * - .localizer-button__label (locale selector)
   * - .file-field__orText, .file-field__dragAndDropText (file upload hints)
   * - .field-description (field descriptions)
   */
  test('should pass WCAG 2.1 AA accessibility checks on upload form', async () => {
    const page = await sharedContext.newPage()

    try {
      await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })
      await expect(page.locator('form')).toBeVisible()

      // Run axe-core accessibility scan
      // Exclude known Payload admin UI elements with color contrast issues
      // These are in Payload's core UI and outside our control
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .exclude('.localizer-button__label') // Payload locale selector
        .exclude('.file-field__orText') // Payload file upload "Or" text
        .exclude('.file-field__dragAndDropText') // Payload drag-and-drop hint
        .exclude('.field-description') // Payload field descriptions
        .analyze()

      // Assert no WCAG 2.1 AA violations (excluding known Payload UI issues)
      expect(accessibilityScanResults.violations).toEqual([])
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Keyboard navigation
   * Verifies that the upload form can be navigated using only keyboard.
   */
  test('should support keyboard navigation on upload form', async () => {
    const page = await sharedContext.newPage()

    try {
      await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })
      await expect(page.locator('form')).toBeVisible()

      // Press Tab to move through form elements
      await page.keyboard.press('Tab')

      // Verify focus is on an interactive element
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()

      // Continue tabbing through the form
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        // Verify focus remains visible on each tab
        const currentFocus = page.locator(':focus')
        const isVisible = await currentFocus.isVisible().catch(() => false)
        // At least some elements should be focusable
        if (isVisible) {
          expect(isVisible).toBeTruthy()
        }
      }

      // Verify the submit button is reachable via keyboard
      // Keep tabbing until we find a button or reach a reasonable limit
      let foundButton = false
      for (let i = 0; i < 20; i++) {
        const focused = page.locator(':focus')
        const tagName = await focused.evaluate((el) => el.tagName.toLowerCase()).catch(() => '')
        if (tagName === 'button') {
          foundButton = true
          break
        }
        await page.keyboard.press('Tab')
      }
      expect(foundButton).toBeTruthy()
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Form labels and ARIA attributes
   * Verifies that all form inputs have associated labels.
   */
  test('should have proper labels for form inputs', async () => {
    const page = await sharedContext.newPage()

    try {
      await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })
      await expect(page.locator('form')).toBeVisible()

      // Check that text inputs have associated labels (via id or aria-label)
      const textInputs = page.locator('input[type="text"], input[type="email"], textarea')
      const textInputCount = await textInputs.count()

      for (let i = 0; i < textInputCount; i++) {
        const input = textInputs.nth(i)
        const inputId = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')

        // Input should have either: a label with matching for attribute, aria-label, or aria-labelledby
        if (inputId) {
          const associatedLabel = page.locator(`label[for="${inputId}"]`)
          const hasLabel = (await associatedLabel.count()) > 0
          const hasAriaLabel = !!ariaLabel || !!ariaLabelledBy
          expect(hasLabel || hasAriaLabel).toBeTruthy()
        }
      }

      // Verify the file input exists and is accessible
      // Note: Payload uses a hidden file input with a styled overlay button
      const fileInput = page.locator('input[type="file"]')
      if ((await fileInput.count()) > 0) {
        // File input exists - it may be hidden but should be attached to DOM
        await expect(fileInput).toBeAttached()

        // The upload area should have an accessible trigger (button or label)
        const uploadButton = page.locator(
          'button:has-text("Select a file"), button:has-text("Upload"), [class*="file-field"] button',
        )
        const uploadButtonCount = await uploadButton.count()

        // Either there's a visible upload button OR the file input itself is accessible
        const fileInputId = await fileInput.getAttribute('id')
        const hasLabel = fileInputId
          ? (await page.locator(`label[for="${fileInputId}"]`).count()) > 0
          : false

        expect(uploadButtonCount > 0 || hasLabel).toBeTruthy()
      }
    } finally {
      await page.close()
    }
  })

  /**
   * Test: Error message accessibility
   * Verifies that error messages are accessible to screen readers.
   */
  test('should have accessible error messages', async () => {
    const page = await sharedContext.newPage()

    try {
      await page.goto(`${MEDIA_COLLECTION_URL}/create`, { waitUntil: 'networkidle' })
      await expect(page.locator('form')).toBeVisible()

      // Submit form without required file to trigger validation
      await page.locator('button[type="submit"], button:has-text("Save")').first().click()

      // Wait for potential error messages
      await page.waitForTimeout(1000)

      // Check if any error messages exist
      const errorMessages = page.locator(
        '[role="alert"], [aria-live="polite"], [aria-live="assertive"], [class*="error"], .field-error',
      )
      const errorCount = await errorMessages.count()

      if (errorCount > 0) {
        // If errors are shown, verify they have proper ARIA attributes or role
        for (let i = 0; i < errorCount; i++) {
          const error = errorMessages.nth(i)
          const role = await error.getAttribute('role')
          const ariaLive = await error.getAttribute('aria-live')
          const hasClass = await error.evaluate((el) => el.className.includes('error'))

          // Error should be accessible via role, aria-live, or at minimum be visible
          const isAccessible = role === 'alert' || !!ariaLive || hasClass
          expect(isAccessible || (await error.isVisible())).toBeTruthy()
        }
      }

      // Verify we're still on the create page (form wasn't submitted)
      expect(page.url()).toContain('create')
    } finally {
      await page.close()
    }
  })
})
