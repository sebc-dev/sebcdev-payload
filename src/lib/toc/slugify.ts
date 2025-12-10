/**
 * Slugify Utility
 *
 * Generates URL-friendly slugs from text strings.
 * Used for heading IDs in both Heading.tsx and TOC extraction.
 *
 * IMPORTANT: This must produce identical output to the original
 * slugify in Heading.tsx to ensure ID matching.
 */

/**
 * Generate URL-friendly slug from text
 *
 * @param text - The text to slugify
 * @returns URL-friendly slug
 *
 * @example
 * slugify("Hello World") // "hello-world"
 * slugify("Cafe Resume") // "cafe-resume"
 * slugify("  Multiple   Spaces  ") // "multiple-spaces"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
}
