/**
 * Article Not Found Page
 *
 * Displayed when an article with the given slug doesn't exist.
 * Provides helpful navigation back to homepage.
 */

import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ArticleNotFound() {
  const locale = await getLocale()
  const t = await getTranslations('article.notFound')

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Icon */}
        <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground" aria-hidden="true" />

        {/* Title */}
        <h1 className="text-2xl font-bold">{t('title')}</h1>

        {/* Description */}
        <p className="text-muted-foreground">{t('description')}</p>

        {/* CTA */}
        <Button asChild>
          <Link href={`/${locale}`}>{t('backToHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
