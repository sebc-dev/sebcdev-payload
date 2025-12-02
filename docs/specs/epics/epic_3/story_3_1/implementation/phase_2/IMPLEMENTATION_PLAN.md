# Phase 2 - Implementation Plan

## Overview

Phase 2 implements the middleware layer for locale detection and routing. This is a **critical phase** that determines how the application handles language preferences across sessions.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│ Browser Request                                     │
├─────────────────────────────────────────────────────┤
│ 1. Client makes request to /                       │
│ 2. Middleware intercepts (matcher route)           │
│ 3. Check NEXT_LOCALE cookie                        │
│ 4. If no cookie: parse Accept-Language header      │
│ 5. Determine locale (cookie > Accept-Language)     │
│ 6. Set/refresh NEXT_LOCALE cookie                  │
│ 7. Redirect to /fr or /en                          │
└─────────────────────────────────────────────────────┘
```

---

## Detailed Implementation

### Commit 1: Create middleware.ts with Locale Detection

**Purpose**: Implement the core middleware that detects locale preferences.

**Key Implementation Details**:

1. **Locale Detection Logic**:
   - First check: `NEXT_LOCALE` cookie (returning visitors)
   - Second check: `Accept-Language` header (new visitors)
   - Fallback: Default locale ('fr')

2. **Cookie Handling**:
   - Cookie name: `NEXT_LOCALE`
   - Max age: 1 year (31536000 seconds)
   - Path: `/`
   - SameSite: Lax (works with redirects)

3. **Route Matching**:
   - Included routes: root path `/` and any non-localized paths
   - Excluded routes: `/api/*`, `/admin/*`, `/_next/*`, static files

4. **Redirection**:
   - Root path `/` redirects to `/{locale}`
   - Sets response headers with new locale
   - Returns Response object to Next.js

**Example Implementation**:

```typescript
// middleware.ts
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
 * Sets NEXT_LOCALE cookie for persistence across sessions
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Get locale from cookie (returning visitors)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  let locale = defaultLocale

  // Priority 1: Use cookie if valid
  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale
  } else {
    // Priority 2: Parse Accept-Language header
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

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /admin (Payload admin)
    // - /_next (Next.js internals)
    // - /.*\\..* (files with extensions)
    '/((?!api|admin|_next|.*\\..*).*)',
  ],
}
```

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm lint
```

---

### Commit 2: Update src/i18n/routing.ts with Matcher Config

**Purpose**: Update routing config to export matcher pattern for consistency.

**Changes**:

1. Add matcher pattern as named export
2. Add JSDoc comments explaining matcher logic
3. Ensure matcher matches middleware config

**Example**:

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

/**
 * Middleware matcher configuration
 *
 * Only matches frontend routes, excluding:
 * - /api/* - API routes
 * - /admin/* - Payload admin panel
 * - /_next/* - Next.js internals
 * - Static files (.*\..*)
 */
export const middlewareMatcher = [
  '/((?!api|admin|_next|.*\\..*).*)',
]

// Re-export for convenience
export type { Locale } from './config'
```

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm lint
```

---

### Commit 3: Update next.config.ts for i18n Integration

**Purpose**: Configure Next.js to work with next-intl and middleware.

**Changes**:

1. Import next-intl plugin if needed
2. Add i18n configuration to nextConfig
3. Ensure compatibility with Cloudflare deployment

**Note**: In most cases, next-intl works with middleware without explicit next.config.ts changes. However, we may need to add configuration for plugin initialization.

**Example**:

```typescript
// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload'
import { createNextIntlPlugin } from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
)

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

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
```

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm build
```

---

## Testing Strategy

### Manual Testing (Before Commits)

1. **Test middleware locally**:
   ```bash
   pnpm dev
   ```

2. **Test locale detection**:
   - Visit `http://localhost:3000/` - should redirect to `/fr` (default)
   - Check browser DevTools: Application > Cookies > NEXT_LOCALE should be set to 'fr'

3. **Test browser preference**:
   - Change browser language to English
   - Clear `NEXT_LOCALE` cookie
   - Visit `http://localhost:3000/` - should redirect to `/en`
   - Check DevTools: NEXT_LOCALE should be 'en'

4. **Test cookie persistence**:
   - Set NEXT_LOCALE to 'en'
   - Visit `http://localhost:3000/` - should redirect to `/en`
   - Change browser language to French
   - Visit `http://localhost:3000/` - should still go to `/en` (cookie takes priority)

