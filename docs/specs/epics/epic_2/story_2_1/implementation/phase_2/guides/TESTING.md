# Phase 2: Categories & Tags Collections - Testing Guide

## Overview

This guide outlines the testing strategy for Phase 2. It covers manual testing, integration testing, and verification procedures for the Categories and Tags collections.

---

## Testing Summary

| Test Type   | Scope                  | When to Run       | Estimated Time |
| ----------- | ---------------------- | ----------------- | -------------- |
| Manual      | UI functionality       | After each commit | 15-30 min      |
| Integration | API/CRUD operations    | After Commit 4    | 10 min         |
| Build       | Compilation/Deployment | After Commit 4    | 5 min          |
| Regression  | Existing functionality | Final validation  | 10 min         |

**Total Testing Time**: ~1 hour

---

## Manual Testing

### Prerequisites

- [ ] Dev server running (`pnpm dev`)
- [ ] Admin credentials available
- [ ] Browser with dev tools open

### Test Case MT-1: Categories Collection Visibility

**Objective**: Verify Categories collection appears in admin

**Steps**:

1. Navigate to `http://localhost:3000/admin`
2. Login with admin credentials
3. Look for "Content" group in sidebar
4. Verify "Categories" appears under Content group

**Expected Results**:

- [ ] Categories link visible in sidebar
- [ ] Clicking opens Categories list view
- [ ] "Create New" button visible

**Pass/Fail**: [ ]

---

### Test Case MT-2: Tags Collection Visibility

**Objective**: Verify Tags collection appears in admin

**Steps**:

1. Navigate to `http://localhost:3000/admin`
2. Look for "Content" group in sidebar
3. Verify "Tags" appears under Content group

**Expected Results**:

- [ ] Tags link visible in sidebar
- [ ] Clicking opens Tags list view
- [ ] "Create New" button visible

**Pass/Fail**: [ ]

---

### Test Case MT-3: Create Category (FR)

**Objective**: Create a category in French locale

**Steps**:

1. Navigate to Categories
2. Click "Create New"
3. Verify locale is set to French (FR)
4. Fill in fields:
   - Name: "Actualites"
   - Slug: "actualites"
   - Description: "Les dernieres nouvelles"
   - Color: "#3498DB"
   - Icon: "newspaper"
5. Click "Save"

**Expected Results**:

- [ ] Category saved successfully
- [ ] Redirected to category edit view
- [ ] Toast notification shows success
- [ ] All field values preserved

**Pass/Fail**: [ ]

---

### Test Case MT-4: Create Category - Localization

**Objective**: Add English translation to category

**Steps**:

1. Open the category created in MT-3
2. Switch to English (EN) locale using language toggle
3. Verify localized fields show French content (fallback)
4. Update localized fields:
   - Name: "News"
   - Description: "Latest news and updates"
5. Click "Save"
6. Switch back to French locale
7. Verify French content is preserved

**Expected Results**:

- [ ] English locale shows French content as fallback initially
- [ ] Can enter English translations
- [ ] Save preserves English content
- [ ] French content unchanged when switching back

**Pass/Fail**: [ ]

---

### Test Case MT-5: Create Category - Unique Slug Validation

**Objective**: Verify slug uniqueness is enforced

**Steps**:

1. Navigate to Categories
2. Click "Create New"
3. Fill in fields:
   - Name: "Duplicate Test"
   - Slug: "actualites" (same as existing)
4. Click "Save"

**Expected Results**:

- [ ] Error message displayed
- [ ] Category NOT created
- [ ] Message indicates slug must be unique

**Pass/Fail**: [ ]

---

### Test Case MT-6: Create Tag (FR)

**Objective**: Create a tag in French locale

**Steps**:

1. Navigate to Tags
2. Click "Create New"
3. Verify locale is set to French (FR)
4. Fill in fields:
   - Name: "TypeScript"
   - Slug: "typescript"
5. Click "Save"

**Expected Results**:

- [ ] Tag saved successfully
- [ ] Redirected to tag edit view
- [ ] All field values preserved

