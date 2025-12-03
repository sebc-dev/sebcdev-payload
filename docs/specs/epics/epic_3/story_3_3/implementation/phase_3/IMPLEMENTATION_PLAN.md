# Implementation Plan: Phase 3 - Footer Component

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 3 of 5
**Estimated Duration**: 3-4 hours
**Total Commits**: 4

---

## Overview

This phase implements the Footer component to complete the page layout shell (Header + Main + Footer). The Footer provides consistent branding, secondary navigation, and copyright information across all frontend pages.

### Phase Goal

Create a responsive, accessible Footer component that:
- Displays the site name and tagline
- Provides secondary navigation links
- Shows dynamic copyright year
- Integrates into the frontend layout
- Supports FR/EN translations

---

## Atomic Commit Strategy

### Why 4 Commits?

This phase is **low complexity** with clear separation:

1. **i18n keys first**: Translation infrastructure before component
2. **Component creation**: Single file, focused implementation
3. **Barrel export**: Proper module organization
4. **Layout integration**: Final wiring into the app

Each commit is:
- Independently reviewable (~15-20 minutes each)
- Type-safe at completion
- Testable in isolation
- Reversible without breaking other commits

---

## Commit Plan

### Commit 1: Add Footer i18n Keys

**Purpose**: Add translation keys for footer content in both locales.

**Files Modified**:
| File | Change |
|------|--------|
| `messages/fr.json` | Add `footer` namespace with FR translations |
| `messages/en.json` | Add `footer` namespace with EN translations |

**Changes Detail**:

Add to `messages/fr.json`:
```json
{
  "footer": {
    "tagline": "Blog technique sur l'IA, l'UX et l'ingénierie logicielle",
    "copyright": "© {year} sebc.dev. Tous droits réservés.",
    "links": {
      "articles": "Articles",
      "contact": "Contact"
    }
  }
}
```

Add to `messages/en.json`:
```json
{
  "footer": {
    "tagline": "Technical blog about AI, UX, and software engineering",
    "copyright": "© {year} sebc.dev. All rights reserved.",
    "links": {
      "articles": "Articles",
      "contact": "Contact"
    }
  }
}
```

**Commit Message**:
```
🌐 i18n(footer): add translation keys for footer content

Add footer namespace with translations for:
- Site tagline
- Copyright notice with year placeholder
- Secondary navigation links (Articles, Contact)
```

**Validation**:
- [ ] JSON syntax valid in both files
- [ ] `pnpm build` succeeds
- [ ] Keys can be accessed via `useTranslations('footer')`

**Estimated Time**: 15-20 minutes

---

### Commit 2: Create Footer Component

**Purpose**: Implement the Footer component with all sections.

**Files Created**:
| File | Purpose |
|------|---------|
| `src/components/layout/Footer.tsx` | Main footer component (~60 lines) |

**Component Structure**:

```tsx
// src/components/layout/Footer.tsx
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

/**
 * Footer Component
 *
 * Site footer displaying:
 * - Brand name and tagline
 * - Secondary navigation links
 * - Copyright with dynamic year
 *
 * Server Component - no client-side JS required.
 * Responsive design: horizontal on desktop, stacked on mobile.
 *
 * @returns Footer element with semantic contentinfo role
 */
export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="mb-6 lg:mb-0">
            <p className="text-lg font-bold text-foreground">sebc.dev</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="mb-6 flex gap-6 lg:mb-0">
            <Link
              href="/articles"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('links.articles')}
            </Link>
            <a
              href="mailto:contact@sebc.dev"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('links.contact')}
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

**Key Implementation Details**:

1. **Server Component**: No `'use client'` directive needed
2. **Dynamic Year**: Uses `new Date().getFullYear()` for copyright
3. **Responsive Layout**:
   - Mobile: `flex-col items-center text-center`
   - Desktop: `lg:flex-row lg:items-start lg:justify-between lg:text-left`
4. **Localized Link**: Uses `@/i18n/routing` Link for `/articles`
5. **mailto Link**: Standard `<a>` for external email link
6. **Design Tokens**: Uses `bg-card`, `border-border`, `text-foreground`, etc.

**Commit Message**:
```
✨ feat(layout): create Footer component with branding and navigation

