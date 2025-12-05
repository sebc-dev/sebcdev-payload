'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FrenchFlag, BritishFlag } from '@/components/icons/flags'

const locales = [
  { code: 'fr', Flag: FrenchFlag },
  { code: 'en', Flag: BritishFlag },
] as const

type LocaleCode = (typeof locales)[number]['code']

/**
 * LanguageSwitcher Component
 *
 * Dropdown menu for switching between French and English locales.
 * Displays country flags alongside language labels.
 * Preserves the current page path when switching.
 *
 * Features:
 * - Dropdown with flag icons for visual identification
 * - Visual indication of current locale (checkmark)
 * - Accessible with proper ARIA attributes
 * - Client-side navigation (no full page reload)
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes for the container
 * @returns Language dropdown menu
 */
interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as LocaleCode
  const t = useTranslations('language')
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = locales.find((l) => l.code === locale) ?? locales[0]
  const CurrentFlag = currentLocale.Flag

  const handleLocaleChange = (newLocale: LocaleCode) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 px-2" aria-label={t('switch')}>
            <CurrentFlag className="size-5 rounded-sm" />
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {locales.map(({ code, Flag }) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLocaleChange(code)}
              className="gap-3 cursor-pointer"
              aria-current={locale === code ? 'true' : undefined}
            >
              <Flag className="size-5 rounded-sm" />
              <span>{t(code)}</span>
              {locale === code && (
                <span className="ml-auto text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
