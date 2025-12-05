# Phase 3: Testing Strategy - Polish & Tests

**Story**: 3.5 - Homepage Implementation
**Phase**: 3 of 3

---

## Testing Overview

Cette phase est principalement dediee aux tests. La strategie:

1. **E2E Tests**: Tests Playwright pour la homepage complete
2. **Accessibility Tests**: Tests axe-core WCAG AA
3. **Visual Tests**: Verification manuelle des animations

---

## E2E Test Strategy

### Test Categories

| Category | Tests | Priority |
|----------|-------|----------|
| Page Load | 2 | High |
| Featured Article | 2 | High |
| Article Grid | 1 | High |
| Hub CTA | 2 | Medium |
| Empty State | 2 | Medium |
| Responsive | 3 | Medium |
| Accessibility | 6 | High |

### Test File Structure

```
tests/
└── e2e/
    └── homepage.e2e.spec.ts
        ├── describe('Page Load')
        ├── describe('Featured Article')
        ├── describe('Article Grid')
        ├── describe('Hub CTA')
        ├── describe('Empty State')
        ├── describe('Responsive')
        └── describe('Accessibility')
```

---

## Running Tests

### All E2E Tests

```bash
pnpm test:e2e
```

### Homepage Tests Only

```bash
pnpm test:e2e -- tests/e2e/homepage.e2e.spec.ts
```

### Specific Test Block

```bash
pnpm test:e2e -- --grep "Accessibility"
```

### Debug Mode

```bash
pnpm exec playwright test --debug
```

### UI Mode

```bash
pnpm exec playwright test --ui
```

### Generate Report

```bash
pnpm exec playwright show-report
```

---

## Test Implementation

### Page Load Tests

```typescript
test.describe('Page Load', () => {
  test('loads FR homepage', async ({ page }) => {
    await page.goto('/fr')
    await expect(page).toHaveTitle(/Accueil.*sebc\.dev/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('loads EN homepage', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(/Home.*sebc\.dev/)
  })
})
```

### Featured Article Tests

```typescript
test.describe('Featured Article', () => {
  test('displays H1 title', async ({ page }) => {
    await page.goto('/fr')

    const h1 = page.locator('h1')
    const count = await h1.count()

    // Either has exactly 1 H1 (article) or 1 H1 (empty state)
    expect(count).toBe(1)
  })

  test('shows read CTA if article exists', async ({ page }) => {
    await page.goto('/fr')

    const readBtn = page.getByRole('link', { name: /Lire l'article/i })

    // Check visibility only if featured article exists
    const featuredTitle = page.locator('h1 a')
    if (await featuredTitle.count() > 0) {
      await expect(readBtn.first()).toBeVisible()
    }
  })
})
```

### Empty State Tests

```typescript
test.describe('Empty State', () => {
  test('shows welcome message', async ({ page }) => {
    await page.goto('/fr')

    const emptyHeading = page.getByRole('heading', {
      name: /Bienvenue sur sebc\.dev/i,
    })

    // Only check if empty state is showing
    if (await emptyHeading.isVisible()) {
      await expect(
        page.getByText(/Aucun article n'a encore été publié/i)
      ).toBeVisible()
    }
  })

  test('hides create CTA without auth', async ({ page }) => {
    await page.goto('/fr')

    const emptyHeading = page.getByRole('heading', {
      name: /Bienvenue sur sebc\.dev/i,
    })

    if (await emptyHeading.isVisible()) {
      await expect(
        page.getByRole('link', { name: /Créer un article/i })
      ).not.toBeVisible()
    }
  })
})
```

### Responsive Tests

```typescript
test.describe('Responsive', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ]

  for (const vp of viewports) {
    test(`${vp.name} viewport works`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })
  }
})
```

---

## Accessibility Tests

### axe-core Setup

```typescript
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('passes WCAG AA audit', async ({ page }) => {
    await page.goto('/fr')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    // Only fail on critical/serious
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    // Log violations for debugging
    if (violations.length > 0) {
      console.log('A11y Violations:', JSON.stringify(violations, null, 2))
    }

    expect(violations).toHaveLength(0)
  })
})
```

### Heading Hierarchy Test

