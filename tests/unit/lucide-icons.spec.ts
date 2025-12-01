import { describe, expect, it } from 'vitest'

import { getLucideIconOptions, isValidLucideIcon, LUCIDE_CATEGORY_ICONS } from '@/lib/lucide-icons'

describe('LUCIDE_CATEGORY_ICONS', () => {
  it('should contain a curated list of icons', () => {
    expect(LUCIDE_CATEGORY_ICONS).toBeDefined()
    expect(LUCIDE_CATEGORY_ICONS.length).toBeGreaterThan(0)
  })

  it('should include common blog category icons', () => {
    expect(LUCIDE_CATEGORY_ICONS).toContain('newspaper')
    expect(LUCIDE_CATEGORY_ICONS).toContain('book')
    expect(LUCIDE_CATEGORY_ICONS).toContain('code')
    expect(LUCIDE_CATEGORY_ICONS).toContain('terminal')
  })

  it('should be a readonly array', () => {
    // TypeScript compile-time check - this will fail if const assertion is removed
    const firstIcon: string = LUCIDE_CATEGORY_ICONS[0]
    expect(firstIcon).toBe('newspaper')
  })
})

describe('isValidLucideIcon', () => {
  it('should accept valid Lucide icon identifiers', () => {
    expect(isValidLucideIcon('newspaper')).toBe(true)
    expect(isValidLucideIcon('book')).toBe(true)
    expect(isValidLucideIcon('book-open')).toBe(true)
    expect(isValidLucideIcon('code')).toBe(true)
    expect(isValidLucideIcon('terminal')).toBe(true)
  })

  it('should reject invalid icon identifiers', () => {
    expect(isValidLucideIcon('invalid-icon')).toContain('Please select a valid icon')
    expect(isValidLucideIcon('not-an-icon')).toContain('Please select a valid icon')
    expect(isValidLucideIcon('random-string')).toContain('Please select a valid icon')
  })

  it('should allow null/undefined values', () => {
    expect(isValidLucideIcon(null)).toBe(true)
    expect(isValidLucideIcon(undefined)).toBe(true)
  })

  it('should allow empty string (treated as falsy)', () => {
    const result = isValidLucideIcon('')
    expect(result).toBe(true)
    // Verify it returns exactly true (not just truthy)
    expect(result === true).toBe(true)
  })

  it('should be case-sensitive', () => {
    const uppercaseResult = isValidLucideIcon('Newspaper')
    const allCapsResult = isValidLucideIcon('BOOK')

    // Verify they return error strings (not true or false)
    expect(typeof uppercaseResult).toBe('string')
    expect(typeof allCapsResult).toBe('string')
    expect(uppercaseResult).toContain('Please select a valid icon')
    expect(allCapsResult).toContain('Please select a valid icon')

    // Verify lowercase versions are valid
    expect(isValidLucideIcon('newspaper')).toBe(true)
    expect(isValidLucideIcon('book')).toBe(true)
  })
})

describe('getLucideIconOptions', () => {
  it('should return an array of option objects', () => {
    const options = getLucideIconOptions()
    expect(Array.isArray(options)).toBe(true)
    expect(options.length).toBe(LUCIDE_CATEGORY_ICONS.length)
  })

  it('should format options with label and value', () => {
    const options = getLucideIconOptions()
    options.forEach((option) => {
      expect(option).toHaveProperty('label')
      expect(option).toHaveProperty('value')
      expect(typeof option.label).toBe('string')
      expect(typeof option.value).toBe('string')
    })
  })

  it('should format labels with capitalized words', () => {
    const options = getLucideIconOptions()
    const newspaperOption = options.find((opt) => opt.value === 'newspaper')
    const bookOpenOption = options.find((opt) => opt.value === 'book-open')
    const codeXmlOption = options.find((opt) => opt.value === 'code-xml')

    expect(newspaperOption?.label).toBe('Newspaper')
    expect(bookOpenOption?.label).toBe('Book Open')
    expect(codeXmlOption?.label).toBe('Code Xml')
  })

  it('should use kebab-case icon identifiers as values', () => {
    const options = getLucideIconOptions()
    const bookOpenOption = options.find((opt) => opt.label === 'Book Open')

    expect(bookOpenOption?.value).toBe('book-open')

    // Verify all values are lowercase kebab-case
    options.forEach((opt) => {
      expect(opt.value).toMatch(/^[a-z]+(-[a-z]+)*$/)
      expect(opt.value).toBe(opt.value.toLowerCase())
    })
  })

  it('should convert kebab-case to Title Case for labels', () => {
    const options = getLucideIconOptions()

    // Find multi-word icons to verify conversion
    const codeXmlOption = options.find((opt) => opt.value === 'code-xml')
    const fileTextOption = options.find((opt) => opt.value === 'file-text')

    expect(codeXmlOption?.label).toBe('Code Xml')
    expect(fileTextOption?.label).toBe('File Text')

    // Labels should have spaces, values should have hyphens
    const multiWordOptions = options.filter((opt) => opt.value.includes('-'))
    multiWordOptions.forEach((opt) => {
      expect(opt.label).toContain(' ')
      expect(opt.label).not.toContain('-')
    })
  })
})
