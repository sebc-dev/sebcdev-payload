# Phase 3 - Code Review Guide

Complete guide for reviewing the Phase 3 implementation (E2E Tests & Final Validation).

---

## 🎯 Review Objective

Validate that the implementation:

- ✅ E2E tests cover all critical admin media workflows
- ✅ Accessibility compliance validated (WCAG 2.1 AA)
- ✅ R2 constraints documentation is comprehensive and accurate
- ✅ Preview deployment successful and validated
- ✅ All Story 2.2 acceptance criteria met
- ✅ Follows Playwright best practices
- ✅ Tests are stable (not flaky)
- ✅ Code is clean and well-structured

---

## 📋 Review Approach

Phase 3 is split into **4 atomic commits**. You can:

**Option A: Commit-by-commit review** (recommended)

- Easier to digest (30-90 min per commit)
- Progressive validation
- Targeted feedback
- Can approve commits incrementally

**Option B: Global review at once**

- Faster (3-4h total)
- Immediate overview
- Requires more focus
- All-or-nothing approval

**Estimated Total Time**: 3-4 hours

---

## 🔍 Commit-by-Commit Review

### Commit 1: Create E2E Test Suite for Admin Media

**Files**: `tests/e2e/admin-media.e2e.spec.ts` (~250 lines)
**Duration**: 45-60 minutes

#### Review Checklist

##### E2E Test Coverage

- [ ] **Upload workflow tested**
  - [ ] Navigate to media create form
  - [ ] File upload using `page.setInputFiles()`
  - [ ] Optional fields (alt text) fillable
  - [ ] Form submission
  - [ ] Success message verification
  - [ ] Redirect to media list
- [ ] **Gallery display tested**
  - [ ] Uploaded image appears in list
  - [ ] Thumbnail renders correctly
  - [ ] Media metadata visible
- [ ] **Edit workflow tested**
  - [ ] Navigate to edit form
  - [ ] Update fields (alt text, etc.)
  - [ ] Save changes
  - [ ] Verify changes persisted
- [ ] **Delete workflow tested**
  - [ ] Delete action triggered
  - [ ] Confirmation dialog (if exists)
  - [ ] Media removed from list
  - [ ] No console errors after delete
- [ ] **Error handling tested**
  - [ ] Invalid file type upload
  - [ ] Error message displayed
  - [ ] Form remains usable after error

##### Playwright Best Practices

- [ ] **Wait strategies**
  - [ ] Uses `page.waitForSelector()` instead of `waitForTimeout()`
  - [ ] Waits for navigation completion
  - [ ] Waits for async operations (uploads)
  - [ ] No arbitrary `setTimeout()` calls
- [ ] **Locators**
  - [ ] Prefer `data-testid` attributes
  - [ ] Stable selectors (not brittle CSS)
  - [ ] Clear and descriptive locators
- [ ] **Assertions**
  - [ ] Uses Playwright `expect()` (auto-retry)
  - [ ] Appropriate assertion methods
  - [ ] Clear failure messages
- [ ] **Test isolation**
  - [ ] `beforeEach` hook for setup
  - [ ] `afterEach` hook for cleanup (if needed)
  - [ ] Tests can run independently
  - [ ] No test interdependencies

##### Code Quality

- [ ] **Test structure**
  - [ ] Clear `describe` blocks
  - [ ] Descriptive `test` names
  - [ ] Logical test organization
  - [ ] Proper indentation
- [ ] **No bad practices**
  - [ ] No hardcoded delays
  - [ ] No commented code
  - [ ] No `console.log` statements
  - [ ] No `test.skip` or `test.only` left in code
- [ ] **Test fixtures**
  - [ ] Test image files exist in `tests/fixtures/`
  - [ ] Fixtures are appropriate (PNG, valid size)

#### Technical Validation

```bash
# Run E2E tests for admin media
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# All tests should pass
# No flaky behavior
```

**Expected Result**: 5+ tests pass, covering CRUD operations

