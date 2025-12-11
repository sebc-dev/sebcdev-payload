# Phase 3: Table of Contents Component - Testing Guide

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 3 of 4

---

## Testing Strategy Overview

### Test Types in This Phase

| Type | Framework | Location | Purpose |
|------|-----------|----------|---------|
| Unit Tests | Vitest | `tests/unit/hooks/` | Hook logic |
| Component Tests | Vitest + RTL | `tests/unit/components/` | Component behavior |

### Coverage Targets

| Component | Target | Focus Areas |
|-----------|--------|-------------|
| `useActiveSection` | >85% | Intersection handling, cleanup |
| `TOCLink` | >85% | Navigation, accessibility |
| `TableOfContents` | >85% | Rendering, active state |
| `MobileTOC` | >80% | Sheet behavior, auto-close |

---

## Test Environment Setup

### Required Test Utilities

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
```

### Common Mocks

#### IntersectionObserver Mock

```typescript
let mockCallback: IntersectionObserverCallback | null = null
let mockObserve: ReturnType<typeof vi.fn>
let mockDisconnect: ReturnType<typeof vi.fn>

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
})

afterEach(() => {
  vi.restoreAllMocks()
  mockCallback = null
})
```

#### matchMedia Mock (for prefers-reduced-motion)

```typescript
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false, // Change to true to test reduced motion
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})
```

#### scrollIntoView Mock

```typescript
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})
```

#### history.pushState Mock

```typescript
beforeEach(() => {
  vi.spyOn(window.history, 'pushState').mockImplementation(() => {})
})
```

#### getElementById Mock

```typescript
beforeEach(() => {
  vi.spyOn(document, 'getElementById').mockImplementation((id) => {
    const element = document.createElement('div')
    element.id = id
    return element
  })
})
```

---

## Testing Patterns

### Pattern 1: Testing Hooks with renderHook

```typescript
import { renderHook, act } from '@testing-library/react'

