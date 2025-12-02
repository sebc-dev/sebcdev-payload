# Testing Guide - Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Phase**: 3 of 4

---

## Testing Strategy

Phase 3 focuses on visual styling changes. The testing strategy is:

| Test Type | Tools | Coverage |
|-----------|-------|----------|
| Build Validation | Next.js build | CSS compilation |
| Lint Validation | ESLint, Biome | Code quality |
| Visual Testing | Browser DevTools | Design conformity |
| Manual Testing | Browser | User experience |
| E2E Tests | Playwright | Full integration (Phase 4) |

**Note**: Full E2E visual tests are part of Phase 4. Phase 3 focuses on manual visual verification and build validation.

---

## Build Validation Tests

### Test 1: Next.js Build Success

**Purpose**: Verify CSS compiles without errors

```bash
pnpm build
```

**Expected Result**:
- Build completes successfully
- No CSS parsing errors
- No import errors for deleted files

**Common Failures**:
- Invalid CSS syntax in globals.css
- Missing font imports
- Reference to deleted styles.css

### Test 2: Development Server

**Purpose**: Verify hot reload and CSS processing

```bash
pnpm dev
```

**Expected Result**:
- Server starts on http://localhost:3000
- Tailwind classes applied
- No console errors

### Test 3: Lint Check

**Purpose**: Verify code quality

```bash
pnpm lint
```

**Expected Result**:
- No ESLint errors
- No warnings in changed files

### Test 4: TypeScript Check

**Purpose**: Verify type safety

```bash
pnpm exec tsc --noEmit
```

**Expected Result**:
- No TypeScript errors
- Font imports properly typed

---

## Visual Testing

### Test 5: Color Verification

**Purpose**: Verify design tokens applied correctly

**Steps**:
1. Open http://localhost:3000/fr (or /en)
2. Open DevTools (F12)
3. Inspect `<body>` element
4. Check computed styles

**Expected Results**:

| Element | Property | Expected Value |
|---------|----------|----------------|
| body | background-color | rgb(26, 29, 35) - #1A1D23 |
| body | color | rgb(247, 250, 252) - #F7FAFC |
| h1 | color | rgb(247, 250, 252) - #F7FAFC |
| Button (default) | background-color | rgb(20, 184, 166) - #14B8A6 |

**Verification Script** (run in DevTools console):

```javascript
// Verify background color
const body = document.body;
const bgColor = getComputedStyle(body).backgroundColor;
console.log('Background:', bgColor);
// Expected: rgb(26, 29, 35)

// Verify text color
const textColor = getComputedStyle(body).color;
console.log('Text color:', textColor);
// Expected: rgb(247, 250, 252)

// Verify CSS variables
const root = document.documentElement;
const primary = getComputedStyle(root).getPropertyValue('--primary');
console.log('Primary:', primary);
// Expected: 174 72% 40%
```

### Test 6: Font Verification

**Purpose**: Verify fonts load correctly

**Steps**:
1. Open http://localhost:3000
2. Open DevTools > Network tab
3. Filter by "Font"
4. Refresh page

**Expected Results**:
- Nunito Sans font files loaded (woff2)
- JetBrains Mono font files loaded (woff2)

**Computed Style Check**:

```javascript
// Check body font
const bodyFont = getComputedStyle(document.body).fontFamily;
console.log('Body font:', bodyFont);
// Expected: Contains "Nunito Sans"

// Check if font-mono is available
const codeElement = document.querySelector('code');
if (codeElement) {
  const codeFont = getComputedStyle(codeElement).fontFamily;
  console.log('Code font:', codeFont);
  // Expected: Contains "JetBrains Mono"
}
```

### Test 7: Responsive Design

**Purpose**: Verify responsive breakpoints work

**Steps**:
1. Open http://localhost:3000
2. Open DevTools
3. Toggle device toolbar (Ctrl+Shift+M)
4. Test at different widths

**Expected Results**:

| Width | h1 Size | Padding | Layout |
|-------|---------|---------|--------|
| 375px (mobile) | text-3xl | p-6 | Vertical |
| 768px (tablet) | text-4xl | p-11 | Vertical |
| 1024px+ (desktop) | text-5xl | p-11 | Horizontal footer |

### Test 8: Button Component

**Purpose**: Verify Button variants still work with new theme

**Steps**:
1. Navigate to homepage
2. Scroll to "Button Variants" section
3. Inspect each button variant

