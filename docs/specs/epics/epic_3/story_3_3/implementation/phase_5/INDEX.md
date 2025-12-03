# Phase 5: Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Epic**: 3 - Frontend Core & Design System
**Phase**: 5 of 5 (Final Phase)
**Status**: NOT STARTED

---

## Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy | Planning & Implementation |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklist | During each commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide | After implementation |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | During & after implementation |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | Before marking complete |

---

## Phase Overview

### Objective

Ensure WCAG 2.1 AA compliance across all navigation components, add a skip link for keyboard users, and create comprehensive E2E tests for all navigation flows. This phase validates the complete navigation system built in Phases 1-4 and marks the completion of Story 3.3.

### Why This Phase Last?

1. **All components exist**: Header, Footer, Navigation, MobileMenu, LanguageSwitcher all complete
2. **Integration complete**: Layout fully assembled with all interactive elements
3. **Validation focus**: Testing requires complete system, not partial implementations
4. **Production readiness**: This phase gates release - must pass before deployment

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| SkipLink component ("Aller au contenu principal") | Performance optimization |
| ARIA landmarks verification (banner, navigation, contentinfo) | Visual regression testing (deferred) |
| Keyboard navigation testing | Cross-browser testing beyond Chromium |
| axe-core accessibility audit | Load testing |
| E2E tests for all navigation flows | User preference persistence testing |
| Focus management validation | Animation performance |
| Screen reader compatibility checks | SEO validation (Story 6.x) |

---

## Key Deliverables

### Files to Create

| File | Purpose | Lines (est.) |
|------|---------|--------------|
| `src/components/layout/SkipLink.tsx` | Skip to content component | ~40-50 |
| `tests/e2e/navigation.e2e.spec.ts` | Navigation E2E tests | ~180-220 |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/app/[locale]/(frontend)/layout.tsx` | Add SkipLink, verify landmarks | Low |
| `src/components/layout/index.ts` | Export SkipLink | Low |
| `messages/fr.json` | Add skip link translation | Low |
| `messages/en.json` | Add skip link translation | Low |

### i18n Keys Added

```json
{
  "accessibility": {
    "skipToContent": "Aller au contenu principal",
    "mainNavigation": "Navigation principale",
    "languageSelection": "Sélection de la langue"
  }
}
```

---

## Technical Context

### SkipLink Component Architecture

```
Layout Structure (with SkipLink)
├── SkipLink (first element, visually hidden until focused)
├── Header
│   ├── Logo
│   ├── Navigation (role="navigation", aria-label)
│   ├── LanguageSwitcher
│   └── MobileMenu
├── Main (id="main-content", tabindex="-1")
│   └── {children}
└── Footer (role="contentinfo")
```

### Skip Link Behavior

| State | Visual Appearance |
|-------|-------------------|
| Default | Visually hidden (sr-only) |
| Focused (Tab) | Visible at top-left of viewport |
| Activated (Enter) | Focus moves to main content |

### ARIA Landmarks Required

| Landmark | Element | Role | aria-label |
|----------|---------|------|------------|
| Banner | `<header>` | `banner` (implicit) | N/A |
| Navigation | `<nav>` | `navigation` (implicit) | "Navigation principale" |
| Main | `<main>` | `main` (implicit) | N/A |
| Content Info | `<footer>` | `contentinfo` (implicit) | N/A |

### Keyboard Navigation Flow

```
Tab Order (Desktop):
1. Skip Link (visible on focus)
2. Logo
3. Articles link
4. Categories dropdown
5. Levels dropdown
6. Language switcher (FR)
7. Language switcher (EN)
8. Main content
9. Footer links

