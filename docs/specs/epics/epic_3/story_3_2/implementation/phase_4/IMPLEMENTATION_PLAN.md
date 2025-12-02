# Phase 4: Implementation Plan

**Phase**: Accessibility Validation & Cleanup
**Story**: 3.2 - Integration Design System (Dark Mode)
**Commits**: 3 atomic commits
**Estimated Time**: 1.5-2 hours

---

## Commit Overview

| # | Commit Message | Files | Lines | Time |
|---|----------------|-------|-------|------|
| 1 | `feat(a11y): add design system E2E tests with axe-core` | 1 new | ~150 | 45 min |
| 2 | `test(e2e): update frontend tests for new design system` | 1 modified | ~30 | 30 min |
| 3 | `docs(design): add token documentation and final cleanup` | 1 modified | ~20 | 20 min |

**Total**: ~200 lines across 3 files

---

## Commit 1: Add Design System E2E Tests with axe-core

### Objective

Create comprehensive E2E tests that validate the design system implementation including visual correctness and accessibility compliance.

### Files to Create

#### `tests/e2e/design-system.e2e.spec.ts` (~150 lines)

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Design System', () => {
  test.describe('Visual Validation', () => {
    test('homepage displays correct brand colors', async ({ page }) => {
      await page.goto('/fr')

      // Verify background color is anthracite
      const body = page.locator('body')
      await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')
    })

    test('primary text uses correct foreground color', async ({ page }) => {
      await page.goto('/fr')

      // Check main heading color
      const h1 = page.locator('h1').first()
      await expect(h1).toHaveCSS('color', 'rgb(247, 250, 252)')
    })

    test('primary button uses teal accent', async ({ page }) => {
      await page.goto('/fr')

      // Check primary button background
      const button = page.getByRole('button').first()
      if (await button.count() > 0) {
        await expect(button).toHaveCSS('background-color', 'rgb(20, 184, 166)')
      }
    })
  })

  test.describe('Typography', () => {
    test('headings use Nunito Sans font', async ({ page }) => {
      await page.goto('/fr')

      const h1 = page.locator('h1').first()
      const fontFamily = await h1.evaluate((el) =>
        window.getComputedStyle(el).fontFamily
      )
      expect(fontFamily).toContain('Nunito')
    })

    test('code elements use JetBrains Mono font', async ({ page }) => {
      await page.goto('/fr')

      const code = page.locator('code').first()
      if (await code.count() > 0) {
        const fontFamily = await code.evaluate((el) =>
          window.getComputedStyle(el).fontFamily
        )
        expect(fontFamily).toContain('JetBrains')
      }
    })
  })

  test.describe('Accessibility', () => {
    test('homepage passes axe-core audit', async ({ page }) => {
      await page.goto('/fr')

      const accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityResults.violations).toHaveLength(0)
    })

    test('homepage EN passes axe-core audit', async ({ page }) => {
      await page.goto('/en')

      const accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityResults.violations).toHaveLength(0)
    })

    test('focus rings are visible', async ({ page }) => {
      await page.goto('/fr')

      // Tab to first focusable element
      await page.keyboard.press('Tab')

      // Check that focus is visible (ring color should be teal)
      const focusedElement = page.locator(':focus')
      if (await focusedElement.count() > 0) {
        const outline = await focusedElement.evaluate((el) =>
          window.getComputedStyle(el).outlineColor
        )
        // Should have visible focus indicator
        expect(outline).not.toBe('transparent')
      }
    })
  })

  test.describe('Dark Mode', () => {
    test('html element has dark class', async ({ page }) => {
      await page.goto('/fr')

      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    })

    test('CSS variables are correctly set', async ({ page }) => {
      await page.goto('/fr')

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--background')
          .trim()
      })

      // Should be HSL values for anthracite
      expect(bgColor).toContain('222')
    })
  })
})

test.describe('Admin Panel Isolation', () => {
  test('admin panel loads without errors', async ({ page }) => {
    await page.goto('/admin')

    // Should redirect to login or show admin UI
    await expect(page).toHaveURL(/\/admin/)

    // No console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.waitForLoadState('networkidle')

    // Filter out expected errors (like missing auth)
    const unexpectedErrors = errors.filter(
      (e) => !e.includes('401') && !e.includes('authentication')
    )
    expect(unexpectedErrors).toHaveLength(0)
  })

  test('admin panel styles are independent', async ({ page }) => {
    await page.goto('/admin')

    // Admin should not have our custom anthracite background
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    )

    // Admin uses its own styling (not our dark theme)
    // This is a sanity check - admin should look different
    expect(bgColor).not.toBe('rgb(26, 29, 35)')
  })
})
```

### Implementation Steps

1. **Install axe-core if not already installed**
   ```bash
   pnpm add -D @axe-core/playwright
   ```

2. **Create the test file** with the structure above

3. **Run tests locally**
   ```bash
   pnpm test:e2e tests/e2e/design-system.e2e.spec.ts
   ```

4. **Verify all tests pass**

### Commit Command

```bash
git add tests/e2e/design-system.e2e.spec.ts package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(a11y): add design system E2E tests with axe-core

