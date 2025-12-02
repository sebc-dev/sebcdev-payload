# Phase 4: Testing Guide

**Phase**: Accessibility Validation & Cleanup
**Test Focus**: E2E visual tests, accessibility compliance

---

## Testing Strategy Overview

Phase 4 focuses on validation testing:

| Test Type | Purpose | Tools |
|-----------|---------|-------|
| Visual E2E | Verify design system implementation | Playwright |
| Accessibility | WCAG 2.1 AA compliance | axe-core |
| Regression | Ensure existing features work | Playwright |
| Cleanup | Verify no dead code | Knip |

---

## Test Categories

### 1. Visual Validation Tests

**Purpose**: Verify brand colors, typography, and layout

```typescript
test.describe('Visual Validation', () => {
  test('homepage displays correct brand colors', async ({ page }) => {
    await page.goto('/fr')

    // Anthracite background
    const body = page.locator('body')
    await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')
  })

  test('text uses correct foreground color', async ({ page }) => {
    await page.goto('/fr')

    // Off-white text
    const h1 = page.locator('h1').first()
    await expect(h1).toHaveCSS('color', 'rgb(247, 250, 252)')
  })
})
```

**Color Reference**:

| Color | Hex | RGB |
|-------|-----|-----|
| Background (Anthracite) | #1A1D23 | rgb(26, 29, 35) |
| Foreground (Off-white) | #F7FAFC | rgb(247, 250, 252) |
| Primary (Teal) | #14B8A6 | rgb(20, 184, 166) |
| Card | #2D3748 | rgb(45, 55, 72) |
| Border | #374151 | rgb(55, 65, 81) |

### 2. Typography Tests

**Purpose**: Verify fonts are loaded correctly

```typescript
test.describe('Typography', () => {
  test('headings use Nunito Sans', async ({ page }) => {
    await page.goto('/fr')

    const h1 = page.locator('h1').first()
    const fontFamily = await h1.evaluate((el) =>
      window.getComputedStyle(el).fontFamily
    )

    // Use contains for flexibility with fallbacks
    expect(fontFamily).toContain('Nunito')
  })

  test('code uses JetBrains Mono', async ({ page }) => {
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
```

### 3. Accessibility Tests

**Purpose**: WCAG 2.1 AA compliance validation

```typescript
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage passes WCAG AA audit', async ({ page }) => {
    await page.goto('/fr')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations:', results.violations)
    }

    expect(results.violations).toHaveLength(0)
  })

  test('focus rings are visible', async ({ page }) => {
    await page.goto('/fr')

    // Tab to first focusable element
    await page.keyboard.press('Tab')

    const focusedElement = page.locator(':focus')
    if (await focusedElement.count() > 0) {
      // Verify focus is visible
      const outlineWidth = await focusedElement.evaluate((el) =>
        parseInt(window.getComputedStyle(el).outlineWidth)
      )
      expect(outlineWidth).toBeGreaterThan(0)
    }
  })
})
```

**axe-core Configuration Options**:

```typescript
// Include specific rules
const results = await new AxeBuilder({ page })
  .withTags(['wcag2aa'])
  .include('#main-content')
  .exclude('.third-party-widget')
  .analyze()

// Disable specific rules (use sparingly)
const results = await new AxeBuilder({ page })
  .withTags(['wcag2aa'])
  .disableRules(['color-contrast']) // Only if you have a valid reason
  .analyze()
```

### 4. Dark Mode Tests

**Purpose**: Verify dark mode is correctly applied

```typescript
test.describe('Dark Mode', () => {
  test('html has dark class', async ({ page }) => {
    await page.goto('/fr')

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('CSS variables are set', async ({ page }) => {
    await page.goto('/fr')

    const bgVar = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--background')
        .trim()
    })

    // Should contain HSL values for anthracite
    expect(bgVar).toContain('222')
  })
})
```

### 5. Admin Panel Isolation Tests

**Purpose**: Verify admin panel is unaffected

```typescript
test.describe('Admin Panel', () => {
  test('admin loads without style conflicts', async ({ page }) => {
    await page.goto('/admin')

    // Admin should use its own styling
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    )

    // Should NOT be our anthracite background
    expect(bgColor).not.toBe('rgb(26, 29, 35)')
  })

  test('admin has no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    // Filter expected auth errors
    const unexpectedErrors = errors.filter(
      (e) => !e.includes('401') && !e.includes('authentication')
    )

    expect(unexpectedErrors).toHaveLength(0)
  })
})
```

---

## Running Tests

