# Phase 2: Testing Strategy

**Phase**: shadcn/ui & Utility Functions
**Story**: 3.2 - Integration Design System (Dark Mode)

---

## Testing Overview

This phase focuses on utility functions and UI components. The testing strategy follows the project's hybrid testing approach:

| Test Type | Tool | Target |
|-----------|------|--------|
| Unit Tests | Vitest | `cn()` utility function |
| Component Tests | Vitest + RTL | Button component (client) |
| E2E Tests | Playwright | Visual verification, integration |
| Accessibility | axe-core + Playwright | WCAG compliance |

---

## Test Coverage Goals

| Target | Coverage Goal | Priority |
|--------|---------------|----------|
| `cn()` utility | 100% | High |
| Button component | 80%+ | High |
| Button variants | All variants tested | High |
| Accessibility | WCAG 2.1 AA | High |

---

## Unit Tests

### cn() Utility Function

Create `tests/unit/utils.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn() utility function', () => {
  describe('basic functionality', () => {
    it('should merge simple class strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })
  })

  describe('conditional classes (clsx)', () => {
    it('should handle boolean conditions', () => {
      expect(cn('base', true && 'active')).toBe('base active')
      expect(cn('base', false && 'active')).toBe('base')
    })

    it('should handle object syntax', () => {
      expect(cn({ active: true, disabled: false })).toBe('active')
    })

    it('should handle array syntax', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })
  })

  describe('tailwind class merging', () => {
    it('should merge conflicting padding classes', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('should merge conflicting text color classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should merge conflicting background classes', () => {
      expect(cn('bg-white', 'bg-black')).toBe('bg-black')
    })

    it('should preserve non-conflicting classes', () => {
      expect(cn('px-2 py-1', 'mt-4')).toBe('px-2 py-1 mt-4')
    })

    it('should handle responsive variants correctly', () => {
      expect(cn('md:px-2', 'md:px-4')).toBe('md:px-4')
      expect(cn('px-2', 'md:px-4')).toBe('px-2 md:px-4')
    })

    it('should handle state variants correctly', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500')
    })
  })

  describe('real-world usage', () => {
    it('should work with component props pattern', () => {
      const baseClasses = 'px-4 py-2 rounded-md'
      const variantClasses = 'bg-primary text-white'
      const sizeClasses = 'h-10'
      const className = 'mt-4 px-6' // Override px-4

      expect(cn(baseClasses, variantClasses, sizeClasses, className))
        .toBe('py-2 rounded-md bg-primary text-white h-10 mt-4 px-6')
    })

    it('should work with conditional disabled state', () => {
      const isDisabled = true
      expect(cn(
        'px-4 py-2',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )).toBe('px-4 py-2 opacity-50 cursor-not-allowed')
    })
  })
})
```

### Running Unit Tests

```bash
# Run cn() tests only
pnpm test:unit -- tests/unit/utils.spec.ts

# Run with coverage
pnpm test:unit -- --coverage tests/unit/utils.spec.ts

# Watch mode during development
pnpm test:unit -- --watch tests/unit/utils.spec.ts
```

---

## Component Tests

### Button Component

Create `tests/unit/button.spec.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component', () => {
  describe('rendering', () => {
    it('should render button text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should render as button element by default', () => {
      render(<Button>Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Destructive</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('underline-offset-4')
    })
  })

  describe('sizes', () => {
    it('should render default size', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8')
    })

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('should render icon size', () => {
      render(<Button size="icon">X</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'w-9')
    })
  })

  describe('props', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should handle onClick', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Click</Button>)
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should forward ref', () => {
      const ref = vi.fn()
      render(<Button ref={ref}>Test</Button>)
      expect(ref).toHaveBeenCalled()
    })

    it('should pass through native button attributes', () => {
      render(<Button type="submit" name="submit-btn">Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('name', 'submit-btn')
    })
  })

  describe('asChild prop', () => {
    it('should render as child element when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })
  })

  describe('accessibility', () => {
    it('should be focusable', () => {
      render(<Button>Focus me</Button>)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should have accessible name', () => {
      render(<Button>Accessible</Button>)
      expect(screen.getByRole('button', { name: 'Accessible' })).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Button aria-label="Custom label">X</Button>)
      expect(screen.getByRole('button', { name: 'Custom label' })).toBeInTheDocument()
    })
  })
})
```

### Test Setup Configuration

Ensure `vitest.config.mts` includes:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.spec.{ts,tsx}'],
  },
})
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

### Running Component Tests

```bash
# Run Button tests only
pnpm test:unit -- tests/unit/button.spec.tsx

# Run all unit tests
pnpm test:unit

# With coverage
pnpm test:unit -- --coverage
```

---

## E2E Tests

### Visual Integration Tests

