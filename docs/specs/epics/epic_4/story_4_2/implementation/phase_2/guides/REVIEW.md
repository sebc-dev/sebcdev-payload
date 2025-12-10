# Phase 2: Reading Progress Bar - Code Review Guide

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 2 of 4

---

## Review Overview

This guide helps reviewers evaluate the Reading Progress Bar implementation. Each commit should be reviewed against the criteria below.

---

## Commit-by-Commit Review

### Commit 1: useReadingProgress Hook

**Files to Review**:
- `src/hooks/use-reading-progress.ts`

#### Functionality Checklist

- [ ] Hook accepts optional `RefObject<HTMLElement | null>` parameter
- [ ] Hook returns a number between 0-100
- [ ] Progress is 0 at top of content
- [ ] Progress is 100 at bottom of content
- [ ] Calculation works with both document and article ref modes

#### Performance Checklist

- [ ] Uses `requestAnimationFrame` for scroll throttling
- [ ] Event listener uses `{ passive: true }`
- [ ] Proper cleanup in useEffect return function
- [ ] No memory leaks (event listener removed)
- [ ] State updates only when progress changes

#### Code Quality Checklist

- [ ] TypeScript types are explicit and correct
- [ ] JSDoc documentation is complete
- [ ] Function is exported correctly
- [ ] `'use client'` directive present
- [ ] No unnecessary dependencies in useEffect array

#### Questions for Author

1. Why was this calculation method chosen over IntersectionObserver?
2. What happens if the ref element is removed from DOM?
3. How does this handle dynamic content height changes?

---

### Commit 2: ReadingProgressBar Component

**Files to Review**:
- `src/components/articles/ReadingProgressBar.tsx`

#### Accessibility Checklist

- [ ] `role="progressbar"` is set
- [ ] `aria-valuenow` reflects current progress (rounded)
- [ ] `aria-valuemin="0"` is set
- [ ] `aria-valuemax="100"` is set
- [ ] `aria-label` has sensible default and accepts override
- [ ] Component is announced correctly by screen readers

#### Styling Checklist

- [ ] Fixed positioning: `fixed top-0 left-0 right-0`
- [ ] Height is 3px (per spec)
- [ ] Uses design system color: `bg-primary`
- [ ] Track background: `bg-muted/30`
- [ ] Z-index: `z-50`
- [ ] Transition on width property only
- [ ] `motion-reduce:transition-none` present

#### Props Checklist

- [ ] `articleRef` prop passed to hook correctly
- [ ] `className` prop merged with `cn()` utility
- [ ] `ariaLabel` prop has default value
- [ ] Props interface is exported
- [ ] JSDoc documents all props

#### Questions for Author

1. Why was `cn()` used instead of direct className concatenation?
2. Is z-50 appropriate or could it conflict with other fixed elements?
3. Should there be a way to hide/show the progress bar?

---

### Commit 3: Hook Unit Tests

**Files to Review**:
- `tests/unit/hooks/use-reading-progress.spec.ts`

#### Test Coverage Checklist

- [ ] Tests document-based tracking (no ref)
- [ ] Tests article-ref based tracking
- [ ] Tests progress at 0% (top)
- [ ] Tests progress at 50% (middle)
- [ ] Tests progress at 100% (bottom)
- [ ] Tests scroll event handling
- [ ] Tests cleanup on unmount
- [ ] Tests edge cases (short document, null ref)

#### Test Quality Checklist

- [ ] Tests are isolated (beforeEach/afterEach cleanup)
- [ ] Mocks are appropriate and minimal
- [ ] Test descriptions are clear
- [ ] No implementation details tested (only behavior)
- [ ] Tests would fail if behavior changed

#### Questions for Author

1. Are the scroll position mocks realistic?
2. Should there be tests for rapid scroll events?
3. Are edge cases sufficiently covered?

---

### Commit 4: Component Tests

**Files to Review**:
- `tests/unit/components/articles/ReadingProgressBar.spec.tsx`

#### Test Coverage Checklist

- [ ] Tests rendering of progressbar role
- [ ] Tests ARIA attributes at various progress values
- [ ] Tests custom className application
- [ ] Tests custom ariaLabel
- [ ] Tests visual width at 0%, 50%, 100%
- [ ] Tests fixed positioning classes
- [ ] Tests motion-reduce class presence
- [ ] Tests articleRef passed to hook

