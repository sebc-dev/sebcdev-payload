# Implementation Plan: Phase 5 - Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 5 of 5 (Final Phase)
**Estimated Duration**: 4-5 hours
**Total Commits**: 4

---

## Overview

This phase validates the complete navigation system with comprehensive accessibility testing and E2E tests. It adds a skip link for keyboard users and ensures WCAG 2.1 AA compliance across all navigation components.

### Phase Goal

Create a production-ready, accessible navigation system that:
- Provides skip link for keyboard-only users
- Has correct ARIA landmarks for screen readers
- Passes axe-core accessibility audit with 0 violations
- Has comprehensive E2E test coverage for all navigation flows
- Works correctly in both French and English locales

---

## Atomic Commit Strategy

### Why 4 Commits?

This phase has **medium complexity** focused on validation:

1. **i18n keys first**: Translation infrastructure before component
2. **SkipLink component**: Independent, simple component
3. **Layout integration**: Wire up SkipLink, verify landmarks
4. **E2E tests**: Comprehensive test suite as final validation

Each commit is:
- Independently reviewable (~20-45 minutes each)
- Type-safe at completion
- Testable in isolation
- Reversible without breaking other commits

---

## Commit Plan

### Commit 1: Add i18n Keys for Accessibility

**Purpose**: Add translation keys for skip link and ARIA labels in both locales.

**Files Modified**:
| File | Change |
|------|--------|
| `messages/fr.json` | Add `accessibility` namespace |
| `messages/en.json` | Add `accessibility` namespace |

**Changes Detail**:

Add to `messages/fr.json`:
```json
{
  "accessibility": {
    "skipToContent": "Aller au contenu principal",
    "mainNavigation": "Navigation principale",
    "languageSelection": "Sélection de la langue"
  }
}
```

Add to `messages/en.json`:
```json
{
  "accessibility": {
    "skipToContent": "Skip to main content",
    "mainNavigation": "Main navigation",
    "languageSelection": "Language selection"
  }
}
```

**Commit Message**:
```
🌐 i18n(a11y): add translation keys for skip link and ARIA labels

Add accessibility namespace with:
- skipToContent: Skip link text for keyboard users
- mainNavigation: ARIA label for nav element
- languageSelection: ARIA label for language switcher

Translations provided in French and English.
```

**Validation**:
- [ ] JSON syntax valid in both files
- [ ] `pnpm build` succeeds
- [ ] Keys can be accessed via `useTranslations('accessibility')`

**Estimated Time**: 15-20 minutes

---

### Commit 2: Create SkipLink Component

**Purpose**: Implement the skip to content link for keyboard navigation.

**Files Created**:
| File | Purpose |
|------|---------|
| `src/components/layout/SkipLink.tsx` | Skip to content component (~40-50 lines) |

**Component Structure**:

```tsx
// src/components/layout/SkipLink.tsx
'use client'

import { useTranslations } from 'next-intl'

/**
 * SkipLink Component
 *
 * Provides a "skip to main content" link for keyboard users.
 * Visually hidden by default, becomes visible when focused.
 *
 * Accessibility:
 * - First focusable element on page
 * - Allows keyboard users to bypass navigation
 * - Required for WCAG 2.1 AA compliance (2.4.1 Bypass Blocks)
 *
 * @returns Skip link that focuses main content when activated
 */
export function SkipLink() {
  const t = useTranslations('accessibility')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.getElementById('main-content')
    if (main) {
      main.focus()
      main.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t('skipToContent')}
    </a>
  )
}
```

**Key Implementation Details**:

1. **Client Component**: Uses `useTranslations` hook
2. **sr-only default**: Hidden from sighted users until focused
3. **focus:not-sr-only**: Becomes visible on focus
4. **High z-index**: Appears above all other content
5. **JavaScript focus**: Ensures main content receives focus
6. **Smooth scroll**: Better UX for sighted keyboard users

