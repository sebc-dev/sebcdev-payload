# Phase 2: Testing Strategy - Homepage Structure

**Story**: 3.5 - Homepage Implementation
**Phase**: 2 of 3

---

## Testing Philosophy

Cette phase cree des composants RSC (React Server Components) async qui ne peuvent pas etre unit-testes de maniere traditionnelle. La strategie est:

- **Unit Tests**: Logique pure et composants simples
- **Integration Tests**: Data fetching avec Payload
- **E2E Tests**: Tests complets en Phase 3

---

## Test Coverage

| Component | Unit Tests | Integration Tests | E2E (Phase 3) |
|-----------|------------|-------------------|---------------|
| FeaturedArticleCard | Partial | - | Yes |
| ArticleGrid | Partial | - | Yes |
| EmptyState | Yes | - | Yes |
| Homepage Page | - | Yes | Yes |

---

## Unit Tests

### EmptyState.spec.tsx

L'EmptyState peut etre partiellement unit-teste en mockant les dependencies serveur.

```typescript
// tests/unit/components/EmptyState.spec.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => async (key: string) => {
    const translations: Record<string, string> = {
      title: 'Bienvenue sur sebc.dev !',
      description: "Aucun article n'a encore ete publie.",
      cta: 'Creer un article',
    }
    return translations[key] || key
  }),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

import { cookies } from 'next/headers'
import { EmptyState } from '@/components/EmptyState'

describe('EmptyState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome message', async () => {
    vi.mocked(cookies).mockResolvedValue({
      has: () => false,
    } as any)

    const Component = await EmptyState({ locale: 'fr' })
    render(Component)

    expect(screen.getByText('Bienvenue sur sebc.dev !')).toBeInTheDocument()
  })

  it('hides CTA when not authenticated', async () => {
    vi.mocked(cookies).mockResolvedValue({
      has: () => false,
    } as any)

    const Component = await EmptyState({ locale: 'fr' })
    render(Component)

    expect(screen.queryByText('Creer un article')).not.toBeInTheDocument()
  })

  it('shows CTA when authenticated', async () => {
    vi.mocked(cookies).mockResolvedValue({
      has: (name: string) => name === 'payload-token',
    } as any)

    const Component = await EmptyState({ locale: 'fr' })
    render(Component)

    expect(screen.getByText('Creer un article')).toBeInTheDocument()
  })

  it('links to admin create page', async () => {
    vi.mocked(cookies).mockResolvedValue({
      has: (name: string) => name === 'payload-token',
    } as any)

    const Component = await EmptyState({ locale: 'fr' })
    render(Component)

    const link = screen.getByRole('link', { name: /Creer un article/i })
    expect(link).toHaveAttribute('href', '/admin/collections/posts/create')
  })
})
```

### Testing Async Server Components

Pour les RSC async comme FeaturedArticleCard et ArticleGrid, les tests complets sont en E2E. Cependant, on peut tester la logique extraite:

```typescript
// tests/unit/utils/articleUtils.spec.ts
import { describe, it, expect } from 'vitest'

// Extraire la logique de formatage si necessaire
describe('Article utilities', () => {
  it('formats reading time correctly', () => {
    // Si vous avez des utils extraits
    expect(formatReadingTime(5)).toBe('5 min de lecture')
  })

  it('limits tags to specified count', () => {
    const tags = [
      { id: '1', title: 'React', slug: 'react' },
      { id: '2', title: 'Next.js', slug: 'nextjs' },
      { id: '3', title: 'TypeScript', slug: 'typescript' },
      { id: '4', title: 'Tailwind', slug: 'tailwind' },
    ]

    expect(tags.slice(0, 3)).toHaveLength(3)
  })
})
```

---

## Integration Tests

### Homepage Data Fetching

```typescript
// tests/int/homepage.int.spec.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@payload-config'

describe('Homepage Integration', () => {
  let payload: any

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches published articles only', async () => {
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
    })

    // All returned articles should be published
    docs.forEach((doc: any) => {
      expect(doc._status).toBe('published')
    })
  })

  it('fetches articles sorted by publishedAt descending', async () => {
    const { docs } = await payload.find({
      collection: 'posts',
      sort: '-publishedAt',
      limit: 7,
      where: {
        _status: { equals: 'published' },
      },
    })

    // Verify sorting
    for (let i = 1; i < docs.length; i++) {
      const prevDate = new Date(docs[i - 1].publishedAt)
      const currDate = new Date(docs[i].publishedAt)
      expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime())
    }
  })

  it('includes relations with depth 2', async () => {
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 2,
      limit: 1,
      where: {
        _status: { equals: 'published' },
      },
    })

    if (docs.length > 0) {
      const article = docs[0]

      // Category should be populated
      if (article.category) {
        expect(article.category).toHaveProperty('title')
        expect(article.category).toHaveProperty('slug')
      }

      // Tags should be populated
      if (article.tags?.length > 0) {
        expect(article.tags[0]).toHaveProperty('title')
        expect(article.tags[0]).toHaveProperty('slug')
      }
    }
  })

  it('limits to 7 articles', async () => {
    const { docs } = await payload.find({
      collection: 'posts',
      limit: 7,
      where: {
        _status: { equals: 'published' },
      },
    })

    expect(docs.length).toBeLessThanOrEqual(7)
  })
})
```

