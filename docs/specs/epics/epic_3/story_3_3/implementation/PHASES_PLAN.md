# Story 3.3 - Phases Implementation Plan

**Story**: Layout Global & Navigation
**Epic**: 3 - Frontend Core & Design System
**Created**: 2025-12-03
**Status**: 🚧 IN PROGRESS (Phase 1 Complete)

---

## 📖 Story Overview

### Original Story Specification

**Location**: `docs/specs/epics/epic_3/story_3_3/story_3.3.md`

**Story Objective**: Implémenter la structure de navigation globale du site sebc.dev avec un Header sticky responsive, un Footer cohérent, et un sélecteur de langue fonctionnel (FR/EN). Cette story établit le "shell" de l'application frontend que tous les utilisateurs verront sur chaque page.

Le Header inclura:
- Logo avec lien vers l'accueil
- Navigation principale (Articles, Catégories, Niveaux)
- Sélecteur de langue FR/EN
- Menu hamburger responsive pour mobile

Le Footer inclura:
- Informations de copyright
- Liens de navigation secondaires
- Design cohérent avec la charte graphique

**Acceptance Criteria**:

- Header s'affiche sur toutes les pages frontend avec logo, navigation et sélecteur de langue
- Navigation principale avec liens vers Articles, dropdowns pour Catégories et Niveaux
- Sélecteur de langue fonctionnel qui préserve la page actuelle et persiste la préférence
- Footer s'affiche sur toutes les pages avec copyright et liens secondaires
- Layout responsive avec menu hamburger sur mobile
- Accessibilité WCAG 2.1 AA (navigation clavier, skip link, ARIA landmarks)

**User Value**: Les utilisateurs peuvent naviguer facilement sur le site dans leur langue préférée avec une interface cohérente et accessible. La structure de navigation claire permet de découvrir le contenu rapidement (time-to-value < 60s).

---

## 🎯 Phase Breakdown Strategy

### Why 5 Phases?

Cette story est décomposée en **5 phases atomiques** basée sur:

✅ **Technical dependencies**:
- shadcn/ui components (DropdownMenu, Sheet) must be installed before building navigation
- Header must exist before integrating language switcher
- Mobile menu requires Sheet component
- Layout integration requires all components ready

✅ **Risk mitigation**:
- Phase 1 adds dependencies safely without breaking existing code
- Each component is tested independently before integration
- Final phase validates accessibility comprehensively

✅ **Incremental value**:
- Phase 1: shadcn components ready for use
- Phase 2: Visible Header on all pages
- Phase 3: Functional Footer completing the layout
- Phase 4: Full mobile experience
- Phase 5: Accessibility validated, production-ready

✅ **Team capacity**:
- Phases sized for 1-2 days of work
- Each phase reviewable in under 1 hour
- Clear milestones for progress tracking

✅ **Testing strategy**:
- Unit tests per component after each phase
- E2E tests build progressively
- Accessibility audit in final phase

### Atomic Phase Principles

Each phase follows these principles:

- **Independent**: Can be implemented and tested separately
- **Deliverable**: Produces tangible, working functionality
- **Sized appropriately**: 1-2 days of work per phase
- **Low coupling**: Minimal dependencies between phases
- **High cohesion**: All work in phase serves single objective

### Implementation Approach

```
Phase 1: shadcn/ui Components
    │
    ▼
Phase 2: Header & Desktop Navigation
    │
    ▼
Phase 3: Footer Component
    │
    ▼
Phase 4: Mobile Navigation & Language Switcher
    │
    ▼
Phase 5: Accessibility & E2E Validation
```

---

## 📦 Phases Summary

### Phase 1: shadcn/ui Navigation Components

**Objective**: Install and configure the shadcn/ui components required for navigation (DropdownMenu, Sheet, NavigationMenu).

**Scope**:
- Install `DropdownMenu` component via shadcn CLI
- Install `Sheet` component for mobile menu
- Verify Radix UI peer dependencies
- Test components render correctly

**Dependencies**:
- Story 3.2 Phase 1-3 ✅ (Tailwind, shadcn/ui initialized)

