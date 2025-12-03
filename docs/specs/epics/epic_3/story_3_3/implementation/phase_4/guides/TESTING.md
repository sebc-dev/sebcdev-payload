# Testing Guide: Phase 4 - Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 4 of 5

---

## Testing Strategy Overview

Phase 4 adds interactive components requiring more thorough testing:

1. **Build-time validation**: TypeScript, ESLint
2. **Manual testing**: Browser inspection on multiple viewports
3. **Interactive testing**: Sheet behavior, language switching
4. **Accessibility testing**: Keyboard navigation, ARIA

> **Note**: Comprehensive E2E tests are added in Phase 5. This phase focuses on manual testing during development.

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

| Test Area | What to Test |
|-----------|--------------|
| Mobile Menu | Hamburger visibility, Sheet behavior |
| Language Switcher | Locale toggle, URL preservation |
| Responsive | Breakpoint behavior at 1024px |
| Accessibility | Keyboard navigation, focus management |

### 3. Unit Tests (Optional for Phase 4)

If writing unit tests, focus on:

```typescript
// Future test file: tests/unit/LanguageSwitcher.spec.tsx
describe('LanguageSwitcher', () => {
  it('highlights current locale')
  it('generates correct locale URLs')
  it('preserves current path on switch')
})

// Future test file: tests/unit/MobileMenu.spec.tsx
describe('MobileMenu', () => {
  it('renders hamburger button')
  it('opens Sheet on click')
  it('closes Sheet on link click')
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
- Wrong hook usage (client vs server)
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
- React hooks rules

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
- Tree-shaking issues

---

## Manual Testing Checklist

### Test 1: Hamburger Menu Visibility

**Mobile Setup**: Set viewport width to <1024px (e.g., 375px)

**Steps**:
1. Navigate to `http://localhost:3000/fr`
2. Look at header area

**Expected**:
- [ ] Hamburger icon (☰) visible on right side
- [ ] Desktop navigation NOT visible
- [ ] Language switcher visible (FR/EN)

**Desktop Setup**: Set viewport width to ≥1024px

**Steps**:
1. Same URL
2. Look at header area

**Expected**:
- [ ] Hamburger icon NOT visible
- [ ] Desktop navigation visible
- [ ] Language switcher visible

---

### Test 2: Mobile Menu Opening/Closing

**Setup**: Mobile viewport (<1024px)

**Test 2.1: Open via Hamburger**
1. Click hamburger button
2. Sheet should slide in from right

**Expected**:
- [ ] Sheet opens with animation
- [ ] Overlay covers background
- [ ] Navigation links visible
- [ ] Language switcher visible in sheet

**Test 2.2: Close via X Button**
1. With sheet open, click X button (top-right)

**Expected**:
- [ ] Sheet closes
- [ ] Focus returns to hamburger button

**Test 2.3: Close via Overlay**
1. Open sheet
2. Click on overlay (darkened background)

**Expected**:
- [ ] Sheet closes

**Test 2.4: Close via Escape Key**
1. Open sheet
2. Press Escape key

**Expected**:
- [ ] Sheet closes
- [ ] Focus returns to hamburger button

---

### Test 3: Mobile Menu Navigation

**Setup**: Mobile viewport (<1024px), Sheet open

**Test Each Link**:

| Link | Click | Expected URL |
|------|-------|--------------|
| Accueil/Home | Click | `/fr` or `/en` |
| Articles | Click | `/fr/articles` or `/en/articles` |
| Catégories | Click | `/fr/articles?category=all` |
| Niveaux | Click | `/fr/articles?level=all` |

**Expected for each**:
- [ ] Sheet closes after click
- [ ] Navigates to correct URL
- [ ] Page updates (client-side navigation)

---

### Test 4: Language Switcher - Desktop

**Setup**: Desktop viewport (≥1024px)

**URL**: `http://localhost:3000/fr`

**Steps**:
1. Look at language switcher (FR / EN)
2. Note "FR" is highlighted (primary color)
3. Click "EN"

**Expected**:
- [ ] URL changes to `/en`
- [ ] Page content updates to English
- [ ] "EN" is now highlighted
- [ ] No full page reload (smooth transition)

**Steps** (on articles page):
1. Navigate to `/fr/articles`
2. Click "EN" in language switcher

**Expected**:
- [ ] URL changes to `/en/articles` (path preserved)
- [ ] Still on articles page

---

### Test 5: Language Switcher - Mobile (Header)

