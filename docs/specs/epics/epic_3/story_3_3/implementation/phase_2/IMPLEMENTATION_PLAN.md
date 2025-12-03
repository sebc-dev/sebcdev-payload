# Phase 2: Implementation Plan - Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 2 of 5
**Commits**: 5 atomic commits
**Estimated Duration**: 6-8 hours

---

## Overview

This phase creates the Header component with:
1. **Logo** - Text-based logo linking to home
2. **Navigation** - Desktop navigation with dropdown menus
3. **Layout integration** - Header appears on all frontend pages

The Header uses the DropdownMenu component from Phase 1 for category and level navigation.

---

## Atomic Commit Strategy

### Why 5 Commits?

| Commit | Responsibility | Rationale |
|--------|---------------|-----------|
| 1 | Logo component | Simplest component, no dependencies |
| 2 | i18n translations | Required before Navigation |
| 3 | Navigation component | Core navigation logic, uses i18n |
| 4 | Header component | Wrapper combining Logo + Navigation |
| 5 | Layout integration | Final integration + verification |

Each commit is:
- **Independently reversible**: Can revert without breaking other changes
- **Testable**: Can verify functionality after each commit
- **Focused**: Single responsibility principle
- **Reviewable**: Under 100 lines of actual code per commit

---

## Commit 1: Create Logo Component

### Objective

Create a simple Logo component that displays "sebc.dev" and links to the home page.

### Files to Create

| File | Description |
|------|-------------|
| `src/components/layout/Logo.tsx` | Logo component (~30 lines) |

### Implementation

```tsx
// src/components/layout/Logo.tsx
import { Link } from '@/i18n/routing'

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

### Key Decisions

- **Text-based logo**: Simple text "sebc.dev" for V1 (SVG can be added later)
- **Server Component**: No interactivity needed
- **Uses next-intl Link**: Automatically handles locale prefix

### Verification Steps

```bash
# Verify file created
ls -la src/components/layout/Logo.tsx

# TypeScript check
pnpm exec tsc --noEmit

# Build check
pnpm build
```

### Success Criteria

- [ ] `Logo.tsx` exists in `src/components/layout/`
- [ ] Exports `Logo` component
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

### Commit Message

```
feat(layout): add Logo component

- Create Logo component with text-based "sebc.dev" branding
- Link to home using next-intl routing
- Supports className prop for styling flexibility

Part of: Epic 3, Story 3.3, Phase 2 (commit 1/5)
```

---

## Commit 2: Add Navigation i18n Keys

### Objective

Add translation keys for navigation items in both French and English.

### Files to Modify

| File | Description |
|------|-------------|
| `messages/fr.json` | Add French navigation translations |
| `messages/en.json` | Add English navigation translations |

### Implementation

**messages/fr.json** - Add to existing structure:

```json
{
  "navigation": {
    "home": "Accueil",
    "articles": "Articles",
    "categories": "Catégories",
    "levels": "Niveaux",
    "allCategories": "Toutes les catégories",
    "allLevels": "Tous les niveaux",
    "category": {
      "ai": "Intelligence Artificielle",
      "ux": "UX Design",
      "engineering": "Ingénierie Logicielle"
    },
    "level": {
      "beginner": "Débutant",
      "intermediate": "Intermédiaire",
      "advanced": "Avancé"
    }
  }
}
```

**messages/en.json** - Add to existing structure:

```json
{
  "navigation": {
    "home": "Home",
    "articles": "Articles",
    "categories": "Categories",
    "levels": "Levels",
    "allCategories": "All categories",
    "allLevels": "All levels",
    "category": {
      "ai": "Artificial Intelligence",
      "ux": "UX Design",
      "engineering": "Software Engineering"
    },
    "level": {
      "beginner": "Beginner",
      "intermediate": "Intermediate",
      "advanced": "Advanced"
    }
  }
}
```

### Key Decisions

- **Namespaced keys**: `navigation.X` to avoid conflicts
- **Nested structure**: Categories and levels have sub-keys
- **Consistent naming**: Matches collection slugs where possible

### Verification Steps

```bash
# Verify JSON is valid
cat messages/fr.json | jq .
cat messages/en.json | jq .

# Check keys exist
cat messages/fr.json | jq '.navigation'
cat messages/en.json | jq '.navigation'

# Build check
pnpm build
```

### Success Criteria

- [ ] `messages/fr.json` has `navigation` key with all translations
- [ ] `messages/en.json` has `navigation` key with all translations
- [ ] JSON is valid (no syntax errors)
- [ ] Build succeeds

### Commit Message

```
feat(i18n): add navigation translation keys