- Add visual validation tests for brand colors
- Add typography tests for Nunito Sans and JetBrains Mono
- Add accessibility tests using axe-core (WCAG 2.1 AA)
- Add focus ring visibility tests
- Add dark mode CSS variable validation
- Add admin panel isolation tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Validation Checklist

- [ ] `@axe-core/playwright` installed
- [ ] Test file created at correct path
- [ ] All visual tests pass
- [ ] All accessibility tests pass (0 violations)
- [ ] Admin panel tests pass
- [ ] `pnpm test:e2e` succeeds

---

## Commit 2: Update Frontend Tests for New Design System

### Objective

Update existing E2E tests to work with the new design system styling and ensure no regressions.

### Files to Modify

#### `tests/e2e/frontend.e2e.spec.ts`

Update any existing visual assertions to match new styles.

### Implementation Steps

1. **Review existing tests**
   ```bash
   cat tests/e2e/frontend.e2e.spec.ts
   ```

2. **Update visual assertions** if any reference old styles

3. **Run the updated tests**
   ```bash
   pnpm test:e2e tests/e2e/frontend.e2e.spec.ts
   ```

4. **Verify all tests pass**

### Commit Command

```bash
git add tests/e2e/frontend.e2e.spec.ts
git commit -m "$(cat <<'EOF'
test(e2e): update frontend tests for new design system

- Update visual assertions to match new brand colors
- Ensure tests work with Tailwind utility classes
- Verify i18n tests still pass with new styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Validation Checklist

- [ ] Existing tests reviewed
- [ ] Visual assertions updated if needed
- [ ] All frontend tests pass
- [ ] No test regressions

---

## Commit 3: Final Cleanup and Documentation

### Objective

Add inline documentation to design tokens, run final cleanup checks, and ensure no dead code.

### Files to Modify

#### `src/app/globals.css`

Add documentation comments to CSS variables:

```css
@layer base {
  :root {
    /* === Design System: Anthracite & Vert Canard === */
    /* Brand Guidelines: docs/specs/UX_UI_Spec.md Section 7 */

    /* Background Colors */
    --background: 222 16% 12%;       /* #1A1D23 - Anthracite (main bg) */
    --foreground: 210 40% 98%;       /* #F7FAFC - Off-white (text) */

    /* Surface Colors */
    --card: 222 16% 18%;             /* #2D3748 - Elevated surfaces */
    --card-foreground: 210 40% 98%;

    /* ... existing variables with comments ... */
  }
}
```

### Implementation Steps

1. **Add documentation comments** to globals.css

2. **Run Knip to check for dead code**
   ```bash
   pnpm knip
   ```

3. **Fix any dead code issues** if found

4. **Verify build still works**
   ```bash
   pnpm build
   ```

5. **Run all tests**
   ```bash
   pnpm test
   ```

### Commit Command

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
docs(design): add token documentation and final cleanup

- Add inline documentation for CSS design tokens
- Reference UX_UI_Spec.md for brand guidelines
- Document color usage and contrast ratios
- Verify no dead code with Knip

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Validation Checklist

- [ ] CSS variables documented
- [ ] `pnpm knip` passes (no dead code)
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] All tests pass

---

## Post-Implementation Tasks

### Update EPIC_TRACKING.md

After completing all commits, update the epic tracking:

```markdown
### Story 3.2: Design System Integration
- [x] Phase 1: Tailwind Foundation
- [x] Phase 2: shadcn/ui Setup
- [x] Phase 3: Design Tokens & Migration
- [x] Phase 4: Validation & Cleanup
**Status**: ✅ COMPLETED
```

### Update PHASES_PLAN.md

Update the progress tracking:

```markdown
- [x] Phase 1: Tailwind Foundation - ✅ COMPLETED (2025-12-02)
- [x] Phase 2: shadcn/ui Setup - ✅ COMPLETED (2025-12-02)
- [x] Phase 3: Design Tokens & Migration - ✅ COMPLETED (2025-12-02)
- [x] Phase 4: Validation & Cleanup - ✅ COMPLETED (date)
```

---

## Quality Gates

Each commit must pass:

- [ ] `pnpm lint` - No linting errors
- [ ] `pnpm build` - Build succeeds
- [ ] TypeScript compilation - No type errors
- [ ] E2E tests - All tests pass
- [ ] Code review - Self-review checklist complete

---

## Rollback Procedures

### If Commit 1 Fails

```bash
# Remove the new test file
git checkout HEAD -- tests/e2e/design-system.e2e.spec.ts
# Or revert commit
git revert HEAD
```

### If Commit 2 Fails

```bash
# Restore original test file
git checkout HEAD^ -- tests/e2e/frontend.e2e.spec.ts
```

### If Commit 3 Fails

```bash
# Restore globals.css
git checkout HEAD^ -- src/app/globals.css
```

---

## Estimated Timeline

| Activity | Duration |
|----------|----------|
| Setup & Verification | 10 min |
| Commit 1: E2E Tests | 45 min |
| Commit 2: Update Tests | 30 min |
| Commit 3: Cleanup | 20 min |
| Final Validation | 15 min |
| **Total** | **2 hours** |

---

**Plan Created**: 2025-12-02
**Last Updated**: 2025-12-02
