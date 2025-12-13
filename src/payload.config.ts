// storage-adapter-import-placeholder
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite' // database-adapter-import
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users, Media, Categories, Tags, Articles } from '@/collections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// IMPORTANT: Remote D1 bindings require NODE_ENV=production
// - For migrations: NODE_ENV=production pnpm payload migrate
// - For dev mode: pnpm dev (uses local SQLite via Wrangler)
// - For production runtime: Cloudflare Workers sets NODE_ENV=production automatically
const cloudflareRemoteBindings = process.env.NODE_ENV === 'production'
const isGenerateTypes = process.argv.find((value) => value.match(/^generate:?/))
const cloudflare =
  isGenerateTypes || !cloudflareRemoteBindings
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Tags, Articles],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Add BlocksFeature to support custom blocks including code blocks
      BlocksFeature({
        blocks: [
          {
            slug: 'code',
            interfaceName: 'CodeBlock',
            fields: [
              {
                name: 'language',
                type: 'select',
                options: [
                  // JavaScript/TypeScript ecosystem
                  { label: 'JavaScript', value: 'javascript' },
                  { label: 'TypeScript', value: 'typescript' },
                  { label: 'TSX', value: 'tsx' },
                  { label: 'JSX', value: 'jsx' },

                  // Backend languages
                  { label: 'Python', value: 'python' },
                  { label: 'PHP', value: 'php' },
                  { label: 'Java', value: 'java' },
                  { label: 'C', value: 'c' },
                  { label: 'C++', value: 'cpp' },

                  // Web technologies
                  { label: 'HTML', value: 'html' },
                  { label: 'CSS', value: 'css' },
                  { label: 'GraphQL', value: 'graphql' },
                  { label: 'XML', value: 'xml' },

                  // Data & Configuration
                  { label: 'JSON', value: 'json' },
                  { label: 'SQL', value: 'sql' },
                  { label: 'YAML', value: 'yaml' },
                  { label: 'Markdown', value: 'markdown' },

                  // Shell
                  { label: 'Bash', value: 'bash' },
                ],
                defaultValue: 'javascript',
                required: true,
              },
              {
                name: 'code',
                type: 'textarea',
                required: true,
              },
            ],
          },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // i18n Configuration - Story 2.1 Phase 1
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  // database-adapter-config-start
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  // database-adapter-config-end
  plugins: [
    // storage-adapter-placeholder
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  // In CI or during type generation, skip wrangler initialization to avoid authentication requirements
  if (process.env.CI || process.argv.find((value) => value.match(/^generate:?/))) {
    // Return mock CloudflareContext for type generation
    return Promise.resolve({
      env: {} as CloudflareEnv,
      cf: undefined,
      ctx: {
        waitUntil: () => {},
        passThroughOnException: () => {},
        props: {},
      },
    })
  }

  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        // Force local mode to avoid requiring Cloudflare authentication in CI
        persist: true,
        // TODO: Check if remoteBindings option still exists in wrangler 4.54+
        // experimental: { remoteBindings: cloudflareRemoteBindings },
      } satisfies GetPlatformProxyOptions),
  )
}