**Key Deliverables**:
- [ ] `src/components/ui/dropdown-menu.tsx` installed
- [ ] `src/components/ui/sheet.tsx` installed
- [ ] Dependencies added to package.json
- [ ] Components import and render without errors
- [ ] Build succeeds

**Files Affected** (~4 files):

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add Radix UI dependencies |
| `src/components/ui/dropdown-menu.tsx` | Create | Dropdown component |
| `src/components/ui/sheet.tsx` | Create | Sheet component for mobile |
| `src/app/(payload)/admin/importMap.js` | Verify | No conflicts with admin |

**Estimated Complexity**: Low
**Estimated Duration**: 0.5 days (2-3 commits)
**Risk Level**: 🟢 Low

**Success Criteria**:
- [ ] `npx shadcn@latest add dropdown-menu` succeeds
- [ ] `npx shadcn@latest add sheet` succeeds
- [ ] `pnpm build` succeeds
- [ ] Components can be imported in a test page

**Technical Notes**:
- shadcn/ui components are copy-pasted, not npm dependencies
- DropdownMenu uses Radix UI Dropdown primitives
- Sheet uses Radix UI Dialog primitives
- Ensure dark mode styling applies correctly

---

### Phase 2: Header & Desktop Navigation

**Objective**: Create the Header component with logo, desktop navigation links, and integrate into frontend layout.

**Scope**:
- Create `Header` component with logo and navigation
- Create `Navigation` component for desktop menu
- Add i18n translation keys for navigation
- Integrate Header into frontend layout
- Style with design tokens (Anthracite & Vert Canard)

**Dependencies**:
- Phase 1 (DropdownMenu component available)

**Key Deliverables**:
- [ ] `src/components/layout/Header.tsx` created
- [ ] `src/components/layout/Navigation.tsx` created
- [ ] `src/components/layout/index.ts` barrel export
- [ ] Navigation i18n keys added to `messages/fr.json` and `messages/en.json`
- [ ] Header integrated in `src/app/[locale]/(frontend)/layout.tsx`
- [ ] Header is sticky with correct styling
- [ ] Navigation links functional (Articles, Catégories dropdown, Niveaux dropdown)

**Files Affected** (~8 files):

| File | Action | Purpose |
|------|--------|---------|
| `src/components/layout/Header.tsx` | Create | Main header component |
| `src/components/layout/Navigation.tsx` | Create | Desktop navigation menu |
| `src/components/layout/index.ts` | Create | Barrel exports |
| `src/app/[locale]/(frontend)/layout.tsx` | Modify | Add Header to layout |
| `messages/fr.json` | Modify | Add navigation translations |
| `messages/en.json` | Modify | Add navigation translations |
| `src/components/layout/Logo.tsx` | Create | Logo component (optional) |

**Estimated Complexity**: Medium
**Estimated Duration**: 1.5 days (4-5 commits)
**Risk Level**: 🟡 Medium

**Risk Factors**:
- Desktop navigation dropdowns may have focus management issues
- Sticky header may cause layout shift

**Mitigation Strategies**:
- Use Radix DropdownMenu for accessible dropdowns
- Add proper height reservation for sticky header
- Test with keyboard navigation

**Success Criteria**:
- [ ] Header visible on all frontend pages
- [ ] Logo links to `/[locale]/`
- [ ] "Articles" link navigates to `/[locale]/articles`
- [ ] Catégories dropdown shows category options
- [ ] Niveaux dropdown shows level options
- [ ] Header is sticky on scroll
- [ ] Styling matches design spec
- [ ] Build succeeds

**Technical Notes**:
- Header should be a Server Component with Client Component children for interactivity
- Use `usePathname()` from next/navigation for active link detection
- Dropdowns should navigate to `/articles?category=X` or `/articles?complexity=X`
- Logo: Simple text "sebc.dev" or SVG (TBD - can use text for V1)

---

### Phase 3: Footer Component

**Objective**: Create the Footer component with copyright, secondary navigation, and integrate into layout.

**Scope**:
- Create `Footer` component
- Add footer-specific i18n keys
- Integrate Footer into frontend layout
- Style with design tokens
- Ensure responsive layout

**Dependencies**:
- Phase 2 (Layout structure established)