**Setup**: Mobile viewport (<1024px)

**URL**: `http://localhost:3000/fr`

**Steps**:
1. Look at header (before opening menu)
2. Note language switcher visible next to hamburger
3. Click "EN"

**Expected**:
- [ ] URL changes to `/en`
- [ ] Page content updates to English
- [ ] No full page reload

---

### Test 6: Language Switcher - Mobile (In Sheet)

**Setup**: Mobile viewport (<1024px), Sheet open

**Steps**:
1. Open mobile menu
2. Scroll to language section at bottom
3. Click alternate locale

**Expected**:
- [ ] Sheet closes (or stays open - design choice)
- [ ] URL updates
- [ ] Language changes

---

### Test 7: Responsive Breakpoint

**Test at exactly 1024px width**:

**Setup**: Use DevTools to set exact width

| Width | Expected |
|-------|----------|
| 1023px | Mobile (hamburger, no nav) |
| 1024px | Desktop (nav, no hamburger) |

**Expected**:
- [ ] Clean switch at exactly 1024px
- [ ] No layout flash or both showing simultaneously
- [ ] No horizontal scroll

---

### Test 8: Focus Management

**Setup**: Mobile viewport, keyboard only

**Test 8.1: Tab to Hamburger**
1. Press Tab to focus hamburger button
2. Note focus ring visible

**Expected**:
- [ ] Focus ring visible on hamburger

**Test 8.2: Open with Keyboard**
1. With hamburger focused, press Enter

**Expected**:
- [ ] Sheet opens
- [ ] Focus moves into sheet

**Test 8.3: Tab Through Sheet**
1. With sheet open, press Tab repeatedly

**Expected**:
- [ ] Focus moves through: Close button → Nav links → Language links
- [ ] Focus cycles within sheet (trapped)
- [ ] Does NOT go to page behind sheet

**Test 8.4: Close with Escape**
1. With sheet open, press Escape

**Expected**:
- [ ] Sheet closes
- [ ] Focus returns to hamburger button

---

## i18n Testing

### Verify Translation Keys

```bash
# Check French translations
cat messages/fr.json | grep -A 5 '"language"'
cat messages/fr.json | grep -A 3 '"mobileMenu"'

# Check English translations
cat messages/en.json | grep -A 5 '"language"'
cat messages/en.json | grep -A 3 '"mobileMenu"'
```

### Test All Localized Text

**French (`/fr`)**:
- [ ] Hamburger aria-label: "Ouvrir le menu"
- [ ] Language switcher: "FR / EN"
- [ ] In sheet: "Changer de langue"

**English (`/en`)**:
- [ ] Hamburger aria-label: "Open menu"
- [ ] Language switcher: "FR / EN"
- [ ] In sheet: "Switch language"

### Test URL Preservation

| Starting URL | Click | Expected URL |
|--------------|-------|--------------|
| `/fr` | EN | `/en` |
| `/fr/articles` | EN | `/en/articles` |
| `/fr/articles?category=tech` | EN | `/en/articles?category=tech` |
| `/en` | FR | `/fr` |
| `/en/articles` | FR | `/fr/articles` |

---

## Accessibility Testing

### Screen Reader Test (Manual)

**Steps** (with VoiceOver/NVDA if available):
1. Navigate to page
2. Focus hamburger button

**Expected**:
- [ ] Announced as "Ouvrir le menu, button" (French)
- [ ] Or "Open menu, button" (English)

**Steps**:
1. Open sheet
2. Navigate through with screen reader

**Expected**:
- [ ] Sheet announced as dialog
- [ ] Navigation links announced
- [ ] Language group announced

### Color Contrast

**Check**:
- [ ] Active locale (primary color) vs background: ≥4.5:1
- [ ] Inactive locale (muted) vs background: ≥4.5:1
- [ ] Hamburger icon vs background: ≥3:1 (UI component)

**Tools**:
- Chrome DevTools → Accessibility panel
- axe DevTools extension
- WebAIM Contrast Checker

### Keyboard Navigation

- [ ] All interactive elements focusable
- [ ] Visible focus indicators
- [ ] Logical tab order
- [ ] Sheet focus trapped when open
- [ ] Escape closes sheet

---

## Interactive Testing Scenarios

### Scenario 1: Mobile User Journey

1. User on mobile (`/fr`)
2. Tap hamburger → Sheet opens
3. Tap "Articles" → Navigate to `/fr/articles`, Sheet closes
4. Scroll page
5. Tap hamburger → Sheet opens
6. Tap "EN" → Navigate to `/en/articles`, Sheet closes
7. Verify page is now in English