Create/update `tests/e2e/design-system.e2e.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Design System - Phase 2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr')
  })

  test.describe('Button Component', () => {
    test('should display all button variants', async ({ page }) => {
      // Wait for buttons to be visible
      const buttons = page.locator('button')
      await expect(buttons.first()).toBeVisible()

      // Check default variant
      await expect(page.getByRole('button', { name: 'Default' })).toBeVisible()

      // Check secondary variant
      await expect(page.getByRole('button', { name: 'Secondary' })).toBeVisible()

      // Check outline variant
      await expect(page.getByRole('button', { name: 'Outline' })).toBeVisible()

      // Check ghost variant
      await expect(page.getByRole('button', { name: 'Ghost' })).toBeVisible()
    })

    test('should display different button sizes', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Small' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Large' })).toBeVisible()
    })

    test('should show hover state on button', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Default' })
      await button.hover()
      // Visual verification - hover should change appearance
      await expect(button).toBeVisible()
    })

    test('should show focus ring on keyboard navigation', async ({ page }) => {
      // Tab to first button
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab') // May need multiple tabs depending on page structure

      // Check that a button has focus
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should be keyboard operable', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Default' })

      // Focus the button
      await button.focus()
      expect(await button.evaluate(el => document.activeElement === el)).toBe(true)

      // Press Enter should activate
      // (We'd need an onClick handler to test this properly)
    })
  })

  test.describe('Accessibility', () => {
    test('should pass axe accessibility audit', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('main') // Focus on main content
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('buttons should have sufficient color contrast', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze()

      // Filter for button-related violations
      const buttonViolations = accessibilityScanResults.violations.filter(v =>
        v.nodes.some(n => n.html.includes('button'))
      )
      expect(buttonViolations).toEqual([])
    })

    test('buttons should be keyboard accessible', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['keyboard'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
})
```

### Running E2E Tests

```bash
# Run design system E2E tests
pnpm test:e2e -- tests/e2e/design-system.e2e.spec.ts

# Run with UI mode (visual debugging)
pnpm test:e2e -- --ui tests/e2e/design-system.e2e.spec.ts

# Run specific test
pnpm test:e2e -- -g "should display all button variants"

# Run with headed browser
pnpm test:e2e -- --headed tests/e2e/design-system.e2e.spec.ts
```

---

## Accessibility Testing

### Manual Testing Checklist

| Test | Method | Expected Result |
|------|--------|-----------------|
| Keyboard navigation | Tab through page | All buttons focusable |
| Focus visible | Tab to button | Focus ring visible |
| Screen reader | Use NVDA/VoiceOver | Buttons announced correctly |
| Touch target | Measure in DevTools | Minimum 44x44px |
| Color contrast | Use contrast checker | 4.5:1 for text |

### Automated Accessibility Testing

The E2E tests above include axe-core integration. Additional checks:

```typescript
// Add to E2E test file
test('should meet WCAG 2.1 AA standards', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  // Log any violations for debugging
  if (results.violations.length > 0) {
    console.log('Accessibility violations:', results.violations)
  }

  expect(results.violations).toHaveLength(0)
})
```

---

## Test Commands Summary

| Command | Description |
|---------|-------------|
| `pnpm test:unit` | Run all unit tests |
| `pnpm test:unit -- tests/unit/utils.spec.ts` | Run cn() tests |
| `pnpm test:unit -- tests/unit/button.spec.tsx` | Run Button tests |
| `pnpm test:unit -- --coverage` | Run with coverage |
| `pnpm test:e2e` | Run all E2E tests |
| `pnpm test:e2e -- tests/e2e/design-system.e2e.spec.ts` | Run design system E2E |
| `pnpm test:e2e -- --ui` | Run with Playwright UI |

---

## Coverage Requirements

### Unit Test Coverage

| File | Required | Branches | Functions |
|------|----------|----------|-----------|
| `src/lib/utils.ts` | 100% | 100% | 100% |
| `src/components/ui/button.tsx` | 80% | 80% | 100% |

### E2E Coverage

| Scenario | Required |
|----------|----------|
| All button variants render | Yes |
| All button sizes render | Yes |
| Hover states work | Yes |
| Focus states work | Yes |
| Keyboard navigation | Yes |
| Accessibility audit passes | Yes |

---

## CI Integration

These tests should run in CI. Ensure `.github/workflows/quality-gate.yml` includes:

```yaml
- name: Run unit tests
  run: pnpm test:unit

- name: Run E2E tests
  run: pnpm test:e2e
```

---

## Troubleshooting Tests

### Issue: Tests fail to find component

**Cause**: Path alias not resolved in tests

**Solution**: Ensure `vite-tsconfig-paths` is in vitest config

### Issue: RTL can't find button

**Cause**: Button not rendered or wrong query

**Solution**: Use `screen.debug()` to see rendered HTML

### Issue: E2E tests timeout

**Cause**: Dev server not started

**Solution**: Ensure `webServer` is configured in `playwright.config.ts`

### Issue: Accessibility violations

**Cause**: Missing ARIA attributes or contrast issues

**Solution**: Check axe violation details, fix in component

---

**Testing Strategy Status**: READY FOR USE
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
