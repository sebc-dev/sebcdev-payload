# Phase 1 - Implementation Plan

**Phase**: Article Page Route & Basic Layout
**Commits**: 5 atomic commits
**Estimated Duration**: 3 hours

---

## Commit Strategy

This phase follows the **atomic commit** methodology:

- Each commit is self-contained and type-safe
- Each commit can be reviewed independently (~15-30 min review time)
- Each commit builds incrementally on the previous
- Rollback to any commit leaves the codebase in a working state

### Commit Order

```
[Commit 1] → [Commit 2] → [Commit 3] → [Commit 4] → [Commit 5]
    ↓           ↓           ↓           ↓           ↓
  Fetch      Article     Article      Page       i18n &
  Utils      Header      Footer      Route       404
```

---

## Commit 1: Payload Fetch Utilities

**Title**: `feat(articles): add article fetch utilities for slug lookup`

**Gitmoji**: ✨

### Objective

Create reusable data fetching utilities for retrieving articles by slug from Payload CMS.

### Files

| File | Action | Lines |
|------|--------|-------|
| `src/lib/payload/articles.ts` | Create | ~60 |
| `tests/unit/lib/payload/articles.spec.ts` | Create | ~80 |

### Implementation Details

#### `src/lib/payload/articles.ts`

```typescript
/**
 * Article Fetch Utilities
 *
 * Provides type-safe functions for fetching articles from Payload CMS.
 * Uses Local API (no HTTP) for optimal performance on Edge.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Article } from '@/payload-types'
import type { Locale } from '@/i18n/config'

/**
 * Result type for article fetch operations
 */
export interface ArticleFetchResult {
  article: Article | null
  error?: string
}

/**
 * Fetch a single article by slug
 *
 * @param slug - Article slug (URL-friendly identifier)
 * @param locale - Locale for localized content (fr/en)
 * @returns Article data or null if not found
 *
 * @example
 * const { article, error } = await getArticleBySlug('mon-article', 'fr')
 * if (!article) notFound()
 */
export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleFetchResult> {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'articles',
      locale,
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 2, // Include relations (category, tags)
      limit: 1,
    })

    return {
      article: docs[0] ?? null,
    }
  } catch (error) {
    console.error('[getArticleBySlug] Error:', error)
    return {
      article: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

#### Test File Structure

```typescript
// tests/unit/lib/payload/articles.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { getArticleBySlug } from '@/lib/payload/articles'

// Mock payload
vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({
  default: Promise.resolve({}),
}))

describe('getArticleBySlug', () => {
  it('returns article when found')
  it('returns null when not found')
  it('handles errors gracefully')
  it('uses correct locale parameter')
  it('filters by published status')
})
```

### Validation Criteria

- [ ] Function exported and typed correctly
- [ ] Returns `ArticleFetchResult` type
- [ ] Handles null/error cases
- [ ] TypeScript compiles without errors
- [ ] Unit tests pass

### Commit Message

```
✨ feat(articles): add article fetch utilities for slug lookup

- Create getArticleBySlug utility for fetching articles by slug
- Add ArticleFetchResult type for type-safe returns
- Handle error cases gracefully with error message
- Include depth: 2 for category/tags relations
- Add unit tests for all scenarios
```

---

## Commit 2: ArticleHeader Component

**Title**: `feat(articles): add ArticleHeader component with metadata display`

**Gitmoji**: ✨

### Objective

Create the `ArticleHeader` component that displays article metadata (title, category, complexity, reading time, date).

### Files

| File | Action | Lines |
|------|--------|-------|
| `src/components/articles/ArticleHeader.tsx` | Create | ~80 |
| `src/components/articles/index.ts` | Modify | +2 |

### Implementation Details

#### `src/components/articles/ArticleHeader.tsx`

```typescript
/**
 * ArticleHeader Component
 *
 * Displays article metadata in the page header:
 * - Category badge (clickable)
 * - Title (h1)
 * - Complexity badge
 * - Reading time + Publication date
 *
 * Server Component - no client JS
 */

