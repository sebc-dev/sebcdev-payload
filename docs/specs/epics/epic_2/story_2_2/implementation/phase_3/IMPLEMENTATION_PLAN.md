# Phase 3 - Atomic Implementation Plan

**Objective**: Valider l'expérience utilisateur complète avec tests E2E Playwright, validation accessibilité, et déploiement preview Cloudflare

---

## 🎯 Overview

### Why an Atomic Approach?

The implementation is split into **4 independent commits** to:

✅ **Facilitate review** - Each commit focuses on a single responsibility (E2E tests, a11y, docs, validation)
✅ **Enable rollback** - If a commit has issues, revert it without breaking everything
✅ **Progressive validation** - E2E tests validated incrementally
✅ **Tests as you go** - Each test suite can be run independently
✅ **Continuous documentation** - Documentation commits are self-contained

### Global Strategy

```
[Commit 1] → [Commit 2] → [Commit 3] → [Commit 4]
E2E Tests    A11y Tests   Docs         Final Validation
    ↓            ↓           ↓              ↓
100%         100%        Complete       Story 2.2
tested       WCAG 2.1    R2 limits      DONE ✅
passing      AA pass     documented
```

---

## 📦 The 4 Atomic Commits

### Commit 1: Create E2E Test Suite for Admin Media

**Files**:
- `tests/e2e/admin-media.e2e.spec.ts` (new, ~250 lines)

**Size**: ~250 lines
**Duration**: 90-120 min (implementation) + 45-60 min (review)

**Content**:
- E2E test suite avec Playwright pour admin media workflow
- Test: Upload image via admin form
- Test: Display uploaded image in media gallery
- Test: Edit media metadata (alt text)
- Test: Delete media and verify R2 cleanup
- Test: Handle upload errors gracefully
- Proper test isolation (beforeEach cleanup)
- Wait strategies for async operations

**Why it's atomic**:
- Single responsibility: E2E tests for admin media CRUD
- No dependencies on other commits (tests existing functionality)
- Can be validated independently (pnpm test:e2e)
- Focused scope: admin workflow only

**Technical Validation**:
```bash
# Run E2E tests
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# Should pass all tests
pnpm test:e2e
```

**Expected Result**: All E2E tests pass, coverage of critical admin paths (upload, view, edit, delete)

**Review Criteria**:
- [ ] Tests cover all CRUD operations (create, read, update, delete)
- [ ] Proper wait strategies used (no arbitrary timeouts)
- [ ] Test isolation ensures independent execution
- [ ] Error handling scenarios tested
- [ ] Tests use Playwright best practices (page object pattern if complex)
- [ ] Clear test descriptions (describe/test blocks)

---

### Commit 2: Add Accessibility Tests for Upload Form

**Files**:
- `tests/e2e/admin-media.e2e.spec.ts` (modify, +80 lines)

**Size**: ~80 lines
**Duration**: 45-60 min (implementation) + 30-45 min (review)

**Content**:
- Integrate axe-core accessibility testing
- Test: Upload form meets WCAG 2.1 AA standards
- Test: Media gallery is keyboard navigable
- Test: Form labels and ARIA attributes correct
- Test: Error messages are accessible
- Accessibility assertions using @axe-core/playwright
- Document any violations found and fixed

**Why it's atomic**:
- Single responsibility: Accessibility validation
- Depends on Commit 1 (extends E2E tests)
- Can be validated independently (run a11y tests only)
- Focused scope: accessibility compliance

**Technical Validation**:
```bash
# Run E2E tests with accessibility checks
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# All accessibility tests should pass
# No WCAG 2.1 AA violations
```

**Expected Result**: Accessibility tests pass, upload form complies with WCAG 2.1 AA, no critical violations

**Review Criteria**:
- [ ] axe-core integration correct (@axe-core/playwright)
- [ ] Tests validate WCAG 2.1 AA compliance
- [ ] Keyboard navigation tested
- [ ] ARIA attributes validated
- [ ] Error messages accessible
- [ ] Violations documented (if any) with remediation plan