Add Footer component featuring:
- Brand section with site name and translated tagline
- Secondary navigation (Articles, Contact email)
- Dynamic copyright year with i18n support
- Responsive layout (centered mobile, spread desktop)
- Semantic HTML with proper footer element
```

**Validation**:
- [ ] TypeScript compiles without errors
- [ ] `pnpm lint` passes
- [ ] Component renders in isolation (can test in a page)

**Estimated Time**: 45-60 minutes

---

### Commit 3: Export Footer from Barrel

**Purpose**: Add Footer to the layout barrel export for clean imports.

**Files Modified**:
| File | Change |
|------|--------|
| `src/components/layout/index.ts` | Add Footer export |

**Current State** (before):
```typescript
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

**New State** (after):
```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

**Commit Message**:
```
📦 refactor(layout): export Footer from barrel file

Add Footer to layout component exports for consistent import pattern:
import { Header, Footer } from '@/components/layout'
```

**Validation**:
- [ ] Export resolves correctly
- [ ] `pnpm build` succeeds
- [ ] Can import Footer from `@/components/layout`

**Estimated Time**: 5-10 minutes

---

### Commit 4: Integrate Footer into Frontend Layout

**Purpose**: Add Footer to the frontend layout so it appears on all pages.

**Files Modified**:
| File | Change |
|------|--------|
| `src/app/[locale]/(frontend)/layout.tsx` | Import and render Footer |

**Current State** (before):
```tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout'

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

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
```

**New State** (after):
```tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Footer, Header } from '@/components/layout'

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

**Key Changes**:

1. **Import Footer**: Add to import statement
2. **Wrapper div**: `flex min-h-screen flex-col` for sticky footer
3. **Main flex-1**: Allows main to grow and push footer to bottom
4. **Remove min-h-screen from main**: Move to wrapper for proper sticky footer

**Sticky Footer Pattern**:
```
┌─────────────────────────────────┐
│ div.flex.min-h-screen.flex-col │
│  ┌─────────────────────────────┤
│  │ Header (fixed height)       │
│  ├─────────────────────────────┤
│  │ Main.flex-1 (grows to fill) │
│  │                             │
│  │                             │
│  ├─────────────────────────────┤
│  │ Footer (fixed height)       │
└──┴─────────────────────────────┘
```

**Commit Message**:
```
🎨 feat(layout): integrate Footer into frontend layout

Add Footer component to frontend layout with sticky footer pattern:
- Wrap Header + Main + Footer in flex column container
- Use flex-1 on main to push footer to bottom
- Footer now visible on all frontend pages
```

**Validation**:
- [ ] Footer visible on homepage (`/fr`, `/en`)
- [ ] Footer stays at bottom even with short content
- [ ] No layout shift or visual regression
- [ ] `pnpm build` succeeds

**Estimated Time**: 20-30 minutes

---

## File Summary

### Files Created (1)

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/layout/Footer.tsx` | ~60 | Footer component |

### Files Modified (4)

| File | Changes |
|------|---------|
| `messages/fr.json` | Add `footer` namespace |
| `messages/en.json` | Add `footer` namespace |
| `src/components/layout/index.ts` | Add Footer export |
| `src/app/[locale]/(frontend)/layout.tsx` | Import and render Footer |

---

## Quality Gates

After each commit, verify:

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors
- [ ] No console warnings

After all commits:

- [ ] Footer visible on `/fr` and `/en`
- [ ] Footer displays in French on `/fr`
- [ ] Footer displays in English on `/en`
- [ ] Links work correctly
- [ ] Responsive layout works (test mobile viewport)

---

## Rollback Plan

If issues arise:

1. **Commit 4 issues**: Revert layout.tsx changes, Footer won't show but app works
2. **Commit 3 issues**: Revert barrel export, import Footer directly
3. **Commit 2 issues**: Delete Footer.tsx, start fresh
4. **Commit 1 issues**: Revert i18n changes, no footer keys available

Each commit can be reverted independently without breaking the application.

---

## Next Phase

After completing Phase 3:

1. **Update PHASES_PLAN.md**: Mark Phase 3 as complete
2. **Update EPIC_TRACKING.md**: Update progress (3/5 phases)
3. **Proceed to Phase 4**: Mobile Navigation & Language Switcher

Phase 4 will add:
- Mobile hamburger menu using Sheet component
- Language switcher (FR/EN toggle)
- Responsive navigation behavior

---

**Plan Created**: 2025-12-03
**Total Commits**: 4
**Total Files**: 1 new, 4 modified
**Estimated Time**: 3-4 hours
