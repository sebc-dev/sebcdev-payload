# Phase 5 - Testing Guide

**Phase**: SEO, Metadata & E2E Tests

This guide covers the testing strategy for Phase 5 implementation.

---

## Testing Overview

### Test Types in Phase 5

| Type | Framework | Location | Purpose |
|------|-----------|----------|---------|
| Unit | Vitest | `tests/unit/` | Test SEO utilities in isolation |
| E2E | Playwright | `tests/e2e/` | Test full page behavior |
| Manual | Browser | - | Validate SEO tools |

### Test Coverage Targets

| Area | Target | Actual |
|------|--------|--------|
| SEO Utilities | > 80% | TBD |
| E2E Article Page | 10+ tests | TBD |
| E2E 404 Handling | 5+ tests | TBD |

---

## Unit Tests

### SEO Utilities Unit Tests

Create unit tests for the SEO utility functions:

#### File: `tests/unit/lib/seo/article-metadata.spec.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import {
  generateArticleMetadata,
  generate404Metadata,
  getArticleUrl,
  siteConfig,
} from '@/lib/seo/article-metadata'
import type { ArticleSEOData } from '@/lib/seo/types'

describe('article-metadata', () => {
  const mockArticle: ArticleSEOData = {
    title: 'Test Article',
    excerpt: 'This is a test article excerpt.',
    slug: 'test-article',
    publishedAt: '2024-01-15T10:00:00Z',
    featuredImage: {
      url: 'https://example.com/image.jpg',
      alt: 'Test image',
      width: 1200,
      height: 630,
    },
    category: {
      name: 'Tutorials',
      slug: 'tutorials',
    },
    tags: [
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Next.js', slug: 'nextjs' },
    ],
    locale: 'fr',
  }

  describe('getArticleUrl', () => {
    it('generates correct URL for FR locale', () => {
      const url = getArticleUrl('my-article', 'fr')
      expect(url).toContain('/fr/articles/my-article')
    })

    it('generates correct URL for EN locale', () => {
      const url = getArticleUrl('my-article', 'en')
      expect(url).toContain('/en/articles/my-article')
    })
  })

  describe('generateArticleMetadata', () => {
    it('generates title with site name', () => {
      const metadata = generateArticleMetadata(mockArticle)
      expect(metadata.title).toContain(mockArticle.title)
      expect(metadata.title).toContain(siteConfig.name)
    })

    it('uses excerpt as description', () => {
      const metadata = generateArticleMetadata(mockArticle)
      expect(metadata.description).toBe(mockArticle.excerpt)
    })

    it('includes Open Graph data', () => {
      const metadata = generateArticleMetadata(mockArticle)
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.openGraph?.title).toBe(mockArticle.title)
    })

    it('includes Twitter Card data', () => {
      const metadata = generateArticleMetadata(mockArticle)
      expect(metadata.twitter).toBeDefined()
      expect(metadata.twitter?.card).toBeDefined()
    })

    it('includes hreflang alternates', () => {
      const metadata = generateArticleMetadata(mockArticle)
      expect(metadata.alternates?.languages).toBeDefined()
      expect(metadata.alternates?.languages?.fr).toContain('/fr/articles/')
      expect(metadata.alternates?.languages?.en).toContain('/en/articles/')
    })

    it('includes OG image when featuredImage exists', () => {
      const metadata = generateArticleMetadata(mockArticle)
      expect(metadata.openGraph?.images).toBeDefined()
      expect(metadata.openGraph?.images).toHaveLength(1)
    })

    it('handles missing featuredImage', () => {
      const articleWithoutImage = { ...mockArticle, featuredImage: null }
      const metadata = generateArticleMetadata(articleWithoutImage)
      expect(metadata.openGraph?.images).toBeUndefined()
    })
  })

  describe('generate404Metadata', () => {
    it('returns noindex for 404 pages', () => {
      const metadata = generate404Metadata('fr')
      expect(metadata.robots?.index).toBe(false)
    })

    it('returns French title for FR locale', () => {
      const metadata = generate404Metadata('fr')
      expect(metadata.title).toContain('non trouvé')
    })

    it('returns English title for EN locale', () => {
      const metadata = generate404Metadata('en')
      expect(metadata.title).toContain('not found')
    })
  })
})
```

#### File: `tests/unit/lib/seo/json-ld.spec.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { generateArticleJsonLd } from '@/lib/seo/json-ld'
import type { ArticleSEOData } from '@/lib/seo/types'

