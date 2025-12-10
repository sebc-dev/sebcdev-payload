# Phase 2: Reading Progress Bar - Implementation Plan

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 2 of 4
**Estimated Duration**: 2-3 days
**Atomic Commits**: 5

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
[Commit 1] useReadingProgress hook
    |
    v
[Commit 2] ReadingProgressBar component
    |
    v
[Commit 3] Unit tests for hook
    |
    v
[Commit 4] Component tests
    |
    v
[Commit 5] Barrel export + polish
```

---

## Commit 1: Create useReadingProgress Hook

**Objective**: Implement the custom hook that tracks scroll position and calculates reading progress.

### Files to Create

#### `src/hooks/use-reading-progress.ts`

```typescript
'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Custom hook to track reading progress of an article.
 *
 * @param articleRef - Optional ref to the article element. If not provided,
 *                     tracks progress of the entire document.
 * @returns progress - Number between 0 and 100 representing reading progress
 *
 * @example
 * const articleRef = useRef<HTMLElement>(null)
 * const progress = useReadingProgress(articleRef)
 */
export function useReadingProgress(
  articleRef?: RefObject<HTMLElement | null>
): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null
    let ticking = false

    const calculateProgress = (): number => {
      if (articleRef?.current) {
        // Calculate based on article element
        const element = articleRef.current
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = element.offsetHeight
        const windowHeight = window.innerHeight
        const scrollY = window.scrollY

        // Start progress when article top enters viewport
        const start = elementTop
        // End progress when article bottom reaches viewport bottom
        const end = elementTop + elementHeight - windowHeight

        if (scrollY <= start) return 0
        if (scrollY >= end) return 100

        return ((scrollY - start) / (end - start)) * 100
      } else {
        // Fallback: calculate based on full document
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const winHeight = window.innerHeight
        const scrollableHeight = docHeight - winHeight

        if (scrollableHeight <= 0) return 100
        return (scrollTop / scrollableHeight) * 100
      }
    }

    const updateProgress = () => {
      const newProgress = Math.min(100, Math.max(0, calculateProgress()))
      setProgress(newProgress)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    // Initial calculation
    updateProgress()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [articleRef])

  return progress
}
```

### Validation Criteria

- [ ] Hook compiles without TypeScript errors
- [ ] Hook returns number between 0-100
- [ ] Uses `requestAnimationFrame` for performance
- [ ] Properly cleans up event listeners on unmount
- [ ] Supports both article ref and fallback document modes

### Commit Message

```
feat(progress): add useReadingProgress hook for scroll tracking

- Implement custom hook to track article reading progress
- Use requestAnimationFrame for performant scroll handling
- Support optional article ref or full document fallback
- Add proper cleanup on unmount
```

---

## Commit 2: Create ReadingProgressBar Component

**Objective**: Implement the visual progress bar component with accessibility support.

### Files to Create

#### `src/components/articles/ReadingProgressBar.tsx`

```typescript
'use client'

import { type RefObject } from 'react'
import { useReadingProgress } from '@/hooks/use-reading-progress'
import { cn } from '@/lib/utils'

export interface ReadingProgressBarProps {
  /**
   * Optional ref to the article element to track.
   * If not provided, tracks the entire document.
   */
  articleRef?: RefObject<HTMLElement | null>
  /**
   * Optional className for custom styling.
   */
  className?: string
  /**
   * Optional aria-label override for accessibility.
   * @default "Reading progress"
   */
  ariaLabel?: string
}

/**
 * A sticky progress bar that shows reading progress through an article.
 *
 * Features:
 * - Sticky positioning at top of viewport
 * - Accessible with ARIA attributes
 * - Respects prefers-reduced-motion
 * - Uses primary color from design system
 *
 * @example
 * ```tsx
 * const articleRef = useRef<HTMLElement>(null)
 *
 * <ReadingProgressBar articleRef={articleRef} />
 * <article ref={articleRef}>...</article>
 * ```
 */
export function ReadingProgressBar({
  articleRef,
  className,
  ariaLabel = 'Reading progress',
}: ReadingProgressBarProps) {
  const progress = useReadingProgress(articleRef)
  const roundedProgress = Math.round(progress)

  return (
    <div
      role="progressbar"
      aria-valuenow={roundedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        // Fixed positioning at top
        'fixed top-0 left-0 right-0 z-50',
        // Height
        'h-[3px]',
        // Background track
        'bg-muted/30',
        className
      )}
    >
      <div
        className={cn(
          // Bar styling
          'h-full bg-primary',
          // Smooth transition (respects prefers-reduced-motion via CSS)
          'transition-[width] duration-150 ease-linear',
          // Reduced motion: instant updates
          'motion-reduce:transition-none'
        )}
        style={{ width: `${roundedProgress}%` }}
      />
    </div>
  )
}
```

### Validation Criteria

- [ ] Component renders without errors
- [ ] Progress bar appears at top of viewport
- [ ] Width updates as progress changes
- [ ] ARIA attributes are correctly set
- [ ] `motion-reduce:transition-none` class present
- [ ] Uses design system colors (`bg-primary`)

### Commit Message

```
feat(progress): add ReadingProgressBar component

