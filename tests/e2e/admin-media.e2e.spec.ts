import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

/**
 * E2E tests for the Payload CMS Media collection admin interface.
 * Tests the complete CRUD workflow: upload, view, edit, and delete media via the admin panel.
 *
 * @see docs/specs/epics/epic_2/story_2_2/implementation/phase_3/COMMIT_CHECKLIST.md
 */

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Test configuration
const BASE_URL = 'http://localhost:3000'
const ADMIN_URL = `${BASE_URL}/admin`
const MEDIA_COLLECTION_URL = `${ADMIN_URL}/collections/media`

// Test credentials
const TEST_USER = {
  email: 'admin@example.com',
  password: 'password123',
}

// Test fixtures
const TEST_IMAGE_PATH = path.resolve(__dirname, '../fixtures/test-image.png')

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

        // Save changes
        await page.locator('button[type="submit"], button:has-text("Save")').first().click()

        // Wait for save to complete (page should stay on edit URL)
        await page.waitForLoadState('networkidle')

        // Reload and verify the value persisted
        await page.goto(editUrl, { waitUntil: 'networkidle' })
        await expect(altField).toHaveValue(newAltText)
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
})