describe('json-ld', () => {
  const mockArticle: ArticleSEOData = {
    title: 'Test Article',
    excerpt: 'This is a test article excerpt.',
    slug: 'test-article',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    featuredImage: {
      url: 'https://example.com/image.jpg',
      alt: 'Test image',
      width: 1200,
      height: 630,
    },
    category: {
      name: 'Tutorials',
      slug: 'tutorials',
    },
    tags: [
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Next.js', slug: 'nextjs' },
    ],
    locale: 'fr',
  }

  describe('generateArticleJsonLd', () => {
    it('includes required @context and @type', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Article')
    })

    it('includes headline from title', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.headline).toBe(mockArticle.title)
    })

    it('includes description from excerpt', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.description).toBe(mockArticle.excerpt)
    })

    it('includes datePublished', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.datePublished).toBe(mockArticle.publishedAt)
    })

    it('includes dateModified when available', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.dateModified).toBe(mockArticle.updatedAt)
    })

    it('omits dateModified when not available', () => {
      const articleWithoutUpdate = { ...mockArticle, updatedAt: undefined }
      const jsonLd = generateArticleJsonLd(articleWithoutUpdate)
      expect(jsonLd.dateModified).toBeUndefined()
    })

    it('includes image URL when featuredImage exists', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.image).toBe(mockArticle.featuredImage?.url)
    })

    it('includes keywords from tags', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.keywords).toContain('TypeScript')
      expect(jsonLd.keywords).toContain('Next.js')
    })

    it('includes articleSection from category', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.articleSection).toBe(mockArticle.category?.name)
    })

    it('includes author object', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.author).toBeDefined()
      expect(jsonLd.author['@type']).toBe('Organization')
    })

    it('includes publisher object', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.publisher).toBeDefined()
      expect(jsonLd.publisher['@type']).toBe('Organization')
    })

    it('includes mainEntityOfPage', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.mainEntityOfPage).toBeDefined()
      expect(jsonLd.mainEntityOfPage['@type']).toBe('WebPage')
    })

    it('sets correct inLanguage for FR', () => {
      const jsonLd = generateArticleJsonLd(mockArticle)
      expect(jsonLd.inLanguage).toBe('fr-FR')
    })

    it('sets correct inLanguage for EN', () => {
      const enArticle = { ...mockArticle, locale: 'en' as const }
      const jsonLd = generateArticleJsonLd(enArticle)
      expect(jsonLd.inLanguage).toBe('en-US')
    })
  })
})
```

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/lib/seo/article-metadata.spec.ts

# Run with coverage
pnpm test:unit --coverage

# Watch mode
pnpm test:unit --watch
```

---

## E2E Tests

### Test Structure

```
tests/e2e/
├── article-page.e2e.spec.ts    # Article page tests
├── article-404.e2e.spec.ts     # 404 handling tests
├── homepage-seeded.e2e.spec.ts # Existing tests (reference)
```

### Prerequisites

Before running E2E tests:

```bash
# Seed the database
pnpm seed --clean

# Install Playwright browsers (if not done)
pnpm exec playwright install chromium
```

### Article Page E2E Tests

See `IMPLEMENTATION_PLAN.md` for full test implementation.

Key test scenarios:

| Scenario | Test |
|----------|------|
| Title renders | `displays article title in H1` |
| Content renders | `renders article content (RichText)` |
| Code blocks | `renders code blocks with syntax highlighting` |
| Category badge | `displays category badge` |
| Reading time | `displays reading time` |
| Page title | `has correct page title` |
| Meta description | `has meta description` |
| Open Graph | `has Open Graph meta tags` |
| Twitter Card | `has Twitter Card meta tags` |
| hreflang | `has hreflang alternates` |
| JSON-LD | `has JSON-LD structured data` |
| Navigation | `navigate from homepage to article` |
| Locale switch | `locale switch preserves article` |
| Mobile | `mobile: article renders correctly` |
| Tablet | `tablet: article renders correctly` |
| Desktop | `desktop: article renders correctly` |

### 404 E2E Tests

Key test scenarios:

| Scenario | Test |
|----------|------|
| 404 status FR | `displays 404 page for non-existent article (FR)` |
| 404 status EN | `displays 404 page for non-existent article (EN)` |
| Navigation | `404 page has navigation back to homepage` |
| noindex | `404 page has noindex meta tag` |
| Special chars | `handles special characters in slug gracefully` |

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/e2e/article-page.e2e.spec.ts

# Run with UI (interactive)
pnpm exec playwright test --ui

# Run headed (see browser)
pnpm exec playwright test --headed

# Debug mode
pnpm exec playwright test --debug

# Generate and view report
pnpm exec playwright show-report
```

### E2E Test Patterns

#### Skip When No Seed Data

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)
  const title = await page.title()

  if (title.includes('404') || title.includes('non trouvé')) {
    test.skip(true, 'Database not seeded - run: pnpm seed --clean')
  }
})
```

#### Check Meta Tags

```typescript
test('has Open Graph meta tags', async ({ page }) => {
  await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
  const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')

  expect(ogTitle).toBeTruthy()
  expect(ogType).toBe('article')
})
```

#### Validate JSON-LD

