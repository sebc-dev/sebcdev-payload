# Phase 4: Testing Strategy

**Phase**: Integration & E2E Testing
**Test Types**: E2E (Playwright), Accessibility (axe-core)

---

## Testing Overview

Phase 4 focuses on **end-to-end integration testing** to validate that all components from Phases 1-3 work together correctly in the article page.

### Test Pyramid for Phase 4

```
        ┌─────────────────┐
        │     E2E Tests   │  ← Primary focus
        │    (Playwright) │
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │   Integration Tests     │  ← Phases 2-3 (existing)
    │       (Vitest)          │
    └────────────┬────────────┘
                 │
┌────────────────┴────────────────┐
│         Unit Tests              │  ← Phases 1-3 (existing)
│           (Vitest)              │
└─────────────────────────────────┘
```

---

## E2E Test Strategy

### Test Scope

| Feature | Test File | Coverage |
|---------|-----------|----------|
| TOC Navigation | `toc-navigation.e2e.spec.ts` | Desktop TOC, Mobile TOC, a11y |
| Reading Progress | `reading-progress.e2e.spec.ts` | Progress tracking, ARIA, motion |

### Test Environment

**Browser**: Chromium (default Playwright)
**Viewports**:
- Desktop: 1280x720
- Mobile: 375x667

**Server**: Dev server (`pnpm dev`) - starts automatically via Playwright

### Test Data Requirements

Tests require a **seeded article** with:
- Multiple h2/h3 headings (3+ recommended)
- Sufficient content length for scroll testing
- Published status (not draft)

```typescript
// Example article structure for testing
const testArticle = {
  title: 'Test Article with Headings',
  slug: 'test-article-with-headings',
  content: {
    // Lexical content with h2, h3 headings
  },
  status: 'published'
}
```

---

## Test File: TOC Navigation

### File: `tests/e2e/articles/toc-navigation.e2e.spec.ts`

#### Test Structure

```typescript
test.describe('Table of Contents Navigation', () => {
  // Configuration
  const ARTICLE_SLUG = 'your-seeded-article-slug'

  test.describe('Desktop TOC (@desktop)', () => {
    test.use({ viewport: { width: 1280, height: 720 } })
    // Desktop-specific tests
  })

  test.describe('Mobile TOC (@mobile)', () => {
    test.use({ viewport: { width: 375, height: 667 } })
    // Mobile-specific tests
  })

  test.describe('Accessibility', () => {
    // axe-core tests
  })
})
```

#### Test Cases

| Test | Purpose | Assertions |
|------|---------|------------|
| `displays TOC sidebar` | TOC visible on desktop | `toBeVisible()` |
| `TOC contains headings` | Links present | `not.toHaveCount(0)` |
| `clicking TOC link scrolls` | Navigation works | `toBeInViewport()` |
| `highlights active section` | Scroll tracking | `aria-current="true"` |
| `hides desktop TOC on mobile` | Responsive | `not.toBeVisible()` |
| `displays floating button` | Mobile trigger | `toBeVisible()` |
| `opens sheet on click` | Modal works | `toBeVisible()` |
| `closes sheet after nav` | Auto-close | `not.toBeVisible()` |
| `keyboard navigation` | a11y | `toBeFocused()` |
| `no a11y violations` | axe-core | `violations.toEqual([])` |

#### Selector Strategy

**Preferred (Accessible)**:
```typescript
// By role and name
page.getByRole('navigation', { name: /table des matières/i })
page.getByRole('link', { name: /heading-text/i })
page.getByRole('button', { name: /ouvrir/i })
page.getByRole('dialog')
```

**Fallback (When needed)**:
```typescript
// By test ID (only if accessible query not possible)
page.getByTestId('toc-sidebar')

// By element type (for specific scenarios)
page.locator('h2, h3').filter({ hasText: linkText })
```

#### Wait Strategies

```typescript
// Page load
await page.waitForLoadState('networkidle')

// After scroll (for Intersection Observer)
await page.waitForTimeout(400)

// After animation (Sheet close)
await page.waitForTimeout(500)
```

---

## Test File: Reading Progress

### File: `tests/e2e/articles/reading-progress.e2e.spec.ts`

#### Test Structure

```typescript
test.describe('Reading Progress Bar', () => {
  const ARTICLE_SLUG = 'your-seeded-article-slug'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/fr/articles/${ARTICLE_SLUG}`)
    await page.waitForLoadState('networkidle')
  })

  // Progress tracking tests
  // ARIA tests
  // Reduced motion tests
})
```

#### Test Cases

| Test | Purpose | Assertions |
|------|---------|------------|
| `displays at top` | Visibility | `toBeVisible()` |
| `starts near 0%` | Initial state | `≤ 10` |
| `updates on scroll` | Tracking | `> 20 && < 80` |
| `reaches high % at end` | Completion | `≥ 85` |
| `has ARIA attributes` | a11y | `toHaveAttribute()` |
| `no a11y violations` | axe-core | `violations.toEqual([])` |
| `respects reduced motion` | Preference | `transitionDuration === '0s'` |

#### Scroll Simulation

```typescript
// Scroll to specific article position
await page.evaluate(() => {
  const article = document.querySelector('article')
  if (article) {
    const rect = article.getBoundingClientRect()
    const targetY = rect.top + window.scrollY + rect.height / 2
    window.scrollTo({ top: targetY, behavior: 'instant' })
  }
})