**Expected Results**:

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Default | Teal (#14B8A6) | White | None |
| Secondary | Gray (#374151) | White | None |
| Outline | Transparent | White | Border |
| Ghost | Transparent | White | None |
| Destructive | Red (#F56565) | White | None |
| Link | Transparent | Teal | None (underline on hover) |

### Test 9: Hover States

**Purpose**: Verify interactive states work

**Steps**:
1. Hover over "Go to admin panel" link
2. Hover over "Documentation" link
3. Hover over each button variant

**Expected Results**:
- Admin link: Slight opacity change on hover
- Docs link: Background changes to muted color
- Buttons: Slight opacity change on hover

---

## Accessibility Testing

### Test 10: Focus Indicators

**Purpose**: Verify keyboard navigation works

**Steps**:
1. Open homepage
2. Press Tab key repeatedly
3. Observe focus rings

**Expected Results**:
- Visible focus ring on links
- Visible focus ring on buttons
- Ring color is teal (#14B8A6)

### Test 11: Contrast Check

**Purpose**: Verify WCAG AA contrast requirements

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Tests**:

| Foreground | Background | Ratio | WCAG AA |
|------------|------------|-------|---------|
| #F7FAFC | #1A1D23 | 14.5:1 | Pass |
| #A0AEC0 | #1A1D23 | 6.3:1 | Pass |
| #14B8A6 | #1A1D23 | 5.2:1 | Pass |
| #F7FAFC | #14B8A6 | 2.8:1 | Pass (large text) |

**Note**: Full contrast audit is in Phase 4 with axe-core.

---

## Integration Tests

### Test 12: Admin Panel Isolation

**Purpose**: Verify admin panel is not affected

**Steps**:
1. Navigate to /admin
2. Check styling is unchanged

**Expected Results**:
- Admin panel uses its own styles
- No interference from globals.css changes
- Login/dashboard functional

### Test 13: Build for Cloudflare

**Purpose**: Verify production build works

```bash
pnpm build
pnpm preview
```

**Expected Results**:
- Build completes
- Preview server works
- Styles render correctly

---

## Test Commands Summary

```bash
# Build validation
pnpm build                    # Build Next.js
pnpm lint                     # Lint check
pnpm exec tsc --noEmit        # Type check

# Development testing
pnpm dev                      # Start dev server
# Visit http://localhost:3000

# Production preview
pnpm preview                  # Preview production build

# Dead code check
pnpm knip                     # Check for unused code
```

---

## Testing Checklist

### Pre-Commit Tests

Run before each commit:

- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Visual check in browser

### Post-Phase Tests

Run after all commits:

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] Color verification passes
- [ ] Font verification passes
- [ ] Responsive design works
- [ ] Button variants correct
- [ ] Hover states work
- [ ] Focus indicators visible
- [ ] Admin panel unaffected
- [ ] No console errors

---

## Troubleshooting Test Failures

### Build Fails

```bash
# Clear cache and retry
rm -rf .next
pnpm build

# Check for syntax errors
cat src/app/globals.css | head -50
```

### Colors Wrong

```bash
# Check CSS variables
grep -A20 ":root" src/app/globals.css

# Verify Tailwind processing
# Check browser DevTools for compiled CSS
```

### Fonts Not Loading

```bash
# Check import
grep -r "next/font" src/app/

# Check Network tab for font requests
# Verify CSS variable on html element
```

### Responsive Broken

```bash
# Check for typos in breakpoint prefixes
grep -r "sm:" src/app/
grep -r "lg:" src/app/
```

---

## E2E Tests (Phase 4 Preview)

Full E2E tests will be implemented in Phase 4:

```typescript
// tests/e2e/design-system.e2e.spec.ts (Phase 4)
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Design System', () => {
  test('homepage displays correct brand colors', async ({ page }) => {
    await page.goto('/fr')
    const body = page.locator('body')
    await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')
  })

  test('fonts are loaded correctly', async ({ page }) => {
    await page.goto('/fr')
    const h1 = page.locator('h1')
    const fontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily)
    expect(fontFamily).toContain('Nunito Sans')
  })

  test('contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/fr')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.filter(v => v.id === 'color-contrast')).toHaveLength(0)
  })
})
```

---

## Next Steps

After completing Phase 3 tests:

1. Complete `validation/VALIDATION_CHECKLIST.md`
2. Create PR for review
3. Phase 4 will add comprehensive E2E and accessibility tests