```typescript
test('has JSON-LD structured data', async ({ page }) => {
  await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

  const jsonLdScript = page.locator('script[type="application/ld+json"]')
  const jsonLdContent = await jsonLdScript.textContent()

  expect(jsonLdContent).toBeTruthy()

  const jsonLd = JSON.parse(jsonLdContent!)
  expect(jsonLd['@context']).toBe('https://schema.org')
  expect(jsonLd['@type']).toBe('Article')
})
```

#### Test 404 Status

```typescript
test('displays 404 page for non-existent article', async ({ page }) => {
  const response = await page.goto('/fr/articles/non-existent-slug')

  expect(response?.status()).toBe(404)
})
```

---

## Manual Testing

### SEO Validation Checklist

#### 1. View Page Source

```bash
# Navigate to article page
# Press Ctrl+U (Windows/Linux) or Cmd+Option+U (Mac)
# Or use curl:
curl -s http://localhost:3000/fr/articles/test-article | head -100
```

Check for:
- [ ] `<title>` contains article title and site name
- [ ] `<meta name="description">` has excerpt
- [ ] `<meta property="og:title">` present
- [ ] `<meta property="og:type">` is "article"
- [ ] `<meta property="og:image">` present (if article has image)
- [ ] `<meta name="twitter:card">` present
- [ ] `<link rel="alternate" hreflang="fr">` present
- [ ] `<link rel="alternate" hreflang="en">` present
- [ ] `<script type="application/ld+json">` present

#### 2. Schema.org Validator

1. Go to: https://validator.schema.org/
2. Paste article page URL
3. Click "Run Test"
4. Verify no errors for Article type

#### 3. Google Rich Results Test

1. Go to: https://search.google.com/test/rich-results
2. Paste article page URL
3. Click "Test URL"
4. Verify Article rich result detected

#### 4. Facebook Sharing Debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Paste article page URL
3. Click "Debug"
4. Verify OG tags are correct

#### 5. Twitter Card Validator

1. Go to: https://cards-dev.twitter.com/validator
2. Paste article page URL
3. Verify card preview looks correct

### Lighthouse Audit

```bash
# Run manually in Chrome DevTools:
# 1. Open article page
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Select all categories
# 5. Click "Analyze page load"
```

Expected scores:

| Category | Target |
|----------|--------|
| Performance | >= 90 |
| Accessibility | 100 |
| Best Practices | >= 90 |
| SEO | >= 90 |

---

## Test Data

### Seed Article Reference

The E2E tests use this article from the seed script:

```typescript
const TEST_ARTICLE = {
  slug: 'nextjs-cloudflare-workers',
  fr: {
    title: 'Déployer une Application Next.js sur Cloudflare Workers',
  },
  en: {
    title: 'Deploy a Next.js Application on Cloudflare Workers',
  },
}
```

### Updating Seed Data

If you need to update the seed:

1. Edit `scripts/seed.ts`
2. Run `pnpm seed --clean`
3. Update test constants to match

---

## Debugging Failed Tests

### E2E Test Debugging

```bash
# Run with debug mode
pnpm exec playwright test --debug

# Run specific test with debug
pnpm exec playwright test -g "displays article title" --debug

# Take screenshots on failure (configured in playwright.config.ts)
# Screenshots saved to: test-results/

# View trace files
pnpm exec playwright show-trace test-results/trace.zip
```

### Common Issues

#### 1. Tests Skip - No Seed Data

```bash
# Solution: Seed the database
pnpm seed --clean
```

#### 2. Element Not Found

```bash
# Debug: Use Playwright Inspector
pnpm exec playwright test --debug

# Check selector in browser console
# document.querySelector('meta[property="og:title"]')
```

#### 3. Timeout Errors

```typescript
// Increase timeout in specific test
test('slow test', async ({ page }) => {
  test.setTimeout(60000) // 60 seconds
  // ...
})
```

#### 4. Flaky Tests

```typescript
// Add retry logic
test.describe.configure({ retries: 2 })

// Or use stable selectors
// Bad:
page.locator('.article-title')
// Good:
page.getByRole('heading', { level: 1 })
```

---

## CI Integration

### GitHub Actions Configuration

E2E tests are configured to run in CI:

```yaml
# .github/workflows/tests.yml
- name: E2E Tests
  run: |
    pnpm seed --clean
    pnpm test:e2e
```

### Test Artifacts

On CI failure, artifacts are uploaded:
- Screenshots
- Traces
- Test report

---

## Coverage Reporting

### Generate Coverage Report

```bash
# Unit tests with coverage
pnpm test:unit --coverage

# View coverage report
open coverage/index.html
```

### Coverage Targets

| File | Target |
|------|--------|
| `article-metadata.ts` | > 80% |
| `json-ld.ts` | > 80% |
| `types.ts` | N/A (types only) |

---

**Testing Guide Created**: 2025-12-10
**Last Updated**: 2025-12-10
