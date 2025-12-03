# Phase 1: shadcn/ui Navigation Components

**Story**: 3.3 - Layout Global & Navigation
**Epic**: 3 - Frontend Core & Design System
**Phase**: 1 of 5
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

Install and configure the shadcn/ui components required for the navigation system (DropdownMenu, Sheet). These components are prerequisites for Phase 2 (Header) and Phase 4 (Mobile Menu).

### Why This Phase First?

1. **Foundation for navigation**: DropdownMenu enables the Catégories and Niveaux dropdowns
2. **Mobile menu requirement**: Sheet component is essential for the mobile hamburger menu
3. **Zero breaking changes**: Adding shadcn components is additive, no existing code modified
4. **Quick validation**: Can verify components work before building custom navigation

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| Install DropdownMenu component | Custom navigation components |
| Install Sheet component | Header/Footer implementation |
| Verify Radix UI dependencies | Mobile menu logic |
| Test component rendering | Language switcher |
| Ensure build succeeds | i18n translations |

---

## Key Deliverables

### Files to Create

| File | Purpose | Lines (est.) |
|------|---------|--------------|
| `src/components/ui/dropdown-menu.tsx` | Dropdown component from shadcn | ~150 |
| `src/components/ui/sheet.tsx` | Sheet/Drawer component from shadcn | ~130 |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `package.json` | Add Radix UI peer dependencies | Low |
| `src/app/(payload)/admin/importMap.js` | Verify no conflicts | Low |

### Dependencies Added

```json
{
  "@radix-ui/react-dropdown-menu": "^2.1.x",
  "@radix-ui/react-dialog": "^1.1.x"
}
```

---

## Technical Context

### Why shadcn/ui?

- **Copy-paste model**: Components are copied into your codebase, fully customizable
- **Radix primitives**: Built on accessible Radix UI primitives
- **Tailwind v4 compatible**: Works with the new CSS-based Tailwind configuration
- **Dark mode ready**: Supports CSS variables for theming

### Component Relationships

```
shadcn/ui DropdownMenu
    └── @radix-ui/react-dropdown-menu
        └── @radix-ui/react-primitive
        └── @radix-ui/react-popper

shadcn/ui Sheet
    └── @radix-ui/react-dialog
        └── @radix-ui/react-primitive
        └── @radix-ui/react-focus-scope
        └── @radix-ui/react-dismissable-layer
```

### Existing shadcn/ui Components

Currently installed:
- `button.tsx` - Base button component

After this phase:
- `button.tsx`
- `dropdown-menu.tsx` (NEW)
- `sheet.tsx` (NEW)

---

## Success Criteria

### Build Success

- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes
- [ ] TypeScript compilation: 0 errors

### Component Functionality

- [ ] DropdownMenu renders without errors
- [ ] Sheet opens and closes correctly
- [ ] Dark mode styling applies correctly
- [ ] Keyboard navigation works (Tab, Enter, Escape)

### No Regressions

- [ ] Admin panel still loads (`/admin`)
- [ ] Frontend pages still work
- [ ] Existing button component unaffected

---

## Atomic Commit Summary

This phase uses **3 atomic commits**:

| # | Commit | Files | Purpose |
|---|--------|-------|---------|
| 1 | Install DropdownMenu | 2 | Add dropdown component and dependencies |
| 2 | Install Sheet | 2 | Add sheet component and dependencies |
| 3 | Verify integration | 0 | Build verification, no file changes |

**Total estimated time**: 2-3 hours
**Total files**: 2 new, 1 modified

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Radix version conflict | Low | Medium | Use latest compatible versions |
| Tailwind v4 incompatibility | Low | Medium | Verify CSS variables work |
| Build failure | Very Low | High | Run build after each commit |

---

## Dependencies

### Blocking Dependencies (must complete first)

- [x] Story 3.2 Phase 1-3 (Tailwind, shadcn/ui initialized)

### What This Phase Blocks

- [ ] Phase 2: Header & Desktop Navigation (needs DropdownMenu)
- [ ] Phase 4: Mobile Navigation (needs Sheet)

---

## Quick Start

```bash
# 1. Ensure you're on the correct branch
git checkout epic-3-story-3.3-planning

# 2. Verify environment
pnpm install
pnpm build  # Should pass

# 3. Follow IMPLEMENTATION_PLAN.md for step-by-step commits
```

---

## Related Documents

### Story Context
- [Story 3.3 Spec](../../story_3.3.md) - Full story requirements
- [PHASES_PLAN.md](../PHASES_PLAN.md) - All 5 phases overview

### Technical References
- [shadcn/ui DropdownMenu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [shadcn/ui Sheet](https://ui.shadcn.com/docs/components/sheet)
- [Radix Dropdown Docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)
- [Radix Dialog Docs](https://www.radix-ui.com/primitives/docs/components/dialog)

### Project Docs
- [Architecture_technique.md](../../../../../Architecture_technique.md) - Tech stack details
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Design specifications

---

**Phase Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Next Phase**: [Phase 2 - Header & Desktop Navigation](../phase_2/INDEX.md)