---

### Commit 3: Create Media R2 Constraints Documentation

**Files**:
- `docs/guides/media-r2-constraints.md` (new, ~200 lines)

**Size**: ~200 lines
**Duration**: 60-90 min (implementation) + 30-45 min (review)

**Content**:
- Comprehensive documentation of R2 limitations on Workers
- Max upload size (100 MiB Free, 200 MiB Business)
- Sharp unavailable (no server-side crop/resize)
- Local R2 simulation vs production differences
- CORS configuration (if needed)
- Workarounds: Cloudflare Images, presigned URLs
- Performance considerations
- Troubleshooting common issues
- References to Cloudflare documentation

**Why it's atomic**:
- Single responsibility: Documentation
- No code dependencies
- Can be validated independently (read and verify)
- Focused scope: R2 constraints only

**Technical Validation**:
```bash
# Verify documentation exists and is complete
cat docs/guides/media-r2-constraints.md

# Lint markdown (if project has markdown linter)
# pnpm exec markdownlint docs/guides/media-r2-constraints.md
```

**Expected Result**: Complete, accurate documentation of R2 limitations and workarounds

**Review Criteria**:
- [ ] All R2 limitations documented accurately
- [ ] Workarounds provided for each limitation
- [ ] Examples and code snippets included
- [ ] Links to official Cloudflare documentation
- [ ] Troubleshooting section comprehensive
- [ ] Clear structure and formatting
- [ ] No placeholder text

---

### Commit 4: Final Validation and Cleanup

**Files**:
- `docs/specs/epics/epic_2/story_2_2/story_2.2.md` (update acceptance criteria)
- Any minor cleanup or fixes discovered during validation

**Size**: ~50 lines (updates)
**Duration**: 60-90 min (validation + implementation) + 30 min (review)

**Content**:
- Run complete test suite (unit + int + e2e)
- Verify all Story 2.2 acceptance criteria met
- Update story status to COMPLETED
- Deploy to preview environment
- Manual validation in preview (upload, verify R2, access URL)
- Document any findings or issues
- Final code cleanup (remove debug logs, unused imports)
- Update EPIC_TRACKING.md

**Why it's atomic**:
- Single responsibility: Final validation and story completion
- Depends on all previous commits
- Can be validated independently (run full validation)
- Focused scope: validation and closure

**Technical Validation**:
```bash
# Run all tests
pnpm test

# Type-checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Build
pnpm build

# Deploy to preview
pnpm exec wrangler deploy --env preview

# Manual validation in preview environment
```

**Expected Result**: All tests pass, preview deployment successful, Story 2.2 acceptance criteria met

**Review Criteria**:
- [ ] All tests pass (unit, integration, E2E)
- [ ] Type-checking passes
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Preview deployment successful
- [ ] Manual validation completed
- [ ] Story 2.2 acceptance criteria all checked
- [ ] EPIC_TRACKING.md updated

---

## 🔄 Implementation Workflow

### Step-by-Step

1. **Read specification**: Review PHASES_PLAN.md Phase 3 section
2. **Setup environment**: Follow ENVIRONMENT_SETUP.md (Playwright, preview env)
3. **Implement Commit 1**: Follow COMMIT_CHECKLIST.md - E2E test suite
4. **Validate Commit 1**: Run E2E tests, verify all pass
5. **Review Commit 1**: Self-review against criteria
6. **Commit Commit 1**: Use provided commit message template
7. **Repeat for commits 2-4**
8. **Final validation**: Complete VALIDATION_CHECKLIST.md
9. **Story completion**: Mark Story 2.2 as COMPLETED

### Validation at Each Step

After each commit:
```bash
# Run E2E tests (commits 1-2)
pnpm test:e2e

# Type-checking (all commits)
pnpm exec tsc --noEmit

# Linting (all commits)
pnpm lint

# Run all tests (commit 4)
pnpm test
```

