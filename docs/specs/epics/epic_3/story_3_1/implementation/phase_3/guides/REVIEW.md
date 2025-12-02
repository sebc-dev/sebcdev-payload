# Phase 3 - Code Review Guide

Guide for reviewing the 5 atomic commits in Phase 3.

---

## Review Overview

| Commit | Focus | Priority | Duration |
|--------|-------|----------|----------|
| 1 | Root locale layout | Critical | 15 min |
| 2 | Frontend layout | High | 10 min |
| 3 | HomePage migration | High | 15 min |
| 4 | Styles migration | Low | 5 min |
| 5 | Cleanup verification | Critical | 15 min |

**Total Review Time**: ~60 min

---

## Commit 1: Root Locale Layout

### File: `src/app/[locale]/layout.tsx`

#### Critical Checks

- [ ] **NextIntlClientProvider wraps children**
  ```typescript
  <NextIntlClientProvider messages={messages}>
    {children}
  </NextIntlClientProvider>
  ```

- [ ] **Dynamic html lang attribute**
  ```typescript
  <html lang={locale}>
  ```

- [ ] **generateStaticParams exports both locales**
  ```typescript
  export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
  }
  ```

- [ ] **setRequestLocale called for static rendering**
  ```typescript
  setRequestLocale(locale)
  ```

- [ ] **Next.js 15 async params pattern**
  ```typescript
  params: Promise<{ locale: string }>
  const { locale } = await params
  ```

- [ ] **Invalid locale handling**
  ```typescript
  if (!isValidLocale(locale)) {
    notFound()
  }
  ```

#### Security Checks

- [ ] No user input directly rendered without validation
- [ ] Locale validated before use
- [ ] No sensitive data exposed

#### Performance Checks

- [ ] Static rendering enabled with `setRequestLocale`
- [ ] `generateStaticParams` will pre-render both locales
- [ ] No unnecessary async operations

#### Questions to Ask

1. Is the locale validation sufficient?
2. Are all imports from correct next-intl packages?
3. Is the layout structure correct for Next.js 15?

---

## Commit 2: Frontend Layout

### File: `src/app/[locale]/(frontend)/layout.tsx`

#### Critical Checks

- [ ] **Route group uses parentheses**
  - Directory: `(frontend)` not `frontend`

- [ ] **setRequestLocale called**
  ```typescript
  setRequestLocale(locale)
  ```

- [ ] **Semantic HTML structure**
  ```typescript
  return <main>{children}</main>
  ```

- [ ] **Styles import present**
  ```typescript
  import './styles.css'
  ```
  Note: File won't exist until Commit 4

- [ ] **Basic metadata set**
  ```typescript
  export const metadata: Metadata = {
    description: '...',
    title: '...',
  }
  ```

#### Questions to Ask

1. Is the layout minimal and focused?
2. Does it correctly use the route group pattern?
3. Is metadata appropriate for this phase?

---

## Commit 3: HomePage Migration

### File: `src/app/[locale]/(frontend)/page.tsx`

#### Critical Checks

- [ ] **setRequestLocale at top of function**
  ```typescript
  const { locale } = await params
  setRequestLocale(locale)
  ```

- [ ] **Payload integration preserved**
  ```typescript
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  ```

- [ ] **File path reference updated**
  ```typescript
  <code>app/[locale]/(frontend)/page.tsx</code>
  ```

- [ ] **All imports resolved**
  ```typescript
  import { setRequestLocale } from 'next-intl/server'
  import config from '@/payload.config'
  ```

#### Comparison with Original

Compare with `src/app/(frontend)/page.tsx`:

- [ ] Structure matches original
- [ ] All UI elements preserved
- [ ] Only i18n-related code added
- [ ] No accidental deletions

#### Questions to Ask

1. Is the Payload auth integration working?
2. Are all links correct?
3. Is the code difference minimal?

---

## Commit 4: Styles Migration

### File: `src/app/[locale]/(frontend)/styles.css`

#### Critical Checks

