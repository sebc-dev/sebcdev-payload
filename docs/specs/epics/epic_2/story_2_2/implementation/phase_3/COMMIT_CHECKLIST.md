# Phase 3 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 3.

---

## 📋 Commit 1: Create E2E Test Suite for Admin Media

**Files**:
- `tests/e2e/admin-media.e2e.spec.ts` (new)

**Estimated Duration**: 90-120 minutes

### Implementation Tasks

- [ ] Create `tests/e2e/admin-media.e2e.spec.ts` file
- [ ] Import Playwright test utilities (`test`, `expect`)
- [ ] Setup test describe block: `Admin Media Upload E2E`
- [ ] Add `beforeEach` hook for authentication and navigation
  - [ ] Navigate to admin login page
  - [ ] Authenticate with test user credentials
  - [ ] Navigate to media collection
- [ ] Implement test: Upload image via admin form
  - [ ] Click "Create New" button
  - [ ] Use `page.setInputFiles()` to upload test image
  - [ ] Fill optional fields (alt text)
  - [ ] Submit form
  - [ ] Wait for success message
  - [ ] Verify redirect to media list
- [ ] Implement test: Display uploaded image in gallery
  - [ ] Navigate to media list
  - [ ] Verify uploaded image appears
  - [ ] Check image thumbnail renders
- [ ] Implement test: Edit media metadata
  - [ ] Click edit on existing media
  - [ ] Update alt text field
  - [ ] Submit form
  - [ ] Verify changes saved
- [ ] Implement test: Delete media
  - [ ] Click delete on existing media
  - [ ] Confirm deletion
  - [ ] Verify media removed from list
- [ ] Implement test: Handle upload errors
  - [ ] Try uploading invalid file type
  - [ ] Verify error message displayed
- [ ] Add `afterEach` hook for cleanup (if needed)
- [ ] Create test fixtures (sample image files)
  - [ ] `tests/fixtures/test-image.png` (valid PNG)
  - [ ] `tests/fixtures/test-image-large.png` (for size tests)

### Validation

```bash
# Run E2E tests for admin media
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# Run all E2E tests
pnpm test:e2e

# Run in headed mode (for debugging)
pnpm test:e2e --headed
```

**Expected Result**:
- All E2E tests pass
- 5+ tests covering CRUD operations
- Tests use proper wait strategies (no flaky behavior)

### Review Checklist

#### Test Coverage

- [ ] Upload workflow fully tested (form → submit → success)
- [ ] Gallery display tested (image appears in list)
- [ ] Edit workflow tested (update metadata)
- [ ] Delete workflow tested (remove from gallery)
- [ ] Error handling tested (invalid file type)

#### Playwright Best Practices

- [ ] Use `page.waitForSelector()` instead of `setTimeout()`
- [ ] Use `expect()` from Playwright for automatic retries
- [ ] Proper locators (prefer data-testid over CSS selectors)
- [ ] Test isolation (each test independent)
- [ ] Clear test descriptions

#### Code Quality

- [ ] No hardcoded delays or arbitrary timeouts
- [ ] Clear test naming (describes behavior)
- [ ] No commented code
- [ ] No debug statements (console.log)

### Commit Message

```bash
git add tests/e2e/admin-media.e2e.spec.ts tests/fixtures/
git commit -m "$(cat <<'EOF'
✅ test(e2e): add admin media CRUD E2E tests

- Upload image via admin form with success validation
- Display uploaded images in media gallery
- Edit media metadata (alt text)
- Delete media and verify removal
- Handle upload errors gracefully
- Proper test isolation with beforeEach authentication

Part of Phase 3 - Commit 1/4
EOF
)"
```

---

## 📋 Commit 2: Add Accessibility Tests for Upload Form

**Files**:
- `tests/e2e/admin-media.e2e.spec.ts` (modify)

**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Install `@axe-core/playwright` (if not already installed)
  ```bash
  pnpm add -D @axe-core/playwright
  ```
