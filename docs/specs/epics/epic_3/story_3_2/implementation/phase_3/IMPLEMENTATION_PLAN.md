# Implementation Plan - Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Phase**: 3 of 4
**Total Commits**: 5
**Estimated Duration**: 2-2.5 hours

---

## Pre-Implementation Checklist

Before starting, verify:

- [ ] Phase 1 (Tailwind CSS) is complete and merged
- [ ] Phase 2 (shadcn/ui) is complete and merged
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` shows Tailwind working
- [ ] Button component renders correctly
- [ ] Current branch is `epic-3-story-3-2-phase3` (or similar)

---

## Commit Strategy Overview

```
Commit 1: Configure CSS Variables (Design Tokens)
    │     └─ globals.css: Add shadcn/ui CSS variables
    │
    ▼
Commit 2: Configure Nunito Sans Font
    │     └─ layout.tsx: Add Nunito Sans via next/font
    │
    ▼
Commit 3: Configure JetBrains Mono Font
    │     └─ layout.tsx: Add JetBrains Mono via next/font
    │
    ▼
Commit 4: Migrate Homepage to Tailwind
    │     └─ page.tsx: Replace CSS classes with Tailwind utilities
    │
    ▼
Commit 5: Delete styles.css & Cleanup
          └─ Delete styles.css, update layout.tsx
```

---

## Commit 1: Configure CSS Variables (Design Tokens)

### Objective

Add shadcn/ui-compatible CSS variables to globals.css with the "Anthracite & Vert Canard" color palette.

### Files Changed

| File | Action |
|------|--------|
| `src/app/globals.css` | Modify |

### Implementation Details

**Update `src/app/globals.css`**:

Add CSS variables in the `:root` selector using HSL values (without `hsl()` wrapper as required by Tailwind 4):

```css
/**
 * Global Styles - Tailwind CSS 4
 * Design System: Anthracite & Vert Canard (Dark Mode)
 */

@import 'tailwindcss';

/**
 * Design Tokens - shadcn/ui CSS Variables
 *
 * Color Format: HSL values without hsl() wrapper
 * Example: --background: 222 16% 12% (not hsl(222, 16%, 12%))
 *
 * This format allows Tailwind to add opacity modifiers:
 * bg-background/50 -> hsl(222 16% 12% / 0.5)
 */
@layer base {
  :root {
    /* Base Colors */
    --background: 222 16% 12%;
    --foreground: 210 40% 98%;

    /* Card Colors */
    --card: 222 16% 18%;
    --card-foreground: 210 40% 98%;

    /* Popover Colors */
    --popover: 222 16% 18%;
    --popover-foreground: 210 40% 98%;

    /* Primary - Teal Accent */
    --primary: 174 72% 40%;
    --primary-foreground: 210 40% 98%;

    /* Secondary */
    --secondary: 217 19% 27%;
    --secondary-foreground: 210 40% 98%;

    /* Muted */
    --muted: 217 19% 27%;
    --muted-foreground: 215 14% 65%;

    /* Accent */
    --accent: 217 19% 27%;
    --accent-foreground: 210 40% 98%;

    /* Destructive - Red */
    --destructive: 0 72% 67%;
    --destructive-foreground: 210 40% 98%;

    /* Border & Input */
    --border: 217 19% 27%;
    --input: 217 19% 27%;

    /* Ring - Focus indicator */
    --ring: 174 72% 40%;

    /* Chart Colors (for future data viz) */
    --chart-1: 174 72% 40%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;

    /* Border Radius */
    --radius: 0.5rem;
  }

  /* Dark mode is the default - no .dark class needed */
  /* If light mode is added later, define it under .light class */

  /* Apply dark background and text colors by default */
  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }

  body {
    @apply bg-background text-foreground;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Ensure full height for app shell */
  html,
  body {
    height: 100%;
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
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }
}
```

### Validation Checklist

- [ ] CSS variables use HSL format without `hsl()` wrapper
- [ ] All shadcn/ui required variables are defined
- [ ] `--radius` is set for consistent border-radius
- [ ] `body` applies bg-background and text-foreground
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` shows dark background

### Git Commit

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(design-system): add CSS variables for Anthracite & Vert Canard theme

- Add shadcn/ui compatible CSS variables in HSL format
- Define color tokens: background, foreground, primary, etc.
- Set --radius for consistent border radius
- Apply dark theme as default via body styles
- Maintain accessibility focus styles