- Create accessible progress bar component
- Implement sticky positioning at viewport top
- Add ARIA progressbar role and attributes
- Support prefers-reduced-motion
- Use design system primary color
```

---

## Commit 3: Unit Tests for useReadingProgress Hook

**Objective**: Add comprehensive unit tests for the scroll tracking hook.

### Files to Create

#### `tests/unit/hooks/use-reading-progress.spec.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReadingProgress } from '@/hooks/use-reading-progress'

describe('useReadingProgress', () => {
  // Mock window properties
  const mockScrollY = vi.spyOn(window, 'scrollY', 'get')
  const mockInnerHeight = vi.spyOn(window, 'innerHeight', 'get')

  // Mock document properties
  const mockDocScrollHeight = vi.spyOn(
    document.documentElement,
    'scrollHeight',
    'get'
  )

  beforeEach(() => {
    // Default viewport setup
    mockInnerHeight.mockReturnValue(800)
    mockDocScrollHeight.mockReturnValue(2000)
    mockScrollY.mockReturnValue(0)

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('document-based tracking (no ref)', () => {
    it('returns 0 when at top of page', () => {
      mockScrollY.mockReturnValue(0)

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(0)
    })

    it('returns 100 when at bottom of page', () => {
      // scrollableHeight = 2000 - 800 = 1200
      // scrollY = 1200 = 100%
      mockScrollY.mockReturnValue(1200)

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(100)
    })

    it('returns 50 when halfway through document', () => {
      // scrollableHeight = 2000 - 800 = 1200
      // scrollY = 600 = 50%
      mockScrollY.mockReturnValue(600)

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(50)
    })

    it('returns 100 when document is shorter than viewport', () => {
      mockDocScrollHeight.mockReturnValue(600)
      mockInnerHeight.mockReturnValue(800)

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(100)
    })
  })

  describe('article-ref based tracking', () => {
    it('returns 0 when article top is at viewport top', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          top: 0,
          bottom: 2000,
          height: 2000,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        }),
        offsetHeight: 2000,
      } as HTMLElement

      const mockRef = { current: mockElement }
      mockScrollY.mockReturnValue(0)

      const { result } = renderHook(() => useReadingProgress(mockRef))

      expect(result.current).toBe(0)
    })

    it('returns 100 when scrolled past article', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          top: -1200,
          bottom: 800,
          height: 2000,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        }),
        offsetHeight: 2000,
      } as HTMLElement

      const mockRef = { current: mockElement }
      // Article starts at 0, height 2000, viewport 800
      // End = 0 + 2000 - 800 = 1200
      mockScrollY.mockReturnValue(1200)

      const { result } = renderHook(() => useReadingProgress(mockRef))

      expect(result.current).toBe(100)
    })
  })

  describe('scroll event handling', () => {
    it('updates progress on scroll event', async () => {
      mockScrollY.mockReturnValue(0)

      const { result } = renderHook(() => useReadingProgress())
      expect(result.current).toBe(0)

      // Simulate scroll
      mockScrollY.mockReturnValue(600)
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current).toBe(50)
    })

    it('cleans up scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useReadingProgress())
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      )
    })
  })

  describe('edge cases', () => {
    it('clamps progress between 0 and 100', () => {
      // Simulate negative scroll (shouldn't happen but be safe)
      mockScrollY.mockReturnValue(-100)

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBeGreaterThanOrEqual(0)
      expect(result.current).toBeLessThanOrEqual(100)
    })

    it('handles null ref gracefully', () => {
      const mockRef = { current: null }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      // Should fall back to document-based calculation
      expect(typeof result.current).toBe('number')
    })
  })
})
```

### Validation Criteria

- [ ] All tests pass
- [ ] Tests cover document-based tracking
- [ ] Tests cover article-ref tracking
- [ ] Tests cover scroll event handling
- [ ] Tests cover edge cases
- [ ] Tests verify cleanup on unmount

### Commit Message

```
test(progress): add unit tests for useReadingProgress hook

