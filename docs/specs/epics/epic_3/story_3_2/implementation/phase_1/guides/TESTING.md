# Testing Guide - Phase 1: Tailwind CSS 4 Foundation

**Phase**: 1 of 4
**Purpose**: Testing strategy for Tailwind CSS 4 installation

---

## Testing Overview

Phase 1 is a foundation phase focused on tooling installation. Testing is primarily:

1. **Build verification**: Ensure CSS compiles correctly
2. **Runtime verification**: Tailwind classes work in browser
3. **Regression testing**: Admin panel unaffected
4. **Integration testing**: Works with existing i18n setup

---

## Test Categories

### 1. Installation Tests

**Objective**: Verify packages installed correctly

```bash
# Test 1.1: Tailwind installed
pnpm list tailwindcss
# Expected: tailwindcss@4.x.x

# Test 1.2: PostCSS plugin installed
pnpm list @tailwindcss/postcss
# Expected: @tailwindcss/postcss@4.x.x

# Test 1.3: No peer dependency warnings
pnpm install
# Expected: No warnings about peer dependencies
```

### 2. Configuration Tests

**Objective**: Verify configuration files are valid

```bash
# Test 2.1: PostCSS config syntax
node -e "import('./postcss.config.mjs').then(c => console.log('Config valid:', !!c.default.plugins))"
# Expected: Config valid: true

# Test 2.2: CSS file exists
test -f src/app/globals.css && echo "globals.css exists" || echo "MISSING"
# Expected: globals.css exists

# Test 2.3: CSS has Tailwind import
grep -q '@import "tailwindcss"' src/app/globals.css && echo "Import found" || echo "MISSING"
# Expected: Import found
```

### 3. Build Tests

**Objective**: Verify build succeeds with Tailwind

```bash
# Test 3.1: Clean build
rm -rf .next && pnpm build
# Expected: Build succeeds, exit code 0

# Test 3.2: No CSS compilation errors
pnpm build 2>&1 | grep -i "error" | grep -i "css"
# Expected: No output (no CSS errors)

# Test 3.3: Build artifacts exist
ls .next/static/css/*.css 2>/dev/null && echo "CSS built" || echo "No CSS files"
# Expected: CSS built (or bundled in chunks)
```

### 4. Runtime Tests

**Objective**: Verify Tailwind works in browser

#### Manual Tests

```bash
# Start dev server
pnpm dev
```

**Test 4.1: Page loads**
1. Open http://localhost:3000/fr
2. Page should render without errors
3. Check browser console for errors
   - Expected: No CSS-related errors

**Test 4.2: Tailwind classes work**
1. Temporarily add to `page.tsx`:
   ```tsx
   <div className="bg-red-500 p-4 m-4 rounded text-white">
     Tailwind Test
   </div>
   ```
2. Page should show red box with white text
3. Remove test code after verification

**Test 4.3: Utility classes compile**
1. Add various utility classes:
   ```tsx
   <div className="flex items-center justify-center gap-4">
     <span className="text-lg font-bold">Test</span>
   </div>
   ```
2. Verify flexbox layout works
3. Remove test code

### 5. Regression Tests

**Objective**: Ensure existing functionality unaffected

**Test 5.1: Admin panel**
1. Navigate to http://localhost:3000/admin
2. Admin login page should render
3. UI should look normal (Payload default styles)
4. No visual regressions

**Test 5.2: i18n routing**
1. Navigate to http://localhost:3000/
2. Should redirect to `/fr` (or `/en` based on browser)
3. Navigate directly to `/en`
4. Page should load in English

**Test 5.3: Middleware**
1. Clear cookies
2. Visit http://localhost:3000/
3. Should detect browser language
4. Cookie should be set

### 6. Integration Tests

**Objective**: Verify Tailwind integrates with existing setup

**Test 6.1: next-intl compatibility**
```bash
# Build with i18n
pnpm build
# Expected: No conflicts between Tailwind and next-intl
```

**Test 6.2: Cloudflare compatibility**
```bash
# Preview build (if available)
pnpm preview
# Expected: Works on Cloudflare Workers
```

---

## Automated Test Commands

### Quick Test Suite

