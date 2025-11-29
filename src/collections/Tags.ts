import type { CollectionConfig } from 'payload'

import { slugifyTaxonomy, validateTaxonomySlug } from '@/lib/validators'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
    listSearchableFields: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Tag display name (localized)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "javascript", "react-hooks")',
      },
      hooks: {
        beforeChange: [slugifyTaxonomy],
      },
      validate: (value: string | null | undefined) => validateTaxonomySlug(value, 'tag'),
    },
  ],
}
