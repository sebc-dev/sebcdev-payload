# Testing Guide: Phase 3 - Footer Component

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 3 of 5

---

## Testing Strategy Overview

Phase 3 focuses on creating a simple, static Footer component. Testing is primarily:

1. **Build-time validation**: TypeScript, ESLint
2. **Manual visual testing**: Browser inspection
3. **i18n verification**: Both locales work correctly

> **Note**: Comprehensive E2E tests are added in Phase 5. This phase focuses on foundational testing during development.

---

## Test Categories

### 1. Build-Time Tests

These run automatically and must pass:

```bash
# TypeScript compilation
pnpm exec tsc --noEmit

# ESLint
pnpm lint

# Full build
pnpm build
```

### 2. Manual Testing

Visual and functional verification in browser:

| Test | How to Verify |
|------|---------------|
| Footer visible | Navigate to `/fr`, scroll to bottom |
| French text | Check tagline, copyright in French |
| English text | Navigate to `/en`, check translations |
| Links work | Click "Articles" and "Contact" |
| Responsive | Resize browser, check mobile layout |

### 3. Unit Tests (Optional for Phase 3)

If writing unit tests, focus on:

```typescript
// Future test file: tests/unit/Footer.spec.tsx
describe('Footer', () => {
  it('renders copyright with current year')
  it('displays translated tagline')
  it('renders navigation links')
})
```

---

## Build-Time Validation

### TypeScript Verification

```bash
# Check for type errors
pnpm exec tsc --noEmit

# Expected: No errors
```

**What TypeScript Catches**:
- Missing imports
- Wrong hook usage
- Incorrect prop types
- Invalid translation key access

### ESLint Verification

```bash
# Run linter
pnpm lint

# Expected: No errors or warnings
```

**What ESLint Catches**:
- Unused imports
- Missing dependencies in hooks
- Accessibility issues (via eslint-plugin-jsx-a11y)
- Code style violations

### Build Verification

```bash
# Full production build
pnpm build

# Expected: Build succeeds
```

**What Build Catches**:
- Import resolution issues
- Server/Client component mismatches
- i18n configuration problems

---

## Manual Testing Checklist

### Test 1: Footer Visibility

**Steps**:
1. Start dev server: `pnpm dev`
2. Navigate to `http://localhost:3000/fr`
3. Scroll to bottom of page

**Expected**:
- [ ] Footer is visible at bottom
- [ ] Footer has top border
- [ ] Footer has correct background color

### Test 2: Footer Content (French)

**URL**: `http://localhost:3000/fr`

**Expected**:
- [ ] "sebc.dev" displayed
- [ ] Tagline: "Blog technique sur l'IA, l'UX et l'ingénierie logicielle"
- [ ] Link text: "Articles"
- [ ] Link text: "Contact"
- [ ] Copyright: "© 2025 sebc.dev. Tous droits réservés."

### Test 3: Footer Content (English)

**URL**: `http://localhost:3000/en`

**Expected**:
- [ ] "sebc.dev" displayed
- [ ] Tagline: "Technical blog about AI, UX, and software engineering"
- [ ] Link text: "Articles"
- [ ] Link text: "Contact"
- [ ] Copyright: "© 2025 sebc.dev. All rights reserved."

### Test 4: Navigation Links

**Steps**:
1. Navigate to `http://localhost:3000/fr`
2. Click "Articles" link in footer

**Expected**:
- [ ] Navigates to `/fr/articles`
- [ ] No page reload (client-side navigation)

**Steps**:
1. Click "Contact" link in footer

**Expected**:
- [ ] Opens email client with `contact@sebc.dev`

### Test 5: Responsive Layout - Desktop

**Setup**: Browser width ≥1024px

**Expected**:
- [ ] Content spread horizontally
- [ ] Site name on left
- [ ] Links in center/right area
- [ ] Single row layout

### Test 6: Responsive Layout - Mobile

**Setup**: Browser width <1024px (or use DevTools mobile view)

**Expected**:
- [ ] Content stacked vertically
- [ ] All content centered
- [ ] Site name at top
- [ ] Links below site name
- [ ] Copyright at bottom

### Test 7: Sticky Footer Behavior

**Steps**:
1. Navigate to a page with minimal content
2. Check footer position

**Expected**:
- [ ] Footer stays at bottom of viewport
- [ ] No gap between content and footer

**Steps**:
1. Navigate to a page with lots of content
2. Scroll down

**Expected**:
- [ ] Footer appears after all content
- [ ] Footer not fixed (scrolls with content)

### Test 8: Hover States

**Steps**:
1. Hover over "Articles" link
2. Hover over "Contact" link

**Expected**:
- [ ] Link color changes on hover
- [ ] Transition is smooth (not instant)

---

