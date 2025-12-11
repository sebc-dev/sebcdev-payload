# Phase 3: Table of Contents Component - Validation Checklist

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4

---

## Pre-Validation Requirements

Before starting validation, ensure:

- [ ] All 7 commits are complete
- [ ] All files are created as specified
- [ ] No uncommitted changes: `git status`

---

## Automated Checks

### TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

**Expected Result**: No errors

- [ ] Pass

### ESLint

```bash
pnpm lint
```

**Expected Result**: No errors

- [ ] Pass

### Unit Tests

```bash
pnpm test:unit
```

**Expected Result**: All tests pass

- [ ] Pass
- [ ] Coverage >80% for new code

### Full Test Suite

```bash
pnpm test:unit --coverage
```

**Expected Result**: Coverage report shows adequate coverage

| File | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| `use-active-section.ts` | >85% | >80% | >85% | >85% |
| `TOCLink.tsx` | >85% | >80% | >85% | >85% |
| `TableOfContents.tsx` | >85% | >80% | >85% | >85% |
| `MobileTOC.tsx` | >80% | >75% | >80% | >80% |

---

## File Structure Validation

### Files Created

Verify all new files exist:

```bash
# Hook
ls -la src/hooks/use-active-section.ts

# Components
ls -la src/components/articles/TOCLink.tsx
ls -la src/components/articles/TableOfContents.tsx
ls -la src/components/articles/MobileTOC.tsx

# Tests
ls -la tests/unit/hooks/use-active-section.spec.ts
ls -la tests/unit/components/articles/TOCLink.spec.tsx
ls -la tests/unit/components/articles/TableOfContents.spec.tsx
ls -la tests/unit/components/articles/MobileTOC.spec.tsx
```

- [ ] `src/hooks/use-active-section.ts` exists
- [ ] `src/components/articles/TOCLink.tsx` exists
- [ ] `src/components/articles/TableOfContents.tsx` exists
- [ ] `src/components/articles/MobileTOC.tsx` exists
- [ ] `tests/unit/hooks/use-active-section.spec.ts` exists
- [ ] `tests/unit/components/articles/TOCLink.spec.tsx` exists
- [ ] `tests/unit/components/articles/TableOfContents.spec.tsx` exists
- [ ] `tests/unit/components/articles/MobileTOC.spec.tsx` exists

### Files Modified

Verify barrel export updated:

```bash
grep -E "TOCLink|TableOfContents|MobileTOC" src/components/articles/index.ts
```

- [ ] `TOCLink` exported
- [ ] `TOCLinkProps` exported
- [ ] `TableOfContents` exported
- [ ] `TableOfContentsProps` exported
- [ ] `MobileTOC` exported
- [ ] `MobileTOCProps` exported

---

## Functional Validation

### useActiveSection Hook

#### Test in Development Console

```typescript
// In browser console or test file
import { useActiveSection } from '@/hooks/use-active-section'

// Should be importable without errors
```

- [ ] Hook imports without error
- [ ] TypeScript types are correct

### TOCLink Component

#### Visual Test

Create a test page or use Storybook:

```tsx
import { TOCLink } from '@/components/articles'

// Test rendering
<div className="p-4 space-y-2">
  <TOCLink id="intro" text="Introduction" level={2} isActive={false} />
  <TOCLink id="features" text="Features" level={2} isActive={true} />
  <TOCLink id="sub-feature" text="Sub Feature" level={3} isActive={false} />
</div>
```

- [ ] Inactive link has muted color
- [ ] Active link has primary color
- [ ] Active link has left border
- [ ] Level 3 is indented
- [ ] Hover shows foreground color (inactive)
- [ ] Focus ring appears on focus

#### Navigation Test

- [ ] Click scrolls to element smoothly
- [ ] URL hash updates on click
- [ ] onNavigate callback fires

#### Accessibility Test

- [ ] Tab focuses link
- [ ] Enter key activates
- [ ] Space key activates
- [ ] Screen reader announces link correctly

### TableOfContents Component

#### Visual Test

```tsx
import { TableOfContents } from '@/components/articles'

const headings = [
  { id: 'intro', text: 'Introduction', level: 2 },
  { id: 'features', text: 'Features', level: 2 },
  { id: 'sub-feature', text: 'Sub Feature', level: 3 },
  { id: 'conclusion', text: 'Conclusion', level: 2 },
]

<TableOfContents headings={headings} title="Contents" topOffset={80} />
```

- [ ] Title displays correctly
- [ ] All entries render
- [ ] Sticky positioning works
- [ ] Active section highlights on scroll
- [ ] Click navigation works

#### Empty State Test

```tsx
<TableOfContents headings={[]} />
```

- [ ] Returns null (nothing rendered)

#### Accessibility Test

- [ ] Has `<nav>` element
- [ ] Has `aria-label` on nav
- [ ] Has `<ul role="list">`
- [ ] Each link is in `<li>`

### MobileTOC Component

#### Visual Test

```tsx
import { MobileTOC } from '@/components/articles'

const headings = [
  { id: 'intro', text: 'Introduction', level: 2 },
  { id: 'features', text: 'Features', level: 2 },
  { id: 'conclusion', text: 'Conclusion', level: 2 },
]

<MobileTOC headings={headings} title="Table of Contents" />
```

- [ ] Floating button appears bottom-right
- [ ] Button has List icon
- [ ] Button is rounded (rounded-full)
- [ ] Button has shadow

#### Sheet Behavior Test

