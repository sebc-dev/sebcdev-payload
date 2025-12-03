# Implementation Plan: Phase 4 - Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 4 of 5
**Estimated Duration**: 5-6 hours
**Total Commits**: 5

---

## Overview

This phase implements the mobile navigation experience and language switching functionality. Users on mobile devices will access navigation via a hamburger menu that opens a Sheet panel, while all users can switch between French and English locales.

### Phase Goal

Create a responsive, accessible mobile navigation and language switcher that:
- Displays hamburger menu on mobile viewports (<1024px)
- Opens a Sheet with all navigation links
- Provides FR/EN language toggle
- Preserves current page on language switch
- Persists language preference via cookie

---

## Atomic Commit Strategy

### Why 5 Commits?

This phase has **medium complexity** with two distinct features:

1. **i18n keys first**: Translation infrastructure before components
2. **LanguageSwitcher**: Independent component, simpler to build first
3. **MobileMenu**: More complex component using Sheet
4. **Barrel export**: Proper module organization
5. **Header integration**: Final wiring, brings everything together

Each commit is:
- Independently reviewable (~15-30 minutes each)
- Type-safe at completion
- Testable in isolation
- Reversible without breaking other commits

---

## Commit Plan

### Commit 1: Add i18n Keys for Mobile Menu & Language Switcher

**Purpose**: Add translation keys for mobile menu and language switching in both locales.

**Files Modified**:
| File | Change |
|------|--------|
| `messages/fr.json` | Add `language` and `mobileMenu` namespaces |
| `messages/en.json` | Add `language` and `mobileMenu` namespaces |

**Changes Detail**:

Add to `messages/fr.json`:
```json
{
  "language": {
    "switch": "Changer de langue",
    "current": "Langue actuelle",
    "fr": "Français",
    "en": "English"
  },
  "mobileMenu": {
    "open": "Ouvrir le menu",
    "close": "Fermer le menu"
  }
}
```

Add to `messages/en.json`:
```json
{
  "language": {
    "switch": "Switch language",
    "current": "Current language",
    "fr": "Français",
    "en": "English"
  },
  "mobileMenu": {
    "open": "Open menu",
    "close": "Close menu"
  }
}
```

**Note**: Language names (Français, English) stay in their native language for UX clarity.

**Commit Message**:
```
🌐 i18n(layout): add translation keys for mobile menu and language switcher

Add namespaces for:
- language: switcher labels and locale names
- mobileMenu: accessibility labels for menu buttons

Language names displayed in native language for user clarity.
```

**Validation**:
- [ ] JSON syntax valid in both files
- [ ] `pnpm build` succeeds
- [ ] Keys can be accessed via `useTranslations('language')` and `useTranslations('mobileMenu')`

**Estimated Time**: 15-20 minutes

---

### Commit 2: Create LanguageSwitcher Component

**Purpose**: Implement the language toggle component that switches between FR and EN.

**Files Created**:
| File | Purpose |
|------|---------|
| `src/components/layout/LanguageSwitcher.tsx` | Language toggle component (~50-60 lines) |

**Component Structure**:

