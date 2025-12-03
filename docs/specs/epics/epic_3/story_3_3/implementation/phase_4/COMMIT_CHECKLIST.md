# Commit Checklist: Phase 4 - Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 4 of 5
**Total Commits**: 5

---

## How to Use This Document

For each commit:
1. Read the **Pre-Commit** section before starting
2. Follow the **Implementation** steps
3. Complete the **Validation** checklist
4. Create the commit with the provided message
5. Move to the next commit

---

## Commit 1: Add i18n Keys for Mobile Menu & Language Switcher

### Pre-Commit Checklist

- [ ] On correct branch (`epic-3-story-3.3-planning` or feature branch)
- [ ] Working directory clean (`git status`)
- [ ] Phase 3 complete (Footer integrated in layout)

### Implementation Steps

#### Step 1.1: Update French Translations

Open `messages/fr.json` and add the `language` and `mobileMenu` sections:

```json
{
  "navigation": {
    // ... existing navigation keys
  },
  "footer": {
    // ... existing footer keys
  },
  "language": {
    "switch": "Changer de langue",
    "current": "Langue actuelle",
    "fr": "Français",
    "en": "English"
  },
  "mobileMenu": {
    "open": "Ouvrir le menu",
    "close": "Fermer le menu"
  },
  "metadata": {
    // ... existing metadata keys
  }
}
```

#### Step 1.2: Update English Translations

Open `messages/en.json` and add the same sections:

```json
{
  "navigation": {
    // ... existing navigation keys
  },
  "footer": {
    // ... existing footer keys
  },
  "language": {
    "switch": "Switch language",
    "current": "Current language",
    "fr": "Français",
    "en": "English"
  },
  "mobileMenu": {
    "open": "Open menu",
    "close": "Close menu"
  },
  "metadata": {
    // ... existing metadata keys
  }
}
```

**Note**: Keep "Français" and "English" in their native languages for user clarity.

### Validation Checklist

- [ ] JSON syntax valid (`pnpm build` succeeds)
- [ ] `language.switch` key exists in both files
- [ ] `language.fr` key exists in both files (value: "Français")
- [ ] `language.en` key exists in both files (value: "English")
- [ ] `mobileMenu.open` key exists in both files
- [ ] `mobileMenu.close` key exists in both files
- [ ] French accessibility labels are correct French
- [ ] English accessibility labels are correct English

### Commit

```bash
git add messages/fr.json messages/en.json
git commit -m "$(cat <<'EOF'
🌐 i18n(layout): add translation keys for mobile menu and language switcher

Add namespaces for:
- language: switcher labels and locale names
- mobileMenu: accessibility labels for menu buttons

Language names displayed in native language for user clarity.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
pnpm build  # Should succeed
```

---

## Commit 2: Create LanguageSwitcher Component

### Pre-Commit Checklist

- [ ] Commit 1 complete (i18n keys added)
- [ ] Build passing

### Implementation Steps

#### Step 2.1: Create LanguageSwitcher Component File

Create `src/components/layout/LanguageSwitcher.tsx`:

```tsx
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
 * Features:
 * - Visual indication of current locale (primary color)
 * - Accessible with role="group" and aria-current
 * - Client-side navigation (no full page reload)
 *
 * @returns Language toggle buttons
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

### Code Explanation

| Section | Purpose |
|---------|---------|
| `'use client'` | Required for hooks (useLocale, usePathname) |
| `useLocale()` | Get current locale from next-intl context |
| `usePathname()` | Get current URL path |
| `pathname.replace(/^\/(fr\|en)/, '')` | Strip locale prefix for Link |
| `Link locale="fr"` | next-intl Link with target locale |
| `text-primary` | Visual indication for active locale |
| `aria-current="true"` | Screen reader indication of current |
| `role="group"` | Group the toggle buttons semantically |

### Validation Checklist

- [ ] File created at correct path
- [ ] No TypeScript errors
- [ ] `'use client'` directive present
- [ ] Uses `useTranslations` from `next-intl`
- [ ] Uses `useLocale` from `next-intl`
- [ ] Uses `usePathname` from `next/navigation`
- [ ] Uses `Link` from `@/i18n/routing`
- [ ] Accessibility attributes present (`role`, `aria-current`)
- [ ] `pnpm lint` passes

### Commit

```bash
git add src/components/layout/LanguageSwitcher.tsx
git commit -m "$(cat <<'EOF'
✨ feat(layout): create LanguageSwitcher component

Add FR/EN language toggle component featuring:
- Visual indication of current locale (primary color)
- Preserves current page path on language switch
- Uses next-intl Link for locale-aware navigation
- Accessible with role="group" and aria-current
- Client component for hook usage

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
pnpm lint   # Should pass
pnpm build  # Should succeed
```

---

## Commit 3: Create MobileMenu Component

### Pre-Commit Checklist

- [ ] Commit 2 complete (LanguageSwitcher created)
- [ ] Build passing
- [ ] `src/components/ui/sheet.tsx` exists (from Phase 1)

### Implementation Steps

#### Step 3.1: Create MobileMenu Component File

Create `src/components/layout/MobileMenu.tsx`:

```tsx
'use client'