describe('useActiveSection', () => {
  it('returns null when no sections provided', () => {
    const { result } = renderHook(() =>
      useActiveSection({ sectionIds: [] })
    )

    expect(result.current).toBeNull()
  })

  it('updates state when intersection changes', () => {
    const { result } = renderHook(() =>
      useActiveSection({ sectionIds: ['intro', 'main'] })
    )

    // Simulate intersection event
    act(() => {
      mockCallback?.([
        {
          target: { id: 'main' } as Element,
          isIntersecting: true,
          intersectionRatio: 0.5,
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver)
    })

    expect(result.current).toBe('main')
  })
})
```

### Pattern 2: Testing Component Rendering

```typescript
import { render, screen } from '@testing-library/react'

describe('TableOfContents', () => {
  const mockHeadings = [
    { id: 'intro', text: 'Introduction', level: 2 },
    { id: 'main', text: 'Main Content', level: 2 },
  ]

  it('renders all headings', () => {
    render(<TableOfContents headings={mockHeadings} />)

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
  })

  it('returns null for empty headings', () => {
    const { container } = render(<TableOfContents headings={[]} />)

    expect(container.firstChild).toBeNull()
  })
})
```

### Pattern 3: Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event'

describe('TOCLink', () => {
  it('scrolls to element on click', async () => {
    const user = userEvent.setup()

    render(
      <TOCLink
        id="test-section"
        text="Test"
        level={2}
        isActive={false}
      />
    )

    await user.click(screen.getByRole('link'))

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('calls onNavigate callback', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()

    render(
      <TOCLink
        id="test-section"
        text="Test"
        level={2}
        isActive={false}
        onNavigate={onNavigate}
      />
    )

    await user.click(screen.getByRole('link'))

    expect(onNavigate).toHaveBeenCalled()
  })
})
```

### Pattern 4: Testing Async Sheet Behavior

```typescript
import { waitFor } from '@testing-library/react'

describe('MobileTOC', () => {
  it('opens sheet on button click', async () => {
    const user = userEvent.setup()

    render(<MobileTOC headings={mockHeadings} />)

    await user.click(screen.getByRole('button'))

    // Sheet renders asynchronously via portal
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
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
```

### Pattern 5: Testing Accessibility

```typescript
describe('accessibility', () => {
  it('has correct ARIA attributes', () => {
    render(
      <TOCLink
        id="test"
        text="Test"
        level={2}
        isActive={true}
      />
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'location')
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()

    render(
      <TOCLink
        id="test"
        text="Test"
        level={2}
        isActive={false}
      />
    )

    const link = screen.getByRole('link')
    link.focus()
    await user.keyboard('{Enter}')

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })

  it('has navigation landmark', () => {
    render(<TableOfContents headings={mockHeadings} title="Contents" />)

    expect(
      screen.getByRole('navigation', { name: 'Contents' })
    ).toBeInTheDocument()
  })
})
```

### Pattern 6: Testing Mock Hook Integration

```typescript
// Mock the hook at module level
vi.mock('@/hooks/use-active-section', () => ({
  useActiveSection: vi.fn(() => null),
}))

import { useActiveSection } from '@/hooks/use-active-section'

const mockUseActiveSection = vi.mocked(useActiveSection)

describe('TableOfContents with active section', () => {
  beforeEach(() => {
    mockUseActiveSection.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('highlights active section', () => {
    mockUseActiveSection.mockReturnValue('intro')

    render(<TableOfContents headings={mockHeadings} />)

    const introLink = screen.getByText('Introduction')
    expect(introLink).toHaveAttribute('aria-current', 'location')
  })

  it('passes correct options to hook', () => {
    render(<TableOfContents headings={mockHeadings} topOffset={100} />)

    expect(mockUseActiveSection).toHaveBeenCalledWith({
      sectionIds: ['intro', 'main'],
      topOffset: 100,
    })
  })
})
```

---

## Test Scenarios by Component

### useActiveSection Hook

| Scenario | Test |
|----------|------|
| Empty sectionIds | Returns null, no observer created |
| Initial state | Sets first section if at page top |
| Single intersection | Updates activeId |
| Multiple intersections | Returns first in document order |
| Section leaves viewport | Removes from visible set |
| Options change | Recreates observer |
| Unmount | Disconnects observer |
| Missing DOM element | Doesn't crash, skips element |

### TOCLink Component

| Scenario | Test |
|----------|------|
| Basic rendering | Displays text, correct href |
| Active state | aria-current, styling |
| Inactive state | No aria-current, muted style |
| Level 2 | No indentation |
| Level 3 | Left padding |
| Click navigation | Scrolls, updates hash |
| Reduced motion | Uses 'instant' scroll |
| Keyboard Enter | Activates link |
| Keyboard Space | Activates link |
| onNavigate callback | Called after scroll |
| Custom className | Applied correctly |

### TableOfContents Component

| Scenario | Test |
|----------|------|
| Renders headings | All entries visible |
| Empty headings | Returns null |
| Custom title | Updates heading and aria-label |
| Default topOffset | 80px |
| Custom topOffset | Applied to style and hook |
| Active highlighting | Correct link has aria-current |
| onNavigate passed | TOCLinks receive callback |
| Sticky positioning | Has sticky class |
| Width constraint | Has max-w-[200px] |

### MobileTOC Component

| Scenario | Test |
|----------|------|
| Trigger rendered | Button with aria-label |
| Trigger position | Fixed bottom-right |
| Custom trigger label | Updates aria-label |
| Custom trigger class | Applied to button |
| Empty headings | Returns null |
| Sheet opens | Dialog appears on click |
| Sheet title | Displays in header |
| Sheet content | All headings visible |
| Auto-close | Sheet closes on link click |
| Active in sheet | Correct link highlighted |
| Sheet width | 280px mobile, 320px sm |

---

## Running Tests

### Run All Unit Tests

```bash
pnpm test:unit
```

### Run Specific Test File

```bash
pnpm test:unit tests/unit/hooks/use-active-section.spec.ts
pnpm test:unit tests/unit/components/articles/TOCLink.spec.tsx
pnpm test:unit tests/unit/components/articles/TableOfContents.spec.tsx
pnpm test:unit tests/unit/components/articles/MobileTOC.spec.tsx
```

### Run Tests in Watch Mode

```bash
pnpm test:unit --watch
```

### Run Tests with Coverage

```bash
pnpm test:unit --coverage
```

### Run Specific Test

```bash
pnpm test:unit -t "opens sheet on button click"
```

---

## Test Data Fixtures

### Standard Headings Fixture

```typescript
const mockHeadings: TOCHeading[] = [
  { id: 'introduction', text: 'Introduction', level: 2 },
  { id: 'getting-started', text: 'Getting Started', level: 2 },
  { id: 'prerequisites', text: 'Prerequisites', level: 3 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'usage', text: 'Usage', level: 2 },
  { id: 'conclusion', text: 'Conclusion', level: 2 },
]
```

### Minimal Headings Fixture

```typescript
const minimalHeadings: TOCHeading[] = [
  { id: 'intro', text: 'Introduction', level: 2 },
]
```

### Deep Nesting Fixture

```typescript
const deepHeadings: TOCHeading[] = [
  { id: 'section-1', text: 'Section 1', level: 2 },
  { id: 'sub-1-1', text: 'Sub 1.1', level: 3 },
  { id: 'sub-1-2', text: 'Sub 1.2', level: 3 },
  { id: 'section-2', text: 'Section 2', level: 2 },
  { id: 'sub-2-1', text: 'Sub 2.1', level: 3 },
  { id: 'sub-2-2', text: 'Sub 2.2', level: 3 },
  { id: 'sub-2-3', text: 'Sub 2.3', level: 3 },
]
```

---

## Debugging Tests

### Common Issues

#### 1. "IntersectionObserver is not defined"

**Cause**: IntersectionObserver not mocked

**Fix**: Add mock in beforeEach (see Common Mocks section)

#### 2. "matchMedia is not a function"

**Cause**: matchMedia not mocked

**Fix**: Add mock in beforeEach (see Common Mocks section)

#### 3. Sheet doesn't appear in test

**Cause**: Sheet uses portals, renders async

**Fix**: Use `waitFor` to wait for dialog

```typescript
await waitFor(() => {
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

#### 4. Hook state doesn't update

**Cause**: State update not wrapped in act

**Fix**: Wrap intersection callback in act

```typescript
act(() => {
  mockCallback?.([...], {} as IntersectionObserver)
})
```

#### 5. DOM element not found

**Cause**: Target element not in document

**Fix**: Create element in beforeEach

```typescript
beforeEach(() => {
  const el = document.createElement('div')
  el.id = 'test-section'
  document.body.appendChild(el)
})
```

### Debug Commands

```bash
# Run single test with verbose output
pnpm test:unit -t "test name" --reporter=verbose

# Show test coverage for specific file
pnpm test:unit --coverage tests/unit/hooks/use-active-section.spec.ts

# Debug mode (pauses on debugger statements)
node --inspect-brk node_modules/vitest/vitest.mjs run tests/unit/hooks/use-active-section.spec.ts
```

---

## Test Maintenance

### When to Update Tests

- [ ] New props added to component
- [ ] Behavior changes
- [ ] New edge cases discovered
- [ ] Accessibility improvements
- [ ] Bug fixes (add regression test)

### Test Organization

```
tests/
└── unit/
    ├── hooks/
    │   └── use-active-section.spec.ts
    └── components/
        └── articles/
            ├── TOCLink.spec.tsx
            ├── TableOfContents.spec.tsx
            └── MobileTOC.spec.tsx
```

### Naming Conventions

- Test files: `*.spec.ts` or `*.spec.tsx`
- Describe blocks: Component/hook name
- It blocks: Behavior in present tense

```typescript
describe('TOCLink', () => {
  describe('rendering', () => {
    it('renders link with correct text', () => {})
  })

  describe('navigation', () => {
    it('scrolls to element on click', () => {})
  })
})
```

---

**Testing Guide Generated**: 2025-12-11
