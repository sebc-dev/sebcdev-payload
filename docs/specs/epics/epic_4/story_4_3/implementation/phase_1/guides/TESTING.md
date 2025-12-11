# Testing Strategy - Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Phase**: 1 of 3

---

## Testing Overview

Phase 1 focuses on configuration and package installation. The testing strategy emphasizes:
- Build verification
- Type checking
- Manual admin panel verification

Full unit and E2E tests are introduced in Phases 2 and 3.

---

## Test Types for Phase 1

### 1. Static Analysis (Automated)

| Check | Command | Expected Result |
|-------|---------|-----------------|
| TypeScript | `pnpm exec tsc --noEmit` | No errors |
| ESLint | `pnpm lint` | No errors |
| Build | `pnpm build` | Success |

### 2. Package Verification (Semi-Automated)

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Package installed | `pnpm list @payloadcms/live-preview-react` | Shows version 3.x |
| No vulnerabilities | `pnpm audit` | No high/critical |

### 3. Manual Verification (Required)

| Check | Steps | Expected Result |
|-------|-------|-----------------|
| Admin loads | Navigate to `/admin` | Login page/dashboard |
| Live Preview visible | Edit an article | Split view appears |
| URL correct | Inspect iframe src | Correct locale and slug |
| Breakpoints work | Click breakpoint buttons | Preview resizes |

---

## Static Analysis

### TypeScript Verification

```bash
# Full type check
pnpm exec tsc --noEmit

# Verbose output
pnpm exec tsc --noEmit --listFiles | grep -E "(Articles|live-preview)"
```

#### Expected Output

```
# No output = no errors
```

#### Common Type Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Property 'livePreview' does not exist` | Wrong Payload version | Update to 3.65.x+ |
| `Type 'null' is not assignable` | Incorrect return type | Return empty string instead |
| `locale' implicitly has 'any' type` | Missing types | Add proper type annotation |

### ESLint Verification

```bash
# Run linter
pnpm lint

# With auto-fix
pnpm lint --fix
```

#### Expected Output

```
✓ No ESLint warnings or errors
```

### Build Verification

```bash
# Full build
pnpm build
```

#### Expected Output

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
...
```

---

## Package Verification

### Dependency Check

```bash
# Check package is installed
pnpm list @payloadcms/live-preview-react

# Expected output
@payloadcms/live-preview-react 3.x.x
```

### Peer Dependency Check

```bash
# List peer dependencies
pnpm list --depth=1 | grep -E "(payload|react|next)"

# Verify versions are compatible
# - payload: 3.65.x
# - react: 19.x
# - next: 15.x
```

### Security Audit

```bash
# Run security audit
pnpm audit

# Expected: No high or critical vulnerabilities
```

---

## Manual Testing

### Test 1: Admin Panel Loads

**Preconditions**:
- Dev server running (`pnpm dev`)
- Database migrated

**Steps**:
1. Open browser to `http://localhost:3000/admin`
2. Login with admin credentials
3. Navigate to Articles collection

**Expected Result**:
- Admin dashboard loads
- Articles list visible
- No console errors

### Test 2: Live Preview Panel Visible

**Preconditions**:
- Admin logged in
- At least one article exists with a slug

**Steps**:
1. Go to `/admin/collections/articles`
2. Click on an article
3. Observe the page layout

**Expected Result**:
- Split view layout visible
- Form on left side
- Preview panel on right side
- Breakpoint selector in toolbar

### Test 3: Preview URL Generation

**Preconditions**:
- Article edit page open
- Article has slug `test-article`
- Locale is French (`fr`)

**Steps**:
1. Open browser DevTools (F12)
2. Inspect the preview iframe element
3. Check the `src` attribute

**Expected Result**:
```
src="http://localhost:3000/fr/articles/test-article"
```

### Test 4: Locale Handling

**Steps**:
1. Edit article in French locale
2. Check preview URL → should be `/fr/articles/[slug]`
3. Switch to English locale (if available)
4. Check preview URL → should be `/en/articles/[slug]`

**Expected Result**:
- URL locale matches admin locale
- Falls back to `fr` if locale undefined

### Test 5: Breakpoint Selector

**Steps**:
1. In preview panel, find breakpoint selector
2. Click "Mobile" button
3. Observe preview size change
4. Click "Tablet" button
5. Click "Desktop" button

**Expected Result**:
| Breakpoint | Width |
|------------|-------|
| Mobile | ~375px |
| Tablet | ~768px |
| Desktop | ~1440px |

### Test 6: Missing Slug Handling

**Steps**:
1. Create a new article (no slug yet)
2. Observe preview panel

**Expected Result**:
- Preview panel visible but empty/disabled
- No JavaScript errors in console

---

## Test Matrix

### Commit 1 Tests

| Test | Type | Status |
|------|------|--------|
| Package installed | Automated | Required |
| TypeScript compiles | Automated | Required |
| No peer dep warnings | Semi-auto | Required |
| Dev server starts | Manual | Required |

### Commit 2 Tests

| Test | Type | Status |
|------|------|--------|
| TypeScript compiles | Automated | Required |
| Lint passes | Automated | Required |
| Build succeeds | Automated | Required |
| Live Preview visible | Manual | Required |
| URL correct | Manual | Required |
| Breakpoints work | Manual | Required |

### Commit 3 Tests

| Test | Type | Status |
|------|------|--------|
| Env var documented | Manual | Required |
| Dev server starts | Manual | Required |
| URL uses env var | Manual | Required |

---

## Test Commands Summary

```bash
# Quick verification (run before each commit)
pnpm exec tsc --noEmit && pnpm lint

# Full verification (run after Phase 1)
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm test:unit  # Should pass (no new unit tests in Phase 1)
```

---

## Regression Testing

### Existing Functionality to Verify

After Phase 1 changes, verify these still work:

| Feature | Verification |
|---------|--------------|
| Article CRUD | Create, read, update, delete articles |
| Article fields | All fields editable |
| Access control | Published/draft filtering works |
| Hooks | Reading time calculation still works |
| Frontend | Article pages render correctly |

### Regression Test Commands

```bash
# Run existing unit tests
pnpm test:unit

# Run existing integration tests
pnpm test:int

# Run existing E2E tests (if any for articles)
pnpm test:e2e
```

---

## Test Coverage Notes

### Phase 1 Coverage

| Area | Coverage | Notes |
|------|----------|-------|
| Package installation | Manual | No automated tests needed |
| Collection config | Type checking | TypeScript validates config |
| URL generation | Manual | E2E tests in Phase 3 |
| Breakpoints | Manual | Visual verification only |

### Future Test Coverage (Phase 2-3)

| Area | Test Type | Phase |
|------|-----------|-------|
| RefreshRouteOnSave component | Unit tests | Phase 2 |
| Draft mode integration | Integration | Phase 3 |
| Full Live Preview flow | E2E | Phase 3 |

---

## Troubleshooting Tests

### TypeScript Fails

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache/typescript

# Regenerate types
pnpm generate:types

# Check specific file
pnpm exec tsc --noEmit src/collections/Articles.ts
```

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Clean node_modules
rm -rf node_modules
pnpm install

# Verbose build
pnpm build --debug
```

### Admin Panel Issues

```bash
# Check Payload logs
# Look for errors in terminal running pnpm dev

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Check console for JavaScript errors
# Open DevTools (F12) → Console tab
```

---

**Testing Guide Created**: 2025-12-11
**Guide Version**: 1.0