## i18n Testing

### Verify Translation Keys

```bash
# Check French translations
cat messages/fr.json | grep -A 10 '"footer"'

# Check English translations
cat messages/en.json | grep -A 10 '"footer"'
```

### Test Locale Switching

**Steps**:
1. Navigate to `http://localhost:3000/fr`
2. Note footer text (French)
3. Change URL to `http://localhost:3000/en`
4. Verify footer text changed to English

**Expected**:
- [ ] All footer text updates to new locale
- [ ] No mixed languages

### Test Year Interpolation

**Steps**:
1. Check copyright text in browser

**Expected**:
- [ ] Shows current year (2025)
- [ ] Not showing `{year}` placeholder

---

## Accessibility Testing

### Keyboard Navigation

**Steps**:
1. Navigate to footer area
2. Press Tab to move through footer links

**Expected**:
- [ ] Can Tab to "Articles" link
- [ ] Can Tab to "Contact" link
- [ ] Focus visible on each link
- [ ] Enter activates links

### Screen Reader (Manual)

**Steps** (if available):
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate to footer

**Expected**:
- [ ] Footer announced as "contentinfo" landmark
- [ ] Links announced with accessible names

### Color Contrast

**Steps**:
1. Use browser DevTools accessibility panel
2. Or use axe DevTools extension
3. Check footer text contrast

**Expected**:
- [ ] Text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Link contrast ≥ 4.5:1

---

## Visual Regression Testing

### Screenshot Baseline (Manual)

Take screenshots for future comparison:

```bash
# Desktop screenshot
# Browser: 1440x900, URL: /fr, scroll to footer

# Mobile screenshot
# Browser: 375x667, URL: /fr, scroll to footer
```

### What to Capture

- [ ] Desktop footer (full width)
- [ ] Mobile footer (centered, stacked)
- [ ] French locale
- [ ] English locale

---

## Testing Edge Cases

### Empty Page

**Test**: Footer position on page with no content

**Expected**: Footer at bottom of viewport

### Long Content

**Test**: Footer position on page with lots of content

**Expected**: Footer after content, scrolls normally

### Dynamic Year

**Test**: Verify year updates

**Note**: This will naturally update on January 1st. Manual verification sufficient.

### Missing Translation Key

**Test**: What happens if translation key missing?

**Expected**: Shows key path (e.g., "footer.missing") - indicates misconfiguration

---

## CI/CD Considerations

### What Runs in CI

```yaml
# These should pass after Phase 3
- pnpm lint
- pnpm build
- pnpm test:unit  # If unit tests added
```

### What's Deferred to Phase 5

- E2E tests (Playwright)
- Accessibility audit (axe-core)
- Visual regression tests

---

## Test Commands Reference

```bash
# Build verification
pnpm build

# Lint check
pnpm lint

# TypeScript check
pnpm exec tsc --noEmit

# Start dev server for manual testing
pnpm dev

# Run unit tests (if any)
pnpm test:unit

# Run all tests
pnpm test
```

---

## Testing Troubleshooting

### Translation Not Showing

**Symptom**: Shows key path like `footer.tagline`

**Fix**:
1. Verify key exists in `messages/fr.json`
2. Restart dev server
3. Clear browser cache

### Footer Not at Bottom

**Symptom**: Footer floats in middle

**Fix**:
1. Verify layout wrapper has `min-h-screen`
2. Verify main has `flex-1`
3. Check for CSS conflicts

### Link Not Working

**Symptom**: Articles link doesn't navigate

**Fix**:
1. Verify using `Link` from `@/i18n/routing`
2. Check href is `/articles` not `/fr/articles`

### Hover State Missing

**Symptom**: No color change on hover

**Fix**:
1. Verify `hover:text-foreground` class
2. Verify `transition-colors` class

---

## Phase 5 Test Preview

In Phase 5, we'll add comprehensive E2E tests:

```typescript
// tests/e2e/footer.e2e.spec.ts (Phase 5)
describe('Footer', () => {
  test('footer is visible on homepage', async ({ page }) => {
    await page.goto('/fr')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('articles link navigates correctly', async ({ page }) => {
    await page.goto('/fr')
    await page.click('footer >> text=Articles')
    await expect(page).toHaveURL('/fr/articles')
  })

  test('footer text is translated', async ({ page }) => {
    await page.goto('/fr')
    await expect(page.locator('footer')).toContainText('Tous droits réservés')

    await page.goto('/en')
    await expect(page.locator('footer')).toContainText('All rights reserved')
  })

  test('axe accessibility audit passes', async ({ page }) => {
    await page.goto('/fr')
    const results = await new AxeBuilder({ page }).include('footer').analyze()
    expect(results.violations).toHaveLength(0)
  })
})
```

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
