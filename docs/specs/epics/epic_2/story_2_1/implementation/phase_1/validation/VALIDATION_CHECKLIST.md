# Phase 1: i18n Configuration - Validation Checklist

## Overview

This checklist validates that Phase 1 has been successfully completed. All items must pass before marking the phase as complete.

---

## Quick Validation Commands

```bash
# Run all validation checks at once
pnpm tsc --noEmit && pnpm lint && pnpm build && pnpm test:int
```

---

## Pre-Validation Requirements

Before starting validation, ensure:

- [ ] All commits from Phase 1 are complete (2 commits)
- [ ] Working directory is clean (`git status`)
- [ ] On correct branch

---

## Section 1: Code Changes Validation

### 1.1 Localization Configuration

**File**: `src/payload.config.ts`

- [ ] `localization` block is present in `buildConfig`
- [ ] Contains `locales` array with FR and EN
- [ ] `defaultLocale` is set to `'fr'`
- [ ] `fallback` is set to `true`

**Verification Command**:

```bash
grep -A 10 "localization:" src/payload.config.ts
```

**Expected Output**:

```typescript
localization: {
  locales: [
    { label: 'Francais', code: 'fr' },
    { label: 'English', code: 'en' },
  ],
  defaultLocale: 'fr',
  fallback: true,
},
```

### 1.2 TypeScript Types

**File**: `src/payload-types.ts`

- [ ] File has been regenerated (recent modification time)
- [ ] `Config` interface includes `locale` property
- [ ] `locale` type is `'fr' | 'en'`

**Verification Command**:

```bash
grep "locale:" src/payload-types.ts
```

**Expected Output**:

```typescript
locale: 'fr' | 'en'
```

---

## Section 2: Build Validation

### 2.1 TypeScript Compilation

**Command**:

```bash
pnpm tsc --noEmit
```

- [ ] Command completes without errors
- [ ] No type errors reported

### 2.2 Full Build

**Command**:

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No errors in build output
- [ ] Build time is acceptable

### 2.3 Lint Check

**Command**:

```bash
pnpm lint
```

- [ ] No linting errors
- [ ] No new warnings introduced

---

## Section 3: Runtime Validation

### 3.1 Development Server

**Command**:

```bash
pnpm dev
```

- [ ] Server starts without errors
- [ ] No runtime warnings related to i18n
- [ ] Hot reload works

### 3.2 Admin Panel Access

**URL**: `http://localhost:3000/admin`

- [ ] Login page loads
- [ ] No console errors in browser
- [ ] Page responsive and functional

### 3.3 Language Toggle

- [ ] Language toggle visible in admin header
- [ ] Shows current language (Francais by default)
- [ ] Dropdown/toggle shows both FR and EN options

### 3.4 Language Switching

- [ ] Can switch from FR to EN
- [ ] UI responds to language change
- [ ] Can switch back to FR
- [ ] No errors during switch

---

## Section 4: Test Validation

### 4.1 Integration Tests

**Command**:

```bash
pnpm test:int
```

- [ ] All existing tests pass
- [ ] No new test failures
- [ ] Test execution time acceptable

### 4.2 Manual Test Cases

| Test Case                | Result   | Tester | Date |
| ------------------------ | -------- | ------ | ---- |
| Admin UI Loads           | [ ] PASS |        |      |
| Language Toggle Visible  | [ ] PASS |        |      |
| Language Switching Works | [ ] PASS |        |      |
| Default Locale is FR     | [ ] PASS |        |      |

---

## Section 5: Commit Validation

### 5.1 Commit Count

**Command**:

```bash
git log --oneline epic/epic-2-cms-core..HEAD | wc -l
```

- [ ] Exactly 2 commits for Phase 1

### 5.2 Commit Messages

**Command**:

```bash
git log --oneline -2
```

- [ ] Commit 1: `feat(i18n): add localization configuration to payload.config.ts`
- [ ] Commit 2: `chore(types): regenerate payload types with i18n support`

### 5.3 Commit Content

**Command**:

```bash
git show --stat HEAD~1  # Commit 1
git show --stat HEAD    # Commit 2
```

- [ ] Commit 1 only modifies `src/payload.config.ts`
- [ ] Commit 2 only modifies `src/payload-types.ts`

---

## Section 6: Documentation Validation

### 6.1 Phase Documentation Complete

- [ ] INDEX.md exists and is complete
- [ ] IMPLEMENTATION_PLAN.md exists and is complete
- [ ] COMMIT_CHECKLIST.md exists and is complete
- [ ] ENVIRONMENT_SETUP.md exists and is complete
- [ ] guides/REVIEW.md exists and is complete
- [ ] guides/TESTING.md exists and is complete
- [ ] This validation checklist is being used

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

| Section          | Items  | Passed  | Status |
| ---------------- | ------ | ------- | ------ |
| 1. Code Changes  | 4      | /4      |        |
| 2. Build         | 3      | /3      |        |
| 3. Runtime       | 4      | /4      |        |
| 4. Tests         | 2      | /2      |        |
| 5. Commits       | 3      | /3      |        |
| 6. Documentation | 1      | /1      |        |
| **TOTAL**        | **17** | **/17** |        |

---

## Sign-Off

### Phase Completion Criteria

All of the following must be true:

- [ ] All validation items pass
- [ ] No blocking issues identified
- [ ] Documentation complete
- [ ] Ready for Phase 2

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
   | 2.1 | ... | IN PROGRESS | 5 | 1/5 |
   ```

2. Prepare for Phase 2:
   ```bash
   /generate-phase-doc Epic 2 Story 2.1 Phase 2
   ```

### If Any Fail

1. Document the failure in Issues Found section
2. Create fix commits as needed
3. Re-run validation
4. Do not proceed to Phase 2 until all pass

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

# Git verification
git log --oneline -2     # Recent commits
git status               # Working directory
git diff                 # Uncommitted changes
```

---

**Validation Status**: READY FOR USE

---

## Phase 1 Completion Certificate

**Phase**: 1 - i18n Configuration
**Story**: Epic 2 - Story 2.1
**Status**: [ ] COMPLETE / [ ] INCOMPLETE

**Validated By**: ********\_********
**Date**: ********\_********

---

**Next Phase**: Phase 2 - Categories & Tags Collections