- [ ] Import AxeBuilder in test file
  ```typescript
  import AxeBuilder from '@axe-core/playwright'
  ```
- [ ] Add test: Upload form accessibility (WCAG 2.1 AA)
  - [ ] Navigate to media create form
  - [ ] Run axe-core scan on form
  - [ ] Assert no WCAG 2.1 AA violations
  ```typescript
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(accessibilityScanResults.violations).toEqual([])
  ```
- [ ] Add test: Keyboard navigation
  - [ ] Navigate form using Tab key
  - [ ] Verify all interactive elements focusable
  - [ ] Test form submission with Enter key
- [ ] Add test: Form labels and ARIA attributes
  - [ ] Verify all inputs have associated labels
  - [ ] Check required fields have aria-required
  - [ ] Verify error messages have aria-live
- [ ] Add test: Error message accessibility
  - [ ] Trigger validation error
  - [ ] Verify error message announced to screen readers
  - [ ] Check error linked to input (aria-describedby)

### Validation

```bash
# Run E2E tests with accessibility checks
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# Should show no accessibility violations
# All tests pass
```

**Expected Result**:
- Accessibility tests pass
- No WCAG 2.1 AA violations
- Form is keyboard navigable
- ARIA attributes correct

### Review Checklist

#### Accessibility Compliance

- [ ] axe-core integration correct (@axe-core/playwright imported)
- [ ] Tests validate WCAG 2.1 Level A and AA
- [ ] Keyboard navigation verified
- [ ] ARIA attributes tested
- [ ] Error messages accessible

#### Test Quality

- [ ] Accessibility scans target correct pages
- [ ] Violations properly asserted (expect.toEqual([]))
- [ ] Tests cover critical user paths
- [ ] Clear test descriptions

#### Code Quality

- [ ] No suppressed violations (unless documented)
- [ ] Clear naming for accessibility tests
- [ ] No console errors during tests
- [ ] Tests are deterministic (not flaky)

### Commit Message

```bash
git add tests/e2e/admin-media.e2e.spec.ts
git commit -m "$(cat <<'EOF'
♿️ test(a11y): add accessibility tests for upload form

- WCAG 2.1 AA compliance validation using axe-core
- Keyboard navigation testing (Tab, Enter)
- Form labels and ARIA attributes verification
- Error message accessibility (aria-live, aria-describedby)
- No critical accessibility violations

Part of Phase 3 - Commit 2/4
EOF
)"
```

---

## 📋 Commit 3: Create Media R2 Constraints Documentation

**Files**:
- `docs/guides/media-r2-constraints.md` (new)

**Estimated Duration**: 60-90 minutes

### Implementation Tasks

- [ ] Create `docs/guides/media-r2-constraints.md` file
- [ ] Add document header and overview
  - [ ] Purpose: Document R2 limitations on Cloudflare Workers
  - [ ] Audience: Developers, DevOps
- [ ] Section: R2 Upload Limitations
  - [ ] Max upload size via Workers binding
    - [ ] Free: 100 MiB
    - [ ] Business: 200 MiB
    - [ ] Enterprise: 500 MiB
  - [ ] Max object size: 5 TiB
  - [ ] Object key length: 1,024 bytes
  - [ ] Object metadata size: 8,192 bytes
- [ ] Section: Workers Platform Limitations
  - [ ] Sharp not available (no server-side image processing)
  - [ ] Consequence: `crop: false`, `focalPoint: false` in Media collection
  - [ ] Workaround: Use Cloudflare Images for transformations
- [ ] Section: Local Development vs Production
  - [ ] Wrangler simulates R2 in `.wrangler/state/r2`
  - [ ] Behavior differences (if any)
  - [ ] Testing recommendation: Validate in preview environment
- [ ] Section: CORS Configuration
  - [ ] When CORS is needed (direct bucket access)
  - [ ] Example CORS policy JSON
  - [ ] Note: Current setup serves via Worker (no CORS needed)
