# Testing Guide: Phase 5 - Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 5 of 5 (Final Phase)
**Test Focus**: Accessibility validation, E2E navigation flows

---

## Testing Overview

Phase 5 is primarily a validation phase. Testing focuses on:

1. **E2E Tests**: Comprehensive navigation flow testing
2. **Accessibility Tests**: axe-core audits, keyboard navigation
3. **Manual Tests**: Skip link behavior, screen reader compatibility
4. **Integration Tests**: SkipLink component behavior

---

## Test Types

### E2E Tests (Primary Focus)

| Test Category | Count | Purpose |
|---------------|-------|---------|
| Header | 4 | Visibility, sticky behavior, logo |
| Desktop Navigation | 3 | Links, visibility toggles |
| Mobile Navigation | 5 | Hamburger, sheet, close behaviors |
| Language Switcher | 5 | Locale toggle, URL preservation |
| Skip Link | 4 | Focus, visibility, navigation |
| Keyboard Navigation | 2 | Tab order, focus rings |
| Accessibility | 4 | axe-core, ARIA landmarks |
| Footer | 2 | Visibility, links |
| **Total** | **29** | |

### Accessibility Tests

| Test Type | Tool | Purpose |
|-----------|------|---------|
| Automated audit | axe-core | WCAG 2.1 AA compliance |
| Landmark check | axe-core/manual | ARIA role verification |
| Color contrast | axe-core | 4.5:1 text, 3:1 UI |
| Keyboard access | Manual/E2E | All functionality reachable |
| Focus visibility | E2E | Focus rings visible |

### Manual Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Skip link | Tab on page → Press Enter | Focus moves to main content |
| Screen reader | Navigate with VoiceOver/NVDA | Landmarks announced correctly |
| Mobile menu | Open → Navigate → Close | Smooth, accessible flow |

---

## Running Tests

### Full E2E Suite

```bash
# Run all E2E tests
pnpm test:e2e

# Run with verbose output
pnpm test:e2e -- --reporter=list

# Run with debug mode
npx playwright test --debug
```

### Navigation Tests Only

```bash
# Run only navigation tests (created in Phase 5)
pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts

# Run specific test by name
pnpm test:e2e -- -g "skip link"

# Run specific describe block
pnpm test:e2e -- -g "Skip Link"
```

### Accessibility Tests Only

```bash
# Run tests containing "axe" or "accessibility"
pnpm test:e2e -- -g "axe"

# Run entire Accessibility describe block
pnpm test:e2e -- -g "Accessibility"
```

### Mobile Tests Only

```bash
# Run mobile navigation tests
pnpm test:e2e -- -g "Mobile Navigation"
```

---

## Test Scenarios

### Skip Link Tests

#### Test 1: First Focusable Element

```typescript
test('skip link is first focusable element', async ({ page }) => {
  await page.goto('/fr')
  await page.keyboard.press('Tab')

  const focused = page.locator(':focus')
  await expect(focused).toContainText(frMessages.accessibility.skipToContent)
})
```

**Manual verification**:
1. Load `/fr`
2. Press Tab once
3. ✓ Skip link text visible at top-left
4. ✓ Focus ring visible around skip link

#### Test 2: Skip Link Visibility

```typescript
test('skip link is visible when focused', async ({ page }) => {
  await page.goto('/fr')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: frMessages.accessibility.skipToContent })
  await expect(skipLink).toBeVisible()
})
```

**CSS verification**:
- Default: `sr-only` (visually hidden)
- Focused: `focus:not-sr-only` (visible)

#### Test 3: Main Content Focus

```typescript
test('skip link navigates to main content', async ({ page }) => {
  await page.goto('/fr')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  const main = page.locator('#main-content')
  await expect(main).toBeFocused()
})
```

**Requirements**:
- `<main>` must have `id="main-content"`
- `<main>` must have `tabIndex={-1}` for programmatic focus

### Keyboard Navigation Tests

#### Tab Order Verification

