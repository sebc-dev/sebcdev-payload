# Phase 4: Commit Checklist

**Phase**: Accessibility Validation & Cleanup
**Total Commits**: 3

Use this checklist to validate each commit before pushing.

---

## Commit 1: Add Design System E2E Tests with axe-core

### Pre-Commit Checklist

#### Dependencies
- [ ] `@axe-core/playwright` installed (`pnpm add -D @axe-core/playwright`)
- [ ] No version conflicts in package.json

#### Files Created
- [ ] `tests/e2e/design-system.e2e.spec.ts` exists
- [ ] File follows project conventions (naming, imports)

#### Test Content Verification
- [ ] Visual validation tests included:
  - [ ] Background color test (anthracite #1A1D23)
  - [ ] Foreground color test (off-white #F7FAFC)
  - [ ] Primary color test (teal #14B8A6)
- [ ] Typography tests included:
  - [ ] Nunito Sans font family check
  - [ ] JetBrains Mono font family check
- [ ] Accessibility tests included:
  - [ ] axe-core WCAG 2.1 AA audit (FR)
  - [ ] axe-core WCAG 2.1 AA audit (EN)
  - [ ] Focus ring visibility test
- [ ] Dark mode tests included:
  - [ ] HTML dark class check
  - [ ] CSS variables validation
- [ ] Admin panel tests included:
  - [ ] Admin loads without errors
  - [ ] Admin styles are independent

#### Test Execution
- [ ] Tests run successfully: `pnpm test:e2e tests/e2e/design-system.e2e.spec.ts`
- [ ] All tests pass (no failures)
- [ ] No accessibility violations reported by axe-core

#### Code Quality
- [ ] TypeScript compilation passes
- [ ] No linting errors: `pnpm lint`
- [ ] No unused imports

### Commit Message

```
feat(a11y): add design system E2E tests with axe-core

- Add visual validation tests for brand colors
- Add typography tests for Nunito Sans and JetBrains Mono
- Add accessibility tests using axe-core (WCAG 2.1 AA)
- Add focus ring visibility tests
- Add dark mode CSS variable validation
- Add admin panel isolation tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Post-Commit Verification
- [ ] `git status` shows clean working directory
- [ ] `pnpm build` still works
- [ ] No regressions in other tests

---

## Commit 2: Update Frontend Tests for New Design System

### Pre-Commit Checklist

#### Files Modified
- [ ] `tests/e2e/frontend.e2e.spec.ts` reviewed
- [ ] Visual assertions updated if needed
- [ ] No hardcoded old style values remaining

#### Changes Verification
- [ ] All visual assertions match new design system:
  - [ ] Background colors reference anthracite theme
  - [ ] Text colors reference off-white theme
  - [ ] No references to old styles.css classes
- [ ] i18n tests still work correctly
- [ ] Locale switching tests pass

#### Test Execution
- [ ] `pnpm test:e2e tests/e2e/frontend.e2e.spec.ts` passes
- [ ] All frontend tests green
- [ ] No test timeouts or flakiness

#### Code Quality
- [ ] TypeScript compilation passes
- [ ] No linting errors
- [ ] Consistent test patterns used

### Commit Message

```
test(e2e): update frontend tests for new design system

- Update visual assertions to match new brand colors
- Ensure tests work with Tailwind utility classes
- Verify i18n tests still pass with new styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Post-Commit Verification
- [ ] All E2E tests pass: `pnpm test:e2e`
- [ ] No test regressions
- [ ] CI would pass (run all quality checks)

---

## Commit 3: Final Cleanup and Documentation

### Pre-Commit Checklist

#### Documentation Added
- [ ] `src/app/globals.css` has inline comments for:
  - [ ] Design System name and reference
  - [ ] Background colors with hex values
  - [ ] Foreground colors with hex values
  - [ ] Surface/card colors
  - [ ] Primary/accent colors
  - [ ] Border and ring colors
  - [ ] Contrast ratio notes where relevant

#### Dead Code Check
- [ ] `pnpm knip` runs without errors
- [ ] No unused exports detected
- [ ] No unused dependencies
- [ ] No unused files

#### Final Build Verification
- [ ] `pnpm build` succeeds
- [ ] Build output clean (no warnings)
- [ ] CSS bundle size verified (< 50KB gzipped)

#### Complete Test Suite
- [ ] `pnpm test` passes (all tests)
- [ ] `pnpm test:unit` passes
- [ ] `pnpm test:e2e` passes

### Commit Message

```
docs(design): add token documentation and final cleanup

- Add inline documentation for CSS design tokens
- Reference UX_UI_Spec.md for brand guidelines
- Document color usage and contrast ratios
- Verify no dead code with Knip

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Post-Commit Verification
- [ ] All checks pass
- [ ] Documentation is clear and helpful
- [ ] Ready for PR

---

## Phase Completion Checklist

### All Commits Complete
- [ ] Commit 1: E2E tests added
- [ ] Commit 2: Frontend tests updated
- [ ] Commit 3: Documentation and cleanup

### Final Validations
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (all tests)
- [ ] `pnpm knip` clean
- [ ] Lighthouse Accessibility >= 95

### Documentation Updates
- [ ] Update PHASES_PLAN.md status to COMPLETED
- [ ] Update EPIC_TRACKING.md
- [ ] Complete validation/VALIDATION_CHECKLIST.md

### Ready for Merge
- [ ] All acceptance criteria met
- [ ] No blocking issues
- [ ] Story 3.2 can be marked complete

---

## Quick Reference Commands

```bash
# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/e2e/design-system.e2e.spec.ts

# Check for dead code
pnpm knip

# Run all quality checks
pnpm lint && pnpm build && pnpm test

# View Lighthouse scores (after running E2E)
# Scores are in the test output

# Check CSS bundle size
ls -la .next/static/css/
```

---

**Created**: 2025-12-02
**Last Updated**: 2025-12-02
