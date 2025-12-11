# Phase 3: Table of Contents Component - Code Review Guide

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4

---

## Review Overview

This guide provides structured review criteria for each commit in Phase 3. Use this to ensure consistent, thorough code reviews.

---

## General Review Principles

### Code Quality Checklist

For every commit, verify:

- [ ] TypeScript strict mode compliance (no `any`, proper types)
- [ ] Consistent naming conventions
- [ ] No console.log statements (except intentional debugging)
- [ ] Proper error handling
- [ ] Clean imports (no unused imports)
- [ ] JSDoc comments for public APIs

### React Best Practices

- [ ] Hooks follow rules of hooks
- [ ] Dependencies arrays are correct
- [ ] No unnecessary re-renders
- [ ] Proper cleanup in useEffect
- [ ] Memoization where appropriate

### Accessibility Standards

- [ ] Proper ARIA attributes
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Screen reader compatibility
- [ ] `prefers-reduced-motion` support

---

## Commit 1 Review: useActiveSection Hook

### Purpose

Track which section heading is currently visible using Intersection Observer.

### Key Review Points

#### 1. Type Safety

```typescript
// VERIFY: Options interface is properly typed
export interface UseActiveSectionOptions {
  sectionIds: string[]  // Required
  topOffset?: number    // Optional with default
  threshold?: number    // Optional with default
}

// VERIFY: Return type is explicit
export function useActiveSection(options: UseActiveSectionOptions): string | null
```

#### 2. Intersection Observer Setup

```typescript
// VERIFY: rootMargin accounts for sticky header
const rootMargin = `-${topOffset}px 0px -60% 0px`

// VERIFY: Observer is created with correct options
observerRef.current = new IntersectionObserver(handleIntersection, {
  rootMargin,
  threshold,
})
```

#### 3. Visible Sections Tracking

```typescript
// VERIFY: Uses Set for O(1) add/delete operations
const visibleSectionsRef = useRef<Set<string>>(new Set())

// VERIFY: Correctly adds/removes from set
if (entry.isIntersecting) {
  visibleSectionsRef.current.add(id)
} else {
  visibleSectionsRef.current.delete(id)
}
```

#### 4. Document Order Priority

```typescript
// VERIFY: Returns first visible in sectionIds order (document order)
const visibleInOrder = sectionIds.filter((id) =>
  visibleSectionsRef.current.has(id)
)

if (visibleInOrder.length > 0) {
  setActiveId(visibleInOrder[0])  // First in document order
}
```

#### 5. Cleanup

```typescript
// VERIFY: Disconnects observer on unmount/re-render
return () => {
  observerRef.current?.disconnect()
  visibleSectionsRef.current.clear()
}
```

### Questions to Ask

- Is the threshold (0.3) appropriate for typical heading heights?
- Does the rootMargin create a good trigger zone for different article layouts?
- What happens when sectionIds change? (Should recreate observer)

### Red Flags

- [ ] Missing cleanup in useEffect return
- [ ] Using state instead of ref for observer
- [ ] Not handling missing DOM elements
- [ ] Memory leaks (not disconnecting observer)

---

## Commit 2 Review: TOCLink Component

### Purpose

Reusable link component for individual TOC entries with active state styling.

### Key Review Points

#### 1. Props Interface

```typescript
// VERIFY: All props are properly typed
export interface TOCLinkProps {
  id: string
  text: string
  level: 2 | 3         // Constrained to valid levels
  isActive: boolean
  onNavigate?: () => void
  className?: string
}
```

#### 2. Smooth Scroll with Reduced Motion

```typescript
// VERIFY: Checks media query for reduced motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

// VERIFY: Uses 'instant' for reduced motion users
element.scrollIntoView({
  behavior: prefersReducedMotion ? 'instant' : 'smooth',
  block: 'start',
})
```

#### 3. URL Hash Update

```typescript
// VERIFY: Uses pushState to update hash without scroll jump
window.history.pushState(null, '', `#${id}`)
```

#### 4. Level-Based Indentation

```typescript
// VERIFY: Different padding for h2 vs h3
level === 2 ? 'pl-0' : 'pl-4'
```

#### 5. Active State Styling

```typescript
// VERIFY: Clear visual distinction for active state
isActive
  ? 'text-primary font-medium border-l-2 border-primary -ml-px pl-3'
  : 'text-muted-foreground hover:text-foreground'
```

#### 6. Accessibility

```typescript
// VERIFY: aria-current set correctly
aria-current={isActive ? 'location' : undefined}

// VERIFY: Keyboard handlers
onKeyDown={handleKeyDown}  // Enter and Space support

// VERIFY: Focus styles
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

