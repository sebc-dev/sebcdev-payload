'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'

/**
 * LanguageSwitcher Component
 *
 * Toggles between French and English locales.
 * Preserves the current page path when switching.
 * Uses next-intl Link for locale-aware navigation.
 *
 * Features:
 * - Visual indication of current locale (primary color)
 * - Accessible with role="group" and aria-current
 * - Client-side navigation (no full page reload)
 *
 * @returns Language toggle buttons
 */
export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const pathname = usePathname()

  // Remove locale prefix from pathname for locale-aware Link
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, '') || '/'

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('switch')}>
      <Link
        href={pathnameWithoutLocale}
        locale="fr"
        className={`px-2 py-1 text-sm font-medium transition-colors ${
          locale === 'fr' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-current={locale === 'fr' ? 'true' : undefined}
      >
        {t('fr')}
      </Link>
      <span className="text-muted-foreground">/</span>
      <Link
        href={pathnameWithoutLocale}
        locale="en"
        className={`px-2 py-1 text-sm font-medium transition-colors ${
          locale === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        {t('en')}
      </Link>
    </div>
  )
}