**Key Deliverables**:
- [ ] `src/components/layout/Footer.tsx` created
- [ ] Footer i18n keys added to messages
- [ ] Footer integrated in frontend layout
- [ ] Footer styling matches design spec
- [ ] Footer is responsive (stacks on mobile)

**Files Affected** (~4 files):

| File | Action | Purpose |
|------|--------|---------|
| `src/components/layout/Footer.tsx` | Create | Footer component |
| `src/app/[locale]/(frontend)/layout.tsx` | Modify | Add Footer to layout |
| `messages/fr.json` | Modify | Add footer translations |
| `messages/en.json` | Modify | Add footer translations |

**Estimated Complexity**: Low
**Estimated Duration**: 1 day (3-4 commits)
**Risk Level**: 🟢 Low

**Success Criteria**:
- [ ] Footer visible on all frontend pages
- [ ] Copyright displays current year dynamically
- [ ] Secondary navigation links work
- [ ] Footer stacks vertically on mobile
- [ ] Build succeeds

**Technical Notes**:
- Footer can be a Server Component (no interactivity needed)
- Use `{new Date().getFullYear()}` for dynamic year
- Links: Articles, Contact (mailto or placeholder)
- Consider adding social links placeholder for future

---

### Phase 4: Mobile Navigation & Language Switcher

**Objective**: Implement responsive mobile menu using Sheet component and functional language switcher.

**Scope**:
- Create `MobileMenu` component using Sheet
- Create `LanguageSwitcher` component
- Add hamburger menu button to Header (mobile only)
- Implement language switching with URL preservation
- Responsive breakpoints (desktop ≥1024px, mobile <1024px)

**Dependencies**:
- Phase 1 (Sheet component)
- Phase 2 (Header structure)

**Key Deliverables**:
- [ ] `src/components/layout/MobileMenu.tsx` created
- [ ] `src/components/layout/LanguageSwitcher.tsx` created
- [ ] Hamburger button visible on mobile, hidden on desktop
- [ ] Sheet opens with navigation links on mobile
- [ ] Language switcher toggles FR/EN
- [ ] URL updates on language change (preserves current page)
- [ ] Language preference persisted via cookie

**Files Affected** (~5 files):

| File | Action | Purpose |
|------|--------|---------|
| `src/components/layout/MobileMenu.tsx` | Create | Mobile navigation sheet |
| `src/components/layout/LanguageSwitcher.tsx` | Create | FR/EN toggle |
| `src/components/layout/Header.tsx` | Modify | Add mobile menu trigger, language switcher |
| `messages/fr.json` | Modify | Add language switcher translations |
| `messages/en.json` | Modify | Add language switcher translations |

**Estimated Complexity**: Medium
**Estimated Duration**: 1.5 days (4-5 commits)
**Risk Level**: 🟡 Medium

**Risk Factors**:
- Language switching may cause full page reload
- Mobile menu focus trap needs careful implementation
- Cookie handling for language preference

**Mitigation Strategies**:
- Use `next-intl` Link component for locale switching
- Radix Sheet handles focus trap automatically
- Use `next-intl` built-in cookie handling

**Success Criteria**:
- [ ] Hamburger icon visible on mobile (<1024px)
- [ ] Desktop navigation hidden on mobile
- [ ] Mobile menu opens as Sheet from right
- [ ] All navigation links work in mobile menu
- [ ] Language switcher visible on both mobile and desktop
- [ ] Language change updates URL without full reload (if possible)
- [ ] Language preference remembered on next visit
- [ ] Build succeeds

**Technical Notes**:
- Use `useLocale()` and `usePathname()` from next-intl
- Language switcher should use `Link` with `locale` prop
- Mobile menu should close on navigation
- Consider adding close button and overlay click to close

---

### Phase 5: Accessibility & E2E Validation

**Objective**: Ensure WCAG 2.1 AA compliance, add skip link, and comprehensive E2E tests.

**Scope**:
- Add skip link ("Aller au contenu principal")
- Verify ARIA landmarks (banner, navigation, contentinfo)
- Keyboard navigation testing
- axe-core accessibility audit
- E2E tests for all navigation flows
- Visual regression baseline

**Dependencies**:
- Phases 1-4 (all components complete)