```typescript
test('Tab navigates through interactive elements', async ({ page }) => {
  await page.goto('/fr')

  const focusedElements: string[] = []
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab')
    const tagName = await page.evaluate(() => document.activeElement?.tagName)
    focusedElements.push(tagName || 'none')
  }

  expect(focusedElements.filter(el => el !== 'none').length).toBeGreaterThan(5)
})
```

**Expected Tab Order**:
1. Skip link
2. Logo (link)
3. Articles (link)
4. Categories (dropdown trigger or link)
5. Levels (dropdown trigger or link)
6. Language FR (link)
7. Language EN (link)

#### Focus Ring Visibility

```typescript
test('focus rings are visible', async ({ page }) => {
  await page.goto('/fr')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')

  const focused = page.locator(':focus')
  const boxShadow = await focused.evaluate(el => getComputedStyle(el).boxShadow)

  expect(boxShadow).not.toBe('none')
})
```

**Tailwind configuration**:
- `focus-visible:ring-2`
- `focus-visible:ring-ring`

### axe-core Accessibility Tests

#### Homepage FR Audit

```typescript
test('homepage FR passes axe-core audit', async ({ page }) => {
  await page.goto('/fr')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  if (results.violations.length > 0) {
    console.log('Violations:', JSON.stringify(results.violations, null, 2))
  }

  expect(results.violations).toHaveLength(0)
})
```

**WCAG Tags used**:
- `wcag2a`: Level A criteria
- `wcag2aa`: Level AA criteria (includes A)

#### Mobile Menu Audit

```typescript
test('mobile menu passes axe-core audit when open', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/fr')

  await page.click(`[aria-label="${frMessages.mobileMenu.open}"]`)
  await page.waitForSelector('[role="dialog"]')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations).toHaveLength(0)
})
```

**Critical**: Test with menu open to catch dialog accessibility issues.

### ARIA Landmarks Test

```typescript
test('correct ARIA landmarks are present', async ({ page }) => {
  await page.goto('/fr')

  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
})
```

**Landmark mapping**:
- `banner` → `<header>`
- `navigation` → `<nav>`
- `main` → `<main>`
- `contentinfo` → `<footer>`

---

## Manual Testing Procedures

### Skip Link Manual Test

1. **Setup**: Open `http://localhost:3000/fr`
2. **Action**: Press Tab key once
3. **Verify**:
   - [ ] Skip link appears at top-left of viewport
   - [ ] Skip link has visible focus ring
   - [ ] Skip link text is "Aller au contenu principal"
4. **Action**: Press Enter
5. **Verify**:
   - [ ] Focus moves to main content area
   - [ ] Page scrolls smoothly (if needed)
   - [ ] No visual jump or flash

### Screen Reader Test (VoiceOver - macOS)

1. **Enable**: Cmd + F5
2. **Navigate**: Use VO + Right Arrow
3. **Verify landmarks announced**:
   - [ ] "Banner" announced for header
   - [ ] "Navigation" announced for nav
   - [ ] "Main" announced for main content
   - [ ] "Content information" announced for footer
4. **Skip link**:
   - [ ] "Link: Aller au contenu principal" announced
   - [ ] Activating link moves to main content

### Mobile Menu Test (Chrome DevTools)

1. **Setup**: Open DevTools → Toggle device toolbar (Cmd+Shift+M)
2. **Select**: iPhone 12 Pro (390x844)
3. **Verify initial state**:
   - [ ] Hamburger menu visible
   - [ ] Desktop navigation hidden
4. **Open menu**:
   - [ ] Tap hamburger → Sheet slides in
   - [ ] Focus moves to sheet
   - [ ] All navigation links visible
5. **Close behaviors**:
   - [ ] X button closes sheet
   - [ ] Clicking outside closes sheet
   - [ ] Escape key closes sheet
   - [ ] Clicking navigation link closes sheet

### Keyboard-Only Navigation Test