**Pass/Fail**: [ ]

---

### Test Case MT-7: Create Tag - Localization

**Objective**: Add English translation to tag

**Steps**:

1. Open the tag created in MT-6
2. Switch to English (EN) locale
3. Verify name shows French content (fallback)
4. Update name: "TypeScript" (same in this case)
5. Click "Save"

**Expected Results**:

- [ ] English locale works correctly
- [ ] Can save English translation
- [ ] Switching locales preserves content

**Pass/Fail**: [ ]

---

### Test Case MT-8: Edit Category

**Objective**: Verify category editing works

**Steps**:

1. Navigate to Categories
2. Click on existing category
3. Modify color field to "#E74C3C"
4. Click "Save"
5. Refresh page
6. Verify color is updated

**Expected Results**:

- [ ] Edit form loads with existing data
- [ ] Changes can be saved
- [ ] Changes persist after refresh

**Pass/Fail**: [ ]

---

### Test Case MT-9: Delete Category

**Objective**: Verify category deletion works

**Steps**:

1. Create a test category:
   - Name: "Delete Test"
   - Slug: "delete-test"
2. Open the category
3. Click "Delete" button
4. Confirm deletion
5. Navigate to Categories list
6. Verify category is deleted

**Expected Results**:

- [ ] Delete confirmation dialog appears
- [ ] Category removed after confirmation
- [ ] Category no longer in list

**Pass/Fail**: [ ]

---

### Test Case MT-10: Categories List View

**Objective**: Verify list view displays correct columns

**Steps**:

1. Navigate to Categories
2. Observe list view columns

**Expected Results**:

- [ ] Name column visible
- [ ] Slug column visible
- [ ] Color column visible (if configured in defaultColumns)
- [ ] Sorting works on columns
- [ ] Search/filter works

**Pass/Fail**: [ ]

---

### Test Case MT-11: Tags List View

**Objective**: Verify tags list view displays correct columns

**Steps**:

1. Navigate to Tags
2. Observe list view columns

**Expected Results**:

- [ ] Name column visible
- [ ] Slug column visible
- [ ] Sorting works on columns
- [ ] Search/filter works

**Pass/Fail**: [ ]

---

## Integration Testing

### Setup

Integration tests use Vitest and test the Payload API directly.

```bash
# Run integration tests
pnpm test:int
```

### Existing Tests

Verify existing tests still pass after Phase 2:

```bash
pnpm test:int
```

**Expected**: All existing tests pass.

---

### Future Integration Tests

**Note**: Full integration tests for Categories and Tags will be added in Phase 5 (Integration & Validation). For Phase 2, manual testing is sufficient.

Example test structure for future reference:

```typescript
// tests/int/categories.int.spec.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'

describe('Categories Collection', () => {
  let payload: Awaited<ReturnType<typeof getPayload>>

  beforeAll(async () => {
    payload = await getPayload({
      /* config */
    })
  })

  it('should create a category', async () => {
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Test Category',
        slug: 'test-category',
      },
      locale: 'fr',
    })

    expect(category.name).toBe('Test Category')
    expect(category.slug).toBe('test-category')
  })

  it('should enforce unique slug', async () => {
    // First category
    await payload.create({
      collection: 'categories',
      data: { name: 'First', slug: 'unique-slug' },
      locale: 'fr',
    })

    // Second with same slug - should fail
    await expect(
      payload.create({
        collection: 'categories',
        data: { name: 'Second', slug: 'unique-slug' },
        locale: 'fr',
      }),
    ).rejects.toThrow()
  })

  it('should support localized fields', async () => {
    const category = await payload.create({
      collection: 'categories',
      data: { name: 'French Name', slug: 'localized-test' },
      locale: 'fr',
    })

    // Update with English
    await payload.update({
      collection: 'categories',
      id: category.id,
      data: { name: 'English Name' },
      locale: 'en',
    })

    // Verify French
    const frResult = await payload.findByID({
      collection: 'categories',
      id: category.id,
      locale: 'fr',
    })
    expect(frResult.name).toBe('French Name')

    // Verify English
    const enResult = await payload.findByID({
      collection: 'categories',
      id: category.id,
      locale: 'en',
    })
    expect(enResult.name).toBe('English Name')
  })
})
```