**Styling Breakdown**:
```tsx
// Hidden by default
"sr-only"

// Visible when focused
"focus:not-sr-only focus:absolute focus:left-4 focus:top-4"

// Visual styling when visible
"focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2"
"focus:text-primary-foreground focus:outline-none"

// Focus ring for visibility
"focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

**Commit Message**:
```
♿ feat(a11y): create SkipLink component for keyboard navigation

Add skip to content link featuring:
- Visually hidden by default (sr-only)
- Visible when focused (focus:not-sr-only)
- High z-index to appear above navigation
- JavaScript focus management for main content
- Uses primary color for high visibility
- Translated text via next-intl

Implements WCAG 2.1 AA Success Criterion 2.4.1 (Bypass Blocks).
```

**Validation**:
- [ ] TypeScript compiles without errors
- [ ] `pnpm lint` passes
- [ ] Component can be rendered in isolation
- [ ] sr-only class hides element
- [ ] Tab to element makes it visible

**Estimated Time**: 45-60 minutes

---

### Commit 3: Integrate SkipLink and Verify Landmarks

**Purpose**: Add SkipLink to layout and ensure correct ARIA landmarks.

**Files Modified**:
| File | Change |
|------|--------|
| `src/app/[locale]/(frontend)/layout.tsx` | Add SkipLink, id on main, aria-labels |
| `src/components/layout/index.ts` | Export SkipLink |

**Current Layout** (before):
```tsx
export default async function FrontendLayout({ children, params }) {
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

**New Layout** (after):
```tsx
import { Footer, Header, SkipLink } from '@/components/layout'

export default async function FrontendLayout({ children, params }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

**Key Changes**:

1. **SkipLink first**: Must be first focusable element
2. **main id**: Target for skip link (`id="main-content"`)
3. **tabIndex={-1}**: Allows main to receive programmatic focus

**Landmark Verification**:

Ensure these elements have correct implicit roles:
- `<header>` → banner role (implicit)
- `<nav>` → navigation role (implicit, in Header/Navigation)
- `<main>` → main role (implicit)
- `<footer>` → contentinfo role (implicit)

**Header aria-label** (if not already present in Header.tsx):
```tsx
// In Navigation.tsx or Header.tsx
<nav aria-label={t('accessibility.mainNavigation')}>
  {/* navigation content */}
</nav>
```

**Barrel Export Update**:
```typescript
// src/components/layout/index.ts
export { Footer } from './Footer'
export { Header } from './Header'
export { LanguageSwitcher } from './LanguageSwitcher'
export { Logo } from './Logo'
export { MobileMenu } from './MobileMenu'
export { Navigation } from './Navigation'
export { SkipLink } from './SkipLink'
```

**Commit Message**:
```
♿ feat(a11y): integrate SkipLink and verify ARIA landmarks

Add accessibility infrastructure to frontend layout:
- SkipLink as first focusable element
- id="main-content" on <main> for skip target
- tabIndex={-1} on <main> for programmatic focus
- Export SkipLink from layout barrel

Landmarks verified:
- <header> → banner role
- <nav> → navigation role
- <main> → main role
- <footer> → contentinfo role
```

**Validation**:
- [ ] Skip link is first Tab stop
- [ ] Skip link visible on focus
- [ ] Skip link navigates to main content
- [ ] Main content receives focus after skip
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

**Estimated Time**: 30-45 minutes

---

### Commit 4: Add Navigation E2E Tests

**Purpose**: Create comprehensive E2E test suite for all navigation flows.

**Files Created**:
| File | Purpose |
|------|---------|
| `tests/e2e/navigation.e2e.spec.ts` | Navigation E2E tests (~180-220 lines) |

**Test Structure**:

```typescript
// tests/e2e/navigation.e2e.spec.ts
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

import frMessages from '../../messages/fr.json' with { type: 'json' }
import enMessages from '../../messages/en.json' with { type: 'json' }

/**
 * Navigation E2E Tests
 *
 * Comprehensive tests for the navigation system:
 * - Header visibility and functionality
 * - Desktop navigation links
 * - Mobile menu (Sheet) behavior
 * - Language switcher functionality
 * - Skip link accessibility
 * - Keyboard navigation
 * - axe-core accessibility audit
 *
 * @see docs/specs/epics/epic_3/story_3_3/story_3.3.md
 */

test.describe('Navigation', () => {
  test.describe('Header', () => {
    test('header is visible on French homepage', async ({ page }) => {
      await page.goto('/fr')
      await expect(page.locator('header')).toBeVisible()
    })

    test('header is visible on English homepage', async ({ page }) => {
      await page.goto('/en')
      await expect(page.locator('header')).toBeVisible()
    })

    test('header is sticky on scroll', async ({ page }) => {
      await page.goto('/fr')

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500))

      // Header should still be visible at top
      const header = page.locator('header')
      const headerBox = await header.boundingBox()
      expect(headerBox?.y).toBeLessThanOrEqual(0)
    })

    test('logo links to homepage', async ({ page }) => {
      await page.goto('/fr/articles')

      // Click logo
      await page.click('header a[href="/fr"]')

      await expect(page).toHaveURL('/fr')
    })
  })

  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('navigation links are visible on desktop', async ({ page }) => {
      await page.goto('/fr')

      // Desktop navigation should be visible
      await expect(page.getByRole('navigation')).toBeVisible()
      await expect(page.getByRole('link', { name: frMessages.navigation.articles })).toBeVisible()
    })

    test('Articles link navigates correctly', async ({ page }) => {
      await page.goto('/fr')

      await page.click(`text=${frMessages.navigation.articles}`)

      await expect(page).toHaveURL('/fr/articles')
    })

    test('hamburger menu is hidden on desktop', async ({ page }) => {
      await page.goto('/fr')

      // Hamburger should not be visible
      const hamburger = page.getByRole('button', { name: frMessages.mobileMenu.open })
      await expect(hamburger).not.toBeVisible()
    })
  })

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('hamburger menu is visible on mobile', async ({ page }) => {
      await page.goto('/fr')

      const hamburger = page.getByRole('button', { name: frMessages.mobileMenu.open })
      await expect(hamburger).toBeVisible()
    })

    test('desktop navigation is hidden on mobile', async ({ page }) => {
      await page.goto('/fr')

      // Desktop nav wrapper should be hidden
      const desktopNav = page.locator('.hidden.lg\\:flex')
      await expect(desktopNav).not.toBeVisible()
    })

    test('mobile menu opens and closes', async ({ page }) => {
      await page.goto('/fr')

      // Open menu
      await page.click(`[aria-label="${frMessages.mobileMenu.open}"]`)

      // Sheet should be visible
      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()

      // Close button should work
      await page.click(`[aria-label="${frMessages.mobileMenu.close}"]`)
      await expect(sheet).not.toBeVisible()
    })

    test('mobile menu closes on navigation', async ({ page }) => {
      await page.goto('/fr')

      // Open menu
      await page.click(`[aria-label="${frMessages.mobileMenu.open}"]`)

      // Click navigation link
      const sheet = page.getByRole('dialog')
      await sheet.getByRole('link', { name: frMessages.navigation.articles }).click()

      // Sheet should close
      await expect(sheet).not.toBeVisible()
      await expect(page).toHaveURL('/fr/articles')
    })

    test('Escape key closes mobile menu', async ({ page }) => {
      await page.goto('/fr')

      // Open menu
      await page.click(`[aria-label="${frMessages.mobileMenu.open}"]`)

      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      await expect(sheet).not.toBeVisible()
    })
  })

  test.describe('Language Switcher', () => {
    test('language switcher is visible', async ({ page }) => {
      await page.goto('/fr')

      // Both language options should be visible
      await expect(page.getByRole('link', { name: 'Français' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'English' })).toBeVisible()
    })

    test('current language is highlighted', async ({ page }) => {
      await page.goto('/fr')

      const frLink = page.getByRole('link', { name: 'Français' })

      // French should have aria-current="true"
      await expect(frLink).toHaveAttribute('aria-current', 'true')
    })

    test('switching to English updates URL', async ({ page }) => {
      await page.goto('/fr')

      await page.click('text=English')

      await expect(page).toHaveURL('/en')
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    })

    test('switching to French updates URL', async ({ page }) => {
      await page.goto('/en')

      await page.click('text=Français')

      await expect(page).toHaveURL('/fr')
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    })

    test('language switch preserves current page', async ({ page }) => {
      await page.goto('/fr/articles')

      await page.click('text=English')

      await expect(page).toHaveURL('/en/articles')
    })
  })

  test.describe('Skip Link', () => {
    test('skip link is first focusable element', async ({ page }) => {
      await page.goto('/fr')

      // Tab once
      await page.keyboard.press('Tab')

      // First focused element should be skip link
      const focused = page.locator(':focus')
      await expect(focused).toContainText(frMessages.accessibility.skipToContent)
    })

    test('skip link is visible when focused', async ({ page }) => {
      await page.goto('/fr')

      // Tab to skip link
      await page.keyboard.press('Tab')

      const skipLink = page.getByRole('link', { name: frMessages.accessibility.skipToContent })
      await expect(skipLink).toBeVisible()
    })

    test('skip link navigates to main content', async ({ page }) => {
      await page.goto('/fr')

      // Tab to skip link
      await page.keyboard.press('Tab')

      // Activate skip link
      await page.keyboard.press('Enter')

      // Main content should have focus
      const main = page.locator('#main-content')
      await expect(main).toBeFocused()
    })

    test('skip link is translated in English', async ({ page }) => {
      await page.goto('/en')

      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')
      await expect(focused).toContainText(enMessages.accessibility.skipToContent)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('Tab navigates through interactive elements', async ({ page }) => {
      await page.goto('/fr')

      // Track focused elements
      const focusedElements: string[] = []

      for (let i = 0; i < 7; i++) {
        await page.keyboard.press('Tab')
        const tagName = await page.evaluate(() => document.activeElement?.tagName)
        focusedElements.push(tagName || 'none')
      }

      // Should have navigated through multiple elements
      expect(focusedElements.filter(el => el !== 'none').length).toBeGreaterThan(5)
    })

    test('focus rings are visible', async ({ page }) => {
      await page.goto('/fr')

      // Tab to an interactive element (skip past skip link)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')
      const boxShadow = await focused.evaluate(el => getComputedStyle(el).boxShadow)

      // Should have visible focus ring
      expect(boxShadow).not.toBe('none')
    })
  })

  test.describe('Accessibility', () => {
    test('homepage FR passes axe-core audit', async ({ page }) => {
      await page.goto('/fr')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      if (results.violations.length > 0) {
        console.log('Violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    })

    test('homepage EN passes axe-core audit', async ({ page }) => {
      await page.goto('/en')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      if (results.violations.length > 0) {
        console.log('Violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    })

    test('mobile menu passes axe-core audit when open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/fr')

      // Open mobile menu
      await page.click(`[aria-label="${frMessages.mobileMenu.open}"]`)
      await page.waitForSelector('[role="dialog"]')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      if (results.violations.length > 0) {
        console.log('Mobile menu violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    })

    test('correct ARIA landmarks are present', async ({ page }) => {
      await page.goto('/fr')

      // Header has banner role
      await expect(page.getByRole('banner')).toBeVisible()

      // Navigation role present
      await expect(page.getByRole('navigation')).toBeVisible()

      // Main role present
      await expect(page.getByRole('main')).toBeVisible()

      // Footer has contentinfo role
      await expect(page.getByRole('contentinfo')).toBeVisible()
    })
  })

  test.describe('Footer', () => {
    test('footer is visible on all pages', async ({ page }) => {
      await page.goto('/fr')
      await expect(page.locator('footer')).toBeVisible()

      await page.goto('/en')
      await expect(page.locator('footer')).toBeVisible()
    })

    test('footer links work', async ({ page }) => {
      await page.goto('/fr')

      // Click Articles link in footer
      const footer = page.locator('footer')
      await footer.getByRole('link', { name: frMessages.navigation.articles }).click()

      await expect(page).toHaveURL('/fr/articles')
    })
  })
})
```

**Test Categories**:

| Category | Tests | Purpose |
|----------|-------|---------|
| Header | 4 | Visibility, sticky, logo link |
| Desktop Navigation | 3 | Links, visibility |
| Mobile Navigation | 5 | Hamburger, sheet, close |
| Language Switcher | 5 | Toggle, URL update, preserve page |
| Skip Link | 4 | Focus, visibility, navigation |
| Keyboard Navigation | 2 | Tab order, focus rings |
| Accessibility | 4 | axe-core, landmarks |
| Footer | 2 | Visibility, links |

**Total**: ~29 tests

**Commit Message**:
```
✅ test(e2e): add comprehensive navigation E2E tests

Add navigation.e2e.spec.ts with 29 tests covering:
- Header visibility and sticky behavior
- Desktop navigation links
- Mobile hamburger menu and Sheet
- Language switcher (FR/EN toggle)
- Skip link accessibility
- Keyboard navigation flow
- axe-core WCAG 2.1 AA audit
- Footer visibility and links

Tests run on both FR and EN locales.
Tests cover both desktop (1280px) and mobile (375px) viewports.
```

**Validation**:
- [ ] All tests pass: `pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts`
- [ ] No test timeouts
- [ ] axe-core reports 0 violations
- [ ] Tests run in < 2 minutes

**Estimated Time**: 90-120 minutes

---

## File Summary

### Files Created (2)

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/layout/SkipLink.tsx` | ~40-50 | Skip to content |
| `tests/e2e/navigation.e2e.spec.ts` | ~180-220 | Navigation tests |

### Files Modified (4)

| File | Changes |
|------|---------|
| `messages/fr.json` | Add `accessibility` namespace |
| `messages/en.json` | Add `accessibility` namespace |
| `src/components/layout/index.ts` | Export SkipLink |
| `src/app/[locale]/(frontend)/layout.tsx` | Add SkipLink, id on main |

---

## Quality Gates

After each commit, verify:

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors
- [ ] No console warnings

After all commits:

- [ ] Skip link visible on focus
- [ ] Skip link navigates to main content
- [ ] All ARIA landmarks present
- [ ] All E2E tests pass
- [ ] axe-core: 0 violations
- [ ] Lighthouse accessibility: ≥ 95

---

## Rollback Plan

If issues arise:

1. **Commit 4 issues**: Remove tests, functionality still works
2. **Commit 3 issues**: Revert layout changes, skip link exists but not integrated
3. **Commit 2 issues**: Delete SkipLink.tsx, no skip link (not critical for function)
4. **Commit 1 issues**: Revert i18n changes, no new keys

**Note**: All commits are non-critical - the navigation system works without them. However, skipping accessibility features may fail CI quality gates.

---

## Story Completion Checklist

After completing Phase 5:

1. **Update PHASES_PLAN.md**: Mark Phase 5 as complete
2. **Update EPIC_TRACKING.md**: Mark Story 3.3 as complete
3. **Verify all acceptance criteria met**
4. **Run full test suite**: `pnpm test`
5. **Verify Lighthouse scores**: Accessibility ≥ 95
6. **Create PR for Story 3.3**

---

**Plan Created**: 2025-12-03
**Total Commits**: 4
**Total Files**: 2 new, 4 modified
**Estimated Time**: 4-5 hours
