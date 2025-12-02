# Phase 3 - Commit Checklist

Detailed checklist for each of the 5 atomic commits in Phase 3.

---

## Commit 1: Create [locale] Root Layout with NextIntlClientProvider

### Pre-Commit Checklist

- [ ] Phase 1 and Phase 2 are complete and validated
- [ ] `src/i18n/config.ts` exists with locale definitions
- [ ] `src/i18n/routing.ts` exists with routing config
- [ ] `src/i18n/request.ts` exists with request config
- [ ] `middleware.ts` is working (test by visiting `/`)
- [ ] `messages/fr.json` and `messages/en.json` exist

### Implementation Steps

1. **Create directory structure**

```bash
mkdir -p src/app/[locale]
```

2. **Create the root locale layout**

Create file: `src/app/[locale]/layout.tsx`

```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'

/**
 * Generate static params for all supported locales.
 * This enables static generation for /fr and /en paths.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Root layout for locale-specific routes.
 *
 * Provides:
 * - NextIntlClientProvider for client-side translations
 * - Dynamic <html lang> attribute
 * - Static rendering support via setRequestLocale
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate the locale parameter
  if (!isValidLocale(locale)) {
    notFound()
  }

  // Enable static rendering for this locale
  setRequestLocale(locale)

  // Load messages for the current locale
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

3. **Validate TypeScript**

```bash
pnpm exec tsc --noEmit
```

4. **Validate linting**

```bash
pnpm lint
```

### Post-Commit Checklist

- [ ] File `src/app/[locale]/layout.tsx` exists
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] `generateStaticParams` exports both `fr` and `en`
- [ ] `setRequestLocale` is called
- [ ] `NextIntlClientProvider` wraps children
- [ ] `<html lang={locale}>` is dynamic
- [ ] Invalid locales trigger `notFound()`

### Commit Message

```
feat(i18n): add [locale] root layout with NextIntlClientProvider

- Create src/app/[locale]/layout.tsx
- Add NextIntlClientProvider for client-side translations
- Configure generateStaticParams for fr/en locales
- Set dynamic <html lang={locale}> attribute
- Use Next.js 15 async params pattern

Part of Phase 3 - Commit 1/5
```

---

## Commit 2: Create [locale]/(frontend) Layout

### Pre-Commit Checklist

- [ ] Commit 1 is complete and pushed
- [ ] `src/app/[locale]/layout.tsx` exists
- [ ] TypeScript still compiles

### Implementation Steps

1. **Create directory structure**

```bash
mkdir -p src/app/[locale]/\(frontend\)
```

2. **Create the frontend layout**

Create file: `src/app/[locale]/(frontend)/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import './styles.css'

/**
 * Metadata for frontend pages.
 * Basic metadata - full i18n metadata comes in Story 6.x
 */
export const metadata: Metadata = {
  description: 'A Payload CMS blog with i18n support.',
  title: 'sebc.dev',
}

/**
 * Frontend layout for locale-specific routes.
 *
 * This layout:
 * - Applies frontend-specific styles
 * - Wraps content in semantic <main> element
 * - Enables static rendering via setRequestLocale
 */
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

**Note**: The `./styles.css` import will cause a TypeScript warning until Commit 4. This is expected and acceptable.

3. **Validate TypeScript** (warning about styles.css is OK)

```bash
pnpm exec tsc --noEmit
```

4. **Validate linting**

```bash
pnpm lint
```

### Post-Commit Checklist

- [ ] File `src/app/[locale]/(frontend)/layout.tsx` exists
- [ ] TypeScript compiles (styles.css warning is OK)
- [ ] ESLint passes
- [ ] `setRequestLocale` is called
- [ ] Uses route group `(frontend)`
- [ ] Basic metadata is set
- [ ] Content wrapped in `<main>`

### Commit Message

```
feat(i18n): add [locale]/(frontend) layout

- Create src/app/[locale]/(frontend)/layout.tsx
- Migrate frontend layout structure from (frontend)
- Add setRequestLocale for static rendering
- Configure basic metadata

Part of Phase 3 - Commit 2/5
```

---

## Commit 3: Migrate HomePage to [locale]/(frontend)/page.tsx

### Pre-Commit Checklist

- [ ] Commit 2 is complete and pushed
- [ ] `src/app/[locale]/(frontend)/layout.tsx` exists
- [ ] Original `src/app/(frontend)/page.tsx` exists for reference

### Implementation Steps

1. **Create the homepage**

Create file: `src/app/[locale]/(frontend)/page.tsx`

```typescript
import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { setRequestLocale } from 'next-intl/server'

import config from '@/payload.config'

/**
 * Homepage component with locale support.
 *
 * Migrated from src/app/(frontend)/page.tsx with added:
 * - Locale parameter handling
 * - Static rendering via setRequestLocale
 */
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

2. **Validate TypeScript**

```bash
pnpm exec tsc --noEmit
```

3. **Validate linting**

```bash
pnpm lint
```

### Post-Commit Checklist

- [ ] File `src/app/[locale]/(frontend)/page.tsx` exists
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] `setRequestLocale` is called at the start
- [ ] Uses Next.js 15 async params pattern
- [ ] Footer file path updated to new location
- [ ] Payload integration preserved (auth, config)
- [ ] Image component used correctly
- [ ] All imports resolved

### Commit Message

```
feat(i18n): migrate homepage to [locale]/(frontend)

- Create src/app/[locale]/(frontend)/page.tsx
- Copy homepage content from old location
- Add locale param handling with setRequestLocale
- Update file path reference in footer

