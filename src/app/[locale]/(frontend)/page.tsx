import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import config from '@/payload.config'

/**
 * Homepage component with locale support.
 *
 * Migrated from src/app/(frontend)/page.tsx with added:
 * - Locale parameter handling
 * - Static rendering via setRequestLocale
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('components')
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-between p-6 sm:p-11">
      <div className="flex flex-grow flex-col items-center justify-center">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && (
          <h1 className="my-6 text-center text-3xl font-bold sm:my-10 sm:text-4xl lg:text-5xl">
            Welcome to your new project.
          </h1>
        )}
        {user && (
          <h1 className="my-6 text-center text-3xl font-bold sm:my-10 sm:text-4xl lg:text-5xl">
            Welcome back, {user.email}
          </h1>
        )}
        <div className="flex items-center gap-3">
          <a
            className="rounded bg-foreground px-3 py-1.5 text-background no-underline transition-colors hover:bg-foreground/90"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="rounded border border-border bg-background px-3 py-1.5 text-foreground no-underline transition-colors hover:bg-muted"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">{t('buttons.title')}</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>
      <div className="mt-8 flex flex-col items-center gap-2 lg:flex-row">
        <p className="m-0 text-muted-foreground">Update this page by editing</p>
        <a className="rounded bg-muted px-2 py-0.5 font-mono text-sm no-underline" href={fileURL}>
          <code>app/[locale]/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
