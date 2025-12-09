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
  if (!tags || tags.length === 0) {
    return null
  }

  const t = await getTranslations('article')

  return (
    <footer className="pt-8 mt-8 border-t border-border">
      {/* Tags Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t('tagsLabel')}</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagPill key={tag.id} tag={tag} locale={locale} />
          ))}
        </div>
      </div>
    </footer>
  )
}
