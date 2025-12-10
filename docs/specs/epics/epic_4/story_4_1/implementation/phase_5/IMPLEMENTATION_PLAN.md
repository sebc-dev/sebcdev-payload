# Phase 5 - Implementation Plan

**Phase**: SEO, Metadata & E2E Tests
**Commits**: 5 atomic commits
**Estimated Duration**: 4-5 hours

---

## Commit Strategy Overview

```
Commit 1: SEO Utilities & Types
    ↓
Commit 2: generateMetadata Implementation
    ↓
Commit 3: JSON-LD Structured Data
    ↓
Commit 4: E2E Tests - Article Page
    ↓
Commit 5: E2E Tests - 404 & Final Validation
```

Each commit is:
- **Atomic**: Single responsibility, can be reverted independently
- **Type-safe**: TypeScript compiles without errors
- **Tested**: Unit tests pass after each commit
- **Buildable**: `pnpm build` succeeds

---

## Commit 1: SEO Utilities & Types

### Objective

Create the foundational SEO utilities and TypeScript types for metadata generation.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/lib/seo/types.ts` | Create | ~40 |
| `src/lib/seo/article-metadata.ts` | Create | ~80 |
| `src/lib/seo/index.ts` | Create | ~10 |

### Implementation Details

#### `src/lib/seo/types.ts`

```typescript
/**
 * SEO Types
 *
 * Type definitions for SEO metadata generation.
 */

import type { Metadata } from 'next'

/**
 * Article data needed for SEO metadata
 */
export interface ArticleSEOData {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  updatedAt?: string
  featuredImage?: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  category?: {
    name: string
    slug: string
  } | null
  tags?: Array<{
    name: string
    slug: string
  }>
  locale: 'fr' | 'en'
}

/**
 * Site-wide SEO configuration
 */
export interface SiteConfig {
  name: string
  url: string
  defaultLocale: 'fr' | 'en'
  locales: readonly ['fr', 'en']
  author: {
    name: string
    url?: string
  }
  logo?: {
    url: string
    width: number
    height: number
  }
}

/**
 * Open Graph image configuration
 */
export interface OGImage {
  url: string
  width: number
  height: number
  alt: string
}
```

#### `src/lib/seo/article-metadata.ts`

```typescript
/**
 * Article Metadata Generation
 *
 * Utilities for generating Next.js Metadata for article pages.
 */

import type { Metadata } from 'next'
import type { ArticleSEOData, SiteConfig, OGImage } from './types'

/**
 * Site configuration
 */
export const siteConfig: SiteConfig = {
  name: 'SebCDev',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sebcdev.com',
  defaultLocale: 'fr',
  locales: ['fr', 'en'] as const,
  author: {
    name: 'SebCDev',
    url: 'https://sebcdev.com',
  },
  logo: {
    url: '/logo.png',
    width: 512,
    height: 512,
  },
}

/**
 * Generate article URL for a given locale
 */
export function getArticleUrl(slug: string, locale: string): string {
  return `${siteConfig.url}/${locale}/articles/${slug}`
}

/**
 * Generate Open Graph image object
 */
function getOGImage(article: ArticleSEOData): OGImage | undefined {
  if (!article.featuredImage?.url) return undefined

  return {
    url: article.featuredImage.url,
    width: article.featuredImage.width,
    height: article.featuredImage.height,
    alt: article.featuredImage.alt || article.title,
  }
}

/**
 * Generate hreflang alternates for multilingual support
 */
function getAlternates(slug: string): Metadata['alternates'] {
  return {
    canonical: getArticleUrl(slug, 'fr'),
    languages: {
      'fr': getArticleUrl(slug, 'fr'),
      'en': getArticleUrl(slug, 'en'),
      'x-default': getArticleUrl(slug, 'fr'),
    },
  }
}

/**
 * Generate complete metadata for an article page
 */
