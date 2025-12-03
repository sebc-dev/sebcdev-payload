import { Logo } from './Logo'
import { Navigation } from './Navigation'
import { cn } from '@/lib/utils'

/**
 * Header Component
 *
 * Main header for the frontend application, combining:
 * - Logo (links to home)
 * - Desktop navigation menu
 * - Sticky positioning at the top of the viewport
 *
 * The header includes:
 * - Sticky positioning with z-index to stay above content
 * - Backdrop blur effect for modern appearance
 * - Responsive layout (mobile menu added in Phase 4)
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @returns Header element with logo and navigation
 */
interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />
        <Navigation />
        {/* Mobile menu trigger will be added in Phase 4 */}
        {/* Language switcher will be added in Phase 4 */}
      </div>
    </header>
  )
}