All must pass before moving to next commit.

---

## 📊 Commit Metrics

| Commit     | Files  | Lines     | Implementation | Review   | Total    |
| ---------- | ------ | --------- | -------------- | -------- | -------- |
| 1. E2E Suite | 1    | ~250      | 90-120 min     | 45-60 min | 135-180 min |
| 2. A11y Tests | 1   | ~80       | 45-60 min      | 30-45 min | 75-105 min |
| 3. R2 Docs  | 1      | ~200      | 60-90 min      | 30-45 min | 90-135 min |
| 4. Validation | 2+   | ~50       | 60-90 min      | 30 min    | 90-120 min |
| **TOTAL**  | **5+** | **~580**  | **4-6h**       | **2-3h**  | **6-9h** |

---

## ✅ Atomic Approach Benefits

### For Developers

- 🎯 **Clear focus**: E2E tests → A11y → Docs → Validation
- 🧪 **Testable**: Each commit validated with E2E tests
- 📝 **Documented**: Clear progression from tests to docs

### For Reviewers

- ⚡ **Fast review**: 30-90 min per commit
- 🔍 **Focused**: Single responsibility (tests, a11y, docs, validation)
- ✅ **Quality**: Easier to validate E2E coverage and a11y compliance

### For the Project

- 🔄 **Rollback-safe**: Revert E2E tests without affecting integration tests
- 📚 **Historical**: Clear E2E testing progression in git history
- 🏗️ **Maintainable**: Easy to add more E2E tests later

---

## 📝 Best Practices

### Commit Messages

Format (using Gitmoji per project convention):
```
✅ test(e2e): short description (max 50 chars)

- Point 1: detail
- Point 2: detail
- Point 3: justification if needed

Part of Phase 3 - Commit X/4
```

Examples:
```
✅ test(e2e): add admin media CRUD E2E tests

- Upload, view, edit, delete flows
- Error handling scenarios
- Proper test isolation

Part of Phase 3 - Commit 1/4
```

```
♿️ test(a11y): add accessibility tests for upload form

- WCAG 2.1 AA compliance validation
- Keyboard navigation testing
- ARIA attributes verification

Part of Phase 3 - Commit 2/4
```

### Review Checklist

Before committing:

- [ ] E2E tests follow Playwright best practices
- [ ] All tests pass locally and in CI
- [ ] No flaky tests (consistent pass/fail)
- [ ] No console.logs or debug code
- [ ] Accessibility tests use axe-core correctly
- [ ] Documentation is clear and accurate
- [ ] Preview deployment validated manually

---

## ⚠️ Important Points

### Do's

- ✅ Follow the commit order (E2E → A11y → Docs → Validation)
- ✅ Validate after each commit (run E2E tests)
- ✅ Write E2E tests for all critical paths
- ✅ Use proper wait strategies (page.waitForSelector)
- ✅ Validate preview deployment manually
- ✅ Document R2 limitations accurately

### Don'ts

- ❌ Skip commits or combine them (each has clear value)
- ❌ Commit without running E2E tests
- ❌ Use arbitrary timeouts (use waitForSelector, etc.)
- ❌ Skip accessibility validation
- ❌ Skip preview deployment validation
- ❌ Leave placeholder text in documentation

---

## 🎭 E2E Testing Strategy

### Test Structure

