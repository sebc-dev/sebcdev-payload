# Validation Checklist: Phase 4 - Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 4 of 5

---

## Overview

This checklist validates that Phase 4 is complete and ready for Phase 5. Complete all sections before marking the phase as done.

---

## Pre-Validation Requirements

Before running validation:

- [ ] All 5 commits completed
- [ ] Working on latest code
- [ ] Dev server available for testing

---

## Section 1: Build Verification

### 1.1 TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] **PASS**: No TypeScript errors

### 1.2 ESLint

```bash
pnpm lint
```

- [ ] **PASS**: No linting errors
- [ ] **PASS**: No linting warnings (or acceptable warnings)

### 1.3 Production Build

```bash
pnpm build
```

- [ ] **PASS**: Build completes successfully
- [ ] **PASS**: No build warnings related to new components

---

## Section 2: File Verification

### 2.1 Files Created

- [ ] `src/components/layout/LanguageSwitcher.tsx` exists
- [ ] `src/components/layout/MobileMenu.tsx` exists
- [ ] Both files are not empty
- [ ] Both files export named components

### 2.2 Files Modified

- [ ] `messages/fr.json` contains `language` namespace
- [ ] `messages/fr.json` contains `mobileMenu` namespace
- [ ] `messages/en.json` contains `language` namespace
- [ ] `messages/en.json` contains `mobileMenu` namespace
- [ ] `src/components/layout/index.ts` exports `LanguageSwitcher`
- [ ] `src/components/layout/index.ts` exports `MobileMenu`
- [ ] `src/components/layout/Header.tsx` imports and renders new components

### 2.3 Verify Client Components

```bash
# Check for 'use client' directive
head -1 src/components/layout/LanguageSwitcher.tsx
# Should output: 'use client'

head -1 src/components/layout/MobileMenu.tsx
# Should output: 'use client'
```

- [ ] LanguageSwitcher has `'use client'`
- [ ] MobileMenu has `'use client'`

---

## Section 3: Mobile Menu Verification

### 3.1 Hamburger Visibility

| Viewport | Hamburger Visible |
|----------|-------------------|
| Mobile (<1024px) | [ ] Yes |
| Desktop (≥1024px) | [ ] No |

### 3.2 Sheet Behavior

**Test at mobile viewport (<1024px)**:

- [ ] Hamburger click opens Sheet
- [ ] Sheet slides in from right
- [ ] Sheet has close button (X)
- [ ] Close button closes Sheet
- [ ] Clicking overlay closes Sheet
- [ ] Escape key closes Sheet
- [ ] Sheet has title "sebc.dev"

### 3.3 Navigation Links in Sheet

- [ ] "Home" / "Accueil" link present
- [ ] "Articles" link present
- [ ] "Catégories" / "Categories" link present
- [ ] "Niveaux" / "Levels" link present

### 3.4 Link Navigation

| Link | Click | Expected | Sheet Closes |
|------|-------|----------|--------------|
| Home | ✅ | Navigate to `/[locale]/` | [ ] Yes |
| Articles | ✅ | Navigate to `/[locale]/articles` | [ ] Yes |
| Categories | ✅ | Navigate to `/[locale]/articles?category=all` | [ ] Yes |
| Levels | ✅ | Navigate to `/[locale]/articles?level=all` | [ ] Yes |

### 3.5 Language Switcher in Sheet

- [ ] Language switcher visible in Sheet
- [ ] "Changer de langue" / "Switch language" label visible
- [ ] FR and EN options visible
- [ ] Clicking alternate locale switches language

---

## Section 4: Language Switcher Verification

### 4.1 Visibility

| Location | Viewport | Visible |
|----------|----------|---------|
| Header | Mobile (<1024px) | [ ] Yes |
| Header | Desktop (≥1024px) | [ ] Yes |
| Sheet | Mobile (<1024px) | [ ] Yes |

### 4.2 Visual Indication

- [ ] Current locale is highlighted (primary color)
- [ ] Inactive locale is muted
- [ ] Separator "/" between locales

### 4.3 Language Switch Functionality - French to English

| Starting URL | Click EN | Expected URL |
|--------------|----------|--------------|
| `/fr` | [ ] | `/en` |
| `/fr/articles` | [ ] | `/en/articles` |

### 4.4 Language Switch Functionality - English to French

| Starting URL | Click FR | Expected URL |
|--------------|----------|--------------|
| `/en` | [ ] | `/fr` |
| `/en/articles` | [ ] | `/fr/articles` |

### 4.5 Language Switch Behavior

- [ ] URL updates correctly
- [ ] Page content updates to new locale
- [ ] No full page reload (smooth transition)
- [ ] Current page path preserved

---

## Section 5: Responsive Verification

### 5.1 Desktop Layout (≥1024px)

- [ ] Navigation visible in header
- [ ] Hamburger NOT visible
- [ ] Language switcher visible
- [ ] All navigation links functional

### 5.2 Mobile Layout (<1024px)

- [ ] Navigation hidden in header
- [ ] Hamburger visible
- [ ] Language switcher visible in header
- [ ] Mobile menu contains all navigation

### 5.3 Breakpoint Transition

**Test at exactly 1024px**:

- [ ] Clean transition (no layout flash)
- [ ] Either desktop OR mobile layout (not both)
- [ ] No horizontal scrollbar

---

## Section 6: i18n Verification

### 6.1 French Translations (`/fr`)

- [ ] Hamburger aria-label: "Ouvrir le menu"
- [ ] Close button aria-label: "Fermer le menu"
- [ ] Language section label: "Changer de langue"
- [ ] Locale names: "Français" and "English"

