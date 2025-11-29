# Phase 1: i18n Configuration - Testing Guide

## Overview

This guide outlines the testing strategy for Phase 1. Since this phase focuses on configuration, testing is primarily manual verification with some automated checks.

---

## Testing Strategy

### Test Pyramid for Phase 1

```
         /\
        /  \     Manual Tests (Primary)
       /    \    - Admin UI verification
      /──────\   - Language toggle functionality
     /        \
    /          \  Integration Tests (Existing)
   /            \ - Verify no regressions
  /──────────────\ - API still functional
 /                \
/                  \ Unit Tests (N/A for this phase)
/____________________\ - No new logic to test
```

### Test Categories

| Category    | Scope                     | Tools   |
| ----------- | ------------------------- | ------- |
| Manual      | Admin UI, Language toggle | Browser |
| Integration | Existing tests still pass | Vitest  |
| Build       | TypeScript, Build process | pnpm    |

---

## Manual Testing

### Test Case 1: Admin UI Loads

**Objective**: Verify admin panel loads correctly after i18n configuration

**Steps**:

1. Start development server: `pnpm dev`
2. Open browser to `http://localhost:3000/admin`
3. Login with admin credentials

**Expected Results**:

- [ ] Login page displays correctly
- [ ] No console errors
- [ ] Page loads within acceptable time (<3s)

**Pass Criteria**: Admin UI accessible without errors

---

### Test Case 2: Language Toggle Visibility

**Objective**: Verify language toggle appears in admin UI

**Steps**:

1. Login to admin panel
2. Look for language selector in header area
3. Note the position and appearance

**Expected Results**:

- [ ] Language toggle/dropdown visible in header
- [ ] Current language displayed (should be "Francais")
- [ ] Toggle is clickable/interactive

**Pass Criteria**: Language selector visible and accessible

---

### Test Case 3: Language Switching

**Objective**: Verify language can be switched between FR and EN

**Steps**:

1. With toggle in "Francais" position, click/open toggle
2. Select "English"
3. Observe UI changes
4. Switch back to "Francais"

**Expected Results**:

- [ ] Toggle shows both language options
- [ ] Selecting "English" changes admin UI labels (if translations exist)
- [ ] Selecting "Francais" reverts to French UI
- [ ] No page reload required (or smooth reload)
- [ ] No errors in console during switch

**Pass Criteria**: Language switching works smoothly

---

### Test Case 4: Locale Persistence

**Objective**: Verify selected locale persists across sessions

**Steps**:

1. Switch language to "English"
2. Close browser tab
3. Open new tab to admin panel
4. Check which language is selected

**Expected Results**:

- [ ] Admin UI remembers language preference
- [ ] No need to re-select language
- [ ] Persistence works across browser sessions

**Pass Criteria**: Language preference is persisted

---

### Test Case 5: Default Locale Verification

**Objective**: Verify French is the default locale

**Steps**:

1. Clear browser cookies/storage for the site
2. Open admin panel in incognito/private window
3. Check initial language state

**Expected Results**:

- [ ] Initial language is "Francais"
- [ ] Default content language is FR

**Pass Criteria**: French is default for new sessions

---

## Automated Testing

### Existing Integration Tests

Run existing tests to ensure no regressions:

```bash
pnpm test:int
```

**Expected Results**:

- [ ] All existing tests pass
- [ ] No new failures introduced
- [ ] Test execution completes without errors

### Test File Reference

```
tests/int/api.int.spec.ts  # Existing API tests
```

### What Existing Tests Verify

| Test            | Verification                           |
| --------------- | -------------------------------------- |
| `fetches users` | Users API still works with i18n config |

---

## Build & Type Testing

### TypeScript Compilation

```bash
pnpm tsc --noEmit
```

**Expected Results**:

- [ ] No compilation errors
- [ ] All types resolve correctly
- [ ] Locale type properly defined

### Full Build

```bash
pnpm build
```

**Expected Results**:

- [ ] Build completes successfully
- [ ] No build warnings related to i18n
- [ ] Output bundle generated

### Lint Check

```bash
pnpm lint
```

**Expected Results**:

