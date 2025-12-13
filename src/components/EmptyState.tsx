import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { FileText, PenLine, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface EmptyStateProps {
  className?: string
  headingLevel?: HeadingLevel
  variant?: 'empty' | 'error'
}

/**
 * EmptyState Component
 *
 * Displays when no articles are published on the homepage or when an error occurs.
 * Shows a welcome message and conditionally displays a CTA
 * to create an article if the user is authenticated (empty variant),
 * or a retry button if there was an error (error variant).
 *
 * Authentication is determined by the presence of the
 * 'payload-token' cookie, which Payload CMS sets on login.
 *
 * @param className - Optional CSS classes to apply to the section
 * @param headingLevel - Semantic heading level for document hierarchy
 * @param variant - Display variant: 'empty' for no articles, 'error' for fetch failure
 */
export async function EmptyState({
  className,
  headingLevel = 'h2',
  variant = 'empty',
}: EmptyStateProps) {
  // Use different translation namespace based on variant
  const namespace = variant === 'error' ? 'homepage.errorState' : 'homepage.emptyState'
  const t = await getTranslations(namespace)
  const tCommon = await getTranslations('common')

  // Check authentication only when needed (empty variant shows auth-gated CTA)
  let isAuthenticated = false
  if (variant === 'empty') {
    const cookieStore = await cookies()
    isAuthenticated = cookieStore.has('payload-token')
  }

  // Select icon based on variant
  const Icon = variant === 'error' ? AlertCircle : FileText
  const iconColorClass = variant === 'error' ? 'text-destructive' : 'text-muted-foreground'

  return (
    <section
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
      aria-labelledby="empty-state-title"
      aria-live={variant === 'error' ? 'polite' : undefined}
    >
      {/* Icon - Changes based on variant */}
      <div className="mb-6 rounded-full bg-muted p-6">
        <Icon className={cn('h-12 w-12', iconColorClass)} aria-hidden="true" />
      </div>

      {/* Title - Heading level configurable for proper document hierarchy */}
      {(() => {
        const Heading = headingLevel
        return (
          <Heading id="empty-state-title" className="mb-2 text-2xl font-bold">
            {t('title')}
          </Heading>
        )
      })()}

      {/* Description */}
      <p className="mb-8 max-w-md text-muted-foreground">{t('description')}</p>

      {/* CTA - Different based on variant */}
      {variant === 'error' ? (
        // Error variant: Show retry button (uses native <a> tag to force page reload)
        <Button asChild variant="outline">
          <a href=".">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {tCommon('retry')}
          </a>
        </Button>
      ) : (
        // Empty variant: Show create article CTA (only if authenticated)
        isAuthenticated && (
          <Button asChild>
            <Link href="/admin/collections/posts/create">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              {t('cta')}
            </Link>
          </Button>
        )
      )}
    </section>
  )
}
