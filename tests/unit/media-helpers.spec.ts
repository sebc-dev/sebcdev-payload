import { describe, expect, it } from 'vitest'

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

  it('should have MAX_TEST_FILE_BYTES equal to default when no env override', () => {
    const DEFAULT_MAX = 50 * 1024 * 1024

    // If no TEST_MAX_FILE_BYTES env var is set, expect default value
    // Note: This test may be skipped if env var is set in CI
    if (!process.env.TEST_MAX_FILE_BYTES) {
      expect(MAX_TEST_FILE_BYTES).toBe(DEFAULT_MAX)
    }
  })
})
