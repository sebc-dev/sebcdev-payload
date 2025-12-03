# Phase 2: Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Epic**: 3 - Frontend Core & Design System
**Phase**: 2 of 5
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

Create the Header component with logo, desktop navigation links, and integrate it into the frontend layout. This establishes the primary navigation structure visible on all frontend pages.

### Why This Phase Second?

1. **Foundation for user navigation**: Header is the primary navigation element users interact with
2. **Uses Phase 1 components**: DropdownMenu for Catégories and Niveaux dropdowns
3. **Layout structure**: Establishes the page shell (Header + Main + Footer)
4. **Incremental value**: Users can navigate immediately after this phase

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| Header component with logo | Mobile menu (Phase 4) |
| Desktop navigation links | Language switcher (Phase 4) |
| Category/Level dropdown menus | Footer (Phase 3) |
| i18n translations for navigation | E2E tests (Phase 5) |
| Integration into frontend layout | Accessibility validation (Phase 5) |
| Sticky header behavior | Skip link (Phase 5) |

---

## Key Deliverables

### Files to Create

| File | Purpose | Lines (est.) |
|------|---------|--------------|
| `src/components/layout/Header.tsx` | Main header with navigation | ~80 |
| `src/components/layout/Navigation.tsx` | Desktop navigation menu | ~120 |
| `src/components/layout/Logo.tsx` | Logo component | ~30 |
| `src/components/layout/index.ts` | Barrel exports | ~10 |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/app/[locale]/(frontend)/layout.tsx` | Add Header import and render | Low |
| `messages/fr.json` | Add navigation translation keys | Low |
| `messages/en.json` | Add navigation translation keys | Low |

### i18n Keys Added

```json
{
  "navigation": {
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

---

## Technical Context

### Component Architecture

```
Header (Server Component wrapper)
├── Logo (Server Component)
│   └── Link to home
└── Navigation (Client Component)
    ├── Articles link
    ├── Catégories dropdown (DropdownMenu)
    │   └── Category items → /articles?category=X
    └── Niveaux dropdown (DropdownMenu)
        └── Level items → /articles?complexity=X
```

### Why Server + Client Split?

- **Header**: Server Component wrapper for layout structure
- **Navigation**: Client Component for dropdown interactivity
- **Logo**: Server Component (static, no interactivity)

This hybrid approach minimizes client-side JavaScript while enabling interactive dropdowns.

### Design Specifications

#### Header Layout (Desktop ≥1024px)

```
┌────────────────────────────────────────────────────────────────┐
│ [sebc.dev]    │  Articles  │  Catégories ▾  │  Niveaux ▾  │    │
└────────────────────────────────────────────────────────────────┘
     Logo            Nav Link      Dropdown        Dropdown
```

#### Dropdown Expanded

```
┌────────────────────────────────────────────────────────────────┐
│ [sebc.dev]    │  Articles  │  Catégories ▾  │  Niveaux ▾  │    │
└────────────────────────────────────────────────────────────────┘
                              ┌───────────────────┐
                              │ Toutes catégories │
                              ├───────────────────┤
                              │ IA                │
                              │ UX Design         │
                              │ Ingénierie        │
                              └───────────────────┘
```

### Styling Requirements

| Element | Tailwind Classes | CSS Variable |
|---------|-----------------|--------------|
| Header background | `bg-background` | `--background` (#1A1D23) |
| Header border | `border-b border-border` | `--border` (#374151) |
| Logo text | `text-foreground font-bold` | `--foreground` |
| Nav links | `text-muted-foreground hover:text-foreground` | |
| Active link | `text-primary` | `--primary` (#14B8A6) |
| Dropdown bg | `bg-popover` | `--popover` |
| Dropdown items | `text-popover-foreground` | |

### Sticky Header Behavior

```css
header {
  position: sticky;
  top: 0;
  z-index: 50;
}
```

Ensure the header:
- Stays at top on scroll
- Has proper `z-index` above content
- Has background color (no transparency issues)

---

## Success Criteria

### Build Success

- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes
- [ ] TypeScript compilation: 0 errors

### Component Functionality

- [ ] Header renders on all frontend pages
- [ ] Logo links to `/[locale]/`
- [ ] "Articles" link navigates to `/[locale]/articles`
- [ ] Catégories dropdown opens with category options
- [ ] Niveaux dropdown opens with level options
- [ ] Dropdown items navigate to correct filtered URLs

### Visual Requirements

- [ ] Header is sticky at top of page
- [ ] Styling matches design spec (Anthracite & Vert Canard)
- [ ] Dropdowns styled correctly
- [ ] Hover states work

### i18n Requirements

- [ ] All navigation text is translated (FR/EN)
- [ ] Links use correct locale prefix
- [ ] Dropdown items translated

---

## Atomic Commit Summary

This phase uses **5 atomic commits**:

| # | Commit | Files | Purpose |
|---|--------|-------|---------|
| 1 | Create Logo component | 1 | Simple logo with home link |
| 2 | Add navigation i18n keys | 2 | Translation keys for FR/EN |
| 3 | Create Navigation component | 2 | Desktop nav with dropdowns |
| 4 | Create Header component | 2 | Header wrapper + barrel export |
| 5 | Integrate Header into layout | 1 | Add to frontend layout |

**Total estimated time**: 6-8 hours
**Total files**: 4 new, 4 modified

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Dropdown focus management issues | Medium | Medium | Use Radix DropdownMenu (handles a11y) |
| Sticky header causes layout shift | Low | Low | Reserve height, test on scroll |
| i18n key conflicts | Low | Low | Use namespaced keys (`navigation.X`) |
| Active link detection issues | Medium | Low | Use `usePathname()` from next/navigation |
| Desktop-only (mobile breaks) | Expected | None | Mobile handled in Phase 4 |

### Risk Mitigation

- **Use Radix primitives**: DropdownMenu handles keyboard navigation, focus management
- **Test incrementally**: Verify after each commit
- **Reserve header height**: Use consistent padding to prevent CLS

---

## Dependencies

### Blocking Dependencies (must complete first)

- [x] Phase 1: shadcn/ui Components (DropdownMenu available)

### What This Phase Blocks

- [ ] Phase 3: Footer Component (needs layout structure)
- [ ] Phase 4: Mobile Navigation (needs Header structure)
- [ ] Phase 5: Accessibility & E2E (needs all components)

---

## Quick Start

```bash
# 1. Ensure you're on the correct branch
git checkout epic-3-story-3.3-planning

# 2. Verify Phase 1 is complete
ls src/components/ui/dropdown-menu.tsx  # Should exist

# 3. Verify environment
pnpm install
pnpm build  # Should pass

# 4. Follow IMPLEMENTATION_PLAN.md for step-by-step commits
```

---

## Related Documents

### Story Context
- [Story 3.3 Spec](../../story_3.3.md) - Full story requirements
- [PHASES_PLAN.md](../PHASES_PLAN.md) - All 5 phases overview
- [Phase 1 INDEX.md](../phase_1/INDEX.md) - Previous phase

### Technical References
- [shadcn/ui DropdownMenu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [next-intl useTranslations](https://next-intl-docs.vercel.app/docs/usage/messages)
- [Next.js Link](https://nextjs.org/docs/app/api-reference/components/link)
- [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)

### Project Docs
- [Architecture_technique.md](../../../../../Architecture_technique.md) - Tech stack details
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Design specifications (Section 4, 7)

---

**Phase Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Previous Phase**: [Phase 1 - shadcn/ui Components](../phase_1/INDEX.md)
**Next Phase**: [Phase 3 - Footer Component](../phase_3/INDEX.md)