**Key Deliverables**:
- [ ] Skip link component added to layout
- [ ] ARIA landmarks verified (role="banner", role="navigation", role="contentinfo")
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- [ ] axe-core audit passes with no violations
- [ ] E2E tests for Header, Footer, Navigation, Language Switcher, Mobile Menu
- [ ] Visual tests baseline captured

**Files Affected** (~5 files):

| File | Action | Purpose |
|------|--------|---------|
| `src/components/layout/SkipLink.tsx` | Create | Skip to content link |
| `src/app/[locale]/(frontend)/layout.tsx` | Modify | Add skip link, verify landmarks |
| `tests/e2e/navigation.e2e.spec.ts` | Create | Navigation E2E tests |
| `tests/e2e/layout.e2e.spec.ts` | Create | Layout E2E tests |
| `messages/fr.json` | Modify | Add skip link translation |
| `messages/en.json` | Modify | Add skip link translation |

**Estimated Complexity**: Medium
**Estimated Duration**: 1 day (3-4 commits)
**Risk Level**: 🟡 Medium

**Risk Factors**:
- Accessibility issues may require component refactoring
- E2E tests may reveal navigation bugs

**Mitigation Strategies**:
- Run axe-core early in phase
- Fix issues incrementally
- Use Playwright's built-in accessibility assertions

**Success Criteria**:
- [ ] Skip link visible on focus, navigates to main content
- [ ] All ARIA landmarks present and correct
- [ ] Tab navigation follows logical order
- [ ] Escape closes mobile menu and dropdowns
- [ ] axe-core reports 0 violations
- [ ] All E2E tests pass
- [ ] Lighthouse accessibility score ≥ 95
- [ ] Build succeeds

**Technical Notes**:
- Skip link: visually hidden, visible on focus
- Use `<header role="banner">`, `<nav role="navigation">`, `<footer role="contentinfo">`
- Test with VoiceOver/NVDA simulation if possible
- E2E tests should cover: navigation links, dropdowns, mobile menu, language switch

---

## 🔄 Implementation Order & Dependencies

### Dependency Graph

```
Phase 1 (shadcn/ui Components)
    │
    ├───────────────────┐
    ▼                   ▼
Phase 2 (Header)     [parallel possible but not recommended]
    │
    ▼
Phase 3 (Footer)
    │
    ▼
Phase 4 (Mobile & Language)
    │
    ▼
Phase 5 (Accessibility & E2E)
```

### Critical Path

**Must follow this order**:
1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

**Parallelization opportunities**: Limited due to tight integration

### Blocking Dependencies

| Phase | Blocks | Reason |
|-------|--------|--------|
| Phase 1 | Phase 2, 4 | DropdownMenu needed for navigation, Sheet needed for mobile |
| Phase 2 | Phase 3, 4 | Header structure needed for Footer integration and mobile menu |
| Phase 3 | Phase 5 | Layout must be complete before final validation |
| Phase 4 | Phase 5 | All components must exist for comprehensive testing |

---

## 📊 Timeline & Resource Estimation

### Overall Estimates

| Metric | Estimate | Notes |
|--------|----------|-------|
| **Total Phases** | 5 | Atomic, sequential phases |
| **Total Duration** | 5-6 days | Sequential implementation |
| **Total Commits** | ~16-21 | Across all phases |
| **Total Files** | ~12 new, ~6 modified | Estimated |
| **Test Coverage Target** | >80% | Components + E2E |

### Per-Phase Timeline

| Phase | Duration | Commits | Start After | Blocks |
|-------|----------|---------|-------------|--------|
| 1. shadcn/ui Components | 0.5d | 2-3 | Story 3.2 Phase 3 | Phase 2, 4 |
| 2. Header & Navigation | 1.5d | 4-5 | Phase 1 | Phase 3, 4 |
| 3. Footer Component | 1d | 3-4 | Phase 2 | Phase 5 |
| 4. Mobile & Language | 1.5d | 4-5 | Phase 2 | Phase 5 |
| 5. Accessibility & E2E | 1d | 3-4 | Phase 3, 4 | - |

### Resource Requirements

