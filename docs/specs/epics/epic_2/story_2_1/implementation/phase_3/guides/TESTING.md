# Phase 3 - Testing Guide

Complete testing strategy for Phase 3 (Articles Collection).

---

## 🎯 Testing Strategy

Phase 3 uses a multi-layered testing approach:

1. **Unit Tests**: `calculateReadingTime` hook in isolation
2. **Integration Tests**: Articles collection with Payload Local API
3. **Manual Tests**: Admin UI functionality

**Target Coverage**: >80%
**Estimated Test Count**: 20+ tests

---

## 🧪 Unit Tests

### Purpose

Test the `calculateReadingTime` hook function in isolation, without database or Payload runtime.

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm exec vitest run tests/unit/calculateReadingTime.spec.ts

# Watch mode (during development)
pnpm exec vitest watch tests/unit/calculateReadingTime.spec.ts

# Coverage report
pnpm exec vitest run --coverage tests/unit/calculateReadingTime.spec.ts
```

### Expected Results

```
✓ tests/unit/calculateReadingTime.spec.ts (8 tests) 125ms
  calculateReadingTime hook
    ✓ should handle null content
    ✓ should handle undefined content
    ✓ should handle empty content object
    ✓ should calculate reading time for 100-word content
    ✓ should calculate reading time for 200-word content
    ✓ should round up reading time correctly
    ✓ should extract text from rich formatted content
    ✓ should handle mixed content types (headings, lists, code)

Test Files  1 passed (1)
     Tests  8 passed (8)
```

**Coverage Goal**: >90% for hook logic

### Test Files Structure

```
tests/
└── unit/
    └── calculateReadingTime.spec.ts
```

### Adding New Unit Tests

If you need to test additional edge cases:

1. Open `tests/unit/calculateReadingTime.spec.ts`
2. Add new `it()` block inside the `describe('calculateReadingTime hook')` block
3. Create mock Lexical content structure
4. Call hook with mock data
5. Assert expected reading time

**Example**:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateReadingTime } from '@/hooks/calculateReadingTime'

describe('calculateReadingTime hook', () => {
  it('should handle very long content (1000 words)', async () => {
    const mockData = {
      content: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'word '.repeat(1000), // 1000 words
                },
              ],
            },
          ],
        },
      },
    }

    const result = await calculateReadingTime({
      data: mockData,
      req: {} as any,
      operation: 'create',
    })

    // 1000 words / 200 wpm = 5 minutes
    expect(result.readingTime).toBe(5)
  })
})
```

---

## 🔗 Integration Tests

### Purpose

Test that the Articles collection works correctly with Payload Local API, database, and relations.

### Prerequisites

- [ ] Phase 2 complete (Categories and Tags collections exist)
- [ ] Test user exists (for author relation)
- [ ] Test category exists (for category relation)
- [ ] Test tags exist (for tags relation)
- [ ] Test media uploaded (for featuredImage relation)

### Running Integration Tests

```bash
# Run all integration tests
pnpm test:int

# Run only Articles integration tests
pnpm exec vitest run tests/int/articles.int.spec.ts

# Watch mode
pnpm exec vitest watch tests/int/articles.int.spec.ts

# Coverage
pnpm exec vitest run --coverage tests/int/articles.int.spec.ts
```

### Expected Results

```
✓ tests/int/articles.int.spec.ts (15+ tests) 3.2s
  Articles Collection Integration Tests
    CRUD Operations
      ✓ should create article with required fields
      ✓ should read article by ID
      ✓ should update article
      ✓ should delete article
    i18n Behavior
      ✓ should create in FR and fallback to EN
      ✓ should support localized content in FR and EN
      ✓ should localize SEO fields correctly
    Relations
      ✓ should create article with category relation
      ✓ should create article with multiple tags
      ✓ should create article with author relation
      ✓ should create article with featuredImage
    Hook Execution
      ✓ should calculate reading time for short content
      ✓ should calculate reading time for medium content
      ✓ should handle null/empty content
      ✓ should update reading time when content changes
    Status Workflow
      ✓ should default to draft status
      ✓ should transition from draft to published
      ✓ should transition to archived
    Validation
      ✓ should enforce slug uniqueness
      ✓ should require title and slug

Test Files  1 passed (1)
     Tests  19 passed (19)
```