#### Questions to Ask

1. **Coverage**: Do tests cover all critical user paths (upload, view, edit, delete)?
2. **Stability**: Are tests deterministic (no flaky behavior)?
3. **Wait strategies**: Are waits based on DOM state, not arbitrary timeouts?
4. **Error handling**: Are error scenarios tested (invalid file, network errors)?
5. **Cleanup**: Do tests clean up after themselves (delete created media)?

---

### Commit 2: Add Accessibility Tests for Upload Form

**Files**: `tests/e2e/admin-media.e2e.spec.ts` (+80 lines)
**Duration**: 30-45 minutes

#### Review Checklist

##### Accessibility Compliance

- [ ] **axe-core integration**
  - [ ] `@axe-core/playwright` imported correctly
  - [ ] `AxeBuilder` used properly
  - [ ] Scan targets correct pages (upload form, gallery)
- [ ] **WCAG 2.1 AA validation**
  - [ ] Tests use `.withTags(['wcag2a', 'wcag2aa'])`
  - [ ] All violations asserted as zero
  - [ ] Critical violations documented (if any)
- [ ] **Keyboard navigation**
  - [ ] Tab key navigation tested
  - [ ] All interactive elements focusable
  - [ ] Focus order logical
  - [ ] Form submittable with Enter key
- [ ] **ARIA attributes**
  - [ ] Form labels associated with inputs
  - [ ] Required fields have `aria-required`
  - [ ] Error messages have `aria-live`
  - [ ] Buttons have accessible names

##### Test Quality

- [ ] **Accessibility scans**
  - [ ] Scans run on upload form
  - [ ] Scans run on media gallery
  - [ ] Scans include error states (if applicable)
- [ ] **Violations handling**
  - [ ] No violations suppressed without documentation
  - [ ] Known violations documented with justification
  - [ ] Remediation plan for critical issues
- [ ] **Test descriptions**
  - [ ] Clear naming (e.g., "should be accessible (WCAG 2.1 AA)")
  - [ ] Indicates what is being tested

##### Code Quality

- [ ] **axe-core usage**
  - [ ] Correct `AxeBuilder` syntax
  - [ ] Appropriate tags selected
  - [ ] Results properly asserted
- [ ] **No suppressed rules**
  - [ ] If rules excluded, documented why
  - [ ] Example: `.disableRules(['color-contrast'])` with reason
- [ ] **Clear assertions**
  - [ ] `expect(violations).toEqual([])` for zero violations
  - [ ] Or custom assertion with clear message

#### Technical Validation

```bash
# Run E2E tests with accessibility checks
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# Should pass all accessibility tests
# No WCAG 2.1 AA violations
```

**Expected Result**: Accessibility tests pass, no critical violations

#### Questions to Ask

1. **Compliance**: Does the upload form meet WCAG 2.1 AA standards?
2. **Coverage**: Are all critical interactions tested (keyboard, screen reader)?
3. **Violations**: Are all violations documented and justified (if any)?
4. **axe-core**: Is axe-core configured correctly (tags, rules)?
5. **Remediation**: If violations found, is there a plan to fix them?

---

### Commit 3: Create Media R2 Constraints Documentation

**Files**: `docs/guides/media-r2-constraints.md` (~200 lines)
**Duration**: 30-45 minutes

#### Review Checklist

##### Content Accuracy

- [ ] **R2 upload limits**
  - [ ] Free tier: 100 MiB documented correctly
  - [ ] Business tier: 200 MiB documented correctly
  - [ ] Enterprise tier: 500 MiB mentioned (if applicable)
  - [ ] Max object size: 5 TiB accurate
- [ ] **Workers limitations**
  - [ ] Sharp unavailable explained
  - [ ] `crop: false`, `focalPoint: false` mentioned
  - [ ] Consequence for image processing documented
- [ ] **Local vs Production**
  - [ ] Wrangler simulation explained
  - [ ] Differences documented (if any)
  - [ ] Testing recommendation (preview environment)