import { getTranslations } from 'next-intl/server'
import { CategoryBadge } from './CategoryBadge'
import { ComplexityBadge } from './ComplexityBadge'
import { RelativeDate } from '../RelativeDate'
import type { ArticleData } from './types'
import type { Locale } from '@/i18n/config'

interface ArticleHeaderProps {
  article: ArticleData
  locale: Locale
}

export async function ArticleHeader({ article, locale }: ArticleHeaderProps) {
  const t = await getTranslations('article')

  return (
    <header className="space-y-4 pb-8 border-b border-border">
      {/* Category Badge */}
      <CategoryBadge
        category={article.category}
        locale={locale}
        clickable={true}
      />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
        {article.title}
      </h1>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {/* Complexity */}
        <ComplexityBadge level={article.complexity} />

        {/* Reading Time */}
        <span>{t('readingTime', { minutes: article.readingTime })}</span>

        {/* Separator */}
        <span aria-hidden="true" className="text-border">•</span>

        {/* Publication Date */}
        <RelativeDate date={article.publishedAt} />
      </div>
    </header>
  )
}
```

#### Export Update

```typescript
// In src/components/articles/index.ts - add:
export { ArticleHeader } from './ArticleHeader'
```

### Validation Criteria

- [ ] Component renders without errors
- [ ] H1 title displayed correctly
- [ ] Category badge clickable
- [ ] Complexity badge displayed
- [ ] Reading time formatted
- [ ] Date displayed with RelativeDate
- [ ] Responsive on mobile/tablet/desktop
- [ ] TypeScript compiles

### Commit Message

```
✨ feat(articles): add ArticleHeader component with metadata display

- Create ArticleHeader RSC with article metadata
- Display category badge, title (h1), complexity badge
- Show reading time and relative publication date
- Use existing CategoryBadge, ComplexityBadge, RelativeDate
- Add responsive typography (text-3xl to text-5xl)
- Export from articles barrel file
```

---

## Commit 3: ArticleFooter Component

**Title**: `feat(articles): add ArticleFooter component with tags display`

**Gitmoji**: ✨

### Objective

Create the `ArticleFooter` component that displays article tags.

### Files

| File | Action | Lines |
|------|--------|-------|
| `src/components/articles/ArticleFooter.tsx` | Create | ~50 |
| `src/components/articles/index.ts` | Modify | +1 |

### Implementation Details

#### `src/components/articles/ArticleFooter.tsx`

```typescript
/**
 * ArticleFooter Component
 *
 * Displays article tags at the bottom of the article.
 * Tags are clickable and link to tag filter pages.
 *
 * Server Component - no client JS
 */

import { getTranslations } from 'next-intl/server'
import { TagPill } from './TagPill'
import type { TagData } from './types'
import type { Locale } from '@/i18n/config'

interface ArticleFooterProps {
  tags: TagData[]
  locale: Locale
}

