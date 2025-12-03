# Validation Checklist: Phase 5 - Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 5 of 5 (Final Phase)
**Purpose**: Final validation before marking phase complete

---

## How to Use This Checklist

1. Complete ALL items before marking phase complete
2. Mark items as: `[x]` (pass), `[ ]` (not done), `[!]` (blocked/failed)
3. For failures, document the issue and resolution
4. This checklist is the final gate before Story 3.3 completion

---

## Pre-Validation Setup

### Environment Ready

- [ ] On correct branch: `epic-3-story-3.3-planning`
- [ ] All Phase 5 commits applied (4 commits)
- [ ] Dependencies installed: `pnpm install`
- [ ] Dev server can start: `pnpm dev`

### Baseline Verification

- [ ] Build succeeds: `pnpm build`
- [ ] Lint passes: `pnpm lint`
- [ ] TypeScript: 0 errors
- [ ] No console errors in browser

---

## Component Validation

### SkipLink Component

#### File Exists and Correct

- [ ] File exists: `src/components/layout/SkipLink.tsx`
- [ ] File has `'use client'` directive
- [ ] Component exports correctly from barrel: `src/components/layout/index.ts`
- [ ] Import works: `import { SkipLink } from '@/components/layout'`

#### Component Behavior

- [ ] Default state: Visually hidden (sr-only)
- [ ] Focused state: Visible at top-left
- [ ] Text displays translated content
- [ ] Click/Enter navigates to main content
- [ ] Main content receives focus after activation

#### Styling

- [ ] Focus ring visible (primary color)
- [ ] High z-index (appears above all content)
- [ ] Rounded corners match design system
- [ ] Padding provides adequate click target

### Layout Integration

#### Layout Structure

- [ ] SkipLink is first child in layout
- [ ] `<main>` has `id="main-content"`
- [ ] `<main>` has `tabIndex={-1}`
- [ ] No changes to Header/Footer integration

---

## i18n Validation

### Translation Keys

#### French (`messages/fr.json`)

- [ ] `accessibility.skipToContent` = "Aller au contenu principal"
- [ ] `accessibility.mainNavigation` = "Navigation principale"
- [ ] `accessibility.languageSelection` = "Sélection de la langue"

#### English (`messages/en.json`)

- [ ] `accessibility.skipToContent` = "Skip to main content"
- [ ] `accessibility.mainNavigation` = "Main navigation"
- [ ] `accessibility.languageSelection` = "Language selection"

### Runtime Translation

- [ ] FR page shows French skip link text
- [ ] EN page shows English skip link text
- [ ] No translation key warnings in console

---

## Accessibility Validation

### WCAG 2.1 AA Compliance

#### 2.4.1 Bypass Blocks

- [ ] Skip link provides bypass mechanism
- [ ] Skip link is first focusable element
- [ ] Skip link navigates to main content

#### 1.3.1 Info and Relationships

- [ ] `<header>` has banner role (implicit)
- [ ] `<nav>` has navigation role (implicit)
- [ ] `<main>` has main role (implicit)
- [ ] `<footer>` has contentinfo role (implicit)

#### 2.1.1 Keyboard

- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] No keyboard traps

#### 2.4.3 Focus Order

- [ ] Focus order: Skip → Header → Main → Footer
- [ ] Focus moves logically within sections
- [ ] Mobile menu focus trapped correctly

#### 2.4.7 Focus Visible

- [ ] Focus ring visible on all elements
- [ ] Sufficient contrast on focus indicators
- [ ] Focus style consistent across components

#### 1.4.3 Contrast (Minimum)

- [ ] Text contrast ratio ≥ 4.5:1
- [ ] UI component contrast ≥ 3:1
- [ ] Focus indicator contrast ≥ 3:1

### axe-core Audit Results

#### Homepage FR

- [ ] Run: `pnpm test:e2e -- -g "homepage FR passes axe-core"`
- [ ] Result: 0 violations
- [ ] If violations, document and fix:

| Violation | Element | Fix Applied |
|-----------|---------|-------------|
| | | |

#### Homepage EN