- Add navigation.articles, categories, levels keys
- Add category sub-keys (ai, ux, engineering)
- Add level sub-keys (beginner, intermediate, advanced)
- Translations for both FR and EN

Part of: Epic 3, Story 3.3, Phase 2 (commit 2/5)
```

---

## Commit 3: Create Navigation Component

### Objective

Create the desktop Navigation component with dropdown menus for categories and levels.

### Files to Create

| File | Description |
|------|-------------|
| `src/components/layout/Navigation.tsx` | Desktop navigation (~120 lines) |

### Implementation

```tsx
// src/components/layout/Navigation.tsx
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

const categories = ['ai', 'ux', 'engineering'] as const
const levels = ['beginner', 'intermediate', 'advanced'] as const

export function Navigation() {
  const t = useTranslations('navigation')
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {/* Articles Link */}
      <Link
        href="/articles"
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive('/articles')
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        )}
      >
        {t('articles')}
      </Link>

      {/* Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          {t('categories')}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/articles">{t('allCategories')}</Link>
          </DropdownMenuItem>
          {categories.map((category) => (
            <DropdownMenuItem key={category} asChild>
              <Link href={`/articles?category=${category}`}>
                {t(`category.${category}`)}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Levels Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          {t('levels')}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/articles">{t('allLevels')}</Link>
          </DropdownMenuItem>
          {levels.map((level) => (
            <DropdownMenuItem key={level} asChild>
              <Link href={`/articles?complexity=${level}`}>
                {t(`level.${level}`)}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
```

### Key Decisions

- **Client Component**: Required for `useTranslations` and `usePathname` hooks
- **Hidden on mobile**: `hidden lg:flex` - Mobile menu in Phase 4
- **Dropdown structure**: Uses Phase 1's DropdownMenu component
- **Link navigation**: Dropdowns navigate to filtered article pages
- **Active state**: Uses `isActive()` helper for current path detection

### Dependencies

- `lucide-react` - For ChevronDown icon (should be installed)
- `@/i18n/routing` - For locale-aware Link and usePathname
- `@/components/ui/dropdown-menu` - From Phase 1

### Verification Steps

```bash
# Verify file created
ls -la src/components/layout/Navigation.tsx

# Check imports
grep -n "from '@/components/ui/dropdown-menu'" src/components/layout/Navigation.tsx

# TypeScript check
pnpm exec tsc --noEmit

# Build check
pnpm build
```

### Success Criteria

- [ ] `Navigation.tsx` exists in `src/components/layout/`
- [ ] Uses `'use client'` directive
- [ ] Imports DropdownMenu from Phase 1
- [ ] Uses `useTranslations` for i18n
- [ ] Hidden on mobile (`hidden lg:flex`)
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

### Commit Message

```
feat(layout): add Navigation component with dropdowns

- Create desktop navigation with Articles link
- Add Categories dropdown with filtered navigation
- Add Levels dropdown with complexity filters
- Use DropdownMenu from shadcn/ui (Phase 1)
- Hidden on mobile (lg:flex) - mobile menu in Phase 4

Part of: Epic 3, Story 3.3, Phase 2 (commit 3/5)
```

---

## Commit 4: Create Header Component & Barrel Export

### Objective

Create the Header component that combines Logo and Navigation, plus create barrel export.

### Files to Create

| File | Description |
|------|-------------|
| `src/components/layout/Header.tsx` | Header wrapper (~40 lines) |
| `src/components/layout/index.ts` | Barrel exports (~10 lines) |

### Implementation

**src/components/layout/Header.tsx**:

```tsx
// src/components/layout/Header.tsx
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
        {/* Mobile menu trigger will be added in Phase 4 */}
        {/* Language switcher will be added in Phase 4 */}
      </div>
    </header>
  )
}
```

**src/components/layout/index.ts**:

```tsx
// src/components/layout/index.ts
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

### Key Decisions

- **Sticky header**: Uses `sticky top-0 z-50` for scroll behavior
- **Backdrop blur**: Modern glass effect with fallback
- **Container width**: Uses `container` class for max-width
- **Height**: Fixed `h-14` (56px) for consistent layout
- **Comments**: Placeholders for Phase 4 additions

### Verification Steps

```bash
# Verify files created
ls -la src/components/layout/Header.tsx
ls -la src/components/layout/index.ts

# Check exports
grep "export" src/components/layout/index.ts

# TypeScript check
pnpm exec tsc --noEmit

# Build check
pnpm build
```

