# Phase 1: TOC Data Extraction - Testing Guide

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 1 - TOC Data Extraction

---

## Testing Strategy Overview

### Test Types for This Phase

| Type | Coverage | Tools | Files |
|------|----------|-------|-------|
| Unit Tests | Functions, utilities | Vitest | `tests/unit/lib/toc/*.spec.ts` |
| Integration Tests | N/A | - | - |
| E2E Tests | N/A (Phase 4) | - | - |

This phase focuses on **unit tests only** since all code is pure utility functions without UI or database dependencies.

---

## Test Framework: Vitest

### Configuration

The project uses Vitest with the following configuration:

```typescript
// vitest.config.ts (relevant excerpt)
{
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
    exclude: ['tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

### Commands

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/lib/toc/extract-headings.spec.ts

# Run tests in watch mode
pnpm test:unit --watch

# Run tests with coverage
pnpm test:unit --coverage

# Run tests with UI
pnpm test:unit --ui
```

---

## Test Structure

### File Organization

```
tests/
└── unit/
    └── lib/
        └── toc/
            └── extract-headings.spec.ts  # All TOC tests
```

### Test File Template

```typescript
/**
 * TOC Extraction Unit Tests
 *
 * Tests for extractTOCHeadings() function and slugify utility.
 */

import { describe, it, expect } from 'vitest'
import { extractTOCHeadings, slugify } from '@/lib/toc'
import type { LexicalContent } from '@/components/richtext/types'

describe('moduleName', () => {
  describe('functionName', () => {
    it('should [expected behavior]', () => {
      // Arrange
      const input = /* ... */

      // Act
      const result = functionName(input)

      // Assert
      expect(result).toEqual(/* expected */)
    })
  })
})
```

---

## Test Cases by Function

### slugify() Tests

#### Test Group: Basic Transformations

| # | Test Name | Input | Expected Output |
|---|-----------|-------|-----------------|
| 1 | lowercase | `"Hello World"` | `"hello-world"` |
| 2 | spaces to hyphens | `"multiple words here"` | `"multiple-words-here"` |
| 3 | accent removal | `"Café Résumé"` | `"cafe-resume"` |
| 4 | special chars | `"Hello! @World#"` | `"hello-world"` |
| 5 | hyphen collapse | `"hello---world"` | `"hello-world"` |
| 6 | trim whitespace | `"  hello world  "` | `"hello-world"` |

#### Test Group: Edge Cases

| # | Test Name | Input | Expected Output |
|---|-----------|-------|-----------------|
| 7 | empty string | `""` | `""` |
| 8 | only special chars | `"!@#$%"` | `""` |
| 9 | numbers preserved | `"React 18"` | `"react-18"` |
| 10 | mixed content | `"L'été 2023!"` | `"lete-2023"` |

### extractTOCHeadings() Tests

#### Test Group: Basic Extraction

| # | Test Name | Input Content | Expected Result |
|---|-----------|---------------|-----------------|
| 1 | h2 extraction | Single h2 | Array with 1 heading, level 2 |
| 2 | h3 extraction | Single h3 | Array with 1 heading, level 3 |
| 3 | mixed headings | h2, h3, h2 | Array with 3 headings |
| 4 | with paragraphs | h2, p, h2 | Array with 2 headings (p ignored) |

#### Test Group: Filtering

| # | Test Name | Input Content | Expected Result |
|---|-----------|---------------|-----------------|
| 5 | ignore h1 | h1, h2 | Array with 1 heading (h2 only) |
| 6 | ignore h4+ | h2, h4, h5, h6 | Array with 1 heading (h2 only) |

#### Test Group: Null/Empty Handling

| # | Test Name | Input | Expected Result |
|---|-----------|-------|-----------------|
| 7 | null content | `null` | `[]` |
| 8 | undefined content | `undefined` | `[]` |
| 9 | empty root | `{ root: { children: [] } }` | `[]` |
| 10 | missing root | `{}` | `[]` |

#### Test Group: Empty Headings

| # | Test Name | Input | Expected Result |
|---|-----------|-------|-----------------|
| 11 | empty text | h2 with `""` | Skip, not in result |
| 12 | whitespace only | h2 with `"   "` | Skip, not in result |

#### Test Group: Nested Content

| # | Test Name | Input | Expected Result |
|---|-----------|-------|-----------------|
| 13 | link in heading | h2 with `<a>` child | Text extracted from link |
| 14 | formatted text | h2 with bold/italic | All text combined |

#### Test Group: ID Generation

| # | Test Name | Input | Expected Result |
|---|-----------|-------|-----------------|
| 15 | special chars | `"What is React?"` | `id: "what-is-react"` |
| 16 | accents | `"Méthodologie"` | `id: "methodologie"` |

#### Test Group: Order Preservation

| # | Test Name | Input | Expected Result |
|---|-----------|-------|-----------------|
| 17 | order preserved | h2, h3, h2, h3 | Same order in output |

---

## Test Fixtures

### Helper Functions

```typescript
/**
 * Create minimal Lexical content structure
 */
function createLexicalContent(
  children: (HeadingNode | ParagraphNode)[]
): LexicalContent {
  return {
    root: {
      type: 'root',
      version: 1,
      children,
    },
  }
}

/**
 * Create heading node
 */
function createHeading(
  tag: HeadingNode['tag'],
  text: string
): HeadingNode {
  return {
    type: 'heading',
    tag,
    version: 1,
    children: [
      { type: 'text', text, format: 0, version: 1 }
    ],
  }
}

/**
 * Create paragraph node
 */
function createParagraph(text: string): ParagraphNode {
  return {
    type: 'paragraph',
    version: 1,
    children: [
      { type: 'text', text, format: 0, version: 1 }
    ],
  }
}
```