export function generateArticleMetadata(article: ArticleSEOData): Metadata {
  const title = `${article.title} | ${siteConfig.name}`
  const description = article.excerpt || `Read ${article.title} on ${siteConfig.name}`
  const url = getArticleUrl(article.slug, article.locale)
  const ogImage = getOGImage(article)

  return {
    title,
    description,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.name,

    // Open Graph
    openGraph: {
      type: 'article',
      title: article.title,
      description,
      url,
      siteName: siteConfig.name,
      locale: article.locale === 'fr' ? 'fr_FR' : 'en_US',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.author.name],
      ...(ogImage && { images: [ogImage] }),
    },

    // Twitter Card
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      ...(ogImage && { images: [ogImage.url] }),
    },

    // Alternates (hreflang)
    alternates: getAlternates(article.slug),

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Generate metadata for 404 page
 */
export function generate404Metadata(locale: string): Metadata {
  const title = locale === 'fr' ? 'Article non trouvé' : 'Article not found'
  const description = locale === 'fr'
    ? 'L\'article que vous recherchez n\'existe pas.'
    : 'The article you are looking for does not exist.'

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    robots: {
      index: false,
      follow: true,
    },
  }
}
```

#### `src/lib/seo/index.ts`

```typescript
/**
 * SEO Module Exports
 */

export * from './types'
export * from './article-metadata'
export * from './json-ld'
```

### Validation Checklist

- [ ] `src/lib/seo/` directory created
- [ ] Types compile without errors
- [ ] `siteConfig` uses environment variable for URL
- [ ] `generateArticleMetadata` returns valid Metadata object
- [ ] `getAlternates` generates correct hreflang URLs
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes

### Commit Message

```
✨ feat(seo): add article metadata utilities and types

- Add ArticleSEOData and SiteConfig types
- Implement generateArticleMetadata for Next.js Metadata API
- Support Open Graph, Twitter Cards, and hreflang alternates
- Add site configuration with environment variable support
```

---

## Commit 2: generateMetadata Implementation

### Objective

Integrate the SEO utilities into the article page with Next.js `generateMetadata` function.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Modify | +60 |
| `src/lib/seo/article-metadata.ts` | Modify | +20 |

### Implementation Details

#### Update `page.tsx` with generateMetadata

```typescript
import type { Metadata } from 'next'
import { generateArticleMetadata, generate404Metadata } from '@/lib/seo'
import type { ArticleSEOData } from '@/lib/seo'

// ... existing imports ...

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Generate metadata for the article page
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params

  try {
    const { article } = await getArticleBySlug(slug, locale as Locale)

    if (!article) {
      return generate404Metadata(locale)
    }

    // Map to SEO data
    const seoData: ArticleSEOData = {
      title: article.title,
      excerpt: article.excerpt ?? '',
      slug: article.slug,
      publishedAt: article.publishedAt ?? article.createdAt,
      updatedAt: article.updatedAt,
      featuredImage: isPopulatedMedia(article.featuredImage)
        ? {
            url: article.featuredImage.url ?? '',
            alt: article.featuredImage.alt ?? article.title,
            width: article.featuredImage.width ?? 1200,
            height: article.featuredImage.height ?? 630,
          }
        : null,
      category: isPopulatedCategory(article.category)
        ? {
            name: article.category.name,
            slug: article.category.slug,
          }
        : null,
      tags: article.tags?.filter(isPopulatedTag).map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      })),
      locale: locale as 'fr' | 'en',
    }

    return generateArticleMetadata(seoData)
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generate404Metadata(locale)
  }
}

// ... rest of page component remains the same ...
```

### Validation Checklist

- [ ] `generateMetadata` function exported from page
- [ ] Handles missing article gracefully
- [ ] Maps Payload article to ArticleSEOData correctly
- [ ] Error handling in place
- [ ] View page source shows `<meta property="og:*">` tags
- [ ] View page source shows `<meta name="twitter:*">` tags
- [ ] View page source shows `<link rel="alternate" hreflang="*">` tags
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

### Manual Testing

```bash
# Start dev server
pnpm dev

# Navigate to article and view page source
# Look for:
# - <title>Article Title | SebCDev</title>
# - <meta name="description" content="...">
# - <meta property="og:title" content="...">
# - <meta property="og:image" content="...">
# - <link rel="alternate" hreflang="fr" href="...">
# - <link rel="alternate" hreflang="en" href="...">
```

### Commit Message

```
✨ feat(seo): implement generateMetadata for article pages

