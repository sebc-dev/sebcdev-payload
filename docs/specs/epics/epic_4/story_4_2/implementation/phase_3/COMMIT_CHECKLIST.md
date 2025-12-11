# Phase 3: Table of Contents Component - Commit Checklist

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4
**Total Commits**: 7

---

## How to Use This Checklist

For each commit:
1. Complete all items in the "Before Commit" section
2. Run the validation commands
3. Stage and commit with the provided message
4. Complete the "After Commit" verification

---

## Commit 1: useActiveSection Hook

### Before Commit

- [ ] Create `src/hooks/use-active-section.ts`
- [ ] Implement `useActiveSection` hook with:
  - [ ] `UseActiveSectionOptions` interface
  - [ ] Intersection Observer setup
  - [ ] Visible sections tracking via Set
  - [ ] First-in-document-order active selection
  - [ ] Configurable `topOffset` (default: 80)
  - [ ] Configurable `threshold` (default: 0.3)
  - [ ] Initial active section at page top
  - [ ] Cleanup on unmount

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Manual verification (in dev console)
# Hook should be importable: import { useActiveSection } from '@/hooks/use-active-section'
```

### Commit

```bash
git add src/hooks/use-active-section.ts

git commit -m "$(cat <<'EOF'
feat(toc): add useActiveSection hook for section tracking

- Implement Intersection Observer-based active section detection
- Support configurable top offset for sticky header
- Track multiple intersecting sections, return first in document order
- Add proper cleanup on unmount

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] Run `pnpm exec tsc --noEmit` again
- [ ] Branch is clean: `git status`

---

## Commit 2: TOCLink Component

### Before Commit

- [ ] Create `src/components/articles/TOCLink.tsx`
- [ ] Implement `TOCLink` component with:
  - [ ] `TOCLinkProps` interface exported
  - [ ] Smooth scroll navigation
  - [ ] `prefers-reduced-motion` support (instant vs smooth)
  - [ ] URL hash update via `history.pushState`
  - [ ] `aria-current="location"` when active
  - [ ] Level-based indentation (`pl-0` for h2, `pl-4` for h3)
  - [ ] Active styling (primary color, border, font-medium)
  - [ ] Inactive styling (muted-foreground, hover state)
  - [ ] Focus-visible ring
  - [ ] `motion-reduce:transition-none`
  - [ ] `onNavigate` callback support
  - [ ] Keyboard navigation (Enter, Space)

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint
```

### Commit

```bash
git add src/components/articles/TOCLink.tsx

git commit -m "$(cat <<'EOF'
feat(toc): add TOCLink component for individual entries

- Create accessible TOC link with active state
- Implement smooth scroll navigation
- Add level-based indentation (h2/h3)
- Support prefers-reduced-motion
- Add keyboard accessibility

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] Run `pnpm exec tsc --noEmit` again
- [ ] Branch is clean: `git status`

---

## Commit 3: TableOfContents Component

### Before Commit

- [ ] Create `src/components/articles/TableOfContents.tsx`
- [ ] Implement `TableOfContents` component with:
  - [ ] `TableOfContentsProps` interface exported
  - [ ] Import `TOCHeading` from `@/lib/toc/types`
  - [ ] Import and use `useActiveSection` hook
  - [ ] Import and use `TOCLink` component
  - [ ] Extract section IDs with `useMemo`
  - [ ] Return `null` for empty headings
  - [ ] `<nav>` element with `aria-label={title}`
  - [ ] `<h2>` title element
  - [ ] `<ul role="list">` for entries
  - [ ] Sticky positioning via className
  - [ ] `style={{ top: ${topOffset}px }}`
  - [ ] Width constraint `max-w-[200px]`
  - [ ] Pass `onNavigate` to TOCLinks
  - [ ] Support custom `className`

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint
```

### Commit

```bash
git add src/components/articles/TableOfContents.tsx

git commit -m "$(cat <<'EOF'
feat(toc): add TableOfContents desktop component

- Create sticky sidebar TOC component
- Integrate useActiveSection for highlighting
- Support configurable title and offset
- Add ARIA landmark for accessibility
- Handle empty headings gracefully

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] Run `pnpm exec tsc --noEmit` again
- [ ] Branch is clean: `git status`

---

## Commit 4: MobileTOC Component

### Before Commit

