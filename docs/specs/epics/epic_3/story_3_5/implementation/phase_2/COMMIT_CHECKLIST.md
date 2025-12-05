# Phase 2: Commit Checklist - Homepage Structure

**Story**: 3.5 - Homepage Implementation
**Phase**: 2 of 3

---

## Prerequisites

Avant de commencer cette phase:
- [ ] Phase 1 completee et mergee
- [ ] Tous les composants atomiques disponibles
- [ ] `pnpm install` execute
- [ ] `pnpm build` passe

---

## Commit 1: FeaturedArticleCard

### Pre-Implementation
- [x] Verifier que les composants Phase 1 sont accessibles
- [x] Verifier que `lucide-react` est installe pour les icones

### Implementation

#### Creer `src/components/articles/FeaturedArticleCard.tsx`
- [x] Fichier cree

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CategoryBadge } from './CategoryBadge'
import { ComplexityBadge } from './ComplexityBadge'
import { TagPill } from './TagPill'
import { RelativeDate } from '../RelativeDate'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: { url: string; alt?: string } | null
  category: {
    id: string
    title: string
    slug: string
    color?: string
    icon?: string
  }
  tags: Array<{ id: string; title: string; slug: string }>
  complexity: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
  publishedAt: string
}

interface FeaturedArticleCardProps {
  article: Article
  locale: string
  className?: string
}

