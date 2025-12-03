# Phase 4: Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Epic**: 3 - Frontend Core & Design System
**Phase**: 4 of 5
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

Implement responsive mobile navigation using the Sheet component and create a functional language switcher (FR/EN) that preserves the current page URL. This phase completes the responsive navigation experience, ensuring users on all device sizes can navigate the site and switch languages seamlessly.

### Why This Phase Fourth?

1. **Prerequisites ready**: Sheet component installed (Phase 1), Header exists (Phase 2), Layout complete (Phase 3)
2. **Mobile experience critical**: Hamburger menu required for mobile usability
3. **Language switching**: Core i18n feature completing the user experience
4. **Foundation for Phase 5**: All interactive components must exist before accessibility testing

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| MobileMenu component using Sheet | Search functionality |
| LanguageSwitcher component (FR/EN toggle) | User preferences persistence beyond cookie |
| Hamburger menu button in Header | Dark/light mode toggle |
| Mobile navigation links (all nav items) | Breadcrumbs |
| Language persistence via next-intl cookie | More than 2 languages |
| Responsive breakpoints (1024px) | Animated transitions beyond Radix defaults |
| Sheet close on navigation | Notification badges |

---

## Key Deliverables

### Files to Create

| File | Purpose | Lines (est.) |
|------|---------|--------------|
| `src/components/layout/MobileMenu.tsx` | Mobile navigation sheet | ~80-100 |
| `src/components/layout/LanguageSwitcher.tsx` | FR/EN language toggle | ~50-60 |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/components/layout/Header.tsx` | Add MobileMenu trigger, LanguageSwitcher | Medium |
| `src/components/layout/index.ts` | Add new exports | Low |
| `messages/fr.json` | Add language switcher & mobile menu keys | Low |
| `messages/en.json` | Add language switcher & mobile menu keys | Low |

### i18n Keys Added

```json
{
  "language": {
    "switch": "Changer de langue",
    "current": "Langue actuelle",
    "fr": "Français",
    "en": "English"
  },
  "mobileMenu": {
    "open": "Ouvrir le menu",
    "close": "Fermer le menu"
  }
}
```

---

## Technical Context

### Component Architecture

```
Header (Server Component with Client children)
├── Logo (existing)
├── Navigation (existing - desktop only, hidden <1024px)
├── LanguageSwitcher (new - Client Component)
│   ├── Current locale display
│   └── Toggle button (FR ↔ EN)
└── MobileMenu (new - Client Component)
    ├── Hamburger trigger (visible <1024px)
    └── Sheet (Radix UI)
        ├── Close button
        ├── Navigation links (stacked)
        │   ├── Home link
        │   ├── Articles link
        │   ├── Categories link
        │   └── Levels link
        └── Language switcher
```

### Why Client Components?

**MobileMenu** and **LanguageSwitcher** must be Client Components because:
- MobileMenu: Sheet requires client-side state for open/close
- LanguageSwitcher: Uses `usePathname()` and `useLocale()` hooks
- Both need event handlers for user interactions

### Responsive Strategy

```
Viewport Width    Header Layout
─────────────────────────────────────────
<1024px (mobile)  Logo | [LanguageSwitcher] | [Hamburger ☰]
                  Navigation hidden
                  MobileMenu available

≥1024px (desktop) Logo | Navigation | LanguageSwitcher
                  Hamburger hidden
                  Full navigation visible
```

### Design Specifications

#### Mobile Header Layout (<1024px)

```
┌────────────────────────────────────────┐
│ [Logo]              [FR/EN]    [☰]     │
└────────────────────────────────────────┘
```

#### Mobile Menu (Sheet from right)

```
┌────────────────────────────────────────┐
│                              [X Close] │
├────────────────────────────────────────┤
│  Accueil                               │
│  Articles                              │
│  Catégories                            │
│  Niveaux                               │
├────────────────────────────────────────┤
│  [FR] [EN]                             │
└────────────────────────────────────────┘
```

#### Desktop Header Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] │ Articles │ Catégories ▾ │ Niveaux ▾ │ [FR/EN] │
└─────────────────────────────────────────────────────────┘
```

### Language Switcher Behavior

| Action | Result |
|--------|--------|
| User on `/fr/articles` clicks "EN" | Navigate to `/en/articles` |
| User on `/en` clicks "FR" | Navigate to `/fr` |
| Language preference | Stored in cookie by next-intl |
| Page reload | Not required (client-side navigation) |

### Sheet Component Usage

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

