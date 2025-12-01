import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { createTestFileOfSize, MAX_TEST_FILE_BYTES } from '../helpers/media.helpers'

describe('createTestFileOfSize', () => {
  it('should create a file of the specified size', () => {
    const file = createTestFileOfSize(1024)
    expect(file.size).toBe(1024)
    expect(file.data.length).toBe(1024)
    expect(file.mimetype).toBe('image/png')
  })

  it('should accept custom mimetype', () => {
    const file = createTestFileOfSize(512, 'image/jpeg')
    expect(file.mimetype).toBe('image/jpeg')
  })

  it('should throw RangeError for non-positive integers', () => {
    expect(() => createTestFileOfSize(0)).toThrow(RangeError)
    expect(() => createTestFileOfSize(-1)).toThrow(RangeError)
    expect(() => createTestFileOfSize(1.5)).toThrow(RangeError)
  })

  it('should throw RangeError when size exceeds MAX_TEST_FILE_BYTES', () => {
    const oversizedBytes = MAX_TEST_FILE_BYTES + 1
    expect(() => createTestFileOfSize(oversizedBytes)).toThrow(RangeError)
    expect(() => createTestFileOfSize(oversizedBytes)).toThrow(/exceeds maximum allowed size/)
  })

  it('should create file when size is within MAX_TEST_FILE_BYTES limit', () => {
    // Test with a small size to avoid memory issues in tests
    // This verifies the function accepts sizes below the limit
    const smallSize = 1024
    expect(smallSize).toBeLessThanOrEqual(MAX_TEST_FILE_BYTES)
    const file = createTestFileOfSize(smallSize)
    expect(file.size).toBe(smallSize)
  })

  it('should export MAX_TEST_FILE_BYTES as a positive number', () => {
    // Simple observable behavior test: MAX_TEST_FILE_BYTES should be a positive integer
    expect(MAX_TEST_FILE_BYTES).toBeGreaterThan(0)
    expect(Number.isInteger(MAX_TEST_FILE_BYTES)).toBe(true)
    expect(Number.isFinite(MAX_TEST_FILE_BYTES)).toBe(true)
  })
})

describe('MAX_TEST_FILE_BYTES env var parsing', () => {
  const DEFAULT_MAX = 50 * 1024 * 1024
  let originalEnvValue: string | undefined

  beforeEach(() => {
    // Save original env value
    originalEnvValue = process.env.TEST_MAX_FILE_BYTES
    // Reset modules to allow re-evaluation of MAX_TEST_FILE_BYTES
    vi.resetModules()
  })

  afterEach(() => {
    // Restore original env value
    if (originalEnvValue !== undefined) {
      process.env.TEST_MAX_FILE_BYTES = originalEnvValue
    } else {
      delete process.env.TEST_MAX_FILE_BYTES
    }
    vi.resetModules()
  })

  it('should use default value when env var is not set', async () => {
    delete process.env.TEST_MAX_FILE_BYTES

    const { MAX_TEST_FILE_BYTES: freshMax } = await import('../helpers/media.helpers')

    expect(freshMax).toBe(DEFAULT_MAX)
  })

  it('should use env var value when set to valid numeric string', async () => {
    const customValue = 10 * 1024 * 1024 // 10 MB
    process.env.TEST_MAX_FILE_BYTES = String(customValue)

    const { MAX_TEST_FILE_BYTES: freshMax } = await import('../helpers/media.helpers')

    expect(freshMax).toBe(customValue)
  })

  it('should fallback to default when env var is non-numeric', async () => {
    process.env.TEST_MAX_FILE_BYTES = '50MB'

    const { MAX_TEST_FILE_BYTES: freshMax } = await import('../helpers/media.helpers')

    expect(freshMax).toBe(DEFAULT_MAX)
  })

  it('should fallback to default when env var is negative', async () => {
    process.env.TEST_MAX_FILE_BYTES = '-100'

    const { MAX_TEST_FILE_BYTES: freshMax } = await import('../helpers/media.helpers')

    expect(freshMax).toBe(DEFAULT_MAX)
  })

  it('should fallback to default when env var is zero', async () => {
    process.env.TEST_MAX_FILE_BYTES = '0'

    const { MAX_TEST_FILE_BYTES: freshMax } = await import('../helpers/media.helpers')

    expect(freshMax).toBe(DEFAULT_MAX)
  })
})
