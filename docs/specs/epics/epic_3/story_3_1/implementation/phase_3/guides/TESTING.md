# Phase 3 - Testing Guide

Testing strategy for Phase 3: App Directory Restructure.

---

## Testing Overview

Phase 3 is primarily about structural changes to the app directory. Testing focuses on:

1. **TypeScript compilation** - Ensure type safety after restructure
2. **Build verification** - Ensure production build works
3. **Manual route testing** - Verify all routes work correctly
4. **Visual verification** - Ensure styles apply correctly

**Note**: E2E tests are implemented in Phase 4. This phase focuses on manual and build verification.

---

## Test Types

| Test Type | When | Duration |
|-----------|------|----------|
| TypeScript Check | After each commit | 1 min |
| Lint Check | After each commit | 1 min |
| Build Check | After Commit 4 & 5 | 3-5 min |
| Manual Route Testing | After Commit 4 & 5 | 10 min |
| Visual Verification | After Commit 4 | 5 min |

---

## TypeScript Verification

Run after each commit to ensure type safety.

```bash
pnpm exec tsc --noEmit
```

### Expected Results

**After Commit 1**:
- No errors
- Root locale layout compiles

**After Commit 2**:
- Warning about missing `./styles.css` is acceptable
- Layout compiles otherwise

**After Commit 3**:
- No errors
- Page compiles with locale param

**After Commit 4 & 5**:
- No errors
- All files compile

### Common TypeScript Issues

```typescript
// Issue: params type mismatch
// Error: Property 'locale' does not exist on type 'Promise'
// Fix: Use await
const { locale } = await params

// Issue: Missing import
// Error: Cannot find name 'setRequestLocale'
// Fix: Add import
import { setRequestLocale } from 'next-intl/server'

// Issue: Invalid locale type
// Error: Argument of type 'string' is not assignable to parameter of type 'Locale'
// Fix: Use isValidLocale guard
if (!isValidLocale(locale)) {
  notFound()
}
```

---

## Build Verification

Run after Commit 4 and Commit 5 to ensure production build works.

```bash
pnpm build
```

### Expected Build Output

```
▲ Next.js 15.x.x

Creating an optimized production build ...
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/Y)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /[locale]                            X kB         XX kB
├ ○ /[locale]/(frontend)                 X kB         XX kB
├ ○ /admin/[[...segments]]               X kB         XX kB
...

○  (Static)  prerendered as static content
```

### Build Checks

- [ ] Build completes without errors
- [ ] Static pages generated for `/fr` and `/en`
- [ ] No warnings about dynamic routes
- [ ] Bundle size is reasonable

---

## Manual Route Testing

### Setup

```bash
# Start development server
pnpm dev

# Or test with production build
pnpm build && pnpm start
```

### Test Matrix

| Test Case | Route | Expected Behavior | Pass |
|-----------|-------|-------------------|------|
| Root redirect | `/` | Redirects to `/fr` (or `/en` based on browser) | [ ] |
| French homepage | `/fr` | Shows homepage in French | [ ] |
| English homepage | `/en` | Shows homepage in English | [ ] |
| French with path | `/fr/` | Shows homepage (trailing slash) | [ ] |
| English with path | `/en/` | Shows homepage (trailing slash) | [ ] |
| Admin panel | `/admin` | Shows Payload admin login | [ ] |
| API route | `/api/users` | Returns JSON (or 401) | [ ] |
| Invalid locale | `/de` | Returns 404 | [ ] |

### Browser DevTools Checks

| Check | How | Expected | Pass |
|-------|-----|----------|------|
| HTML lang (fr) | Visit `/fr`, inspect `<html>` | `lang="fr"` | [ ] |
| HTML lang (en) | Visit `/en`, inspect `<html>` | `lang="en"` | [ ] |
| Cookie set | Application → Cookies | `NEXT_LOCALE` cookie exists | [ ] |
| No console errors | Console tab | No errors | [ ] |
| Styles loaded | Network tab | `styles.css` 200 | [ ] |

---

## Visual Verification

After Commit 4, verify styles apply correctly.

### Visual Checks

| Element | Expected | Pass |
|---------|----------|------|
| Background | Correct color/gradient | [ ] |
| Typography | Correct fonts | [ ] |
| Layout | Centered content | [ ] |
| Payload logo | Visible and correct size | [ ] |
| Links | Styled correctly | [ ] |
| Footer | Positioned at bottom | [ ] |

### Comparison Test