---

## Build Testing

### TypeScript Compilation

```bash
pnpm tsc --noEmit
```

**Expected**: No TypeScript errors.

**Common Issues**:

- Type mismatch in collection fields
- Missing type imports
- Incorrect field configurations

### Full Build

```bash
pnpm build
```

**Expected**: Build completes successfully.

**Common Issues**:

- Import resolution errors
- Missing dependencies
- Config syntax errors

### Lint Check

```bash
pnpm lint
```

**Expected**: No linting errors.

---

## Regression Testing

### Existing Collections

Verify existing collections still work:

#### Users Collection

- [ ] Login works
- [ ] Can create new user
- [ ] Can edit existing user

#### Media Collection

- [ ] Can upload media
- [ ] Can view media
- [ ] Can delete media

### i18n Functionality

- [ ] Language toggle visible
- [ ] Can switch between FR and EN
- [ ] Localized fields work for all collections

---

## Test Data Cleanup

After testing, clean up test data:

### Option 1: Delete via Admin UI

1. Navigate to Categories
2. Delete test categories (e.g., "Delete Test")
3. Navigate to Tags
4. Delete test tags

### Option 2: Keep for Development

Keep test data for development purposes. Proper seed data will be added in Story 2.3.

---

## Test Results Template

### Manual Test Results

| Test Case | Status | Tester | Date | Notes |
| --------- | ------ | ------ | ---- | ----- |
| MT-1      |        |        |      |       |
| MT-2      |        |        |      |       |
| MT-3      |        |        |      |       |
| MT-4      |        |        |      |       |
| MT-5      |        |        |      |       |
| MT-6      |        |        |      |       |
| MT-7      |        |        |      |       |
| MT-8      |        |        |      |       |
| MT-9      |        |        |      |       |
| MT-10     |        |        |      |       |
| MT-11     |        |        |      |       |

### Build Test Results

| Test        | Command             | Status | Notes |
| ----------- | ------------------- | ------ | ----- |
| TypeScript  | `pnpm tsc --noEmit` |        |       |
| Build       | `pnpm build`        |        |       |
| Lint        | `pnpm lint`         |        |       |
| Integration | `pnpm test:int`     |        |       |

---

## Troubleshooting

### Collection Not Appearing

1. Verify collection is exported in `src/collections/index.ts`
2. Verify collection is registered in `payload.config.ts`
3. Clear browser cache and hard refresh
4. Check browser console for errors

### Unique Constraint Not Working

1. Verify field has `unique: true` in collection definition
2. Verify migration was applied
3. Check database for existing data

### Localization Not Working

1. Verify field has `localized: true`
2. Verify i18n configuration in `payload.config.ts`
3. Check language toggle is switching correctly

### Save Fails

1. Check browser console for error details
2. Verify required fields are filled
3. Check network tab for API error response
4. Verify database connection (D1 bindings)

---

## Quick Test Commands

```bash
# Start dev server
pnpm dev

# Run integration tests
pnpm test:int

# Run all tests
pnpm test

# Type check
pnpm tsc --noEmit

# Lint check
pnpm lint

# Full build
pnpm build
```

---

## Testing Coverage Goals

| Area              | Coverage Target | Phase 2 Status      |
| ----------------- | --------------- | ------------------- |
| Manual UI Tests   | 100%            | Required            |
| Build Tests       | 100%            | Required            |
| Integration Tests | Basic           | Deferred to Phase 5 |
| E2E Tests         | N/A             | Deferred to Phase 5 |

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Payload Testing Guide](https://payloadcms.com/docs/local-api/overview)
- [Project Testing Setup](../../../../../../tests/)

---

**Testing Guide Status**: READY FOR USE
