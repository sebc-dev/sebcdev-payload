# Phase 3: Footer Component

**Story**: 3.3 - Layout Global & Navigation
**Epic**: 3 - Frontend Core & Design System
**Phase**: 3 of 5
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

Create the Footer component with copyright information, secondary navigation links, and integrate it into the frontend layout. This completes the page shell (Header + Main + Footer) providing users with a consistent visual structure across all pages.

### Why This Phase Third?

1. **Completes the layout shell**: With Header done, Footer establishes the full page structure
2. **Low complexity**: Footer is simpler than Header (no dropdowns, no interactivity)
3. **Consistent branding**: Users see the complete visual identity on every page
4. **Foundation for Phase 4**: Mobile menu sheet needs the complete layout context

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| Footer component with semantic HTML | Social media links (future enhancement) |
| Dynamic copyright year | Newsletter signup |
| Secondary navigation links | Contact form |
| i18n translations for footer | Sitemap links |
| Integration into frontend layout | Footer animations |
| Responsive stacking on mobile | Dark/light mode toggle |

---

## Key Deliverables

### Files to Create

| File | Purpose | Lines (est.) |
|------|---------|--------------|
| `src/components/layout/Footer.tsx` | Main footer component | ~60 |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/components/layout/index.ts` | Add Footer export | Low |
| `src/app/[locale]/(frontend)/layout.tsx` | Add Footer to layout | Low |
| `messages/fr.json` | Add footer translation keys | Low |
| `messages/en.json` | Add footer translation keys | Low |

### i18n Keys Added

```json
{
  "footer": {
    "tagline": "Blog technique sur l'IA, l'UX et l'ingénierie logicielle",
    "copyright": "© {year} sebc.dev. Tous droits réservés.",
    "links": {
      "articles": "Articles",
      "contact": "Contact"
    }
  }
}
```

---

## Technical Context

### Component Architecture

```
Footer (Server Component)
├── Brand section
│   ├── Site name "sebc.dev"
│   └── Tagline (translated)
├── Navigation links
│   ├── Articles link → /[locale]/articles
│   └── Contact link → mailto:contact@sebc.dev
└── Copyright
    └── Dynamic year + translated text
```

### Why Server Component?

The Footer component is a **Server Component** because:
- No client-side interactivity required
- All links are standard anchor tags
- i18n text rendered server-side
- Better performance (zero client JS)

### Design Specifications

#### Footer Layout (Desktop ≥1024px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  sebc.dev                                                              │
│  Blog technique sur l'IA, l'UX et l'ingénierie logicielle             │
│                                                                         │
│  Articles  •  Contact                                                  │
│                                                                         │
│  © 2025 sebc.dev. Tous droits réservés.                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Footer Layout (Mobile <1024px)

```
┌─────────────────────────────┐
│                             │
│  sebc.dev                   │
│  Blog technique sur l'IA,  │
│  l'UX et l'ingénierie      │
│  logicielle                │
│                             │
│  Articles                   │
│  Contact                    │
│                             │
│  © 2025 sebc.dev.          │
│  Tous droits réservés.     │
│                             │
└─────────────────────────────┘
```

### Styling Requirements

| Element | Tailwind Classes | CSS Variable |
|---------|-----------------|--------------|
| Footer background | `bg-card` or `bg-background` | `--card` or `--background` |
| Footer border | `border-t border-border` | `--border` |
| Site name | `text-foreground font-bold text-lg` | `--foreground` |
| Tagline | `text-muted-foreground text-sm` | `--muted-foreground` |
| Nav links | `text-muted-foreground hover:text-foreground` | |
| Copyright | `text-muted-foreground text-xs` | |

### Responsive Behavior

```css
/* Desktop: horizontal layout with spacing */
@media (min-width: 1024px) {
  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

/* Mobile: vertical stacking */
@media (max-width: 1023px) {
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
```

---

## Success Criteria

### Build Success

- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes
- [ ] TypeScript compilation: 0 errors

### Component Functionality

- [ ] Footer renders on all frontend pages
- [ ] Copyright year is dynamic (current year)
- [ ] "Articles" link navigates to `/[locale]/articles`
- [ ] "Contact" link opens email client (mailto:)
- [ ] All text is translated (FR/EN)

### Visual Requirements

- [ ] Footer is positioned at page bottom
- [ ] Styling matches design spec (Neutral Gray theme)
- [ ] Footer stacks vertically on mobile viewports
- [ ] Links have hover states
- [ ] Proper spacing and padding

### Accessibility Requirements

- [ ] `<footer>` element has `role="contentinfo"` (implicit)
- [ ] Links are accessible (clear text, not just icons)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus states visible on links

---

## Atomic Commit Summary

This phase uses **4 atomic commits**:

| # | Commit | Files | Purpose |
|---|--------|-------|---------|
| 1 | Add footer i18n keys | 2 | Translation keys for FR/EN |
| 2 | Create Footer component | 1 | Main footer with all sections |
| 3 | Export Footer from barrel | 1 | Add to layout/index.ts |
| 4 | Integrate Footer into layout | 1 | Add to frontend layout |

**Total estimated time**: 3-4 hours
**Total files**: 1 new, 4 modified

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Footer pushed off-screen | Low | Low | Use flex/min-height layout |
| i18n key naming conflicts | Low | Low | Use namespaced keys (`footer.X`) |
| Mobile stacking breaks | Low | Low | Test responsive breakpoints |
| Copyright year incorrect | Very Low | Low | Use `new Date().getFullYear()` |

### Risk Mitigation

- **Simple implementation**: Footer is straightforward, minimal risk
- **Follow Header patterns**: Reuse styling approach from Header
- **Test both locales**: Verify FR and EN translations work

---

## Dependencies

### Blocking Dependencies (must complete first)

- [x] Phase 1: shadcn/ui Components
- [x] Phase 2: Header & Desktop Navigation

### What This Phase Blocks

- [ ] Phase 4: Mobile Navigation (needs complete layout)
- [ ] Phase 5: Accessibility & E2E (needs all components)

---

## Quick Start

```bash
# 1. Ensure you're on the correct branch
git checkout epic-3-story-3.3-planning

# 2. Verify Phase 2 is complete
ls src/components/layout/Header.tsx  # Should exist

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
- [Phase 2 INDEX.md](../phase_2/INDEX.md) - Previous phase

### Technical References
- [Next.js Link](https://nextjs.org/docs/app/api-reference/components/link)
- [next-intl useTranslations](https://next-intl-docs.vercel.app/docs/usage/messages)

### Project Docs
- [Architecture_technique.md](../../../../../Architecture_technique.md) - Tech stack details
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Design specifications (Section 7)

---

**Phase Created**: 2025-12-03
**Last Updated**: 2025-12-03
**Previous Phase**: [Phase 2 - Header & Desktop Navigation](../phase_2/INDEX.md)
**Next Phase**: [Phase 4 - Mobile Navigation & Language Switcher](../phase_4/INDEX.md)
