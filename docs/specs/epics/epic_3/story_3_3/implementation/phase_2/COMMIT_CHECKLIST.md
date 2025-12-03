# Phase 2: Commit Checklist - Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 2 of 5
**Total Commits**: 5

Use this checklist during implementation. Check off items as you complete them.

---

## Pre-Implementation Checklist

Before starting any commits, verify:

- [ ] On correct branch: `git branch --show-current`
- [ ] Working tree clean: `git status`
- [ ] Phase 1 complete: `ls src/components/ui/dropdown-menu.tsx`
- [ ] Dependencies up to date: `pnpm install`
- [ ] Build passes: `pnpm build`
- [ ] Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

---

## Commit 1: Create Logo Component

### Pre-Commit

- [ ] Create layout directory: `mkdir -p src/components/layout`
- [ ] Verify i18n routing exists: `ls src/i18n/routing.ts`

### Implementation

Create the Logo component:

```tsx
// src/components/layout/Logo.tsx
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

### Post-Implementation Verification

- [ ] File created: `ls src/components/layout/Logo.tsx`
- [ ] Exports `Logo` function

### Quality Checks

- [ ] TypeScript passes: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build passes: `pnpm build`

### Commit

```bash
# Stage changes
git add src/components/layout/Logo.tsx

# Commit with message
git commit -m "$(cat <<'EOF'
feat(layout): add Logo component

- Create Logo component with text-based "sebc.dev" branding
- Link to home using next-intl routing
- Supports className prop for styling flexibility

Part of: Epic 3, Story 3.3, Phase 2 (commit 1/5)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Commit 2: Add Navigation i18n Keys

### Pre-Commit

- [ ] Previous commit successful: `git log -1 --oneline`
- [ ] Working tree clean: `git status`
- [ ] Backup existing translations: `cp messages/fr.json messages/fr.json.bak`

### Implementation

Update **messages/fr.json** - Merge with existing content:

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

Update **messages/en.json** - Merge with existing content:

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

**Note**: Merge these keys with existing `navigation` object if it exists.

### Post-Implementation Verification

- [ ] JSON valid (FR): `cat messages/fr.json | jq .`
- [ ] JSON valid (EN): `cat messages/en.json | jq .`
- [ ] Navigation keys exist: `cat messages/fr.json | jq '.navigation'`

### Quality Checks

- [ ] Build passes: `pnpm build`

### Commit

```bash
# Stage changes
git add messages/fr.json messages/en.json

# Remove backup
rm messages/fr.json.bak 2>/dev/null || true

# Commit with message
git commit -m "$(cat <<'EOF'
feat(i18n): add navigation translation keys

- Add navigation.articles, categories, levels keys
- Add category sub-keys (ai, ux, engineering)
- Add level sub-keys (beginner, intermediate, advanced)
- Translations for both FR and EN

Part of: Epic 3, Story 3.3, Phase 2 (commit 2/5)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Commit 3: Create Navigation Component

### Pre-Commit

- [ ] Previous commit successful: `git log -1 --oneline`
- [ ] Working tree clean: `git status`
- [ ] Verify lucide-react installed: `grep lucide-react package.json`

If lucide-react not installed:

```bash
pnpm add lucide-react
```

### Implementation

Create the Navigation component:

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

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/')

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
        <DropdownMenuTrigger
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
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
        <DropdownMenuTrigger
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
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

### Post-Implementation Verification

- [ ] File created: `ls src/components/layout/Navigation.tsx`
- [ ] Has `'use client'` directive
- [ ] Imports DropdownMenu from ui
- [ ] Uses `useTranslations`

### Quality Checks

- [ ] TypeScript passes: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build passes: `pnpm build`

### Commit

```bash
# Stage changes
git add src/components/layout/Navigation.tsx

# If lucide-react was added, also stage package files
git add package.json pnpm-lock.yaml 2>/dev/null || true

# Commit with message
git commit -m "$(cat <<'EOF'
feat(layout): add Navigation component with dropdowns

- Create desktop navigation with Articles link
- Add Categories dropdown with filtered navigation
- Add Levels dropdown with complexity filters
- Use DropdownMenu from shadcn/ui (Phase 1)
- Hidden on mobile (lg:flex) - mobile menu in Phase 4

Part of: Epic 3, Story 3.3, Phase 2 (commit 3/5)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Commit 4: Create Header Component & Barrel Export

### Pre-Commit

- [ ] Previous commit successful: `git log -1 --oneline`
- [ ] Working tree clean: `git status`

### Implementation

Create the Header component:

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

Create the barrel export:

```tsx
// src/components/layout/index.ts
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

### Post-Implementation Verification

- [ ] Header file created: `ls src/components/layout/Header.tsx`
- [ ] Index file created: `ls src/components/layout/index.ts`
- [ ] Exports correct: `grep "export" src/components/layout/index.ts`

### Quality Checks

- [ ] TypeScript passes: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build passes: `pnpm build`

### Commit

```bash
# Stage changes
git add src/components/layout/Header.tsx src/components/layout/index.ts

