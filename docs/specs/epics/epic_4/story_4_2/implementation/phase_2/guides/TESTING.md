# Phase 2: Reading Progress Bar - Testing Guide

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 2 of 4

---

## Testing Strategy Overview

This phase requires **unit tests** and **integration tests**. E2E tests will be added in Phase 4.

| Test Type | Scope | Tools | Files |
|-----------|-------|-------|-------|
| Unit | Hook logic | Vitest | `use-reading-progress.spec.ts` |
| Unit | Component rendering | Vitest + RTL | `ReadingProgressBar.spec.tsx` |
| Manual | Visual/UX verification | Browser | N/A |

---

## Test Environment Setup

### Required Imports

```typescript
// Vitest
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// React Testing Library
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
```

### Test File Locations

```
tests/
└── unit/
    ├── hooks/
    │   └── use-reading-progress.spec.ts
    └── components/
        └── articles/
            └── ReadingProgressBar.spec.tsx
```

---

## Hook Testing: useReadingProgress

### Test Structure

```typescript
describe('useReadingProgress', () => {
  describe('document-based tracking', () => {
    // Tests without articleRef
  })

  describe('article-ref tracking', () => {
    // Tests with articleRef
  })

  describe('scroll event handling', () => {
    // Tests for event listeners
  })

  describe('edge cases', () => {
    // Tests for unusual scenarios
  })
})
```

### Mocking Window/Document

```typescript
// Setup mocks
const mockScrollY = vi.spyOn(window, 'scrollY', 'get')
const mockInnerHeight = vi.spyOn(window, 'innerHeight', 'get')
const mockDocScrollHeight = vi.spyOn(
  document.documentElement,
  'scrollHeight',
  'get'
)

beforeEach(() => {
  // Standard viewport setup
  mockInnerHeight.mockReturnValue(800)
  mockDocScrollHeight.mockReturnValue(2000)
  mockScrollY.mockReturnValue(0)

  // Mock RAF to execute immediately
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 0
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

### Testing Progress Calculation

```typescript
it('returns 0 when at top of page', () => {
  mockScrollY.mockReturnValue(0)
  const { result } = renderHook(() => useReadingProgress())
  expect(result.current).toBe(0)
})

it('returns 100 when at bottom of page', () => {
  // scrollableHeight = docHeight - winHeight = 2000 - 800 = 1200
  mockScrollY.mockReturnValue(1200)
  const { result } = renderHook(() => useReadingProgress())
  expect(result.current).toBe(100)
})

it('returns 50 when halfway', () => {
  mockScrollY.mockReturnValue(600) // 600/1200 = 50%
  const { result } = renderHook(() => useReadingProgress())
  expect(result.current).toBe(50)
})
```

### Testing with Article Ref

```typescript
it('calculates progress based on article element', () => {
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
```

### Testing Scroll Events

```typescript
it('updates progress on scroll', async () => {
  mockScrollY.mockReturnValue(0)
  const { result } = renderHook(() => useReadingProgress())

  expect(result.current).toBe(0)

  mockScrollY.mockReturnValue(600)
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })

  expect(result.current).toBe(50)
})
```

### Testing Cleanup

```typescript
it('removes event listener on unmount', () => {
  const removeListenerSpy = vi.spyOn(window, 'removeEventListener')

  const { unmount } = renderHook(() => useReadingProgress())
  unmount()

  expect(removeListenerSpy).toHaveBeenCalledWith(
    'scroll',
    expect.any(Function)
  )
})
```

---

## Component Testing: ReadingProgressBar

### Test Structure

```typescript
describe('ReadingProgressBar', () => {
  describe('rendering', () => {
    // Basic render tests
  })

  describe('accessibility', () => {
    // ARIA attribute tests
  })

  describe('progress visualization', () => {
    // Width/style tests
  })

  describe('styling', () => {
    // CSS class tests
  })

  describe('integration', () => {
    // Hook integration tests
  })
})
```

### Mocking the Hook

```typescript
vi.mock('@/hooks/use-reading-progress', () => ({
  useReadingProgress: vi.fn(() => 0),
}))

import { useReadingProgress } from '@/hooks/use-reading-progress'

const mockUseReadingProgress = vi.mocked(useReadingProgress)

beforeEach(() => {
  mockUseReadingProgress.mockReturnValue(0)
})

