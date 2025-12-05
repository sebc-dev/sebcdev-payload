import type { ImageLoaderProps } from 'next/image'

/**
 * Cloudflare Image Loader
 *
 * Custom image loader for Next.js to optimize images served from Cloudflare R2.
 * Handles both external R2 URLs and local relative URLs with width and quality parameters.
 *
 * Features:
 * - Supports Cloudflare R2 URLs (cloudflarestorage.com and r2.dev)
 * - Adds width and quality query parameters for R2 image resizing
 * - Fallback for non-R2 external URLs
 * - Support for local/relative URLs
 *
 * @param src - Image source URL (absolute or relative)
 * @param width - Requested image width in pixels
 * @param quality - Requested image quality (0-100), optional
 * @returns Optimized image URL with query parameters
 *
 * @example
 * // R2 URL
 * cloudflareImageLoader({
 *   src: 'https://mybucket.r2.cloudflarestorage.com/image.jpg',
 *   width: 640,
 *   quality: 75
 * })
 * // Returns: https://mybucket.r2.cloudflarestorage.com/image.jpg?width=640&quality=75
 *
 * @example
 * // Local URL
 * cloudflareImageLoader({
 *   src: '/images/cover.jpg',
 *   width: 640,
 *   quality: 75
 * })
 * // Returns: /images/cover.jpg?w=640&q=75
 */
function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Handle external URLs (http/https)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const url = new URL(src)

    // Check if this is a Cloudflare R2 URL
    if (url.hostname.includes('r2.cloudflarestorage.com') || url.hostname.includes('r2.dev')) {
      // Add Cloudflare image resizing parameters
      url.searchParams.set('width', width.toString())
      if (quality) {
        url.searchParams.set('quality', quality.toString())
      }
      return url.toString()
    }

    // For non-R2 external URLs, return as-is
    return src
  }

  // Handle local/relative URLs with query parameters
  return `${src}?w=${width}&q=${quality || 75}`
}

// Next.js requires a default export for custom image loaders
export default cloudflareImageLoader
