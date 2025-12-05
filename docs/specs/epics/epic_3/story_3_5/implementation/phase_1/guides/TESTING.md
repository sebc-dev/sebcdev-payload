# Phase 1: Testing Strategy - Composants Atomiques

**Story**: 3.5 - Homepage Implementation
**Phase**: 1 of 3

---

## Testing Philosophy

Cette phase cree des composants atomiques qui doivent etre testes unitairement:
- **Unit Tests** (Vitest): Composants client et logique pure
- **No E2E Tests**: Les composants atomiques sont testes via les E2E de la Phase 3

---

## Test Coverage Targets

| Component | Unit Tests | Coverage Target |
|-----------|------------|-----------------|
| CategoryBadge | Yes | 90%+ |
| ComplexityBadge | Yes | 90%+ |
| TagPill | Yes | 90%+ |
| RelativeDate | Yes | 80%+ |
| ArticleCard | Partial* | 70%+ |

*ArticleCard est un RSC async, teste partiellement via unit tests et completement via E2E en Phase 3.

---

## Test File Structure

```
tests/
└── unit/
    └── components/
        └── articles/
            ├── CategoryBadge.spec.tsx
            ├── ComplexityBadge.spec.tsx
            ├── TagPill.spec.tsx
            └── RelativeDate.spec.tsx
```

---

## Unit Tests

### CategoryBadge.spec.tsx

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CategoryBadge } from '@/components/articles/CategoryBadge'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('CategoryBadge', () => {
  const mockCategory = {
    id: '1',
    title: 'Tutoriel',
    slug: 'tutorial',
    color: '#14B8A6',
    icon: '📚',
  }

  it('renders category title', () => {
    render(<CategoryBadge category={mockCategory} locale="fr" />)
    expect(screen.getByText('Tutoriel')).toBeInTheDocument()
  })

  it('renders category icon with aria-hidden', () => {
    render(<CategoryBadge category={mockCategory} locale="fr" />)
    const icon = screen.getByText('📚')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies dynamic color style', () => {
    render(<CategoryBadge category={mockCategory} locale="fr" />)
    const badge = screen.getByText('Tutoriel').closest('div')
    expect(badge).toHaveStyle({ color: '#14B8A6' })
  })

  it('renders as link when clickable=true (default)', () => {
    render(<CategoryBadge category={mockCategory} locale="fr" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/fr/articles?category=tutorial')
  })

  it('renders without link when clickable=false', () => {
    render(<CategoryBadge category={mockCategory} locale="fr" clickable={false} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('handles category without color', () => {
    const categoryNoColor = { ...mockCategory, color: undefined }
    render(<CategoryBadge category={categoryNoColor} locale="fr" />)
    expect(screen.getByText('Tutoriel')).toBeInTheDocument()
  })

  it('handles category without icon', () => {
    const categoryNoIcon = { ...mockCategory, icon: undefined }
    render(<CategoryBadge category={categoryNoIcon} locale="fr" />)
    expect(screen.getByText('Tutoriel')).toBeInTheDocument()
    expect(screen.queryByText('📚')).not.toBeInTheDocument()
  })
})
```

### ComplexityBadge.spec.tsx

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ComplexityBadge } from '@/components/articles/ComplexityBadge'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      beginner: 'Debutant',
      intermediate: 'Intermediaire',
      advanced: 'Avance',
    }
    return translations[key] || key
  },
}))

describe('ComplexityBadge', () => {
  it('renders beginner level with correct styling', () => {
    render(<ComplexityBadge level="beginner" />)
    const badge = screen.getByText('Debutant').closest('div')
    expect(badge).toHaveClass('bg-green-600/20')
    expect(badge).toHaveClass('text-green-400')
  })

  it('renders intermediate level with correct styling', () => {
    render(<ComplexityBadge level="intermediate" />)
    const badge = screen.getByText('Intermediaire').closest('div')
    expect(badge).toHaveClass('bg-orange-600/20')
    expect(badge).toHaveClass('text-orange-400')
  })

  it('renders advanced level with correct styling', () => {
    render(<ComplexityBadge level="advanced" />)
    const badge = screen.getByText('Avance').closest('div')
    expect(badge).toHaveClass('bg-red-600/20')
    expect(badge).toHaveClass('text-red-400')
  })

  it('renders emoji with aria-hidden', () => {
    render(<ComplexityBadge level="beginner" />)
    // Find the emoji span
    const emojiSpan = screen.getByText('Debutant')
      .closest('div')
      ?.querySelector('span[aria-hidden]')
    expect(emojiSpan).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    render(<ComplexityBadge level="beginner" className="custom-class" />)
    const badge = screen.getByText('Debutant').closest('div')
    expect(badge).toHaveClass('custom-class')
  })
})
```

### TagPill.spec.tsx

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TagPill } from '@/components/articles/TagPill'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>{children}</a>
  ),
}))