1. Open the original homepage (before migration) - use git stash or separate branch
2. Open the new homepage at `/fr`
3. Compare visually - should be identical

```bash
# If you have a backup branch
git stash
pnpm dev
# Check original at http://localhost:3000

git stash pop
pnpm dev
# Check new at http://localhost:3000/fr
```

---

## Integration Testing Scenarios

While formal integration tests are in Phase 4, you can manually verify these scenarios:

### Scenario 1: New Visitor (French Browser)

1. Clear cookies and localStorage
2. Set browser language to French
3. Visit `http://localhost:3000/`
4. **Expected**:
   - Redirect to `/fr`
   - `NEXT_LOCALE` cookie set to `fr`
   - `<html lang="fr">`

### Scenario 2: New Visitor (English Browser)

1. Clear cookies and localStorage
2. Set browser language to English
3. Visit `http://localhost:3000/`
4. **Expected**:
   - Redirect to `/en`
   - `NEXT_LOCALE` cookie set to `en`
   - `<html lang="en">`

### Scenario 3: Returning Visitor

1. Visit `/en` to set cookie
2. Close browser
3. Open browser, visit `http://localhost:3000/`
4. **Expected**:
   - Redirect to `/en` (cookie preference)
   - `<html lang="en">`

### Scenario 4: Direct Locale Access

1. Clear cookies
2. Visit `http://localhost:3000/en` directly
3. **Expected**:
   - Page loads without redirect
   - `<html lang="en">`

### Scenario 5: Admin Panel Isolation

1. Visit `http://localhost:3000/admin`
2. **Expected**:
   - Payload admin panel loads
   - No `/fr/admin` or `/en/admin` redirect
   - Works independently of i18n

---

## Testing Commands Reference

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Build
pnpm build

# Start dev server
pnpm dev

# Start production server (after build)
pnpm start

# Check specific route with curl
curl -I http://localhost:3000/
# Expected: 307 redirect to /fr or /en

curl -I http://localhost:3000/fr
# Expected: 200 OK

curl -I http://localhost:3000/admin
# Expected: 200 OK or 302 to login
```

---

## Troubleshooting

### Issue: 404 on /fr or /en

**Cause**: Files not in correct `[locale]` directory

**Solution**:
```bash
# Verify structure
ls -la src/app/[locale]/
ls -la src/app/[locale]/\(frontend\)/
```

### Issue: Styles Not Loading

**Cause**: styles.css not in correct location or not imported

**Solution**:
```bash
# Check file exists
ls -la src/app/[locale]/\(frontend\)/styles.css

# Check import in layout
grep "styles.css" src/app/[locale]/\(frontend\)/layout.tsx
```

### Issue: Admin Panel Not Working

**Cause**: Middleware affecting admin routes

**Solution**:
```bash
# Check middleware matcher
grep -A5 "matcher" middleware.ts
# Should exclude /admin
```

### Issue: Cookie Not Set

**Cause**: Middleware not running or cookie logic issue

**Solution**:
```bash
# Check middleware is being executed
# Add console.log temporarily in middleware.ts
console.log('Middleware running for:', request.nextUrl.pathname)
```

### Issue: Wrong HTML lang

**Cause**: Layout not using dynamic locale

**Solution**:
```bash
# Check layout
grep "lang=" src/app/[locale]/layout.tsx
# Should be: <html lang={locale}>
```

---

## Pre-Phase 4 Checklist

Before proceeding to Phase 4 (E2E tests), ensure:

- [ ] All TypeScript checks pass
- [ ] All lint checks pass
- [ ] Build succeeds
- [ ] All manual tests pass
- [ ] Visual comparison matches
- [ ] Admin panel works
- [ ] No console errors

---

## Test Report Template

Use this template to document test results:

```markdown
## Phase 3 Test Report

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Commit**: [Hash]

### TypeScript Check
- [ ] Pass / Fail
- Notes:

### Build Check
- [ ] Pass / Fail
- Notes:

### Route Tests
| Route | Result |
|-------|--------|
| / | Pass / Fail |
| /fr | Pass / Fail |
| /en | Pass / Fail |
| /admin | Pass / Fail |

### Visual Verification
- [ ] Styles match original
- [ ] All elements visible
- Notes:

### Browser Checks
- [ ] HTML lang correct
- [ ] Cookie set
- [ ] No console errors

### Issues Found
1. [Issue description]
2. [Issue description]

### Overall Result
- [ ] PASS - Ready for Phase 4
- [ ] FAIL - Issues to fix
```