### Integration Test Structure

```
tests/
└── int/
    └── articles.int.spec.ts
```

### Test Data Management

Integration tests use `beforeAll` and `afterAll` hooks to manage test data:

**Setup (`beforeAll`)**:
1. Initialize Payload with `getPayload()`
2. Create test user
3. Create test category
4. Create test tags (2-3)
5. Upload test media
6. Store IDs in variables

**Teardown (`afterAll`)**:
1. Delete all test articles
2. Delete test user, category, tags, media
3. Clean database

**Example**:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from '@payloadcms/next'
import type { Article, Category, Tag, User, Media } from '@/payload-types'

describe('Articles Collection Integration Tests', () => {
  let payload: any
  let testUserId: string
  let testCategoryId: string
  let testTagIds: string[]
  let testMediaId: string
  let createdArticleIds: string[] = []

  beforeAll(async () => {
    payload = await getPayload({ config: /* ... */ })

    // Create test user
    // NOTE: Setup uses default overrideAccess: true (bypasses access control) - OK for test setup
    const user = await payload.create({
      collection: 'users',
      data: { email: 'test@example.com', password: 'Test1234!' },
      // overrideAccess: true (default) - OK for creating test data
    })
    testUserId = user.id

    // Create test category
    const category = await payload.create({
      collection: 'categories',
      data: { name: 'Test Category', slug: 'test-category' },
    })
    testCategoryId = category.id

    // ... create tags and media
  })

  afterAll(async () => {
    // Delete articles
    for (const id of createdArticleIds) {
      await payload.delete({
        collection: 'articles',
        id,
        // Consider threading req for transaction safety in complex scenarios
      })
    }

    // Delete test data
    await payload.delete({ collection: 'users', id: testUserId })
    await payload.delete({ collection: 'categories', id: testCategoryId })
    // ... delete tags and media
  })

  // Tests here...
})
```

---

## 🎭 Mocking

### When to Mock

For **unit tests**:
- ✅ Mock Payload context (`req`, `operation`)
- ✅ Mock Lexical content structures
- ✅ No database or network calls

For **integration tests**:
- ❌ Don't mock Payload API - use `getPayload()` directly
- ❌ Don't mock database - use real test database
- ✅ Mock external APIs (if any - not applicable for this phase)

### Mock Example (Unit Test)

```typescript
// Mock Lexical content structure
const mockLexicalContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is test content with exactly 10 words here.',
          },
        ],
      },
    ],
  },
}

// Mock Payload hook context
const mockContext = {
  data: { content: mockLexicalContent },
  req: {} as any, // Not used in calculateReadingTime
  operation: 'create' as const,
}

// Call hook
const result = await calculateReadingTime(mockContext)

// Assert
expect(result.readingTime).toBe(1) // 10 words / 200 = 0.05, rounds to 1
```

---

## 📊 Coverage Report

### Generate Coverage

```bash
# Generate coverage for all tests
pnpm exec vitest run --coverage

# Coverage for unit tests only
pnpm exec vitest run --coverage tests/unit

# Coverage for integration tests only
pnpm exec vitest run --coverage tests/int
```

### View Coverage

```bash
# Terminal report (default)
pnpm exec vitest run --coverage

# HTML report (more detailed)
pnpm exec vitest run --coverage --coverage.reporter=html

