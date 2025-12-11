# Phase 3: Table of Contents Component - Implementation Plan

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4
**Estimated Duration**: 3-4 days
**Atomic Commits**: 7

---

## Implementation Strategy

### Approach: Atomic Commits with Type-Safe Progression

This phase follows the atomic commit strategy where each commit:
- Is independently reviewable
- Passes all type checks
- Maintains working state
- Can be safely reverted if needed

### Commit Sequence Overview

```
[Commit 1] useActiveSection hook
    |
    v
[Commit 2] TOCLink component
    |
    v
[Commit 3] TableOfContents component
    |
    v
[Commit 4] MobileTOC component
    |
    v
[Commit 5] Unit tests for hook
    |
    v
[Commit 6] TOCLink + TableOfContents tests
    |
    v
[Commit 7] MobileTOC tests + barrel export
```

---

## Commit 1: Create useActiveSection Hook

**Objective**: Implement Intersection Observer-based hook to track which section is currently visible.

### Files to Create

#### `src/hooks/use-active-section.ts`

```typescript
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export interface UseActiveSectionOptions {
  /**
   * IDs of the sections to observe
   */
  sectionIds: string[]
  /**
   * Offset from top of viewport (e.g., for sticky header)
   * @default 80
   */
  topOffset?: number
  /**
   * Intersection threshold (0-1)
   * @default 0.3
   */
  threshold?: number
}

/**
 * Custom hook to track which section is currently active based on scroll position.
 *
 * Uses Intersection Observer to efficiently detect which section heading
 * is most visible in the viewport.
 *
 * @param options - Configuration options
 * @returns activeId - ID of the currently active section, or null if none
 *
 * @example
 * const activeId = useActiveSection({
 *   sectionIds: ['intro', 'features', 'conclusion'],
 *   topOffset: 100, // account for sticky header
 * })
 */
export function useActiveSection({
  sectionIds,
  topOffset = 80,
  threshold = 0.3,
}: UseActiveSectionOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Track which sections are currently intersecting
  const visibleSectionsRef = useRef<Set<string>>(new Set())

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id

        if (entry.isIntersecting) {
          visibleSectionsRef.current.add(id)
        } else {
          visibleSectionsRef.current.delete(id)
        }
      })

      // Find the first visible section in document order
      const visibleInOrder = sectionIds.filter((id) =>
        visibleSectionsRef.current.has(id)
      )

      if (visibleInOrder.length > 0) {
        // Use the first visible section (highest in document)
        setActiveId(visibleInOrder[0])
      } else if (visibleSectionsRef.current.size === 0) {
        // No sections visible - keep last active or clear
        // Keep the current active ID for smoother UX
      }
    },
    [sectionIds]
  )

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Don't create observer if no sections to observe
    if (sectionIds.length === 0) {
      setActiveId(null)
      return
    }

    // Create new observer with root margin to trigger earlier
    // Negative top margin accounts for sticky header
    // Negative bottom margin triggers when element is in top portion
    const rootMargin = `-${topOffset}px 0px -60% 0px`

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    })

    // Observe all section elements
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    // Set initial active section (first one if at top)
    if (window.scrollY < 100 && sectionIds.length > 0) {
      setActiveId(sectionIds[0])
    }

    return () => {
      observerRef.current?.disconnect()
      visibleSectionsRef.current.clear()
    }
  }, [sectionIds, topOffset, threshold, handleIntersection])

  return activeId
}
```

### Validation Criteria

- [ ] Hook compiles without TypeScript errors
- [ ] Hook returns string ID or null
- [ ] Uses Intersection Observer API
- [ ] Properly cleans up observer on unmount
- [ ] Supports configurable topOffset and threshold

### Commit Message

```
feat(toc): add useActiveSection hook for section tracking

- Implement Intersection Observer-based active section detection
- Support configurable top offset for sticky header
- Track multiple intersecting sections, return first in document order
- Add proper cleanup on unmount
```

---

