import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import type { Page } from '@playwright/test'
import type { Payload } from 'payload'
import type { Media } from '@/payload-types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * File shape expected by Payload's upload collections
 */
export interface PayloadFile {
  data: Buffer
  mimetype: string
  name: string
  size: number
}

/**
 * Options for creating media with file upload.
 * Extends Payload's create options to include the undeclared `file` parameter.
 */
export type CreateMediaOptions = Parameters<Payload['create']>[0] & {
  file?: PayloadFile
}

/**
 * Creates a media document with file upload.
 * Wraps payload.create with proper typing for the file parameter.
 *
 * @param payload - Payload instance
 * @param options - Create options including file
 * @returns Promise resolving to the created Media document
 */
export function createMediaWithFile(payload: Payload, options: CreateMediaOptions): Promise<Media> {
  return (payload.create as (options: CreateMediaOptions) => Promise<Media>)(options)
}

/**
 * Options for updating media with file upload.
 * Extends Payload's update options to include the undeclared `file` parameter.
 */
export type UpdateMediaOptions = Parameters<Payload['update']>[0] & {
  file?: PayloadFile
}

/**
 * Updates a media document with optional file upload.
 * Wraps payload.update with proper typing for the file parameter.
 *
 * @param payload - Payload instance
 * @param options - Update options including optional file
 * @returns Promise resolving to the updated Media document
 */
export function updateMediaWithFile(payload: Payload, options: UpdateMediaOptions): Promise<Media> {
  return (payload.update as (options: UpdateMediaOptions) => Promise<Media>)(options)
}

/**
 * Path to the test fixtures directory
 */
export const FIXTURES_PATH = path.resolve(__dirname, '../fixtures')

/**
 * Path to the test image fixture
 */
export const TEST_IMAGE_PATH = path.join(FIXTURES_PATH, 'test-image.png')

/**
 * Reads the test image fixture and returns file data for Payload upload
 * @param customName Optional custom filename (defaults to test-image-{timestamp}.png)
 * @returns File object compatible with Payload's create API
 */
export function getTestImageFile(customName?: string): PayloadFile {
  const buffer = fs.readFileSync(TEST_IMAGE_PATH)
  const name = customName ?? `test-image-${Date.now()}.png`

  return {
    data: buffer,
    mimetype: 'image/png',
    name,
    size: buffer.length,
  }
}

/**
 * Default maximum test file size (50 MB) to prevent OOM in CI environments.
 */
const DEFAULT_MAX_TEST_FILE_BYTES = 50 * 1024 * 1024

/**
 * Parse and validate TEST_MAX_FILE_BYTES environment variable.
 * Only accepts pure numeric strings (e.g., "52428800"). Values like "50MB" are rejected.
 * Returns the default if the env var is not set, not a pure numeric string, or not a positive integer.
 */
function parseMaxTestFileBytes(): number {
  const envValue = process.env.TEST_MAX_FILE_BYTES
  if (!envValue) {
    return DEFAULT_MAX_TEST_FILE_BYTES
  }

  // Only accept pure numeric strings (digits only)
  if (!/^\d+$/.test(envValue)) {
    console.warn(
      `Invalid TEST_MAX_FILE_BYTES value "${envValue}" (must be numeric), using default ${DEFAULT_MAX_TEST_FILE_BYTES}`,
    )
    return DEFAULT_MAX_TEST_FILE_BYTES
  }

  const parsed = Number(envValue)
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    console.warn(
      `Invalid TEST_MAX_FILE_BYTES value "${envValue}", using default ${DEFAULT_MAX_TEST_FILE_BYTES}`,
    )
    return DEFAULT_MAX_TEST_FILE_BYTES
  }

  return parsed
}

/**
 * Maximum allowed test file size (50 MB by default) to prevent OOM in CI environments.
 * Can be overridden via TEST_MAX_FILE_BYTES environment variable for special cases.
 * Invalid values will fallback to the default with a warning.
 */
export const MAX_TEST_FILE_BYTES = parseMaxTestFileBytes()

/**
 * Creates a buffer of specified size for testing file size limits
 * @param sizeInBytes Size of the buffer to create (must be a positive integer, max 50 MB by default)
 * @param mimetype MIME type to report
 * @returns File object compatible with Payload's create API
 * @throws RangeError if sizeInBytes is not a positive integer or exceeds MAX_TEST_FILE_BYTES
 */