### Success Criteria

- [ ] `Header.tsx` exists with Logo and Navigation
- [ ] `index.ts` exports all components
- [ ] Header uses sticky positioning
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

### Commit Message

```
feat(layout): add Header component with Logo and Navigation

- Create Header component combining Logo and Navigation
- Add sticky positioning with backdrop blur effect
- Create barrel export for layout components
- Placeholder comments for Phase 4 additions (mobile menu, language switcher)

Part of: Epic 3, Story 3.3, Phase 2 (commit 4/5)
```

---

## Commit 5: Integrate Header into Frontend Layout

### Objective

Add the Header to the frontend layout so it appears on all frontend pages.

### Files to Modify

| File | Description |
|------|-------------|
| `src/app/[locale]/(frontend)/layout.tsx` | Add Header import and render |

### Implementation

Update the frontend layout:

```tsx
// src/app/[locale]/(frontend)/layout.tsx
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

### Key Changes

- Import `Header` from `@/components/layout`
- Wrap content in React Fragment (`<>...</>`)
- Add `<Header />` before `<main>`
- Keep existing `<main>` structure

### Verification Steps

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Build check
pnpm build

# Start dev server
pnpm dev

# Verify in browser:
# - http://localhost:3000/fr (Header visible)
# - http://localhost:3000/en (Header visible)
# - Check navigation links work
# - Check dropdowns open
```

### Success Criteria

- [ ] Header visible on `/fr` homepage
- [ ] Header visible on `/en` homepage
- [ ] Header sticky on scroll
- [ ] Navigation links work
- [ ] Dropdowns open correctly
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

### Commit Message

```
feat(layout): integrate Header into frontend layout

- Add Header import to frontend layout
- Header now visible on all frontend pages
- Navigation functional with dropdowns
- Sticky behavior verified

Completes: Epic 3, Story 3.3, Phase 2 (commit 5/5)
```

---

## Post-Implementation Checklist

After all 5 commits, verify:

### Build & Quality

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] No console errors in browser

### Components Functional

- [ ] Header visible on all frontend pages
- [ ] Logo links to home (correct locale)
- [ ] "Articles" link works
- [ ] Categories dropdown opens
- [ ] Levels dropdown opens
- [ ] Dropdown items navigate correctly

### Styling

- [ ] Header is sticky at top
- [ ] Background color correct (dark mode)
- [ ] Border visible
- [ ] Hover states work
- [ ] Active link highlighted

### i18n

- [ ] French translations display on `/fr`
- [ ] English translations display on `/en`
- [ ] Links preserve locale

### No Regressions

- [ ] Admin panel still works (`/admin`)
- [ ] Existing pages render correctly
- [ ] No layout shift on scroll

---

## Troubleshooting

### Issue: Navigation component import error

```bash
# Check if i18n routing exports exist
cat src/i18n/routing.ts

# If missing Link or usePathname, check next-intl setup
```

### Issue: DropdownMenu not working

```bash
# Verify Phase 1 components exist
ls src/components/ui/dropdown-menu.tsx

# Check import path
grep "from '@/components/ui/dropdown-menu'" src/components/layout/Navigation.tsx
```

### Issue: Translations not loading

```bash
# Verify JSON is valid
cat messages/fr.json | jq .

# Check for typos in key names
grep "navigation" messages/fr.json
```

### Issue: Header not sticky

```bash
# Check CSS classes
grep "sticky" src/components/layout/Header.tsx

# Verify z-index
grep "z-50" src/components/layout/Header.tsx
```

### Issue: lucide-react not installed

```bash
# Install lucide-react
pnpm add lucide-react
```

---

## Next Steps

After completing Phase 2:

1. **Mark phase complete** in `PHASES_PLAN.md`
2. **Update EPIC_TRACKING.md** if required
3. **Proceed to Phase 3**: Footer Component
   - Location: `implementation/phase_3/INDEX.md`
   - Completes the layout shell

---

## Time Estimates

| Activity | Time |
|----------|------|
| Commit 1: Logo component | 30-45 min |
| Commit 2: i18n translations | 30-45 min |
| Commit 3: Navigation component | 1.5-2 hours |
| Commit 4: Header + barrel export | 45-60 min |
| Commit 5: Layout integration | 45-60 min |
| Testing & verification | 1-2 hours |
| **Total** | **6-8 hours** |

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
