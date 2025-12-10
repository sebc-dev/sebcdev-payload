# Phase 2: Reading Progress Bar - Commit Checklist

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 2 of 4
**Total Commits**: 5

---

## How to Use This Checklist

1. **Before starting a commit**: Read the entire section for that commit
2. **During implementation**: Check off items as you complete them
3. **Before committing**: Verify all items are checked
4. **After committing**: Run validation commands

---

## Commit 1: Create useReadingProgress Hook

### Pre-Implementation

- [ ] Read the hook requirements in IMPLEMENTATION_PLAN.md
- [ ] Understand requestAnimationFrame throttling pattern
- [ ] Review existing hooks in `src/hooks/` for patterns

### Implementation Steps

1. **Create hook file**

   - [ ] Create `src/hooks/use-reading-progress.ts`
   - [ ] Add `'use client'` directive at top
   - [ ] Import necessary React hooks (`useEffect`, `useState`, `RefObject`)

2. **Implement hook signature**

   ```typescript
   export function useReadingProgress(
     articleRef?: RefObject<HTMLElement | null>
   ): number
   ```

   - [ ] Accept optional articleRef parameter
   - [ ] Return number (progress percentage)

3. **Implement progress calculation**

   - [ ] Calculate document-based progress (fallback mode)
   - [ ] Calculate article-ref based progress
   - [ ] Handle edge cases (short documents, negative values)
   - [ ] Clamp values between 0-100

4. **Implement scroll handling**

   - [ ] Use `requestAnimationFrame` for throttling
   - [ ] Add scroll event listener with `{ passive: true }`
   - [ ] Implement proper cleanup in useEffect return

5. **Add JSDoc documentation**

   - [ ] Document function purpose
   - [ ] Document parameters
   - [ ] Document return value
   - [ ] Add usage example

### Validation

- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] Hook can be imported without errors

### Commit

```bash
git add src/hooks/use-reading-progress.ts
git commit -m "$(cat <<'EOF'
feat(progress): add useReadingProgress hook for scroll tracking

- Implement custom hook to track article reading progress
- Use requestAnimationFrame for performant scroll handling
- Support optional article ref or full document fallback
- Add proper cleanup on unmount

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Create ReadingProgressBar Component

### Pre-Implementation

- [ ] Review UX_UI_Spec.md Section 8.3 for design requirements
- [ ] Understand ARIA progressbar attributes
- [ ] Review existing article components for patterns

### Implementation Steps

1. **Create component file**

   - [ ] Create `src/components/articles/ReadingProgressBar.tsx`
   - [ ] Add `'use client'` directive
   - [ ] Import hook and utilities (`cn`)

2. **Define props interface**

   ```typescript
   export interface ReadingProgressBarProps {
     articleRef?: RefObject<HTMLElement | null>
     className?: string
     ariaLabel?: string
   }
   ```

   - [ ] Export props type for consumers
   - [ ] Add JSDoc comments for each prop

3. **Implement component structure**

   - [ ] Outer container with `role="progressbar"`
   - [ ] Inner div for progress bar fill
   - [ ] Apply fixed positioning classes

4. **Add accessibility attributes**

   - [ ] `role="progressbar"`
   - [ ] `aria-valuenow` (rounded progress)
   - [ ] `aria-valuemin="0"`
   - [ ] `aria-valuemax="100"`
   - [ ] `aria-label` (default + custom support)

5. **Add styling**

   - [ ] Fixed positioning: `fixed top-0 left-0 right-0`
   - [ ] Z-index: `z-50` for layering
   - [ ] Height: `h-[3px]`
   - [ ] Background track: `bg-muted/30`
   - [ ] Progress fill: `bg-primary`
   - [ ] Transition: `transition-[width] duration-150 ease-linear`
   - [ ] Reduced motion: `motion-reduce:transition-none`

6. **Add JSDoc documentation**

   - [ ] Component description
   - [ ] Feature list
   - [ ] Usage example

### Validation

- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] Component renders in isolation (manual test)
- [ ] Progress bar visible at top of viewport

### Commit

```bash
git add src/components/articles/ReadingProgressBar.tsx
git commit -m "$(cat <<'EOF'
feat(progress): add ReadingProgressBar component

- Create accessible progress bar component
- Implement sticky positioning at viewport top
- Add ARIA progressbar role and attributes
- Support prefers-reduced-motion
- Use design system primary color

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Unit Tests for useReadingProgress Hook

### Pre-Implementation

- [ ] Review guides/TESTING.md for testing patterns
- [ ] Understand Vitest mocking patterns
- [ ] Review existing hook tests for patterns

### Implementation Steps

1. **Create test file**

   - [ ] Create `tests/unit/hooks/use-reading-progress.spec.ts`
   - [ ] Import test utilities from Vitest
   - [ ] Import `renderHook` from `@testing-library/react`

2. **Setup mocks**

   - [ ] Mock `window.scrollY`
   - [ ] Mock `window.innerHeight`
   - [ ] Mock `document.documentElement.scrollHeight`
   - [ ] Mock `requestAnimationFrame`

3. **Document-based tracking tests**

   - [ ] Test returns 0 at top
   - [ ] Test returns 100 at bottom
   - [ ] Test returns 50 at midpoint
   - [ ] Test handles short documents

4. **Article-ref tracking tests**

   - [ ] Test returns 0 when article top at viewport
   - [ ] Test returns 100 when scrolled past article
   - [ ] Test handles null ref gracefully

