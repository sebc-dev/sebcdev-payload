import type { CollectionConfig } from 'payload'

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
        beforeChange: [
          ({ value }) => {
            if (!value) return value
            return value
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
              .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
              .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
              .replace(/-+/g, '-') // Collapse multiple hyphens
          },
        ],
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        return (
          slugRegex.test(value) ||
          'Slug must contain only lowercase letters, numbers, and hyphens (e.g., "my-tag-name")'
        )
      },
    },
  ],
}
