/**
 * Cloudflare Image Loader
 *
 * Custom image loader for Next.js to optimize images served from Cloudflare R2.
 *
 * @param {Object} props - Image loader props
 * @param {string} props.src - Image source URL
 * @param {number} props.width - Requested width
 * @param {number} [props.quality] - Requested quality (0-100)
 * @returns {string} Optimized image URL
 */
export default function cloudflareImageLoader({ src, width, quality }) {
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
