# Phase 3: Table of Contents Component - Index

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4
**Status**: Ready for Implementation

---

## Quick Navigation

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy (7 commits) |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklist |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Development environment setup |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy and examples |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist |

---

## Phase Overview

### Objective

Create the Table of Contents component with desktop (sticky sidebar) and mobile (modal/Sheet) support, including active section tracking and smooth scroll navigation.

### Scope

This phase implements:

1. **`useActiveSection` hook** - Intersection Observer-based section tracking
2. **`TOCLink` component** - Individual TOC entry with active state
3. **`TableOfContents` component** - Desktop sticky sidebar TOC
4. **`MobileTOC` component** - Mobile Sheet-based TOC with trigger button
5. **Unit and component tests** for all new code

### Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Phase 1 (TOC Extraction) | ✅ Completed | `extractTOCHeadings()` and `TOCHeading` types available |
| shadcn/ui Sheet | ✅ Available | Already installed in codebase |
| Lucide Icons | ✅ Available | Already installed in codebase |

### Key Deliverables

- [ ] `src/hooks/use-active-section.ts` - Active section tracking hook
- [ ] `src/components/articles/TOCLink.tsx` - Individual TOC link component
- [ ] `src/components/articles/TableOfContents.tsx` - Desktop TOC component
- [ ] `src/components/articles/MobileTOC.tsx` - Mobile TOC with Sheet
- [ ] `tests/unit/hooks/use-active-section.spec.ts` - Hook tests
- [ ] `tests/unit/components/articles/TOCLink.spec.tsx` - TOCLink tests
- [ ] `tests/unit/components/articles/TableOfContents.spec.tsx` - TableOfContents tests
- [ ] `tests/unit/components/articles/MobileTOC.spec.tsx` - MobileTOC tests

---

## Implementation Summary

### Atomic Commits (7 total)

| # | Commit | Description | Est. Lines |
|---|--------|-------------|------------|
| 1 | `useActiveSection` hook | Intersection Observer hook | ~80 |
| 2 | `TOCLink` component | Reusable TOC entry | ~60 |
| 3 | `TableOfContents` component | Desktop sticky sidebar | ~90 |
| 4 | `MobileTOC` component | Mobile Sheet TOC | ~100 |
| 5 | Unit tests for hook | Hook test coverage | ~150 |
| 6 | Component tests | TOCLink + TableOfContents tests | ~200 |
| 7 | MobileTOC tests + exports | MobileTOC tests + barrel export | ~180 |

**Total Estimated**: ~860 lines of code

### Files Structure

```
src/
├── hooks/
│   └── use-active-section.ts      (new)
├── components/
│   └── articles/
│       ├── TOCLink.tsx            (new)
│       ├── TableOfContents.tsx    (new)
│       ├── MobileTOC.tsx          (new)
│       └── index.ts               (modify)
tests/
└── unit/
    ├── hooks/
    │   └── use-active-section.spec.ts  (new)
    └── components/
        └── articles/
            ├── TOCLink.spec.tsx              (new)
            ├── TableOfContents.spec.tsx      (new)
            └── MobileTOC.spec.tsx            (new)
```

---

## Technical Decisions

### Intersection Observer Strategy

- **Threshold**: 0.3 (30% of element visible triggers active state)
- **Root Margin**: `-80px 0px -60% 0px` (account for sticky header, trigger earlier)
- **Multiple Active**: Last intersecting heading wins (smooth transition)

### Smooth Scroll Implementation

- Use native `element.scrollIntoView({ behavior: 'smooth', block: 'start' })`
- Add offset via CSS `scroll-margin-top` on heading elements
- Respect `prefers-reduced-motion` (instant scroll if reduced motion)

### Mobile Sheet Behavior

- Sheet opens from right side (side="right")
- Auto-close after navigation (link click)
- Button position: fixed bottom-right
- Accessible: focus trap, keyboard navigation

---

## Quality Gates

### Per-Commit Requirements

Each commit must pass:

- [ ] `pnpm exec tsc --noEmit` - No TypeScript errors
- [ ] `pnpm lint` - No ESLint errors
- [ ] `pnpm test:unit` - All unit tests pass (commits 5+)

### Phase Completion Requirements

- [ ] All 7 commits merged
- [ ] Test coverage >80% for new code
- [ ] No accessibility warnings
- [ ] Manual testing: desktop + mobile scenarios

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| IO threshold tuning | Medium | Low | Start with 0.3, adjust based on testing |
| Mobile UX issues | Medium | Medium | Test on real devices, use Sheet defaults |
| Performance with many headings | Low | Medium | Memoize handlers, virtualize if >50 headings |
| Focus management in Sheet | Low | High | Rely on shadcn/ui Sheet built-in behavior |

---

## Reference Documents

### From Phase 1

- `src/lib/toc/types.ts` - `TOCHeading` interface
- `src/lib/toc/extract-headings.ts` - `extractTOCHeadings()` function

### From Phase 2

- `src/hooks/use-reading-progress.ts` - Pattern for scroll-based hook
- `src/components/articles/ReadingProgressBar.tsx` - Pattern for accessible component

### Specifications

- `docs/specs/UX_UI_Spec.md` Section 8.2 - TableOfContents spec
- `docs/specs/UX_UI_Spec.md` Section 6.2 - Responsive layout spec
- `docs/specs/epics/epic_4/story_4_2/story_4.2.md` - Story requirements

---

## Success Metrics

### Functional

- [ ] Desktop: TOC sticky à droite, ~200px largeur
- [ ] Mobile: Bouton visible, Sheet s'ouvre correctement
- [ ] Section active highlightée en temps réel
- [ ] Click → smooth scroll → section visible

### Quality

- [ ] Tests: hooks + composants (8+ tests minimum)
- [ ] TypeScript: strict mode, no `any`
- [ ] Accessibility: keyboard navigation, ARIA attributes
- [ ] Performance: no layout shift, smooth scrolling

---

## Getting Started

1. **Read** [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for prerequisites
2. **Review** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for commit strategy
3. **Follow** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for each commit
4. **Validate** with [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Documentation Generated**: 2025-12-11
**Phase Status**: Ready for Implementation
