# Phase 3 - Post-Implementation Validation Checklist

Complete validation checklist to be performed **AFTER** implementing Phase 3 with corrected code.

---

## 🎯 Purpose

This checklist ensures that the Phase 3 implementation:
1. ✅ Fixes all identified issues from the documentation review
2. ✅ Follows Payload CMS best practices
3. ✅ Passes all security and quality checks
4. ✅ Is ready for production deployment

---

## ✅ 1. Code Review - Hook Implementation

### File: `src/hooks/calculateReadingTime.ts`

- [ ] **Type Safety**
  - [ ] Hook signature is `CollectionBeforeChangeHook<Article>`
  - [ ] Imports `Article` type from `@/payload-types`
  - [ ] No `any` types used (except in type guards if needed)

- [ ] **Infinite Loop Protection**
  - [ ] Hook includes `context` parameter
  - [ ] Checks `context?.skipReadingTimeHook` before processing
  - [ ] Returns early if skip flag is true

- [ ] **Error Handling**
  - [ ] Try-catch block around reading time calculation
  - [ ] Graceful fallback (readingTime = 0) on error
  - [ ] Error logged but doesn't fail the operation

- [ ] **Algorithm Correctness**
  - [ ] Extracts text from Lexical JSON correctly
  - [ ] Handles all node types: root, paragraph, heading, list, text
  - [ ] Word count uses `/\s+/` regex split
  - [ ] Reading time uses 200 words/minute constant
  - [ ] Reading time rounds up with `Math.ceil()`

- [ ] **Documentation**
  - [ ] JSDoc comment with description
  - [ ] Documents reading speed assumption (200 wpm)
  - [ ] Includes examples in JSDoc
  - [ ] Explains edge case handling

### Validation Commands

```bash
# Type check
pnpm exec tsc --noEmit src/hooks/calculateReadingTime.ts

# Should output: No errors
```

---

## ✅ 2. Code Review - Collection Configuration

### File: `src/collections/Articles.ts`

- [ ] **Slug Field Auto-generation**
  - [ ] Slug field has `beforeChange` hook
  - [ ] Hook only generates on `create` operation
  - [ ] Hook checks if slug already provided
  - [ ] Uses slugify function (similar to Categories/Tags)
  - [ ] Slug has `index: true` for performance

- [ ] **Author Field Auto-set**
  - [ ] Author field has `beforeChange` hook
  - [ ] Hook sets author to `req.user.id` on create
  - [ ] Only sets if not already provided

- [ ] **PublishedAt Auto-set**
  - [ ] publishedAt has `beforeChange` hook
  - [ ] Auto-sets date when `status === 'published'`
  - [ ] Only sets if not already provided
  - [ ] Has `admin.condition` to show only when published

- [ ] **Hook Integration**
  - [ ] `calculateReadingTime` imported from `@/hooks`
  - [ ] Hook added to `hooks.beforeChange` array
  - [ ] Hook reference (not invoked): `[calculateReadingTime]`

- [ ] **Admin UI**
  - [ ] `admin.group: 'Content'` added (consistent with Categories/Tags)
  - [ ] `defaultColumns` includes: title, status, publishedAt, author
  - [ ] `listSearchableFields` includes: title, slug, excerpt
  - [ ] readingTime has `admin.position: 'sidebar'`
  - [ ] status and publishedAt have `admin.position: 'sidebar'`

### Validation Commands

```bash
# Type check
pnpm exec tsc --noEmit src/collections/Articles.ts

# Regenerate types
pnpm generate:types:payload

# Verify Article type exists
grep "export interface Article" src/payload-types.ts
```

---

## ✅ 3. Unit Tests Validation

### File: `tests/unit/calculateReadingTime.spec.ts`

- [ ] **Test Coverage**
  - [ ] Null content test
  - [ ] Undefined content test
  - [ ] Empty content test
  - [ ] 100-word content (rounds up to 1 min)
  - [ ] 200-word content (exactly 1 min)
  - [ ] 400-word content (exactly 2 min)
  - [ ] Rounding test (e.g., 250 words → 2 min)
  - [ ] Rich formatted content (bold, italic)
  - [ ] Mixed content types (headings, paragraphs, lists)
  - [ ] Skip hook with `context.skipReadingTimeHook`