**Team Composition**:
- 1 developer: Frontend/React expertise
- 1 reviewer: Component and accessibility review

**External Dependencies**:
- Radix UI (via shadcn/ui)
- next-intl (already installed)
- Lucide icons (for hamburger menu icon)

---

## ⚠️ Risk Assessment

### High-Risk Areas

**Phase 4: Mobile Navigation & Language Switcher** 🟡

- **Risk**: Language switching may cause unexpected navigation issues
- **Impact**: Poor UX, broken navigation flow
- **Mitigation**: Use next-intl's built-in locale switching, test thoroughly
- **Contingency**: Fallback to simple link-based language switch

### Overall Story Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Radix/shadcn compatibility issues | Low | Medium | Use latest versions, check docs |
| Sticky header CLS | Medium | Low | Reserve height, test on slow connections |
| Mobile menu focus issues | Low | Medium | Use Radix Sheet (handles focus) |
| Accessibility violations | Medium | High | Run axe-core early and often |
| Language switch breaks navigation | Low | High | Test all pages with both locales |

### Risk Mitigation Summary

1. **Test incrementally**: Build and test after each phase
2. **Use proven components**: Radix UI handles a11y edge cases
3. **Mobile-first testing**: Test on real mobile devices
4. **axe-core integration**: Add to CI if not already present

---

## 🧪 Testing Strategy

### Test Coverage by Phase

| Phase | Unit Tests | Integration Tests | E2E Tests |
|-------|------------|-------------------|-----------|
| 1. shadcn Components | - | Component render | - |
| 2. Header & Navigation | 3-4 tests | Navigation links | - |
| 3. Footer | 2-3 tests | Layout integration | - |
| 4. Mobile & Language | 4-5 tests | Sheet behavior | - |
| 5. Accessibility | - | axe-core | 8-10 tests |

### Test Milestones

- **After Phase 1**: shadcn components render without errors
- **After Phase 2**: Header visible, navigation links work
- **After Phase 3**: Full layout visible (Header + Main + Footer)
- **After Phase 4**: Mobile menu works, language switching works
- **After Phase 5**: All E2E tests pass, accessibility validated

### Quality Gates

Each phase must pass:
- [ ] Build succeeds (`pnpm build`)
- [ ] Linter passes (`pnpm lint`)
- [ ] TypeScript no errors
- [ ] Code review approved
- [ ] Visual inspection on desktop and mobile

### E2E Test Scenarios (Phase 5)

```typescript
// tests/e2e/navigation.e2e.spec.ts
describe('Navigation', () => {
  test('header is visible on homepage', async ({ page }) => {
    await page.goto('/fr')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/fr')
    await page.click('text=Articles')
    await expect(page).toHaveURL('/fr/articles')
  })

  test('language switcher changes locale', async ({ page }) => {
    await page.goto('/fr')
    await page.click('text=EN')
    await expect(page).toHaveURL('/en')
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/fr')
    await page.click('[aria-label="Open menu"]')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.click('[aria-label="Close menu"]')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('skip link navigates to main content', async ({ page }) => {
    await page.goto('/fr')
    await page.keyboard.press('Tab')
    await expect(page.getByText('Aller au contenu principal')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/fr')
    // Tab through navigation
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // First nav item
    await expect(page.getByRole('link', { name: 'Articles' })).toBeFocused()
  })

  test('axe accessibility audit passes', async ({ page }) => {
    await page.goto('/fr')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
```

---

## 📝 Phase Documentation Strategy

### Documentation to Generate per Phase

For each phase, use the `phase-doc-generator` skill to create:

1. INDEX.md
2. IMPLEMENTATION_PLAN.md
3. COMMIT_CHECKLIST.md
4. ENVIRONMENT_SETUP.md
5. guides/REVIEW.md
6. guides/TESTING.md
7. validation/VALIDATION_CHECKLIST.md

**Estimated documentation**: ~3400 lines per phase × 5 phases = **~17,000 lines**

### Story-Level Documentation

**This document** (PHASES_PLAN.md):
- Strategic overview
- Phase coordination
- Cross-phase dependencies
- Overall timeline

**Phase-level documentation** (generated separately):
- Tactical implementation details
- Commit-by-commit checklists
- Specific technical validations

