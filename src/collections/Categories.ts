import type { CollectionConfig } from 'payload'

import { getLucideIconOptions } from '@/lib/lucide-icons'
import { isValidHexColor, slugifyTaxonomy, validateTaxonomySlug } from '@/lib/validators'

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
      validate: isValidHexColor,
    },
    {
      name: 'icon',
      type: 'select',
      options: getLucideIconOptions(),
      defaultValue: 'folder',
      admin: {
        description: 'Icon from Lucide library for visual identity',
        isClearable: true,
      },
    },
  ],
}
