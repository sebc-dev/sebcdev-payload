# Phase 4: Code Review Guide

**Phase**: Accessibility Validation & Cleanup
**Reviewer Focus**: Test quality, accessibility compliance, documentation

---

## Review Overview

Phase 4 introduces:
1. New E2E tests for design system validation
2. Updates to existing E2E tests
3. Documentation of design tokens

**Key Review Areas**:
- Test coverage and quality
- Accessibility test correctness
- Documentation clarity

---

## Commit-by-Commit Review

### Commit 1: Add Design System E2E Tests with axe-core

#### File: `tests/e2e/design-system.e2e.spec.ts`

**Test Structure Review**:

- [ ] Tests are organized in logical `describe` blocks
- [ ] Test names clearly describe what is being tested
- [ ] Visual, Typography, Accessibility, Dark Mode sections present

**Visual Validation Tests**:

- [ ] Background color assertion uses correct RGB value
  ```typescript
  // Should be: rgb(26, 29, 35) for #1A1D23
  await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')
  ```

- [ ] Foreground color assertion is correct
  ```typescript
  // Should be: rgb(247, 250, 252) for #F7FAFC
  await expect(h1).toHaveCSS('color', 'rgb(247, 250, 252)')
  ```

- [ ] Primary color assertion is correct
  ```typescript
  // Should be: rgb(20, 184, 166) for #14B8A6
  await expect(button).toHaveCSS('background-color', 'rgb(20, 184, 166)')
  ```

**Typography Tests**:

- [ ] Font family assertions handle variations
  ```typescript
  // Font family can include fallbacks
  expect(fontFamily).toContain('Nunito')
  // Not: expect(fontFamily).toBe('Nunito Sans')
  ```

- [ ] Conditional checks for optional elements
  ```typescript
  if (await code.count() > 0) {
    // Test only if element exists
  }
  ```

**Accessibility Tests**:

- [ ] axe-core configured with correct WCAG tags
  ```typescript
  await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])  // Must include AA
    .analyze()
  ```

- [ ] Both locales tested (FR and EN)
- [ ] Violations assertion is strict (length 0)
  ```typescript
  expect(accessibilityResults.violations).toHaveLength(0)
  ```

**Admin Panel Tests**:

- [ ] Admin URL correctly navigated
- [ ] Error filtering is appropriate
  ```typescript
  // Should filter expected auth errors
  const unexpectedErrors = errors.filter(
    (e) => !e.includes('401') && !e.includes('authentication')
  )
  ```

- [ ] Style isolation verified correctly

**Common Review Issues**:

| Issue | Why It Matters | Fix |
|-------|----------------|-----|
| Hardcoded RGB values | Breaks if design tokens change | Add comment with hex reference |
| Missing `await` | Test may pass incorrectly | Ensure all Playwright calls awaited |
| Overly strict font match | Fails on fallback fonts | Use `toContain()` |
| No error handling | Test crashes on missing element | Check element count first |

---

### Commit 2: Update Frontend Tests for New Design System

#### File: `tests/e2e/frontend.e2e.spec.ts`

**Changes to Review**:

- [ ] Old style references removed
- [ ] Visual assertions updated for new colors
- [ ] No broken selectors from CSS migration

**Selector Review**:

- [ ] Class selectors still work (Tailwind classes)
  ```typescript
  // May need to update if classes changed
  page.locator('.some-class')  // vs page.getByRole(...)
  ```

- [ ] Prefer semantic selectors when possible
  ```typescript
  // Better: Uses role
  page.getByRole('heading', { level: 1 })
  // Instead of: Uses CSS class
  page.locator('h1.text-4xl')
  ```

**i18n Test Compatibility**:

- [ ] Language switching still works
- [ ] Locale-specific assertions unchanged (content, not style)

---

### Commit 3: Final Cleanup and Documentation

#### File: `src/app/globals.css`

**Documentation Review**:

- [ ] Design system name clearly stated
  ```css
  /* === Design System: Anthracite & Vert Canard === */
  ```

- [ ] Reference to source specification
  ```css
  /* Brand Guidelines: docs/specs/UX_UI_Spec.md Section 7 */
  ```

- [ ] Each color variable documented with:
  - [ ] Hex value
  - [ ] Usage description
  ```css
  --background: 222 16% 12%;  /* #1A1D23 - Anthracite (main bg) */
  ```

- [ ] Logical grouping of variables
  - Background colors
  - Surface colors
  - Text colors
  - Accent colors
  - UI element colors

**Comment Style**:

- [ ] Comments are concise
- [ ] No redundant comments
- [ ] Comments add value (not just restating the code)

---

## Quality Checklist

### Code Quality

- [ ] All tests pass locally
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Consistent code style

### Test Quality

- [ ] Tests are reliable (not flaky)
- [ ] Tests are independent
- [ ] Tests are fast enough
- [ ] Test coverage is appropriate

### Accessibility Quality

- [ ] axe-core properly configured
- [ ] All WCAG AA rules checked
- [ ] Focus management tested
- [ ] Both languages covered

### Documentation Quality

- [ ] Comments are accurate
- [ ] References are correct
- [ ] Documentation is maintainable

---

## Review Commands

```bash
# Run the new tests
pnpm test:e2e tests/e2e/design-system.e2e.spec.ts

# Run all E2E tests
pnpm test:e2e

# Check for dead code
pnpm knip

# Verify build
pnpm build

# Check CSS output
ls -la .next/static/css/
```

---

## Approval Criteria

### Must Have (Blocking)

- [ ] All tests pass
- [ ] axe-core reports 0 violations
- [ ] No TypeScript errors
- [ ] No linting errors

### Should Have (Non-Blocking)

- [ ] Tests are well-organized
- [ ] Documentation is clear
- [ ] Comments are helpful

### Nice to Have

- [ ] Test execution time < 30s
- [ ] Code comments follow team conventions

---

## Review Sign-Off

### Reviewer Checklist

- [ ] Code reviewed commit-by-commit
- [ ] Tests verified locally
- [ ] Accessibility tests checked
- [ ] Documentation reviewed
- [ ] All blocking criteria met

### Approval

```
Reviewer: _______________
Date: _______________
Status: [ ] Approved [ ] Changes Requested
```

---

**Created**: 2025-12-02
**Last Updated**: 2025-12-02
