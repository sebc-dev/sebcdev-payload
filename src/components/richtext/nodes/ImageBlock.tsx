/**
 * ImageBlock Component
 *
 * Renders Lexical upload nodes as optimized images using next/image.
 * Supports captions via figcaption and handles missing URLs gracefully.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/images
 */

import Image from 'next/image'
import type { UploadNode } from '../types'

interface ImageBlockProps {
  node: UploadNode
}

/**
 * Type guard for populated Media object
 */
function isPopulatedMedia(
  value: UploadNode['value'],
): value is { id: number | string; url?: string; alt?: string; width?: number; height?: number } {
  return typeof value === 'object' && value !== null && 'url' in value
}

/**
 * ImageBlock - Renders Lexical upload nodes as optimized images
 *
 * Features:
 * - Uses next/image for optimization with Cloudflare loader
 * - Supports captions via figcaption
 * - Responsive sizing with proper aspect ratio
 * - Accessibility via alt text
 * - Handles unpopulated and populated Media references
 */
export function ImageBlock({ node }: ImageBlockProps) {
  const { value, fields } = node

  // Check if value is populated (object with url) or unpopulated (just ID)
  if (!isPopulatedMedia(value)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[ImageBlock] Upload node value is not populated (missing url). Ensure depth >= 1 when fetching.',
      )
    }
    return null
  }

  // Validate URL exists
  if (!value.url) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ImageBlock] Populated media missing URL')
    }
    return null
  }

  const { url, alt, width = 800, height = 450 } = value

  // Extract caption from fields if available
  const caption = fields?.caption as string | undefined

  // Compute alt: explicit alt > caption > empty (decorative)
  const computedAlt = typeof alt === 'string' && alt.trim() ? alt : (caption ?? '')

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={url}
          alt={computedAlt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