Part of Phase 3 - Commit 3/5
```

---

## Commit 4: Move styles.css to New Location

### Pre-Commit Checklist

- [ ] Commit 3 is complete and pushed
- [ ] `src/app/(frontend)/styles.css` exists (original)
- [ ] `src/app/[locale]/(frontend)/layout.tsx` imports `./styles.css`

### Implementation Steps

1. **Copy styles.css to new location**

```bash
cp src/app/\(frontend\)/styles.css src/app/[locale]/\(frontend\)/styles.css
```

2. **Validate TypeScript** (no more styles.css warning)

```bash
pnpm exec tsc --noEmit
```

3. **Validate linting**

```bash
pnpm lint
```

4. **Test in development** (important for this commit)

```bash
pnpm dev
```

Open browser:
- Navigate to `http://localhost:3000/fr`
- Verify styles are applied (background, fonts, layout)
- Navigate to `http://localhost:3000/en`
- Verify styles are applied

### Post-Commit Checklist

- [ ] File `src/app/[locale]/(frontend)/styles.css` exists
- [ ] TypeScript compiles without warnings
- [ ] ESLint passes
- [ ] Dev server starts without errors
- [ ] Styles apply on `/fr` route
- [ ] Styles apply on `/en` route
- [ ] No CSS errors in browser console

### Commit Message

```
chore(i18n): move styles.css to [locale]/(frontend)

- Copy styles.css to new location
- Verify import in layout.tsx works
- No CSS content changes

Part of Phase 3 - Commit 4/5
```

---

## Commit 5: Clean Up Old Files and Verify Routes

### Pre-Commit Checklist

- [ ] Commit 4 is complete and pushed
- [ ] Dev server tested with `/fr` and `/en` routes
- [ ] Styles apply correctly
- [ ] Original files still exist (for comparison if needed)

### Implementation Steps

1. **Delete old layout.tsx**

```bash
rm src/app/\(frontend\)/layout.tsx
```

2. **Delete old page.tsx**

```bash
rm src/app/\(frontend\)/page.tsx
```

3. **Delete old styles.css**

```bash
rm src/app/\(frontend\)/styles.css
```

4. **Remove empty directory**

```bash
rmdir src/app/\(frontend\)
```

5. **Validate TypeScript**

```bash
pnpm exec tsc --noEmit
```

6. **Validate linting**

```bash
pnpm lint
```

7. **Validate build**

```bash
pnpm build
```

8. **Full manual testing**

```bash
pnpm dev
```

Test all routes:

| Route | Expected Behavior |
|-------|------------------|
| `http://localhost:3000/` | Redirects to `/fr` |
| `http://localhost:3000/fr` | French homepage with styles |
| `http://localhost:3000/en` | English homepage with styles |
| `http://localhost:3000/admin` | Payload admin panel (unchanged) |

Check in browser DevTools:
- `http://localhost:3000/fr` → `<html lang="fr">`
- `http://localhost:3000/en` → `<html lang="en">`

### Post-Commit Checklist

- [ ] `src/app/(frontend)/layout.tsx` deleted
- [ ] `src/app/(frontend)/page.tsx` deleted
- [ ] `src/app/(frontend)/styles.css` deleted
- [ ] `src/app/(frontend)/` directory removed
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds (`pnpm build`)
- [ ] `/` redirects to `/fr`
- [ ] `/fr` shows homepage with styles
- [ ] `/en` shows homepage with styles
- [ ] `/admin` shows Payload admin
- [ ] `<html lang>` is dynamic

### Commit Message

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

## Quick Reference

### Commit Summary

| # | Description | Files | Key Validation |
|---|-------------|-------|----------------|
| 1 | Root locale layout | 1 create | TypeScript, lint |
| 2 | Frontend layout | 1 create | TypeScript, lint |
| 3 | HomePage migration | 1 create | TypeScript, lint |
| 4 | Styles migration | 1 copy | Dev server, visual |
| 5 | Cleanup | 3 delete | Build, all routes |

### Commands Reference

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Build check
pnpm build

# Dev server
pnpm dev

# Create directories
mkdir -p src/app/[locale]/\(frontend\)

# Copy styles
cp src/app/\(frontend\)/styles.css src/app/[locale]/\(frontend\)/styles.css

# Delete old files
rm src/app/\(frontend\)/layout.tsx
rm src/app/\(frontend\)/page.tsx
rm src/app/\(frontend\)/styles.css
rmdir src/app/\(frontend\)
```

---

## Troubleshooting

### TypeScript Errors

**Error**: Cannot find module './styles.css'
**When**: After Commit 2, before Commit 4
**Solution**: Expected. Will be fixed in Commit 4.

**Error**: Parameter 'locale' implicitly has 'any' type
**Solution**: Ensure proper typing: `params: Promise<{ locale: string }>`

**Error**: Property 'locale' does not exist on type 'Promise'
**Solution**: Use `const { locale } = await params`

### Build Errors

**Error**: `generateStaticParams` not found
**Solution**: Ensure export in `src/app/[locale]/layout.tsx`

**Error**: Module not found: @/i18n/...
**Solution**: Check tsconfig.json paths and file locations

### Runtime Errors

**Error**: 404 on /fr or /en
**Solution**: Verify files are in correct `[locale]` directory

**Error**: Styles not applying
**Solution**: Check `styles.css` is in correct location and imported

**Error**: Admin panel broken
**Solution**: Verify `/admin` not affected by `[locale]` segment (should be outside it)
