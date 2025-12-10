# Phase 2: Reading Progress Bar - Index

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 2 of 4
**Status**: READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy | Start here - understand the approach |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklist | During implementation |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting development |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guidelines | During PR review |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | When writing tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | Before marking phase complete |

---

## Phase Overview

### Objective

Implement a sticky reading progress bar that provides real-time visual feedback of the user's reading position within an article. This component enhances the reading experience for long technical articles by helping readers understand how much content remains.

### Key Deliverables

- [ ] `useReadingProgress()` hook for scroll position tracking
- [ ] `ReadingProgressBar` component with accessible design
- [ ] Support for `prefers-reduced-motion` media query
- [ ] Unit tests for the hook
- [ ] Integration tests for the component
- [ ] Export via `@/components/articles` barrel file

### Scope Summary

| Aspect | Details |
|--------|---------|
| **New Files** | 2 source files + 2 test files |
| **Modified Files** | 1 file (`src/components/articles/index.ts`) |
| **Dependencies** | None (can be developed in parallel with Phase 1) |
| **Complexity** | Medium |
| **Estimated Commits** | 4-5 atomic commits |

---

## Files Affected

### New Files

| File | Purpose | Lines Est. |
|------|---------|-----------|
| `src/hooks/use-reading-progress.ts` | Custom hook for scroll tracking | ~50 |
| `src/components/articles/ReadingProgressBar.tsx` | Progress bar component | ~80 |
| `tests/unit/hooks/use-reading-progress.spec.ts` | Hook unit tests | ~120 |
| `tests/unit/components/articles/ReadingProgressBar.spec.tsx` | Component tests | ~150 |

### Modified Files

| File | Change | Reason |
|------|--------|--------|
| `src/components/articles/index.ts` | Add export for ReadingProgressBar | Barrel file consistency |

---

## Technical Context

### Design Specifications (from UX_UI_Spec.md)

**Section 8.3 - ReadingProgressBar Component**:
- Sticky position at top of viewport
- Progress 0-100% based on article scroll position
- Color: `#14B8A6` (teal accent)
- Smooth visual updates

**Section 6.2 - Page Article Layout**:
- Mobile: Progress bar sticky at top
- Desktop: Progress bar sticky at top (above 3-column layout)

**Section 9.2 - Animations**:
- Progress bar: Smooth, linear easing
- Respect `prefers-reduced-motion`

### Data Flow

```
User scrolls article
        |
useReadingProgress() hook
        |
    Calculates progress (0-100%)
    using requestAnimationFrame
        |
ReadingProgressBar component
        |
    Renders visual bar with width %
```

### Technical Requirements

1. **Hook: `useReadingProgress()`**
   - Input: `articleRef: RefObject<HTMLElement>` (optional, defaults to document)
   - Output: `progress: number` (0-100)
   - Use `requestAnimationFrame` for performance
   - Track article element, not full document height

2. **Component: `ReadingProgressBar`**
   - Fixed position at `top: 0`
   - Height: 3px (visible but not intrusive)
   - Background: `var(--primary)` (#14B8A6)
   - Width: `${progress}%`
   - Accessible: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`

3. **Accessibility**
   - Full keyboard support (not interactive, but announced by screen readers)
   - `prefers-reduced-motion`: Remove transition animations
   - High contrast mode compatibility

---

## Dependencies

### This Phase Requires

- None (foundation phase, can run in parallel with Phase 1)

### This Phase Blocks

- **Phase 4**: Integration needs ReadingProgressBar component

### External Dependencies

- None - pure React/TypeScript implementation

---

## Success Criteria

### Functional Requirements

- [ ] Progress shows 0% at top of article
- [ ] Progress shows 100% when article footer is visible
- [ ] Progress updates smoothly during scroll (no jank)
- [ ] Works correctly on different article lengths

### Technical Requirements

- [ ] TypeScript strict mode compliance
- [ ] ESLint passes with no errors
- [ ] Unit test coverage > 80%
- [ ] All 4+ test cases pass

### Performance Requirements

- [ ] No layout shift (CLS < 0.1)
- [ ] Scroll handler uses `requestAnimationFrame` (no forced reflows)
- [ ] Component re-renders only when progress changes

### Accessibility Requirements

- [ ] `role="progressbar"` with proper ARIA attributes
- [ ] `aria-label` for screen reader users
- [ ] Respects `prefers-reduced-motion`
- [ ] No contrast issues in high-contrast mode

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CLS from fixed positioning | Medium | High | Reserve space with fixed height |
| Jank from frequent re-renders | Medium | Medium | Use RAF throttling, memoization |
| Article height calculation errors | Low | Medium | Test with various article lengths |
| Browser compatibility | Low | Low | Use standard APIs (IntersectionObserver alternative if needed) |

**Overall Risk Level**: Medium

---

## Implementation Workflow

### Recommended Order

1. **Read** ENVIRONMENT_SETUP.md - ensure environment ready
2. **Read** IMPLEMENTATION_PLAN.md - understand commit strategy
3. **Follow** COMMIT_CHECKLIST.md - implement commit by commit
4. **Apply** guides/TESTING.md - write tests as you go
5. **Request** code review using guides/REVIEW.md
6. **Complete** validation/VALIDATION_CHECKLIST.md - verify all criteria

### Commands Quick Reference

```bash
# Run unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/hooks/use-reading-progress.spec.ts
pnpm test:unit tests/unit/components/articles/ReadingProgressBar.spec.tsx

# Type checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# All quality checks
pnpm test:unit && pnpm exec tsc --noEmit && pnpm lint
```

---

## Related Documents

### Story Level

- [Story 4.2 Specification](../../story_4.2.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Phase Level (Other Phases)

- Phase 1: TOC Extraction (parallel - no dependency)
- Phase 3: TOC Component (parallel - no dependency)
- Phase 4: Integration (depends on this phase)

### Architecture

- [Architecture Technique](../../../../../Architecture_technique.md)
- [UX/UI Spec](../../../../../UX_UI_Spec.md) - Sections 6.2, 8.3, 9.2

---

## Metrics & Tracking

### Estimated vs Actual

| Metric | Estimated | Actual |
|--------|-----------|--------|
| Duration | 2-3 days | - |
| Commits | 4-5 | - |
| Lines of Code | ~400 | - |
| Test Cases | 4+ | - |

### Progress Tracking

- [ ] Commit 1: Create useReadingProgress hook
- [ ] Commit 2: Create ReadingProgressBar component
- [ ] Commit 3: Add unit tests for hook
- [ ] Commit 4: Add component tests
- [ ] Commit 5: Add barrel export and polish (optional)

---

**Phase Documentation Generated**: 2025-12-10
**Last Updated**: 2025-12-10
**Generated by**: phase-doc-generator skill
