# Phase 4 - Implementation Plan

**Phase**: Image Rendering & Advanced Styling
**Story**: 4.1 - Rendu Article & MDX
**Estimated Duration**: 2.5-3 hours
**Commits**: 4 atomic commits

---

## Overview

This plan details the 4 atomic commits for implementing image rendering with Next.js optimization and finalizing article typography.

### Commit Flow

```
[Commit 1] ImageBlock Component
     |
     v
[Commit 2] ArticleHero Component
     |
     v
[Commit 3] Serializer Integration
     |
     v
[Commit 4] Typography & Styling Polish
```

---

## Commit 1: ImageBlock Component

**Objective**: Create the ImageBlock component for rendering Lexical upload nodes with next/image optimization.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/components/richtext/nodes/ImageBlock.tsx` | Create | ~80 |
| `src/components/richtext/nodes/index.ts` | Modify | ~5 |
| `src/lib/cloudflare-image-loader.ts` | Create/Verify | ~35 |

### Implementation Details

#### 1.1 Cloudflare Image Loader

```typescript
// src/lib/cloudflare-image-loader.ts

interface CloudflareLoaderParams {
  src: string
  width: number
  quality?: number
}

/**
 * Custom loader for next/image with Cloudflare optimization
 *
 * Handles:
 * - Cloudflare Images CDN URLs (imagedelivery.net)
 * - R2 bucket URLs
 * - External URLs (passes through)
 */
export default function cloudflareLoader({
  src,
  width,
  quality = 75,
}: CloudflareLoaderParams): string {
  // Already a Cloudflare Images URL - add transformation params
  if (src.includes('imagedelivery.net')) {
    // Format: https://imagedelivery.net/{account_hash}/{image_id}/{variant}
    // Add width and quality as variants or URL params
    const url = new URL(src)
    url.searchParams.set('w', width.toString())
    url.searchParams.set('q', quality.toString())
    return url.toString()
  }

  // R2 bucket URL - use as-is (Cloudflare handles optimization at edge)
  if (src.includes('.r2.cloudflarestorage.com')) {
    return src
  }

  // External URL or local - pass through
  return src
}
```

#### 1.2 ImageBlock Component

```typescript
// src/components/richtext/nodes/ImageBlock.tsx

import Image from 'next/image'
import type { UploadNode } from '../types'

interface ImageBlockProps {
  node: UploadNode
}

/**
 * ImageBlock - Renders Lexical upload nodes as optimized images
 *
 * Features:
 * - Uses next/image for optimization
 * - Supports captions via figcaption
 * - Responsive sizing
 * - Accessibility via alt text
 */
export function ImageBlock({ node }: ImageBlockProps) {
  const { value, fields } = node

  // Validate required image data
  if (!value?.url) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ImageBlock] Missing image URL')
    }
    return null
  }

  const {
    url,
    alt = '',
    width = 800, // Default if not provided
    height = 450, // Default 16:9 aspect ratio
  } = value

  // Extract caption from fields if available
  const caption = fields?.caption as string | undefined

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
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
```

#### 1.3 Export from nodes/index.ts

```typescript
// Add to src/components/richtext/nodes/index.ts
export { ImageBlock } from './ImageBlock'
```

### Validation Checklist (Commit 1)

- [ ] `cloudflare-image-loader.ts` created with proper TypeScript types
- [ ] `ImageBlock.tsx` created with props interface
- [ ] Component handles missing URL gracefully
- [ ] Component renders `<figure>` with `<Image>` inside
- [ ] Caption renders in `<figcaption>` when present
- [ ] Export added to `nodes/index.ts`
- [ ] TypeScript compiles without errors
- [ ] ESLint passes

### Commit Message

```
✨ feat(ImageBlock): add component for Lexical upload nodes

- Create ImageBlock component with next/image integration
- Add cloudflare-image-loader for Cloudflare optimization
- Support captions via figcaption element
- Include responsive sizing with proper aspect ratio
- Handle missing URL gracefully with console warning

Part of Phase 4: Image Rendering & Advanced Styling
```

---

## Commit 2: ArticleHero Component

**Objective**: Create the ArticleHero component for displaying featured images as full-width hero sections.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/components/articles/ArticleHero.tsx` | Create | ~70 |
| `src/components/articles/types.ts` | Modify | ~10 |
| `src/components/articles/index.ts` | Modify | ~5 |

### Implementation Details

#### 2.1 Update Article Types

```typescript
// Add to src/components/articles/types.ts

export interface CoverImage {
  url: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
}

// Update ArticleData interface
export interface ArticleData {
  // ... existing fields
  coverImage: CoverImage | null
}
```

#### 2.2 ArticleHero Component