### Complex Fixtures

```typescript
/**
 * Heading with nested link
 */
const headingWithLink: LexicalContent = {
  root: {
    type: 'root',
    version: 1,
    children: [
      {
        type: 'heading',
        tag: 'h2',
        version: 1,
        children: [
          { type: 'text', text: 'Check out ', format: 0, version: 1 },
          {
            type: 'link',
            version: 1,
            fields: { url: 'https://example.com' },
            children: [
              { type: 'text', text: 'this link', format: 0, version: 1 }
            ],
          },
        ],
      },
    ],
  },
}

/**
 * Typical article structure
 */
const typicalArticle = createLexicalContent([
  createHeading('h2', 'Introduction'),
  createParagraph('Welcome to this article...'),
  createHeading('h2', 'Getting Started'),
  createHeading('h3', 'Prerequisites'),
  createParagraph('You will need...'),
  createHeading('h3', 'Installation'),
  createParagraph('Run the following command...'),
  createHeading('h2', 'Conclusion'),
])
```

---

## Assertion Patterns

### Type Assertions

```typescript
// Check type of result
expect(result).toBeInstanceOf(Array)

// Check specific type shape
expect(result[0]).toMatchObject({
  id: expect.any(String),
  text: expect.any(String),
  level: expect.any(Number),
})
```

### Value Assertions

```typescript
// Exact match
expect(result).toEqual([
  { id: 'introduction', text: 'Introduction', level: 2 }
])

// Partial match
expect(result[0]).toMatchObject({ level: 2 })

// Property check
expect(result[0]).toHaveProperty('id', 'introduction')
```

### Array Assertions

```typescript
// Length check
expect(result).toHaveLength(3)

// Empty array
expect(result).toEqual([])

// Contains item
expect(result).toContainEqual({ id: 'intro', text: 'Intro', level: 2 })
```

---

## Coverage Requirements

### Minimum Thresholds

| Metric | Threshold |
|--------|-----------|
| Statements | 80% |
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |

### Coverage Report

```bash
# Generate coverage report
pnpm test:unit --coverage tests/unit/lib/toc/

# View HTML report
open coverage/index.html
```

### Expected Coverage

| File | Expected Coverage |
|------|-------------------|
| `types.ts` | 100% (types only) |
| `slugify.ts` | >95% |
| `extract-headings.ts` | >85% |
| `index.ts` | 100% (re-exports) |

---

## Test Quality Checklist

### Per Test

- [ ] Clear, descriptive test name
- [ ] Single assertion focus (one behavior per test)
- [ ] Uses Arrange-Act-Assert pattern
- [ ] No test interdependencies
- [ ] No shared mutable state

### Per Test File

- [ ] Logical grouping with `describe` blocks
- [ ] Helper functions for fixture creation
- [ ] No console.log or debug output
- [ ] All tests independent (can run in any order)

### Overall

- [ ] Coverage meets thresholds
- [ ] All edge cases covered
- [ ] Real-world scenarios tested
- [ ] No skipped tests (`.skip`)
- [ ] No focused tests (`.only`)

---

## Debugging Tests

### Run Single Test

```bash
# Run specific test by name pattern
pnpm test:unit -t "should extract h2 headings"
```

### Watch Mode

```bash
# Re-run tests on file change
pnpm test:unit --watch
```

### Debug Output

```typescript
// Temporarily add for debugging (remove before commit)
it('debug test', () => {
  const result = extractTOCHeadings(content)
  console.log(JSON.stringify(result, null, 2))
  expect(result).toHaveLength(3)
})
```

### VSCode Integration

1. Install "Vitest" extension
2. Click test icon in sidebar
3. Run/debug individual tests with breakpoints

---

## Integration with CI

Tests are run automatically in the CI pipeline:

```yaml
# .github/workflows/tests.yml (excerpt)
jobs:
  test:
    steps:
      - run: pnpm test:unit
```

### Pre-Commit Hook

If enabled, tests run before each commit:

```bash
# Manual pre-commit check
pnpm test:unit && pnpm lint && pnpm exec tsc --noEmit
```

---

## Common Test Patterns

### Testing Null Safety

```typescript
it('should handle null content', () => {
  expect(extractTOCHeadings(null)).toEqual([])
})

it('should handle undefined content', () => {
  expect(extractTOCHeadings(undefined)).toEqual([])
})
```

### Testing Edge Cases

```typescript
it('should skip empty headings', () => {
  const content = createLexicalContent([
    createHeading('h2', ''),
    createHeading('h2', 'Valid'),
  ])

  const result = extractTOCHeadings(content)

  expect(result).toHaveLength(1)
  expect(result[0].text).toBe('Valid')
})
```

### Testing Complex Structures

```typescript
it('should extract text from nested structures', () => {
  const content: LexicalContent = {
    root: {
      type: 'root',
      version: 1,
      children: [
        {
          type: 'heading',
          tag: 'h2',
          version: 1,
          children: [
            { type: 'text', text: 'Hello ', format: 0, version: 1 },
            {
              type: 'link',
              version: 1,
              fields: { url: '#' },
              children: [
                { type: 'text', text: 'World', format: 0, version: 1 }
              ],
            },
          ],
        },
      ],
    },
  }

  const result = extractTOCHeadings(content)

  expect(result[0].text).toBe('Hello World')
})
```

---

## Next Steps After Testing

1. Verify all tests pass: `pnpm test:unit`
2. Check coverage meets thresholds
3. Run full quality check: `pnpm test:unit && pnpm lint && pnpm exec tsc --noEmit`
4. Proceed to code review: [guides/REVIEW.md](./REVIEW.md)

---

**Testing Guide Generated**: 2025-12-10
**Last Updated**: 2025-12-10
