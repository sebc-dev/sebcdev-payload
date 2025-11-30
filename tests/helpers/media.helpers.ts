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
 * Creates a buffer of specified size for testing file size limits
 * @param sizeInBytes Size of the buffer to create (must be a positive integer)
 * @param mimetype MIME type to report
 * @returns File object compatible with Payload's create API
 * @throws RangeError if sizeInBytes is not a positive integer
 */
export function createTestFileOfSize(sizeInBytes: number, mimetype = 'image/png'): PayloadFile {
  if (!Number.isInteger(sizeInBytes) || sizeInBytes <= 0) {
    throw new RangeError('sizeInBytes must be a positive integer')
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
 * Generate unique alt text for test media
 * @param prefix Optional prefix for the alt text
 * @returns Unique alt text string
 */
export function generateTestAltText(prefix = 'Test Media'): string {
  return `${prefix} ${Date.now()}`
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