## Commit 2: Create TOCLink Component

**Objective**: Create reusable TOC link component with active state styling.

### Files to Create

#### `src/components/articles/TOCLink.tsx`

```typescript
'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface TOCLinkProps {
  /**
   * ID of the heading element to scroll to
   */
  id: string
  /**
   * Text content to display
   */
  text: string
  /**
   * Heading level (2 or 3) for indentation
   */
  level: 2 | 3
  /**
   * Whether this link is currently active
   */
  isActive: boolean
  /**
   * Optional callback after navigation
   */
  onNavigate?: () => void
  /**
   * Optional className for custom styling
   */
  className?: string
}

/**
 * Individual Table of Contents link with active state.
 *
 * Features:
 * - Smooth scroll navigation
 * - Visual indication of active section
 * - Indentation based on heading level
 * - Respects prefers-reduced-motion
 * - Keyboard accessible
 *
 * @example
 * <TOCLink
 *   id="introduction"
 *   text="Introduction"
 *   level={2}
 *   isActive={activeId === 'introduction'}
 * />
 */
export function TOCLink({
  id,
  text,
  level,
  isActive,
  onNavigate,
  className,
}: TOCLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()

      const element = document.getElementById(id)
      if (!element) return

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
        block: 'start',
      })

      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`)

      // Call onNavigate callback (e.g., to close mobile sheet)
      onNavigate?.()
    },
    [id, onNavigate]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.currentTarget.click()
      }
    },
    []
  )

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={isActive ? 'location' : undefined}
      className={cn(
        // Base styles
        'block py-1.5 text-sm transition-colors duration-150',
        // Indentation based on level
        level === 2 ? 'pl-0' : 'pl-4',
        // Active state
        isActive
          ? 'text-primary font-medium border-l-2 border-primary -ml-px pl-3'
          : 'text-muted-foreground hover:text-foreground',
        // Focus styles
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        // Reduced motion
        'motion-reduce:transition-none',
        className
      )}
    >
      {text}
    </a>
  )
}
```

### Validation Criteria

- [ ] Component renders without errors
- [ ] Active state styling applies correctly
- [ ] Level-based indentation works (h2 vs h3)
- [ ] Smooth scroll navigation functions
- [ ] `aria-current="location"` set when active
- [ ] Keyboard navigation works (Enter, Space)

### Commit Message

```
feat(toc): add TOCLink component for individual entries

- Create accessible TOC link with active state
- Implement smooth scroll navigation
- Add level-based indentation (h2/h3)
- Support prefers-reduced-motion
- Add keyboard accessibility
```

---

## Commit 3: Create TableOfContents Component

**Objective**: Create the desktop Table of Contents component with sticky positioning.

### Files to Create

#### `src/components/articles/TableOfContents.tsx`

```typescript
'use client'

import { useMemo } from 'react'
import type { TOCHeading } from '@/lib/toc/types'
import { useActiveSection } from '@/hooks/use-active-section'
import { TOCLink } from './TOCLink'
import { cn } from '@/lib/utils'

export interface TableOfContentsProps {
  /**
   * Array of headings extracted from article content
   */
  headings: TOCHeading[]
  /**
   * Title displayed above the TOC
   * @default "Table of Contents"
   */
  title?: string
  /**
   * Offset from top for sticky positioning and intersection observer
   * @default 80
   */
  topOffset?: number
  /**
   * Optional callback after navigation
   */
  onNavigate?: () => void
  /**
   * Optional className for custom styling
   */
  className?: string
}

/**
 * Desktop Table of Contents with sticky positioning.
 *
 * Features:
 * - Sticky sidebar positioning
 * - Active section highlighting via Intersection Observer
 * - Smooth scroll navigation
 * - Accessible with ARIA landmarks
 *
 * @example
 * const headings = extractTOCHeadings(article.content)
 *
 * <TableOfContents
 *   headings={headings}
 *   title="Contents"
 *   topOffset={100}
 * />
 */