# Commit with message
git commit -m "$(cat <<'EOF'
feat(layout): add Header component with Logo and Navigation

- Create Header component combining Logo and Navigation
- Add sticky positioning with backdrop blur effect
- Create barrel export for layout components
- Placeholder comments for Phase 4 additions (mobile menu, language switcher)

Part of: Epic 3, Story 3.3, Phase 2 (commit 4/5)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Commit 5: Integrate Header into Frontend Layout

### Pre-Commit

- [ ] Previous commit successful: `git log -1 --oneline`
- [ ] Working tree clean: `git status`
- [ ] Backup layout: `cp src/app/[locale]/\(frontend\)/layout.tsx src/app/[locale]/\(frontend\)/layout.tsx.bak`

### Implementation

Update the frontend layout:

```tsx
// src/app/[locale]/(frontend)/layout.tsx
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout'

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
 * - Renders Header on all pages
 * - Wraps content in semantic <main> element
 * - Enables static rendering via setRequestLocale
 *
 * Note: params is typed as Promise per Next.js 15 API.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout#params-optional
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

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
```

### Post-Implementation Verification

- [ ] Layout updated: `grep "Header" src/app/[locale]/\(frontend\)/layout.tsx`
- [ ] Import correct: `grep "from '@/components/layout'" src/app/[locale]/\(frontend\)/layout.tsx`

### Quality Checks

- [ ] TypeScript passes: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build passes: `pnpm build`

### Manual Verification

```bash
# Start dev server
pnpm dev

# In browser, verify:
# - http://localhost:3000/fr (Header visible)
# - http://localhost:3000/en (Header visible)
# - Click "Articles" link (navigates correctly)
# - Open Categories dropdown (items appear)
# - Open Levels dropdown (items appear)
# - Scroll down (Header stays sticky)
```

- [ ] Header visible on French homepage
- [ ] Header visible on English homepage
- [ ] Articles link works
- [ ] Categories dropdown works
- [ ] Levels dropdown works
- [ ] Header sticky on scroll
- [ ] No console errors

### Commit

```bash
# Remove backup
rm src/app/[locale]/\(frontend\)/layout.tsx.bak 2>/dev/null || true

# Stage changes
git add src/app/[locale]/\(frontend\)/layout.tsx

# Commit with message
git commit -m "$(cat <<'EOF'
feat(layout): integrate Header into frontend layout

- Add Header import to frontend layout
- Header now visible on all frontend pages
- Navigation functional with dropdowns
- Sticky behavior verified

Completes: Epic 3, Story 3.3, Phase 2 (commit 5/5)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Phase Completion Checklist

### All Commits Done

- [ ] 5 commits created for this phase
- [ ] All commits follow conventional commit format
- [ ] Working tree clean: `git status`

### Git History

```bash
git log --oneline -6
```

Expected output (most recent first):
```
<hash> feat(layout): integrate Header into frontend layout
<hash> feat(layout): add Header component with Logo and Navigation
<hash> feat(layout): add Navigation component with dropdowns
<hash> feat(i18n): add navigation translation keys
<hash> feat(layout): add Logo component
```

### Final Build Verification

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes

### Components Ready

- [ ] `Logo.tsx` in `src/components/layout/`
- [ ] `Navigation.tsx` in `src/components/layout/`
- [ ] `Header.tsx` in `src/components/layout/`
- [ ] `index.ts` in `src/components/layout/`

### Functionality

- [ ] Header appears on all frontend pages
- [ ] Logo links to home
- [ ] Navigation links work
- [ ] Dropdowns functional
- [ ] Header sticky on scroll

### No Regressions

- [ ] Admin panel works (`/admin`)
- [ ] Homepage content still displays
- [ ] No console errors

### Documentation Updates

- [ ] Update PHASES_PLAN.md progress checkbox
- [ ] Complete [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Troubleshooting During Implementation

### Import errors for @/i18n/routing

```bash
# Check if routing file exists
ls src/i18n/routing.ts

# If missing Link/usePathname, create or update:
# See next-intl documentation for createNavigation
```

### DropdownMenu not found

```bash
# Verify Phase 1 complete
ls src/components/ui/dropdown-menu.tsx

# If missing, run Phase 1 first or add component:
pnpm dlx shadcn@latest add dropdown-menu
```

### lucide-react not found

```bash
# Install lucide icons
pnpm add lucide-react
```

### Translation key errors

```bash
# Verify JSON structure
cat messages/fr.json | jq '.navigation'

# Check for typos
grep -r "navigation\." src/components/layout/
```

### Container class not applying

```bash
# Check Tailwind config includes container
grep "container" tailwind.config.ts
```

---

## Quick Reference Commands

```bash
# Check current state
git status
git log --oneline -5

# Run quality checks
pnpm build
pnpm lint
pnpm exec tsc --noEmit

# Check component files
ls src/components/layout/

# Verify translations
cat messages/fr.json | jq '.navigation'

# Start dev server
pnpm dev
```

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