```typescript
// src/components/articles/ArticleHero.tsx

import Image from 'next/image'
import type { CoverImage } from './types'

interface ArticleHeroProps {
  image: CoverImage
  title: string
}

/**
 * ArticleHero - Full-width featured image for articles
 *
 * Features:
 * - Priority loading for LCP optimization
 * - Full-width on all breakpoints
 * - Blur placeholder support
 * - Responsive aspect ratio
 */
export function ArticleHero({ image, title }: ArticleHeroProps) {
  return (
    <div className="relative w-full mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="relative aspect-[21/9] sm:aspect-[2/1] lg:aspect-[21/9] overflow-hidden">
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
```

#### 2.3 Export from articles/index.ts

```typescript
// Add to src/components/articles/index.ts
export { ArticleHero } from './ArticleHero'
```

### Validation Checklist (Commit 2)

- [ ] `CoverImage` type added to `types.ts`
- [ ] `ArticleData.coverImage` type updated
- [ ] `ArticleHero.tsx` created with props interface
- [ ] Uses `priority` for LCP optimization
- [ ] Uses `fill` for full-width responsive behavior
- [ ] Supports blur placeholder
- [ ] Aspect ratio defined via CSS
- [ ] Export added to `articles/index.ts`
- [ ] TypeScript compiles without errors
- [ ] ESLint passes

### Commit Message

```
✨ feat(ArticleHero): add full-width featured image component

- Create ArticleHero component for featured images
- Add CoverImage type to article types
- Use priority loading for LCP optimization
- Support blur placeholder for smooth loading
- Implement responsive aspect ratios

Part of Phase 4: Image Rendering & Advanced Styling
```

---

## Commit 3: Serializer Integration

**Objective**: Integrate ImageBlock into the serializer and add ArticleHero to the article page.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/components/richtext/serialize.tsx` | Modify | ~15 |
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Modify | ~40 |

### Implementation Details

#### 3.1 Update Serializer

```typescript
// Update src/components/richtext/serialize.tsx

// Add import
import { ImageBlock } from './nodes/ImageBlock'

// Replace the upload case in serializeNode()
case 'upload':
  return <ImageBlock key={index} node={node as UploadNode} />
```

#### 3.2 Update Article Page

```typescript
// Update src/app/[locale]/(frontend)/articles/[slug]/page.tsx

// Add import
import { ArticleHero } from '@/components/articles'
import type { Media } from '@/payload-types'

