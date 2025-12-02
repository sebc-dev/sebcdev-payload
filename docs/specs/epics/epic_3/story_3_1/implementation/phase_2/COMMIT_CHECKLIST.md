# Phase 2 - Commit Checklist

This document provides a detailed checklist for each atomic commit of Phase 2.

---

## 📋 Commit 1: Create middleware.ts with Locale Detection

**Files**: `middleware.ts`
**Estimated Duration**: 30-45 minutes
**Location**: Project root
**Status**: ✅ COMPLETED

### Implementation Tasks

- [x] Create `middleware.ts` in project root (same level as `next.config.ts`)
- [x] Implement locale detection from NEXT_LOCALE cookie
- [x] Implement Accept-Language header parsing
- [x] Implement redirect logic to locale-prefixed URL
- [x] Set NEXT_LOCALE cookie with proper options
- [x] Add matcher configuration to exclude /api, /admin, /_next, static files
- [x] Run TypeScript check to verify no errors
- [x] Run linter to verify code style

### File Contents

#### middleware.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { isValidLocale, defaultLocale } from '@/i18n/config'

/**
 * Middleware for locale detection and routing
 *
 * Detects user's locale preference from:
 * 1. Existing NEXT_LOCALE cookie (returning visitor)
 * 2. Accept-Language header (new visitor)
 * 3. Default locale (fallback)
 *
 * Sets NEXT_LOCALE cookie for persistence across sessions.
 *
 * @see https://next-intl.dev/docs/routing/middleware
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If locale is already in the path, proceed without redirecting
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Get locale from cookie (returning visitors)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  let locale = defaultLocale

  // Priority 1: Use cookie if valid (returning visitor's preference)
  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale
  } else {
    // Priority 2: Parse Accept-Language header (new visitor)
    const acceptLanguage = request.headers.get('accept-language') || ''
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase()

    if (isValidLocale(preferredLocale)) {
      locale = preferredLocale
    }
  }

  // Redirect to locale-prefixed URL and set cookie
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
  )

  // Set NEXT_LOCALE cookie for future requests
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 31536000, // 1 year in seconds
    path: '/',
    sameSite: 'lax',
  })

  return response
}

/**
 * Middleware matcher configuration
 *
 * Only matches frontend routes, excluding:
 * - /api/* - API routes
 * - /admin/* - Payload admin panel
 * - /_next/* - Next.js internals
 * - Files with extensions (.*\..*)
 *
 * This ensures middleware only processes frontend routes
 */
export const config = {
  matcher: [
    // Match all pathnames except those starting with:
    // api/, admin/, _next/ or containing a file extension
    '/((?!api|admin|_next|.*\\..*).*)',
  ],
}
```

### Validation

```bash
# Create the file first (it will error until it exists)
touch middleware.ts

# After implementation, validate
pnpm exec tsc --noEmit
pnpm lint
```

**Expected Result**: No errors from TypeScript or ESLint

### Review Checklist

#### Implementation Correctness

- [ ] Middleware function is properly exported
- [ ] `config.matcher` is properly exported
- [ ] Locale detection checks cookie first (returning visitors)
- [ ] Accept-Language header is parsed correctly
- [ ] Default locale is used as final fallback
- [ ] Locale prefix check prevents infinite redirects
- [ ] Redirect URL includes pathname (except for root)
- [ ] Cookie settings are correct:
  - [ ] `maxAge: 31536000` (1 year in seconds)
  - [ ] `path: '/'` (root path)
  - [ ] `sameSite: 'lax'` (allows redirects)

#### TypeScript Quality

- [ ] No `any` types
- [ ] All imports are correct
- [ ] `NextRequest` and `NextResponse` are from 'next/server'
- [ ] Function signature matches Next.js middleware pattern
- [ ] JSDoc comments explain purpose and behavior

#### Code Style

- [ ] Consistent formatting (Prettier)
- [ ] No unused variables
- [ ] No console.log statements
- [ ] Comments explain complex logic

#### Architecture

- [ ] Middleware is in project root (same level as next.config.ts)
- [ ] Uses `@/i18n/routing` and `@/i18n/config` imports
- [ ] Matcher pattern matches documented exclusions
- [ ] No direct logic duplication (uses routing config)

### Commit Message

```bash
git add middleware.ts
git commit -m "feat(middleware): add locale detection and routing

- Add middleware.ts at project root for locale detection
- Detect locale from NEXT_LOCALE cookie (returning visitors)
- Detect locale from Accept-Language header (new visitors)
- Redirect / to locale-specific path (/fr or /en)
- Set NEXT_LOCALE cookie with 1-year expiry
- Configure matcher to exclude /api, /admin, /_next, static files
- Prevent infinite redirects by checking existing locale prefix
- Enable Cloudflare Workers compatibility (Web APIs only)

