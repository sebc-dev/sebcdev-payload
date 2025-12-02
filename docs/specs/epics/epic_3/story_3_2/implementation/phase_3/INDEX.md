# Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Epic**: 3 - Frontend Core & Design System
**Phase**: 3 of 4
**Status**: READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy | Start here for implementation |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit validation | During each commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide | During PR review |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | Writing/running tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | Before marking complete |

---

## Phase Overview

### Objective

Configure the design tokens from the "Anthracite & Vert Canard" brand guidelines and migrate existing vanilla CSS to Tailwind utility classes.

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| CSS variables for shadcn/ui theming | Light mode support (dark-only in V1) |
| Nunito Sans & JetBrains Mono fonts via next/font | Full component library |
| Migration of styles.css to Tailwind classes | Animation system |
| Homepage visual update | Admin panel styling |
| Deletion of legacy styles.css | Responsive breakpoint customization |

### Key Deliverables

- [ ] CSS variables defined in globals.css (shadcn/ui format)
- [ ] Nunito Sans font configured via next/font
- [ ] JetBrains Mono font configured via next/font
- [ ] Homepage migrated to Tailwind utility classes
- [ ] styles.css deleted
- [ ] Visual conformity with brand guidelines

---

## Design Tokens Reference

### Color Palette (Anthracite & Vert Canard)

| Token | Hex | HSL | CSS Variable | Usage |
|-------|-----|-----|--------------|-------|
| Background | `#1A1D23` | `222 16% 12%` | `--background` | Main background (anthracite) |
| Foreground | `#F7FAFC` | `210 40% 98%` | `--foreground` | Primary text (off-white) |
| Card | `#2D3748` | `222 16% 18%` | `--card` | Cards, panels |
| Primary | `#14B8A6` | `174 72% 40%` | `--primary` | Teal accent (links, buttons) |
| Muted | `#A0AEC0` | `215 14% 65%` | `--muted-foreground` | Secondary text |
| Destructive | `#F56565` | `0 72% 67%` | `--destructive` | Errors, destructive actions |
| Border | `#374151` | `217 19% 27%` | `--border` | Borders |
| Ring | `#14B8A6` | `174 72% 40%` | `--ring` | Focus rings |

### Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 | Nunito Sans | 700 | 36px (2.25rem) | 1.2 |
| H2 | Nunito Sans | 700 | 30px (1.875rem) | 1.2 |
| H3 | Nunito Sans | 600 | 24px (1.5rem) | 1.3 |
| Body | Nunito Sans | 400 | 16px (1rem) | 1.6 |
| Code | JetBrains Mono | 400 | 14px (0.875rem) | 1.6 |

---

## Atomic Commit Strategy

This phase is broken into **5 atomic commits**:

| # | Commit | Est. Time | Risk |
|---|--------|-----------|------|
| 1 | Configure CSS variables (design tokens) | 30 min | Low |
| 2 | Configure Nunito Sans font | 20 min | Low |
| 3 | Configure JetBrains Mono font | 15 min | Low |
| 4 | Migrate homepage to Tailwind classes | 45 min | Medium |
| 5 | Delete styles.css and cleanup | 15 min | Low |

**Total Estimated Time**: 2-2.5 hours

---

## Dependencies

### Prerequisites (Must Complete First)

- [x] Phase 1: Tailwind CSS 4 Foundation (Tailwind installed)
- [x] Phase 2: shadcn/ui & Utility Functions (components.json, cn() utility)

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | ^4.0.0 | CSS framework (installed in Phase 1) |
| next/font | Built-in | Google Fonts optimization |
| shadcn/ui | Latest | CSS variable structure (Phase 2) |

---

## Files Affected

### Files to Modify (~4)

| File | Changes |
|------|---------|
| `src/app/globals.css` | Add CSS variables (design tokens) |
| `src/app/[locale]/layout.tsx` | Add next/font configuration |
| `src/app/[locale]/(frontend)/layout.tsx` | Remove styles.css import |
| `src/app/[locale]/(frontend)/page.tsx` | Migrate to Tailwind classes |

### Files to Delete (~1)

| File | Reason |
|------|--------|
| `src/app/[locale]/(frontend)/styles.css` | Migrated to Tailwind utilities |

---

## Risk Assessment

### Medium Risk Areas

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CSS migration breaks styles | Visual regression | Medium | Compare screenshots before/after |
| Font loading increases bundle | Performance | Low | Use next/font with display: swap |
| Color contrast issues | Accessibility | Medium | Verify with WCAG tools |

### Rollback Strategy

Each commit is atomic and can be reverted individually:

```bash
# Revert specific commit if issues
git revert <commit-hash>

# Or revert entire phase
git revert HEAD~5..HEAD
```

---

## Success Criteria

### Technical Criteria

- [ ] `pnpm build` succeeds without CSS errors
- [ ] `pnpm lint` passes
- [ ] TypeScript compilation succeeds
- [ ] No console errors in browser

### Visual Criteria

- [ ] Homepage displays anthracite background (#1A1D23)
- [ ] Text uses off-white color (#F7FAFC)
- [ ] Primary accent is teal (#14B8A6)
- [ ] Nunito Sans loads for body/headings
- [ ] JetBrains Mono loads for code elements

### Accessibility Criteria

- [ ] Text contrast ratio >= 4.5:1
- [ ] UI element contrast ratio >= 3:1
- [ ] Focus rings visible on interactive elements

---

## Implementation Workflow

```
1. Setup Environment
   └─ Read ENVIRONMENT_SETUP.md
   └─ Verify Phase 1 & 2 complete

2. Implement Commits
   └─ Follow IMPLEMENTATION_PLAN.md
   └─ Use COMMIT_CHECKLIST.md for each commit

3. Test & Review
   └─ Run tests per guides/TESTING.md
   └─ Self-review via guides/REVIEW.md

4. Final Validation
   └─ Complete validation/VALIDATION_CHECKLIST.md
   └─ Update EPIC_TRACKING.md
```

---

## Related Documents

### Story Documentation
- [Story 3.2 Specification](../../story_3.2.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Epic Documentation
- [EPIC_TRACKING.md](../../../EPIC_TRACKING.md)

### Design References
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Section 7: Design System

### External References
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [next/font Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)

---

**Phase Created**: 2025-12-02
**Last Updated**: 2025-12-02
**Created by**: phase-doc-generator skill
