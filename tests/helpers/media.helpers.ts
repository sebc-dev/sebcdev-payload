import path from 'path'
import fs from 'fs'

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
export function getTestImageFile(customName?: string): {
  data: Buffer
  mimetype: string
  name: string
  size: number
} {
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
 * @param sizeInBytes Size of the buffer to create
 * @param mimetype MIME type to report
 * @returns File object compatible with Payload's create API
 */
export function createTestFileOfSize(
  sizeInBytes: number,
  mimetype = 'image/png',
): {
  data: Buffer
  mimetype: string
  name: string
  size: number
} {
  const buffer = Buffer.alloc(sizeInBytes)
  return {
    data: buffer,
    mimetype,
    name: `test-file-${sizeInBytes}-${Date.now()}.bin`,
    size: sizeInBytes,
  }
}

/**
 * Creates a minimal valid PNG buffer for testing
 * Uses the smallest valid PNG (1x1 transparent pixel)
 * @returns Minimal PNG buffer
 */
export function createMinimalPngBuffer(): Buffer {
  // Minimal 1x1 transparent PNG
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82,
  ])
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
export function createInvalidMimeTypeFile(): {
  data: Buffer
  mimetype: string
  name: string
  size: number
} {
  const buffer = Buffer.from('fake pdf content')
  return {
    data: buffer,
    mimetype: 'application/pdf',
    name: `test-invalid-${Date.now()}.pdf`,
    size: buffer.length,
  }
}