```tsx
// src/components/layout/LanguageSwitcher.tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/routing'

/**
 * LanguageSwitcher Component
 *
 * Toggles between French and English locales.
 * Preserves the current page path when switching.
 * Uses next-intl Link for locale-aware navigation.
 *
 * @returns Language toggle buttons with visual indication of current locale
 */
export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const pathname = usePathname()

  // Remove locale prefix from pathname for locale-aware Link
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, '') || '/'

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('switch')}>
      <Link
        href={pathnameWithoutLocale}
        locale="fr"
        className={`px-2 py-1 text-sm font-medium transition-colors ${
          locale === 'fr'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-current={locale === 'fr' ? 'true' : undefined}
      >
        {t('fr')}
      </Link>
      <span className="text-muted-foreground">/</span>
      <Link
        href={pathnameWithoutLocale}
        locale="en"
        className={`px-2 py-1 text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        {t('en')}
      </Link>
    </div>
  )
}
```

**Key Implementation Details**:

1. **Client Component**: Requires `'use client'` for hooks
2. **useLocale()**: Get current locale from next-intl
3. **usePathname()**: Get current path to preserve on switch
4. **Link with locale prop**: next-intl handles locale switching
5. **Visual indication**: Primary color for active locale
6. **Accessibility**: `role="group"` and `aria-current` for screen readers

**Pathname Handling**:
```tsx
// Current URL: /fr/articles/my-article
// pathname: /fr/articles/my-article
// pathnameWithoutLocale: /articles/my-article
// Link with locale="en": navigates to /en/articles/my-article
```

**Commit Message**:
```
✨ feat(layout): create LanguageSwitcher component

Add FR/EN language toggle component featuring:
- Visual indication of current locale (primary color)
- Preserves current page path on language switch
- Uses next-intl Link for locale-aware navigation
- Accessible with role="group" and aria-current
- Client component for hook usage
```

**Validation**:
- [ ] TypeScript compiles without errors
- [ ] `pnpm lint` passes
- [ ] Component can be rendered in isolation

**Estimated Time**: 45-60 minutes

---

### Commit 3: Create MobileMenu Component

**Purpose**: Implement the mobile navigation menu using Sheet component.

**Files Created**:
| File | Purpose |
|------|---------|
| `src/components/layout/MobileMenu.tsx` | Mobile navigation sheet (~80-100 lines) |

**Component Structure**:

```tsx
// src/components/layout/MobileMenu.tsx
'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LanguageSwitcher } from './LanguageSwitcher'

/**
 * MobileMenu Component
 *
 * Hamburger menu that opens a Sheet panel with navigation links.
 * Visible only on mobile viewports (<1024px).
 * Sheet closes automatically when a link is clicked.
 *
 * @returns Hamburger trigger button and Sheet with navigation
 */
export function MobileMenu() {
  const t = useTranslations('mobileMenu')
  const navT = useTranslations('navigation')

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent lg:hidden"
          aria-label={t('open')}
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-bold">sebc.dev</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          <SheetClose asChild>
            <Link
              href="/"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('home')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/articles"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('articles')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/articles?category=all"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('categories')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/articles?level=all"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('levels')}
            </Link>
          </SheetClose>
        </nav>
        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 text-sm text-muted-foreground">
            {useTranslations('language')('switch')}
          </p>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

**Key Implementation Details**:

1. **Client Component**: Sheet requires client-side state
2. **Sheet from Radix**: Handles focus trap, escape key, overlay click
3. **SheetClose wrapper**: Closes sheet when link clicked
4. **Lucide icons**: Menu (hamburger) and X (close - handled by Sheet)
5. **Responsive visibility**: `lg:hidden` on trigger, visible only <1024px
6. **Accessibility**: aria-label on trigger, Sheet handles the rest

**Sheet Configuration**:
```tsx
// Opens from right side
<SheetContent side="right" className="w-[300px] sm:w-[350px]">

// Includes:
// - Close button (X) in top-right (default)
// - Overlay that closes on click
// - Focus trap while open
// - Escape key closes
```

**Navigation Links**:
- Home: `/` (locale-aware via Link)
- Articles: `/articles`
- Categories: `/articles?category=all` (V1: links to hub with filter)
- Levels: `/articles?level=all` (V1: links to hub with filter)

**Commit Message**:
```
✨ feat(layout): create MobileMenu component with Sheet navigation

Add mobile hamburger menu featuring:
- Sheet panel opening from right side
- All navigation links (Home, Articles, Categories, Levels)
- Automatic close on link click via SheetClose
- Language switcher integrated in sheet
- Accessible trigger button with aria-label
- Responsive: visible only on mobile (<1024px)
```

**Validation**:
- [ ] TypeScript compiles without errors
- [ ] `pnpm lint` passes
- [ ] Sheet opens and closes correctly
- [ ] Navigation links work
- [ ] `lg:hidden` hides trigger on desktop

**Estimated Time**: 60-90 minutes

---

### Commit 4: Export New Components from Barrel

**Purpose**: Add LanguageSwitcher and MobileMenu to the layout barrel export.

**Files Modified**:
| File | Change |
|------|--------|
| `src/components/layout/index.ts` | Add LanguageSwitcher and MobileMenu exports |

**Current State** (before):
```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

**New State** (after):
```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { LanguageSwitcher } from './LanguageSwitcher'
export { Logo } from './Logo'
export { MobileMenu } from './MobileMenu'
export { Navigation } from './Navigation'
```

**Commit Message**:
```
📦 refactor(layout): export LanguageSwitcher and MobileMenu from barrel

Add new components to layout exports:
- LanguageSwitcher: FR/EN language toggle
- MobileMenu: Hamburger menu with Sheet navigation

Maintains alphabetical order for consistency.
```

**Validation**:
- [ ] Exports resolve correctly
- [ ] `pnpm build` succeeds
- [ ] Can import: `import { LanguageSwitcher, MobileMenu } from '@/components/layout'`

**Estimated Time**: 5-10 minutes

---

### Commit 5: Integrate Mobile Menu and Language Switcher into Header

**Purpose**: Add the mobile menu trigger and language switcher to the Header component.

**Files Modified**:
| File | Change |
|------|--------|
| `src/components/layout/Header.tsx` | Add MobileMenu and LanguageSwitcher |

**Current Header Structure** (before):
```tsx
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <Navigation />
      </div>
    </header>
  )
}
```

**New Header Structure** (after):
```tsx
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          <Navigation />
          <LanguageSwitcher />
        </div>
        {/* Mobile: Language switcher and hamburger menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
```

**Key Changes**:

| Element | Mobile (<1024px) | Desktop (≥1024px) |
|---------|------------------|-------------------|
| Logo | Visible | Visible |
| Navigation | Hidden | Visible |
| LanguageSwitcher | Visible | Visible |
| MobileMenu (hamburger) | Visible | Hidden |

**Responsive Classes**:
```tsx
// Desktop section: hidden by default, shown on lg
<div className="hidden lg:flex lg:items-center lg:gap-6">

// Mobile section: shown by default, hidden on lg
<div className="flex items-center gap-2 lg:hidden">
```

**Commit Message**:
```
🎨 feat(layout): integrate MobileMenu and LanguageSwitcher into Header

Update Header with responsive navigation:
- Desktop: Navigation + LanguageSwitcher (visible ≥1024px)
- Mobile: LanguageSwitcher + MobileMenu hamburger (visible <1024px)
- Consistent breakpoint at lg (1024px)
- Language switcher available on all viewports
```

**Validation**:
- [ ] Header renders correctly on desktop
- [ ] Header renders correctly on mobile
- [ ] Hamburger appears only on mobile
- [ ] Navigation appears only on desktop
- [ ] Language switcher visible on both
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

**Estimated Time**: 45-60 minutes

---

## File Summary

### Files Created (2)

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/layout/LanguageSwitcher.tsx` | ~50-60 | Language toggle |
| `src/components/layout/MobileMenu.tsx` | ~80-100 | Mobile sheet navigation |

### Files Modified (4)

| File | Changes |
|------|---------|
| `messages/fr.json` | Add `language` and `mobileMenu` namespaces |
| `messages/en.json` | Add `language` and `mobileMenu` namespaces |
| `src/components/layout/index.ts` | Add new exports |
| `src/components/layout/Header.tsx` | Integrate responsive navigation |

---

## Quality Gates

After each commit, verify:

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors
- [ ] No console warnings

After all commits:

- [ ] Mobile hamburger visible on small viewport
- [ ] Mobile menu opens and closes
- [ ] Navigation links work in mobile menu
- [ ] Language switcher toggles FR/EN
- [ ] URL updates on language change
- [ ] Desktop navigation still works
- [ ] No layout shift at breakpoint

---

## Rollback Plan

If issues arise:

1. **Commit 5 issues**: Revert Header changes, components exist but not integrated
2. **Commit 4 issues**: Revert barrel export, import components directly
3. **Commit 3 issues**: Delete MobileMenu.tsx, mobile users can't navigate (critical)
4. **Commit 2 issues**: Delete LanguageSwitcher.tsx, no language switching
5. **Commit 1 issues**: Revert i18n changes, no new keys

**Note**: Commit 3 and 5 are critical - without them, mobile users cannot navigate.

---

## Next Phase

After completing Phase 4:

1. **Update PHASES_PLAN.md**: Mark Phase 4 as complete
2. **Update EPIC_TRACKING.md**: Update progress (4/5 phases)
3. **Proceed to Phase 5**: Accessibility & E2E Validation

Phase 5 will add:
- Skip link for keyboard navigation
- Comprehensive E2E tests
- axe-core accessibility audit
- ARIA landmarks verification

---

**Plan Created**: 2025-12-03
**Total Commits**: 5
**Total Files**: 2 new, 4 modified
**Estimated Time**: 5-6 hours
