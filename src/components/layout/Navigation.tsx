'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Navigation Component
 *
 * Provides the main desktop navigation menu with:
 * - Direct link to Articles
 * - Dropdown menu for Categories (content types)
 * - Dropdown menu for Themes (subject areas)
 * - Dropdown menu for Difficulty Levels
 *
 * Uses DropdownMenu from shadcn/ui for accessible dropdown behavior.
 * Hidden on mobile (lg:flex) - mobile navigation handled in Phase 4.
 *
 * @returns Navigation menu for desktop screens
 */

const categories = ['news', 'deep-dive', 'tutorial', 'case-study', 'feedback'] as const
const themes = ['ai', 'ux', 'engineering'] as const
const levels = ['beginner', 'intermediate', 'advanced'] as const

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const t = useTranslations('navigation')
  const a11yT = useTranslations('accessibility')
  const pathname = usePathname()

  /**
   * Determine if a path is the currently active page
   * Checks both exact match and prefix match (for nested pages)
   */
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <nav
      className={cn('hidden lg:flex items-center gap-1', className)}
      aria-label={a11yT('mainNavigation')}
    >
      {/* Articles Link */}
      <Link
        href="/articles"
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive('/articles')
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent',
        )}
      >
        {t('articles')}
      </Link>

      {/* Themes Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          {t('themes')}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {themes.map((theme) => (
            <DropdownMenuItem key={theme} asChild>
              <Link href={`/articles?tags=${theme}`}>{t(`theme.${theme}`)}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          {t('categories')}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {categories.map((category) => (
            <DropdownMenuItem key={category} asChild>
              <Link href={`/articles?category=${category}`}>{t(`category.${category}`)}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Levels Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          {t('levels')}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/articles">{t('allLevels')}</Link>
          </DropdownMenuItem>
          {levels.map((level) => (
            <DropdownMenuItem key={level} asChild>
              <Link href={`/articles?complexity=${level}`}>{t(`level.${level}`)}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
