# Phase 2: Categories & Tags Collections - Validation Checklist

## Overview

This checklist validates that Phase 2 has been successfully completed. All items must pass before marking the phase as complete.

---

## Quick Validation Commands

```bash
# Run all validation checks at once
pnpm tsc --noEmit && pnpm lint && pnpm build && pnpm test:int
```

---

## Pre-Validation Requirements

Before starting validation, ensure:

- [ ] All commits from Phase 2 are complete (4 commits)
- [ ] Working directory is clean (`git status`)
- [ ] On correct branch

---

## Section 1: File Structure Validation

### 1.1 New Files Created

**Verify files exist**:

```bash
ls -la src/collections/Categories.ts src/collections/Tags.ts src/collections/index.ts
```

- [ ] `src/collections/Categories.ts` exists
- [ ] `src/collections/Tags.ts` exists
- [ ] `src/collections/index.ts` exists

### 1.2 Migration File Created

```bash
ls -la src/migrations/ | tail -5
```

- [ ] New migration file exists (with timestamp)

### 1.3 Types Updated

```bash
grep -l "Category\|Tag" src/payload-types.ts
```

- [ ] `payload-types.ts` has been updated

---

## Section 2: Categories Collection Validation

### 2.1 Collection Definition

**File**: `src/collections/Categories.ts`

```bash
cat src/collections/Categories.ts
```

- [ ] Exports `Categories` constant
- [ ] Slug is `'categories'`
- [ ] `useAsTitle` is set to `'name'`
- [ ] `group` is set to `'Content'`

### 2.2 Field Definitions

Verify all fields are present:

- [ ] `name` field (text, localized, required)
- [ ] `slug` field (text, unique, required)
- [ ] `description` field (textarea, localized)
- [ ] `color` field (text)
- [ ] `icon` field (text)

**Verification Command**:

```bash
grep -E "name:|slug:|description:|color:|icon:" src/collections/Categories.ts
```

### 2.3 i18n Configuration

- [ ] `name` has `localized: true`
- [ ] `description` has `localized: true`
- [ ] `slug` does NOT have `localized: true`
- [ ] `color` does NOT have `localized: true`
- [ ] `icon` does NOT have `localized: true`

### 2.4 Constraints

- [ ] `slug` has `unique: true`
- [ ] `name` has `required: true`
- [ ] `slug` has `required: true`

---

## Section 3: Tags Collection Validation

### 3.1 Collection Definition

**File**: `src/collections/Tags.ts`

```bash
cat src/collections/Tags.ts
```

- [ ] Exports `Tags` constant
- [ ] Slug is `'tags'`
- [ ] `useAsTitle` is set to `'name'`
- [ ] `group` is set to `'Content'`

### 3.2 Field Definitions

Verify all fields are present:

- [ ] `name` field (text, localized, required)
- [ ] `slug` field (text, unique, required)

**Verification Command**:

```bash
grep -E "name:|slug:" src/collections/Tags.ts
```

### 3.3 i18n Configuration

- [ ] `name` has `localized: true`
- [ ] `slug` does NOT have `localized: true`

### 3.4 Constraints

- [ ] `slug` has `unique: true`
- [ ] `name` has `required: true`
- [ ] `slug` has `required: true`

---

## Section 4: Configuration Validation

### 4.1 Barrel Export

**File**: `src/collections/index.ts`

```bash
cat src/collections/index.ts
```

- [ ] Exports `Users`
- [ ] Exports `Media`
- [ ] Exports `Categories`
- [ ] Exports `Tags`

### 4.2 Payload Config

**File**: `src/payload.config.ts`

```bash
grep -A 2 "collections:" src/payload.config.ts
```

- [ ] Imports from `'./collections'`
- [ ] Collections array includes `Categories`
- [ ] Collections array includes `Tags`

---

## Section 5: Type Validation

### 5.1 Category Type

**File**: `src/payload-types.ts`

```bash
grep -A 15 "interface Category" src/payload-types.ts
```

- [ ] `Category` interface exists
- [ ] Contains `id` field
- [ ] Contains `name` field
- [ ] Contains `slug` field
- [ ] Contains `description` field (optional)
- [ ] Contains `color` field (optional)
- [ ] Contains `icon` field (optional)
- [ ] Contains `createdAt` field
- [ ] Contains `updatedAt` field