- [ ] **Test Quality**
  - [ ] All tests pass
  - [ ] Clear test descriptions (`it('should ...')`)
  - [ ] Proper use of `expect()` matchers
  - [ ] No hardcoded values (use variables/helpers)
  - [ ] Helper function `createMockContent()` used

### Validation Commands

```bash
# Run unit tests
pnpm test:unit

# Run with coverage
pnpm exec vitest run --coverage tests/unit/calculateReadingTime.spec.ts

# Expected: >90% coverage, all tests passing
```

---

## ✅ 4. Integration Tests Validation

### File: `tests/int/articles.int.spec.ts`

- [ ] **CRUD Tests**
  - [ ] Create article
  - [ ] Read article by ID
  - [ ] Update article
  - [ ] Delete article

- [ ] **i18n Tests**
  - [ ] Create in FR, verify EN fallback
  - [ ] Localized content (FR and EN)
  - [ ] SEO fields localization

- [ ] **Relations Tests**
  - [ ] Category relation
  - [ ] Tags relation (hasMany)
  - [ ] Author relation
  - [ ] FeaturedImage relation

- [ ] **Hook Tests**
  - [ ] Reading time for 100 words
  - [ ] Reading time for 400 words
  - [ ] Reading time updates on content change
  - [ ] Null/empty content handling

- [ ] **Workflow Tests**
  - [ ] Default status is 'draft'
  - [ ] Transition: draft → published
  - [ ] Transition: published → archived

- [ ] **Validation Tests**
  - [ ] Slug uniqueness enforced
  - [ ] Required fields enforced (title, slug)

- [ ] **🔒 SECURITY TESTS (CRITICAL)**
  - [ ] Access control test with `overrideAccess: false`
  - [ ] Restricted user cannot see other users' articles
  - [ ] Admin user can see all articles
  - [ ] Test uses `overrideAccess: false` for queries

- [ ] **Setup/Teardown**
  - [ ] `beforeAll` creates test data
  - [ ] `afterAll` cleans up all test data
  - [ ] Unique slugs (using timestamps)
  - [ ] Comments explain `overrideAccess: true` in setup (OK for setup)

### Validation Commands

```bash
# Run integration tests
pnpm test:int

# Run only Articles tests
pnpm exec vitest run tests/int/articles.int.spec.ts

# Expected: 20+ tests passing (including security tests)
```

---

## ✅ 5. Security Validation

### Critical Checks

- [ ] **Access Control**
  - [ ] Integration tests use `overrideAccess: false` when testing permissions
  - [ ] Tests verify restricted user permissions work
  - [ ] Tests verify admin permissions work
  - [ ] No tests pass user without `overrideAccess: false` (except setup/teardown)

- [ ] **Hook Safety**
  - [ ] `calculateReadingTime` checks `context?.skipReadingTimeHook`
  - [ ] No risk of infinite loops in hooks
  - [ ] Error handling prevents operation failure

- [ ] **Input Validation**
  - [ ] Slug uniqueness enforced at DB level
  - [ ] Required fields validated
  - [ ] Slug format validated (if custom validator added)

### Manual Security Test

```bash
# Start dev server
pnpm dev

# 1. Create article as admin
# 2. Create non-admin user
# 3. Try to access article as non-admin via API
#    - Should respect access control

# Test access control enforcement
curl http://localhost:3000/api/articles \
  -H "Authorization: Bearer <non-admin-token>"

# Should only return articles the user can access
```

---

## ✅ 6. Admin UI Manual Validation

### Visual Checks

- [ ] **Collection Visibility**
  - [ ] Articles collection appears in admin sidebar
  - [ ] Collection is in "Content" group (with Categories/Tags)
  - [ ] Collection icon displays (if configured)

