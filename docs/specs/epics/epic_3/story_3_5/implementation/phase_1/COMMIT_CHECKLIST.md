# Phase 1: Commit Checklist - Composants Atomiques

**Story**: 3.5 - Homepage Implementation
**Phase**: 1 of 3

---

## How to Use This Checklist

Pour chaque commit:
1. Lire la section correspondante
2. Implementer les changements
3. Cocher chaque item de validation
4. Executer les commandes de verification
5. Creer le commit avec le message fourni

---

## Commit 1: i18n Keys

### Pre-Implementation
- [ ] Lire les fichiers `messages/fr.json` et `messages/en.json` existants
- [ ] Verifier la structure JSON actuelle

### Implementation
- [ ] Ajouter la section `homepage` dans `messages/fr.json`
- [ ] Ajouter la section `article` dans `messages/fr.json`
- [ ] Ajouter la section `homepage` dans `messages/en.json`
- [ ] Ajouter la section `article` dans `messages/en.json`

### Validation Commands
```bash
# Verifier le JSON valide
pnpm exec tsc --noEmit

# Verifier le build
pnpm build
```

### Checklist
- [ ] JSON syntaxiquement valide (pas d'erreur de parsing)
- [ ] Toutes les cles presentes en FR et EN
- [ ] Placeholders `{minutes}` et `{time}` corrects
- [ ] `pnpm build` passe sans erreur

### Commit
```bash
git add messages/fr.json messages/en.json
git commit -m "feat(i18n): add homepage and article translation keys

Add FR/EN translation keys for:
- Homepage section titles and CTAs
- Article complexity levels
- Reading time format
- Empty state messages

Related: Story 3.5 Phase 1"
```

---

## Commit 2: CategoryBadge

### Pre-Implementation
- [ ] Verifier que `Badge` de shadcn/ui est installe
- [ ] Creer le dossier `src/components/articles/` si necessaire

### Implementation

#### Creer `src/components/articles/CategoryBadge.tsx`
```typescript
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  title: string
  slug: string
  color?: string
  icon?: string
}

interface CategoryBadgeProps {
  category: Category
  locale: string
  clickable?: boolean
  className?: string
}

export function CategoryBadge({
  category,
  locale,
  clickable = true,
  className,
}: CategoryBadgeProps) {
  const style = category.color
    ? { backgroundColor: `${category.color}20`, color: category.color }
    : {}

  const badge = (
    <Badge
      variant="secondary"
      className={cn('gap-1.5 transition-colors', className)}
      style={style}
    >
      {category.icon && <span aria-hidden="true">{category.icon}</span>}
      {category.title}
    </Badge>
  )

  if (!clickable) return badge

  return (
    <Link
      href={`/${locale}/articles?category=${category.slug}`}
      className="transition-opacity hover:opacity-80"
    >
      {badge}
    </Link>
  )
}
```

#### Creer `src/components/articles/index.ts`
```typescript
export { CategoryBadge } from './CategoryBadge'
```

### Validation Commands
```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```

### Checklist
- [ ] Fichier `CategoryBadge.tsx` cree
- [ ] Fichier `index.ts` cree avec export
- [ ] Interface `Category` definie
- [ ] Props `clickable` avec default `true`
- [ ] `aria-hidden` sur l'icone
- [ ] Couleur dynamique via style inline
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm lint` passe
- [ ] `pnpm build` passe

### Commit
```bash
git add src/components/articles/
git commit -m "feat(components): add CategoryBadge component

Create CategoryBadge component that displays:
- Category icon and title
- Dynamic background color based on category
- Clickable link to Hub with category filter

Related: Story 3.5 Phase 1"
```

---

## Commit 3: ComplexityBadge & TagPill

### Pre-Implementation
- [ ] Verifier que le commit 2 est complete
- [ ] Verifier les couleurs dans UX_UI_Spec.md

### Implementation

#### Creer `src/components/articles/ComplexityBadge.tsx`
```typescript
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Complexity = 'beginner' | 'intermediate' | 'advanced'

interface ComplexityBadgeProps {
  level: Complexity
  className?: string
}

const COMPLEXITY_CONFIG: Record<Complexity, { emoji: string; classes: string }> = {
  beginner: {
    emoji: '\uD83D\uDCD7', // Green book
    classes: 'bg-green-600/20 text-green-400 border-green-600/30',
  },
  intermediate: {
    emoji: '\uD83D\uDCD5', // Orange book
    classes: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  },
  advanced: {
    emoji: '\uD83D\uDCD8', // Blue book (for advanced/expert)
    classes: 'bg-red-600/20 text-red-400 border-red-600/30',
  },
}

export function ComplexityBadge({ level, className }: ComplexityBadgeProps) {
  const t = useTranslations('article.complexity')
  const config = COMPLEXITY_CONFIG[level]

  return (
    <Badge
      variant="outline"
      className={cn(config.classes, className)}
    >
      <span className="mr-1" aria-hidden="true">{config.emoji}</span>
      {t(level)}
    </Badge>
  )
}
```

#### Creer `src/components/articles/TagPill.tsx`
```typescript
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Tag {
  id: string
  title: string
  slug: string
}

interface TagPillProps {
  tag: Tag
  locale: string
  className?: string
}

export function TagPill({ tag, locale, className }: TagPillProps) {
  return (
    <Link
      href={`/${locale}/articles?tags=${tag.slug}`}
      className="transition-opacity hover:opacity-80"
      onClick={(e) => e.stopPropagation()} // Prevent card click
    >
      <Badge
        variant="outline"
        className={cn(
          'bg-muted/50 text-muted-foreground hover:bg-muted',
          className
        )}
      >
        {tag.title}
      </Badge>
    </Link>
  )
}
```

#### Mettre a jour `src/components/articles/index.ts`
```typescript
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [ ] `ComplexityBadge.tsx` cree avec les 3 niveaux
- [ ] Couleurs correctes (green/orange/red)
- [ ] Emojis corrects (book emojis)
- [ ] Traductions utilisees via `useTranslations`
- [ ] `TagPill.tsx` cree
- [ ] `stopPropagation` pour eviter le click parent
- [ ] `index.ts` mis a jour avec les 3 exports
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm lint` passe
- [ ] `pnpm build` passe

### Commit
```bash
git add src/components/articles/
git commit -m "feat(components): add ComplexityBadge and TagPill components

Create ComplexityBadge with:
- Color-coded levels (green/orange/red)
- Translated labels (FR/EN)
- Emoji per complexity level

Create TagPill with:
- Clickable navigation to Hub with tag filter
- stopPropagation to prevent parent click
- Subtle hover effect

Related: Story 3.5 Phase 1"
```

---

## Commit 4: RelativeDate

### Pre-Implementation
- [ ] Verifier que next-intl est configure
- [ ] Comprendre `useFormatter` de next-intl

### Implementation

#### Creer `src/components/RelativeDate.tsx`
```typescript
'use client'

import { useFormatter } from 'next-intl'
import { cn } from '@/lib/utils'

interface RelativeDateProps {
  date: string | Date
  className?: string
}

export function RelativeDate({ date, className }: RelativeDateProps) {
  const format = useFormatter()
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const relativeTime = format.relativeTime(dateObj)
  const fullDate = format.dateTime(dateObj, {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  return (
    <time
      dateTime={dateObj.toISOString()}
      className={cn('tabular-nums', className)}
      title={fullDate}
    >
      {relativeTime}
    </time>
  )
}
```

#### Mettre a jour `src/components/articles/index.ts`
```typescript
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
export { RelativeDate } from '../RelativeDate'
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [ ] `'use client'` directive presente
- [ ] `useFormatter` de next-intl utilise
- [ ] Element `<time>` semantique
- [ ] Attribut `dateTime` au format ISO 8601
- [ ] Attribut `title` avec date complete
- [ ] Type union `string | Date` supporte
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm lint` passe
- [ ] `pnpm build` passe

### Commit
```bash
git add src/components/RelativeDate.tsx src/components/articles/index.ts
git commit -m "feat(components): add RelativeDate client component

Create RelativeDate component that:
- Displays localized relative time (FR/EN)
- Uses next-intl formatter for consistency
- Shows full date on hover via title attribute
- Uses semantic <time> element with datetime

Related: Story 3.5 Phase 1"
```

---

## Commit 5: ArticleCard

### Pre-Implementation
- [ ] Verifier que tous les commits precedents sont completes
- [ ] Verifier que `Card` de shadcn/ui est installe
- [ ] Si non, executer: `pnpm dlx shadcn@latest add card`

### Implementation

#### Creer `src/components/articles/ArticleCard.tsx`
```typescript
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

interface ArticleCardProps {
  article: Article
  locale: string
  className?: string
}

export async function ArticleCard({ article, locale, className }: ArticleCardProps) {
  const t = await getTranslations('homepage')

  return (
    <article className={cn('group', className)}>
      <Link
        href={`/${locale}/articles/${article.slug}`}
        className="block h-full"
      >
        <Card className={cn(
          'h-full overflow-hidden transition-all duration-200',
          'hover:shadow-lg hover:scale-[1.02]',
          'focus-within:ring-2 focus-within:ring-primary'
        )}>
          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={article.coverImage.url}
                alt={article.coverImage.alt || article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          )}

          <CardHeader className="space-y-2 pb-2">
            {/* Category Badge */}
            <div onClick={(e) => e.preventDefault()}>
              <CategoryBadge
                category={article.category}
                locale={locale}
                clickable={true}
              />
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Excerpt */}
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {article.excerpt}
            </p>

            {/* Metadata Row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t('minRead', { minutes: article.readingTime })}</span>
              <span aria-hidden="true">-</span>
              <RelativeDate date={article.publishedAt} />
            </div>

            {/* Complexity Badge */}
            <ComplexityBadge level={article.complexity} />

            {/* Tags (max 3) */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5" onClick={(e) => e.preventDefault()}>
                {article.tags.slice(0, 3).map((tag) => (
                  <TagPill
                    key={tag.id}
                    tag={tag}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
```

#### Mettre a jour `src/components/articles/index.ts`
```typescript
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
export { RelativeDate } from '../RelativeDate'
export { ArticleCard } from './ArticleCard'
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### Checklist
- [ ] `ArticleCard.tsx` cree comme async Server Component
- [ ] Interface `Article` complete
- [ ] Image avec `next/image` et `sizes` attribute
- [ ] Hover effects sur carte et image
- [ ] `line-clamp` sur titre et extrait
- [ ] Tags limites a 3 avec `slice(0, 3)`
- [ ] Element `<article>` semantique
- [ ] `focus-within` ring pour accessibilite
- [ ] `index.ts` mis a jour
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm lint` passe
- [ ] `pnpm build` passe

### Commit
```bash
git add src/components/articles/ src/components/ui/card.tsx
git commit -m "feat(components): add ArticleCard component

Create ArticleCard that composes:
- Cover image with hover zoom effect
- CategoryBadge (clickable)
- Title with line-clamp and hover color
- Excerpt with line-clamp
- Reading time and relative date
- ComplexityBadge
- TagPills (max 3)

Implements hover effects per UX_UI_Spec.md:
- Card scale 1.02 + shadow on hover
- Image scale 1.05 on hover
- Focus ring for keyboard navigation

Related: Story 3.5 Phase 1"
```

---

## Post-Phase Verification

Apres tous les commits, verifier:

```bash
# Full type check
pnpm exec tsc --noEmit

# Full lint
pnpm lint

# Full build
pnpm build

# Run unit tests
pnpm test:unit
```

### Final Checklist
- [ ] Tous les 5 commits sont faits
- [ ] Tous les fichiers sont crees/modifies comme prevu
- [ ] Pas d'erreur TypeScript
- [ ] Pas d'erreur lint
- [ ] Build passe
- [ ] Tests unitaires passent (si existants)