### 6.2 English Translations (`/en`)

- [ ] Hamburger aria-label: "Open menu"
- [ ] Close button aria-label: "Close menu"
- [ ] Language section label: "Switch language"
- [ ] Locale names: "Français" and "English"

### 6.3 Navigation Labels

**French**:
- [ ] Home: "Accueil"
- [ ] Articles: "Articles"
- [ ] Categories: "Catégories"
- [ ] Levels: "Niveaux"

**English**:
- [ ] Home: "Home"
- [ ] Articles: "Articles"
- [ ] Categories: "Categories"
- [ ] Levels: "Levels"

---

## Section 7: Accessibility Verification

### 7.1 Keyboard Navigation

- [ ] Can Tab to hamburger button
- [ ] Enter opens Sheet
- [ ] Focus moves into Sheet when opened
- [ ] Can Tab through all links in Sheet
- [ ] Focus trapped in Sheet (doesn't escape)
- [ ] Escape closes Sheet
- [ ] Focus returns to hamburger after close

### 7.2 ARIA Attributes

- [ ] Hamburger has `aria-label`
- [ ] Sheet has dialog role (via Radix)
- [ ] Language switcher has `role="group"`
- [ ] Active locale has `aria-current="true"`

### 7.3 Focus Indicators

- [ ] Hamburger button has visible focus ring
- [ ] Sheet close button has visible focus
- [ ] Navigation links have visible focus
- [ ] Language toggle has visible focus

### 7.4 Screen Reader (If Available)

- [ ] Hamburger announced as button with label
- [ ] Sheet announced as dialog
- [ ] Navigation links announced correctly
- [ ] Language group announced

---

## Section 8: Code Quality Verification

### 8.1 LanguageSwitcher Component

- [ ] Has `'use client'` directive
- [ ] Uses `useLocale()` from next-intl
- [ ] Uses `usePathname()` from next/navigation
- [ ] Uses `Link` from `@/i18n/routing` (not next/link)
- [ ] Has accessibility attributes

### 8.2 MobileMenu Component

- [ ] Has `'use client'` directive
- [ ] Uses Sheet from `@/components/ui/sheet`
- [ ] Uses SheetClose to wrap navigation links
- [ ] Uses `Link` from `@/i18n/routing`
- [ ] Has `lg:hidden` on trigger
- [ ] Has accessible trigger button

### 8.3 Header Integration

- [ ] Desktop wrapper: `hidden lg:flex`
- [ ] Mobile wrapper: `flex lg:hidden`
- [ ] LanguageSwitcher in both contexts
- [ ] Consistent breakpoint usage

---

## Section 9: Integration Verification

### 9.1 No Regressions

- [ ] Header still visible
- [ ] Desktop navigation still works
- [ ] Footer still visible
- [ ] Homepage renders correctly
- [ ] No console errors

### 9.2 Component Exports

- [ ] LanguageSwitcher exported from `@/components/layout`
- [ ] MobileMenu exported from `@/components/layout`

---

## Section 10: Documentation Verification

### 10.1 Code Comments

- [ ] LanguageSwitcher.tsx has JSDoc comment
- [ ] MobileMenu.tsx has JSDoc comment
- [ ] Comments describe component purpose

### 10.2 Commit Messages

- [ ] All 5 commits have proper messages
- [ ] Messages follow gitmoji convention
- [ ] Messages are descriptive

---

## Validation Summary

### Results

| Section | Status |
|---------|--------|
| 1. Build Verification | [ ] PASS |
| 2. File Verification | [ ] PASS |
| 3. Mobile Menu Verification | [ ] PASS |
| 4. Language Switcher Verification | [ ] PASS |
| 5. Responsive Verification | [ ] PASS |
| 6. i18n Verification | [ ] PASS |
| 7. Accessibility Verification | [ ] PASS |
| 8. Code Quality Verification | [ ] PASS |
| 9. Integration Verification | [ ] PASS |
| 10. Documentation Verification | [ ] PASS |

### Overall Status

- [ ] **PHASE 4 COMPLETE**

---

## Post-Validation Actions

### If All Sections Pass

1. Update PHASES_PLAN.md:
   ```markdown
   - [x] Phase 4: Mobile Navigation & Language Switcher - ✅ COMPLETE (YYYY-MM-DD)
   ```

2. Update EPIC_TRACKING.md:
   - Update progress: "Story 3.3: 4/5 phases complete"

3. Proceed to Phase 5: Accessibility & E2E Validation

### If Any Section Fails

1. Note the failing items
2. Fix the issues
3. Re-run validation
4. Do not proceed until all sections pass

---

## Critical Failures

The following failures block Phase 5:

| Failure | Impact | Priority |
|---------|--------|----------|
| Mobile menu doesn't open | Mobile users can't navigate | Critical |
| Language switch doesn't work | i18n broken | Critical |
| Focus not trapped in Sheet | Accessibility violation | High |
| Links don't close Sheet | Poor UX | Medium |
| Desktop nav visible on mobile | Layout broken | High |

---

## Validation Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | | | |
| Reviewer | | | |

---

## Notes

### Known Limitations (Acceptable)

- No E2E tests (deferred to Phase 5)
- No axe-core audit (deferred to Phase 5)
- Query parameters may not persist on some edge cases

### Issues Found

_Document any issues found during validation_

| Issue | Severity | Resolution |
|-------|----------|------------|
| | | |

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Validation Version**: 1.0