### Run All Phase 4 Tests

```bash
# Run design system tests only
pnpm test:e2e tests/e2e/design-system.e2e.spec.ts

# Run all E2E tests
pnpm test:e2e

# Run with verbose output
pnpm test:e2e -- --reporter=list

# Run headed (see the browser)
pnpm test:e2e -- --headed

# Run specific test
pnpm test:e2e -- --grep "homepage displays correct"
```

### Debug Failed Tests

```bash
# Run with trace
pnpm test:e2e -- --trace on

# Open trace viewer
pnpm exec playwright show-trace trace.zip

# Run in debug mode
pnpm test:e2e -- --debug

# Generate HTML report
pnpm test:e2e -- --reporter=html
pnpm exec playwright show-report
```

---

## Test Data Reference

### WCAG 2.1 AA Requirements

| Criterion | Requirement | How We Test |
|-----------|-------------|-------------|
| 1.4.3 Contrast (Minimum) | Text: 4.5:1 | axe-core |
| 1.4.11 Non-text Contrast | UI: 3:1 | axe-core |
| 2.4.7 Focus Visible | Focus indicator | Manual + automated |
| 1.4.10 Reflow | 320px width | Responsive tests |

### Expected Test Results

| Test Suite | Tests | Expected Result |
|------------|-------|-----------------|
| Visual Validation | 4 | All pass |
| Typography | 2 | All pass |
| Accessibility | 3 | 0 violations |
| Dark Mode | 2 | All pass |
| Admin Panel | 2 | All pass |
| **Total** | **13** | **All pass** |

---

## Troubleshooting

### Common Test Failures

#### Color Mismatch

```
Expected: "rgb(26, 29, 35)"
Received: "rgb(26, 29, 36)"
```

**Solution**: Check if CSS variable is slightly different. Use approximate matching if needed:

```typescript
// Approximate color matching
const rgb = await body.evaluate((el) =>
  window.getComputedStyle(el).backgroundColor
)
const [r, g, b] = rgb.match(/\d+/g).map(Number)
expect(r).toBeCloseTo(26, 0)
expect(g).toBeCloseTo(29, 0)
expect(b).toBeCloseTo(35, 0)
```

#### Font Not Loaded

```
Expected: "Nunito Sans"
Received: "Arial, sans-serif"
```

**Solution**: Ensure fonts are loaded before testing:

```typescript
await page.waitForLoadState('networkidle')
// Or wait for specific font
await page.waitForFunction(() =>
  document.fonts.check('16px Nunito Sans')
)
```

#### axe-core Violations

```
violations: [{ id: 'color-contrast', ... }]
```

**Solution**:
1. Check specific element in violation
2. Verify contrast ratio with tool
3. Adjust color if needed
4. Document if false positive

```typescript
// Log details for debugging
if (results.violations.length > 0) {
  results.violations.forEach((v) => {
    console.log('Violation:', v.id)
    console.log('Description:', v.description)
    v.nodes.forEach((n) => {
      console.log('Element:', n.html)
      console.log('Fix:', n.failureSummary)
    })
  })
}
```

#### Admin Test Failures

```
Error: page.goto: net::ERR_CONNECTION_REFUSED
```

**Solution**: Ensure dev server is running:

```typescript
// playwright.config.ts should have:
webServer: {
  command: 'pnpm dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
}
```

---

## Test Coverage Targets

### Phase 4 Coverage Goals

| Area | Target | Metric |
|------|--------|--------|
| Visual validation | 100% | All brand colors tested |
| Typography | 100% | Both fonts tested |
| Accessibility | WCAG AA | 0 violations |
| Dark mode | 100% | Class and variables tested |
| Admin isolation | 100% | No regressions |

### Coverage Verification

```bash
# Run with coverage report
pnpm test:e2e -- --reporter=html

# Check Lighthouse scores
# (Run after E2E tests, scores in output)
```

---

## Continuous Integration

### CI Test Configuration

Tests should run in CI with:

```yaml
# In GitHub Actions
- name: Run E2E Tests
  run: pnpm test:e2e
  env:
    CI: true
```

### CI-Specific Settings

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'on-first-retry',
  },
})
```

---

## Post-Test Validation

After all tests pass:

1. **Review test output** for warnings
2. **Check Lighthouse scores** (should show in CI output)
3. **Verify build size** hasn't increased significantly
4. **Run Knip** to ensure no dead code

```bash
# Final validation
pnpm build && pnpm test && pnpm knip
```

---

**Created**: 2025-12-02
**Last Updated**: 2025-12-02