import { Menu } from 'lucide-react'
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
 * Visible only on mobile viewports (<1024px via lg:hidden).
 *
 * Features:
 * - Sheet slides in from right side
 * - All navigation links available
 * - Closes automatically when a link is clicked
 * - Includes language switcher
 * - Accessible: aria-label, focus management handled by Radix
 *
 * @returns Hamburger trigger button and Sheet with navigation
 */
export function MobileMenu() {
  const t = useTranslations('mobileMenu')
  const navT = useTranslations('navigation')
  const langT = useTranslations('language')

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
        <nav className="mt-8 flex flex-col gap-4" aria-label={navT('main')}>
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
          <p className="mb-3 text-sm text-muted-foreground">{langT('switch')}</p>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### Code Explanation

| Section | Purpose |
|---------|---------|
| `'use client'` | Required for Sheet state management |
| `Menu` from lucide-react | Hamburger icon |
| `Sheet` from ui/sheet | Radix-based slide panel |
| `SheetTrigger asChild` | Makes button the trigger |
| `SheetContent side="right"` | Panel slides from right |
| `SheetClose asChild` | Wraps links to close on click |
| `lg:hidden` on trigger | Hamburger only visible <1024px |
| `aria-label={t('open')}` | Accessible name for hamburger |
| `aria-label={navT('main')}` | Accessible name for nav |

### Sheet Component Parts

```tsx
<Sheet>                    // Root - manages open/close state
  <SheetTrigger>          // Button that opens sheet
  <SheetContent>          // The sliding panel
    <SheetHeader>         // Top section
      <SheetTitle>        // Required for accessibility
    </SheetHeader>
    <SheetClose>          // Wraps elements that close sheet on click
  </SheetContent>
</Sheet>
```

### Validation Checklist

- [ ] File created at correct path
- [ ] No TypeScript errors
- [ ] `'use client'` directive present
- [ ] Imports `Menu` from `lucide-react`
- [ ] Imports Sheet components from `@/components/ui/sheet`
- [ ] Uses `SheetClose` to wrap navigation links
- [ ] `lg:hidden` on trigger button
- [ ] Accessible names present
- [ ] `pnpm lint` passes

### Commit

```bash
git add src/components/layout/MobileMenu.tsx
git commit -m "$(cat <<'EOF'
✨ feat(layout): create MobileMenu component with Sheet navigation

Add mobile hamburger menu featuring:
- Sheet panel opening from right side
- All navigation links (Home, Articles, Categories, Levels)
- Automatic close on link click via SheetClose
- Language switcher integrated in sheet
- Accessible trigger button with aria-label
- Responsive: visible only on mobile (<1024px)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
pnpm lint   # Should pass
pnpm build  # Should succeed
```

---

## Commit 4: Export New Components from Barrel

### Pre-Commit Checklist

- [ ] Commit 3 complete (MobileMenu created)
- [ ] Build passing

### Implementation Steps

#### Step 4.1: Update Barrel Export

Edit `src/components/layout/index.ts`:

**Before**:
```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

**After**:
```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { LanguageSwitcher } from './LanguageSwitcher'
export { Logo } from './Logo'
export { MobileMenu } from './MobileMenu'
export { Navigation } from './Navigation'
```

Note: Keep exports in alphabetical order for consistency.

### Validation Checklist

- [ ] LanguageSwitcher export added
- [ ] MobileMenu export added
- [ ] Exports in alphabetical order
- [ ] No duplicate exports
- [ ] `pnpm build` succeeds
- [ ] Can import: `import { LanguageSwitcher, MobileMenu } from '@/components/layout'`

### Commit

```bash
git add src/components/layout/index.ts
git commit -m "$(cat <<'EOF'
📦 refactor(layout): export LanguageSwitcher and MobileMenu from barrel

Add new components to layout exports:
- LanguageSwitcher: FR/EN language toggle
- MobileMenu: Hamburger menu with Sheet navigation

Maintains alphabetical order for consistency.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 5: Integrate Mobile Menu and Language Switcher into Header

### Pre-Commit Checklist

- [ ] Commit 4 complete (exports added)
- [ ] Build passing

### Implementation Steps

#### Step 5.1: Update Header Component

Edit `src/components/layout/Header.tsx`:

**Add imports** (at top of file):
```tsx
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
```

**Update JSX** to add responsive navigation:

**Before**:
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

**After**:
```tsx
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

### Key Changes Explained

| Change | Reason |
|--------|--------|
| Desktop wrapper `hidden lg:flex` | Show Navigation + Language on desktop only |
| Mobile wrapper `flex lg:hidden` | Show Language + Hamburger on mobile only |
| `lg:gap-6` for desktop | Spacing between nav and language |
| `gap-2` for mobile | Tighter spacing for smaller viewport |
| LanguageSwitcher on both | Available on all viewports |

### Responsive Behavior

| Viewport | Logo | Navigation | LanguageSwitcher | MobileMenu |
|----------|------|------------|------------------|------------|
| <1024px | ✅ | ❌ Hidden | ✅ | ✅ |
| ≥1024px | ✅ | ✅ | ✅ | ❌ Hidden |

### Validation Checklist

- [ ] Import statements added
- [ ] Desktop wrapper with `hidden lg:flex`
- [ ] Mobile wrapper with `flex lg:hidden`
- [ ] LanguageSwitcher in both wrappers
- [ ] Navigation only in desktop wrapper
- [ ] MobileMenu only in mobile wrapper
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

### Commit

```bash
git add src/components/layout/Header.tsx
git commit -m "$(cat <<'EOF'
🎨 feat(layout): integrate MobileMenu and LanguageSwitcher into Header

Update Header with responsive navigation:
- Desktop: Navigation + LanguageSwitcher (visible ≥1024px)
- Mobile: LanguageSwitcher + MobileMenu hamburger (visible <1024px)
- Consistent breakpoint at lg (1024px)
- Language switcher available on all viewports

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

```bash
# Build should succeed
pnpm build

# Start dev server and verify
pnpm dev

# Check in browser:
# Desktop (≥1024px):
# - Navigation visible
# - Hamburger hidden
# - Language switcher visible
#
# Mobile (<1024px):
# - Navigation hidden
# - Hamburger visible
# - Language switcher visible
# - Hamburger opens Sheet with all links
# - Language switch updates URL
```

---

## Final Phase Checklist

After all 5 commits:

### Build Verification

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors

### Functional Verification - Mobile

- [ ] Hamburger visible on mobile viewport (<1024px)
- [ ] Desktop navigation hidden on mobile
- [ ] Hamburger click opens Sheet from right
- [ ] Sheet contains all navigation links (Home, Articles, Categories, Levels)
- [ ] Clicking a link closes Sheet and navigates
- [ ] Close button (X) in Sheet works
- [ ] Clicking overlay closes Sheet
- [ ] Escape key closes Sheet

### Functional Verification - Language Switcher

- [ ] Language switcher visible on desktop
- [ ] Language switcher visible on mobile (header)
- [ ] Language switcher visible in mobile Sheet
- [ ] Current locale highlighted (primary color)
- [ ] Clicking alternate locale switches language
- [ ] URL updates correctly (`/fr/...` ↔ `/en/...`)
- [ ] Current page preserved on switch
- [ ] No full page reload on switch

### Functional Verification - Desktop

- [ ] Navigation visible on desktop viewport (≥1024px)
- [ ] Hamburger hidden on desktop
- [ ] All navigation links work
- [ ] Language switcher works

### Visual Verification

- [ ] No layout shift at 1024px breakpoint
- [ ] Hamburger icon visible and aligned
- [ ] Sheet animation smooth
- [ ] Colors correct (primary for active locale)

### Accessibility Verification

- [ ] Hamburger has `aria-label`
- [ ] Sheet has focus trap (tab through links)
- [ ] Escape closes Sheet
- [ ] Focus returns to trigger after close
- [ ] Language switcher has `role="group"`

---

## Troubleshooting

### Sheet Not Opening

**Symptom**: Clicking hamburger does nothing

**Fix**:
1. Check Sheet component imported correctly
2. Verify SheetTrigger wraps the button with `asChild`
3. Check for JavaScript errors in console

### Language Switch Full Reload

**Symptom**: Page fully reloads on language switch

**Fix**:
1. Verify using `Link` from `@/i18n/routing` (not `next/link`)
2. Check `locale` prop is set on Link
3. Verify pathname extraction regex is correct

### Hamburger Visible on Desktop

**Symptom**: Hamburger shows at all viewport sizes

**Fix**:
1. Verify `lg:hidden` class on SheetTrigger button
2. Check Tailwind is processing lg: breakpoint

### Navigation Hidden on All Viewports

**Symptom**: Desktop navigation never shows

**Fix**:
1. Verify wrapper has `hidden lg:flex` (not `lg:hidden`)
2. Check Navigation component exists and exports correctly

### Focus Not Trapped in Sheet

**Symptom**: Tab moves focus outside open Sheet

**Fix**:
1. Verify Sheet imports from `@/components/ui/sheet`
2. Check Radix Dialog dependencies are installed

---

## Summary

| Commit | Files Changed | Purpose |
|--------|---------------|---------|
| 1 | `messages/{fr,en}.json` | Add i18n keys |
| 2 | `LanguageSwitcher.tsx` | Create language toggle |
| 3 | `MobileMenu.tsx` | Create mobile navigation |
| 4 | `index.ts` | Export from barrel |
| 5 | `Header.tsx` | Integrate into Header |

**Total**: 5 commits, 2 new files, 4 modified files

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