5. **Test route exclusions**:
   - Visit `/api/test` - should NOT redirect
   - Visit `/admin` - should NOT redirect
   - Visit `/_next/static/file.js` - should NOT redirect

6. **Test performance**:
   - Monitor middleware execution time in network tab
   - Should be < 50ms

### Code Quality Validation

```bash
# TypeScript
pnpm exec tsc --noEmit

# ESLint + Prettier
pnpm lint

# Full build (validates Next.js integration)
pnpm build

# Preview (simulates Cloudflare deployment)
pnpm preview
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Infinite Redirect Loop

**Symptom**: Browser keeps redirecting infinitely

**Cause**: Middleware redirects to `/fr` but then matches again and redirects

**Solution**:
```typescript
// Check if pathname already has locale
const pathnameHasLocale = routing.locales.some(
  (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
)
if (pathnameHasLocale) {
  return NextResponse.next() // Don't redirect if already localized
}
```

### Pitfall 2: /admin Accessible as /fr/admin

**Symptom**: User can access `/fr/admin` instead of just `/admin`

**Cause**: Middleware matcher too broad

**Solution**:
```typescript
// Explicit admin exclusion in matcher
matcher: ['/((?!api|admin|_next|.*\\..*).*)',]
```

### Pitfall 3: Cookie Not Persisting

**Symptom**: NEXT_LOCALE cookie disappears

**Cause**: Cookie settings (sameSite, path) incorrect

**Solution**:
```typescript
response.cookies.set('NEXT_LOCALE', locale, {
  maxAge: 31536000, // 1 year
  path: '/',        // Root path
  sameSite: 'lax',  // Allow redirects
})
```

### Pitfall 4: Next.js Plugin Conflicts

**Symptom**: Build fails or types error

**Cause**: Plugin order or missing configuration

**Solution**: Wrap withPayload with withNextIntl:
```typescript
export default withNextIntl(
  withPayload(nextConfig, { devBundleServerPackages: false })
)
```

---

## Performance Considerations

### Bundle Size Impact

- Middleware code: ~2KB uncompressed
- next-intl: ~15KB gzipped (already in Phase 1)
- Total impact: Minimal

### Execution Time

Target: < 50ms (Cloudflare Workers requirement)

Expected breakdown:
- Cookie read: ~0.5ms
- Accept-Language parse: ~1ms
- Locale validation: ~0.1ms
- Redirect response: ~0.5ms

**Total**: ~2-5ms (well under 50ms budget)

---

## Cloudflare Workers Compatibility

### Verification

1. **No Node.js APIs**: ✅ Uses only Web APIs
2. **Edge-compatible**: ✅ next-intl middleware pattern is edge-compatible
3. **Bundle size**: ✅ Middleware code < 5KB
4. **Execution time**: ✅ < 50ms requirement easily met

### Testing on Cloudflare

```bash
# Preview deployment
pnpm preview

# Test middleware behavior on Cloudflare preview
# Verify Accept-Language detection works
# Verify cookie persistence works
```

---

## Files Summary

| File | Action | Type | Impact |
|------|--------|------|--------|
| `middleware.ts` | Create | New | Core implementation |
| `src/i18n/routing.ts` | Modify | Enhancement | Add matcher export |
| `next.config.ts` | Modify | Enhancement | Add next-intl plugin |

---

## Rollback Strategy

If Phase 2 has issues:

1. Delete `middleware.ts`
2. Revert `src/i18n/routing.ts` to Phase 1 version
3. Revert `next.config.ts` to Phase 1 version
4. Run `pnpm install` to clear cache

This safely reverts to Phase 1 state without affecting Phase 1 files.

---

## Success Metrics

After Phase 2 completion:

- [ ] All 3 commits implemented
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] Middleware detects locale from cookie
- [ ] Middleware detects locale from Accept-Language
- [ ] Redirect works without loops
- [ ] /admin routes unaffected
- [ ] /api routes unaffected
- [ ] Cookie persists for 1 year

---

## Next Phase

Phase 3 will restructure the app directory to add the `[locale]` dynamic segment and move frontend routes under it. Phase 2 must be complete and working before starting Phase 3.

---

## References

- [next-intl Middleware Docs](https://next-intl.dev/docs/routing/middleware)
- [Next.js Middleware Guide](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Cloudflare Workers Limitations](https://developers.cloudflare.com/workers/)
- [Accept-Language Header RFC](https://tools.ietf.org/html/rfc7231#section-5.3.5)
