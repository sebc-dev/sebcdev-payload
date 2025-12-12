/**
 * HTML Escape Utility
 *
 * Escapes HTML special characters to prevent XSS attacks.
 * Used as fallback when syntax highlighting fails.
 */

/**
 * Escape HTML special characters for safe rendering
 *
 * Converts special characters to their HTML entity equivalents:
 * - & → &amp;
 * - < → &lt;
 * - > → &gt;
 * - " → &quot;
 * - ' → &#039;
 *
 * @param unsafe - String that may contain HTML special characters
 * @returns Escaped string safe for HTML rendering
 *
 * @example
 * ```tsx
 * escapeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
