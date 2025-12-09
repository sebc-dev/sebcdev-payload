/**
 * ArticleHeader Component
 *
 * Displays article metadata in the page header:
 * - Category badge (clickable)
 * - Title (h1)
 * - Complexity badge
 * - Reading time + Publication date
 *
 * Server Component - composes Client Components (ComplexityBadge, RelativeDate)
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
      {article.category && (
        <CategoryBadge category={article.category} locale={locale} clickable={true} />
      )}

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
        <span aria-hidden="true" className="text-border">
          &bull;
        </span>

        {/* Publication Date */}
        <RelativeDate date={article.publishedAt} />
      </div>
    </header>
  )
}