// VERIFY: Motion reduction
'motion-reduce:transition-none'
```

### Questions to Ask

- Does the indentation (pl-4) provide enough visual hierarchy?
- Is the active border clear enough against the design?
- Should we add a transition for active state changes?

### Red Flags

- [ ] Missing `e.preventDefault()` on click
- [ ] Not checking for element existence before scrollIntoView
- [ ] Hardcoded colors instead of design tokens
- [ ] Missing keyboard support

---

## Commit 3 Review: TableOfContents Component

### Purpose

Desktop sticky sidebar component displaying all TOC entries.

### Key Review Points

#### 1. Memoized Section IDs

```typescript
// VERIFY: Prevents unnecessary re-renders
const sectionIds = useMemo(
  () => headings.map((heading) => heading.id),
  [headings]
)
```

#### 2. Empty State Handling

```typescript
// VERIFY: Returns null for empty headings
if (headings.length === 0) {
  return null
}
```

#### 3. Sticky Positioning

```typescript
// VERIFY: Uses CSS sticky with dynamic top offset
className={cn('sticky', ...)}
style={{ top: `${topOffset}px` }}
```

#### 4. ARIA Navigation Landmark

```typescript
// VERIFY: Proper navigation landmark
<nav
  aria-label={title}
  ...
>
```

#### 5. List Structure

```typescript
// VERIFY: Semantic list with role attribute
<ul className="..." role="list">
  {headings.map((heading) => (
    <li key={heading.id}>
      <TOCLink ... />
    </li>
  ))}
</ul>
```

#### 6. Active Section Integration

```typescript
// VERIFY: Passes options to useActiveSection
const activeId = useActiveSection({
  sectionIds,
  topOffset,
})

// VERIFY: Passes active state to TOCLinks
<TOCLink
  isActive={activeId === heading.id}
  ...
/>
```

### Questions to Ask

- Is max-w-[200px] appropriate for all title lengths?
- Should we truncate long titles with ellipsis?
- Is the border-l styling consistent with the design system?

### Red Flags

- [ ] Not using useMemo for sectionIds
- [ ] Missing aria-label on nav
- [ ] Using index as key instead of heading.id
- [ ] Inline styles when CSS would suffice

---

## Commit 4 Review: MobileTOC Component

### Purpose

Mobile-friendly TOC with Sheet modal and fixed trigger button.

### Key Review Points

#### 1. Controlled Sheet State

```typescript
// VERIFY: Controlled open state
const [isOpen, setIsOpen] = useState(false)

// VERIFY: State passed to Sheet
<Sheet open={isOpen} onOpenChange={setIsOpen}>
```

#### 2. Auto-Close on Navigation

```typescript
// VERIFY: Callback closes sheet
const handleNavigate = useCallback(() => {
  setIsOpen(false)
}, [])

// VERIFY: Passed to TOCLinks
<TOCLink
  onNavigate={handleNavigate}
  ...
/>
```

#### 3. Fixed Button Position

```typescript
// VERIFY: Button is fixed positioned
className={cn(
  'fixed bottom-4 right-4 z-40',
  'h-12 w-12',
  'shadow-lg',
  'rounded-full',
  ...
)}
```

#### 4. Trigger Accessibility

```typescript
// VERIFY: Button has aria-label
<Button
  aria-label={triggerLabel}
  ...
>
```

#### 5. Sheet Configuration

```typescript
// VERIFY: Opens from right side
<SheetContent side="right" className="w-[280px] sm:w-[320px]">

// VERIFY: Has proper header
<SheetHeader>
  <SheetTitle>{title}</SheetTitle>
</SheetHeader>
```

#### 6. Empty State

```typescript
// VERIFY: No button rendered for empty headings
if (headings.length === 0) {
  return null
}
```

### Questions to Ask

- Is z-40 high enough for all use cases?
- Should the button position be configurable?
- Is the sheet width appropriate for all content lengths?

### Red Flags

- [ ] Not using SheetTitle (required for accessibility)
- [ ] Missing aria-label on trigger button
- [ ] Sheet not closing after navigation
- [ ] Button overlapping with other fixed elements

---

## Commit 5 Review: useActiveSection Tests

### Purpose

Comprehensive unit tests for the active section hook.

### Key Review Points

#### 1. IntersectionObserver Mock

```typescript
// VERIFY: Properly mocks IntersectionObserver
global.IntersectionObserver = vi.fn((callback) => {
  mockCallback = callback
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    ...
  }
})
```

#### 2. Test Coverage Areas

- [ ] Returns null for empty sectionIds
- [ ] Creates observer with correct rootMargin
- [ ] Observes all provided elements
- [ ] Sets initial active at page top
- [ ] Updates active on intersection
- [ ] Prioritizes document order
- [ ] Handles visibility changes
- [ ] Disconnects on unmount
- [ ] Handles missing DOM elements

#### 3. Intersection Simulation

```typescript
// VERIFY: Properly simulates intersection events
act(() => {
  mockCallback?.(
    [
      {
        target: { id: 'main' } as Element,
        isIntersecting: true,
        intersectionRatio: 0.5,
      } as IntersectionObserverEntry,
    ],
    {} as IntersectionObserver
  )
})
```

### Red Flags

- [ ] Not cleaning up mocks in afterEach
- [ ] Missing act() wrapper for state updates
- [ ] Not testing cleanup behavior
- [ ] Incomplete edge case coverage

---

## Commit 6 Review: TOCLink and TableOfContents Tests

### Purpose

Component tests for TOCLink and TableOfContents.

### Key Review Points

#### 1. DOM Setup

```typescript
// VERIFY: Creates target elements for scroll tests
beforeEach(() => {
  const targetElement = document.createElement('div')
  targetElement.id = 'test-section'
  document.body.appendChild(targetElement)
})