- [ ] **CORS configuration**
  - [ ] When CORS needed explained
  - [ ] Example policy provided
  - [ ] Current setup clarified (no CORS needed)

##### Completeness

- [ ] **All limitations covered**
  - [ ] Upload size limits
  - [ ] Image processing constraints
  - [ ] Local development differences
  - [ ] CORS requirements
  - [ ] Performance considerations
- [ ] **Workarounds provided**
  - [ ] Cloudflare Images for transformations
  - [ ] Presigned URLs for large files
  - [ ] Batch operations guidance
- [ ] **Troubleshooting section**
  - [ ] Common issues documented
  - [ ] Solutions provided
  - [ ] Verification steps included
- [ ] **References**
  - [ ] Links to Cloudflare R2 docs
  - [ ] Links to Payload storage-r2 plugin
  - [ ] Links to Cloudflare Images (if mentioned)

##### Documentation Quality

- [ ] **Structure**
  - [ ] Clear headings hierarchy
  - [ ] Logical section flow
  - [ ] Table of contents (if long)
- [ ] **Formatting**
  - [ ] Proper markdown syntax
  - [ ] Code blocks formatted correctly
  - [ ] Tables for structured data (limits, etc.)
  - [ ] Links work correctly
- [ ] **Clarity**
  - [ ] Technical terms explained
  - [ ] Examples provided where helpful
  - [ ] No ambiguous statements
  - [ ] No placeholder text (`TODO`, `[pending]`, etc.)

#### Technical Validation

```bash
# Read documentation
cat docs/guides/media-r2-constraints.md

# Verify links (manual check or use markdown linter)
# Verify code examples (syntax correct)
```

**Expected Result**: Complete, accurate, well-formatted documentation

#### Questions to Ask

1. **Accuracy**: Are R2 limits verified against official Cloudflare documentation?
2. **Completeness**: Are all major limitations covered?
3. **Usefulness**: Would a new developer understand R2 constraints after reading?
4. **Workarounds**: Are practical alternatives provided for each limitation?
5. **Maintenance**: Is documentation easy to update as Cloudflare evolves?

---

### Commit 4: Final Validation and Cleanup

**Files**: `story_2.2.md`, `EPIC_TRACKING.md`, cleanup
**Duration**: 30-60 minutes

#### Review Checklist

##### Testing Validation

- [ ] **All tests pass**
  - [ ] Unit tests: `pnpm test:unit`
  - [ ] Integration tests: `pnpm test:int`
  - [ ] E2E tests: `pnpm test:e2e`
  - [ ] Full suite: `pnpm test`
- [ ] **Coverage adequate**
  - [ ] Integration tests >80% coverage
  - [ ] E2E tests cover critical paths
  - [ ] No major gaps in test coverage
- [ ] **Tests stable**
  - [ ] No flaky tests
  - [ ] Consistent pass/fail
  - [ ] CI tests pass

##### Code Quality

- [ ] **Type-checking**
  - [ ] `pnpm exec tsc --noEmit` passes
  - [ ] No type errors
- [ ] **Linting**
  - [ ] `pnpm lint` passes
  - [ ] No linting errors or warnings
- [ ] **Build**
  - [ ] `pnpm build` succeeds
  - [ ] No build errors
  - [ ] Build output size reasonable

##### Preview Deployment

- [ ] **Deployment successful**
  - [ ] `pnpm exec wrangler deploy --env preview` works
  - [ ] Deployment URL accessible
  - [ ] No deployment errors
- [ ] **Manual validation**
  - [ ] Upload test image via admin
  - [ ] Verify image in R2 bucket (Cloudflare Dashboard)
  - [ ] Access image URL successfully
  - [ ] Delete media, verify R2 cleanup
- [ ] **Logs clean**
  - [ ] No errors in preview logs
  - [ ] No warnings in console

##### Story Completion