export async function FeaturedArticleCard({
  article,
  locale,
  className,
}: FeaturedArticleCardProps) {
  const t = await getTranslations('homepage')

  return (
    <article className={cn('group', className)}>
      <Card className={cn(
        'overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:scale-[1.01]'
      )}>
        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative aspect-video max-h-[400px] overflow-hidden">
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="space-y-4 pb-4">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <CategoryBadge category={article.category} locale={locale} />
            <span className="text-muted-foreground" aria-hidden="true">-</span>
            <span className="text-muted-foreground">
              {t('minRead', { minutes: article.readingTime })}
            </span>
            <span className="text-muted-foreground" aria-hidden="true">-</span>
            <RelativeDate date={article.publishedAt} className="text-muted-foreground" />
            <span className="text-muted-foreground" aria-hidden="true">-</span>
            <ComplexityBadge level={article.complexity} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            <Link
              href={`/${locale}/articles/${article.slug}`}
              className="hover:text-primary transition-colors"
            >
              {article.title}
            </Link>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Excerpt */}
          <p className="text-base text-muted-foreground line-clamp-3 sm:text-lg">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 5).map((tag) => (
                <TagPill key={tag.id} tag={tag} locale={locale} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-end pt-2">
            <Button asChild>
              <Link href={`/${locale}/articles/${article.slug}`}>
                {t('readArticle')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
```

#### Mettre a jour `src/components/articles/index.ts`
- [x] Fichier mis a jour avec export FeaturedArticleCard

```typescript
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
export { ArticleCard } from './ArticleCard'
export { RelativeDate } from '../RelativeDate'
export { FeaturedArticleCard } from './FeaturedArticleCard'
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [x] Image avec `priority` pour LCP
- [x] `<h1>` pour le titre (unique sur la page)
- [x] Hover effects sur carte et image
- [x] Tags limites a 5
- [x] Icone ArrowRight avec `aria-hidden`
- [x] Separateurs avec `aria-hidden`
- [x] `pnpm exec tsc --noEmit` passe
- [x] `pnpm lint` passe
- [x] `pnpm build` passe

### Commit
```bash
git add src/components/articles/FeaturedArticleCard.tsx src/components/articles/index.ts
git commit -m "feat(components): add FeaturedArticleCard component

Create featured article card for homepage hero:
- Full-width cover image with zoom effect
- H1 title for SEO
- Category, complexity, reading time metadata
- Up to 5 tags displayed
- CTA button to article page

Related: Story 3.5 Phase 2"
```

---

## Commit 2: ArticleGrid

### Pre-Implementation
- [x] Verifier que Commit 1 est complete

### Implementation

#### Creer `src/components/articles/ArticleGrid.tsx`

```typescript
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: { url: string; alt?: string } | null
  category: {
    id: string
    title: string
    slug: string
    color?: string
    icon?: string
  }
  tags: Array<{ id: string; title: string; slug: string }>
  complexity: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
  publishedAt: string
}

interface ArticleGridProps {
  articles: Article[]
  locale: string
  title?: string
  className?: string
}

export async function ArticleGrid({
  articles,
  locale,
  title,
  className,
}: ArticleGridProps) {
  const t = await getTranslations('homepage')
  const sectionTitle = title ?? t('recentArticles')

  if (articles.length === 0) {
    return null
  }

  return (
    <section className={cn('space-y-6', className)} aria-labelledby="recent-articles-heading">
      {/* Section Title */}
      <h2 id="recent-articles-heading" className="text-2xl font-bold">
        {sectionTitle}
      </h2>

      {/* Grid */}
      <div className={cn(
        'grid gap-4 sm:gap-5 lg:gap-6',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            locale={locale}
          />
        ))}
      </div>
    </section>
  )
}
```

#### Mettre a jour `src/components/articles/index.ts`
```typescript
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
export { ArticleCard } from './ArticleCard'
export { RelativeDate } from '../RelativeDate'
export { FeaturedArticleCard } from './FeaturedArticleCard'
export { ArticleGrid } from './ArticleGrid'
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [x] Grille responsive (1/2/3 colonnes)
- [x] Gaps responsifs (16/20/24px)
- [x] Section title avec `aria-labelledby`
- [x] Return null si pas d'articles
- [x] Title prop optionnel avec fallback i18n
- [x] `pnpm exec tsc --noEmit` passe
- [x] `pnpm lint` passe
- [x] `pnpm build` passe (TypeScript compilation successful)

### Commit
```bash
git add src/components/articles/ArticleGrid.tsx src/components/articles/index.ts
git commit -m "feat(components): add ArticleGrid component

Create responsive grid for recent articles:
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
- Responsive gaps (16/20/24px)
- Section title with i18n and aria-labelledby

Related: Story 3.5 Phase 2"
```

---

## Commit 3: EmptyState

### Pre-Implementation
- [x] Verifier que Commit 2 est complete

### Implementation

#### Creer `src/components/EmptyState.tsx`
- [x] Fichier cree

```typescript
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { FileText, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  locale: string
  className?: string
}

export async function EmptyState({ locale, className }: EmptyStateProps) {
  const t = await getTranslations('homepage.emptyState')

  // Check authentication via payload-token cookie
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.has('payload-token')

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
      aria-labelledby="empty-state-title"
    >
      {/* Icon */}
      <div className="mb-6 rounded-full bg-muted p-6">
        <FileText className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Title */}
      <h1 id="empty-state-title" className="mb-2 text-2xl font-bold">
        {t('title')}
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-md text-muted-foreground">
        {t('description')}
      </p>

      {/* CTA - Only if authenticated */}
      {isAuthenticated && (
        <Button asChild>
          <Link href="/admin/collections/posts/create">
            <PenLine className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('cta')}
          </Link>
        </Button>
      )}
    </section>
  )
}
```

#### Mettre a jour `src/components/articles/index.ts`
- [x] Fichier mis a jour avec export EmptyState

```typescript
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
export { ArticleCard } from './ArticleCard'
export { RelativeDate } from '../RelativeDate'
export { FeaturedArticleCard } from './FeaturedArticleCard'
export { ArticleGrid } from './ArticleGrid'
export { EmptyState } from '../EmptyState'
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [x] Cookie check via `cookies()` de next/headers
- [x] CTA conditionnel sur `isAuthenticated`
- [x] Icones avec `aria-hidden`
- [x] Section avec `aria-labelledby`
- [x] `pnpm exec tsc --noEmit` passe
- [x] `pnpm lint` passe
- [x] `pnpm build` passe

### Commit
```bash
git add src/components/EmptyState.tsx src/components/articles/index.ts
git commit -m "feat(components): add EmptyState component

Create empty state for homepage when no articles:
- Welcome message with icon
- Description text
- Conditional CTA (only if authenticated)
- Checks payload-token cookie for auth

Related: Story 3.5 Phase 2"
```

---

## Commit 4: Homepage Page

### Pre-Implementation
- [x] Verifier que les Commits 1-3 sont completes
- [x] Sauvegarder une copie de l'ancien `page.tsx` si besoin

### Implementation

#### Remplacer `src/app/[locale]/(frontend)/page.tsx`