describe('TagPill', () => {
  const mockTag = {
    id: '1',
    title: 'React',
    slug: 'react',
  }

  it('renders tag title', () => {
    render(<TagPill tag={mockTag} locale="fr" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('links to Hub with correct query param', () => {
    render(<TagPill tag={mockTag} locale="fr" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/fr/articles?tags=react')
  })

  it('uses correct locale in URL', () => {
    render(<TagPill tag={mockTag} locale="en" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/en/articles?tags=react')
  })

  it('stops event propagation on click', () => {
    const parentClick = vi.fn()
    render(
      <div onClick={parentClick}>
        <TagPill tag={mockTag} locale="fr" />
      </div>
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(parentClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<TagPill tag={mockTag} locale="fr" className="custom-class" />)
    const badge = screen.getByText('React').closest('div')
    expect(badge).toHaveClass('custom-class')
  })
})
```

### RelativeDate.spec.tsx

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RelativeDate } from '@/components/RelativeDate'

// Mock next-intl
vi.mock('next-intl', () => ({
  useFormatter: () => ({
    relativeTime: (date: Date) => {
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "aujourd'hui"
      if (diffDays === 1) return 'hier'
      if (diffDays < 7) return `il y a ${diffDays} jours`
      return `il y a ${Math.floor(diffDays / 7)} semaines`
    },
    dateTime: (date: Date, options: any) => date.toLocaleDateString('fr-FR'),
  }),
}))

describe('RelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-12-05T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders relative time for recent date', () => {
    const yesterday = new Date('2025-12-04T12:00:00Z')
    render(<RelativeDate date={yesterday} />)
    expect(screen.getByText('hier')).toBeInTheDocument()
  })

  it('renders time element with datetime attribute', () => {
    const date = new Date('2025-12-01T12:00:00Z')
    render(<RelativeDate date={date} />)
    const timeElement = screen.getByRole('time')
    expect(timeElement).toHaveAttribute('datetime', '2025-12-01T12:00:00.000Z')
  })

  it('shows full date on hover via title', () => {
    const date = new Date('2025-12-01T12:00:00Z')
    render(<RelativeDate date={date} />)
    const timeElement = screen.getByRole('time')
    expect(timeElement).toHaveAttribute('title')
  })

  it('accepts string date', () => {
    render(<RelativeDate date="2025-12-04T12:00:00Z" />)
    expect(screen.getByText('hier')).toBeInTheDocument()
  })

  it('accepts Date object', () => {
    const date = new Date('2025-12-04T12:00:00Z')
    render(<RelativeDate date={date} />)
    expect(screen.getByText('hier')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const date = new Date('2025-12-04T12:00:00Z')
    render(<RelativeDate date={date} className="custom-class" />)
    const timeElement = screen.getByRole('time')
    expect(timeElement).toHaveClass('custom-class')
  })
})
```

---

## Running Tests

### Run All Unit Tests

```bash
pnpm test:unit
```

### Run Specific Test File

```bash
pnpm test:unit -- tests/unit/components/articles/CategoryBadge.spec.tsx
```

### Run Tests in Watch Mode

```bash
pnpm test:unit -- --watch
```

### Run Tests with Coverage

```bash
pnpm test:unit -- --coverage
```

---

## Test Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**/*.{ts,tsx}'],
      exclude: ['src/components/ui/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### tests/setup.ts

```typescript
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))
```

---

## Mocking Strategy

### next-intl

Les composants utilisent next-intl pour les traductions. Mocker selon le besoin:

```typescript
// Simple mock - retourne la cle
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Detailed mock - retourne des vraies traductions
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations = { /* ... */ }
    return translations[key]
  },
}))
```

### next/link

```typescript
vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>{children}</a>
  ),
}))
```

### next/image

```typescript
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))
```

---

## Test Patterns

### Testing Click Handlers

```typescript
it('calls handler on click', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click</Button>)

  await user.click(screen.getByText('Click'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Testing Conditional Rendering

```typescript
it('shows icon when present', () => {
  render(<CategoryBadge category={{ ...mockCategory, icon: '📚' }} locale="fr" />)
  expect(screen.getByText('📚')).toBeInTheDocument()
})

it('hides icon when absent', () => {
  render(<CategoryBadge category={{ ...mockCategory, icon: undefined }} locale="fr" />)
  expect(screen.queryByText('📚')).not.toBeInTheDocument()
})
```

### Testing Styles

```typescript
it('applies correct classes', () => {
  render(<ComplexityBadge level="beginner" />)
  const badge = screen.getByText('Debutant').closest('div')
  expect(badge).toHaveClass('bg-green-600/20')
})

it('applies inline styles', () => {
  render(<CategoryBadge category={mockCategory} locale="fr" />)
  const badge = screen.getByText('Tutoriel').closest('div')
  expect(badge).toHaveStyle({ color: '#14B8A6' })
})
```

---

## Coverage Report

Apres execution des tests, verifier le coverage:

```bash
pnpm test:unit -- --coverage
```

**Target Coverage:**
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## Troubleshooting

### Issue: "Cannot find module '@/components/...'"

**Solution**: Verifier les aliases dans `vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue: "useTranslations is not a function"

**Solution**: Mocker next-intl avant l'import du composant:
```typescript
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

import { ComplexityBadge } from '@/components/articles/ComplexityBadge'
```

### Issue: "ReferenceError: React is not defined"

**Solution**: Ajouter dans `tests/setup.ts`:
```typescript
import React from 'react'
global.React = React
```