5. **Scroll event tests**

   - [ ] Test updates on scroll event
   - [ ] Test cleans up listener on unmount

6. **Edge case tests**

   - [ ] Test clamps negative values
   - [ ] Test clamps values over 100

### Validation

- [ ] All tests pass: `pnpm test:unit tests/unit/hooks/use-reading-progress.spec.ts`
- [ ] Coverage > 80% for hook file
- [ ] No console errors or warnings

### Commit

```bash
git add tests/unit/hooks/use-reading-progress.spec.ts
git commit -m "$(cat <<'EOF'
test(progress): add unit tests for useReadingProgress hook

- Test document-based scroll tracking
- Test article-ref based tracking
- Test scroll event handling and updates
- Test edge cases and cleanup
- Achieve >80% coverage for hook

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: Component Tests for ReadingProgressBar

### Pre-Implementation

- [ ] Review existing component tests for patterns
- [ ] Understand how to mock custom hooks
- [ ] Review testing-library queries

### Implementation Steps

1. **Create test file**

   - [ ] Create `tests/unit/components/articles/ReadingProgressBar.spec.tsx`
   - [ ] Import test utilities
   - [ ] Setup hook mock

2. **Setup**

   ```typescript
   vi.mock('@/hooks/use-reading-progress', () => ({
     useReadingProgress: vi.fn(() => 0),
   }))
   ```

   - [ ] Mock `useReadingProgress` hook
   - [ ] Setup beforeEach/afterEach for mock cleanup

3. **Rendering tests**

   - [ ] Test renders progressbar role
   - [ ] Test default aria-label
   - [ ] Test custom aria-label
   - [ ] Test custom className

4. **Accessibility tests**

   - [ ] Test ARIA attributes at 0%
   - [ ] Test ARIA attributes at 50%
   - [ ] Test ARIA attributes at 100%
   - [ ] Test progress rounding

5. **Progress visualization tests**

   - [ ] Test 0% width
   - [ ] Test 50% width
   - [ ] Test 100% width

6. **Styling tests**

   - [ ] Test fixed positioning classes
   - [ ] Test z-index class
   - [ ] Test motion-reduce class

7. **Integration tests**

   - [ ] Test passes articleRef to hook
   - [ ] Test calls hook without ref when not provided

### Validation

- [ ] All tests pass: `pnpm test:unit tests/unit/components/articles/ReadingProgressBar.spec.tsx`
- [ ] Coverage > 80% for component
- [ ] No console errors or warnings

### Commit

```bash
git add tests/unit/components/articles/ReadingProgressBar.spec.tsx
git commit -m "$(cat <<'EOF'
test(progress): add component tests for ReadingProgressBar

- Test rendering and accessibility attributes
- Test progress visualization at various values
- Test styling classes including reduced motion
- Test integration with useReadingProgress hook
- Achieve >80% coverage for component

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 5: Barrel Export and Polish

### Pre-Implementation

- [ ] Review current `src/components/articles/index.ts` structure
- [ ] Ensure all previous commits are complete

### Implementation Steps

1. **Update barrel file**

   - [ ] Open `src/components/articles/index.ts`
   - [ ] Add import and export for `ReadingProgressBar`
   - [ ] Export `ReadingProgressBarProps` type

2. **Add to exports section**

   ```typescript
   // Reading Progress
   export {
     ReadingProgressBar,
     type ReadingProgressBarProps,
   } from './ReadingProgressBar'
   ```

3. **Update barrel file comment**

   - [ ] Add ReadingProgressBar to component list in JSDoc

4. **Final validation**

   - [ ] Verify import works: `import { ReadingProgressBar } from '@/components/articles'`
   - [ ] Verify type export works

### Validation

- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] All unit tests pass: `pnpm test:unit`
- [ ] Import from barrel file works

### Commit

```bash
git add src/components/articles/index.ts
git commit -m "$(cat <<'EOF'
feat(progress): export ReadingProgressBar from articles barrel

- Add ReadingProgressBar to @/components/articles exports
- Export ReadingProgressBarProps type for consumers

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Post-Phase Checklist

After all commits are complete:

### Quality Verification

- [ ] All 5 commits are in git history
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test:unit` passes
- [ ] No regressions in existing tests

### Manual Testing

- [ ] Progress bar appears at top of a test page
- [ ] Progress updates smoothly on scroll
- [ ] Progress shows 0% at top, 100% at bottom
- [ ] Works with article ref (if test page available)
- [ ] Reduced motion: no transition animation

### Documentation

- [ ] JSDoc comments are complete
- [ ] Types are exported
- [ ] Implementation matches spec in UX_UI_Spec.md

### Ready for Review

- [ ] Complete validation/VALIDATION_CHECKLIST.md
- [ ] Create PR using guides/REVIEW.md guidelines

---

## Troubleshooting

### Common Issues

**Hook doesn't update on scroll**
- Check that `passive: true` is set on event listener
- Verify `requestAnimationFrame` is being called
- Check that cleanup is not removing listener prematurely

**Progress jumps or jitters**
- Ensure rounding is applied consistently
- Check that RAF throttling is working
- Verify no conflicting scroll handlers

**Tests fail with mock errors**
- Ensure mocks are set up in beforeEach
- Clear mocks in afterEach
- Check mock implementation matches expected calls

**TypeScript errors on import**
- Verify export is in barrel file
- Check for circular dependencies
- Ensure `'use client'` is present

---

**Checklist Generated**: 2025-12-10
**Last Updated**: 2025-12-10