- [ ] **Create Article Form**
  - [ ] Title field (localized)
  - [ ] Slug field
    - [ ] Auto-generated from title when empty
    - [ ] Can be manually edited
  - [ ] Content field (Lexical editor, localized)
  - [ ] Excerpt field (localized)
  - [ ] FeaturedImage picker
  - [ ] Category picker (dropdown)
  - [ ] Tags picker (multi-select)
  - [ ] Author picker
    - [ ] Auto-set to current user
    - [ ] Can be changed
  - [ ] SEO group (expandable)
    - [ ] metaTitle (localized)
    - [ ] metaDescription (localized)
  - [ ] **Sidebar Fields**
    - [ ] ReadingTime (read-only, grayed out)
    - [ ] Status (dropdown: draft/published/archived)
    - [ ] PublishedAt (date picker)
      - [ ] Only shows when status = published

- [ ] **Language Toggle**
  - [ ] Toggle visible in header
  - [ ] Switch FR → EN updates localized fields
  - [ ] Title, content, excerpt, SEO fields switch
  - [ ] Non-localized fields (slug, status, etc.) don't switch

- [ ] **List View**
  - [ ] Columns: title, status, publishedAt, author
  - [ ] Can sort by columns
  - [ ] Can search by title, slug, excerpt

- [ ] **Hook Execution**
  - [ ] Create article with ~200 words
  - [ ] Save → readingTime shows ~1 minute
  - [ ] Edit → add ~200 more words (total ~400)
  - [ ] Save → readingTime updates to ~2 minutes
  - [ ] ReadingTime field is read-only (grayed out)

### Test Workflow

```bash
# 1. Start dev server
pnpm dev

# 2. Navigate to http://localhost:3000/admin

# 3. Login

# 4. Go to Articles collection

# 5. Create New Article
#    - Enter title: "Test Article" (FR)
#    - Verify slug auto-generates: "test-article"
#    - Add content (~200 words)
#    - Select category
#    - Select 2-3 tags
#    - Verify author auto-set to current user
#    - Fill SEO fields
#    - Save

# 6. Verify
#    - Article saved successfully
#    - ReadingTime shows ~1 minute
#    - Status is 'draft'

# 7. Switch to EN
#    - Add EN translations
#    - Save

# 8. Change status to 'published'
#    - Verify publishedAt field appears
#    - Verify publishedAt auto-sets to today
#    - Save

# 9. Edit article
#    - Add more content (~200 words, total ~400)
#    - Save
#    - Verify readingTime updates to ~2 minutes

# 10. Try creating duplicate slug
#     - Create new article with slug "test-article"
#     - Should fail with unique constraint error
```

---

## ✅ 7. Type Safety Validation

### Generated Types

- [ ] **Regenerate Types**
  ```bash
  pnpm generate:types:payload
  ```

- [ ] **Verify Article Type**
  - [ ] `Article` interface exists in `src/payload-types.ts`
  - [ ] All fields present with correct types:
    - `title: string`
    - `slug: string`
    - `content: { root: { ... } }`
    - `excerpt: string | null`
    - `featuredImage: Media | string | null`
    - `category: Category | string | null`
    - `tags: (Tag | string)[] | null`
    - `author: User | string`
    - `seo: { metaTitle?: string, metaDescription?: string }`
    - `status: 'draft' | 'published' | 'archived'`
    - `publishedAt: string | null`
    - `readingTime: number | null`
    - `createdAt: string`
    - `updatedAt: string`

### TypeScript Compilation

```bash
# Type check entire project
pnpm exec tsc --noEmit

# Expected: "Found 0 errors"
```

---

## ✅ 8. Code Quality Validation

### Linting

```bash
# Run ESLint
pnpm lint

# Expected: No errors
```

### Formatting

```bash
# Check formatting
pnpm format:check

# Or auto-fix
pnpm format
```

### Architecture Validation

```bash
# Run dependency-cruiser
pnpm depcruise

# Expected: No violations
```

---

## ✅ 9. Build Validation

### Next.js Build

```bash
# Build application
pnpm build

# Expected: Build succeeds with no errors
```

### Migration Check

```bash
# Verify migration exists
ls src/migrations/ | grep articles

# Should show migration file for articles table

# Check migration applied
pnpm payload migrate:status

# Should show articles migration as applied
```

