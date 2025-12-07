import { XIcon } from '@/components/icons/social'
import { Link } from '@/i18n/navigation'
import { categories, levels, themes } from '@/lib/constants'
import { FacebookIcon, LinkedinIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/sebc.dev', icon: FacebookIcon },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/sebcdev', icon: LinkedinIcon },
  { name: 'X', href: 'https://x.com/sebcdev', icon: XIcon },
] as const

const legalLinks = ['privacy', 'terms-of-use', 'terms', 'sitemap'] as const

/**
 * Footer Component
 *
 * Site footer displaying:
 * - Themes navigation (subject areas)
 * - Categories navigation (content types)
 * - Levels navigation (difficulty)
 * - Brand name, contact and social links
 * - Bottom bar with copyright, legal links and language switcher
 *
 * This is a Server Component - no client-side JS required.
 * Responsive design: stacked on mobile, 2x2 on tablet, 4 columns on desktop.
 *
 * @returns Footer element with semantic contentinfo role
 */
export async function Footer() {
  const [t, taxonomyT, a11yT] = await Promise.all([
    getTranslations('footer'),
    getTranslations('taxonomy'),
    getTranslations('accessibility'),
  ])
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Main Footer Content - 4 columns on desktop, 2x2 on tablet */}
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:text-left lg:grid-cols-4">
          {/* Themes Column */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">{t('sections.themes')}</h2>
            <nav className="flex flex-col gap-2" aria-label={a11yT('footerThemesNav')}>
              {themes.map((theme) => (
                <Link
                  key={theme}
                  href={`/articles?tags=${theme}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {taxonomyT(`theme.${theme}`)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories Column */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {t('sections.categories')}
            </h2>
            <nav className="flex flex-col gap-2" aria-label={a11yT('footerCategoriesNav')}>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/articles?category=${category}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {taxonomyT(`category.${category}`)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Levels Column */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">{t('sections.levels')}</h2>
            <nav className="flex flex-col gap-2" aria-label={a11yT('footerLevelsNav')}>
              {levels.map((level) => (
                <Link
                  key={level}
                  href={`/articles?complexity=${level}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {taxonomyT(`level.${level}`)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Brand Section */}
          <div>
            <p className="text-lg font-bold text-foreground">sebc.dev</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('tagline')}</p>
            <a
              href="mailto:contact@sebc.dev"
              className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              contact@sebc.dev
            </a>
            {/* Social Links */}
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Links (left) | Copyright (right) */}
        <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-border pt-6 md:flex-row md:justify-between">
          {/* Legal Links - Left */}
          <nav
            className="flex flex-wrap justify-center gap-4 md:justify-start"
            aria-label={t('sections.legal')}
          >
            {legalLinks.map((link) => (
              <Link
                key={link}
                href={`/${link}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(`legal.${link}`)}
              </Link>
            ))}
          </nav>

          {/* Copyright - Right */}
          <p className="text-xs text-muted-foreground">{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}