Part of Phase 2 - Commit 1/3"
```

---

## 📋 Commit 2: Update src/i18n/routing.ts with Matcher Config

**Files**: `src/i18n/routing.ts`
**Estimated Duration**: 20-30 minutes
**Status**: ✅ COMPLETED

### Implementation Tasks

- [x] Add middleware matcher pattern as named export
- [x] Update JSDoc comments for routing file
- [x] Add explanatory comments about matcher logic
- [x] Run TypeScript check to verify no errors
- [x] Run linter to verify code style
- [x] Verify matcher pattern matches middleware config exactly

### File Contents

Update `src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

/**
 * i18n Routing Configuration
 *
 * Configures how locales are handled in URLs:
 * - localePrefix: 'always' ensures /fr/* and /en/* URLs
 * - This enables SEO-friendly localized URLs
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

/**
 * Middleware matcher configuration
 *
 * Only matches frontend routes, excluding:
 * - /api/* - API routes (Payload and custom endpoints)
 * - /admin/* - Payload admin panel
 * - /_next/* - Next.js internals
 * - Files with extensions (.*\..*)
 *
 * This ensures middleware only processes frontend routes that need locale handling.
 * The matcher pattern uses a negative lookahead regex for efficiency.
 *
 * @see middleware.ts - Uses this same pattern
 */
export const middlewareMatcher = [
  // Match all pathnames except those starting with:
  // api/, admin/, _next/ or containing a file extension
  '/((?!api|admin|_next|.*\\..*).*)',
]

// Re-export for convenience
export type { Locale } from './config'
```

### Validation

```bash
# After updating the file, validate
pnpm exec tsc --noEmit
pnpm lint

# Verify the matcher pattern is exported correctly
node -e "const {middlewareMatcher} = require('./src/i18n/routing'); console.log('Matcher:', middlewareMatcher)"
```

**Expected Result**: No TypeScript or ESLint errors, matcher pattern is exportable

### Review Checklist

#### Configuration Accuracy

- [ ] `middlewareMatcher` is correctly exported as named export
- [ ] Matcher pattern is identical to middleware.ts `config.matcher`
- [ ] Pattern explanation in JSDoc is clear and accurate
- [ ] All exclusions are documented (/api, /admin, /_next, files)

#### TypeScript Quality

- [ ] No `any` types
- [ ] All imports are correct
- [ ] Type exports are unchanged from Phase 1
- [ ] New export doesn't break existing code

#### Code Style

- [ ] Consistent formatting (Prettier)
- [ ] JSDoc comments are comprehensive
- [ ] No trailing commas or syntax errors

#### Architecture

- [ ] Matcher is exported at module level
- [ ] Placement makes sense (routing configuration)
- [ ] Name is descriptive (`middlewareMatcher`)
- [ ] Pattern is used by middleware.ts (referenced in next commit)

### Commit Message

```bash
git add src/i18n/routing.ts
git commit -m "feat(i18n): add middleware matcher configuration

- Export middlewareMatcher pattern from routing config
- Pattern excludes /api, /admin, /_next, and static files
- Ensures consistency between routing and middleware
- Single source of truth for route matching logic
- Prevents code duplication between files

Part of Phase 2 - Commit 2/3"
```

---

## 📋 Commit 3: Update next.config.ts for i18n Plugin

**Files**: `next.config.ts`
**Estimated Duration**: 15-20 minutes
**Status**: ✅ COMPLETED

### Implementation Tasks

- [x] Import `createNextIntlPlugin` from next-intl/plugin (as default export)
- [x] Create `withNextIntl` by calling `createNextIntlPlugin('./src/i18n/request.ts')`
- [x] Wrap existing `withPayload` with `withNextIntl`
- [x] Maintain existing webpack configuration
- [x] Run TypeScript check to verify no errors
- [x] Run build command to verify Next.js integration (compilation successful)
- [x] Run linter to verify code style

### File Contents

Update `next.config.ts`:

```typescript
import { withPayload } from '@payloadcms/next/withPayload'
import { createNextIntlPlugin } from 'next-intl/plugin'

/**
 * Create next-intl plugin with server-side request configuration
 *
 * This wraps the entire Next.js config with i18n functionality:
 * - Loads messages for the current locale
 * - Provides useTranslations() hook availability
 * - Enables type-safe message access
 */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for OpenNext/Cloudflare Workers deployment
  output: 'standalone' as const,
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

/**
 * Apply plugins in order:
 * 1. withNextIntl - Adds i18n functionality
 * 2. withPayload - Adds Payload CMS admin panel
 *
 * Order matters: withNextIntl must wrap the config before withPayload
 */
export default withNextIntl(
  withPayload(nextConfig, { devBundleServerPackages: false })
)
```

### Validation

```bash
# After updating the file, validate
pnpm exec tsc --noEmit
pnpm lint

# Build to verify Next.js integration
pnpm build