1. **Setup**: Disconnect/disable mouse
2. **Navigate entire page using only**:
   - Tab: Move forward
   - Shift+Tab: Move backward
   - Enter: Activate links/buttons
   - Escape: Close menus/dialogs
3. **Verify**:
   - [ ] All interactive elements reachable
   - [ ] Focus always visible
   - [ ] Logical tab order
   - [ ] No keyboard traps

---

## Debugging Failed Tests

### axe-core Violations

When axe reports violations:

```typescript
// Console output format
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
  "nodes": [
    {
      "html": "<a class=\"text-muted-foreground\">Categories</a>",
      "failureSummary": "Fix the following: Element has insufficient color contrast of 3.2 (foreground color: #a1a1aa, background color: #1a1d23, font size: 14.0pt, font weight: normal)"
    }
  ]
}
```

**Resolution steps**:
1. Identify element from `html` property
2. Check contrast ratio in failure summary
3. Adjust color to meet 4.5:1 (text) or 3:1 (UI) ratio
4. Re-run test to verify fix

### Focus Not Moving to Main

If `expect(main).toBeFocused()` fails:

1. **Check id**: Verify `<main id="main-content">`
2. **Check tabIndex**: Verify `<main tabIndex={-1}>`
3. **Check handler**: Verify `handleClick` calls `main.focus()`
4. **Check timing**: Add wait if needed

```typescript
// Debug version
test('skip link navigates to main content', async ({ page }) => {
  await page.goto('/fr')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  // Add explicit wait
  await page.waitForFunction(() => {
    const main = document.getElementById('main-content')
    return document.activeElement === main
  })

  const main = page.locator('#main-content')
  await expect(main).toBeFocused()
})
```

### Test Timeouts

If tests timeout:

```bash
# Increase global timeout
npx playwright test --timeout=60000

# Or per-test
test.setTimeout(60000)
```

Common causes:
- Dev server slow to start
- Network requests pending
- Animation delays

---

## Test Coverage Targets

### Code Coverage

Phase 5 creates new files that should have coverage:

| File | Target | Measured By |
|------|--------|-------------|
| `SkipLink.tsx` | 100% | E2E tests |
| `navigation.e2e.spec.ts` | N/A | Test file |

### Feature Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Skip link visibility | 1 | Required |
| Skip link navigation | 1 | Required |
| Skip link translation | 2 | Required (FR/EN) |
| ARIA landmarks | 1 | Required |
| axe-core FR | 1 | Required |
| axe-core EN | 1 | Required |
| Keyboard navigation | 2 | Required |
| Mobile menu a11y | 1 | Required |

---

## CI/CD Integration

### GitHub Actions

Tests run automatically in CI via Quality Gate workflow:

```yaml
# E2E tests run with:
- name: Run E2E tests
  run: pnpm test:e2e
```

### Lighthouse CI

Accessibility score checked via Lighthouse:

```yaml
# Expected scores
accessibility: 95  # Minimum required
```

If Phase 5 implementation is correct, Lighthouse accessibility score should be 95+.

---

## Test Maintenance

### When to Update Tests

1. **i18n key changes**: Update message imports
2. **Component restructure**: Update locators
3. **New navigation items**: Add coverage
4. **WCAG requirement changes**: Update axe tags

### Locator Best Practices

```typescript
// ✅ Good - accessible locators
page.getByRole('link', { name: 'Articles' })
page.getByRole('button', { name: frMessages.mobileMenu.open })
page.getByRole('dialog')
page.getByRole('navigation')

// ❌ Bad - brittle CSS selectors
page.locator('a.nav-link')
page.locator('.hamburger-button')
page.locator('div.sheet')
page.locator('nav.desktop-nav')
```

---

## Related Documentation

- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - Test code reference
- [COMMIT_CHECKLIST.md](../COMMIT_CHECKLIST.md) - Test validation steps
- [REVIEW.md](./REVIEW.md) - Test review criteria
- [VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md) - Final test checklist

---

**Testing Guide Created**: 2025-12-03
**Last Updated**: 2025-12-03