#### Test Quality Checklist

- [ ] Hook is properly mocked
- [ ] Mocks are reset between tests
- [ ] DOM queries use accessible selectors
- [ ] No snapshot tests (behavior tests preferred)
- [ ] Tests are readable and maintainable

#### Questions for Author

1. Is the hook mock sufficient?
2. Should there be integration tests (unmocked)?
3. Are styling tests too brittle (class-based)?

---

### Commit 5: Barrel Export

**Files to Review**:
- `src/components/articles/index.ts`

#### Export Checklist

- [ ] `ReadingProgressBar` component exported
- [ ] `ReadingProgressBarProps` type exported
- [ ] Export placed in logical location (with other article components)
- [ ] JSDoc comment updated if present
- [ ] No circular dependency introduced

---

## Overall Phase Review

### Architecture Review

- [ ] Hook and component are properly separated
- [ ] No business logic in component
- [ ] Component is purely presentational
- [ ] Hook is reusable for other use cases
- [ ] No tight coupling to specific page structure

### Performance Review

- [ ] No unnecessary re-renders
- [ ] Scroll handling is optimized (RAF)
- [ ] No forced reflows or layout thrashing
- [ ] CLS impact is minimal (fixed height)
- [ ] Bundle size impact is minimal

### Accessibility Review

- [ ] Screen reader announces progress changes
- [ ] No focus trapping issues
- [ ] Works in high contrast mode
- [ ] Reduced motion is respected
- [ ] Keyboard navigation unaffected

### Design System Review

- [ ] Uses design system colors
- [ ] Uses Tailwind utilities
- [ ] Consistent with other components
- [ ] Responsive considerations (if any)

---

## Review Checklist Template

Use this for your PR review:

```markdown
## Code Review: Phase 2 - Reading Progress Bar

### Summary
<!-- Brief description of changes -->

### Commits Reviewed
- [ ] Commit 1: useReadingProgress hook
- [ ] Commit 2: ReadingProgressBar component
- [ ] Commit 3: Hook unit tests
- [ ] Commit 4: Component tests
- [ ] Commit 5: Barrel export

### Quality Checks
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All tests pass
- [ ] Manual testing performed

### Accessibility
- [ ] ARIA attributes correct
- [ ] Screen reader tested (if possible)
- [ ] Reduced motion works

### Performance
- [ ] No jank during scroll
- [ ] RAF throttling verified
- [ ] No layout shifts

### Code Quality
- [ ] Code is readable
- [ ] Documentation complete
- [ ] Follows project patterns
- [ ] No unnecessary complexity

### Suggestions
<!-- Optional improvements -->

### Questions
<!-- Clarifications needed -->

### Decision
- [ ] Approved
- [ ] Approved with suggestions
- [ ] Request changes
```

---

## Common Review Feedback

### Performance Issues

**Problem**: Progress updates cause jank
```typescript
// Bad: Direct state update on every scroll
window.addEventListener('scroll', () => {
  setProgress(calculate())
})

// Good: RAF throttling
let ticking = false
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      setProgress(calculate())
      ticking = false
    })
    ticking = true
  }
}, { passive: true })
```

### Accessibility Issues

**Problem**: Missing ARIA attributes
```tsx
// Bad: No accessibility
<div style={{ width: `${progress}%` }} />

// Good: Full accessibility
<div
  role="progressbar"
  aria-valuenow={Math.round(progress)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Reading progress"
>
  <div style={{ width: `${Math.round(progress)}%` }} />
</div>
```

### Test Issues

**Problem**: Testing implementation details
```typescript
// Bad: Testing internal state
expect(hook.result.current._internalState).toBe(...)

// Good: Testing behavior
expect(hook.result.current).toBe(50)
```

---

## Approval Criteria

### Must Have (Blocking)

- TypeScript compiles without errors
- All tests pass
- ARIA attributes are correct
- No console errors in browser

### Should Have (Non-blocking)

- JSDoc documentation complete
- Test coverage > 80%
- No lint warnings

### Nice to Have (Future)

- Integration tests with real scrolling
- E2E test in Phase 4
- Performance benchmarks

---

**Review Guide Generated**: 2025-12-10
**Last Updated**: 2025-12-10
