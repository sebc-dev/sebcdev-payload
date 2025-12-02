# Implementation Plan - Phase 1: Tailwind CSS 4 Foundation

**Phase**: 1 of 4
**Objective**: Install and configure Tailwind CSS 4 with PostCSS for Next.js 15
**Estimated Duration**: ~50 minutes
**Commits**: 3

---

## Overview

This phase establishes the foundation for the design system by installing Tailwind CSS 4 and configuring it with PostCSS for Next.js 15 on Cloudflare Workers.

### Goals

1. Install Tailwind CSS 4 and PostCSS plugin
2. Create minimal PostCSS configuration
3. Set up global CSS with Tailwind imports
4. Integrate CSS in the root layout
5. Verify build works correctly

### Non-Goals (Deferred to Later Phases)

- Custom theme/design tokens (Phase 3)
- shadcn/ui integration (Phase 2)
- Font configuration (Phase 3)
- CSS migration (Phase 3)

---

## Commit Strategy

```
Commit 1: Install Tailwind CSS 4
    │     └── package.json, postcss.config.mjs
    ▼
Commit 2: Create globals.css
    │     └── src/app/globals.css
    ▼
Commit 3: Integrate in layout
          └── src/app/[locale]/layout.tsx
```

---

## Commit 1: Install Tailwind CSS 4

### Objective

Add Tailwind CSS 4 and PostCSS plugin as dependencies, create PostCSS configuration.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `package.json` | Modify | ~4 |
| `postcss.config.mjs` | Create | ~8 |

### Implementation Details

#### 1.1 Install Dependencies

```bash
pnpm add tailwindcss@^4.0.0
pnpm add -D @tailwindcss/postcss@^4.0.0
```

#### 1.2 Create PostCSS Configuration

**File**: `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

### Verification

```bash
# Check packages installed
pnpm list tailwindcss @tailwindcss/postcss

# Verify postcss config syntax
node -e "import('./postcss.config.mjs').then(c => console.log('Config OK:', Object.keys(c.default.plugins)))"
```

### Commit Message

```
🔧 chore(deps): install Tailwind CSS 4 and PostCSS plugin

- Add tailwindcss@^4.0.0 as dependency
- Add @tailwindcss/postcss@^4.0.0 as devDependency
- Create postcss.config.mjs with minimal configuration

Phase 1, Commit 1/3 - Story 3.2 Design System
```

---

## Commit 2: Create globals.css

### Objective

Create the global CSS file with Tailwind imports and base layer customizations.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `src/app/globals.css` | Create | ~35 |

### Implementation Details

#### 2.1 Create Global CSS File

**File**: `src/app/globals.css`

```css
/**
 * Global Styles - Tailwind CSS 4
 *
 * This file imports Tailwind CSS and defines base layer customizations.
 * Design tokens will be added in Phase 3.
 *
 * @see https://tailwindcss.com/docs/v4-beta
 */

/* Tailwind CSS 4 - CSS-first import */
@import "tailwindcss";

/*
 * Base layer customizations
 * These apply to the base HTML elements
 */
@layer base {
  /* Smooth scrolling for the entire page */
  html {
    scroll-behavior: smooth;
  }

  /* Ensure full height for app shell */
  html,
  body {
    height: 100%;
  }

  /* Remove default margins */
  body {
    margin: 0;
  }

  /* Responsive images by default */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Focus visible for accessibility */
  :focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}
```

### Verification

```bash
# Check file exists and has content
cat src/app/globals.css | head -20

# Verify CSS syntax (PostCSS will validate on build)
```

### Commit Message

```
🎨 feat(styles): create globals.css with Tailwind CSS 4 imports

- Add Tailwind CSS 4 import using CSS-first approach
- Define base layer with accessibility defaults
- Set up smooth scrolling and responsive images
- Prepare structure for design tokens (Phase 3)

Phase 1, Commit 2/3 - Story 3.2 Design System
```

---

## Commit 3: Integrate in Layout

### Objective

Import globals.css in the root locale layout and verify the build succeeds.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `src/app/[locale]/layout.tsx` | Modify | ~2 |

### Implementation Details

#### 3.1 Update Root Locale Layout

**File**: `src/app/[locale]/layout.tsx`

Add the import at the top of the file:

```typescript
import '@/app/globals.css'
```

**Full file after modification**:

```typescript
import '@/app/globals.css'
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
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Verification

```bash
# Build the project
pnpm build

# Start dev server
pnpm dev

# Test in browser - open http://localhost:3000/fr
# Add a test class to verify Tailwind works:
# In page.tsx, add: <div className="bg-red-500 p-4">Test</div>
```

### Commit Message

```
✨ feat(layout): integrate Tailwind CSS in root layout

- Import globals.css in locale layout
- Tailwind CSS 4 now active for all frontend pages
- Build verified successfully

Phase 1, Commit 3/3 - Story 3.2 Design System
```

---

## Post-Implementation Verification

### Build Verification

```bash
# Full build
pnpm build

# Expected: Build succeeds without CSS errors
```

### Runtime Verification

```bash
# Start dev server
pnpm dev

# Test Tailwind classes work
# Add temporary test in page.tsx:
# <div className="bg-blue-500 text-white p-4 rounded">Tailwind Works!</div>
```

### Admin Panel Check

```bash
# Verify admin panel still works
# Navigate to http://localhost:3000/admin
# Expected: No visual changes, admin works normally
```

---

## Rollback Plan

If issues occur, rollback is straightforward:

```bash
# Remove the added files
rm postcss.config.mjs
rm src/app/globals.css

# Revert layout changes
git checkout src/app/[locale]/layout.tsx

# Remove dependencies
pnpm remove tailwindcss @tailwindcss/postcss

# Verify build
pnpm build
```

---

## Files Summary

### New Files (2)

| File | Purpose | Lines |
|------|---------|-------|
| `postcss.config.mjs` | PostCSS configuration | ~8 |
| `src/app/globals.css` | Tailwind imports + base styles | ~35 |

### Modified Files (2)

| File | Changes | Lines Changed |
|------|---------|---------------|
| `package.json` | Add dependencies | ~4 |
| `src/app/[locale]/layout.tsx` | Import globals.css | ~2 |

### Total Lines Changed

- **New**: ~43 lines
- **Modified**: ~6 lines
- **Total**: ~49 lines

---

## Next Steps

After completing Phase 1:

1. ✅ Verify all success criteria in [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. ✅ Update EPIC_TRACKING.md with phase completion
3. ➡️ Proceed to Phase 2: shadcn/ui & Utility Functions

---

## References

- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [PostCSS Configuration](https://postcss.org/)
- [Next.js CSS Support](https://nextjs.org/docs/app/building-your-application/styling)
- [PHASES_PLAN.md](../PHASES_PLAN.md)