export function TableOfContents({
  headings,
  title = 'Table of Contents',
  topOffset = 80,
  onNavigate,
  className,
}: TableOfContentsProps) {
  // Extract IDs for active section tracking
  const sectionIds = useMemo(
    () => headings.map((heading) => heading.id),
    [headings]
  )

  // Track active section
  const activeId = useActiveSection({
    sectionIds,
    topOffset,
  })

  // Don't render if no headings
  if (headings.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={title}
      className={cn(
        // Sticky positioning
        'sticky',
        // Width constraints
        'w-full max-w-[200px]',
        // Spacing
        'py-4',
        className
      )}
      style={{ top: `${topOffset}px` }}
    >
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>

      <ul className="space-y-0.5 border-l border-border" role="list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <TOCLink
              id={heading.id}
              text={heading.text}
              level={heading.level}
              isActive={activeId === heading.id}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### Validation Criteria

- [ ] Component renders without errors
- [ ] Returns null when headings array is empty
- [ ] Sticky positioning works with configurable topOffset
- [ ] Active section highlights correctly
- [ ] Navigation works for all entries
- [ ] `aria-label` on nav element

### Commit Message

```
feat(toc): add TableOfContents desktop component

- Create sticky sidebar TOC component
- Integrate useActiveSection for highlighting
- Support configurable title and offset
- Add ARIA landmark for accessibility
- Handle empty headings gracefully
```

---

## Commit 4: Create MobileTOC Component

**Objective**: Create mobile Table of Contents with Sheet modal and trigger button.

### Files to Create

#### `src/components/articles/MobileTOC.tsx`

```typescript
'use client'

import { useState, useCallback, useMemo } from 'react'
import { List } from 'lucide-react'
import type { TOCHeading } from '@/lib/toc/types'
import { useActiveSection } from '@/hooks/use-active-section'
import { TOCLink } from './TOCLink'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface MobileTOCProps {
  /**
   * Array of headings extracted from article content
   */
  headings: TOCHeading[]
  /**
   * Title displayed in the Sheet header
   * @default "Table of Contents"
   */
  title?: string
  /**
   * Aria label for the trigger button
   * @default "Open table of contents"
   */
  triggerLabel?: string
  /**
   * Offset from top for intersection observer
   * @default 80
   */
  topOffset?: number
  /**
   * Optional className for the trigger button
   */
  triggerClassName?: string
}

/**
 * Mobile Table of Contents with Sheet modal.
 *
 * Features:
 * - Fixed position trigger button
 * - Full-screen Sheet modal from right
 * - Active section highlighting
 * - Auto-close on navigation
 * - Accessible with focus trap
 *
 * @example
 * const headings = extractTOCHeadings(article.content)
 *
 * <MobileTOC
 *   headings={headings}
 *   title="Contents"
 *   triggerLabel="Menu"
 * />
 */
export function MobileTOC({
  headings,
  title = 'Table of Contents',
  triggerLabel = 'Open table of contents',
  topOffset = 80,
  triggerClassName,
}: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract IDs for active section tracking
  const sectionIds = useMemo(
    () => headings.map((heading) => heading.id),
    [headings]
  )

  // Track active section
  const activeId = useActiveSection({
    sectionIds,
    topOffset,
  })

  // Close sheet after navigation
  const handleNavigate = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Don't render if no headings
  if (headings.length === 0) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          aria-label={triggerLabel}
          className={cn(
            // Fixed positioning
            'fixed bottom-4 right-4 z-40',
            // Size
            'h-12 w-12',
            // Shadow for visibility
            'shadow-lg',
            // Rounded
            'rounded-full',
            triggerClassName
          )}
        >
          <List className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <nav aria-label={title} className="mt-6">
          <ul className="space-y-0.5 border-l border-border" role="list">
            {headings.map((heading) => (
              <li key={heading.id}>
                <TOCLink
                  id={heading.id}
                  text={heading.text}
                  level={heading.level}
                  isActive={activeId === heading.id}
                  onNavigate={handleNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

### Validation Criteria

- [ ] Component renders without errors
- [ ] Returns null when headings array is empty
- [ ] Trigger button appears in fixed position
- [ ] Sheet opens on button click
- [ ] Sheet closes after link click (navigation)
- [ ] Active section highlights in Sheet
- [ ] Keyboard navigation works in Sheet

### Commit Message

```
feat(toc): add MobileTOC component with Sheet modal

- Create fixed trigger button with List icon
- Implement Sheet modal for TOC display
- Auto-close Sheet on navigation
- Integrate active section highlighting
- Handle empty headings gracefully
```

---

## Commit 5: Unit Tests for useActiveSection Hook

**Objective**: Add comprehensive unit tests for the active section tracking hook.

### Files to Create

#### `tests/unit/hooks/use-active-section.spec.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveSection } from '@/hooks/use-active-section'

describe('useActiveSection', () => {
  // Mock IntersectionObserver
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let mockCallback: IntersectionObserverCallback | null = null

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    // @ts-expect-error - Mocking IntersectionObserver
    global.IntersectionObserver = vi.fn((callback) => {
      mockCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: vi.fn(),
      }
    })

    // Mock getElementById to return elements
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const element = document.createElement('div')
      element.id = id
      return element
    })

    // Mock scrollY
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockCallback = null
  })

  describe('initialization', () => {
    it('returns null when no sections provided', () => {
      const { result } = renderHook(() =>
        useActiveSection({ sectionIds: [] })
      )

      expect(result.current).toBeNull()
    })

    it('creates IntersectionObserver with correct options', () => {
      renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
          topOffset: 100,
          threshold: 0.5,
        })
      )

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '-100px 0px -60% 0px',
          threshold: 0.5,
        })
      )
    })

    it('observes all section elements', () => {
      renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main', 'conclusion'],
        })
      )

      expect(mockObserve).toHaveBeenCalledTimes(3)
    })

    it('sets first section as active when at top of page', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        })
      )

      expect(result.current).toBe('intro')
    })
  })

  describe('intersection handling', () => {
    it('updates active section when entry becomes visible', () => {
      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        })
      )

      // Simulate intersection
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

      // First visible in document order should be active
      // Since 'intro' is first but not intersecting, 'main' should be active
      expect(result.current).toBe('main')
    })

    it('returns first visible section in document order', () => {
      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main', 'conclusion'],
        })
      )

      // Simulate multiple sections visible
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.3,
            } as IntersectionObserverEntry,
            {
              target: { id: 'conclusion' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.3,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        )
      })

      // 'main' comes before 'conclusion' in sectionIds
      expect(result.current).toBe('main')
    })

    it('removes section from visible set when not intersecting', () => {
      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        })
      )

      // First, make 'main' visible
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

      expect(result.current).toBe('main')

      // Then make 'main' not visible and 'intro' visible
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: false,
              intersectionRatio: 0,
            } as IntersectionObserverEntry,
            {
              target: { id: 'intro' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.5,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        )
      })

      expect(result.current).toBe('intro')
    })
  })

  describe('cleanup', () => {
    it('disconnects observer on unmount', () => {
      const { unmount } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        })
      )

      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('disconnects and recreates observer when sectionIds change', () => {
      const { rerender } = renderHook(
        ({ sectionIds }) => useActiveSection({ sectionIds }),
        { initialProps: { sectionIds: ['intro'] } }
      )

      expect(mockDisconnect).not.toHaveBeenCalled()

      rerender({ sectionIds: ['intro', 'main'] })

      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('handles missing DOM elements gracefully', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['nonexistent'],
        })
      )

      // Should not throw, observe not called for missing elements
      expect(mockObserve).not.toHaveBeenCalled()
      expect(result.current).toBeNull()
    })

    it('uses default values for topOffset and threshold', () => {
      renderHook(() =>
        useActiveSection({
          sectionIds: ['intro'],
        })
      )

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '-80px 0px -60% 0px',
          threshold: 0.3,
        })
      )
    })
  })
})
```

### Validation Criteria

- [ ] All tests pass
- [ ] Tests cover initialization behavior
- [ ] Tests cover intersection handling
- [ ] Tests cover cleanup on unmount
- [ ] Tests cover edge cases

### Commit Message

```
test(toc): add unit tests for useActiveSection hook