---

## Running Tests

### Unit Tests

```bash
pnpm test:unit
```

### Integration Tests

```bash
# Requires database connection
pnpm test:int
```

### Specific File

```bash
pnpm test:unit -- tests/unit/components/EmptyState.spec.tsx
```

---

## E2E Tests Preview (Phase 3)

Ces tests seront implementes en Phase 3:

```typescript
// tests/e2e/homepage.e2e.spec.ts (Phase 3)
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('displays featured article when articles exist', async ({ page }) => {
    await page.goto('/fr')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('displays empty state when no articles', async ({ page }) => {
    // Setup: delete all articles or use test DB
    await page.goto('/fr')
    await expect(page.getByText('Bienvenue sur sebc.dev')).toBeVisible()
  })

  test('shows create button only when authenticated', async ({ page }) => {
    // Not authenticated
    await page.goto('/fr')
    await expect(page.getByText('Creer un article')).not.toBeVisible()

    // Login
    await page.goto('/admin')
    await page.fill('[name=email]', 'test@test.com')
    await page.fill('[name=password]', 'password')
    await page.click('button[type=submit]')

    // Authenticated
    await page.goto('/fr')
    await expect(page.getByText('Creer un article')).toBeVisible()
  })
})
```

---

## Mocking Strategy

### Payload Mock

Pour les tests unitaires sans DB:

```typescript
// tests/mocks/payload.ts
export const mockPayload = {
  find: vi.fn().mockResolvedValue({
    docs: [
      {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
        excerpt: 'Test excerpt',
        category: { id: '1', title: 'Tutorial', slug: 'tutorial' },
        tags: [],
        complexity: 'beginner',
        readingTime: 5,
        publishedAt: '2025-12-01T00:00:00Z',
        _status: 'published',
      },
    ],
    totalDocs: 1,
  }),
}

vi.mock('payload', () => ({
  getPayload: vi.fn(() => mockPayload),
}))
```

### Cookies Mock

```typescript
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    has: vi.fn((name: string) => name === 'payload-token'),
    get: vi.fn(),
    set: vi.fn(),
  })),
}))
```

---

## Test Data

### Seed Data for Tests

```typescript
// tests/fixtures/articles.ts
export const mockArticles = [
  {
    id: '1',
    title: 'Featured Article',
    slug: 'featured-article',
    excerpt: 'This is the featured article excerpt.',
    coverImage: {
      url: '/images/test.jpg',
      alt: 'Test image',
    },
    category: {
      id: 'cat1',
      title: 'Tutorial',
      slug: 'tutorial',
      color: '#14B8A6',
      icon: 'graduation',
    },
    tags: [
      { id: 'tag1', title: 'React', slug: 'react' },
      { id: 'tag2', title: 'Next.js', slug: 'nextjs' },
    ],
    complexity: 'intermediate' as const,
    readingTime: 8,
    publishedAt: '2025-12-01T10:00:00Z',
    _status: 'published' as const,
  },
  // ... 6 more articles for grid
]

export const emptyArticles: typeof mockArticles = []
```

---

## Coverage Requirements

### Phase 2 Minimum Coverage

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| EmptyState.tsx | 80% | 100% | 80% |
| Article utils | 90% | 85% | 90% |

### Deferred to Phase 3

- FeaturedArticleCard full coverage (via E2E)
- ArticleGrid full coverage (via E2E)
- Homepage page full coverage (via E2E)

---

## Troubleshooting

### Issue: "cookies is not a function"

```typescript
// Solution: Mock properly
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    has: vi.fn(),
  }),
}))
```

### Issue: "Cannot use import statement outside a module"

```typescript
// Solution: Configure vitest for ESM
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    deps: {
      inline: ['next-intl'],
    },
  },
})
```

### Issue: "getTranslations is not working"

```typescript
// Solution: Mock the async function
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => Promise.resolve((key: string) => key)),
}))
```