EOF
)"
```

---

## Commit 2: Configure Nunito Sans Font

### Objective

Add Nunito Sans as the primary font using next/font/google for optimal loading.

### Files Changed

| File | Action |
|------|--------|
| `src/app/[locale]/layout.tsx` | Modify |

### Implementation Details

**Update `src/app/[locale]/layout.tsx`**:

```tsx
import '@/app/globals.css'
import { Nunito_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'

/**
 * Nunito Sans - Primary font for body and headings
 *
 * Features:
 * - Variable font for all weights (200-1000)
 * - Latin subset for optimal bundle size
 * - CSS variable for Tailwind integration
 * - Swap display for fast initial render
 */
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
})

/**
 * Generate static params for all supported locales.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Root layout for locale-specific routes.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={nunitoSans.variable}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Note**: Also need to extend Tailwind to use the CSS variable. In Tailwind v4, this is done via CSS:

**Update `src/app/globals.css`** (add to @layer base or theme):

```css
@theme {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
}
```

### Validation Checklist

- [ ] `Nunito_Sans` imported from `next/font/google`
- [ ] Font configured with `variable: '--font-sans'`
- [ ] CSS variable applied to `<html>` element
- [ ] `body` has `font-sans` class
- [ ] `pnpm build` succeeds
- [ ] Text renders in Nunito Sans (inspect computed styles)

### Git Commit

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(typography): configure Nunito Sans as primary font

- Add Nunito Sans via next/font/google
- Configure CSS variable --font-sans
- Apply font to body via font-sans class
- Include weights 400, 600, 700 for body and headings
- Use display: swap for fast initial render

EOF
)"
```

---

## Commit 3: Configure JetBrains Mono Font

### Objective

Add JetBrains Mono as the monospace font for code elements.

### Files Changed

| File | Action |
|------|--------|
| `src/app/[locale]/layout.tsx` | Modify |
| `src/app/globals.css` | Modify |

### Implementation Details

**Update `src/app/[locale]/layout.tsx`**:

```tsx
import '@/app/globals.css'
import { Nunito_Sans, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
})

/**
 * JetBrains Mono - Monospace font for code
 *
 * Features:
 * - Designed for developers
 * - Excellent legibility at small sizes
 * - Ligature support (disabled by default)
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

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

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${nunitoSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Update `src/app/globals.css`** (@theme section):

```css
@theme {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}
```

### Validation Checklist

- [ ] `JetBrains_Mono` imported from `next/font/google`
- [ ] Font configured with `variable: '--font-mono'`
- [ ] Both CSS variables applied to `<html>` element
- [ ] `pnpm build` succeeds
- [ ] Code elements can use `font-mono` class

### Git Commit

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(typography): add JetBrains Mono for code elements

- Add JetBrains Mono via next/font/google
- Configure CSS variable --font-mono
- Include weights 400, 500 for code display
- Extend Tailwind theme with font-mono utility

EOF
)"
```

---

## Commit 4: Migrate Homepage to Tailwind Classes

### Objective

Replace CSS class selectors with Tailwind utility classes on the homepage.

### Files Changed

| File | Action |
|------|--------|
| `src/app/[locale]/(frontend)/page.tsx` | Modify |

### Implementation Details

**Current Homepage Analysis**:

The current homepage uses CSS classes like `.home`, `.content`, `.links`, `.admin`, `.docs`, `.footer`, `.codeLink` defined in `styles.css`.

**Migration Mapping**:

| CSS Class | Tailwind Equivalent |
|-----------|---------------------|
| `.home` | `flex flex-col justify-between items-center h-screen p-11 max-w-4xl mx-auto` |
| `.content` | `flex flex-col items-center justify-center flex-grow` |
| `.content h1` | `text-center my-10 text-4xl lg:text-6xl font-bold` |
| `.links` | `flex items-center gap-3` |
| `.links a` | `no-underline px-2 py-1 rounded` |
| `.admin` | `bg-foreground text-background border border-background` |
| `.docs` | `bg-background text-foreground border border-foreground` |
| `.footer` | `flex items-center gap-2 flex-col lg:flex-row` |
| `.footer p` | `m-0` |
| `.codeLink` | `no-underline px-2 bg-muted rounded` |

**Update `src/app/[locale]/(frontend)/page.tsx`**:

```tsx
import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { setRequestLocale } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import config from '@/payload.config'

/**
 * Homepage component with locale support and Tailwind styling.
 *
 * Design: Anthracite & Vert Canard dark mode theme
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-11 max-w-4xl mx-auto">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>

        {!user && (
          <h1 className="my-6 sm:my-10 text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
            Welcome to your new project.
          </h1>
        )}
        {user && (
          <h1 className="my-6 sm:my-10 text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
            Welcome back, {user.email}
          </h1>
        )}

        {/* Action Links */}
        <div className="flex items-center gap-3">
          <a
            className="no-underline px-3 py-1.5 rounded bg-foreground text-background hover:bg-foreground/90 transition-colors"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="no-underline px-3 py-1.5 rounded bg-background text-foreground border border-border hover:bg-muted transition-colors"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>

      {/* Button Variants Demo */}
      <section className="mt-8 space-y-4 w-full">
        <h2 className="text-xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center gap-2 flex-col lg:flex-row mt-8">
        <p className="m-0 text-muted-foreground">Update this page by editing</p>
        <a
          className="no-underline px-2 py-0.5 bg-muted rounded font-mono text-sm"
          href={fileURL}
        >
          <code>app/[locale]/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