export function createTestFileOfSize(sizeInBytes: number, mimetype = 'image/png'): PayloadFile {
  if (!Number.isInteger(sizeInBytes) || sizeInBytes <= 0) {
    throw new RangeError('sizeInBytes must be a positive integer')
  }
  if (sizeInBytes > MAX_TEST_FILE_BYTES) {
    throw new RangeError(
      `sizeInBytes (${sizeInBytes}) exceeds maximum allowed size (${MAX_TEST_FILE_BYTES} bytes). ` +
        'Set TEST_MAX_FILE_BYTES environment variable to override.',
    )
  }
  const buffer = Buffer.alloc(sizeInBytes)
  return {
    data: buffer,
    mimetype,
    name: `test-file-${sizeInBytes}-${Date.now()}.bin`,
    size: buffer.length,
  }
}

/**
 * Module-level counter for generating unique identifiers in parallel tests.
 * This counter persists across test runs in the same process to ensure uniqueness.
 * Use resetTestAltTextCounter() in test setup/teardown if isolation is needed.
 */
let testAltTextCounter = 0

/**
 * Resets the alt text counter to zero.
 * Call this in beforeEach/afterEach if you need counter isolation between test suites.
 * Note: In most cases, persistence is desirable to avoid collisions across suites.
 */
export function resetTestAltTextCounter(): void {
  testAltTextCounter = 0
}

/**
 * Generate unique alt text for test media
 * Uses timestamp + counter + random suffix to avoid collisions in parallel tests
 * @param prefix Optional prefix for the alt text
 * @returns Unique alt text string (format: "{prefix} {timestamp}-{counter}-{randomSuffix}")
 */
export function generateTestAltText(prefix = 'Test Media'): string {
  const timestamp = Date.now()
  const counter = ++testAltTextCounter
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  return `${prefix} ${timestamp}-${counter}-${randomSuffix}`
}

/**
 * Creates a file with invalid MIME type for testing rejection
 * @returns File object with application/pdf MIME type
 */
export function createInvalidMimeTypeFile(): PayloadFile {
  const buffer = Buffer.from('fake pdf content')
  return {
    data: buffer,
    mimetype: 'application/pdf',
    name: `test-invalid-${Date.now()}.pdf`,
    size: buffer.length,
  }
}

/**
 * Selectors for Payload CMS 3.x dropzone file upload component.
 * Used by waitForDropzoneAndUpload helper.
 */
export const PAYLOAD_DROPZONE_SELECTORS = {
  /** The dropzone container */
  dropzone: '.file-field__upload',
  /** Selectors indicating upload was processed (any match = success) */
  uploadComplete: '.file__filename, .upload__filename, [class*="thumbnail"], .file-field__filename',
} as const

/**
 * Waits for Payload CMS dropzone to be ready, uploads a file, and waits for processing.
 *
 * This helper encapsulates the Payload 3.x file upload pattern:
 * 1. Wait for dropzone to be visible
 * 2. Set file on the hidden input
 * 3. Wait for upload processing indicators
 *
 * @param page - Playwright Page instance
 * @param filePath - Path to the file to upload (defaults to TEST_IMAGE_PATH)
 * @param options - Optional configuration
 * @param options.dropzoneTimeout - Timeout for dropzone visibility (default: 10000ms)
 * @param options.uploadTimeout - Timeout for upload processing (default: 15000ms)
 */
export async function waitForDropzoneAndUpload(
  page: Page,
  filePath: string = TEST_IMAGE_PATH,
  options: { dropzoneTimeout?: number; uploadTimeout?: number } = {},
): Promise<void> {
  const { dropzoneTimeout = 10000, uploadTimeout = 15000 } = options

  // Wait for the dropzone to be visible
  const dropzone = page.locator(PAYLOAD_DROPZONE_SELECTORS.dropzone).first()
  await dropzone.waitFor({ state: 'visible', timeout: dropzoneTimeout })

  // Upload file via hidden input
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles(filePath)

  // Wait for upload to be processed
  await page.waitForSelector(PAYLOAD_DROPZONE_SELECTORS.uploadComplete, {
    timeout: uploadTimeout,
  })
}