- [ ] **File is exact copy**
  ```bash
  diff src/app/\(frontend\)/styles.css src/app/[locale]/\(frontend\)/styles.css
  # Should show no differences
  ```

- [ ] **No modifications to CSS**
  - No new styles
  - No removed styles
  - No renamed classes

#### Visual Verification

After this commit, verify in browser:

- [ ] Visit `/fr` - styles apply correctly
- [ ] Visit `/en` - styles apply correctly
- [ ] Layout matches original
- [ ] No CSS errors in console

---

## Commit 5: Cleanup Verification

### Files Deleted

- [ ] `src/app/(frontend)/layout.tsx` - deleted
- [ ] `src/app/(frontend)/page.tsx` - deleted
- [ ] `src/app/(frontend)/styles.css` - deleted
- [ ] `src/app/(frontend)/` directory - removed

### Final Structure Verification

```bash
ls -la src/app/
# Should show:
# [locale]/
# (payload)/

ls -la src/app/[locale]/
# Should show:
# layout.tsx
# (frontend)/

ls -la src/app/[locale]/\(frontend\)/
# Should show:
# layout.tsx
# page.tsx
# styles.css
```

#### Route Testing

| Route | Expected |
|-------|----------|
| `/` | Redirect to `/fr` |
| `/fr` | French homepage with styles |
| `/en` | English homepage with styles |
| `/admin` | Payload admin (unchanged) |
| `/api/...` | API routes work |

#### HTML Verification

```bash
# Check html lang in browser DevTools
# /fr → <html lang="fr">
# /en → <html lang="en">
```

#### Build Verification

```bash
pnpm build
# Must succeed without errors
```

---

## Review Checklist Summary

### For All Commits

- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Linting passes: `pnpm lint`
- [ ] No console.log or debug code
- [ ] Proper imports (no unused imports)
- [ ] Consistent code style

### After All Commits

- [ ] Build succeeds: `pnpm build`
- [ ] All routes work correctly
- [ ] Admin panel accessible
- [ ] `<html lang>` is dynamic
- [ ] Styles apply correctly
- [ ] No 404 errors
- [ ] No console errors

---

## Common Issues to Watch For

### 1. Missing setRequestLocale

```typescript
// BAD - Missing setRequestLocale
export default async function Page({ params }) {
  const { locale } = await params
  // Missing: setRequestLocale(locale)
  return <div>...</div>
}

// GOOD
export default async function Page({ params }) {
  const { locale } = await params
  setRequestLocale(locale) // Required for static rendering
  return <div>...</div>
}
```

### 2. Wrong Params Type (Next.js 14 vs 15)

```typescript
// BAD - Next.js 14 pattern
params: { locale: string }

// GOOD - Next.js 15 pattern
params: Promise<{ locale: string }>
```

### 3. Missing generateStaticParams

```typescript
// BAD - Missing in root layout
export default async function LocaleLayout(...) { }

// GOOD
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout(...) { }
```

### 4. Incorrect Directory Structure

```
// BAD
src/app/locale/...       # Missing brackets
src/app/[locale/...      # Missing closing bracket
src/app/frontend/...     # Missing parentheses for route group

// GOOD
src/app/[locale]/...
src/app/[locale]/(frontend)/...
```

### 5. Hardcoded Locales

```typescript
// BAD - Hardcoded
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

// GOOD - Uses routing config
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

---

## Approval Criteria

### Minimum Requirements for Approval

1. All TypeScript errors resolved
2. All lint errors resolved
3. Build succeeds
4. All routes work
5. Admin panel unaffected
6. Styles apply correctly

### Recommended Before Approval

1. Manual testing of all routes
2. Check browser console for errors
3. Verify `<html lang>` attribute
4. Test with different browser languages

---

## Questions for Developer

1. Did you test all routes after each commit?
2. Did the build succeed after the final commit?
3. Did you verify the admin panel still works?
4. Did you check the `<html lang>` attribute in DevTools?
5. Are there any edge cases you're concerned about?
