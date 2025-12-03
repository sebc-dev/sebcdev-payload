'use client'

import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LanguageSwitcher } from './LanguageSwitcher'

/**
 * MobileMenu Component
 *
 * Hamburger menu that opens a Sheet panel with navigation links.
 * Visible only on mobile viewports (<1024px via lg:hidden).
 *
 * Features:
 * - Sheet slides in from right side
 * - All navigation links available
 * - Closes automatically when a link is clicked
 * - Includes language switcher
 * - Accessible: aria-label, focus management handled by Radix
 *
 * @returns Hamburger trigger button and Sheet with navigation
 */
export function MobileMenu() {
  const t = useTranslations('mobileMenu')
  const navT = useTranslations('navigation')
  const langT = useTranslations('language')

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent lg:hidden"
          aria-label={t('open')}
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-bold">sebc.dev</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4" aria-label={navT('main')}>
          <SheetClose asChild>
            <Link href="/" className="text-lg text-foreground transition-colors hover:text-primary">
              {navT('home')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/articles"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('articles')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/articles?category=all"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('categories')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/articles?level=all"
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              {navT('levels')}
            </Link>
          </SheetClose>
        </nav>
        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 text-sm text-muted-foreground">{langT('switch')}</p>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}
