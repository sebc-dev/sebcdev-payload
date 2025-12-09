# Phase 1 - Testing Strategy

**Phase**: Article Page Route & Basic Layout
**Test Types**: Unit Tests + Manual Testing

---

## Testing Overview

### Test Pyramid for Phase 1

```
                    ┌─────────────┐
                    │   Manual    │  ← Browser testing
                    │   Testing   │
                    └─────────────┘
              ┌─────────────────────────┐
              │    Integration Tests    │  ← Phase 5 adds these
              │      (Not in Phase 1)   │
              └─────────────────────────┘
        ┌─────────────────────────────────────┐
        │            Unit Tests               │  ← Focus of Phase 1
        │   (Fetch utilities, pure functions) │
        └─────────────────────────────────────┘
```

### What We Test in Phase 1

| Component | Test Type | Coverage Target |
|-----------|-----------|-----------------|
| `getArticleBySlug` | Unit | 100% |
| `mapPayloadToArticleData` | Unit (optional) | 80% |
| `ArticleHeader` | Manual | - |
| `ArticleFooter` | Manual | - |
| Article Page Route | Manual | - |
| 404 Page | Manual | - |

### What We Don't Test Yet

- E2E tests (Phase 5)
- Integration tests with real database
- Visual regression tests
- Accessibility automation (Phase 5)

---

## Unit Testing

### Test Framework: Vitest

This project uses Vitest for unit testing.

#### Running Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit -- tests/unit/lib/payload/articles.spec.ts

# Run tests in watch mode
pnpm test:unit -- --watch

# Run with coverage
pnpm test:unit -- --coverage
```

### Test File Location

```
tests/
└── unit/
    └── lib/
        └── payload/
            └── articles.spec.ts
```

### Test Structure

```typescript
// tests/unit/lib/payload/articles.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('getArticleBySlug', () => {
  // Setup
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test cases
  it('should return article when found', async () => {
    // Arrange
    // Act
    // Assert
  })

  it('should return null when not found', async () => {})
  it('should handle errors gracefully', async () => {})
  it('should filter by published status', async () => {})
  it('should use correct locale', async () => {})
})
```

---

## Unit Tests: Fetch Utilities

### `tests/unit/lib/payload/articles.spec.ts`

#### Complete Test Implementation

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the payload module
const mockFind = vi.fn()
const mockGetPayload = vi.fn().mockResolvedValue({
  find: mockFind,
})

vi.mock('payload', () => ({
  getPayload: () => mockGetPayload(),
}))

vi.mock('@payload-config', () => ({
  default: Promise.resolve({}),
}))

// Import after mocks
import { getArticleBySlug } from '@/lib/payload/articles'

describe('getArticleBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPayload.mockResolvedValue({
      find: mockFind,
    })
  })

  describe('when article exists', () => {
    it('should return the article', async () => {
      const mockArticle = {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
      }
      mockFind.mockResolvedValue({ docs: [mockArticle] })

      const result = await getArticleBySlug('test-article', 'fr')

      expect(result.article).toEqual(mockArticle)
      expect(result.error).toBeUndefined()
    })

    it('should use correct collection and filters', async () => {
      mockFind.mockResolvedValue({ docs: [] })

      await getArticleBySlug('my-slug', 'en')

      expect(mockFind).toHaveBeenCalledWith({
        collection: 'articles',
        locale: 'en',
        where: {
          slug: { equals: 'my-slug' },
          status: { equals: 'published' },
        },
        depth: 2,
        limit: 1,
      })
    })
  })

  describe('when article does not exist', () => {
    it('should return null', async () => {
      mockFind.mockResolvedValue({ docs: [] })

      const result = await getArticleBySlug('non-existent', 'fr')

      expect(result.article).toBeNull()
      expect(result.error).toBeUndefined()
    })
  })

  describe('when an error occurs', () => {
    it('should return null with error message', async () => {
      mockFind.mockRejectedValue(new Error('Database error'))

      const result = await getArticleBySlug('any-slug', 'fr')

      expect(result.article).toBeNull()
      expect(result.error).toBe('Database error')
    })

    it('should handle non-Error exceptions', async () => {
      mockFind.mockRejectedValue('String error')

      const result = await getArticleBySlug('any-slug', 'fr')

      expect(result.article).toBeNull()
      expect(result.error).toBe('Unknown error')
    })
  })

  describe('locale handling', () => {
    it('should pass fr locale correctly', async () => {
      mockFind.mockResolvedValue({ docs: [] })

      await getArticleBySlug('slug', 'fr')

      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({ locale: 'fr' })
      )
    })

    it('should pass en locale correctly', async () => {
      mockFind.mockResolvedValue({ docs: [] })

      await getArticleBySlug('slug', 'en')

      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({ locale: 'en' })
      )
    })
  })
})
```