- [ ] Create `src/components/articles/MobileTOC.tsx`
- [ ] Implement `MobileTOC` component with:
  - [ ] `MobileTOCProps` interface exported
  - [ ] Import Sheet components from `@/components/ui/sheet`
  - [ ] Import `List` icon from `lucide-react`
  - [ ] Import and use `useActiveSection` hook
  - [ ] Import and use `TOCLink` component
  - [ ] `useState` for open/close state
  - [ ] Return `null` for empty headings
  - [ ] Fixed position trigger button (`fixed bottom-4 right-4`)
  - [ ] Button with `List` icon
  - [ ] `aria-label` on trigger button
  - [ ] Sheet opens from right (`side="right"`)
  - [ ] Sheet width `w-[280px] sm:w-[320px]`
  - [ ] SheetHeader with SheetTitle
  - [ ] Nav with aria-label in sheet content
  - [ ] Auto-close on navigation via `handleNavigate`
  - [ ] Active section highlighting in sheet

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint
```

### Commit

```bash
git add src/components/articles/MobileTOC.tsx

git commit -m "$(cat <<'EOF'
feat(toc): add MobileTOC component with Sheet modal

- Create fixed trigger button with List icon
- Implement Sheet modal for TOC display
- Auto-close Sheet on navigation
- Integrate active section highlighting
- Handle empty headings gracefully

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] Run `pnpm exec tsc --noEmit` again
- [ ] Branch is clean: `git status`

---

## Commit 5: Unit Tests for useActiveSection Hook

### Before Commit

- [ ] Create `tests/unit/hooks/use-active-section.spec.ts`
- [ ] Implement tests covering:
  - [ ] **Initialization**
    - [ ] Returns null when no sections provided
    - [ ] Creates IntersectionObserver with correct options
    - [ ] Observes all section elements
    - [ ] Sets first section active when at top
  - [ ] **Intersection handling**
    - [ ] Updates active section when entry becomes visible
    - [ ] Returns first visible section in document order
    - [ ] Removes section from visible set when not intersecting
  - [ ] **Cleanup**
    - [ ] Disconnects observer on unmount
    - [ ] Recreates observer when sectionIds change
  - [ ] **Edge cases**
    - [ ] Handles missing DOM elements gracefully
    - [ ] Uses default values for topOffset and threshold

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Run unit tests
pnpm test:unit tests/unit/hooks/use-active-section.spec.ts
```

### Commit

```bash
git add tests/unit/hooks/use-active-section.spec.ts

git commit -m "$(cat <<'EOF'
test(toc): add unit tests for useActiveSection hook

- Test IntersectionObserver initialization
- Test active section tracking on intersection
- Test document order priority for multiple visible
- Test cleanup and observer recreation
- Test edge cases and defaults

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] All tests pass: `pnpm test:unit`
- [ ] Branch is clean: `git status`

---

## Commit 6: TOCLink and TableOfContents Tests

### Before Commit

- [ ] Create `tests/unit/components/articles/TOCLink.spec.tsx`
- [ ] Implement TOCLink tests covering:
  - [ ] **Rendering**
    - [ ] Renders link with correct text
    - [ ] Renders link with correct href
    - [ ] Applies custom className
  - [ ] **Active state**
    - [ ] No aria-current when inactive
    - [ ] aria-current="location" when active
    - [ ] Applies active styling classes
    - [ ] Applies inactive styling classes
  - [ ] **Indentation**
    - [ ] No padding for level 2
    - [ ] Left padding for level 3
  - [ ] **Navigation**
    - [ ] Scrolls to element on click
    - [ ] Uses instant scroll with reduced motion
    - [ ] Updates URL hash
    - [ ] Calls onNavigate callback
    - [ ] Prevents default link behavior
  - [ ] **Keyboard navigation**
    - [ ] Activates on Enter key
    - [ ] Activates on Space key
  - [ ] **Accessibility**
    - [ ] Has focus-visible styles
    - [ ] Has motion-reduce class

- [ ] Create `tests/unit/components/articles/TableOfContents.spec.tsx`
- [ ] Implement TableOfContents tests covering:
  - [ ] **Rendering**
    - [ ] Renders navigation with aria-label
    - [ ] Renders with custom title
    - [ ] Renders all headings as links
    - [ ] Renders list with role="list"
    - [ ] Returns null for empty headings
    - [ ] Applies custom className
  - [ ] **Sticky positioning**
    - [ ] Has sticky class
    - [ ] Applies default top offset
    - [ ] Applies custom top offset
  - [ ] **Active section integration**
    - [ ] Passes sectionIds to useActiveSection
    - [ ] Highlights active section
    - [ ] Does not highlight inactive sections
  - [ ] **Width constraints**
    - [ ] Has max-width class

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Run unit tests
pnpm test:unit tests/unit/components/articles/TOCLink.spec.tsx tests/unit/components/articles/TableOfContents.spec.tsx
```

### Commit

```bash
git add tests/unit/components/articles/TOCLink.spec.tsx tests/unit/components/articles/TableOfContents.spec.tsx

