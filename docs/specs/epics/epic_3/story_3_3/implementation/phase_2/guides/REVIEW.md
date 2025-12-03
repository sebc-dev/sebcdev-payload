# Phase 2: Code Review Guide - Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 2 of 5
**Commits to Review**: 5

This guide helps reviewers evaluate the implementation of Phase 2.

---

## Review Overview

### Phase Scope

This phase creates the Header with desktop navigation:

1. **Logo** - Text-based logo linking to home
2. **Navigation** - Desktop navigation with dropdown menus
3. **Header** - Wrapper component combining Logo + Navigation
4. **i18n** - Translation keys for navigation
5. **Layout Integration** - Header in frontend layout

### What to Look For

| Category | Priority | Focus Areas |
|----------|----------|-------------|
| Component Structure | High | RSC vs Client Component split |
| i18n Integration | High | Proper use of useTranslations |
| Accessibility | High | Keyboard navigation, focus states |
| Styling | Medium | Design token usage, responsiveness |
| Build Success | Critical | No breaking changes |

---

## Commit-by-Commit Review

### Commit 1: Logo Component

#### Files to Review

1. **`src/components/layout/Logo.tsx`**

#### Checklist

##### File Location & Naming

- [ ] Component at `src/components/layout/Logo.tsx`
- [ ] Uses PascalCase for component name
- [ ] File extension is `.tsx`

##### Component Structure

- [ ] No `"use client"` directive (Server Component)
- [ ] Exports `Logo` function component
- [ ] Accepts `className` prop for customization

##### Implementation

```tsx
// Expected structure
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'text-xl font-bold text-foreground hover:text-primary transition-colors',
        className
      )}
    >
      sebc.dev
    </Link>
  )
}
```

##### Verification

- [ ] Uses `Link` from `@/i18n/routing` (locale-aware)
- [ ] Uses `cn()` utility for class merging
- [ ] Has hover state (`hover:text-primary`)
- [ ] Has transition for smooth color change

---

### Commit 2: Navigation i18n Keys

#### Files to Review

1. **`messages/fr.json`** (diff only)
2. **`messages/en.json`** (diff only)

#### Checklist

##### JSON Structure

- [ ] Valid JSON syntax (no trailing commas, proper quotes)
- [ ] Consistent structure between FR and EN
- [ ] All keys present in both files

##### Navigation Keys Added

```json
{
  "navigation": {
    "home": "...",
    "articles": "...",
    "categories": "...",
    "levels": "...",
    "allCategories": "...",
    "allLevels": "...",
    "category": {
      "ai": "...",
      "ux": "...",
      "engineering": "..."
    },
    "level": {
      "beginner": "...",
      "intermediate": "...",
      "advanced": "..."
    }
  }
}
```

- [ ] All keys present
- [ ] Translations are accurate
- [ ] No typos in keys
- [ ] Nested structure for categories and levels

##### No Regressions

- [ ] Existing keys unchanged
- [ ] No key deletions
- [ ] JSON remains valid

---

### Commit 3: Navigation Component

#### Files to Review

1. **`src/components/layout/Navigation.tsx`**
2. **`package.json`** (if lucide-react added)

#### Checklist

##### File Location & Structure

- [ ] Component at `src/components/layout/Navigation.tsx`
- [ ] Has `"use client"` directive (required for hooks)
- [ ] Exports `Navigation` function component

##### Imports

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
```

- [ ] Correct imports for next-intl
- [ ] Uses i18n Link (not next/link)
- [ ] Uses DropdownMenu from Phase 1
- [ ] ChevronDown icon imported

##### Navigation Structure

- [ ] Has `hidden lg:flex` for responsive hiding
- [ ] Contains Articles link
- [ ] Contains Categories dropdown
- [ ] Contains Levels dropdown

##### Dropdown Implementation

- [ ] Uses `DropdownMenu` component correctly
- [ ] `DropdownMenuTrigger` has chevron icon
- [ ] `DropdownMenuContent` has align prop
- [ ] `DropdownMenuItem` uses `asChild` with Link

##### Active State Detection

```tsx
const isActive = (path: string) =>
  pathname === path || pathname.startsWith(path + '/')
```

- [ ] `isActive` function exists
- [ ] Handles exact match and prefix match
- [ ] Applied to Articles link styling

##### Accessibility

- [ ] Trigger has descriptive text (not just icon)
- [ ] Links have meaningful text
- [ ] No accessibility warnings in build

##### Styling

- [ ] Uses design token colors (`text-muted-foreground`, etc.)
- [ ] Has hover states
- [ ] Has focus states (via Radix)
- [ ] Consistent spacing

---

### Commit 4: Header Component & Barrel Export

#### Files to Review

1. **`src/components/layout/Header.tsx`**
2. **`src/components/layout/index.ts`**

#### Checklist

##### Header Component

- [ ] File at `src/components/layout/Header.tsx`
- [ ] No `"use client"` directive (Server Component wrapper)
- [ ] Imports Logo and Navigation

##### Header Implementation

```tsx
import { Logo } from './Logo'
import { Navigation } from './Navigation'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <Logo />
        <Navigation />
      </div>
    </header>
  )
}
```

- [ ] Uses semantic `<header>` element
- [ ] Has sticky positioning (`sticky top-0`)
- [ ] Has z-index for layering (`z-50`)
- [ ] Has border bottom
- [ ] Has backdrop blur effect
- [ ] Uses container for max-width
- [ ] Fixed height (`h-14`)
- [ ] Flexbox for layout

##### Barrel Export

```tsx
// src/components/layout/index.ts
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