---

## 🚀 Next Steps

### Immediate Actions

1. **Review this plan** with the team
   - Validate 5-phase breakdown
   - Adjust estimates if needed
   - Confirm component approach (shadcn vs custom)

2. **Wait for Story 3.2 Phase 4 completion** (optional)
   - Story 3.2 is 3/4 complete
   - Phase 4 is accessibility validation
   - Can start Story 3.3 Phase 1 before 3.2 completes (no blocking dependency)

3. **Generate detailed documentation for Phase 1**
   - Use: `/generate-phase-doc Epic 3 Story 3.3 Phase 1`
   - Or request: "Generate implementation docs for Phase 1"

### Implementation Workflow

For each phase:

1. **Plan** (if not done):
   - Read PHASES_PLAN.md for phase overview
   - Generate detailed docs with `phase-doc-generator`

2. **Implement**:
   - Follow IMPLEMENTATION_PLAN.md
   - Use COMMIT_CHECKLIST.md for each commit
   - Validate after each commit

3. **Review**:
   - Use guides/REVIEW.md
   - Ensure all success criteria met

4. **Validate**:
   - Complete validation/VALIDATION_CHECKLIST.md
   - Update this plan with actual metrics

5. **Move to next phase**:
   - Repeat process for next phase

### Progress Tracking

Update this document as phases complete:

- [x] Phase 1: shadcn/ui Components - ✅ COMPLETE (2025-12-03)
- [ ] Phase 2: Header & Desktop Navigation - ⬜ Not Started
- [ ] Phase 3: Footer Component - ⬜ Not Started
- [ ] Phase 4: Mobile Navigation & Language Switcher - ⬜ Not Started
- [ ] Phase 5: Accessibility & E2E Validation - ⬜ Not Started

---

## 📊 Success Metrics

### Story Completion Criteria

This story is considered complete when:

- [ ] All 5 phases implemented and validated
- [ ] All acceptance criteria from story spec met
- [ ] Header visible and functional on all frontend pages
- [ ] Footer visible and functional on all frontend pages
- [ ] Language switcher works (FR↔EN)
- [ ] Mobile menu works on mobile viewports
- [ ] WCAG 2.1 AA compliance verified
- [ ] All E2E tests pass
- [ ] No critical bugs remaining
- [ ] Build succeeds on Cloudflare Workers

### Quality Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Build Success | ✅ | - |
| Lighthouse Accessibility | ≥ 95 | - |
| Lighthouse Performance | ≥ 90 | - |
| axe-core Violations | 0 | - |
| E2E Tests Pass | 100% | - |
| Mobile Responsiveness | ✅ | - |

---

## 📚 Reference Documents

### Story Specification
- Story spec: `docs/specs/epics/epic_3/story_3_3/story_3.3.md`

### Related Documentation
- [PRD.md](../../../../PRD.md) - Story 3.3 description
- [UX_UI_Spec.md](../../../../UX_UI_Spec.md) - Section 4: Navigation and Breadcrumbs, Section 7: Design System
- [EPIC_TRACKING.md](../../EPIC_TRACKING.md) - Epic 3 progress
- [Story 3.1 spec](../story_3_1/story_3.1.md) - i18n Routing (dependency)
- [Story 3.2 spec](../story_3_2/story_3.2.md) - Design System (dependency)

### External References
- [shadcn/ui DropdownMenu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [shadcn/ui Sheet](https://ui.shadcn.com/docs/components/sheet)
- [next-intl Navigation](https://next-intl-docs.vercel.app/docs/routing/navigation)
- [Radix Accessibility](https://www.radix-ui.com/docs/primitives/overview/accessibility)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Generated Phase Documentation

- Phase 1: `implementation/phase_1/INDEX.md` (to generate)
- Phase 2: `implementation/phase_2/INDEX.md` (to generate)
- Phase 3: `implementation/phase_3/INDEX.md` (to generate)
- Phase 4: `implementation/phase_4/INDEX.md` (to generate)
- Phase 5: `implementation/phase_5/INDEX.md` (to generate)

---

**Plan Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Created by**: Claude Code (story-phase-planner skill)
**Story Status**: 📋 PLANNING