```bash
#!/bin/bash
# run-phase1-tests.sh

echo "=== Phase 1: Tailwind CSS 4 Tests ==="

echo -e "\n1. Package installation..."
pnpm list tailwindcss @tailwindcss/postcss

echo -e "\n2. Config validation..."
node -e "import('./postcss.config.mjs').then(() => console.log('✅ PostCSS config valid')).catch(e => console.log('❌ Error:', e))"

echo -e "\n3. CSS file check..."
if grep -q '@import "tailwindcss"' src/app/globals.css; then
  echo "✅ Tailwind import found"
else
  echo "❌ Tailwind import missing"
fi

echo -e "\n4. Layout import check..."
if grep -q "globals.css" src/app/[locale]/layout.tsx; then
  echo "✅ Layout imports globals.css"
else
  echo "❌ Layout missing globals.css import"
fi

echo -e "\n5. Build test..."
pnpm build && echo "✅ Build succeeded" || echo "❌ Build failed"

echo -e "\n6. Lint check..."
pnpm lint && echo "✅ Lint passed" || echo "❌ Lint failed"

echo -e "\n=== Tests Complete ==="
```

### Run Tests

```bash
# Make executable
chmod +x run-phase1-tests.sh

# Run
./run-phase1-tests.sh
```

---

## E2E Test (Optional)

If E2E infrastructure is ready, add test:

```typescript
// tests/e2e/tailwind.e2e.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Tailwind CSS 4', () => {
  test('utility classes apply correctly', async ({ page }) => {
    await page.goto('/fr')

    // This test requires a test element in the page
    // Skip if no test element exists
    const testElement = page.locator('[data-testid="tailwind-test"]')
    if (await testElement.count() === 0) {
      test.skip()
      return
    }

    // Verify Tailwind class applies
    await expect(testElement).toHaveCSS('background-color', 'rgb(239, 68, 68)') // red-500
  })

  test('page loads without CSS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('CSS')) {
        errors.push(msg.text())
      }
    })

    await page.goto('/fr')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })
})
```

---

## Test Results Template

```markdown
## Phase 1 Test Results

**Date**: YYYY-MM-DD
**Tester**: [Name]

### Installation Tests
- [ ] Tailwind 4.x installed
- [ ] PostCSS plugin installed
- [ ] No peer dependency issues

### Configuration Tests
- [ ] PostCSS config valid
- [ ] globals.css exists
- [ ] Tailwind import present

### Build Tests
- [ ] Clean build succeeds
- [ ] No CSS errors
- [ ] Build artifacts generated

### Runtime Tests
- [ ] Page loads without errors
- [ ] Tailwind classes work
- [ ] No console errors

### Regression Tests
- [ ] Admin panel works
- [ ] i18n routing works
- [ ] Middleware works

### Integration Tests
- [ ] next-intl compatible
- [ ] Cloudflare compatible (if tested)

### Summary
- **Pass**: X/Y tests
- **Fail**: X/Y tests
- **Skip**: X/Y tests

### Notes
[Any issues or observations]
```

---

## Common Test Failures

### Failure: Build fails with CSS error

**Symptoms**: `pnpm build` fails with PostCSS error

**Check**:
1. Is `@import "tailwindcss"` syntax correct?
2. Is postcss.config.mjs using `@tailwindcss/postcss`?
3. Are both packages installed?

**Fix**:
```bash
# Reinstall packages
pnpm remove tailwindcss @tailwindcss/postcss
pnpm add tailwindcss@^4.0.0
pnpm add -D @tailwindcss/postcss@^4.0.0
```

### Failure: Tailwind classes not applying

**Symptoms**: Classes like `bg-red-500` don't work

**Check**:
1. Is globals.css imported in layout.tsx?
2. Is the import path correct (`@/app/globals.css`)?
3. Did you save all files?

**Fix**:
```typescript
// Ensure this is in src/app/[locale]/layout.tsx
import '@/app/globals.css'
```

### Failure: Admin panel broken

**Symptoms**: Admin UI looks wrong or doesn't load

**Check**:
1. Is globals.css scoped to `[locale]` layout?
2. Are there conflicting base styles?

**Fix**:
- globals.css should only be in `[locale]/layout.tsx`
- NOT in `(payload)/layout.tsx`

---

## Next Steps After Testing

1. Document all test results
2. Fix any failing tests
3. Complete [validation/VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md)
4. Proceed to Phase 2 if all tests pass
