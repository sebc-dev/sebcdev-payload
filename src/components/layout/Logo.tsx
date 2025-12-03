import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

/**
 * Logo Component
 *
 * Displays the "sebc.dev" brand text that links to the home page.
 * Uses locale-aware routing to ensure proper locale prefix in URLs.
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @returns A Link element styled as the site logo
 */
interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'text-xl font-bold text-foreground hover:text-primary transition-colors',
        className,
      )}
    >
      sebc.dev
    </Link>
  )
}