- [ ] **Acceptance criteria**
  - [ ] All Story 2.2 criteria checked in `story_2.2.md`
  - [ ] CA1: Upload depuis le Back-office ✅
  - [ ] CA2: Présence dans le bucket R2 ✅
  - [ ] CA3: Accessibilité URL ✅
  - [ ] CA4: Metadata stockées ✅
  - [ ] CA5: Operations CRUD complètes ✅
- [ ] **Status updates**
  - [ ] Story 2.2 status → COMPLETED
  - [ ] EPIC_TRACKING.md updated
  - [ ] Progress: 3/3 phases
  - [ ] Recent Updates section updated

##### Code Cleanup

- [ ] **No debug code**
  - [ ] No `console.log` statements
  - [ ] No commented code
  - [ ] No `debugger` statements
- [ ] **Clean imports**
  - [ ] No unused imports
  - [ ] Imports organized
- [ ] **No TODOs**
  - [ ] No unresolved TODO comments
  - [ ] All tasks completed

#### Technical Validation

```bash
# Full validation suite
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm build

# Preview deployment
pnpm exec wrangler deploy --env preview

# Manual validation in browser
# (see checklist above)
```

**Expected Result**: All validations pass, Story 2.2 complete

#### Questions to Ask

1. **Completeness**: Are all Story 2.2 acceptance criteria met?
2. **Quality**: Do all quality gates pass (tests, lint, build)?
3. **Deployment**: Does preview deployment work as expected?
4. **Documentation**: Is EPIC_TRACKING.md updated correctly?
5. **Cleanup**: Is code clean (no debug statements, unused code)?

---

## ✅ Global Validation

After reviewing all commits:

### Architecture & Design

- [ ] E2E tests follow Playwright best practices
- [ ] Accessibility testing integrated properly
- [ ] Documentation structure clear and maintainable
- [ ] Preview validation workflow documented

### Code Quality

- [ ] Consistent coding style (Playwright tests)
- [ ] Clear naming (test names, fixtures)
- [ ] Appropriate comments (only where needed)
- [ ] No dead code or debug statements

### Testing

- [ ] E2E tests cover all critical paths
- [ ] Accessibility tests validate WCAG 2.1 AA
- [ ] Tests are stable (not flaky)
- [ ] Coverage adequate (>80% integration, critical paths E2E)

### Type Safety

- [ ] TypeScript compiles without errors
- [ ] No `any` types in test code (unless justified)

### Performance

- [ ] E2E tests run in reasonable time (<5 min)
- [ ] No unnecessary waits or delays
- [ ] Tests parallelizable (if configured)

### Security

- [ ] No sensitive data in test fixtures
- [ ] No credentials hardcoded
- [ ] Environment variables used correctly

### Documentation

- [ ] R2 constraints documentation complete
- [ ] EPIC_TRACKING.md updated
- [ ] Story 2.2 acceptance criteria documented
- [ ] README updated (if needed)

---

## 📝 Feedback Template

Use this template for feedback:

```markdown
## Review Feedback - Phase 3

**Reviewer**: [Name]
**Date**: [Date]
**Commits Reviewed**: All (1-4)

### ✅ Strengths

- E2E test coverage is comprehensive (upload, edit, delete all tested)
- Accessibility tests properly integrated with axe-core
- R2 documentation clear and well-structured
- Preview validation thorough

### 🔧 Required Changes

1. **tests/e2e/admin-media.e2e.spec.ts**: Replace `waitForTimeout(2000)` with `waitForSelector('[data-testid="success-message"]')`
   - **Why**: Arbitrary timeouts cause flaky tests
   - **Suggestion**: Use DOM-based waits for upload completion

2. **docs/guides/media-r2-constraints.md**: Update Business tier limit to 200 MiB (currently shows 100 MiB)
   - **Why**: Documentation inaccuracy
   - **Suggestion**: Verify against https://developers.cloudflare.com/r2/platform/limits/

### 💡 Suggestions (Optional)

- Consider adding E2E test for multiple file uploads (if supported)
- Add screenshot on test failure for easier debugging
- Consider page object pattern if tests grow in complexity

### 📊 Verdict

- [ ] ✅ **APPROVED** - Ready to merge
- [x] 🔧 **CHANGES REQUESTED** - Fix required changes above
- [ ] ❌ **REJECTED** - Major rework needed

### Next Steps

1. Address required changes (waits, documentation)
2. Re-run E2E tests to verify stability
3. Request re-review
```

