# Phase 4 - Code Review Guide

**Phase**: Image Rendering & Advanced Styling
**Purpose**: Guide for reviewing each commit

---

## Review Philosophy

### Focus Areas for This Phase

1. **Performance**: Images are often the largest payload; ensure optimization
2. **Accessibility**: Alt text, ARIA labels, keyboard navigation
3. **CLS Prevention**: No layout shifts from images loading
4. **Responsive Design**: Works across all breakpoints
5. **Type Safety**: Proper TypeScript types for image data

---

## Commit 1 Review: ImageBlock Component

### Files to Review

- `src/lib/cloudflare-image-loader.ts`
- `src/components/richtext/nodes/ImageBlock.tsx`
- `src/components/richtext/nodes/index.ts`

### Cloudflare Loader Checklist

#### Functionality

- [ ] Handles Cloudflare Images URLs (imagedelivery.net)
- [ ] Handles R2 bucket URLs
- [ ] Falls back gracefully for unknown URLs
- [ ] Returns valid URL string in all cases

#### Type Safety

- [ ] Params interface defined with proper types
- [ ] `src: string`, `width: number`, `quality?: number`
- [ ] Return type is `string`

#### Code Quality

```typescript
// Good: Clear parameter handling
export default function cloudflareLoader({
  src,
  width,
  quality = 75,
}: CloudflareLoaderParams): string {
  // ...
}

// Bad: Any types or missing defaults
export default function cloudflareLoader(props: any) {
  // ...
}
```

### ImageBlock Checklist

#### Props & Types

- [ ] `ImageBlockProps` interface defined
- [ ] Props destructure `node: UploadNode`
- [ ] No `any` types used

#### Null Safety

```typescript
// Good: Early return for missing data
if (!value?.url) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[ImageBlock] Missing image URL')
  }
  return null
}

// Bad: No null check
const url = value.url // Might crash
```

#### Image Component Usage

- [ ] Uses `next/image` not `<img>`
- [ ] Has `width` and `height` props (CLS prevention)
- [ ] Has `alt` attribute (accessibility)
- [ ] Has `loading="lazy"` (performance)
- [ ] Has `sizes` attribute (responsive)

#### Semantic HTML

```typescript
// Good: Semantic figure/figcaption
<figure className="my-8">
  <div className="relative overflow-hidden rounded-lg">
    <Image ... />
  </div>
  {caption && (
    <figcaption className="mt-3 text-center text-sm text-muted-foreground">
      {caption}
    </figcaption>
  )}
</figure>

// Bad: Just img without semantic wrapper
<img src={url} />
```

#### Styling

- [ ] Uses Tailwind classes (consistent with project)
- [ ] Has proper spacing (my-8 or similar)
- [ ] Has border-radius (rounded-lg or similar)
- [ ] Caption styled appropriately

### Questions to Ask

1. Does the loader handle all URL patterns we might encounter?
2. Are default dimensions reasonable if Payload doesn't provide them?
3. Is the console warning helpful for debugging?
4. Would an error boundary improve resilience?

---

## Commit 2 Review: ArticleHero Component

### Files to Review

- `src/components/articles/types.ts`
- `src/components/articles/ArticleHero.tsx`
- `src/components/articles/index.ts`

### Types Checklist

#### CoverImage Interface

```typescript
// Good: Complete interface
export interface CoverImage {
  url: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
}

// Bad: Missing optional blur support
export interface CoverImage {
  url: string
  alt: string
}
```

- [ ] All required fields defined
- [ ] Optional fields marked with `?`
- [ ] Types are specific (not `any` or `unknown`)

### ArticleHero Checklist

#### Props

- [ ] Clear interface with `image: CoverImage` and `title: string`
- [ ] Title used for fallback alt text

#### LCP Optimization

```typescript
// Good: Priority loading for hero
<Image
  priority
  // ...
/>

// Bad: No priority (delays LCP)
<Image
  loading="lazy"
  // ...
/>
```

- [ ] Uses `priority` prop (hero is above fold)
- [ ] Uses `sizes="100vw"` (full width)

#### Responsive Design

