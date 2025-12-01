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

  it('should export MAX_TEST_FILE_BYTES constant', () => {
    expect(MAX_TEST_FILE_BYTES).toBeGreaterThan(0)
    // Default is 50 MB
    expect(MAX_TEST_FILE_BYTES).toBe(50 * 1024 * 1024)
  })
})