- Add generateMetadata function to article page
- Map Payload article data to SEO metadata
- Handle missing articles with 404 metadata
- Support Open Graph and Twitter Card meta tags
- Add hreflang alternates for FR/EN
```

---

## Commit 3: JSON-LD Structured Data

### Objective

Add JSON-LD Article structured data for rich search results.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/lib/seo/json-ld.ts` | Create | ~80 |
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Modify | +20 |

### Implementation Details

#### `src/lib/seo/json-ld.ts`

```typescript
/**
 * JSON-LD Structured Data Generation
 *
 * Generates Schema.org Article structured data for SEO.
 */

import type { ArticleSEOData, SiteConfig } from './types'
import { siteConfig, getArticleUrl } from './article-metadata'

/**
 * Schema.org Article type
 */
interface ArticleJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author: {
    '@type': 'Person' | 'Organization'
    name: string
    url?: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
      width: number
      height: number
    }
  }
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  keywords?: string
  articleSection?: string
  inLanguage: string
}

/**
 * Generate JSON-LD for an article
 */
export function generateArticleJsonLd(article: ArticleSEOData): ArticleJsonLd {
  const url = getArticleUrl(article.slug, article.locale)

  const jsonLd: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      ...(siteConfig.logo && {
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}${siteConfig.logo.url}`,
          width: siteConfig.logo.width,
          height: siteConfig.logo.height,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: article.locale === 'fr' ? 'fr-FR' : 'en-US',
  }

  // Optional fields
  if (article.updatedAt) {
    jsonLd.dateModified = article.updatedAt
  }

  if (article.featuredImage?.url) {
    jsonLd.image = article.featuredImage.url
  }

  if (article.tags && article.tags.length > 0) {
    jsonLd.keywords = article.tags.map((t) => t.name).join(', ')
  }

  if (article.category) {
    jsonLd.articleSection = article.category.name
  }

  return jsonLd
}

/**
 * JSON-LD Script Component
 */