- Test document-based scroll tracking
- Test article-ref based tracking
- Test scroll event handling and updates
- Test edge cases and cleanup
- Achieve >80% coverage for hook
```

---

## Commit 4: Component Tests for ReadingProgressBar

**Objective**: Add integration tests for the progress bar component.

### Files to Create

#### `tests/unit/components/articles/ReadingProgressBar.spec.tsx`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadingProgressBar } from '@/components/articles/ReadingProgressBar'

// Mock the hook
vi.mock('@/hooks/use-reading-progress', () => ({
  useReadingProgress: vi.fn(() => 0),
}))

import { useReadingProgress } from '@/hooks/use-reading-progress'

const mockUseReadingProgress = vi.mocked(useReadingProgress)

describe('ReadingProgressBar', () => {
  beforeEach(() => {
    mockUseReadingProgress.mockReturnValue(0)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the progress bar container', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    it('renders with default aria-label', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-label', 'Reading progress')
    })

    it('renders with custom aria-label', () => {
      render(<ReadingProgressBar ariaLabel="Article progress" />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-label', 'Article progress')
    })

    it('applies custom className', () => {
      render(<ReadingProgressBar className="custom-class" />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveClass('custom-class')
    })
  })

  describe('accessibility', () => {
    it('has correct ARIA attributes at 0%', () => {
      mockUseReadingProgress.mockReturnValue(0)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('has correct ARIA attributes at 50%', () => {
      mockUseReadingProgress.mockReturnValue(50)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    })

    it('has correct ARIA attributes at 100%', () => {
      mockUseReadingProgress.mockReturnValue(100)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    })

    it('rounds progress values for aria-valuenow', () => {
      mockUseReadingProgress.mockReturnValue(33.333)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '33')
    })
  })

  describe('progress visualization', () => {
    it('renders inner bar with 0% width initially', () => {
      mockUseReadingProgress.mockReturnValue(0)
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]')
      expect(innerBar).toHaveStyle({ width: '0%' })
    })

    it('renders inner bar with 50% width at halfway', () => {
      mockUseReadingProgress.mockReturnValue(50)
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]')
      expect(innerBar).toHaveStyle({ width: '50%' })
    })

    it('renders inner bar with 100% width when complete', () => {
      mockUseReadingProgress.mockReturnValue(100)
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]')
      expect(innerBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('styling', () => {
    it('has fixed positioning classes', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveClass('fixed')
      expect(progressBar).toHaveClass('top-0')
      expect(progressBar).toHaveClass('left-0')
      expect(progressBar).toHaveClass('right-0')
    })

    it('has z-index for layering', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveClass('z-50')
    })

    it('has motion-reduce class for reduced motion support', () => {
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]')
      expect(innerBar).toHaveClass('motion-reduce:transition-none')
    })
  })

  describe('integration with hook', () => {
    it('passes articleRef to useReadingProgress', () => {
      const mockRef = { current: document.createElement('article') }

      render(<ReadingProgressBar articleRef={mockRef} />)

      expect(mockUseReadingProgress).toHaveBeenCalledWith(mockRef)
    })

    it('calls useReadingProgress without ref when not provided', () => {
      render(<ReadingProgressBar />)

      expect(mockUseReadingProgress).toHaveBeenCalledWith(undefined)
    })
  })
})
```

### Validation Criteria

- [ ] All tests pass
- [ ] Tests cover rendering behavior
- [ ] Tests cover accessibility attributes
- [ ] Tests cover progress visualization
- [ ] Tests cover styling classes
- [ ] Tests verify hook integration

### Commit Message

```
test(progress): add component tests for ReadingProgressBar

- Test rendering and accessibility attributes
- Test progress visualization at various values
- Test styling classes including reduced motion
- Test integration with useReadingProgress hook
- Achieve >80% coverage for component
```

---

## Commit 5: Barrel Export and Polish

**Objective**: Add export to barrel file and any final polish.

### Files to Modify

#### `src/components/articles/index.ts`

Add to existing exports:

```typescript
// Reading Progress
export { ReadingProgressBar, type ReadingProgressBarProps } from './ReadingProgressBar'
```

### Validation Criteria

- [ ] Export is accessible via `@/components/articles`
- [ ] TypeScript types are exported
- [ ] All tests still pass
- [ ] No lint errors

### Commit Message

```
feat(progress): export ReadingProgressBar from articles barrel

- Add ReadingProgressBar to @/components/articles exports
- Export ReadingProgressBarProps type for consumers
```

---

## Summary

### Total Files Changed

| Type | Count | Files |
|------|-------|-------|
| New | 4 | `use-reading-progress.ts`, `ReadingProgressBar.tsx`, 2 test files |
| Modified | 1 | `index.ts` |
| **Total** | 5 | |

### Estimated Lines of Code

| File | Lines |
|------|-------|
| `use-reading-progress.ts` | ~50 |
| `ReadingProgressBar.tsx` | ~80 |
| `use-reading-progress.spec.ts` | ~120 |
| `ReadingProgressBar.spec.tsx` | ~150 |
| `index.ts` (additions) | ~3 |
| **Total** | ~403 |

### Quality Gates per Commit

Each commit must pass:

- [ ] `pnpm exec tsc --noEmit` (TypeScript)
- [ ] `pnpm lint` (ESLint)
- [ ] `pnpm test:unit` (Unit tests - commits 3+)
- [ ] Manual smoke test (if applicable)

---

**Implementation Plan Generated**: 2025-12-10
**Last Updated**: 2025-12-10