git commit -m "$(cat <<'EOF'
test(toc): add component tests for TOCLink and TableOfContents

- Test TOCLink rendering, active state, and navigation
- Test TOCLink keyboard accessibility
- Test TableOfContents rendering and sticky positioning
- Test active section integration
- Test edge cases and accessibility

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] All tests pass: `pnpm test:unit`
- [ ] Branch is clean: `git status`

---

## Commit 7: MobileTOC Tests and Barrel Export

### Before Commit

- [ ] Create `tests/unit/components/articles/MobileTOC.spec.tsx`
- [ ] Implement MobileTOC tests covering:
  - [ ] **Trigger button**
    - [ ] Renders trigger button
    - [ ] Renders with custom trigger label
    - [ ] Applies custom trigger className
    - [ ] Has fixed positioning classes
    - [ ] Has rounded-full class
  - [ ] **Sheet behavior**
    - [ ] Opens sheet on button click
    - [ ] Displays title in sheet header
    - [ ] Displays all headings in sheet
    - [ ] Closes sheet on link click
  - [ ] **Empty state**
    - [ ] Returns null when headings empty
  - [ ] **Active section integration**
    - [ ] Passes sectionIds to useActiveSection
    - [ ] Highlights active section in sheet
  - [ ] **Accessibility**
    - [ ] Has navigation landmark in sheet
    - [ ] Has list role for TOC items

- [ ] Update `src/components/articles/index.ts`:
  - [ ] Export `TOCLink` and `TOCLinkProps`
  - [ ] Export `TableOfContents` and `TableOfContentsProps`
  - [ ] Export `MobileTOC` and `MobileTOCProps`

### Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Run all unit tests
pnpm test:unit

# Verify exports
# In a test file or console, these imports should work:
# import { TOCLink, TableOfContents, MobileTOC } from '@/components/articles'
```

### Commit

```bash
git add tests/unit/components/articles/MobileTOC.spec.tsx src/components/articles/index.ts

git commit -m "$(cat <<'EOF'
feat(toc): add MobileTOC tests and export all components

- Add comprehensive tests for MobileTOC component
- Test sheet open/close behavior
- Test auto-close on navigation
- Export TOCLink, TableOfContents, MobileTOC from barrel
- Export component prop types for consumers

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### After Commit

- [ ] Verify commit appears in `git log`
- [ ] All tests pass: `pnpm test:unit`
- [ ] Branch is clean: `git status`

---

## Phase Completion Checklist

After all 7 commits:

### Verification

```bash
# All TypeScript checks pass
pnpm exec tsc --noEmit

# All lint checks pass
pnpm lint

# All unit tests pass
pnpm test:unit

# Verify git log shows all commits
git log --oneline -7
```

### Files Created

- [ ] `src/hooks/use-active-section.ts`
- [ ] `src/components/articles/TOCLink.tsx`
- [ ] `src/components/articles/TableOfContents.tsx`
- [ ] `src/components/articles/MobileTOC.tsx`
- [ ] `tests/unit/hooks/use-active-section.spec.ts`
- [ ] `tests/unit/components/articles/TOCLink.spec.tsx`
- [ ] `tests/unit/components/articles/TableOfContents.spec.tsx`
- [ ] `tests/unit/components/articles/MobileTOC.spec.tsx`

### Files Modified

- [ ] `src/components/articles/index.ts`

### Quality Metrics

- [ ] TypeScript: strict mode, no errors
- [ ] ESLint: no errors
- [ ] Tests: all passing, >80% coverage for new code
- [ ] Accessibility: ARIA attributes, keyboard navigation
- [ ] Performance: proper cleanup, memoization where needed

### Ready for Phase 4

- [ ] All Phase 3 commits complete
- [ ] TOC components ready for integration
- [ ] Proceed to Phase 4 (Integration & E2E Testing)

---

**Checklist Generated**: 2025-12-11