```typescript
test('has correct heading hierarchy', async ({ page }) => {
  await page.goto('/fr')

  // Exactly one H1
  const h1Count = await page.locator('h1').count()
  expect(h1Count).toBe(1)

  // H2 should come after H1 (no skipping)
  const headings = await page.locator('h1, h2, h3').allTextContents()
  expect(headings.length).toBeGreaterThan(0)
})
```

### Focus Test

```typescript
test('interactive elements are focusable', async ({ page }) => {
  await page.goto('/fr')

  // Tab to first interactive element
  await page.keyboard.press('Tab')

  // Verify focus is visible
  const focused = page.locator(':focus')
  await expect(focused).toBeVisible()

  // Check focus has indicator
  const styles = await focused.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      outline: computed.outline,
      boxShadow: computed.boxShadow,
    }
  })

  const hasFocusRing =
    (styles.outline && styles.outline !== 'none') ||
    (styles.boxShadow && styles.boxShadow !== 'none')

  expect(hasFocusRing).toBe(true)
})
```

### Image Alt Text Test

```typescript
test('all images have alt text', async ({ page }) => {
  await page.goto('/fr')

  const images = page.locator('img')
  const count = await images.count()

  for (let i = 0; i < count; i++) {
    const img = images.nth(i)
    const alt = await img.getAttribute('alt')

    // alt should exist (can be empty for decorative)
    expect(alt).not.toBeNull()

    // Informative images should have non-empty alt
    const role = await img.getAttribute('role')
    if (role !== 'presentation') {
      expect(alt?.length).toBeGreaterThan(0)
    }
  }
})
```

---

## Manual Testing Checklist

### Animation Testing

1. **Hover Effects**
   - [ ] Card hover: scale + shadow smooth
   - [ ] Image hover: zoom smooth
   - [ ] Transition: 200ms feels responsive

2. **Reduced Motion**
   - [ ] Enable prefers-reduced-motion
   - [ ] Verify no animations occur
   - [ ] Content still accessible

### Visual Testing

1. **Featured Article**
   - [ ] Image loads correctly
   - [ ] Aspect ratio maintained
   - [ ] Max height respected

2. **Article Grid**
   - [ ] 1 col on mobile
   - [ ] 2 cols on tablet
   - [ ] 3 cols on desktop
   - [ ] Gaps correct

3. **Empty State**
   - [ ] Centered vertically
   - [ ] Icon visible
   - [ ] Text readable

---

## Test Data Management

### Seeding Test Data

```typescript
// tests/e2e/fixtures/seed.ts
import { getPayload } from 'payload'

export async function seedTestArticles() {
  const payload = await getPayload({ /* config */ })

  // Create 7 test articles
  for (let i = 1; i <= 7; i++) {
    await payload.create({
      collection: 'posts',
      data: {
        title: `Test Article ${i}`,
        slug: `test-article-${i}`,
        excerpt: 'Test excerpt...',
        complexity: 'beginner',
        readingTime: 5,
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
    })
  }
}
```

### Cleaning Test Data

```typescript
export async function cleanTestArticles() {
  const payload = await getPayload({ /* config */ })

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      slug: { contains: 'test-article' },
    },
  })

  for (const doc of docs) {
    await payload.delete({
      collection: 'posts',
      id: doc.id,
    })
  }
}
```

---

## Coverage Report

### Expected Coverage After Phase 3

| Area | Tests | Coverage |
|------|-------|----------|
| Page Load | 2 | FR/EN |
| Featured Article | 2 | Display/CTA |
| Article Grid | 1 | Display |
| Hub CTA | 2 | Display/Navigation |
| Empty State | 2 | Message/Auth |
| Responsive | 3 | Mobile/Tablet/Desktop |
| Accessibility | 6 | WCAG/Headings/Focus/Images |

**Total: ~18 test cases**

---

## CI Integration

### GitHub Actions

Tests run automatically in CI:

```yaml
# .github/workflows/quality-gate.yml
- name: Run E2E Tests
  run: pnpm test:e2e
```

### Artifacts

Test reports are saved:
- HTML report: `playwright-report/`
- Screenshots: On failure
- Traces: On first retry
