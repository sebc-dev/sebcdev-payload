'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
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
import { categories, levels, themes } from '@/lib/constants'
import { cn } from '@/lib/utils'

type SubMenu = 'themes' | 'categories' | 'levels' | null

/**
 * MobileMenu Component
 *
 * Hamburger menu that opens a full-screen Sheet panel with navigation links.
 * Visible only on mobile viewports (<1024px via lg:hidden).
 *
 * Features:
 * - Full-screen sheet slides in from right side
 * - Animated stagger effect on menu items
 * - Expandable sub-menus for Themes, Categories, and Levels
 * - Slide animation between main menu and sub-menus
 * - Closes automatically when a link is clicked
 * - Includes language switcher
 * - Accessible: aria-label, focus management handled by Radix
 *
 * @returns Hamburger trigger button and Sheet with navigation
 */
export function MobileMenu() {
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>(null)
  const t = useTranslations('mobileMenu')
  const navT = useTranslations('navigation')
  const langT = useTranslations('language')
  const a11yT = useTranslations('accessibility')

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveSubMenu(null)
    }
  }

  const subMenuItems = {
    themes: themes.map((theme) => ({
      key: theme,
      label: navT(`theme.${theme}`),
      href: `/articles?tags=${theme}`,
    })),
    categories: categories.map((category) => ({
      key: category,
      label: navT(`category.${category}`),
      href: `/articles?category=${category}`,
    })),
    levels: levels.map((level) => ({
      key: level,
      label: navT(`level.${level}`),
      href: `/articles?complexity=${level}`,
    })),
  }

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent lg:hidden"
          aria-label={t('open')}
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-full overflow-hidden border-l-0 px-6"
        closeLabel={t('close')}
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold">sebc.dev</SheetTitle>
        </SheetHeader>

        <div className="relative mt-12 h-[calc(100%-8rem)]">
          {/* Main Menu */}
          <nav
            className={cn(
              'flex flex-col items-center gap-6 transition-all duration-300 ease-in-out',
              activeSubMenu ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100',
            )}
            aria-label={a11yT('mainNavigation')}
            aria-hidden={activeSubMenu !== null}
          >
            <SheetClose asChild>
              <Link
                href="/"
                className="animate-menu-item text-2xl font-medium text-foreground transition-colors hover:text-primary"
              >
                {navT('home')}
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/articles"
                className="animate-menu-item text-2xl font-medium text-foreground transition-colors hover:text-primary"
              >
                {navT('articles')}
              </Link>
            </SheetClose>

            {/* Themes - with submenu */}
            <button
              type="button"
              onClick={() => setActiveSubMenu('themes')}
              className="animate-menu-item flex items-center gap-2 text-2xl font-medium text-foreground transition-colors hover:text-primary"
              aria-expanded={activeSubMenu === 'themes'}
              aria-haspopup="true"
            >
              {navT('themes')}
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Categories - with submenu */}
            <button
              type="button"
              onClick={() => setActiveSubMenu('categories')}
              className="animate-menu-item flex items-center gap-2 text-2xl font-medium text-foreground transition-colors hover:text-primary"
              aria-expanded={activeSubMenu === 'categories'}
              aria-haspopup="true"
            >
              {navT('categories')}
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Levels - with submenu */}
            <button
              type="button"
              onClick={() => setActiveSubMenu('levels')}
              className="animate-menu-item flex items-center gap-2 text-2xl font-medium text-foreground transition-colors hover:text-primary"
              aria-expanded={activeSubMenu === 'levels'}
              aria-haspopup="true"
            >
              {navT('levels')}
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="animate-menu-item mt-6 flex flex-col items-center border-t border-border pt-8">
              <p className="mb-4 text-sm text-muted-foreground">{langT('switch')}</p>
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Sub-menus */}
          {(['themes', 'categories', 'levels'] as const).map((menu) => (
            <div
              key={menu}
              className={cn(
                'absolute inset-0 flex flex-col items-center transition-all duration-300 ease-in-out',
                activeSubMenu === menu
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-full opacity-0 pointer-events-none',
              )}
              aria-hidden={activeSubMenu !== menu}
            >
              {/* Back button */}
              <button
                type="button"
                onClick={() => setActiveSubMenu(null)}
                className="mb-8 flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-label={t('back')}
              >
                <ChevronLeft className="h-5 w-5" />
                {navT(menu)}
              </button>

              {/* Sub-menu items */}
              <div className="flex flex-col items-center gap-5">
                {subMenuItems[menu].map((item, index) => (
                  <SheetClose asChild key={item.key}>
                    <Link
                      href={item.href}
                      className="text-xl font-medium text-foreground transition-colors hover:text-primary"
                      style={{
                        animation:
                          activeSubMenu === menu
                            ? `menu-item-in 0.4s ease-out ${0.05 + index * 0.05}s forwards`
                            : 'none',
                        opacity: activeSubMenu === menu ? 0 : 1,
                      }}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