// Sheet opens from right side
// SheetContent: contains navigation
// SheetTrigger: hamburger button
// SheetClose: close button and nav link wrappers
```

---

## Success Criteria

### Build Success

- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes
- [ ] TypeScript compilation: 0 errors

### Mobile Navigation Functionality

- [ ] Hamburger icon visible on mobile (<1024px)
- [ ] Desktop navigation hidden on mobile
- [ ] Hamburger click opens Sheet from right
- [ ] Sheet contains all navigation links
- [ ] Navigation links work in mobile menu
- [ ] Sheet closes after clicking a link
- [ ] Close button (X) closes sheet
- [ ] Clicking outside sheet closes it
- [ ] Escape key closes sheet

### Language Switcher Functionality

- [ ] Language switcher visible on both mobile and desktop
- [ ] Current locale is indicated (visually distinct)
- [ ] Clicking alternate language switches locale
- [ ] URL updates correctly (`/fr/...` ↔ `/en/...`)
- [ ] Current page preserved on language switch
- [ ] Language preference persisted (cookie)
- [ ] No full page reload on language switch

### Responsive Behavior

- [ ] Desktop (≥1024px): Full navigation visible, hamburger hidden
- [ ] Mobile (<1024px): Hamburger visible, navigation hidden
- [ ] Smooth transition at breakpoint (no layout jump)
- [ ] Language switcher works on both viewports

### Accessibility Requirements

- [ ] Hamburger button has accessible name (`aria-label`)
- [ ] Sheet has proper ARIA attributes (handled by Radix)
- [ ] Focus trapped in open sheet
- [ ] Focus returns to trigger on close
- [ ] Navigation links accessible in sheet
- [ ] Keyboard navigation works (Tab, Enter, Escape)

---

## Atomic Commit Summary

This phase uses **5 atomic commits**:

| # | Commit | Files | Purpose |
|---|--------|-------|---------|
| 1 | Add i18n keys for mobile menu & language | 2 | Translation keys for FR/EN |
| 2 | Create LanguageSwitcher component | 1 | FR/EN toggle with locale-aware links |
| 3 | Create MobileMenu component | 1 | Sheet-based mobile navigation |
| 4 | Export new components from barrel | 1 | Add to layout/index.ts |
| 5 | Integrate into Header | 1 | Add MobileMenu trigger & LanguageSwitcher |

**Total estimated time**: 5-6 hours
**Total files**: 2 new, 4 modified

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Language switch causes full reload | Medium | Medium | Use next-intl Link with locale prop |
| Mobile menu focus trap issues | Low | Medium | Radix Sheet handles focus automatically |
| Sheet animation conflicts | Low | Low | Use default Radix animations |
| Responsive breakpoint flash | Medium | Low | Use consistent Tailwind breakpoints |
| Cookie not persisting | Low | Medium | Verify next-intl cookie configuration |

### Risk Mitigation

1. **Test locale switching**: Verify URL updates without reload
2. **Use Radix defaults**: Sheet component handles accessibility
3. **Test both viewports**: Verify behavior at exactly 1024px
4. **Check cookie**: Verify preference persists across sessions

---

## Dependencies

### Blocking Dependencies (must complete first)

- [x] Phase 1: shadcn/ui Components (Sheet installed)
- [x] Phase 2: Header & Desktop Navigation (Header exists)
- [x] Phase 3: Footer Component (Layout complete)

### What This Phase Blocks

- [ ] Phase 5: Accessibility & E2E (needs all interactive components)

---

## Quick Start

```bash
# 1. Ensure you're on the correct branch
git checkout epic-3-story-3.3-planning

# 2. Verify Phase 3 is complete
ls src/components/layout/Footer.tsx  # Should exist

# 3. Verify Sheet component is available
ls src/components/ui/sheet.tsx  # Should exist

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
- [Phase 3 INDEX.md](../phase_3/INDEX.md) - Previous phase

### Technical References
- [shadcn/ui Sheet](https://ui.shadcn.com/docs/components/sheet)
- [next-intl Navigation](https://next-intl-docs.vercel.app/docs/routing/navigation)
- [Radix Dialog/Sheet](https://www.radix-ui.com/docs/primitives/components/dialog)
- [Lucide Icons](https://lucide.dev/icons/) - Menu and X icons

### Project Docs
- [Architecture_technique.md](../../../../../Architecture_technique.md) - Tech stack details
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Design specifications (Section 4)

---

**Phase Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Previous Phase**: [Phase 3 - Footer Component](../phase_3/INDEX.md)
**Next Phase**: [Phase 5 - Accessibility & E2E Validation](../phase_5/INDEX.md)
