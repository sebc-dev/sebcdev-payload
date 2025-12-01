import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
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
 * Maximum allowed test file size (50 MB) to prevent OOM in CI environments.
 * Can be overridden via TEST_MAX_FILE_BYTES environment variable for special cases.
 */
export const MAX_TEST_FILE_BYTES = process.env.TEST_MAX_FILE_BYTES
  ? parseInt(process.env.TEST_MAX_FILE_BYTES, 10)
  : 50 * 1024 * 1024

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
 * Module-level counter for generating unique identifiers in parallel tests
 */
let testAltTextCounter = 0

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