export async function ArticleFooter({ tags, locale }: ArticleFooterProps) {
  const t = await getTranslations('article')

  if (tags.length === 0) {
    return null
  }

  return (
    <footer className="pt-8 mt-8 border-t border-border">
      {/* Tags Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {t('tagsLabel')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagPill key={tag.id} tag={tag} locale={locale} />
          ))}
        </div>
      </div>
    </footer>
  )
}
```

#### Export Update

```typescript
// In src/components/articles/index.ts - add:
export { ArticleFooter } from './ArticleFooter'
```

### Validation Criteria

- [ ] Component renders tags correctly
- [ ] TagPills are clickable
- [ ] Returns null when no tags
- [ ] Border separator visible
- [ ] Responsive flex-wrap layout
- [ ] TypeScript compiles

### Commit Message

```
✨ feat(articles): add ArticleFooter component with tags display

- Create ArticleFooter RSC for displaying article tags
- Use existing TagPill component for tag rendering
- Add tags label with translation support
- Handle empty tags case (return null)
- Add responsive flex-wrap layout
- Export from articles barrel file
```

---

## Commit 4: Article Page Route

**Title**: `feat(articles): add article page route with data fetching`

**Gitmoji**: ✨

### Objective

Create the main article page route that assembles all components and fetches data.

### Files

| File | Action | Lines |
|------|--------|-------|
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Create | ~120 |

### Implementation Details

#### `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

```typescript
/**
 * Article Page
 *
 * Dynamic route for displaying a single article.
 * Server Component with Payload Local API fetching.
 *
 * Route: /[locale]/articles/[slug]
 * Example: /fr/articles/mon-premier-article
 */

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getArticleBySlug } from '@/lib/payload/articles'
import { ArticleHeader, ArticleFooter } from '@/components/articles'
import type { ArticleData } from '@/components/articles/types'
import type { Article as PayloadArticle } from '@/payload-types'
import type { LucideCategoryIcon } from '@/lib/lucide-icons'
import type { Locale } from '@/i18n/config'

/**
 * Force dynamic rendering.
 * Required because we fetch from Payload which needs runtime env vars.
 */
export const dynamic = 'force-dynamic'

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Map Payload article to component ArticleData
 */
function mapPayloadToArticleData(article: PayloadArticle): ArticleData {
  // Map category
  const category = typeof article.category === 'object' && article.category !== null
    ? {
        id: String(article.category.id),
        title: 'name' in article.category ? (article.category.name as string) : '',
        slug: article.category.slug || '',
        color: 'color' in article.category ? (article.category.color as string) : undefined,
        icon: 'icon' in article.category ? (article.category.icon as LucideCategoryIcon) : undefined,
      }
    : { id: '', title: '', slug: '' }

  // Map tags
  const tags = article.tags?.map((tag) => {
    if (typeof tag === 'object' && tag !== null) {
      return {
        id: String(tag.id),
        title: 'name' in tag ? (tag.name as string) : '',
        slug: tag.slug || '',
      }
    }
    return { id: String(tag), title: '', slug: '' }
  }).filter((tag) => tag.title && tag.slug) ?? []

  return {
    id: String(article.id),
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    coverImage: null, // Phase 4 will handle featured image
    category,
    tags,
    complexity: (article.complexity as ArticleData['complexity']) || 'intermediate',
    readingTime: article.readingTime || 0,
    publishedAt: article.publishedAt || article.createdAt,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  // Fetch article by slug
  const { article: payloadArticle, error } = await getArticleBySlug(slug, locale)

  // Handle not found
  if (!payloadArticle) {
    notFound()
  }

  // Map to component data
  const article = mapPayloadToArticleData(payloadArticle)

  return (
    <article className="container mx-auto px-4 py-8 max-w-prose">
      {/* Header: Title, Category, Metadata */}
      <ArticleHeader article={article} locale={locale} />

      {/* Content Placeholder - Phase 2 will add Lexical rendering */}
      <div className="py-8 prose prose-gray dark:prose-invert max-w-none">
        <div className="p-4 bg-muted rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground mb-2">
            [Content will be rendered here in Phase 2]
          </p>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(payloadArticle.content, null, 2)?.slice(0, 500)}...
          </pre>
        </div>
      </div>

      {/* Footer: Tags */}
      <ArticleFooter tags={article.tags} locale={locale} />
    </article>
  )
}
```

### Validation Criteria

- [ ] Route accessible at `/[locale]/articles/[slug]`
- [ ] Article data fetched correctly
- [ ] ArticleHeader renders
- [ ] Content placeholder visible
- [ ] ArticleFooter renders with tags
- [ ] TypeScript compiles
- [ ] Build succeeds

### Commit Message

```
✨ feat(articles): add article page route with data fetching

- Create article page at /[locale]/articles/[slug]
- Implement mapPayloadToArticleData for type conversion
- Assemble ArticleHeader and ArticleFooter components
- Add content placeholder for Phase 2 Lexical integration
- Use notFound() for missing articles
- Force dynamic rendering for Payload compatibility
```

---

## Commit 5: Translations & 404 Page

**Title**: `feat(articles): add article translations and 404 page`

**Gitmoji**: ✨

### Objective

Add translation keys for article page and create the not-found page.

### Files

| File | Action | Lines |
|------|--------|-------|
| `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx` | Create | ~40 |
| `messages/fr.json` | Modify | +15 |
| `messages/en.json` | Modify | +15 |

### Implementation Details

#### `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx`

```typescript
/**
 * Article Not Found Page
 *
 * Displayed when an article with the given slug doesn't exist.
 * Provides helpful navigation back to articles list.
 */

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ArticleNotFound() {
  const t = await getTranslations('article.notFound')

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Icon */}
        <FileQuestion
          className="h-16 w-16 mx-auto text-muted-foreground"
          aria-hidden="true"
        />

        {/* Title */}
        <h1 className="text-2xl font-bold">{t('title')}</h1>

        {/* Description */}
        <p className="text-muted-foreground">{t('description')}</p>

        {/* CTA */}
        <Button asChild>
          <Link href="/">{t('backToHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
```

#### Translation Keys (French)

```json
{
  "article": {
    "publishedAgo": "Publié {time}",
    "readingTime": "{minutes} min de lecture",
    "tagsLabel": "Mots-clés",
    "notFound": {
      "title": "Article non trouvé",
      "description": "L'article que vous recherchez n'existe pas ou a été supprimé.",
      "backToHome": "Retour à l'accueil"
    }
  }
}
```

#### Translation Keys (English)

```json
{
  "article": {
    "publishedAgo": "Published {time}",
    "readingTime": "{minutes} min read",
    "tagsLabel": "Tags",
    "notFound": {
      "title": "Article not found",
      "description": "The article you're looking for doesn't exist or has been removed.",
      "backToHome": "Back to home"
    }
  }
}
```

### Validation Criteria

- [ ] 404 page renders for non-existent slugs
- [ ] French translations work
- [ ] English translations work
- [ ] Button links to homepage
- [ ] TypeScript compiles

### Commit Message

```
✨ feat(articles): add article translations and 404 page

- Create not-found.tsx for missing articles
- Add FileQuestion icon and helpful message
- Add translation keys for article page (FR/EN):
  - readingTime, tagsLabel, notFound.*
- Include backToHome CTA button
```

---

## Implementation Workflow

### For Each Commit

1. **Read** the commit specification above
2. **Create/modify** the files as specified
3. **Validate** using the checklist criteria
4. **Test** with `pnpm exec tsc --noEmit && pnpm lint`
5. **Commit** with the exact message format
6. **Verify** the commit with `git log -1`

### Command Reference

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Unit tests
pnpm test:unit

# Full validation
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit

# Commit
git add .
git commit -m "$(cat <<'EOF'
✨ feat(articles): commit message here

- Change 1
- Change 2
EOF
)"
```

---

## Rollback Points

Each commit creates a safe rollback point:

| After Commit | State | Rollback Command |
|--------------|-------|------------------|
| 1 | Fetch utilities only | `git reset --hard HEAD~1` |
| 2 | + ArticleHeader | `git reset --hard HEAD~1` |
| 3 | + ArticleFooter | `git reset --hard HEAD~1` |
| 4 | + Page route | `git reset --hard HEAD~1` |
| 5 | Complete phase | N/A |

---

## Next Steps

After completing all 5 commits:

1. Run full validation: [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. Mark Phase 1 as complete in EPIC_TRACKING.md
3. Proceed to Phase 2: Lexical Content Rendering

---

**Plan Generated**: 2025-12-09
**Total Commits**: 5
**Estimated Duration**: ~3 hours
