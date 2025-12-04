import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

/**
 * Logo Component
 *
 * Displays the site logo image with "sebc.dev" brand text that links to the home page.
 * Uses locale-aware routing to ensure proper locale prefix in URLs.
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @returns A Link element styled as the site logo with icon and text
 */
interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors',
        className,
      )}
    >
      <Image src="/logo_circle.svg" alt="" width={40} height={40} aria-hidden="true" />
      <span className="font-mono bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        sebc.dev
      </span>
    </Link>
  )
}