```typescript
import Link from 'next/link'
import { getPayload } from 'payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import config from '@payload-config'
import { Button } from '@/components/ui/button'
import {
  FeaturedArticleCard,
  ArticleGrid,
  EmptyState,
} from '@/components/articles'
import type { Article as PayloadArticle } from '@/payload-types'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: { url: string; alt?: string } | null
  category: {
    id: string
    title: string
    slug: string
    color?: string
    icon?: string
  }
  tags: Array<{ id: string; title: string; slug: string }>
  complexity: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
  publishedAt: string
}

function mapArticle(payloadArticle: PayloadArticle): Article {
  // Maps Payload article to component article interface
  // Handles property name differences (featuredImage -> coverImage, name -> title)
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('homepage')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch 7 most recent published articles
  const { docs: payloadArticles } = await payload.find({
    collection: 'articles',
    locale: locale as 'fr' | 'en',
    limit: 7,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
    depth: 2,
  }) as { docs: PayloadArticle[] }

  const articles = payloadArticles.map(mapArticle)

  // Empty state
  if (articles.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <EmptyState locale={locale} />
      </main>
    )
  }

  // Destructure articles
  const [featuredArticle, ...recentArticles] = articles

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Featured Article */}
      <FeaturedArticleCard
        article={featuredArticle}
        locale={locale}
      />

      {/* Recent Articles Grid */}
      {recentArticles.length > 0 && (
        <ArticleGrid
          articles={recentArticles}
          locale={locale}
        />
      )}

      {/* CTA to Hub */}
      <section className="flex justify-center py-8">
        <Button asChild size="lg" variant="outline">
          <Link href={`/${locale}/articles`}>
            {t('viewAllArticles')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </main>
  )
}
```

### Additional Changes
- [x] Added `complexity` field to Articles collection (select: beginner/intermediate/advanced)
- [x] Updated Articles.ts collection definition
- [x] Regenerated Payload types with `pnpm generate:types:payload`

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm dev  # Tester manuellement
```

### Checklist
- [x] Import des composants via barrel export
- [x] Data fetching avec Payload Local API
- [x] Empty state affiche si 0 articles
- [x] Featured + Grid affiches si articles
- [x] CTA vers Hub visible
- [x] `setRequestLocale` appele pour static rendering
- [x] `pnpm exec tsc --noEmit` passe
- [x] `pnpm lint` passe
- [x] `pnpm build` passe
- [x] `pnpm dev` fonctionne

### Commit
```bash
git add src/app/[locale]/\(frontend\)/page.tsx
git commit -m "feat(homepage): implement homepage with Payload data

Replace placeholder homepage with full implementation:
- Fetch 7 most recent published articles
- Display featured article card (first article)
- Display article grid (remaining 6 articles)
- Show empty state when no articles
- Add CTA to Hub de Recherche

Related: Story 3.5 Phase 2"
```

---

## Commit 5: SEO Metadata

### Pre-Implementation
- [ ] Verifier que Commit 4 est complete

### Implementation

#### Ajouter `generateMetadata` dans `src/app/[locale]/(frontend)/page.tsx`

Ajouter au debut du fichier, apres les imports:

```typescript
import type { Metadata } from 'next'

// ... existing interfaces ...

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    fr: 'Accueil | sebc.dev',
    en: 'Home | sebc.dev',
  }

  const descriptions: Record<string, string> = {
    fr: "Blog technique sur l'IA, l'UX et l'ingenierie logicielle",
    en: 'Technical blog about AI, UX and software engineering',
  }

  const title = titles[locale] || titles.fr
  const description = descriptions[locale] || descriptions.fr

  return {
    title,
    description,
    alternates: {
      canonical: `https://sebc.dev/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sebc.dev/${locale}`,
      siteName: 'sebc.dev',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ... rest of the file ...
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [ ] `generateMetadata` fonction exportee
- [ ] Titles en FR et EN
- [ ] Descriptions en FR et EN
- [ ] Canonical URLs correctes
- [ ] hreflang alternates presentes
- [ ] OpenGraph metadata presente
- [ ] Twitter card metadata presente
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm lint` passe
- [ ] `pnpm build` passe

### Commit
```bash
git add src/app/[locale]/\(frontend\)/page.tsx
git commit -m "feat(seo): add homepage metadata for FR/EN

Add generateMetadata function with:
- Localized titles and descriptions
- hreflang alternates for FR/EN
- Canonical URLs
- OpenGraph metadata
- Twitter card metadata

Related: Story 3.5 Phase 2"
```

---

## Post-Phase Verification

```bash
# Full verification
pnpm exec tsc --noEmit
pnpm lint
pnpm build

# Manual testing
pnpm dev
# Visit localhost:3000/fr and localhost:3000/en
```

### Final Checklist
- [ ] Tous les 5 commits completes
- [ ] Homepage FR fonctionne
- [ ] Homepage EN fonctionne
- [ ] Empty state fonctionne (si applicable)
- [ ] Metadata correctes dans les devtools
- [ ] Pas d'erreurs console