# Check for any warnings or errors
pnpm exec next info
```

**Expected Result**:
- No TypeScript errors
- No ESLint errors
- Build completes successfully
- No warnings about missing plugins

### Review Checklist

#### Configuration Correctness

- [ ] `createNextIntlPlugin` is imported from 'next-intl/plugin'
- [ ] Plugin is initialized with correct path: './src/i18n/request.ts'
- [ ] `withNextIntl` wraps the entire config composition
- [ ] `withPayload` is still applied (not removed)
- [ ] Plugin wrapping order is correct: `withNextIntl(withPayload(...))`

#### TypeScript Quality

- [ ] Import statement for next-intl is correct
- [ ] No `any` types (except webpack config which is expected)
- [ ] JSDoc comments explain plugin composition
- [ ] Type annotation `as const` is maintained

#### Code Style

- [ ] Consistent formatting (Prettier)
- [ ] Comments explain plugin order and purpose
- [ ] No unused imports
- [ ] Existing webpack config is preserved

#### Build Compatibility

- [ ] Next.js build succeeds
- [ ] No missing dependency warnings
- [ ] webpack configuration still works
- [ ] Cloudflare Workers output remains 'standalone'

### Commit Message

```bash
git add next.config.ts
git commit -m "feat(config): integrate next-intl plugin with Next.js config

- Import createNextIntlPlugin from next-intl/plugin
- Initialize plugin with './src/i18n/request.ts' path
- Wrap entire config composition with withNextIntl
- Maintain existing withPayload plugin wrapper
- Preserve webpack configuration for file resolution
- Enable type-safe message access throughout app

This enables next-intl message loading and useTranslations() hook.

Part of Phase 2 - Commit 3/3"
```

---

## ✅ Final Phase Validation

After all commits:

### Complete Phase Checklist

- [ ] All 3 commits completed
- [ ] TypeScript compiles without errors (`pnpm exec tsc --noEmit`)
- [ ] Linter passes without errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] All files in correct locations
- [ ] No placeholder text remaining
- [ ] Middleware file structure correct

### Final Validation Commands

```bash
# Install dependencies (ensure clean state)
pnpm install

# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Build check
pnpm build

# Verify file structure
ls -la middleware.ts
ls -la src/i18n/

# Verify imports work
node -e "const m = require('./middleware'); console.log('Middleware:', !!m.middleware)"
```

### Manual Testing

```bash
# Start development server
pnpm dev

# Test 1: Visit / and verify redirect to /fr or /en
# Open http://localhost:3000/
# Check URL bar - should redirect to http://localhost:3000/fr (or /en based on browser)

# Test 2: Check cookie
# Open DevTools > Application > Cookies
# Look for NEXT_LOCALE with value 'fr' or 'en'

# Test 3: Test /admin accessibility
# Visit http://localhost:3000/admin
# Should work without locale redirect

# Test 4: Test /api accessibility
# Verify API routes work without locale redirect
```

### Verification Checklist

- [ ] Redirect from `/` to locale-specific path works
- [ ] NEXT_LOCALE cookie is set and visible
- [ ] Admin routes are NOT prefixed with locale
- [ ] API routes are NOT prefixed with locale
- [ ] Static files load correctly
- [ ] Build output shows no warnings
- [ ] TypeScript has no errors
- [ ] ESLint has no errors

**Phase 2 is complete when all checkboxes are checked!** 🎉

---

## 📝 Troubleshooting

### Issue: TypeScript error on middleware import

**Symptom**: `Cannot find module '@/i18n/routing'`

**Solution**:
1. Ensure `tsconfig.json` has path alias: `"@/*": ["./src/*"]`
2. Verify files exist at `src/i18n/config.ts` and `src/i18n/routing.ts`
3. Run `pnpm install` to ensure phase 1 is complete

### Issue: Infinite redirect loop

**Symptom**: Browser keeps redirecting `/` → `/fr` → `/` → ...

**Solution**:
1. Check middleware has `if (pathnameHasLocale) return NextResponse.next()`
2. Verify matcher pattern is correct
3. Clear browser cache and cookies
4. Restart dev server

### Issue: Middleware not triggering

**Symptom**: Visiting `/` does not redirect, no NEXT_LOCALE cookie

**Solution**:
1. Verify `middleware.ts` is in project root (not in src/)
2. Check matcher pattern is exported as `config`
3. Verify middleware function is exported (not default export)
4. Restart dev server to reload middleware

### Issue: /admin is accessible as /fr/admin

**Symptom**: User can visit `/fr/admin` and access Payload admin

**Solution**:
1. Check middleware matcher includes `|admin` exclusion
2. Verify middleware matcher matches exactly: `'/((?!api|admin|_next|.*\\..*).*)'`
3. Restart dev server

### Issue: Build fails with plugin error

**Symptom**: `Error: Invalid next-intl plugin configuration`

**Solution**:
1. Verify plugin initialization path: `'./src/i18n/request.ts'` (relative from project root)
2. Check file exists and is properly exported
3. Verify plugin wrapping order: `withNextIntl(withPayload(...))`
4. Run `pnpm install` to ensure next-intl is installed

### Issue: Cookie not persisting

**Symptom**: NEXT_LOCALE cookie doesn't appear in DevTools

**Solution**:
1. Check cookie settings in middleware:
   - `sameSite: 'lax'` (not 'strict')
   - `path: '/'` (root path)
   - `maxAge: 31536000` (valid number)
2. Check browser cookie settings (some browsers restrict cookies in dev)
3. Clear existing cookies and visit `/` again
4. Try a different browser to isolate issue