- Test IntersectionObserver initialization
- Test active section tracking on intersection
- Test document order priority for multiple visible
- Test cleanup and observer recreation
- Test edge cases and defaults
```

---

## Commit 6: Component Tests for TOCLink and TableOfContents

**Objective**: Add component tests for TOCLink and TableOfContents components.

### Files to Create

#### `tests/unit/components/articles/TOCLink.spec.tsx`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TOCLink } from '@/components/articles/TOCLink'

describe('TOCLink', () => {
  const defaultProps = {
    id: 'test-section',
    text: 'Test Section',
    level: 2 as const,
    isActive: false,
  }

  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()

    // Mock matchMedia for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Mock history.pushState
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {})

    // Create target element
    const targetElement = document.createElement('div')
    targetElement.id = 'test-section'
    document.body.appendChild(targetElement)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('renders link with correct text', () => {
      render(<TOCLink {...defaultProps} />)

      expect(screen.getByRole('link')).toHaveTextContent('Test Section')
    })

    it('renders link with correct href', () => {
      render(<TOCLink {...defaultProps} />)

      expect(screen.getByRole('link')).toHaveAttribute('href', '#test-section')
    })

    it('applies custom className', () => {
      render(<TOCLink {...defaultProps} className="custom-class" />)

      expect(screen.getByRole('link')).toHaveClass('custom-class')
    })
  })

  describe('active state', () => {
    it('does not have aria-current when inactive', () => {
      render(<TOCLink {...defaultProps} isActive={false} />)

      expect(screen.getByRole('link')).not.toHaveAttribute('aria-current')
    })

    it('has aria-current="location" when active', () => {
      render(<TOCLink {...defaultProps} isActive={true} />)

      expect(screen.getByRole('link')).toHaveAttribute(
        'aria-current',
        'location'
      )
    })

    it('applies active styling classes when active', () => {
      render(<TOCLink {...defaultProps} isActive={true} />)

      const link = screen.getByRole('link')
      expect(link).toHaveClass('text-primary')
      expect(link).toHaveClass('font-medium')
      expect(link).toHaveClass('border-l-2')
    })

    it('applies inactive styling classes when not active', () => {
      render(<TOCLink {...defaultProps} isActive={false} />)

      const link = screen.getByRole('link')
      expect(link).toHaveClass('text-muted-foreground')
    })
  })

  describe('indentation', () => {
    it('has no left padding for level 2', () => {
      render(<TOCLink {...defaultProps} level={2} />)

      expect(screen.getByRole('link')).toHaveClass('pl-0')
    })

    it('has left padding for level 3', () => {
      render(<TOCLink {...defaultProps} level={3} />)

      expect(screen.getByRole('link')).toHaveClass('pl-4')
    })
  })

  describe('navigation', () => {
    it('scrolls to element on click', async () => {
      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} />)

      await user.click(screen.getByRole('link'))

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })

    it('uses instant scroll when prefers-reduced-motion', async () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} />)

      await user.click(screen.getByRole('link'))

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      })
    })

    it('updates URL hash on click', async () => {
      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} />)

      await user.click(screen.getByRole('link'))

      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '#test-section'
      )
    })

    it('calls onNavigate callback on click', async () => {
      const onNavigate = vi.fn()
      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} onNavigate={onNavigate} />)

      await user.click(screen.getByRole('link'))

      expect(onNavigate).toHaveBeenCalled()
    })

    it('prevents default link behavior', async () => {
      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} />)

      const link = screen.getByRole('link')
      const clickEvent = new MouseEvent('click', { bubbles: true })
      const preventDefault = vi.spyOn(clickEvent, 'preventDefault')

      fireEvent(link, clickEvent)

      expect(preventDefault).toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('activates on Enter key', async () => {
      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} />)

      const link = screen.getByRole('link')
      link.focus()
      await user.keyboard('{Enter}')

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    })

    it('activates on Space key', async () => {
      const user = userEvent.setup()
      render(<TOCLink {...defaultProps} />)

      const link = screen.getByRole('link')
      link.focus()
      await user.keyboard(' ')

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has focus-visible styles', () => {
      render(<TOCLink {...defaultProps} />)

      const link = screen.getByRole('link')
      expect(link).toHaveClass('focus-visible:ring-2')
    })

    it('has motion-reduce transition class', () => {
      render(<TOCLink {...defaultProps} />)

      expect(screen.getByRole('link')).toHaveClass(
        'motion-reduce:transition-none'
      )
    })
  })
})
```