---

## ✅ 10. Documentation Validation

### Code Documentation

- [ ] **Hook File**
  - [ ] JSDoc comments on exported function
  - [ ] Helper functions documented
  - [ ] Examples in JSDoc

- [ ] **Collection File**
  - [ ] Field descriptions in `admin.description`
  - [ ] Complex logic commented
  - [ ] No TODO comments left

- [ ] **Test Files**
  - [ ] Clear test descriptions
  - [ ] Helper functions documented
  - [ ] Edge cases explained

### Spec Documentation

- [ ] **INDEX.md**
  - [ ] Status updated to ✅ COMPLETED
  - [ ] Actual metrics filled in

- [ ] **EPIC_TRACKING.md**
  - [ ] Phase 3 marked complete
  - [ ] Progress updated to 3/5

---

## ✅ 11. Performance Validation

### Reading Time Calculation Performance

```typescript
// Create test with very long content (10,000 words)
const longContent = { root: { children: [/* ... */] } }

console.time('calculateReadingTime')
await calculateReadingTime({ data: { content: longContent }, ... })
console.timeEnd('calculateReadingTime')

// Expected: <50ms for 10,000 words
```

### Query Performance

```bash
# Create 100+ articles for testing
# Then test query performance

# List articles (paginated)
time curl http://localhost:3000/api/articles?limit=10

# Expected: <200ms
```

---

## ✅ 12. Regression Testing

### Existing Collections

- [ ] **Categories Collection**
  - [ ] Still functional
  - [ ] Can create/edit/delete
  - [ ] Slug generation works

- [ ] **Tags Collection**
  - [ ] Still functional
  - [ ] Can create/edit/delete
  - [ ] Slug generation works

- [ ] **Users Collection**
  - [ ] Can create users
  - [ ] Authentication works

- [ ] **Media Collection**
  - [ ] Can upload media
  - [ ] R2 storage works

### Integration

```bash
# Run ALL integration tests (Phases 1, 2, 3)
pnpm test:int

# Expected: All tests pass
```

---

## 📊 Final Validation Summary

| Category | Status | Notes |
|----------|--------|-------|
| **Hook Implementation** | ⏳ | Type safety, infinite loop protection, error handling |
| **Collection Config** | ⏳ | Auto-generation, admin UI, hooks integration |
| **Unit Tests** | ⏳ | >90% coverage, all edge cases |
| **Integration Tests** | ⏳ | 20+ tests including security tests |
| **Security** | ⏳ | Access control, hook safety, input validation |
| **Admin UI** | ⏳ | All fields render, hooks execute, workflow works |
| **Type Safety** | ⏳ | Types generated, no TS errors |
| **Code Quality** | ⏳ | Lint, format, architecture validation |
| **Build** | ⏳ | Next.js build succeeds, migrations applied |
| **Documentation** | ⏳ | Code comments, spec updates |
| **Performance** | ⏳ | Reading time <50ms, queries <200ms |
| **Regression** | ⏳ | Existing collections still work |

---

## 🎯 Approval Criteria

**Phase 3 is APPROVED when:**

✅ All checkboxes in this document are checked
✅ All automated tests pass (unit + integration)
✅ Manual Admin UI validation completed
✅ Security tests verify access control enforcement
✅ Build succeeds with no errors
✅ No regressions in existing functionality

**Status**: 🟡 **PENDING VALIDATION**

**Validated by**: _________________
**Date**: _________________
**Signature**: _________________

---

## 🚀 Next Steps After Approval

1. ✅ Update INDEX.md → Status: COMPLETED
2. ✅ Update EPIC_TRACKING.md → Progress: 3/5
3. ✅ Create git tag: `git tag -a phase-3-complete -m "Phase 3: Articles Collection complete"`
4. ✅ Merge to main branch (if using feature branch)
5. ✅ Deploy to staging for final validation
6. ✅ Proceed to Phase 4 (Pages Collection) or Phase 5 (Integration & Validation)

---

**Phase 3 Post-Implementation Validation Checklist Complete! 🎉**