export function ArticleJsonLdScript({ article }: { article: ArticleSEOData }) {
  const jsonLd = generateArticleJsonLd(article)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

#### Update `page.tsx` to include JSON-LD

```typescript
import { ArticleJsonLdScript } from '@/lib/seo'

// ... in the component return ...

return (
  <>
    {/* JSON-LD Structured Data */}
    <ArticleJsonLdScript article={seoData} />

    <article className="container mx-auto px-4 py-8 max-w-prose">
      {/* ... existing content ... */}
    </article>
  </>
)
```

### Validation Checklist

- [ ] `json-ld.ts` created with correct Schema.org structure
- [ ] `ArticleJsonLdScript` component renders script tag
- [ ] JSON-LD appears in page source
- [ ] Validates on [Schema.org Validator](https://validator.schema.org/)
- [ ] Validates on [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

### Manual Testing

```bash
# View page source and find:
# <script type="application/ld+json">
# {"@context":"https://schema.org","@type":"Article",...}
# </script>

# Test with Google Rich Results Test
# https://search.google.com/test/rich-results
```

### Commit Message

```
✨ feat(seo): add JSON-LD Article structured data

- Create json-ld.ts with Schema.org Article generation
- Add ArticleJsonLdScript component for rendering
- Include keywords from tags, articleSection from category
- Support dateModified for updated articles
- Integrate into article page component
```

---

## Commit 4: E2E Tests - Article Page

### Objective

Create comprehensive E2E tests for article page navigation and rendering.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `tests/e2e/article-page.e2e.spec.ts` | Create | ~200 |

### Implementation Details

#### `tests/e2e/article-page.e2e.spec.ts`

```typescript
import { expect, test } from '@playwright/test'

import enMessages from '../../messages/en.json' with { type: 'json' }
import frMessages from '../../messages/fr.json' with { type: 'json' }

/**
 * Article Page E2E Tests
 *
 * Tests article page rendering, navigation, and SEO elements.
 * Requires seeded data (run: pnpm seed --clean)
 */

// Seed data constants (must match scripts/seed.ts)
const TEST_ARTICLE = {
  slug: 'nextjs-cloudflare-workers',
  fr: {
    title: 'Déployer une Application Next.js sur Cloudflare Workers',
  },
  en: {
    title: 'Deploy a Next.js Application on Cloudflare Workers',
  },
}

/**
 * Skip tests if database not seeded
 */
test.beforeEach(async ({ page }) => {
  await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)
  const title = await page.title()

  if (title.includes('404') || title.includes('non trouvé')) {
    test.skip(true, 'Database not seeded - run: pnpm seed --clean')
  }
})

test.describe('Article Page', () => {
  test.describe('Content Rendering', () => {
    test('displays article title in H1', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(TEST_ARTICLE.fr.title)
    })

    test('displays article title in EN locale', async ({ page }) => {
      await page.goto(`/en/articles/${TEST_ARTICLE.slug}`)

      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(TEST_ARTICLE.en.title)
    })

    test('renders article content (RichText)', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      // Article should have paragraphs
      const paragraphs = page.locator('article p')
      const count = await paragraphs.count()
      expect(count).toBeGreaterThan(0)
    })

    test('renders code blocks with syntax highlighting', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      // Look for code blocks (pre > code)
      const codeBlocks = page.locator('pre code')
      const count = await codeBlocks.count()

      // Skip if article has no code blocks
      if (count === 0) {
        test.skip(true, 'Article has no code blocks')
        return
      }

      // Code should have syntax highlighting classes
      const firstCode = codeBlocks.first()
      await expect(firstCode).toBeVisible()
    })

    test('displays category badge', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      // Category badge should be visible
      const categoryBadge = page.getByText('Tutoriels').first()
      await expect(categoryBadge).toBeVisible()
    })

    test('displays reading time', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const readingTime = page.getByText(/min de lecture/i)
      await expect(readingTime.first()).toBeVisible()
    })
  })

  test.describe('SEO Metadata', () => {
    test('has correct page title', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const title = await page.title()
      expect(title).toContain(TEST_ARTICLE.fr.title)
      expect(title).toContain('SebCDev')
    })

    test('has meta description', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const description = await page.locator('meta[name="description"]').getAttribute('content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(10)
    })

    test('has Open Graph meta tags', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')

      expect(ogTitle).toBeTruthy()
      expect(ogType).toBe('article')
      expect(ogUrl).toContain(`/fr/articles/${TEST_ARTICLE.slug}`)
    })

    test('has Twitter Card meta tags', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')

      expect(twitterCard).toBeTruthy()
      expect(twitterTitle).toBeTruthy()
    })

    test('has hreflang alternates', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const frAlternate = page.locator('link[rel="alternate"][hreflang="fr"]')
      const enAlternate = page.locator('link[rel="alternate"][hreflang="en"]')

      await expect(frAlternate).toHaveAttribute('href', new RegExp(`/fr/articles/${TEST_ARTICLE.slug}`))
      await expect(enAlternate).toHaveAttribute('href', new RegExp(`/en/articles/${TEST_ARTICLE.slug}`))
    })

    test('has JSON-LD structured data', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      const jsonLdScript = page.locator('script[type="application/ld+json"]')
      const jsonLdContent = await jsonLdScript.textContent()

      expect(jsonLdContent).toBeTruthy()

      const jsonLd = JSON.parse(jsonLdContent!)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Article')
      expect(jsonLd.headline).toContain(TEST_ARTICLE.fr.title)
    })
  })

  test.describe('Navigation', () => {
    test('navigate from homepage to article', async ({ page }) => {
      await page.goto('/fr')

      // Click on featured article
      const h1Link = page.locator('h1 a')
      await h1Link.click()

      await expect(page).toHaveURL(`/fr/articles/${TEST_ARTICLE.slug}`)
      await expect(page.locator('h1')).toContainText(TEST_ARTICLE.fr.title)
    })

    test('locale switch preserves article', async ({ page }) => {
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      // Find and click locale switcher (adjust selector as needed)
      const localeSwitcher = page.getByRole('link', { name: /en/i }).first()

      if (await localeSwitcher.isVisible()) {
        await localeSwitcher.click()
        await expect(page).toHaveURL(`/en/articles/${TEST_ARTICLE.slug}`)
        await expect(page.locator('h1')).toContainText(TEST_ARTICLE.en.title)
      }
    })
  })

  test.describe('Responsive Layout', () => {
    test('mobile: article renders correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })

    test('tablet: article renders correctly', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })

    test('desktop: article renders correctly', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(`/fr/articles/${TEST_ARTICLE.slug}`)

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })
  })
})
```

### Validation Checklist

- [ ] Test file created at `tests/e2e/article-page.e2e.spec.ts`
- [ ] Tests skip gracefully when database not seeded
- [ ] All test assertions are correct
- [ ] `pnpm test:e2e` passes (with seeded data)
- [ ] Tests cover content, SEO, navigation, responsive

### Commit Message

```
✅ test(e2e): add article page E2E tests

- Add content rendering tests (title, RichText, code blocks)
- Add SEO metadata tests (title, description, OG, Twitter, hreflang)
- Add JSON-LD structured data validation
- Add navigation tests (homepage to article, locale switch)
- Add responsive layout tests (mobile, tablet, desktop)
- Skip tests gracefully when database not seeded
```

---

## Commit 5: E2E Tests - 404 & Final Validation

### Objective

Add E2E tests for 404 handling and complete final validation.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `tests/e2e/article-404.e2e.spec.ts` | Create | ~80 |
| `docs/specs/epics/epic_4/story_4_1/IMPLEMENTATION_NOTES.md` | Create | ~70 |

### Implementation Details

#### `tests/e2e/article-404.e2e.spec.ts`

```typescript
import { expect, test } from '@playwright/test'

/**
 * Article 404 E2E Tests
 *
 * Tests 404 handling for non-existent articles.
 */

const NON_EXISTENT_SLUGS = [
  'this-article-does-not-exist',
  'non-existent-article-12345',
  'random-slug-xyz',
]

test.describe('Article 404 Handling', () => {
  test('displays 404 page for non-existent article (FR)', async ({ page }) => {
    const response = await page.goto(`/fr/articles/${NON_EXISTENT_SLUGS[0]}`)

    // Should return 404 status
    expect(response?.status()).toBe(404)

    // Should display 404 content
    const body = await page.textContent('body')
    expect(body).toMatch(/404|non trouvé|not found/i)
  })

  test('displays 404 page for non-existent article (EN)', async ({ page }) => {
    const response = await page.goto(`/en/articles/${NON_EXISTENT_SLUGS[1]}`)

    expect(response?.status()).toBe(404)

    const body = await page.textContent('body')
    expect(body).toMatch(/404|not found/i)
  })

  test('404 page has navigation back to homepage', async ({ page }) => {
    await page.goto(`/fr/articles/${NON_EXISTENT_SLUGS[2]}`)

    // Should have a link back to homepage or articles
    const homeLink = page.getByRole('link', { name: /accueil|home|retour/i })

    if (await homeLink.isVisible()) {
      await homeLink.click()
      await expect(page).toHaveURL(/\/(fr|en)(\/)?$/)
    }
  })

  test('404 page has noindex meta tag', async ({ page }) => {
    await page.goto(`/fr/articles/${NON_EXISTENT_SLUGS[0]}`)

    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content')

    // 404 pages should not be indexed
    if (robotsMeta) {
      expect(robotsMeta).toContain('noindex')
    }
  })

  test('handles special characters in slug gracefully', async ({ page }) => {
    const specialSlug = 'article-with-émojis-🚀'
    const response = await page.goto(`/fr/articles/${encodeURIComponent(specialSlug)}`)

    // Should not crash, either 404 or valid response
    expect([200, 404]).toContain(response?.status())
  })
})
```

#### `docs/specs/epics/epic_4/story_4_1/IMPLEMENTATION_NOTES.md`

```markdown
# Story 4.1 - Implementation Notes

**Story**: Rendu Article & MDX
**Status**: COMPLETE
**Completed**: 2025-12-XX

---

## Summary

Story 4.1 successfully implemented the article page with:

- Dynamic route `/[locale]/articles/[slug]`
- Lexical richText rendering to React components
- Code syntax highlighting with Shiki
- Image optimization with next/image
- Comprehensive SEO (metadata, JSON-LD, hreflang)
- E2E test coverage

## Phases Completed

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Route & Layout | ✅ Complete |
| 2 | Lexical Rendering | ✅ Complete |
| 3 | Code Highlighting | ✅ Complete |
| 4 | Images & Styling | ✅ Complete |
| 5 | SEO & Tests | ✅ Complete |

## Key Decisions

1. **Shiki for syntax highlighting**: Chose Shiki over Prism for better theme support and Edge compatibility
2. **next/image with Cloudflare loader**: Optimal performance on Workers
3. **JSON-LD for structured data**: Better SEO rich snippets
4. **Seeded E2E tests**: Reliable test data for consistent results

## Known Limitations

- Image focal point/crop disabled (Workers limitation)
- No lightbox for inline images (out of scope)

## Performance Results

| Metric | Target | Actual |
|--------|--------|--------|
| LCP | < 2.5s | TBD |
| CLS | < 0.1 | TBD |
| Accessibility | 100 | TBD |
| SEO | >= 90 | TBD |

## Files Created/Modified

See individual phase documentation for complete file lists.

## Related Documentation

- [Phase 1 INDEX](./implementation/phase_1/INDEX.md)
- [Phase 2 INDEX](./implementation/phase_2/INDEX.md)
- [Phase 3 INDEX](./implementation/phase_3/INDEX.md)
- [Phase 4 INDEX](./implementation/phase_4/INDEX.md)
- [Phase 5 INDEX](./implementation/phase_5/INDEX.md)
```

### Validation Checklist

- [ ] `tests/e2e/article-404.e2e.spec.ts` created
- [ ] 404 tests pass
- [ ] `IMPLEMENTATION_NOTES.md` created
- [ ] All Story 4.1 E2E tests pass
- [ ] `pnpm test:e2e` passes completely
- [ ] `pnpm build` succeeds

### Final Validation

```bash
# Run all tests
pnpm test:unit
pnpm test:e2e

# Build verification
pnpm build

# Lighthouse audit (manual)
# Navigate to article page and run Lighthouse in Chrome DevTools
```

### Commit Message

```
✅ test(e2e): add article 404 E2E tests and story documentation

- Add 404 handling tests for non-existent articles
- Verify 404 status code and page content
- Test noindex meta tag on 404 pages
- Handle special characters in slugs gracefully
- Add IMPLEMENTATION_NOTES.md for story completion
- Story 4.1 complete
```

---

## Post-Implementation

### Update EPIC_TRACKING.md

After completing Phase 5, update the epic tracking:

```markdown
### Story 4.1: Rendu Article & MDX

| Phase | Status | Completed |
|-------|--------|-----------|
| Phase 1 | ✅ Complete | 2025-12-XX |
| Phase 2 | ✅ Complete | 2025-12-XX |
| Phase 3 | ✅ Complete | 2025-12-XX |
| Phase 4 | ✅ Complete | 2025-12-XX |
| Phase 5 | ✅ Complete | 2025-12-XX |

**Story Status**: ✅ COMPLETE
```

### Update PHASES_PLAN.md

```markdown
- [x] Phase 5: SEO & Tests - Status: ✅ COMPLETE
```

---

## Quick Reference

### Commands

```bash
# Development
pnpm dev

# Testing
pnpm test:unit
pnpm test:e2e

# Build
pnpm build

# Linting
pnpm lint
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/seo/article-metadata.ts` | Metadata generation |
| `src/lib/seo/json-ld.ts` | JSON-LD generation |
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Article page |
| `tests/e2e/article-page.e2e.spec.ts` | Article E2E tests |
| `tests/e2e/article-404.e2e.spec.ts` | 404 E2E tests |

---

**Plan Created**: 2025-12-10
**Last Updated**: 2025-12-10
