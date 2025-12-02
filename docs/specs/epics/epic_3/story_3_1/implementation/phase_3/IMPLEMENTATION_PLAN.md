# Phase 3 - Atomic Implementation Plan

**Objective**: Restructure the Next.js App Router directory with the `[locale]` dynamic segment, enabling locale-aware frontend routing while preserving Payload admin routes.

---

## Overview

### Why an Atomic Approach?

The implementation is split into **5 independent commits** to:

- **Minimize risk** - App directory restructuring is high-risk; small commits enable easy rollback
- **Enable testing** - Each commit can be validated before proceeding
- **Clear separation** - Root layout, frontend layout, page, styles, cleanup are distinct concerns
- **Safe migration** - Old files deleted only after new structure is verified
- **Progressive validation** - Build and type-check at each step

### Global Strategy

```
[Commit 1]    →    [Commit 2]      →    [Commit 3]     →    [Commit 4]    →    [Commit 5]
Root layout        Frontend layout      HomePage            Styles             Cleanup
    ↓                   ↓                   ↓                  ↓                  ↓
 [locale]          (frontend)          page.tsx          styles.css         Delete old
 layout.tsx        layout.tsx          migration          move              files
```

---

## The 5 Atomic Commits

### Commit 1: Create [locale] Root Layout with NextIntlClientProvider

**Files**:
- `src/app/[locale]/layout.tsx` (create)

**Size**: ~50 lines
**Duration**: 30-40 min (implementation) + 15 min (review)

**Content**:

- Create the root locale layout at `src/app/[locale]/layout.tsx`
- Import and use `NextIntlClientProvider` from `next-intl`
- Import `getMessages`, `setRequestLocale` from `next-intl/server`
- Export `generateStaticParams()` for static locale paths
- Set dynamic `<html lang={locale}>` attribute
- Use Next.js 15 async params pattern (`params: Promise<{ locale: string }>`)

**Why it's atomic**:

- Single responsibility: locale provider setup
- Foundation for all locale-aware pages
- Can be validated with TypeScript before adding pages