```typescript
// Good: Responsive aspect ratios
<div className="relative aspect-[21/9] sm:aspect-[2/1] lg:aspect-[21/9]">

// Bad: Fixed dimensions
<div style={{ width: '1200px', height: '630px' }}>
```

- [ ] Uses CSS aspect-ratio
- [ ] Different ratios for mobile/desktop (optional but nice)
- [ ] Uses `fill` prop with relative container

#### Blur Placeholder

```typescript
// Good: Conditional blur
placeholder={image.blurDataURL ? 'blur' : 'empty'}
blurDataURL={image.blurDataURL}

// Bad: Always blur (error if no blurDataURL)
placeholder="blur"
blurDataURL={image.blurDataURL}
```

- [ ] Handles missing blurDataURL gracefully
- [ ] Conditionally enables blur placeholder

#### Full-Width Layout

- [ ] Uses negative margins to break out of container
- [ ] Or uses different container structure
- [ ] Doesn't cause horizontal scroll

### Questions to Ask

1. Does the aspect ratio work well on all devices?
2. Is the blur placeholder worth the complexity?
3. Should we support a caption on the hero image?
4. What happens if the image fails to load?

---

## Commit 3 Review: Serializer Integration

### Files to Review

- `src/components/richtext/serialize.tsx`
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

### Serializer Checklist

#### Import Statement

```typescript
// Good: Named import, type import
import { ImageBlock } from './nodes/ImageBlock'
import type { UploadNode } from './types'

// Bad: Import everything
import * as nodes from './nodes'
```

#### Switch Case

```typescript
// Good: Clean case statement
case 'upload':
  return <ImageBlock key={index} node={node as UploadNode} />

// Bad: Inline implementation
case 'upload':
  return <figure key={index}><img src={...} /></figure>
```

- [ ] Replaces placeholder entirely
- [ ] Uses type assertion correctly
- [ ] Key prop passed through

### Article Page Checklist

#### Type Guard

```typescript
// Good: Proper type guard
function isPopulatedMedia(media: number | Media | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Bad: Weak type check
function isPopulatedMedia(media: any) {
  return media?.url
}
```

- [ ] Return type is type predicate
- [ ] Handles null and undefined
- [ ] Checks specific property existence

#### Data Mapping

```typescript
// Good: Complete mapping with defaults
const coverImage = isPopulatedMedia(article.featuredImage)
  ? {
      url: article.featuredImage.url ?? '',
      alt: article.featuredImage.alt ?? '',
      width: article.featuredImage.width ?? 1200,
      height: article.featuredImage.height ?? 630,
      blurDataURL: article.featuredImage.blurDataURL ?? undefined,
    }
  : null

// Bad: Assumes all fields exist
const coverImage = {
  url: article.featuredImage.url,
  alt: article.featuredImage.alt,
}
```

- [ ] Uses nullish coalescing for defaults
- [ ] Handles missing featuredImage
- [ ] Maps all required CoverImage fields

#### JSX Structure

```typescript
// Good: Hero before header, conditional render
return (
  <article>
    {article.coverImage && (
      <ArticleHero image={article.coverImage} title={article.title} />
    )}
    <ArticleHeader article={article} locale={locale} />
    // ...
  </article>
)

// Bad: Hero inside content wrapper (won't be full-width)
return (
  <article className="max-w-prose">
    {article.coverImage && <ArticleHero ... />}
  </article>
)
```

- [ ] Hero rendered conditionally
- [ ] Hero placed before header
- [ ] Hero outside max-width container (for full-width)

### Questions to Ask

1. Is the type guard thorough enough?
2. Are the default dimensions (1200x630) appropriate?
3. Should we log a warning for missing featuredImage metadata?
4. Is the JSX structure clear and maintainable?

---

## Commit 4 Review: Typography & Styling

### Files to Review

- `src/app/globals.css`
- `src/components/richtext/RichText.tsx`
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

### CSS Checklist

#### Custom Properties

```css
/* Good: Defined and used consistently */
.article-prose {
  --prose-width: 65ch;
  --rhythm: 1.5rem;
}

.article-prose h2 {
  margin-top: calc(var(--rhythm) * 2);
}

/* Bad: Magic numbers everywhere */
.article-prose h2 {
  margin-top: 48px;
}
```

