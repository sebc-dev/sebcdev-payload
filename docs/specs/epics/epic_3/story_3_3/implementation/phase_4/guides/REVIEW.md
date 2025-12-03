# Code Review Guide: Phase 4 - Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 4 of 5

---

## Review Overview

This guide helps reviewers evaluate the Mobile Navigation and Language Switcher implementation. The phase consists of 5 atomic commits, each independently reviewable.

### Review Time Estimate

| Commit | Time |
|--------|------|
| 1. i18n keys | 5-10 min |
| 2. LanguageSwitcher component | 15-20 min |
| 3. MobileMenu component | 20-30 min |
| 4. Barrel export | 2-5 min |
| 5. Header integration | 15-20 min |
| **Total** | **60-90 min** |

---

## Commit 1: Add i18n Keys for Mobile Menu & Language Switcher

### What to Review

**Files**: `messages/fr.json`, `messages/en.json`

### Checklist

- [ ] **JSON Validity**: Both files parse without errors
- [ ] **Namespaces**: Uses `language` and `mobileMenu` namespaces (lowercase)
- [ ] **Key Structure**: Follows existing patterns
- [ ] **French Quality**: Labels are proper French
- [ ] **English Quality**: Labels are proper English
- [ ] **Language Names**: "Français" and "English" in native languages

### Key Questions

1. Are the accessibility labels clear and descriptive?
2. Are language names kept in their native language for UX?
3. Is the namespace consistent with other i18n keys?

### Expected Structure

```json
{
  "language": {
    "switch": "...",
    "current": "...",
    "fr": "Français",
    "en": "English"
  },
  "mobileMenu": {
    "open": "...",
    "close": "..."
  }
}
```

### Red Flags

- Translated language names (e.g., "Anglais" instead of "English")
- Missing accessibility labels
- Inconsistent key naming (camelCase vs snake_case)

---

## Commit 2: Create LanguageSwitcher Component

### What to Review

**File**: `src/components/layout/LanguageSwitcher.tsx`

### Architecture Review

- [ ] **Client Component**: Has `'use client'` directive (required for hooks)
- [ ] **Named Export**: Uses `export function LanguageSwitcher`
- [ ] **Import Sources**: Correct paths for hooks and Link

### Hooks Review

- [ ] **useLocale()**: From `next-intl` to get current locale
- [ ] **useTranslations()**: From `next-intl` for labels
- [ ] **usePathname()**: From `next/navigation` for current path

### Link Implementation Review

- [ ] **Correct Link**: Uses `Link` from `@/i18n/routing` (NOT `next/link`)
- [ ] **locale prop**: Each Link has `locale="fr"` or `locale="en"`
- [ ] **Path Handling**: Removes locale prefix before passing to Link

### Expected Path Handling

```tsx
// ✅ Correct: Strip locale prefix
const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, '') || '/'

// ❌ Wrong: Pass full path (would double locale)
<Link href={pathname} locale="en" />  // /fr/articles → /en/fr/articles
```

### Accessibility Review

- [ ] **role="group"**: Groups toggle buttons semantically
- [ ] **aria-label**: On group for "Switch language"
- [ ] **aria-current**: On active locale button

### Styling Review

- [ ] **Active State**: `text-primary` for current locale
- [ ] **Inactive State**: `text-muted-foreground` with `hover:text-foreground`
- [ ] **Transition**: `transition-colors` for smooth changes

### Red Flags

- Using `next/link` instead of `@/i18n/routing`
- Missing `'use client'` directive
- Hardcoded paths instead of dynamic pathname
- Missing accessibility attributes
- No visual distinction between active/inactive locale

### Code Example Reference

```tsx
// ✅ Good: Correct implementation
<Link
  href={pathnameWithoutLocale}
  locale="fr"
  className={locale === 'fr' ? 'text-primary' : 'text-muted-foreground'}
  aria-current={locale === 'fr' ? 'true' : undefined}
>
  {t('fr')}
</Link>
```

---

## Commit 3: Create MobileMenu Component

### What to Review

**File**: `src/components/layout/MobileMenu.tsx`

### Architecture Review

- [ ] **Client Component**: Has `'use client'` directive (required for Sheet)
- [ ] **Named Export**: Uses `export function MobileMenu`
- [ ] **Import Sources**: Correct paths for all imports

### Sheet Usage Review