- [ ] Click button opens sheet
- [ ] Sheet opens from right
- [ ] Sheet has title
- [ ] All headings visible in sheet
- [ ] Click link scrolls and closes sheet
- [ ] Close button (X) works
- [ ] Escape key closes sheet
- [ ] Click outside closes sheet

#### Empty State Test

- [ ] No button renders when headings empty

#### Accessibility Test

- [ ] Button has aria-label
- [ ] Sheet has focus trap
- [ ] Sheet has navigation landmark
- [ ] Escape closes sheet

---

## Integration Validation

### Component Integration

Verify components work together:

```tsx
import { TableOfContents, MobileTOC } from '@/components/articles'
import { extractTOCHeadings } from '@/lib/toc'

// In a page component
const headings = extractTOCHeadings(article.content)

// Desktop
<TableOfContents headings={headings} topOffset={80} />

// Mobile
<MobileTOC headings={headings} />
```

- [ ] Components integrate with extractTOCHeadings
- [ ] Types are compatible
- [ ] Both show same headings

### Responsive Behavior

Test on different viewports:

- [ ] Desktop (>1024px): TableOfContents works
- [ ] Tablet (768-1024px): Both could work
- [ ] Mobile (<768px): MobileTOC works well

---

## Accessibility Validation

### ARIA Landmarks

- [ ] `<nav aria-label="...">` on TableOfContents
- [ ] `<nav aria-label="...">` in MobileTOC Sheet
- [ ] Proper list roles

### Keyboard Navigation

- [ ] Tab through all links
- [ ] Enter/Space activates links
- [ ] Focus trapped in Sheet when open
- [ ] Escape closes Sheet

### Screen Reader

Test with VoiceOver (Mac) or NVDA (Windows):

- [ ] Navigation landmark announced
- [ ] Link text read correctly
- [ ] Active link announced (aria-current)
- [ ] Sheet announced as dialog

### Reduced Motion

Test with `prefers-reduced-motion: reduce`:

```css
/* In dev tools, enable reduced motion */
@media (prefers-reduced-motion: reduce) {
  /* Verify instant scroll, no transitions */
}
```

- [ ] TOCLink uses instant scroll
- [ ] Transitions disabled

---

## Performance Validation

### Intersection Observer

- [ ] Observer created once per mount
- [ ] Observer disconnected on unmount
- [ ] No memory leaks (check DevTools Memory)

### Re-renders

- [ ] sectionIds memoized (useMemo)
- [ ] Callbacks memoized (useCallback)
- [ ] No unnecessary re-renders on scroll

### Bundle Size

Check component bundle contribution:

```bash
# Build and analyze
pnpm build
```

- [ ] No unexpected large dependencies
- [ ] Tree-shaking works for unused exports

---

## Code Quality Validation

### TypeScript Strict Mode

- [ ] No `any` types
- [ ] All props typed
- [ ] Return types explicit
- [ ] Null checks present

### Documentation

- [ ] JSDoc on exported functions
- [ ] Interface/type comments
- [ ] Example usage in JSDoc

### Code Style

- [ ] Consistent naming (camelCase)
- [ ] No console.log
- [ ] No TODO comments left
- [ ] Clean imports

---

## Git History Validation

### Commits

```bash
git log --oneline -7
```

- [ ] 7 commits present
- [ ] Each commit message follows convention
- [ ] No WIP or fixup commits
- [ ] Commits are logically ordered

### Commit Contents

For each commit:
- [ ] Contains only related files
- [ ] Passes all checks independently
- [ ] Can be reverted cleanly

---

## Phase Completion Checklist

### All Files Complete

- [ ] `src/hooks/use-active-section.ts`
- [ ] `src/components/articles/TOCLink.tsx`
- [ ] `src/components/articles/TableOfContents.tsx`
- [ ] `src/components/articles/MobileTOC.tsx`
- [ ] `src/components/articles/index.ts` (updated)
- [ ] `tests/unit/hooks/use-active-section.spec.ts`
- [ ] `tests/unit/components/articles/TOCLink.spec.tsx`
- [ ] `tests/unit/components/articles/TableOfContents.spec.tsx`
- [ ] `tests/unit/components/articles/MobileTOC.spec.tsx`

### All Checks Pass

- [ ] TypeScript: `pnpm exec tsc --noEmit`
- [ ] Lint: `pnpm lint`
- [ ] Tests: `pnpm test:unit`
- [ ] Coverage: >80% for new code

### Functionality Verified

- [ ] useActiveSection tracks visible sections
- [ ] TOCLink navigates and shows active state
- [ ] TableOfContents renders with sticky positioning
- [ ] MobileTOC opens/closes sheet correctly
- [ ] All components handle empty headings

### Accessibility Verified

- [ ] ARIA landmarks present
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Reduced motion supported

---

## Sign-Off

### Developer

- [ ] All validation items checked
- [ ] Ready for Phase 4 integration

**Developer Name**: _______________
**Date**: _______________

### Reviewer (if applicable)

- [ ] Code review complete
- [ ] Tests adequate
- [ ] Implementation matches spec

**Reviewer Name**: _______________
**Date**: _______________

---

## Ready for Phase 4

When all items are checked:

1. **Phase 3 Complete** - All TOC components implemented and tested
2. **Next Steps** - Proceed to Phase 4 (Integration & E2E Testing)
3. **Integration Points**:
   - `extractTOCHeadings()` from Phase 1
   - `ReadingProgressBar` from Phase 2
   - Article page layout update in Phase 4

---

**Validation Checklist Generated**: 2025-12-11