### 5.2 Tag Type

```bash
grep -A 10 "interface Tag" src/payload-types.ts
```

- [ ] `Tag` interface exists
- [ ] Contains `id` field
- [ ] Contains `name` field
- [ ] Contains `slug` field
- [ ] Contains `createdAt` field
- [ ] Contains `updatedAt` field

---

## Section 6: Build Validation

### 6.1 TypeScript Compilation

**Command**:

```bash
pnpm tsc --noEmit
```

- [ ] Command completes without errors
- [ ] No type errors reported

### 6.2 Full Build

**Command**:

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No errors in build output

### 6.3 Lint Check

**Command**:

```bash
pnpm lint
```

- [ ] No linting errors
- [ ] No new warnings introduced

---

## Section 7: Runtime Validation

### 7.1 Development Server

**Command**:

```bash
pnpm dev
```

- [ ] Server starts without errors
- [ ] No runtime warnings related to collections

### 7.2 Admin Panel Access

**URL**: `http://localhost:3000/admin`

- [ ] Login page loads
- [ ] Can login successfully
- [ ] No console errors in browser

### 7.3 Collection Visibility

- [ ] "Content" group visible in sidebar
- [ ] "Categories" link visible under Content
- [ ] "Tags" link visible under Content

---

## Section 8: CRUD Validation

### 8.1 Create Category

- [ ] Navigate to Categories
- [ ] Click "Create New"
- [ ] Fill in required fields (name, slug)
- [ ] Click "Save"
- [ ] Category created successfully

### 8.2 Create Tag

- [ ] Navigate to Tags
- [ ] Click "Create New"
- [ ] Fill in required fields (name, slug)
- [ ] Click "Save"
- [ ] Tag created successfully

### 8.3 Edit Category

- [ ] Open existing category
- [ ] Modify a field
- [ ] Click "Save"
- [ ] Changes persisted

### 8.4 Delete Category

- [ ] Open existing category
- [ ] Click "Delete"
- [ ] Confirm deletion
- [ ] Category removed from list

---

## Section 9: i18n Validation

### 9.1 Locale Switching

- [ ] Language toggle visible in admin header
- [ ] Can switch from FR to EN
- [ ] Can switch from EN to FR

### 9.2 Localized Field Behavior

**Categories**:

- [ ] Create category in FR
- [ ] Switch to EN
- [ ] See FR content as fallback
- [ ] Add EN translation
- [ ] Save
- [ ] Switch to FR
- [ ] FR content preserved

**Tags**:

- [ ] Create tag in FR
- [ ] Switch to EN
- [ ] See FR content as fallback
- [ ] Add EN translation
- [ ] Save
- [ ] Switch to FR
- [ ] FR content preserved

### 9.3 Non-Localized Fields

- [ ] Slug is same in both locales
- [ ] Color is same in both locales (Categories)
- [ ] Icon is same in both locales (Categories)

---

## Section 10: Constraint Validation

### 10.1 Unique Slug - Categories

- [ ] Create category with slug "test-unique"
- [ ] Try to create another category with slug "test-unique"
- [ ] Error message displayed
- [ ] Duplicate not created

### 10.2 Unique Slug - Tags

- [ ] Create tag with slug "test-unique-tag"
- [ ] Try to create another tag with slug "test-unique-tag"
- [ ] Error message displayed
- [ ] Duplicate not created

### 10.3 Required Fields

**Categories**:

- [ ] Try to save without name - error displayed
- [ ] Try to save without slug - error displayed

**Tags**:

- [ ] Try to save without name - error displayed
- [ ] Try to save without slug - error displayed

---

## Section 11: Commit Validation

### 11.1 Commit Count

**Command**:

```bash
# Count commits since Phase 1 (adjust base as needed)
git log --oneline --since="Phase 1 completion" | wc -l
```

Or check last 5 commits:

```bash
git log --oneline -5
```

- [ ] 4 commits for Phase 2

### 11.2 Commit Messages

**Command**:

```bash
git log --oneline -4
```

Expected commits (in reverse chronological order):

- [ ] `chore(db): generate and apply migration for Categories and Tags`
- [ ] `feat(collections): create barrel export and register in config`
- [ ] `feat(collections): create Tags collection with i18n support`
- [ ] `feat(collections): create Categories collection with i18n support`

