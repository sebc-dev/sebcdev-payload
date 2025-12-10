/**
 * ArticleHero Component
 *
 * Full-width featured image for articles with priority loading for LCP optimization.
 * Supports blur placeholder for smooth loading experience.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/images
 */

import Image from 'next/image'
import type { CoverImage } from './types'

interface ArticleHeroProps {
  /** Cover image with full metadata */
  image: CoverImage
  /** Article title for fallback alt text */
  title: string
}

/**
 * ArticleHero - Full-width featured image for articles
 *
 * Features:
 * - Priority loading for LCP optimization
 * - Full-width on all breakpoints
 * - Blur placeholder support for smooth loading
 * - Responsive aspect ratios (taller on mobile, wider on desktop)
 */
export function ArticleHero({ image, title }: ArticleHeroProps) {
  return (
    <div className="relative mb-8 w-full overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9]">
        <Image
          src={image.url}
          alt={image.alt || `Featured image for ${title}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder={image.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={image.blurDataURL}
        />
      </div>
    </div>
  )
}