```

### Validation Checklist

- [ ] No CSS class names from styles.css used (`.home`, `.content`, etc.)
- [ ] All styles use Tailwind utilities
- [ ] Responsive classes work (sm:, lg:)
- [ ] Colors use theme tokens (bg-background, text-foreground, etc.)
- [ ] `pnpm build` succeeds
- [ ] Page renders correctly with new styles
- [ ] Button variants still display properly

### Git Commit

```bash
git add src/app/[locale]/(frontend)/page.tsx
git commit -m "$(cat <<'EOF'
refactor(homepage): migrate from CSS to Tailwind utilities

- Replace .home, .content, .links classes with Tailwind utilities
- Apply design tokens (bg-background, text-foreground, etc.)
- Add responsive breakpoints (sm:, lg:)
- Maintain Button variants demo section
- Add hover states with transitions

EOF
)"
```

---

## Commit 5: Delete styles.css & Cleanup

### Objective

Remove the legacy styles.css file and update the frontend layout to remove its import.

### Files Changed

| File | Action |
|------|--------|
| `src/app/[locale]/(frontend)/styles.css` | Delete |
| `src/app/[locale]/(frontend)/layout.tsx` | Modify |

### Implementation Details

**Delete `src/app/[locale]/(frontend)/styles.css`**:

```bash
rm src/app/[locale]/(frontend)/styles.css
```

**Update `src/app/[locale]/(frontend)/layout.tsx`**:

```tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
// Removed: import './styles.css'

/**
 * Metadata for frontend pages.
 */
export const metadata: Metadata = {
  description: 'A Payload CMS blog with i18n support.',
  title: 'sebc.dev',
}

/**
 * Frontend layout for locale-specific routes.
 *
 * Note: Global styles are imported in the root layout.
 * This layout only wraps content in semantic <main> element.
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

  return <main className="min-h-screen">{children}</main>
}
```

### Validation Checklist

- [ ] `styles.css` file deleted
- [ ] No import statement for `./styles.css` in layout.tsx
- [ ] `pnpm build` succeeds (no missing file errors)
- [ ] `pnpm lint` passes
- [ ] Homepage still renders correctly
- [ ] No console errors

### Git Commit

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(cleanup): delete legacy styles.css

- Remove src/app/[locale]/(frontend)/styles.css
- Remove import from frontend layout.tsx
- All styles now use Tailwind utilities
- Add min-h-screen to main element

BREAKING CHANGE: styles.css removed, use Tailwind classes instead

EOF
)"
```

---

## Post-Implementation Checklist

After all commits:

- [ ] All 5 commits successfully created
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm dev` shows correct visuals
- [ ] Homepage displays anthracite background
- [ ] Fonts load correctly (Nunito Sans, JetBrains Mono)
- [ ] Button variants render with correct colors
- [ ] No console errors
- [ ] styles.css is deleted

---

## Troubleshooting

### CSS Variables Not Working

**Symptom**: Colors don't match design tokens

**Solution**:
1. Verify HSL values don't have `hsl()` wrapper
2. Check CSS variables are in `:root` under `@layer base`
3. Ensure Tailwind 4 is processing the file

### Fonts Not Loading

**Symptom**: Text shows system font instead of Nunito Sans

**Solution**:
1. Check Network tab for font file requests
2. Verify CSS variable is applied to `<html>` element
3. Ensure `font-sans` class is on `<body>`
4. Check for conflicting font-family rules

### Build Fails After Migration

**Symptom**: `pnpm build` errors

**Solution**:
1. Check for missing Tailwind classes
2. Verify all imports are correct
3. Run `pnpm lint` for TypeScript errors
4. Check for CSS syntax errors in globals.css

---

## Next Steps

After completing Phase 3:

1. Run validation checklist: `validation/VALIDATION_CHECKLIST.md`
2. Update EPIC_TRACKING.md with phase completion
3. Create PR for review
4. After merge, proceed to Phase 4: Accessibility Validation & Cleanup