- [ ] Exports all three components
- [ ] Named exports (not default)
- [ ] Correct paths

---

### Commit 5: Layout Integration

#### Files to Review

1. **`src/app/[locale]/(frontend)/layout.tsx`** (diff only)

#### Checklist

##### Import Changes

- [ ] Imports `Header` from `@/components/layout`
- [ ] Import path correct

##### Layout Structure

```tsx
return (
  <>
    <Header />
    <main className="min-h-screen">{children}</main>
  </>
)
```

- [ ] Uses Fragment (`<>...</>`) wrapper
- [ ] Header before main
- [ ] Main structure preserved
- [ ] No other changes to layout

##### No Regressions

- [ ] Metadata unchanged
- [ ] setRequestLocale call preserved
- [ ] Existing functionality intact

---

## Cross-Commit Review

### Overall Code Quality

#### Consistency

- [ ] All components follow same patterns
- [ ] Same import style used
- [ ] Consistent use of `cn()` utility
- [ ] Consistent TypeScript patterns

#### Server/Client Split

| Component | Type | Reason |
|-----------|------|--------|
| Logo | Server | No interactivity |
| Navigation | Client | Uses hooks (useTranslations, usePathname) |
| Header | Server | Wrapper only |

- [ ] Correct RSC/Client designation
- [ ] `"use client"` only where needed

#### No Regressions

- [ ] Admin panel unchanged
- [ ] Phase 1 components unchanged
- [ ] No modifications to unrelated files

---

## Accessibility Review

### Navigation Accessibility

| Feature | Requirement | Check |
|---------|-------------|-------|
| Keyboard navigation | Tab through items | [ ] |
| Dropdown open | Enter/Space on trigger | [ ] |
| Dropdown close | Escape key | [ ] |
| Focus visible | Clear focus indicator | [ ] |
| Semantic HTML | `<nav>`, `<header>` | [ ] |

### ARIA Attributes

- [ ] Navigation has `<nav>` element
- [ ] Header has `<header>` element
- [ ] Dropdowns have proper ARIA (via Radix)

---

## Review Criteria

### MUST Have (Blocking)

| Criteria | Verification |
|----------|--------------|
| Build passes | `pnpm build` succeeds |
| Types check | `pnpm exec tsc --noEmit` passes |
| Lint passes | `pnpm lint` passes |
| Header visible | Renders on frontend pages |
| Navigation works | Links navigate correctly |
| Dropdowns work | Open and close properly |
| i18n works | Translations display correctly |

### SHOULD Have (Non-Blocking)

| Criteria | Verification |
|----------|--------------|
| Clean commit messages | Follow conventional commits |
| Proper styling | Uses design tokens |
| Active states | Current page highlighted |
| Hover states | Visual feedback on hover |
| Sticky behavior | Header stays on scroll |

### NICE TO Have

| Criteria | Notes |
|----------|-------|
| Animation | Smooth dropdown transitions |
| Focus styling | Custom focus states |
| Documentation | Component comments |

---

## Common Issues to Watch For

### Issue 1: Wrong Link Import

**Symptom**: Navigation doesn't preserve locale

**Check**:
```tsx
// Should be
import { Link } from '@/i18n/routing'

// NOT
import Link from 'next/link'
```

### Issue 2: Missing "use client"

**Symptom**: Hooks error in Navigation component

**Check**: First line of Navigation.tsx should be `"use client"`

### Issue 3: Container Not Centered

**Symptom**: Header content at edge of screen

**Check**: Verify `container` class or equivalent padding

### Issue 4: Z-index Issues

**Symptom**: Dropdowns appear behind other content

**Check**: Header has `z-50` or higher

### Issue 5: Translation Keys Mismatch

**Symptom**: Missing translations or errors

**Check**:
```bash
# Keys in component
grep -o "t('.*')" src/components/layout/Navigation.tsx

# Keys in messages
cat messages/fr.json | jq '.navigation'
```

---

## Review Commands Quick Reference

```bash
# View all changes in phase
git diff HEAD~5..HEAD

# View changed files only
git diff --name-only HEAD~5..HEAD

# View specific commit
git show HEAD~2

# Verify build
pnpm build

# Verify types
pnpm exec tsc --noEmit

# Verify lint
pnpm lint

# Start dev server for manual testing
pnpm dev

# Check component files
cat src/components/layout/Header.tsx
cat src/components/layout/Navigation.tsx
cat src/components/layout/Logo.tsx
```

---

## Approval Criteria

### Approve If

- [ ] All MUST Have criteria met
- [ ] Build, types, and lint pass
- [ ] No unrelated file changes
- [ ] Commit messages are clear
- [ ] Header visible and functional

### Request Changes If

- [ ] Build fails
- [ ] Type errors present
- [ ] Navigation doesn't work
- [ ] Dropdowns broken
- [ ] Missing i18n translations
- [ ] Wrong component locations

### Comment Only If

- [ ] Minor style suggestions
- [ ] Optional enhancements
- [ ] Documentation improvements

---

## Post-Review Actions

### If Approved

1. Merge/close PR
2. Update PHASES_PLAN.md with completion status
3. Proceed to Phase 3 (Footer)

### If Changes Requested

1. Author addresses feedback
2. Re-review changed commits
3. Re-run verification commands

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
