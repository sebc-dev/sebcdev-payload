import type { CollectionConfig } from 'payload'

import { slugifyTaxonomy, validateTaxonomySlug } from '@/lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color'],
    group: 'Content',
    listSearchableFields: ['name', 'slug', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Category display name (localized)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "actualites", "tutoriel")',
      },
      hooks: {
        beforeChange: [slugifyTaxonomy],
      },
      validate: (value: string | null | undefined) => validateTaxonomySlug(value, 'category'),
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description of the category (localized)',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code for visual identity (e.g., "#FF5733")',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        return hexRegex.test(value) || 'Please enter a valid hex color (e.g., "#FF5733")'
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon identifier for visual identity (e.g., "newspaper", "book")',
      },
    },
  ],
}