- [ ] Custom properties defined at top of class
- [ ] Used consistently throughout
- [ ] Values make sense (65ch ~= 700px at 16px font)

#### Selector Specificity

```css
/* Good: Low specificity, scoped to .article-prose */
.article-prose > * {
  max-width: var(--prose-width);
}

/* Bad: High specificity or global */
article div p {
  max-width: 700px;
}
```

- [ ] All selectors scoped to `.article-prose`
- [ ] Direct child selectors used appropriately
- [ ] No `!important` unless absolutely necessary

#### Reading Width

- [ ] Max-width set to ~65ch or ~700px
- [ ] Centered with auto margins
- [ ] Full-width exception for figures/images

#### Vertical Rhythm

- [ ] Consistent base rhythm (1.5rem recommended)
- [ ] Headings have more top margin than bottom
- [ ] Paragraphs have consistent bottom margin
- [ ] Lists properly spaced

#### Typography

- [ ] Line height set for readability (1.6-1.8)
- [ ] Blockquotes visually distinct
- [ ] Links have focus states
- [ ] Code blocks properly spaced

### RichText Component Checklist

```typescript
// Good: Accepts className, uses utility
interface RichTextProps {
  content: LexicalContent
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  return (
    <div className={cn('article-prose', className)}>
      {serializeLexical(content)}
    </div>
  )
}

// Bad: Hardcoded class, no extension
export function RichText({ content }: { content: LexicalContent }) {
  return (
    <div className="article-prose">
      {serializeLexical(content)}
    </div>
  )
}
```

- [ ] className prop added
- [ ] Uses `cn` or similar for merging
- [ ] Wrapper div has article-prose class

### Article Page Checklist

- [ ] Container has proper responsive padding
- [ ] Hero outside max-width wrapper
- [ ] Content inside max-width wrapper
- [ ] Consistent spacing between sections

### Visual Review

Open the article page and check:

- [ ] **Reading width**: Can read ~12-15 words per line
- [ ] **Heading spacing**: Clear visual hierarchy
- [ ] **Paragraph spacing**: Easy to distinguish paragraphs
- [ ] **List indentation**: Lists properly nested
- [ ] **Blockquote styling**: Clearly distinguishable
- [ ] **Image spacing**: Images don't crowd text
- [ ] **Code block spacing**: Code blocks have breathing room

### Responsive Check

Test on:

- [ ] **Mobile (375px)**: Single column, good padding
- [ ] **Tablet (768px)**: Centered, comfortable width
- [ ] **Desktop (1280px)**: Max-width respected, centered

### Questions to Ask

1. Is 65ch the right reading width for this font?
2. Are the rhythm multipliers (1.5x, 2x) appropriate?
3. Should blockquotes have different styling?
4. Do the focus states meet WCAG requirements?

---

## General Review Guidelines

### Performance

- [ ] Images use `next/image` (not `<img>`)
- [ ] Hero uses `priority`
- [ ] Inline images use `lazy` loading
- [ ] No unnecessary re-renders

### Accessibility

- [ ] All images have alt text
- [ ] Captions use `<figcaption>`
- [ ] Focus states visible
- [ ] Color contrast sufficient

### TypeScript

- [ ] No `any` types
- [ ] Proper type guards
- [ ] Interfaces exported where needed

### Code Style

- [ ] Consistent with existing codebase
- [ ] No commented-out code
- [ ] Meaningful variable names
- [ ] JSDoc comments for public APIs

---

## Review Checklist Summary

### Per-Commit Quick Check

| Commit | Key Points |
|--------|------------|
| 1 | Loader handles all URLs, ImageBlock has null safety |
| 2 | Priority loading, responsive aspect ratio, blur support |
| 3 | Type guard correct, JSX structure allows full-width hero |
| 4 | CSS uses custom properties, RichText accepts className |

### Final Review

- [ ] All 4 commits reviewed
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] Visual inspection complete
- [ ] Responsive behavior verified

---

**Review Guide Created**: 2025-12-10
**Last Updated**: 2025-12-10