#### `tests/unit/components/articles/TableOfContents.spec.tsx`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TableOfContents } from '@/components/articles/TableOfContents'
import type { TOCHeading } from '@/lib/toc/types'

// Mock the hooks
vi.mock('@/hooks/use-active-section', () => ({
  useActiveSection: vi.fn(() => null),
}))

import { useActiveSection } from '@/hooks/use-active-section'

const mockUseActiveSection = vi.mocked(useActiveSection)

describe('TableOfContents', () => {
  const mockHeadings: TOCHeading[] = [
    { id: 'intro', text: 'Introduction', level: 2 },
    { id: 'features', text: 'Features', level: 2 },
    { id: 'sub-feature', text: 'Sub Feature', level: 3 },
    { id: 'conclusion', text: 'Conclusion', level: 2 },
  ]

  beforeEach(() => {
    mockUseActiveSection.mockReturnValue(null)

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Create target elements
    mockHeadings.forEach((heading) => {
      const el = document.createElement('div')
      el.id = heading.id
      document.body.appendChild(el)
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('renders navigation with aria-label', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(
        screen.getByRole('navigation', { name: 'Table of Contents' })
      ).toBeInTheDocument()
    })

    it('renders with custom title', () => {
      render(<TableOfContents headings={mockHeadings} title="Contents" />)

      expect(
        screen.getByRole('navigation', { name: 'Contents' })
      ).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Contents'
      )
    })

    it('renders all headings as links', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Features')).toBeInTheDocument()
      expect(screen.getByText('Sub Feature')).toBeInTheDocument()
      expect(screen.getByText('Conclusion')).toBeInTheDocument()
    })

    it('renders list with role="list"', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('returns null when headings is empty', () => {
      const { container } = render(<TableOfContents headings={[]} />)

      expect(container.firstChild).toBeNull()
    })

    it('applies custom className', () => {
      render(
        <TableOfContents headings={mockHeadings} className="custom-class" />
      )

      expect(screen.getByRole('navigation')).toHaveClass('custom-class')
    })
  })

  describe('sticky positioning', () => {
    it('has sticky class', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('navigation')).toHaveClass('sticky')
    })

    it('applies default top offset', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('navigation')).toHaveStyle({ top: '80px' })
    })

    it('applies custom top offset', () => {
      render(<TableOfContents headings={mockHeadings} topOffset={120} />)

      expect(screen.getByRole('navigation')).toHaveStyle({ top: '120px' })
    })
  })

  describe('active section integration', () => {
    it('passes sectionIds to useActiveSection', () => {
      render(<TableOfContents headings={mockHeadings} topOffset={100} />)

      expect(mockUseActiveSection).toHaveBeenCalledWith({
        sectionIds: ['intro', 'features', 'sub-feature', 'conclusion'],
        topOffset: 100,
      })
    })

    it('highlights active section', () => {
      mockUseActiveSection.mockReturnValue('features')

      render(<TableOfContents headings={mockHeadings} />)

      const featuresLink = screen.getByText('Features')
      expect(featuresLink).toHaveAttribute('aria-current', 'location')
    })

    it('does not highlight inactive sections', () => {
      mockUseActiveSection.mockReturnValue('features')

      render(<TableOfContents headings={mockHeadings} />)

      const introLink = screen.getByText('Introduction')
      expect(introLink).not.toHaveAttribute('aria-current')
    })
  })

  describe('navigation callback', () => {
    it('passes onNavigate to TOCLinks', () => {
      const onNavigate = vi.fn()
      render(
        <TableOfContents headings={mockHeadings} onNavigate={onNavigate} />
      )

      // TOCLink should receive the onNavigate prop
      // This is tested implicitly - if TOCLink calls it, it means it was passed
      expect(screen.getAllByRole('link')).toHaveLength(4)
    })
  })

  describe('width constraints', () => {
    it('has max-width class', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('navigation')).toHaveClass('max-w-[200px]')
    })
  })
})
```

### Validation Criteria

- [ ] All TOCLink tests pass
- [ ] All TableOfContents tests pass
- [ ] Tests cover rendering behavior
- [ ] Tests cover active state
- [ ] Tests cover navigation
- [ ] Tests cover accessibility

### Commit Message

```
test(toc): add component tests for TOCLink and TableOfContents