- [ ] **Correct Imports**: From `@/components/ui/sheet`
- [ ] **Components Used**: Sheet, SheetTrigger, SheetContent, SheetClose, SheetHeader, SheetTitle
- [ ] **Side Prop**: `side="right"` on SheetContent
- [ ] **Width**: Reasonable width (`w-[300px] sm:w-[350px]`)

### Trigger Button Review

- [ ] **Icon**: Uses `Menu` from `lucide-react`
- [ ] **Touch Size**: At least 44x44px (`h-10 w-10` = 40px, acceptable)
- [ ] **aria-label**: Has accessible name for screen readers
- [ ] **Responsive**: `lg:hidden` to hide on desktop

### Navigation Links Review

- [ ] **SheetClose Wrapper**: Each link wrapped in `SheetClose asChild`
- [ ] **Correct Link**: Uses `Link` from `@/i18n/routing`
- [ ] **All Links Present**: Home, Articles, Categories, Levels
- [ ] **Styling**: Consistent with design (`text-lg`, `hover:text-primary`)

### Language Switcher Integration

- [ ] **Included**: LanguageSwitcher component rendered in Sheet
- [ ] **Section Label**: Translated label above switcher
- [ ] **Separator**: Border or spacing from nav links

### Expected SheetClose Pattern

```tsx
// ✅ Correct: Link wrapped in SheetClose
<SheetClose asChild>
  <Link href="/articles" className="...">
    {navT('articles')}
  </Link>
</SheetClose>

// ❌ Wrong: Link not wrapped (sheet won't close on click)
<Link href="/articles" className="...">
  {navT('articles')}
</Link>
```

### Accessibility Review

- [ ] **Sheet Title**: Required for ARIA (SheetTitle inside SheetHeader)
- [ ] **Nav Label**: `<nav>` has `aria-label`
- [ ] **Focus Management**: Handled by Radix (verify it works)

### Red Flags