// Add type guard for Media
function isPopulatedMedia(media: number | Media | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Update mapPayloadToArticleData function
function mapPayloadToArticleData(article: PayloadArticle): ArticleData {
  // ... existing code

  // Map featured image
  const coverImage = isPopulatedMedia(article.featuredImage)
    ? {
        url: article.featuredImage.url ?? '',
        alt: article.featuredImage.alt ?? '',
        width: article.featuredImage.width ?? 1200,
        height: article.featuredImage.height ?? 630,
        blurDataURL: article.featuredImage.blurDataURL ?? undefined,
      }
    : null

  return {
    // ... existing fields
    coverImage,
  }
}

// Update JSX in ArticlePage
return (
  <article className="container mx-auto px-4 py-8 max-w-prose">
    {/* Hero: Featured Image */}
    {article.coverImage && (
      <ArticleHero image={article.coverImage} title={article.title} />
    )}

    {/* Header: Title, Category, Metadata */}
    <ArticleHeader article={article} locale={locale} />

    {/* Content - Rendered via RichText serializer */}
    <div className="py-8">
      {isLexicalContent(payloadArticle.content) ? (
        <RichText content={payloadArticle.content} />
      ) : (
        <p className="text-muted-foreground italic">{t('contentUnavailable')}</p>
      )}
    </div>

    {/* Footer: Tags */}
    <ArticleFooter tags={article.tags} locale={locale} />
  </article>
)
```

### Validation Checklist (Commit 3)

- [ ] `ImageBlock` imported in `serialize.tsx`
- [ ] Upload case updated to use `ImageBlock`
- [ ] `ArticleHero` imported in `page.tsx`
- [ ] `isPopulatedMedia` type guard added
- [ ] `mapPayloadToArticleData` extracts `coverImage`
- [ ] `ArticleHero` conditionally rendered in page
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds

### Commit Message

```
🔧 feat(serialize): integrate ImageBlock and ArticleHero

- Replace upload placeholder with ImageBlock component
- Add ArticleHero to article page for featured images
- Extract coverImage from Payload article data
- Add isPopulatedMedia type guard

Part of Phase 4: Image Rendering & Advanced Styling
```

---

## Commit 4: Typography & Styling Polish

**Objective**: Finalize article typography with optimal reading width, vertical rhythm, and spacing.

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `src/app/globals.css` | Modify | ~60 |
| `src/components/richtext/RichText.tsx` | Modify | ~20 |
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Modify | ~10 |

### Implementation Details

#### 4.1 Update Global Styles

```css
/* Add to src/app/globals.css */

/* Article prose styles */
.article-prose {
  /* Optimal reading width */
  --prose-width: 65ch;

  /* Vertical rhythm base */
  --rhythm: 1.5rem;
}

.article-prose > * {
  max-width: var(--prose-width);
  margin-left: auto;
  margin-right: auto;
}

/* Allow full-width elements */
.article-prose > figure,
.article-prose > .full-width {
  max-width: none;
}

/* Headings spacing */
.article-prose h1,
.article-prose h2,
.article-prose h3,
.article-prose h4 {
  margin-top: calc(var(--rhythm) * 2);
  margin-bottom: var(--rhythm);
}

.article-prose h1:first-child,
.article-prose h2:first-child {
  margin-top: 0;
}

/* Paragraph spacing */
.article-prose p {
  margin-bottom: var(--rhythm);
  line-height: 1.75;
}

/* List spacing */
.article-prose ul,
.article-prose ol {
  margin-bottom: var(--rhythm);
  padding-left: 1.5rem;
}

.article-prose li {
  margin-bottom: calc(var(--rhythm) * 0.5);
}

/* Blockquote styling */
.article-prose blockquote {
  margin: calc(var(--rhythm) * 1.5) 0;
  padding: var(--rhythm);
  border-left: 4px solid hsl(var(--accent));
  background-color: hsl(var(--muted) / 0.3);
  border-radius: 0 0.5rem 0.5rem 0;
}

/* Code block spacing */
.article-prose pre {
  margin: calc(var(--rhythm) * 1.5) 0;
}

/* Image spacing */
.article-prose figure {
  margin: calc(var(--rhythm) * 2) 0;
}

/* Smooth scroll for anchor links */
html {
  scroll-behavior: smooth;
}

/* Focus visible for accessibility */
.article-prose a:focus-visible {
  outline: 2px solid hsl(var(--accent));
  outline-offset: 2px;
  border-radius: 2px;
}
```

#### 4.2 Update RichText Component

```typescript
// Update src/components/richtext/RichText.tsx

interface RichTextProps {
  content: LexicalContent
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  const rendered = serializeLexical(content)

  if (!rendered) {
    return null
  }

  return (
    <div className={cn('article-prose', className)}>
      {rendered}
    </div>
  )
}
```

#### 4.3 Update Article Page Container

```typescript
// Update container class in page.tsx
<article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Hero outside prose for full-width */}
  {article.coverImage && (
    <ArticleHero image={article.coverImage} title={article.title} />
  )}

  {/* Content wrapper with max-width */}
  <div className="max-w-prose mx-auto">
    <ArticleHeader article={article} locale={locale} />

    <div className="py-8">
      {isLexicalContent(payloadArticle.content) ? (
        <RichText content={payloadArticle.content} />
      ) : (
        <p className="text-muted-foreground italic">{t('contentUnavailable')}</p>
      )}
    </div>

    <ArticleFooter tags={article.tags} locale={locale} />
  </div>
</article>
```

### Validation Checklist (Commit 4)

- [ ] `.article-prose` styles added to `globals.css`
- [ ] Optimal reading width (~65ch) applied
- [ ] Vertical rhythm consistent (1.5rem base)
- [ ] Headings have proper spacing
- [ ] Lists properly indented and spaced
- [ ] Blockquotes styled with accent border
- [ ] Images can be full-width
- [ ] `RichText` accepts className prop
- [ ] Article page uses proper container structure
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Visual inspection passes

### Commit Message

```
💄 style(article): polish typography and vertical rhythm

- Add .article-prose styles for optimal reading
- Implement 65ch max-width for comfortable reading
- Define consistent vertical rhythm (1.5rem base)
- Style headings, lists, blockquotes, and code blocks
- Update RichText to apply prose class
- Restructure article page for proper widths

Part of Phase 4: Image Rendering & Advanced Styling
```

---

## Summary

### Total Implementation

| Metric | Value |
|--------|-------|
| Commits | 4 |
| Files Created | 4 |
| Files Modified | 6 |
| Total Lines | ~400 |
| Duration | 2.5-3 hours |

### Deliverables

1. **ImageBlock**: Renders Lexical upload nodes as optimized images
2. **ArticleHero**: Full-width featured image with priority loading
3. **Cloudflare Loader**: Custom loader for next/image optimization
4. **Typography**: Optimal reading experience with vertical rhythm

### Post-Implementation

After completing all 4 commits:

1. Run `pnpm build` to verify no errors
2. Test with seeded articles containing images
3. Check responsive behavior on mobile/tablet/desktop
4. Verify CLS < 0.1 and LCP < 2.5s
5. Complete [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Plan Created**: 2025-12-10
**Last Updated**: 2025-12-10