**Technical Implementation**:

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { type Locale, isValidLocale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

**Expected Result**: TypeScript compiles, no lint errors

**Review Criteria**:

- [ ] Uses `NextIntlClientProvider` correctly
- [ ] `generateStaticParams()` returns both locales
- [ ] `setRequestLocale()` called for static rendering
- [ ] Uses Next.js 15 async `params` pattern
- [ ] `<html lang={locale}>` is dynamic
- [ ] Invalid locale triggers `notFound()`
- [ ] No hardcoded locale values

---

### Commit 2: Create [locale]/(frontend) Layout

**Files**:
- `src/app/[locale]/(frontend)/layout.tsx` (create)

**Size**: ~25 lines
**Duration**: 20-30 min (implementation) + 10 min (review)

**Content**:

- Create frontend layout at `src/app/[locale]/(frontend)/layout.tsx`
- Import styles.css (will be moved in Commit 4)
- Export metadata with locale-aware title/description (basic)
- Wrap children in `<main>` element
- Keep it simple - full i18n metadata comes in later stories

**Why it's atomic**:

- Separates frontend layout from root locale layout
- Route group `(frontend)` keeps URLs clean
- Prepares structure for page migration

**Technical Implementation**:

```typescript
// src/app/[locale]/(frontend)/layout.tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import './styles.css'

export const metadata: Metadata = {
  description: 'A Payload CMS blog with i18n support.',
  title: 'sebc.dev',
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <main>{children}</main>
}
```

**Note**: The `./styles.css` import will temporarily fail until Commit 4. This is expected.

**Technical Validation**:

```bash
# TypeScript check (may warn about missing styles.css, that's OK)
pnpm exec tsc --noEmit
pnpm lint
```

**Review Criteria**:

- [ ] Uses route group `(frontend)` for URL structure
- [ ] Calls `setRequestLocale()` for static rendering
- [ ] Has basic metadata (not fully i18n yet)
- [ ] Wraps children in semantic `<main>` element
- [ ] Uses Next.js 15 async `params` pattern

---

### Commit 3: Migrate HomePage to [locale]/(frontend)/page.tsx

**Files**:
- `src/app/[locale]/(frontend)/page.tsx` (create)

**Size**: ~60 lines
**Duration**: 30-40 min (implementation) + 15 min (review)

**Content**:

- Create page at `src/app/[locale]/(frontend)/page.tsx`
- Copy content from existing `src/app/(frontend)/page.tsx`
- Add `setRequestLocale()` for static rendering
- Update any relative imports if needed
- Add `locale` parameter handling

**Why it's atomic**:

- Single responsibility: homepage migration
- Can be validated by visiting `/fr` and `/en`
- Original file preserved for comparison

**Technical Implementation**:

```typescript
// src/app/[locale]/(frontend)/page.tsx
import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { setRequestLocale } from 'next-intl/server'

import config from '@/payload.config'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/[locale]/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

**Review Criteria**:

- [ ] Page structure matches original
- [ ] `setRequestLocale()` called at start
- [ ] Uses Next.js 15 async `params` pattern
- [ ] File path in footer updated to new location
- [ ] No broken imports
- [ ] Payload integration preserved

---

### Commit 4: Move styles.css to New Location

**Files**:
- `src/app/[locale]/(frontend)/styles.css` (create/copy)

**Size**: ~100 lines (existing file)
**Duration**: 10-15 min (implementation) + 5 min (review)

**Content**:

- Copy `src/app/(frontend)/styles.css` to `src/app/[locale]/(frontend)/styles.css`
- Verify import in `layout.tsx` works
- No modifications to CSS content

**Why it's atomic**:

- Single responsibility: styles migration
- Enables full validation of new structure
- Original file kept for comparison

**Technical Validation**:

```bash
# TypeScript should now pass without style import warnings
pnpm exec tsc --noEmit
pnpm lint

# Start dev server and verify styles apply
pnpm dev
# Visit http://localhost:3000/fr - should have styles
```

**Review Criteria**:

- [ ] CSS file copied exactly (no modifications)
- [ ] Import in layout.tsx resolves correctly
- [ ] Styles apply when visiting /fr or /en
- [ ] No CSS parsing errors in browser console

---

### Commit 5: Clean Up Old Files and Verify Routes

**Files**:
- `src/app/(frontend)/layout.tsx` (delete)
- `src/app/(frontend)/page.tsx` (delete)
- `src/app/(frontend)/styles.css` (delete)
- `src/app/(frontend)/` directory (delete if empty)

**Size**: Deletions only
**Duration**: 15-20 min (implementation) + 10 min (review)

**Content**:

- Delete `src/app/(frontend)/layout.tsx`
- Delete `src/app/(frontend)/page.tsx`
- Delete `src/app/(frontend)/styles.css`
- Remove empty `(frontend)` directory
- Run full validation suite

**Why it's atomic**:

- Final cleanup after migration verified
- Easy to revert if issues found
- Clear commit history shows migration complete

**Technical Validation**:

```bash
# Full validation suite
pnpm exec tsc --noEmit
pnpm lint
pnpm build

# Manual testing
pnpm dev
# Test routes:
# - http://localhost:3000/ → redirects to /fr
# - http://localhost:3000/fr → French homepage with styles
# - http://localhost:3000/en → English homepage with styles
# - http://localhost:3000/admin → Payload admin (unchanged)
# - Check <html lang="fr"> or <html lang="en"> in DevTools
```

**Review Criteria**:

- [ ] All old files deleted
- [ ] No orphaned files in old directory
- [ ] Build succeeds
- [ ] All routes work correctly
- [ ] Admin panel accessible
- [ ] No 404 errors

---

## Implementation Workflow

### Step-by-Step

1. **Verify prerequisites**: Phase 1 & 2 complete, middleware working
2. **Implement Commit 1**: Create [locale] root layout
3. **Validate Commit 1**: TypeScript + lint
4. **Commit Commit 1**: Use provided commit message
5. **Implement Commit 2**: Create [locale]/(frontend) layout
6. **Validate Commit 2**: TypeScript + lint
7. **Commit Commit 2**: Use provided commit message
8. **Implement Commit 3**: Migrate homepage
9. **Validate Commit 3**: TypeScript + lint
10. **Commit Commit 3**: Use provided commit message
11. **Implement Commit 4**: Move styles.css
12. **Validate Commit 4**: TypeScript + lint + dev server
13. **Commit Commit 4**: Use provided commit message
14. **Implement Commit 5**: Delete old files
15. **Validate Commit 5**: TypeScript + lint + build + manual test
16. **Commit Commit 5**: Use provided commit message
17. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After each commit:

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint
```

After Commit 4 and 5:

```bash
# Build check
pnpm build

# Manual test
pnpm dev
```

---

## Commit Metrics

| Commit | Files | Lines | Implementation | Review | Total |
|--------|-------|-------|----------------|--------|-------|
| 1. Root layout | 1 | ~50 | 40 min | 15 min | 55 min |
| 2. Frontend layout | 1 | ~25 | 30 min | 10 min | 40 min |
| 3. HomePage | 1 | ~60 | 40 min | 15 min | 55 min |
| 4. Styles | 1 | ~100 | 15 min | 5 min | 20 min |
| 5. Cleanup | 3 | -150 | 20 min | 10 min | 30 min |
| **TOTAL** | **7** | **~85 net** | **2.5h** | **55min** | **~3.5h** |

---

## Atomic Approach Benefits

### For Developers

- **Low risk** - Each commit is reversible
- **Clear progress** - 5 milestones to track
- **Testable** - Validate at each step

### For Reviewers

- **Focused review** - Each commit has single purpose
- **Quick feedback** - 5-15 min per commit
- **Easy to spot issues** - Less code to review

### For the Project

- **Safe migration** - Old files deleted only after verified
- **Clear history** - Git shows migration steps
- **Rollback-ready** - Any commit can be reverted

---

## Directory Structure

### Before Phase 3

```
src/app/
├── (frontend)/
│   ├── layout.tsx      # Root layout with <html>
│   ├── page.tsx        # HomePage
│   └── styles.css      # Frontend styles
└── (payload)/
    ├── admin/
    └── api/
```

### After Phase 3

```
src/app/
├── [locale]/
│   ├── layout.tsx      # NextIntlClientProvider + <html lang>
│   └── (frontend)/
│       ├── layout.tsx  # Frontend layout with <main>
│       ├── page.tsx    # HomePage
│       └── styles.css  # Frontend styles
└── (payload)/          # Unchanged
    ├── admin/
    └── api/
```

---

## Commit Messages

### Commit 1

```
feat(i18n): add [locale] root layout with NextIntlClientProvider

- Create src/app/[locale]/layout.tsx
- Add NextIntlClientProvider for client-side translations
- Configure generateStaticParams for fr/en locales
- Set dynamic <html lang={locale}> attribute
- Use Next.js 15 async params pattern

Part of Phase 3 - Commit 1/5
```

### Commit 2

```
feat(i18n): add [locale]/(frontend) layout

- Create src/app/[locale]/(frontend)/layout.tsx
- Migrate frontend layout structure from (frontend)
- Add setRequestLocale for static rendering
- Configure basic metadata

Part of Phase 3 - Commit 2/5
```

### Commit 3

```
feat(i18n): migrate homepage to [locale]/(frontend)

- Create src/app/[locale]/(frontend)/page.tsx
- Copy homepage content from old location
- Add locale param handling with setRequestLocale
- Update file path reference in footer

Part of Phase 3 - Commit 3/5
```

### Commit 4

```
chore(i18n): move styles.css to [locale]/(frontend)

- Copy styles.css to new location
- Verify import in layout.tsx works
- No CSS content changes

Part of Phase 3 - Commit 4/5
```

### Commit 5

```
chore(i18n): remove old (frontend) directory

- Delete src/app/(frontend)/layout.tsx
- Delete src/app/(frontend)/page.tsx
- Delete src/app/(frontend)/styles.css
- Remove empty (frontend) directory
- Verify all routes work correctly

Part of Phase 3 - Commit 5/5
```

---

## Technical Notes

### Next.js 15 Async Params

Next.js 15 uses async params in layouts and pages:

```typescript
// Correct pattern for Next.js 15
export default async function Layout({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // ...
}
```

### generateStaticParams

Required for static generation of locale paths:

```typescript
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

### setRequestLocale

Must be called in every layout and page for static rendering:

```typescript
import { setRequestLocale } from 'next-intl/server'

export default async function Page({ params }) {
  const { locale } = await params
  setRequestLocale(locale) // Call at the top
  // ...
}
```

### Cloudflare Workers Compatibility

- `next-intl` is edge-compatible
- No Node.js-only APIs used in layouts/pages
- Static generation reduces Worker execution time

---

## FAQ

**Q: Can I combine Commit 4 and 5?**
A: No. Keep them separate for safer rollback if styles don't apply correctly.

**Q: What if I get 404 errors during migration?**
A: Expected until Commit 4/5. The middleware redirects to `/fr/*` but pages may not exist yet.

**Q: Should I test after every commit?**
A: TypeScript + lint after every commit. Full manual test after Commit 4 and 5.

**Q: What if build fails after Commit 5?**
A: Check for:
- Missing `setRequestLocale` calls
- Wrong imports in new files
- Missing `generateStaticParams` in root layout

**Q: Why not delete old files in Commit 1?**
A: Risky. Keep originals for reference and easy rollback until migration is verified.