# Open coverage/index.html in browser
open coverage/index.html
```

### Coverage Goals

| Area                       | Target | Current |
| -------------------------- | ------ | ------- |
| calculateReadingTime hook  | >90%   | -       |
| Articles collection logic  | >80%   | -       |
| Integration test scenarios | 100%   | -       |
| Overall Phase 3            | >80%   | -       |

---

## 🐛 Debugging Tests

### Common Issues

#### Issue: Tests fail locally but pass in CI

**Solutions**:
1. Check Node.js version matches CI (18.20.2+ or 20.9.0+)
2. Clear test cache:
   ```bash
   rm -rf node_modules/.vitest
   pnpm test:unit
   ```
3. Ensure database is clean:
   ```bash
   # Reset local D1
   rm -rf .wrangler/state/v3/d1/miniflare-D1/*
   pnpm dev # Restart to recreate database
   ```

#### Issue: Integration tests are flaky

**Solutions**:
1. Ensure proper cleanup in `afterAll`
2. Don't rely on test execution order
3. Use unique slugs per test (add timestamp):
   ```typescript
   const slug = `test-article-${Date.now()}`
   ```
4. Add delays if needed (race conditions):
   ```typescript
   await new Promise(resolve => setTimeout(resolve, 100))
   ```

#### Issue: Reading time calculation is incorrect

**Solutions**:
1. Verify Lexical content structure matches expected format
2. Check text extraction logic handles all node types
3. Add debug logging temporarily:
   ```typescript
   console.log('Extracted text:', extractedText)
   console.log('Word count:', wordCount)
   console.log('Reading time:', readingTime)
   ```
4. Remove debug logs before committing

### Debug Commands

```bash
# Run single test in verbose mode
pnpm exec vitest run tests/int/articles.int.spec.ts -t "should create article" --reporter=verbose

# Run with Node debugger
node --inspect-brk node_modules/.bin/vitest run tests/unit/calculateReadingTime.spec.ts

# Run tests serially (not parallel) for debugging
pnpm exec vitest run --no-threads tests/int/articles.int.spec.ts
```

---

## 🔒 Security Testing

### Access Control Testing

**CRITICAL**: By default, Payload's Local API **bypasses ALL access control**, even when passing a user.

#### Common Pitfall

```typescript
// ❌ SECURITY BUG: Access control is bypassed!
const articles = await payload.find({
  collection: 'articles',
  user: someUser, // User is passed but permissions are IGNORED
})
// Returns ALL articles regardless of user permissions
```

#### Correct Approach

```typescript
// ✅ SECURE: Enforces access control
const articles = await payload.find({
  collection: 'articles',
  user: someUser,
  overrideAccess: false, // REQUIRED to enforce permissions
})
// Returns only articles the user is authorized to see
```

### When to Use Each

| Scenario | `overrideAccess` | Reason |
|----------|-----------------|---------|
| Test setup (beforeAll) | `true` (default) | Need to create test data without permission checks |
| Test cleanup (afterAll) | `true` (default) | Need to delete all test data |
| Testing permissions | `false` | **MUST** validate actual access control |
| Testing CRUD operations | `false` | Validate real-world behavior |
| System operations | `true` | Trusted server-side operations (cron, migrations) |

### Example: Access Control Test

```typescript
describe('Articles Access Control', () => {
  it('should restrict articles based on user permissions', async () => {
    // Create restricted user (non-admin)
    const restrictedUser = await payload.create({
      collection: 'users',
      data: { email: 'user@example.com', password: 'Test1234!', role: 'user' },
    })

    // Create article owned by different user
    const article = await payload.create({
      collection: 'articles',
      data: {
        title: 'Private Article',
        slug: 'private',
        author: otherUserId,
      },
    })

    // ✅ Test with access control enforced
    const { docs } = await payload.find({
      collection: 'articles',
      user: restrictedUser,
      overrideAccess: false, // CRITICAL
    })

    // Verify restricted user cannot see other users' articles
    expect(docs.find(d => d.id === article.id)).toBeUndefined()
  })
})
```

### Transaction Safety Testing

Thread `req` through nested operations to ensure atomicity:

```typescript
it('should maintain transaction atomicity', async () => {
  // Use a transaction for atomic operations
  await payload.db.beginTransaction(async (req) => {
    const category = await payload.create({
      collection: 'categories',
      data: { name: 'Test', slug: 'test' },
      req, // ✅ Thread req for same transaction
    })

    const article = await payload.create({
      collection: 'articles',
      data: {
        title: 'Test',
        category: category.id,
      },
      req, // ✅ Same transaction
    })

    // If article creation fails, category is rolled back
    return { category, article }
  })
})
```

---

## 🤖 CI/CD Automation

### GitHub Actions

Tests run automatically on:
- [ ] Pull requests to `main`
- [ ] Push to feature branches
- [ ] Scheduled nightly builds (if configured)

### CI Test Commands

From `.github/workflows/quality-gate.yml`:

```yaml
- name: Run Unit Tests
  run: pnpm test:unit

- name: Run Integration Tests
  run: pnpm test:int

- name: Check Coverage
  run: pnpm exec vitest run --coverage --coverage.reporter=json-summary
```

### Required Checks

All PRs must:
- [ ] Pass all unit tests
- [ ] Pass all integration tests
- [ ] Meet coverage threshold (>80%)
- [ ] Pass TypeScript checks
- [ ] Pass linter
- [ ] Pass build

---

## 📝 Manual Testing Checklist

In addition to automated tests, manually verify in admin UI:

### Before Phase 3 (Prerequisites)

- [ ] Can access admin at http://localhost:3000/admin
- [ ] Can login with test user
- [ ] Categories collection visible and has test data
- [ ] Tags collection visible and has test data
- [ ] Media collection visible and has test image

### After Commit 2 (Base Structure)

- [ ] Articles collection appears in admin sidebar
- [ ] Can click "Create New" article
- [ ] Title field is visible and editable
- [ ] Content field uses Lexical editor
- [ ] Excerpt field is visible (textarea)
- [ ] Slug field is visible and required
- [ ] Language toggle (FR/EN) appears in header
- [ ] Switching language toggles localized fields
- [ ] Can save article with FR title/content
- [ ] Switch to EN, add EN translations
- [ ] Save works correctly

### After Commit 3 (Relations & SEO)

- [ ] Featured Image picker appears
  - [ ] Can select existing media
  - [ ] Can upload new media
- [ ] Category picker appears
  - [ ] Shows categories from Phase 2
  - [ ] Can select one category
- [ ] Tags picker appears
  - [ ] Shows tags from Phase 2
  - [ ] Can select multiple tags
- [ ] Author picker appears
  - [ ] Shows users
  - [ ] Can select author
- [ ] SEO group appears
  - [ ] metaTitle field visible
  - [ ] metaDescription field visible
  - [ ] SEO fields switch with language toggle
- [ ] Save article with all relations
- [ ] Edit article, verify relations persisted

### After Commit 4 (Hooks & Workflow)

- [ ] Status field appears with dropdown
  - [ ] Options: draft, published, archived
  - [ ] Defaults to "draft"
- [ ] PublishedAt date picker appears
- [ ] ReadingTime field appears
  - [ ] Is read-only (grayed out)
  - [ ] Shows "- minutes" or similar
- [ ] Create article with ~200 words of content
- [ ] Save article
- [ ] Verify readingTime calculated (~1 minute)
- [ ] Edit article, change content to ~400 words
- [ ] Save again
- [ ] Verify readingTime updated (~2 minutes)
- [ ] Change status to "published"
- [ ] Set publishedAt to today
- [ ] Save and verify
- [ ] List view shows status and publishedAt columns

### After Commit 5 (Tests)

- [ ] All integration tests pass (`pnpm test:int`)
- [ ] No test failures
- [ ] Coverage >80%

### Slug Uniqueness Test

- [ ] Create article with slug "test-unique"
- [ ] Save successfully
- [ ] Try to create another article with slug "test-unique"
- [ ] Expect error: "Slug must be unique" or similar
- [ ] Verify cannot save duplicate slug

### i18n End-to-End Test

- [ ] Create article in FR:
  - [ ] Title: "Article de test"
  - [ ] Content: "Ceci est un article de test en français."
  - [ ] Excerpt: "Résumé en français"
  - [ ] SEO metaTitle: "Article Test FR"
- [ ] Save
- [ ] Switch to EN
- [ ] Add EN translations:
  - [ ] Title: "Test Article"
  - [ ] Content: "This is a test article in English."
  - [ ] Excerpt: "Summary in English"
  - [ ] SEO metaTitle: "Test Article EN"
- [ ] Save
- [ ] Switch back to FR, verify FR content displays
- [ ] Switch to EN, verify EN content displays
- [ ] View article in list, verify title shows correctly

---

## ✅ Testing Checklist

Before marking Phase 3 complete:

### Automated Tests

- [ ] All unit tests pass (`pnpm test:unit`)
- [ ] All integration tests pass (`pnpm test:int`)
- [ ] Coverage >80%
- [ ] No skipped tests (unless justified)
- [ ] No console errors/warnings during tests
- [ ] Tests run in CI successfully

### Manual Tests

- [ ] All manual testing checklist items completed (above)
- [ ] No errors in browser console
- [ ] No errors in terminal logs
- [ ] Admin UI responsive and functional
- [ ] All relations work as expected
- [ ] Reading time calculation verified manually
- [ ] Status workflow tested manually
- [ ] i18n verified in both FR and EN

### Quality Checks

- [ ] TypeScript compiles (`pnpm exec tsc --noEmit`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build` - if required)
- [ ] No deprecation warnings

---

## 📚 Best Practices

### Writing Tests

✅ **Do**:
- Test behavior, not implementation details
- Use descriptive test names (`should calculate reading time for 200 words`)
- Test edge cases (null, empty, very large values)
- Keep tests independent (don't rely on execution order)
- Clean up test data in `afterAll`

❌ **Don't**:
- Test Payload framework internals
- Over-mock (test real integration where possible)
- Write flaky tests (random failures)
- Ignore failing tests
- Hardcode IDs or values (use variables)

### Test Naming Convention

```typescript
// Good
it('should calculate reading time for 200-word article', () => { /* ... */ })
it('should default status to draft when creating article', () => { /* ... */ })

