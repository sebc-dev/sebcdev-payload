/**
 * Allowed R2 bucket hostnames for image optimization (prevents SSRF)
 */
const ALLOWED_R2_HOSTS = new Set(['pub-0d00b88484b3494192ddce7103e3d06d.r2.dev'])

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

    // Validate hostname against allowed R2 bucket
    if (ALLOWED_R2_HOSTS.has(url.hostname)) {
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