// VERIFY: Cleans up DOM
afterEach(() => {
  document.body.innerHTML = ''
})
```

#### 2. TOCLink Test Coverage

- [ ] Renders with correct text and href
- [ ] Applies active/inactive styling
- [ ] Applies level-based indentation
- [ ] Scrolls to element on click
- [ ] Uses instant scroll with reduced motion
- [ ] Updates URL hash
- [ ] Calls onNavigate callback
- [ ] Prevents default behavior
- [ ] Keyboard navigation (Enter, Space)
- [ ] Focus styles present

#### 3. TableOfContents Test Coverage

- [ ] Renders navigation with aria-label
- [ ] Renders custom title
- [ ] Renders all headings
- [ ] Returns null for empty
- [ ] Has sticky positioning
- [ ] Applies top offset
- [ ] Integrates with useActiveSection
- [ ] Highlights active section

#### 4. Mock Setup

```typescript
// VERIFY: Properly mocks useActiveSection
vi.mock('@/hooks/use-active-section', () => ({
  useActiveSection: vi.fn(() => null),
}))
```

### Red Flags

- [ ] Not mocking scrollIntoView
- [ ] Not mocking matchMedia
- [ ] Missing userEvent for interactions
- [ ] Not testing accessibility attributes

---

## Commit 7 Review: MobileTOC Tests and Exports

### Purpose

MobileTOC tests and barrel export updates.

### Key Review Points

#### 1. Sheet Testing

```typescript
// VERIFY: Uses waitFor for async dialog rendering
await waitFor(() => {
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

#### 2. MobileTOC Test Coverage

- [ ] Trigger button renders
- [ ] Custom trigger label
- [ ] Custom trigger className
- [ ] Fixed positioning classes
- [ ] Opens sheet on click
- [ ] Displays title in header
- [ ] Displays all headings
- [ ] Closes on navigation
- [ ] Returns null for empty
- [ ] Active section highlighting
- [ ] Navigation landmark in sheet
- [ ] List role for items

#### 3. Barrel Export

```typescript
// VERIFY: All components and types exported
export { TOCLink, type TOCLinkProps } from './TOCLink'
export { TableOfContents, type TableOfContentsProps } from './TableOfContents'
export { MobileTOC, type MobileTOCProps } from './MobileTOC'
```

### Red Flags

- [ ] Not testing sheet close on navigation
- [ ] Missing userEvent for button clicks
- [ ] Not exporting prop types
- [ ] Export order inconsistent

---

## Review Checklist Summary

### For Each Commit

```markdown
## Commit X: [Name]

### Functionality
- [ ] Works as intended
- [ ] Edge cases handled
- [ ] Error cases handled

### Code Quality
- [ ] TypeScript types correct
- [ ] No any types
- [ ] Clean imports
- [ ] Consistent naming

### React Patterns
- [ ] Hooks rules followed
- [ ] Proper cleanup
- [ ] Memoization where needed

### Accessibility
- [ ] ARIA attributes correct
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Reduced motion support

### Tests (commits 5-7)
- [ ] All assertions meaningful
- [ ] Edge cases covered
- [ ] Mocks properly set up
- [ ] Cleanup in afterEach
```

---

## Approval Criteria

### Must Pass

- [ ] All TypeScript checks pass (`pnpm exec tsc --noEmit`)
- [ ] All lint checks pass (`pnpm lint`)
- [ ] All tests pass (`pnpm test:unit`)
- [ ] No console errors in dev server

### Should Have

- [ ] Clear commit messages following conventions
- [ ] JSDoc on public APIs
- [ ] Logical file organization
- [ ] Consistent code style

### Nice to Have

- [ ] Inline comments explaining complex logic
- [ ] Performance optimizations documented
- [ ] Future improvement notes

---

**Review Guide Generated**: 2025-12-11
