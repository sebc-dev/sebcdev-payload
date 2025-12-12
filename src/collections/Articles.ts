import type { Access, CollectionConfig } from 'payload'

import { calculateReadingTime, ensurePublishedAt } from '@/hooks'

/**
 * Access control: Allow read for published articles only (public)
 * Authenticated users can read all articles
 */
const isPublishedOrAuthenticated: Access = ({ req: { user } }) => {
  // Authenticated users can read all articles
  if (user) {
    return true
  }

  // Anonymous users can only read published articles with publishedAt in the past
  return {
    and: [
      { status: { equals: 'published' } },
      { publishedAt: { less_than_equal: new Date().toISOString() } },
    ],
  }
}

/**
 * Access control: Only authenticated users
 */
const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  access: {
    read: isPublishedOrAuthenticated,
    readVersions: isPublishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'complexity', 'publishedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data, locale }) => {
        const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(
          /\/+$/,
          '',
        )
        // locale peut être une chaîne de caractères ou un objet Locale avec une propriété 'code'
        const localeCode = typeof locale === 'string' ? locale : locale?.code || 'fr'
        const slug = data?.slug || ''

        if (!slug) return ''

        return `${baseUrl}/${localeCode}/articles/${slug}`
      },
      breakpoints: [
        { name: 'mobile', width: 375, height: 667, label: 'Mobile' },
        { name: 'tablet', width: 768, height: 1024, label: 'Tablet' },
        { name: 'desktop', width: 1440, height: 900, label: 'Desktop' },
      ],
    },
  },
  hooks: {
    beforeValidate: [ensurePublishedAt],
    beforeChange: [calculateReadingTime],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Article title (localized to FR/EN)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Article content using Lexical editor (localized to FR/EN)',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief excerpt of the article (localized to FR/EN)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: string | null | undefined) => {
        if (!value) return true // Required validation handles empty values

        // Pattern: lowercase letters, numbers, hyphens only
        // No leading/trailing hyphens, no consecutive hyphens, no spaces
        const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

        if (!slugPattern.test(value)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens. No leading/trailing hyphens, no consecutive hyphens, no spaces.'
        }

        return true
      },
      admin: {
        description:
          'URL-friendly identifier. Use lowercase letters, numbers, and hyphens only (e.g., "mon-premier-article"). No spaces or special characters.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional featured image for article display',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Article category classification',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Multiple tags for article categorization',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Article author',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
          admin: {
            description: 'Meta title for search engines and social sharing (localized)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Meta description for search engines (localized)',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Date when article was published',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        description: 'Publication status of the article',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Reading time calculated automatically (minutes)',
      },
    },
    {
      name: 'complexity',
      type: 'select',
      options: [
        {
          label: 'Beginner',
          value: 'beginner',
        },
        {
          label: 'Intermediate',
          value: 'intermediate',
        },
        {
          label: 'Advanced',
          value: 'advanced',
        },
      ],
      defaultValue: 'intermediate',
      required: true,
      admin: {
        description: 'Difficulty level of the article',
      },
    },
  ],
}