- [ ] No linting errors
- [ ] No new warnings

---

## Type Verification Tests

### Verify Locale Type

After type regeneration, verify the Config interface includes locale:

```bash
grep -A 5 "locale:" src/payload-types.ts
```

**Expected Output**:

```typescript
locale: 'fr' | 'en'
```

### Verify Type Export

Check that Config is properly exported:

```bash
grep "export interface Config" src/payload-types.ts
```

---

## Testing Commands Summary

```bash
# Manual Testing Setup
pnpm dev                      # Start dev server for manual testing

# Automated Tests
pnpm test:int                 # Run integration tests
pnpm tsc --noEmit            # TypeScript check
pnpm build                   # Full build test
pnpm lint                    # Linting

# Type Verification
grep "locale:" src/payload-types.ts
```

---

## Test Results Template

Use this template to document test results:

### Manual Test Results

| Test Case                       | Result      | Notes |
| ------------------------------- | ----------- | ----- |
| TC1: Admin UI Loads             | PASS / FAIL |       |
| TC2: Language Toggle Visibility | PASS / FAIL |       |
| TC3: Language Switching         | PASS / FAIL |       |
| TC4: Locale Persistence         | PASS / FAIL |       |
| TC5: Default Locale             | PASS / FAIL |       |

### Automated Test Results

| Test Suite        | Result      | Duration |
| ----------------- | ----------- | -------- |
| Integration Tests | PASS / FAIL | Xs       |
| TypeScript Check  | PASS / FAIL | Xs       |
| Build             | PASS / FAIL | Xs       |
| Lint              | PASS / FAIL | Xs       |

---

## Troubleshooting Test Failures

### Manual Test Failures

#### Language toggle not visible

1. Check browser console for errors
2. Verify localization config is correct
3. Hard refresh (Ctrl+Shift+R)
4. Clear browser cache

#### Language switch not working

1. Check for JavaScript errors
2. Verify Payload admin is properly loaded
3. Check network requests for locale changes

### Automated Test Failures

#### Integration tests fail

```bash
# Run with verbose output
pnpm test:int -- --reporter=verbose

# Check specific test
pnpm test:int -- --grep "fetches users"
```

#### TypeScript errors

```bash
# Get detailed error output
pnpm tsc --noEmit 2>&1 | head -50

# Check specific file
npx tsc src/payload.config.ts --noEmit
```

#### Build failures

```bash
# Clear cache and rebuild
rm -rf .next .open-next
pnpm build
```

---

## Regression Testing

### What Could Break

Since Phase 1 only adds configuration, regression risk is low. Monitor:

| Area                 | Risk | Verification               |
| -------------------- | ---- | -------------------------- |
| Existing collections | Low  | Users/Media still work     |
| Admin panel          | Low  | All existing features work |
| API endpoints        | Low  | REST/GraphQL functional    |
| Build process        | Low  | Build succeeds             |

### Regression Test Commands

```bash
# Quick regression check
pnpm test:int && pnpm build && pnpm lint

# Full regression check
pnpm test && pnpm build
```

---

## Test Coverage Notes

### Phase 1 Coverage

| Component           | Coverage Type          | Status  |
| ------------------- | ---------------------- | ------- |
| payload.config.ts   | Build verification     | Covered |
| Localization config | Manual testing         | Covered |
| Admin UI toggle     | Manual testing         | Covered |
| Type generation     | Automated verification | Covered |

### Coverage Gaps (Acceptable for Phase 1)

- No unit tests (no new logic to test)
- No E2E tests (not needed for config change)
- No API tests for locale parameter (will be tested in later phases)

---

## Future Testing (Later Phases)

These tests will be added in subsequent phases:

- **Phase 2-4**: Collection tests with locale parameter
- **Phase 5**: Comprehensive i18n integration tests
  - Content creation in different locales
  - Fallback behavior testing
  - Locale-specific queries

---

## References

- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - What was implemented
- [VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md) - Validation criteria
- [Vitest Documentation](https://vitest.dev/) - Test framework
- [Payload Testing Guide](https://payloadcms.com/docs/testing) - Official testing docs

---

**Testing Guide Status**: READY FOR USE