- Missing `lg:hidden` on trigger (visible on desktop)
- Links not wrapped in SheetClose (doesn't close on navigation)
- Missing SheetTitle (accessibility violation)
- Using `next/link` instead of `@/i18n/routing`
- Hardcoded text instead of translations

---

## Commit 4: Export New Components from Barrel

### What to Review

**File**: `src/components/layout/index.ts`

### Checklist

- [ ] **LanguageSwitcher Export**: `export { LanguageSwitcher } from './LanguageSwitcher'`
- [ ] **MobileMenu Export**: `export { MobileMenu } from './MobileMenu'`
- [ ] **Alphabetical Order**: Exports sorted alphabetically
- [ ] **No Duplicates**: No duplicate exports
- [ ] **Consistent Style**: Matches existing export pattern

### Expected Result

```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { LanguageSwitcher } from './LanguageSwitcher'
export { Logo } from './Logo'
export { MobileMenu } from './MobileMenu'
export { Navigation } from './Navigation'
```

### Red Flags

- Default export instead of named export
- Re-exporting with different name
- Breaking existing exports

---

## Commit 5: Integrate into Header

### What to Review

**File**: `src/components/layout/Header.tsx`

### Import Review

- [ ] **Imports Added**: LanguageSwitcher and MobileMenu imported
- [ ] **Import Source**: From local files (`./LanguageSwitcher`, `./MobileMenu`)

### Responsive Layout Review

- [ ] **Desktop Wrapper**: `hidden lg:flex` (hidden below 1024px)
- [ ] **Mobile Wrapper**: `flex lg:hidden` (hidden at/above 1024px)
- [ ] **Consistent Breakpoint**: Both use `lg:` (1024px)

### Expected Structure

```tsx
<header>
  <div className="container ...">
    <Logo />

    {/* Desktop - hidden below lg */}
    <div className="hidden lg:flex lg:items-center lg:gap-6">
      <Navigation />
      <LanguageSwitcher />
    </div>

    {/* Mobile - hidden at/above lg */}
    <div className="flex items-center gap-2 lg:hidden">
      <LanguageSwitcher />
      <MobileMenu />
    </div>
  </div>
</header>
```

### Viewport Behavior Verification

| Component | <1024px | ≥1024px |
|-----------|---------|---------|
| Logo | ✅ Visible | ✅ Visible |
| Navigation | ❌ Hidden | ✅ Visible |
| LanguageSwitcher (desktop) | ❌ Hidden | ✅ Visible |
| LanguageSwitcher (mobile) | ✅ Visible | ❌ Hidden |
| MobileMenu | ✅ Visible | ❌ Hidden |

### Red Flags

- Wrong responsive classes (`hidden lg:block` vs `hidden lg:flex`)
- MobileMenu visible on desktop
- Navigation visible on mobile
- Missing LanguageSwitcher on one viewport
- Layout shift at breakpoint

---

## Cross-Commit Review

### Consistency Checks

- [ ] **Naming**: Component names match exports and imports
- [ ] **i18n Keys**: Keys used in components match keys in message files
- [ ] **Styling**: Mobile menu links follow same patterns as desktop
- [ ] **Breakpoint**: All responsive changes at `lg` (1024px)

### Integration Checks

- [ ] **Build**: `pnpm build` succeeds
- [ ] **Lint**: `pnpm lint` passes
- [ ] **Types**: No TypeScript errors

---

## Visual Review Checklist

After code review, verify visually:

### Desktop (≥1024px)

- [ ] Navigation visible in header
- [ ] Hamburger NOT visible
- [ ] Language switcher visible
- [ ] Current locale highlighted (primary color)
- [ ] Language switch updates URL

### Mobile (<1024px)

- [ ] Navigation NOT visible in header
- [ ] Hamburger visible
- [ ] Language switcher visible in header
- [ ] Hamburger click opens Sheet from right
- [ ] Sheet contains all navigation links
- [ ] Sheet contains language switcher
- [ ] Links work and close Sheet
- [ ] Language switch works in Sheet

### Breakpoint (exactly 1024px)

- [ ] No layout jump or flash
- [ ] Either desktop OR mobile layout (not both)

### Both Viewports

- [ ] Language switch preserves current page
- [ ] URL updates correctly (`/fr/...` ↔ `/en/...`)
- [ ] No full page reload on language switch

---

## Accessibility Review

### Language Switcher

- [ ] `role="group"` on container
- [ ] `aria-label` describes purpose
- [ ] `aria-current="true"` on active locale
- [ ] Keyboard focusable

### Mobile Menu Trigger

- [ ] `aria-label` describes action
- [ ] Visible focus state
- [ ] Touch target large enough (≥40px)

### Sheet (Modal)

- [ ] Focus trapped when open
- [ ] Escape key closes
- [ ] Focus returns to trigger on close
- [ ] Background not interactive when open

### Navigation in Sheet

- [ ] Links keyboard focusable
- [ ] Tab order logical
- [ ] Clear focus indicators

---

## Common Issues & Fixes

### Issue: Language Switch Causes Full Reload

**Symptom**: Page fully reloads instead of client-side navigation

**Fix**:
1. Verify using `Link` from `@/i18n/routing`
2. Check `locale` prop is set
3. Verify pathname handling strips existing locale

### Issue: Sheet Doesn't Close on Link Click

**Symptom**: Clicking navigation link doesn't close Sheet

**Fix**:
1. Wrap each Link in `SheetClose asChild`
2. Verify SheetClose is imported from ui/sheet

### Issue: Hamburger Visible on Desktop

**Symptom**: Hamburger shows at all viewport sizes

**Fix**:
1. Verify `lg:hidden` on SheetTrigger button
2. Check parent wrapper doesn't override visibility

### Issue: Layout Flash at Breakpoint

**Symptom**: Visible flash when resizing through 1024px

**Fix**:
1. Verify same breakpoint (`lg:`) used consistently
2. Check for conflicting media queries
3. Use `hidden` + `lg:flex` pattern (not `block` + `lg:hidden`)

---

## Approval Criteria

### Must Have

- [ ] Build succeeds
- [ ] Lint passes
- [ ] Mobile hamburger appears on mobile only
- [ ] Sheet opens and closes correctly
- [ ] All navigation links work in Sheet
- [ ] Language switcher toggles FR/EN
- [ ] URL updates on language switch
- [ ] Current page preserved on language switch

### Should Have

- [ ] Accessibility attributes (ARIA, roles)
- [ ] Focus management works
- [ ] Keyboard navigation works
- [ ] Smooth transitions

### Nice to Have

- [ ] Comprehensive JSDoc
- [ ] Unit tests (Phase 5)

---

## Review Decision

| Decision | Criteria |
|----------|----------|
| **Approve** | All "Must Have" criteria met, code is clean |
| **Request Changes** | Missing "Must Have" criteria or significant issues |
| **Comment** | Minor suggestions, approve after acknowledgment |

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