```typescript
// tests/e2e/admin-media.e2e.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Admin Media Upload E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    // Authenticate
    // Navigate to media collection
  })

  test('should upload image via admin form', async ({ page }) => {
    // Click create button
    // Fill form with file
    // Verify upload success
    // Check image in gallery
  })

  test('should display upload progress', async ({ page }) => {
    // Upload file
    // Verify progress indicator visible
  })

  test('should handle upload errors gracefully', async ({ page }) => {
    // Try invalid file type
    // Verify error message displayed
  })

  test('should be accessible (WCAG 2.1 AA)', async ({ page }) => {
    // Navigate to upload form
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

### Playwright Best Practices

1. **Wait Strategies**: Use `page.waitForSelector()` instead of `setTimeout()`
2. **Test Isolation**: Clean up data in `beforeEach` or `afterEach`
3. **Locators**: Use data-testid attributes for stability
4. **Assertions**: Use Playwright's `expect()` for automatic retries
5. **Page Objects**: Extract common patterns if tests grow

---

## 🌐 Preview Deployment Validation

### Deployment Process

```bash
# 1. Build for production
pnpm build

# 2. Deploy to preview environment
pnpm exec wrangler deploy --env preview

# Output will show deployment URL
# Example: https://sebcdev-payload-preview.workers.dev
```

### Manual Validation Checklist

- [ ] Access `/admin` (authenticate)
- [ ] Navigate to `/admin/collections/media/create`
- [ ] Upload test image (PNG, < 5 MB)
- [ ] Verify upload success message
- [ ] Check image appears in media gallery
- [ ] Open Cloudflare Dashboard → R2 bucket
- [ ] Verify file physically present in R2
- [ ] Copy image URL from Payload
- [ ] Access image URL in browser
- [ ] Verify image loads correctly
- [ ] Delete media from admin
- [ ] Verify file removed from R2 bucket

### Cloudflare Dashboard Validation

1. Login to Cloudflare Dashboard
2. Navigate to R2 → Buckets
3. Open `sebcdev-payload-cache` bucket
4. Verify uploaded files present
5. Check file metadata (size, MIME type)
6. After delete, verify file removed

---

## 📚 References

### Playwright Documentation
- [Playwright Getting Started](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright Wait Strategies](https://playwright.dev/docs/actionability)

### Accessibility Testing
- [axe-core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [Accessible Forms](https://www.w3.org/WAI/tutorials/forms/)

### Cloudflare
- [Wrangler Deploy](https://developers.cloudflare.com/workers/wrangler/commands/#deploy)
- [R2 Dashboard](https://developers.cloudflare.com/r2/buckets/dashboard/)
- [R2 Limits](https://developers.cloudflare.com/r2/platform/limits/)

---

## ❓ FAQ

**Q: What if E2E tests are flaky?**
A: Use proper wait strategies (`page.waitForSelector`), ensure test isolation (cleanup), and increase timeouts only if necessary. Flaky tests are a code smell.

**Q: How do I debug E2E test failures?**
A: Run Playwright in headed mode (`pnpm test:e2e --headed`), use `await page.pause()` for interactive debugging, check screenshots/videos in `test-results/`.

**Q: What if preview deployment fails?**
A: Check Wrangler logs, verify environment variables, ensure build succeeds locally. Common issues: missing env vars, D1 migrations not run.

**Q: Can I skip manual preview validation?**
A: No. Local Wrangler simulates R2, but preview validates production-like behavior. Critical for Story 2.2 acceptance.

**Q: What if accessibility tests fail?**
A: Review axe-core violations, fix accessibility issues in Payload admin (if possible), or document known limitations. WCAG 2.1 AA compliance is required.

**Q: How detailed should R2 documentation be?**
A: Comprehensive. Include limitations, workarounds, examples, troubleshooting. Future developers will rely on this.

---

## 🎯 Success Criteria

Phase 3 is complete when:

- [ ] All 4 commits completed and merged
- [ ] E2E tests pass in CI (GitHub Actions)
- [ ] Accessibility tests pass (WCAG 2.1 AA)
- [ ] R2 constraints documentation complete
- [ ] Preview deployment successful
- [ ] Manual validation in preview passed
- [ ] All Story 2.2 acceptance criteria met
- [ ] EPIC_TRACKING.md updated

**Phase 3 completion = Story 2.2 completion! 🎉**
