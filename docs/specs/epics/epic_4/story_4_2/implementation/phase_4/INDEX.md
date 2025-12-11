# Phase 4: Integration & E2E Testing

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Epic**: 4 - Article Reading Experience
**Phase**: 4/4
**Status**: READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Description | When to Use |
|----------|-------------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy (5 commits) | Start here - understand the approach |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Detailed per-commit checklist | During implementation |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide | For reviewers |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | Writing tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | Before PR |

---

## Phase Overview

### Objective

Intégrer les composants développés dans les phases précédentes (ReadingProgressBar, TableOfContents, MobileTOC) dans la page article, implémenter le layout 3-colonnes responsive, et valider l'ensemble avec des tests E2E et d'accessibilité.

### What's Being Built

1. **Article Page Integration**
   - Intégration de ReadingProgressBar (Phase 2)
   - Intégration de TableOfContents desktop (Phase 3)
   - Intégration de MobileTOC (Phase 3)
   - Extraction des headings côté serveur (Phase 1)

2. **Responsive 3-Column Layout**
   - Desktop (≥1024px): `[margin | content (65ch) | TOC (200px)]`
   - Tablet/Mobile (<1024px): Single column + MobileTOC button

3. **Translations**
   - TOC labels in French and English
   - Accessibility labels

4. **E2E Tests**
   - TOC navigation tests
   - Reading progress tests
   - Accessibility validation (axe-core)

### Dependencies

| Dependency | Status | Required For |
|------------|--------|--------------|
| Phase 1: TOC Extraction | COMPLETED | `extractTOCHeadings()` function |
| Phase 2: Progress Bar | COMPLETED | `ReadingProgressBar` component |
| Phase 3: TOC Components | COMPLETED | `TableOfContents`, `MobileTOC` components |
| shadcn/ui | Installed | Sheet, Button components |
| Playwright | Installed | E2E testing |

---

## Implementation Summary

### Atomic Commits (5 commits)

| # | Commit | Files | Est. Time |
|---|--------|-------|-----------|
| 1 | Add TOC translations | 2 | 15 min |
| 2 | Create ArticleLayout wrapper component | 2 | 45 min |
| 3 | Integrate components in article page | 1 | 45 min |
| 4 | Add E2E tests for TOC navigation | 1 | 60 min |
| 5 | Add E2E tests for reading progress | 1 | 45 min |

**Total Estimated Time**: 3-4 hours implementation + review

### Files to Create/Modify

**New Files (3)**:
- `src/components/articles/ArticleLayout.tsx` - Layout wrapper component
- `tests/e2e/articles/toc-navigation.e2e.spec.ts` - TOC E2E tests
- `tests/e2e/articles/reading-progress.e2e.spec.ts` - Progress E2E tests

**Modified Files (3)**:
- `messages/en.json` - English translations
- `messages/fr.json` - French translations
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` - Article page

---

## Success Criteria

### Functional Requirements

- [ ] TOC desktop visible on screens ≥1024px
- [ ] MobileTOC button visible on screens <1024px
- [ ] TOC click navigates to correct section (smooth scroll)
- [ ] Active section highlighted in TOC during scroll
- [ ] Progress bar updates on scroll (0% → 100%)
- [ ] Progress bar respects `prefers-reduced-motion`

### Non-Functional Requirements

- [ ] No layout shift (CLS < 0.1) on page load
- [ ] No Lighthouse performance regression (≥90)
- [ ] axe-core: 0 critical/serious errors
- [ ] All E2E tests pass

### Test Coverage

- [ ] E2E: TOC navigation (4 tests)
- [ ] E2E: Reading progress (3 tests)
- [ ] E2E: Accessibility validation (axe-core)

---

## Technical Notes

### Server vs Client Components

```
ArticlePage (Server)
├── extractTOCHeadings() - Server extraction
├── ReadingProgressBar (Client) - 'use client'
├── ArticleLayout (Client) - Responsive logic
│   ├── TableOfContents (Client)
│   └── MobileTOC (Client)
└── RichText (Server) - Content rendering
```

### Layout Strategy

Using CSS Grid for 3-column layout:

```css
/* Desktop (≥1024px) */
grid-template-columns: 1fr minmax(0, 65ch) 200px;
gap: 2rem;

/* Mobile (<1024px) */
grid-template-columns: 1fr;
max-width: 65ch;
```

### Responsive Breakpoint

- `lg` (1024px) is the breakpoint for TOC visibility
- Use `hidden lg:block` for desktop TOC
- Use `lg:hidden` for mobile TOC button

---

## Reference Documents

### Story Context
- [Story 4.2 Spec](../../story_4.2.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Previous Phases
- [Phase 1: TOC Extraction](../phase_1/INDEX.md)
- [Phase 2: Reading Progress Bar](../phase_2/INDEX.md)
- [Phase 3: TOC Components](../phase_3/INDEX.md)

### Codebase References
- Article Page: `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`
- TOC Module: `src/lib/toc/index.ts`
- Article Components: `src/components/articles/index.ts`

### Design References
- UX/UI Spec Section 6.2: Layout par Point de Rupture
- UX/UI Spec Section 8.2: Composant TableOfContents
- UX/UI Spec Section 8.3: Composant ReadingProgressBar

---

## Quick Start

```bash
# 1. Verify environment
pnpm dev  # Ensure dev server works

# 2. Read implementation plan
cat docs/specs/epics/epic_4/story_4_2/implementation/phase_4/IMPLEMENTATION_PLAN.md

# 3. Start with Commit 1
# Follow COMMIT_CHECKLIST.md for each commit

# 4. Run tests after each commit
pnpm lint
pnpm test:unit
pnpm build

# 5. Run E2E tests after Commits 4-5
pnpm test:e2e
```

---

**Created**: 2025-12-11
**Generator**: phase-doc-generator skill
**Story Status**: IN PROGRESS (Phase 4/4)