- [ ] Section: Performance Considerations
  - [ ] R2 read latency
  - [ ] Caching strategies
  - [ ] CDN integration (Cloudflare Images)
- [ ] Section: Workarounds and Alternatives
  - [ ] **Image Transformations**: Cloudflare Images
  - [ ] **Large Files (>100 MiB)**: Presigned URLs
  - [ ] **Batch Operations**: R2 API batch delete
- [ ] Section: Troubleshooting
  - [ ] Issue: Upload fails with 413 error
    - [ ] Solution: File exceeds plan limit
  - [ ] Issue: Image URL not accessible
    - [ ] Solution: Check Worker route, R2 binding
  - [ ] Issue: Local R2 empty after restart
    - [ ] Solution: Wrangler simulated R2 is ephemeral
- [ ] Section: References
  - [ ] Links to Cloudflare R2 documentation
  - [ ] Links to Payload storage-r2 plugin docs
  - [ ] Links to Cloudflare Images docs

### Validation

```bash
# Verify documentation exists
cat docs/guides/media-r2-constraints.md

# Check formatting (if markdown linter available)
# pnpm exec markdownlint docs/guides/media-r2-constraints.md

# Manual review: Read through entire document
```

**Expected Result**:
- Complete, accurate documentation
- All R2 limitations covered
- Workarounds provided
- Clear structure and formatting

### Review Checklist

#### Content Accuracy

- [ ] R2 limitations accurately documented (verified against Cloudflare docs)
- [ ] Upload size limits correct for each plan tier
- [ ] Workers limitations correctly explained
- [ ] CORS section accurate

#### Completeness

- [ ] All major limitations covered
- [ ] Workarounds provided for each limitation
- [ ] Troubleshooting section comprehensive
- [ ] References include official documentation links

#### Documentation Quality

- [ ] Clear structure with headings
- [ ] Code examples where appropriate
- [ ] Tables for structured data (upload limits, etc.)
- [ ] No placeholder text or TODOs
- [ ] Proper markdown formatting

### Commit Message

```bash
git add docs/guides/media-r2-constraints.md
git commit -m "$(cat <<'EOF'
📝 docs: create media R2 constraints documentation

- Document upload size limits (100 MiB Free, 200 MiB Business)
- Explain Workers limitations (no Sharp, image processing)
- Local development vs production differences
- CORS configuration guidance
- Workarounds: Cloudflare Images, presigned URLs
- Troubleshooting common issues
- References to official Cloudflare documentation

Part of Phase 3 - Commit 3/4
EOF
)"
```

---

## 📋 Commit 4: Final Validation and Cleanup

**Files**:
- `docs/specs/epics/epic_2/story_2_2/story_2.2.md` (update)
- `docs/specs/epics/epic_2/EPIC_TRACKING.md` (update)
- Any minor fixes discovered during validation

**Estimated Duration**: 60-90 minutes (validation + updates)

### Implementation Tasks

#### Testing Validation

- [ ] Run complete test suite
  ```bash
  pnpm test
  ```
- [ ] Verify all unit tests pass
- [ ] Verify all integration tests pass
- [ ] Verify all E2E tests pass
- [ ] Check test coverage report
  ```bash
  pnpm test --coverage
  ```
- [ ] Verify coverage >80% for integration tests

#### Type-checking and Linting

- [ ] Run TypeScript type-checking
  ```bash
  pnpm exec tsc --noEmit
  ```
- [ ] Verify no type errors
- [ ] Run linter
  ```bash
  pnpm lint
  ```
- [ ] Fix any linting issues

#### Build Validation

- [ ] Run production build
  ```bash
  pnpm build
  ```
- [ ] Verify build succeeds with no errors
- [ ] Verify build output size reasonable

#### Preview Deployment

- [ ] Deploy to preview environment
  ```bash
  pnpm exec wrangler deploy --env preview
  ```