Tab Order (Mobile <1024px):
1. Skip Link (visible on focus)
2. Logo
3. Language switcher (FR)
4. Language switcher (EN)
5. Hamburger menu button
6. (When sheet open: navigation links, language switcher, close button)
7. Main content
8. Footer links
```

---

## Success Criteria

### Build Success

- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes
- [ ] TypeScript compilation: 0 errors

### Skip Link Functionality

- [ ] Skip link is first focusable element on page
- [ ] Skip link visible only when focused
- [ ] Skip link navigates to main content on activation
- [ ] Main content receives focus after skip link activation
- [ ] Skip link text is translated (FR/EN)

### ARIA Landmarks

- [ ] `<header>` has implicit banner role
- [ ] `<nav>` has implicit navigation role with aria-label
- [ ] `<main>` has implicit main role with id="main-content"
- [ ] `<footer>` has implicit contentinfo role
- [ ] No duplicate main landmarks
- [ ] Landmarks announced correctly by screen readers

### Keyboard Navigation

- [ ] All interactive elements reachable via Tab
- [ ] Focus order follows visual layout
- [ ] Focus visible on all elements (focus ring)
- [ ] Enter activates links and buttons
- [ ] Escape closes mobile menu and dropdowns
- [ ] Arrow keys navigate within dropdowns (if applicable)

### Accessibility Audit

- [ ] axe-core reports 0 violations on FR homepage
- [ ] axe-core reports 0 violations on EN homepage
- [ ] axe-core reports 0 violations with mobile menu open
- [ ] Color contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Lighthouse accessibility score ≥ 95

### E2E Tests

- [ ] All navigation tests pass
- [ ] Tests cover both locales (FR/EN)
- [ ] Tests cover both viewports (mobile/desktop)
- [ ] Tests validate accessibility assertions

---

## Atomic Commit Summary

This phase uses **4 atomic commits**:

| # | Commit | Files | Purpose |
|---|--------|-------|---------|
| 1 | Add i18n keys for accessibility | 2 | Translation keys for skip link and ARIA labels |
| 2 | Create SkipLink component | 1 | Skip to content functionality |
| 3 | Integrate SkipLink and verify landmarks | 2 | Add to layout, ensure correct roles |
| 4 | Add navigation E2E tests | 1 | Comprehensive test suite |

**Total estimated time**: 4-5 hours
**Total files**: 2 new, 4 modified

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| axe-core violations from existing code | Medium | High | Fix incrementally, prioritize critical |
| Focus management issues | Low | Medium | Use native HTML elements, minimal JS |
| Test flakiness with animations | Medium | Low | Add proper waits, use Playwright best practices |
| Landmark conflicts with admin | Low | Low | Admin is isolated route group |
| E2E test timeouts | Low | Medium | Increase timeouts, optimize waits |

### Risk Mitigation

1. **Run axe early**: Check for violations before writing tests
2. **Use semantic HTML**: Prefer implicit roles over explicit ARIA
3. **Test incrementally**: Validate after each commit
4. **Playwright best practices**: Use locators, not CSS selectors

---

## Dependencies

### Blocking Dependencies (must complete first)

- [x] Phase 1: shadcn/ui Components (Sheet, DropdownMenu installed)
- [x] Phase 2: Header & Desktop Navigation (Header, Navigation exist)
- [x] Phase 3: Footer Component (Footer exists)
- [x] Phase 4: Mobile Navigation & Language Switcher (MobileMenu, LanguageSwitcher exist)

### What This Phase Completes

- [x] Story 3.3: Layout Global & Navigation (FINAL PHASE)
- [x] Epic 3 Progress: Story 3.3 complete (check Epic status)

---

## Quick Start

```bash
# 1. Ensure you're on the correct branch
git checkout epic-3-story-3.3-planning

# 2. Verify Phase 4 is complete
ls src/components/layout/MobileMenu.tsx      # Should exist
ls src/components/layout/LanguageSwitcher.tsx # Should exist

# 3. Verify current accessibility baseline
pnpm test:e2e -- --grep "Accessibility"  # Check existing axe tests pass

# 4. Verify environment
pnpm install
pnpm build  # Should pass

# 5. Follow IMPLEMENTATION_PLAN.md for step-by-step commits
```

---

## Related Documents

### Story Context
- [Story 3.3 Spec](../../story_3.3.md) - Full story requirements
- [PHASES_PLAN.md](../PHASES_PLAN.md) - All 5 phases overview
- [Phase 4 INDEX.md](../phase_4/INDEX.md) - Previous phase

### Technical References
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Landmarks Example](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)

### Project Docs
- [Architecture_technique.md](../../../../../Architecture_technique.md) - Tech stack details
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Design specifications
- [CI-CD Security Architecture](../../../../../CI-CD-Security.md) - Quality gates

---

## E2E Test Coverage Summary

### Test Scenarios

| Scenario | Locale | Viewport | Description |
|----------|--------|----------|-------------|
| Header visibility | FR, EN | Desktop, Mobile | Header renders on all pages |
| Navigation links | FR, EN | Desktop | Links work correctly |
| Mobile menu | FR, EN | Mobile | Sheet opens/closes, links work |
| Language switcher | FR, EN | Desktop, Mobile | Locale changes, URL preserved |
| Skip link | FR, EN | Desktop | Skip link focuses main content |
| Keyboard navigation | FR | Desktop | Tab order correct |
| axe-core audit | FR, EN | Desktop | WCAG 2.1 AA compliance |

### Expected Test Count

- Navigation tests: ~10-12 tests
- Accessibility tests: ~6-8 tests
- Total: ~16-20 tests

---

**Phase Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Previous Phase**: [Phase 4 - Mobile Navigation & Language Switcher](../phase_4/INDEX.md)
**Story Completion**: This is the final phase of Story 3.3