// Bad
it('test reading time', () => { /* ... */ })
it('status', () => { /* ... */ })
```

### Organizing Tests

```typescript
describe('Articles Collection Integration Tests', () => {
  describe('CRUD Operations', () => {
    it('should create article', () => { /* ... */ })
    it('should read article', () => { /* ... */ })
    it('should update article', () => { /* ... */ })
    it('should delete article', () => { /* ... */ })
  })

  describe('Relations', () => {
    it('should relate to category', () => { /* ... */ })
    it('should relate to tags', () => { /* ... */ })
  })
})
```

---

## ❓ FAQ

**Q: How much should I test?**
A: Aim for >80% coverage, but focus on critical paths and edge cases. 100% coverage doesn't guarantee bug-free code.

**Q: Should I test the Lexical editor itself?**
A: No, test that your hook correctly processes Lexical output, not the editor functionality.

**Q: Tests are slow, what to do?**
A: Run only affected tests during dev (`vitest watch`), full suite before commit. Consider parallelization.

**Q: Can I skip integration tests during development?**
A: You can skip them for speed during active coding, but always run before committing.

**Q: What if a test is flaky?**
A: Fix it immediately. Flaky tests erode confidence in the test suite. Add proper waits, cleanup, or isolation.

**Q: Should I test in production mode?**
A: Not necessary for Phase 3. Development mode is sufficient. Production testing happens in CI/CD.

---

**Testing is critical for quality! Ensure all tests pass before considering Phase 3 complete. 🧪**