**Verify**:
- [ ] All steps work smoothly
- [ ] No double-tap needed
- [ ] No stuck state

### Scenario 2: Desktop Language Switch

1. User on desktop (`/fr/articles`)
2. Read some content in French
3. Click "EN" in header
4. Verify URL is `/en/articles`
5. Verify same article, now in English
6. Click browser back
7. Should be at `/fr/articles` again

**Verify**:
- [ ] Language switch is instant (no reload)
- [ ] Browser history works correctly
- [ ] Content updates properly

### Scenario 3: Window Resize

1. Start on desktop (1200px)
2. Verify desktop navigation visible
3. Resize window slowly to 900px
4. Verify mobile hamburger appears
5. Open mobile menu
6. Resize window to 1200px while menu open
7. Verify clean transition (menu might close)

**Verify**:
- [ ] No layout breakage during resize
- [ ] Menu state handled gracefully

---

## Visual Regression Testing

### Screenshot Baseline (Manual)

Take screenshots for future comparison:

**Mobile Screenshots**:
- [ ] Header with hamburger (`375px wide, /fr`)
- [ ] Mobile menu open
- [ ] Mobile menu with language section visible

**Desktop Screenshots**:
- [ ] Header with full navigation (`1440px wide, /fr`)
- [ ] Header with full navigation (`1440px wide, /en`)

### Visual Checklist

- [ ] Hamburger icon aligned properly
- [ ] Sheet width appropriate (300-350px)
- [ ] Language switcher visually consistent header/sheet
- [ ] Active locale clearly distinguished
- [ ] Proper spacing and padding
- [ ] No overflow or cutoff text

---

## Edge Cases

### Empty Path

**Test**: Language switch on root path

| Starting | Click | Expected |
|----------|-------|----------|
| `/fr` | EN | `/en` |
| `/en` | FR | `/fr` |

### Path with Query Parameters

**Test**: Language switch preserves query params

| Starting | Click | Expected |
|----------|-------|----------|
| `/fr/articles?page=2` | EN | `/en/articles?page=2` |

### Non-Existent Page

**Test**: Language switch on 404 page

| Starting | Click | Expected |
|----------|-------|----------|
| `/fr/nonexistent` | EN | `/en/nonexistent` (still 404) |

---

## CI/CD Considerations

### What Runs in CI

```yaml
# These should pass after Phase 4
- pnpm lint
- pnpm build
- pnpm test:unit  # If unit tests added
```

### What's Deferred to Phase 5

- E2E tests (Playwright)
- Accessibility audit (axe-core)
- Visual regression tests
- Full navigation flow tests

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

## Troubleshooting Tests

### Sheet Not Opening

**Symptom**: Clicking hamburger does nothing

**Debug**:
1. Check console for errors
2. Verify Sheet component imports correct
3. Verify SheetTrigger has `asChild`

### Language Switch Not Working

**Symptom**: Click on language does nothing

**Debug**:
1. Check Link uses `@/i18n/routing`
2. Verify `locale` prop is set
3. Check pathname extraction regex

### Focus Not Trapped

**Symptom**: Tab escapes sheet to page behind

**Debug**:
1. Verify Sheet from `@/components/ui/sheet`
2. Check Radix Dialog dependencies
3. Verify no `modal={false}` prop

### Wrong Breakpoint Behavior

**Symptom**: Both layouts show at some width

**Debug**:
1. Check classes use same breakpoint (`lg:`)
2. Verify `hidden` + `lg:flex` pattern
3. Check for conflicting CSS

---

## Phase 5 Test Preview

In Phase 5, we'll add comprehensive E2E tests:

```typescript
// tests/e2e/mobile-navigation.e2e.spec.ts (Phase 5)
describe('Mobile Navigation', () => {
  test('hamburger opens mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/fr')
    await page.click('[aria-label="Ouvrir le menu"]')
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('mobile menu links navigate correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/fr')
    await page.click('[aria-label="Ouvrir le menu"]')
    await page.click('text=Articles')
    await expect(page).toHaveURL('/fr/articles')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('language switcher changes locale', async ({ page }) => {
    await page.goto('/fr/articles')
    await page.click('text=EN')
    await expect(page).toHaveURL('/en/articles')
  })

  test('escape closes mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/fr')
    await page.click('[aria-label="Ouvrir le menu"]')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})
```

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