---

## 🎯 Review Actions

### If Approved ✅

1. **Merge commits** to main branch
2. **Update phase status** to COMPLETED in INDEX.md
3. **Update story status** to COMPLETED in story_2.2.md
4. **Archive review notes** for future reference
5. **Celebrate** 🎉 Story 2.2 complete!

### If Changes Requested 🔧

1. **Create detailed feedback** using template above
2. **Discuss with developer** (clarify issues if needed)
3. **Provide examples** of how to fix issues
4. **Re-review after fixes** (focus on changed areas)
5. **Approve** when all issues resolved

### If Rejected ❌

1. **Document major issues** clearly
2. **Schedule discussion** with team/developer
3. **Plan rework strategy** (what needs to change)
4. **Set expectations** for re-submission
5. **Provide support** to help developer succeed

---

## ❓ FAQ

**Q: What if I disagree with the E2E test approach?**
A: Discuss with developer. If tests pass and meet requirements, approach may be fine. Focus on stability and coverage.

**Q: Should I run E2E tests myself during review?**
A: Yes, at least once. Verify tests pass and are not flaky. Check CI results as well.

**Q: How detailed should feedback be on test code?**
A: Specific enough to be actionable. Include file, line, and suggestion for fix.

**Q: Can I approve with minor comments (non-blocking)?**
A: Yes! Mark as approved and note that comments are optional improvements. Developer can address in future commits.

**Q: What if preview deployment fails but E2E tests pass?**
A: This is a blocking issue. Preview validation is part of Phase 3 success criteria. Work with developer to debug.

**Q: Should I test accessibility manually (screen reader)?**
A: Nice-to-have, but not required. axe-core tests are sufficient for WCAG 2.1 AA compliance.

**Q: What if R2 documentation is incomplete?**
A: Request additions. Documentation should be comprehensive enough for future developers.

**Q: Can I approve if one acceptance criterion is not met?**
A: No. All Story 2.2 acceptance criteria must be met for Phase 3 (and Story 2.2) completion.

---

## 🎓 Review Best Practices

### For Reviewers

1. **Test locally**: Run E2E tests yourself at least once
2. **Check CI**: Verify tests pass in CI environment
3. **Manual validation**: Test preview deployment if possible
4. **Be constructive**: Provide helpful feedback, not just criticism
5. **Ask questions**: If unsure, ask developer to explain
6. **Acknowledge good work**: Highlight strengths in feedback

### For Developers

1. **Self-review first**: Use this guide before submitting for review
2. **Provide context**: Explain non-obvious decisions in PR description
3. **Run all checks**: Ensure tests/lint/build pass before review
4. **Be responsive**: Address feedback quickly and thoroughly
5. **Ask for clarification**: If feedback unclear, ask reviewer

---

## 📊 Review Metrics

| Metric                  | Target        | Actual |
| ----------------------- | ------------- | ------ |
| **Review Time**         | 3-4h          | -      |
| **E2E Tests**           | 5+ tests      | -      |
| **A11y Violations**     | 0 critical    | -      |
| **Test Stability**      | 100% pass     | -      |
| **Preview Validation**  | ✅ Success    | -      |
| **Story Completion**    | 100% criteria | -      |

---

**Review completed by**: [Name]
**Date**: [Date]
**Verdict**: [Approved / Changes Requested / Rejected]
**Notes**: [Additional notes or observations]
