# Phase 2: Reading Progress Bar - Validation Checklist

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 2 of 4
**Status**: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED

---

## Pre-Validation Requirements

Before starting validation, ensure:

- [ ] All 5 commits are complete
- [ ] All code is pushed to feature branch
- [ ] No uncommitted changes in working directory

---

## 1. Code Quality Validation

### TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] Command exits with code 0
- [ ] No type errors in new files
- [ ] No type errors in modified files

### ESLint

```bash
pnpm lint
```

- [ ] Command exits with code 0
- [ ] No errors in new files
- [ ] No warnings in new files (if possible)

### File Structure

- [ ] `src/hooks/use-reading-progress.ts` exists
- [ ] `src/components/articles/ReadingProgressBar.tsx` exists
- [ ] `tests/unit/hooks/use-reading-progress.spec.ts` exists
- [ ] `tests/unit/components/articles/ReadingProgressBar.spec.tsx` exists
- [ ] `src/components/articles/index.ts` exports ReadingProgressBar

---

## 2. Test Validation

### Unit Tests Pass

```bash
pnpm test:unit
```

- [ ] All tests pass
- [ ] No skipped tests (unless documented)
- [ ] No flaky tests

### Hook Tests Specific

```bash
pnpm test:unit tests/unit/hooks/use-reading-progress.spec.ts
```

- [ ] Document-based tracking tests pass
- [ ] Article-ref tracking tests pass
- [ ] Scroll event tests pass
- [ ] Edge case tests pass
- [ ] Cleanup tests pass

### Component Tests Specific

```bash
pnpm test:unit tests/unit/components/articles/ReadingProgressBar.spec.tsx
```

- [ ] Rendering tests pass
- [ ] Accessibility tests pass
- [ ] Progress visualization tests pass
- [ ] Styling tests pass
- [ ] Integration tests pass

### Coverage

```bash
pnpm test:unit --coverage
```

| File | Required | Actual |
|------|----------|--------|
| `use-reading-progress.ts` | >80% | [ ] ___% |
| `ReadingProgressBar.tsx` | >80% | [ ] ___% |

---

## 3. Functional Validation

### Hook Behavior

Test in development environment:

```typescript
// Add temporarily to a page
const progress = useReadingProgress()
console.log('Progress:', progress)
```

- [ ] Returns 0 at top of page
- [ ] Returns 100 at bottom of page
- [ ] Updates on scroll
- [ ] Values are between 0-100

### Component Behavior

Add component to a test page:

```tsx
<ReadingProgressBar />
```

- [ ] Progress bar visible at top of viewport
- [ ] Height is approximately 3px
- [ ] Color is teal (#14B8A6)
- [ ] Width changes as page scrolls
- [ ] Fixed position doesn't scroll with content

---

## 4. Accessibility Validation

### ARIA Attributes

Using browser DevTools, inspect the progress bar:

- [ ] `role="progressbar"` present
- [ ] `aria-valuenow` updates with scroll
- [ ] `aria-valuemin="0"` present
- [ ] `aria-valuemax="100"` present
- [ ] `aria-label="Reading progress"` present (or custom)

### Screen Reader Testing

If available, test with screen reader:

- [ ] Progress bar is announced
- [ ] Progress changes are communicated (optional, depending on implementation)

### Keyboard Navigation

- [ ] Progress bar doesn't trap focus (non-interactive)
- [ ] Tab navigation skips progress bar
- [ ] Page navigation works normally

### Reduced Motion

Enable reduced motion in OS/browser:

**macOS**: System Preferences → Accessibility → Display → Reduce motion
**Windows**: Settings → Ease of Access → Display → Show animations
**Browser**: DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion

- [ ] Progress bar updates instantly (no transition)
- [ ] No animation on progress change

---

## 5. Performance Validation

### No Layout Shift (CLS)

- [ ] Progress bar doesn't cause content to shift
- [ ] Fixed positioning doesn't affect layout
- [ ] Height is constant (3px)

### Scroll Performance

Scroll quickly through a page:

- [ ] No jank or stuttering
- [ ] Progress updates smoothly
- [ ] No dropped frames

### Memory Leaks

Navigate away from page with progress bar:

- [ ] No console warnings about unmounted components
- [ ] Event listeners cleaned up (verify in DevTools)

### Bundle Size

```bash
# Check if bundle size increased significantly
pnpm build
```

- [ ] Build succeeds
- [ ] No significant bundle size increase

---

## 6. Cross-Browser Validation

### Chrome (Latest)

- [ ] Progress bar renders correctly
- [ ] Scroll tracking works
- [ ] Accessibility attributes work

### Firefox (Latest)

- [ ] Progress bar renders correctly
- [ ] Scroll tracking works
- [ ] Accessibility attributes work

### Safari (Latest) - if available

- [ ] Progress bar renders correctly
- [ ] Scroll tracking works
- [ ] Accessibility attributes work

### Edge (Latest)

- [ ] Progress bar renders correctly
- [ ] Scroll tracking works
- [ ] Accessibility attributes work

---

## 7. Responsive Validation

### Mobile (< 768px)

- [ ] Progress bar spans full width
- [ ] Height is visible but not intrusive
- [ ] Touch scrolling works
- [ ] No overlap with mobile header

### Tablet (768px - 1024px)

- [ ] Progress bar spans full width
- [ ] Proper z-index layering

### Desktop (≥ 1024px)

- [ ] Progress bar spans full width
- [ ] Proper z-index layering
- [ ] No conflict with sticky headers

---

## 8. Integration Validation

### Import from Barrel

```typescript
import { ReadingProgressBar } from '@/components/articles'
```

- [ ] Import works without errors
- [ ] Type is recognized

### Type Export

```typescript
import type { ReadingProgressBarProps } from '@/components/articles'
```

- [ ] Type import works
- [ ] Props are correctly typed

### No Regression

- [ ] Existing article components still work
- [ ] No changes to other exports
- [ ] Build still passes

---

## 9. Documentation Validation

### JSDoc Comments

- [ ] `useReadingProgress` has complete JSDoc
- [ ] `ReadingProgressBar` has complete JSDoc
- [ ] `ReadingProgressBarProps` has prop documentation

### Code Comments

- [ ] Complex logic is commented
- [ ] No TODO comments left unaddressed
- [ ] No commented-out code

---

## 10. Git Validation

### Commit History

```bash
git log --oneline -5
```

- [ ] 5 commits present for this phase
- [ ] Commit messages follow convention
- [ ] Each commit is atomic and passes tests

### No Untracked Files

```bash
git status
```

- [ ] No untracked source files
- [ ] No uncommitted changes

---

## Validation Summary

### Quick Commands

```bash
# Run all validation checks
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit

# Coverage check
pnpm test:unit --coverage
```

### Sign-off

| Validator | Date | Status |
|-----------|------|--------|
| Developer | _____ | [ ] Pass / [ ] Fail |
| Reviewer | _____ | [ ] Pass / [ ] Fail |

### Notes

<!-- Add any notes, issues found, or deviations from spec -->

---

## Phase Completion Criteria

This phase is complete when:

- [ ] All validation sections pass
- [ ] Coverage targets met
- [ ] PR approved by reviewer
- [ ] Merged to main branch (or ready for Phase 4 integration)

---

## Next Steps

After validation passes:

1. **Update PHASES_PLAN.md** with actual metrics
2. **Update EPIC_TRACKING.md** if applicable
3. **Proceed to Phase 3** (TOC Component) or Phase 4 (Integration)
4. **Create PR** for review

---

**Validation Checklist Generated**: 2025-12-10
**Last Updated**: 2025-12-10
