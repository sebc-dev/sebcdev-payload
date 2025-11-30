import type { CollectionConfig } from 'payload'

import { calculateReadingTime } from '@/hooks'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    group: 'Content',
  },
  hooks: {
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
  ],
}