// Wait for RAF update
await page.waitForTimeout(200)
```

#### Progress Value Testing

```typescript
// Get current progress
const progressBar = page.getByRole('progressbar')
const value = await progressBar.getAttribute('aria-valuenow')
const progress = Number(value)

// Assertions with tolerance
expect(progress).toBeLessThanOrEqual(10)      // Top
expect(progress).toBeGreaterThan(20)          // Middle (lower)
expect(progress).toBeLessThan(80)             // Middle (upper)
expect(progress).toBeGreaterThanOrEqual(85)   // End
```

---

## Accessibility Testing

### axe-core Integration

```typescript
import AxeBuilder from '@axe-core/playwright'

test('should have no accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .include('nav[aria-label*="matières"]')  // Scope to TOC
    .analyze()

  expect(results.violations).toEqual([])
})
```

### What axe-core Checks

- ARIA roles and attributes
- Color contrast
- Focus management
- Keyboard accessibility
- Label associations
- Semantic HTML

### Handling Violations

If axe-core reports violations:

1. **Read the violation details**:
   ```typescript
   console.log(results.violations)
   ```

2. **Fix in component code** (not by excluding):
   ```tsx
   // Bad: Excluding from test
   .exclude('.problem-element')

   // Good: Fix the component
   <button aria-label="Open menu">
   ```

3. **Re-run tests** to verify fix

---

## Running Tests

### All E2E Tests

```bash
pnpm test:e2e
```

### Specific Test Files

```bash
# TOC tests only
pnpm test:e2e tests/e2e/articles/toc-navigation.e2e.spec.ts

# Progress tests only
pnpm test:e2e tests/e2e/articles/reading-progress.e2e.spec.ts
```

### Interactive Mode

```bash
# UI mode (visual test runner)
pnpm exec playwright test --ui

# Debug mode (step through)
pnpm exec playwright test --debug
```

### Specific Viewport

```bash
# Run only desktop tests
pnpm exec playwright test --grep @desktop

# Run only mobile tests
pnpm exec playwright test --grep @mobile
```

### View Report

```bash
# Generate and open HTML report
pnpm exec playwright show-report
```

---

## Test Configuration

### Playwright Config

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Custom Fixtures (Optional)

```typescript
// tests/e2e/fixtures.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  articlePage: async ({ page }, use) => {
    await page.goto('/fr/articles/test-article')
    await page.waitForLoadState('networkidle')
    await use(page)
  },
})
```

---

## Debugging Failed Tests

### Screenshot on Failure

Playwright automatically captures screenshots on failure.

Location: `test-results/`

### Trace Viewer

```bash
# After test failure, view trace
pnpm exec playwright show-trace test-results/*/trace.zip
```

### Console Logs

```typescript
// Add console listener for debugging
page.on('console', msg => console.log(msg.text()))
```

### Network Requests

```typescript
// Log network requests
page.on('request', request => console.log('>>', request.method(), request.url()))
page.on('response', response => console.log('<<', response.status(), response.url()))
```

---

## Test Maintenance

### Updating Test Article

If test article content changes:

1. Update `ARTICLE_SLUG` in test files
2. Adjust heading text matchers if needed
3. Update scroll position calculations if length changes

### Adding New Tests

When adding tests:

1. Follow existing patterns
2. Use accessible selectors
3. Add appropriate waits
4. Document purpose in test name
5. Group related tests in `describe` blocks

### CI Considerations

- Tests run with `retries: 2` in CI
- Single worker to avoid resource contention
- Longer timeouts may be needed
- Ensure test database is seeded

---

## Test Coverage Summary

### Phase 4 Coverage

| Area | Tests | Coverage |
|------|-------|----------|
| TOC Desktop | 4 | Visibility, navigation, active state |
| TOC Mobile | 4 | Button, sheet, auto-close |
| TOC Accessibility | 2 | axe-core, keyboard |
| Progress Bar | 4 | Initial, update, end, ARIA |
| Progress a11y | 2 | axe-core, reduced motion |
| **Total** | **~16** | Integration + a11y |

### Coverage Goals

- [ ] All user journeys covered
- [ ] Both viewport sizes tested
- [ ] Accessibility validated
- [ ] Edge cases handled (no headings, short articles)

---

**Next**: After tests pass, proceed to [validation/VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md)
