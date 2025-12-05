import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { FileText, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  locale: string
  className?: string
}

/**
 * EmptyState Component
 *
 * Displays when no articles are published on the homepage.
 * Shows a welcome message and conditionally displays a CTA
 * to create an article if the user is authenticated.
 *
 * Authentication is determined by the presence of the
 * 'payload-token' cookie, which Payload CMS sets on login.
 *
 * @param locale - Current locale (e.g., 'en', 'fr')
 * @param className - Optional CSS classes to apply to the section
 */
export async function EmptyState({ locale: _locale, className }: EmptyStateProps) {
  const t = await getTranslations('homepage.emptyState')

  // Check authentication via payload-token cookie
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.has('payload-token')

  return (
    <section
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
      aria-labelledby="empty-state-title"
    >
      {/* Icon - FileText in rounded container */}
      <div className="mb-6 rounded-full bg-muted p-6">
        <FileText className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Title */}
      <h1 id="empty-state-title" className="mb-2 text-2xl font-bold">
        {t('title')}
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-md text-muted-foreground">{t('description')}</p>

      {/* CTA - Only visible if authenticated */}
      {isAuthenticated && (
        <Button asChild>
          <Link href="/admin/collections/posts/create">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            {t('cta')}
          </Link>
        </Button>
      )}
    </section>
  )
}