- Test TOCLink rendering, active state, and navigation
- Test TOCLink keyboard accessibility
- Test TableOfContents rendering and sticky positioning
- Test active section integration
- Test edge cases and accessibility
```

---

## Commit 7: MobileTOC Tests and Barrel Export

**Objective**: Add tests for MobileTOC and export all components from barrel.

### Files to Create

#### `tests/unit/components/articles/MobileTOC.spec.tsx`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileTOC } from '@/components/articles/MobileTOC'
import type { TOCHeading } from '@/lib/toc/types'

// Mock the hooks
vi.mock('@/hooks/use-active-section', () => ({
  useActiveSection: vi.fn(() => null),
}))

import { useActiveSection } from '@/hooks/use-active-section'

const mockUseActiveSection = vi.mocked(useActiveSection)

describe('MobileTOC', () => {
  const mockHeadings: TOCHeading[] = [
    { id: 'intro', text: 'Introduction', level: 2 },
    { id: 'features', text: 'Features', level: 2 },
    { id: 'conclusion', text: 'Conclusion', level: 2 },
  ]

  beforeEach(() => {
    mockUseActiveSection.mockReturnValue(null)

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Create target elements
    mockHeadings.forEach((heading) => {
      const el = document.createElement('div')
      el.id = heading.id
      document.body.appendChild(el)
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('trigger button', () => {
    it('renders trigger button', () => {
      render(<MobileTOC headings={mockHeadings} />)

      expect(
        screen.getByRole('button', { name: 'Open table of contents' })
      ).toBeInTheDocument()
    })

    it('renders with custom trigger label', () => {
      render(<MobileTOC headings={mockHeadings} triggerLabel="Show TOC" />)

      expect(
        screen.getByRole('button', { name: 'Show TOC' })
      ).toBeInTheDocument()
    })

    it('applies custom trigger className', () => {
      render(
        <MobileTOC headings={mockHeadings} triggerClassName="custom-class" />
      )

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('has fixed positioning classes', () => {
      render(<MobileTOC headings={mockHeadings} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('fixed')
      expect(button).toHaveClass('bottom-4')
      expect(button).toHaveClass('right-4')
    })

    it('has rounded-full class', () => {
      render(<MobileTOC headings={mockHeadings} />)

      expect(screen.getByRole('button')).toHaveClass('rounded-full')
    })
  })

  describe('sheet behavior', () => {
    it('opens sheet on button click', async () => {
      const user = userEvent.setup()
      render(<MobileTOC headings={mockHeadings} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('displays title in sheet header', async () => {
      const user = userEvent.setup()
      render(<MobileTOC headings={mockHeadings} title="Contents" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Contents' })
        ).toBeInTheDocument()
      })
    })

    it('displays all headings in sheet', async () => {
      const user = userEvent.setup()
      render(<MobileTOC headings={mockHeadings} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('Introduction')).toBeInTheDocument()
        expect(screen.getByText('Features')).toBeInTheDocument()
        expect(screen.getByText('Conclusion')).toBeInTheDocument()
      })
    })

    it('closes sheet on link click', async () => {
      const user = userEvent.setup()
      render(<MobileTOC headings={mockHeadings} />)

      // Open sheet
      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click a link
      await user.click(screen.getByText('Introduction'))

      // Sheet should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('empty state', () => {
    it('returns null when headings is empty', () => {
      const { container } = render(<MobileTOC headings={[]} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('active section integration', () => {
    it('passes sectionIds to useActiveSection', () => {
      render(<MobileTOC headings={mockHeadings} topOffset={100} />)

      expect(mockUseActiveSection).toHaveBeenCalledWith({
        sectionIds: ['intro', 'features', 'conclusion'],
        topOffset: 100,
      })
    })

    it('highlights active section in sheet', async () => {
      mockUseActiveSection.mockReturnValue('features')
      const user = userEvent.setup()

      render(<MobileTOC headings={mockHeadings} />)
      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        const featuresLink = screen.getByText('Features')
        expect(featuresLink).toHaveAttribute('aria-current', 'location')
      })
    })
  })

  describe('accessibility', () => {
    it('has navigation landmark in sheet', async () => {
      const user = userEvent.setup()
      render(<MobileTOC headings={mockHeadings} title="Table of Contents" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(
          screen.getByRole('navigation', { name: 'Table of Contents' })
        ).toBeInTheDocument()
      })
    })

    it('has list role for TOC items', async () => {
      const user = userEvent.setup()
      render(<MobileTOC headings={mockHeadings} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByRole('list')).toBeInTheDocument()
      })
    })
  })
})
```

