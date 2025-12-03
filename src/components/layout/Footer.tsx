import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

/**
 * Footer Component
 *
 * Site footer displaying:
 * - Brand name and tagline
 * - Secondary navigation links
 * - Copyright with dynamic year
 *
 * This is a Server Component - no client-side JS required.
 * Responsive design: centered on mobile, spread on desktop.
 *
 * @returns Footer element with semantic contentinfo role
 */
export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="mb-6 lg:mb-0">
            <p className="text-lg font-bold text-foreground">sebc.dev</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          {/* Navigation Links */}
          <nav className="mb-6 flex gap-6 lg:mb-0">
            <Link
              href="/articles"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('links.articles')}
            </Link>
            <a
              href="mailto:contact@sebc.dev"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('links.contact')}
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}
