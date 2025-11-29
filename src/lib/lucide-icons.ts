/**
 * Curated list of Lucide icons for blog categories.
 * See https://lucide.dev/icons/ for full icon reference.
 *
 * This list focuses on icons commonly used for blog/content categorization.
 * To add more icons, consult the official Lucide documentation.
 */

export const LUCIDE_CATEGORY_ICONS = [
  'newspaper',
  'book',
  'book-open',
  'file-text',
  'code',
  'code-xml',
  'terminal',
  'cpu',
  'database',
  'server',
  'cloud',
  'sparkles',
  'lightbulb',
  'rocket',
  'beaker',
  'wrench',
  'settings',
  'layers',
  'package',
  'puzzle',
  'zap',
  'target',
  'compass',
  'map',
  'pencil',
  'pen-tool',
  'paintbrush',
  'palette',
  'image',
  'monitor',
  'smartphone',
  'tablet',
  'laptop',
  'graduation-cap',
  'award',
  'star',
  'heart',
  'bookmark',
  'tag',
  'folder',
  'briefcase',
  'megaphone',
  'message-circle',
  'users',
  'user',
  'globe',
  'shield',
  'lock',
  'key',
  'bug',
  'git-branch',
  'git-commit',
  'github',
  'gitlab',
  'inbox',
  'mail',
  'calendar',
  'clock',
  'trending-up',
  'bar-chart',
  'pie-chart',
  'activity',
  'alert-circle',
  'info',
  'help-circle',
  'check-circle',
  'x-circle',
  'play-circle',
  'flame',
  'coffee',
  'construction',
] as const

/**
 * TypeScript type representing valid Lucide category icon names.
 */
export type LucideCategoryIcon = (typeof LUCIDE_CATEGORY_ICONS)[number]

/**
 * Validates that a string is a valid Lucide category icon identifier.
 * Allows null/undefined values (returns true) for optional icon fields.
 *
 * @param value The icon identifier to validate
 * @returns true if valid or null/undefined, error message string if invalid
 *
 * @example
 * isValidLucideIcon('newspaper') // true
 * isValidLucideIcon('book-open') // true
 * isValidLucideIcon(null) // true
 * isValidLucideIcon('invalid-icon') // 'Please select a valid icon...'
 */
export function isValidLucideIcon(value: string | null | undefined): true | string {
  if (!value) return true
  return (
    (LUCIDE_CATEGORY_ICONS as readonly string[]).includes(value) ||
    'Please select a valid icon from the available options'
  )
}

/**
 * Returns the icon list formatted for Payload CMS select field options.
 */
export function getLucideIconOptions() {
  return LUCIDE_CATEGORY_ICONS.map((icon) => ({
    label: icon
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: icon,
  }))
}