- [ ] Run: `pnpm test:e2e -- -g "homepage EN passes axe-core"`
- [ ] Result: 0 violations
- [ ] If violations, document and fix:

| Violation | Element | Fix Applied |
|-----------|---------|-------------|
| | | |

#### Mobile Menu Open

- [ ] Run: `pnpm test:e2e -- -g "mobile menu passes axe-core"`
- [ ] Result: 0 violations
- [ ] If violations, document and fix:

| Violation | Element | Fix Applied |
|-----------|---------|-------------|
| | | |

### Lighthouse Accessibility Score

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000/fr --only-categories=accessibility --output=json
```

- [ ] Accessibility score: ≥ 95
- [ ] Actual score: ____

---

## E2E Test Validation

### Test Suite Execution

```bash
pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts
```

- [ ] All tests pass
- [ ] No test timeouts
- [ ] No flaky tests (run 3x to verify)

### Test Results Summary

| Category | Expected | Passed | Failed |
|----------|----------|--------|--------|
| Header | 4 | | |
| Desktop Navigation | 3 | | |
| Mobile Navigation | 5 | | |
| Language Switcher | 5 | | |
| Skip Link | 4 | | |
| Keyboard Navigation | 2 | | |
| Accessibility | 4 | | |
| Footer | 2 | | |
| **Total** | **29** | | |

### Failed Tests (if any)

| Test Name | Error | Resolution |
|-----------|-------|------------|
| | | |

---

## Manual Testing Validation

### Skip Link Flow

| Step | Action | Expected | Passed |
|------|--------|----------|--------|
| 1 | Load `/fr` | Page loads | [ ] |
| 2 | Press Tab | Skip link visible | [ ] |
| 3 | Read text | "Aller au contenu principal" | [ ] |
| 4 | Press Enter | Focus on main content | [ ] |
| 5 | Load `/en` | Page loads | [ ] |
| 6 | Press Tab | Skip link visible | [ ] |
| 7 | Read text | "Skip to main content" | [ ] |
| 8 | Press Enter | Focus on main content | [ ] |

### Keyboard Navigation Flow

| Step | Action | Focus Element | Passed |
|------|--------|---------------|--------|
| 1 | Tab | Skip link | [ ] |
| 2 | Tab | Logo | [ ] |
| 3 | Tab | Articles link | [ ] |
| 4 | Tab | Categories | [ ] |
| 5 | Tab | Levels | [ ] |
| 6 | Tab | Language FR | [ ] |
| 7 | Tab | Language EN | [ ] |
| 8 | Tab | Main content or first link | [ ] |

### Mobile Menu (375x667 viewport)

| Step | Action | Expected | Passed |
|------|--------|----------|--------|
| 1 | Set mobile viewport | Layout adapts | [ ] |
| 2 | Verify hamburger visible | Menu icon shown | [ ] |
| 3 | Verify desktop nav hidden | Nav not visible | [ ] |
| 4 | Click hamburger | Sheet opens | [ ] |
| 5 | Verify navigation links | All links visible | [ ] |
| 6 | Click Article link | Navigate + close | [ ] |
| 7 | Reopen menu | Sheet opens | [ ] |
| 8 | Press Escape | Sheet closes | [ ] |
| 9 | Reopen menu | Sheet opens | [ ] |
| 10 | Click outside | Sheet closes | [ ] |

### Language Switcher

| Step | Action | Expected | Passed |
|------|--------|----------|--------|
| 1 | Load `/fr` | French page | [ ] |
| 2 | Click "English" | Navigate to `/en` | [ ] |
| 3 | Verify `lang="en"` | HTML lang attribute | [ ] |
| 4 | Click "Français" | Navigate to `/fr` | [ ] |
| 5 | Verify `lang="fr"` | HTML lang attribute | [ ] |
| 6 | Load `/fr/articles` | Articles page | [ ] |
| 7 | Click "English" | Navigate to `/en/articles` | [ ] |

---

## Browser Compatibility

### Chrome (Required)

- [ ] Desktop (1280x720): All features work
- [ ] Mobile emulation (375x667): All features work
- [ ] Skip link functions correctly
- [ ] All E2E tests pass

### Safari (Recommended)

- [ ] Desktop: All features work
- [ ] Mobile (Safari iOS): All features work
- [ ] VoiceOver landmarks announced

### Firefox (Recommended)

- [ ] Desktop: All features work
- [ ] Keyboard navigation works

---

## Regression Validation

### No Regressions in Existing Features

- [ ] Homepage loads correctly (FR)
- [ ] Homepage loads correctly (EN)
- [ ] Header still visible and functional
- [ ] Footer still visible and functional
- [ ] Navigation links still work
- [ ] Mobile menu still works
- [ ] Language switcher still works

### Existing E2E Tests

```bash
pnpm test:e2e
```

- [ ] All existing E2E tests pass
- [ ] `frontend.e2e.spec.ts`: Pass
- [ ] `design-system.e2e.spec.ts`: Pass
- [ ] No new failures introduced

---

## Documentation Validation

### Phase 5 Documentation Complete

- [ ] `INDEX.md` - Complete and accurate
- [ ] `IMPLEMENTATION_PLAN.md` - Complete and accurate
- [ ] `COMMIT_CHECKLIST.md` - Complete and accurate
- [ ] `ENVIRONMENT_SETUP.md` - Complete and accurate
- [ ] `guides/REVIEW.md` - Complete and accurate
- [ ] `guides/TESTING.md` - Complete and accurate
- [ ] `validation/VALIDATION_CHECKLIST.md` - This file

### Cross-Reference Updates

- [ ] `PHASES_PLAN.md` - Phase 5 marked complete
- [ ] `EPIC_TRACKING.md` - Story 3.3 progress updated

---

## Story 3.3 Acceptance Criteria

### AC1: Header Component

- [x] Header displays on all frontend pages
- [x] Header contains Logo, Navigation, Language Switcher
- [x] Header is sticky
- [x] Header is responsive (hamburger on mobile)
- [x] Header follows design system

### AC2: Navigation Principal

- [x] Navigation links: Articles, Categories, Levels
- [x] Keyboard accessible (tab navigation, focus states)
- [x] Active page indicator (via Link component)
- [x] Dropdowns for Categories and Levels

### AC3: Language Switcher

- [x] FR/EN toggle visible in Header
- [x] Language change preserves current page
- [x] Language stored via next-intl cookie
- [x] URL updates correctly

### AC4: Footer Component

- [x] Footer displays on all frontend pages
- [x] Copyright with dynamic year
- [x] Secondary navigation links
- [x] Responsive layout

### AC5: Layout Integration

- [x] Header and Footer in frontend layout
- [x] Semantic HTML structure
- [x] No regressions on existing pages

### AC6: Accessibility (Phase 5 specific)

- [ ] WCAG 2.1 AA keyboard navigation
- [ ] Skip link "Aller au contenu principal"
- [ ] ARIA landmarks (banner, navigation, contentinfo)
- [ ] Contrast ratios WCAG AA compliant

---

## Final Sign-Off

### Phase 5 Complete

| Criterion | Status |
|-----------|--------|
| All commits applied | [ ] |
| Build succeeds | [ ] |
| Lint passes | [ ] |
| All E2E tests pass | [ ] |
| axe-core: 0 violations | [ ] |
| Lighthouse a11y ≥ 95 | [ ] |
| Manual tests pass | [ ] |
| No regressions | [ ] |
| Documentation complete | [ ] |

### Approval

- [ ] **Phase 5 VALIDATED** - Ready to mark complete
- [ ] PHASES_PLAN.md updated with completion date
- [ ] EPIC_TRACKING.md updated with Story 3.3 status

---

## Story 3.3 Completion

### All Phases Complete

- [x] Phase 1: shadcn/ui Components
- [x] Phase 2: Header & Desktop Navigation
- [x] Phase 3: Footer Component
- [x] Phase 4: Mobile Navigation & Language Switcher
- [ ] Phase 5: Accessibility & E2E Validation

### Story Sign-Off

- [ ] All acceptance criteria met
- [ ] All phases validated
- [ ] Story 3.3 marked COMPLETE in EPIC_TRACKING.md

---

**Validation Checklist Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Validated By**: ____________________
**Date**: ____________________