### 11.3 Commit Content

**Command**:

```bash
git show --stat HEAD~3  # Commit 1 - Categories
git show --stat HEAD~2  # Commit 2 - Tags
git show --stat HEAD~1  # Commit 3 - Barrel & Config
git show --stat HEAD    # Commit 4 - Migration & Types
```

- [ ] Commit 1 only modifies `src/collections/Categories.ts`
- [ ] Commit 2 only modifies `src/collections/Tags.ts`
- [ ] Commit 3 modifies `src/collections/index.ts` and `src/payload.config.ts`
- [ ] Commit 4 modifies `src/migrations/` and `src/payload-types.ts`

---

## Section 12: Regression Validation

### 12.1 Existing Collections

- [ ] Users collection still works
- [ ] Media collection still works

### 12.2 Existing Tests

**Command**:

```bash
pnpm test:int
```

- [ ] All existing tests pass

### 12.3 Phase 1 Features

- [ ] i18n configuration still active
- [ ] Language toggle still works
- [ ] Locales are still FR and EN

---

## Validation Summary

### Status Indicators

| Status  | Meaning                           |
| ------- | --------------------------------- |
| PASS    | All criteria met                  |
| FAIL    | One or more criteria not met      |
| SKIP    | Not applicable for this phase     |
| BLOCKED | Cannot validate due to dependency |

### Section Results

| Section           | Items  | Passed  | Status |
| ----------------- | ------ | ------- | ------ |
| 1. File Structure | 3      | /3      |        |
| 2. Categories     | 12     | /12     |        |
| 3. Tags           | 8      | /8      |        |
| 4. Configuration  | 6      | /6      |        |
| 5. Types          | 12     | /12     |        |
| 6. Build          | 3      | /3      |        |
| 7. Runtime        | 5      | /5      |        |
| 8. CRUD           | 4      | /4      |        |
| 9. i18n           | 9      | /9      |        |
| 10. Constraints   | 6      | /6      |        |
| 11. Commits       | 7      | /7      |        |
| 12. Regression    | 4      | /4      |        |
| **TOTAL**         | **79** | **/79** |        |

---

## Sign-Off

### Phase Completion Criteria

All of the following must be true:

- [ ] All validation items pass (79/79)
- [ ] No blocking issues identified
- [ ] Documentation complete
- [ ] Ready for Phase 3

### Approval

| Role      | Name | Date | Signature |
| --------- | ---- | ---- | --------- |
| Developer |      |      |           |
| Reviewer  |      |      |           |

---

## Issues Found

Document any issues discovered during validation:

| Issue | Severity | Status | Resolution |
| ----- | -------- | ------ | ---------- |
|       |          |        |            |

---

## Post-Validation Actions

### If All Pass

1. Update EPIC_TRACKING.md:

   ```markdown
   | 2.1 | ... | IN PROGRESS | 5 | 2/5 |
   ```

2. Prepare for Phase 3:
   ```bash
   /generate-phase-doc Epic 2 Story 2.1 Phase 3
   ```

### If Any Fail

1. Document the failure in Issues Found section
2. Create fix commits as needed
3. Re-run validation
4. Do not proceed to Phase 3 until all pass

---

## Validation Command Reference

```bash
# All-in-one validation
pnpm tsc --noEmit && pnpm lint && pnpm build && pnpm test:int

# Individual checks
pnpm tsc --noEmit        # TypeScript
pnpm lint                # Linting
pnpm build               # Build
pnpm test:int            # Tests
pnpm dev                 # Dev server

# File verification
ls -la src/collections/  # List collections
cat src/collections/index.ts  # View barrel
grep "Category" src/payload-types.ts  # Check types

# Git verification
git log --oneline -5     # Recent commits
git status               # Working directory
git diff                 # Uncommitted changes
```

---

**Validation Status**: READY FOR USE

---

## Phase 2 Completion Certificate

**Phase**: 2 - Categories & Tags Collections
**Story**: Epic 2 - Story 2.1
**Status**: [ ] COMPLETE / [ ] INCOMPLETE

**Validated By**: **\*\***\_\_\_\_**\*\***
**Date**: **\*\***\_\_\_\_**\*\***

---

**Next Phase**: Phase 3 - Articles Collection