afterEach(() => {
  vi.clearAllMocks()
})
```

### Testing Rendering

```typescript
it('renders progressbar role', () => {
  render(<ReadingProgressBar />)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

it('applies custom className', () => {
  render(<ReadingProgressBar className="custom" />)
  expect(screen.getByRole('progressbar')).toHaveClass('custom')
})
```

### Testing Accessibility

```typescript
it('has correct ARIA attributes', () => {
  mockUseReadingProgress.mockReturnValue(45)
  render(<ReadingProgressBar />)

  const bar = screen.getByRole('progressbar')
  expect(bar).toHaveAttribute('aria-valuenow', '45')
  expect(bar).toHaveAttribute('aria-valuemin', '0')
  expect(bar).toHaveAttribute('aria-valuemax', '100')
  expect(bar).toHaveAttribute('aria-label', 'Reading progress')
})

it('accepts custom aria-label', () => {
  render(<ReadingProgressBar ariaLabel="Article progress" />)
  expect(screen.getByRole('progressbar')).toHaveAttribute(
    'aria-label',
    'Article progress'
  )
})

it('rounds progress for aria-valuenow', () => {
  mockUseReadingProgress.mockReturnValue(33.7)
  render(<ReadingProgressBar />)
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '34')
})
```

### Testing Progress Visualization

```typescript
it('sets inner bar width based on progress', () => {
  mockUseReadingProgress.mockReturnValue(75)
  const { container } = render(<ReadingProgressBar />)

  const innerBar = container.querySelector('[class*="bg-primary"]')
  expect(innerBar).toHaveStyle({ width: '75%' })
})
```

### Testing Styling Classes

```typescript
it('has fixed positioning', () => {
  render(<ReadingProgressBar />)
  const bar = screen.getByRole('progressbar')

  expect(bar).toHaveClass('fixed')
  expect(bar).toHaveClass('top-0')
  expect(bar).toHaveClass('left-0')
  expect(bar).toHaveClass('right-0')
})

it('supports reduced motion', () => {
  const { container } = render(<ReadingProgressBar />)
  const innerBar = container.querySelector('[class*="bg-primary"]')

  expect(innerBar).toHaveClass('motion-reduce:transition-none')
})
```

---

## Manual Testing Checklist

### Visual Testing

- [ ] Progress bar appears at top of viewport
- [ ] Bar is 3px height (subtle but visible)
- [ ] Color matches design system teal (#14B8A6)
- [ ] Track background is visible (muted/30)

### Scroll Behavior

- [ ] Progress shows 0% at page top
- [ ] Progress shows 100% at page bottom
- [ ] Progress updates smoothly during scroll
- [ ] No jank or stuttering during fast scroll
- [ ] Progress resets when navigating to different page

### Accessibility Testing

- [ ] Screen reader announces progress (VoiceOver/NVDA)
- [ ] No focus issues (bar is non-interactive)
- [ ] Works in high contrast mode
- [ ] Visible in Windows High Contrast Mode

### Reduced Motion Testing

```css
/* Enable in browser dev tools */
@media (prefers-reduced-motion: reduce) {
  /* Transitions should be disabled */
}
```

- [ ] With reduced motion enabled, progress updates instantly (no transition)

### Responsive Testing

- [ ] Bar spans full width on mobile
- [ ] Bar spans full width on tablet
- [ ] Bar spans full width on desktop
- [ ] Z-index doesn't conflict with header/modals

---

## Coverage Requirements

### Minimum Coverage Targets

| File | Lines | Branches | Functions |
|------|-------|----------|-----------|
| `use-reading-progress.ts` | 80% | 80% | 80% |
| `ReadingProgressBar.tsx` | 80% | 80% | 80% |

### Running Coverage

```bash
# Full coverage report
pnpm test:unit --coverage

# Coverage for specific files
pnpm test:unit --coverage tests/unit/hooks/use-reading-progress.spec.ts
pnpm test:unit --coverage tests/unit/components/articles/ReadingProgressBar.spec.tsx
```

### Coverage Report Output

```
-----------------------------|---------|----------|---------|---------|
File                         | % Stmts | % Branch | % Funcs | % Lines |
-----------------------------|---------|----------|---------|---------|
src/hooks/                   |         |          |         |         |
  use-reading-progress.ts    |   95.00 |    90.00 |  100.00 |   95.00 |
src/components/articles/     |         |          |         |         |
  ReadingProgressBar.tsx     |  100.00 |   100.00 |  100.00 |  100.00 |
-----------------------------|---------|----------|---------|---------|
```

---

## Test Commands Quick Reference

```bash
# Run all unit tests
pnpm test:unit

# Run hook tests only
pnpm test:unit tests/unit/hooks/use-reading-progress.spec.ts

# Run component tests only
pnpm test:unit tests/unit/components/articles/ReadingProgressBar.spec.tsx

# Watch mode
pnpm test:unit --watch

# With coverage
pnpm test:unit --coverage

# Verbose output
pnpm test:unit --reporter=verbose
```

---

## Troubleshooting Tests

### Common Issues

**Issue**: `document is not defined`
```typescript
// Solution: Ensure jsdom environment
// @vitest-environment jsdom
```

**Issue**: RAF mock not working
```typescript
// Solution: Mock before hook renders
vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  cb(0)
  return 0
})
```

**Issue**: Scroll event not triggering update
```typescript
// Solution: Use act() wrapper
act(() => {
  window.dispatchEvent(new Event('scroll'))
})
```

**Issue**: Class assertions failing
```typescript
// Solution: Use toHaveClass() matcher
expect(element).toHaveClass('fixed') // Not includes()
```

---

## Integration with Phase 4

These unit tests will be complemented by E2E tests in Phase 4:

- Scroll through actual article content
- Verify progress updates visually
- Test with different article lengths
- Test responsive behavior

---

**Testing Guide Generated**: 2025-12-10
**Last Updated**: 2025-12-10