### Test Coverage Goals

| Function | Branches | Statements | Target |
|----------|----------|------------|--------|
| `getArticleBySlug` | 100% | 100% | Pass |

---

## Manual Testing

### Prerequisites

1. Development server running (`pnpm dev`)
2. At least one published article in CMS
3. Test article slug known (e.g., `test-article-phase-1`)

### Test Scenarios

#### Scenario 1: Article Page Loads Successfully

**Steps**:

1. Navigate to `http://localhost:3000/fr/articles/[valid-slug]`
2. Verify page loads without errors

**Expected Results**:

- [ ] No console errors
- [ ] Page renders with article content
- [ ] Header displays: title, category, complexity, reading time, date
- [ ] Content placeholder visible
- [ ] Footer displays tags (if article has tags)

#### Scenario 2: 404 for Non-Existent Article

**Steps**:

1. Navigate to `http://localhost:3000/fr/articles/non-existent-slug`
2. Verify 404 page displays

**Expected Results**:

- [ ] 404 page renders (not a blank page)
- [ ] Icon visible
- [ ] Title: "Article non trouvé"
- [ ] Description text present
- [ ] "Back to home" button works

#### Scenario 3: English Locale

**Steps**:

1. Navigate to `http://localhost:3000/en/articles/[valid-slug]`
2. Check that content is in English

**Expected Results**:

- [ ] Article content in English (if translated)
- [ ] UI elements in English ("min read", etc.)

#### Scenario 4: 404 in English

**Steps**:

1. Navigate to `http://localhost:3000/en/articles/non-existent-slug`

**Expected Results**:

- [ ] 404 text in English ("Article not found")

#### Scenario 5: Responsive Layout

**Steps**:

1. Open article page
2. Resize browser to mobile width (375px)
3. Check tablet width (768px)
4. Check desktop width (1280px)

**Expected Results**:

- [ ] No horizontal scrolling
- [ ] Text readable at all sizes
- [ ] Tags wrap correctly
- [ ] Header typography scales

#### Scenario 6: Category Badge Navigation

**Steps**:

1. Open article page
2. Click on category badge

**Expected Results**:

- [ ] Navigates to category page
- [ ] (Or 404 if category pages not yet implemented)

#### Scenario 7: Tag Navigation

**Steps**:

1. Open article page with tags
2. Click on a tag pill

**Expected Results**:

- [ ] Navigates to tag page
- [ ] (Or 404 if tag pages not yet implemented)

---

## Testing Commands Reference

### Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit -- tests/unit/lib/payload/articles.spec.ts

# Watch mode
pnpm test:unit -- --watch

# Coverage report
pnpm test:unit -- --coverage

# Verbose output
pnpm test:unit -- --reporter=verbose
```

### Type Checking

```bash
# Check types without emitting
pnpm exec tsc --noEmit
```

### Linting

```bash
# Run ESLint
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### Full Validation

```bash
# Run all checks
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit
```

---

## Test Data

### Minimal Test Article

For manual testing, ensure at least one article with:

```json
{
  "title": "Test Article for Phase 1",
  "slug": "test-article-phase-1",
  "excerpt": "Test excerpt text",
  "status": "published",
  "category": { "name": "Tutoriel", "slug": "tutorial" },
  "tags": [
    { "name": "Next.js", "slug": "nextjs" },
    { "name": "React", "slug": "react" }
  ],
  "complexity": "intermediate",
  "readingTime": 5,
  "content": { "root": { "children": [] } }
}
```

### Edge Case Articles

Consider creating:

1. **Article with no tags**: Test empty footer behavior
2. **Article with many tags**: Test wrap behavior
3. **Article with long title**: Test text truncation
4. **Article in both locales**: Test locale switching

---

## Troubleshooting Tests

### "Module not found" in Tests

```bash
# Ensure tsconfig paths work
pnpm test:unit -- tests/unit/lib/payload/articles.spec.ts

# Check vitest.config.ts has alias configured
```

### Tests Hanging

```bash
# Check for unresolved promises
# Add timeout to test
it('should work', async () => {}, { timeout: 5000 })
```

### Mock Not Working

```typescript
// Ensure mock is before import
vi.mock('payload', () => ({}))

// Import AFTER mock setup
import { getArticleBySlug } from '@/lib/payload/articles'
```

### "Cannot find module @payload-config"

```typescript
// Mock the config module
vi.mock('@payload-config', () => ({
  default: Promise.resolve({}),
}))
```

---

## Next Phase Testing

Phase 5 will add:

- E2E tests with Playwright
- Accessibility testing with axe-core
- Lighthouse performance audits
- Visual regression tests

For now, manual testing covers the user-facing scenarios.

---

**Testing Guide Generated**: 2025-12-09