- [ ] Note preview deployment URL
- [ ] Manual validation in preview:
  - [ ] Access `/admin` and authenticate
  - [ ] Navigate to `/admin/collections/media/create`
  - [ ] Upload test image (PNG, < 5 MB)
  - [ ] Verify upload success
  - [ ] Check image in media gallery
  - [ ] Verify image URL accessible
  - [ ] Open Cloudflare Dashboard → R2 bucket
  - [ ] Verify file present in R2
  - [ ] Delete media from admin
  - [ ] Verify file removed from R2

#### Story Acceptance Criteria Validation

- [ ] Open `docs/specs/epics/epic_2/story_2_2/story_2.2.md`
- [ ] Review all acceptance criteria
- [ ] Mark all criteria as complete:
  - [ ] CA1: Upload depuis le Back-office ✅
  - [ ] CA2: Présence dans le bucket R2 ✅
  - [ ] CA3: Accessibilité URL ✅
  - [ ] CA4: Metadata stockées ✅
  - [ ] CA5: Operations CRUD complètes ✅
- [ ] Update story status to COMPLETED

#### Epic Tracking Update

- [ ] Open `docs/specs/epics/epic_2/EPIC_TRACKING.md`
- [ ] Update Story 2.2 status to COMPLETED
- [ ] Update Story 2.2 progress to 3/3 phases
- [ ] Update Recent Updates section with completion date
- [ ] Update metrics (Stories Completed count)

#### Code Cleanup

- [ ] Remove any debug console.log statements
- [ ] Remove unused imports
- [ ] Remove commented code
- [ ] Verify no TODO comments left

### Validation

```bash
# Complete validation suite
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm build

# Preview deployment
pnpm exec wrangler deploy --env preview

# Manual validation in browser
# (see tasks above)
```

**Expected Result**:
- All tests pass
- Build succeeds
- Preview deployment works
- Manual validation passes
- Story 2.2 marked COMPLETED

### Review Checklist

#### Tests

- [ ] All test suites pass (unit, int, e2e)
- [ ] Coverage meets target (>80%)
- [ ] No skipped or pending tests
- [ ] No flaky tests

#### Code Quality

- [ ] Type-checking passes
- [ ] Linting passes
- [ ] No console errors or warnings
- [ ] Code is clean (no debug statements)

#### Documentation

- [ ] Story acceptance criteria all checked
- [ ] EPIC_TRACKING.md updated correctly
- [ ] Story status updated to COMPLETED
- [ ] Phase 3 documentation complete

#### Deployment

- [ ] Preview deployment successful
- [ ] Manual validation passed
- [ ] R2 integration verified in preview
- [ ] No errors in preview logs

### Commit Message

```bash
git add docs/specs/epics/epic_2/story_2_2/story_2.2.md docs/specs/epics/epic_2/EPIC_TRACKING.md
git commit -m "$(cat <<'EOF'
✅ test: final validation and story 2.2 completion

- All tests pass (unit, integration, E2E)
- Preview deployment successful and validated
- R2 integration verified in production-like environment
- All Story 2.2 acceptance criteria met
- EPIC_TRACKING.md updated (Story 2.2 COMPLETED)
- Code cleanup (remove debug statements, unused imports)

Story 2.2 - Validation du Stockage R2: COMPLETE ✅

Part of Phase 3 - Commit 4/4
EOF
)"
```

---

## ✅ Final Phase Validation

After all commits:

### Complete Phase Checklist

- [ ] All 4 commits completed
- [ ] All tests pass (unit + int + e2e)
- [ ] Type-checking passes
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Preview deployment successful
- [ ] Manual validation in preview passed
- [ ] R2 constraints documentation complete
- [ ] Accessibility tests pass (WCAG 2.1 AA)
- [ ] Story 2.2 acceptance criteria all met
- [ ] EPIC_TRACKING.md updated
- [ ] VALIDATION_CHECKLIST.md completed

### Final Validation Commands

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
# (see Commit 4 checklist)
```

**Phase 3 is complete when all checkboxes are checked! 🎉**

**Story 2.2 is complete when Phase 3 is complete! 🚀**