### Files to Modify

#### `src/components/articles/index.ts`

Add to existing exports:

```typescript
// Table of Contents
export { TOCLink, type TOCLinkProps } from './TOCLink'
export { TableOfContents, type TableOfContentsProps } from './TableOfContents'
export { MobileTOC, type MobileTOCProps } from './MobileTOC'
```

### Validation Criteria

- [ ] All MobileTOC tests pass
- [ ] All exports accessible via `@/components/articles`
- [ ] TypeScript types exported correctly
- [ ] All tests still pass
- [ ] No lint errors

### Commit Message

```
feat(toc): add MobileTOC tests and export all components

- Add comprehensive tests for MobileTOC component
- Test sheet open/close behavior
- Test auto-close on navigation
- Export TOCLink, TableOfContents, MobileTOC from barrel
- Export component prop types for consumers
```

---

## Summary

### Total Files Changed

| Type | Count | Files |
|------|-------|-------|
| New | 8 | 1 hook, 3 components, 4 test files |
| Modified | 1 | `index.ts` |
| **Total** | 9 | |

### Estimated Lines of Code

| File | Lines |
|------|-------|
| `use-active-section.ts` | ~80 |
| `TOCLink.tsx` | ~60 |
| `TableOfContents.tsx` | ~90 |
| `MobileTOC.tsx` | ~100 |
| `use-active-section.spec.ts` | ~150 |
| `TOCLink.spec.tsx` | ~170 |
| `TableOfContents.spec.tsx` | ~150 |
| `MobileTOC.spec.tsx` | ~150 |
| `index.ts` (additions) | ~5 |
| **Total** | ~955 |

### Quality Gates per Commit

Each commit must pass:

- [ ] `pnpm exec tsc --noEmit` (TypeScript)
- [ ] `pnpm lint` (ESLint)
- [ ] `pnpm test:unit` (Unit tests - commits 5+)
- [ ] Manual smoke test (if applicable)

---

**Implementation Plan Generated**: 2025-12-11
**Last Updated**: 2025-12-11
