# Phase 4 - Commit Checklist

**Phase**: Image Rendering & Advanced Styling
**Total Commits**: 4

Use this checklist before each commit to ensure quality and completeness.

---

## Commit 1: ImageBlock Component

### Pre-Implementation

- [ ] Read `UploadNode` type definition in `src/components/richtext/types.ts`
- [ ] Check existing `next.config.ts` for image configuration
- [ ] Understand Payload Media collection structure
- [ ] Review `next/image` documentation for custom loaders

### Files to Create

#### `src/lib/cloudflare-image-loader.ts`

- [ ] Created with proper TypeScript types
- [ ] Handles Cloudflare Images URLs (imagedelivery.net)
- [ ] Handles R2 bucket URLs
- [ ] Falls back gracefully for other URLs
- [ ] Exported as default function

#### `src/components/richtext/nodes/ImageBlock.tsx`

- [ ] Props interface defined (`ImageBlockProps`)
- [ ] Imports `Image` from `next/image`
- [ ] Imports `UploadNode` type
- [ ] Validates `node.value.url` exists
- [ ] Logs warning in development for missing URL
- [ ] Returns `null` for invalid nodes
- [ ] Extracts: url, alt, width, height from value
- [ ] Extracts caption from fields if available
- [ ] Uses `<figure>` wrapper
- [ ] Uses `<Image>` with proper props
- [ ] Uses `<figcaption>` when caption exists
- [ ] Has responsive `sizes` attribute
- [ ] Has `loading="lazy"` attribute
- [ ] Rounded corners via Tailwind
- [ ] Proper spacing (my-8)

### Files to Modify

#### `src/components/richtext/nodes/index.ts`

- [ ] Added `export { ImageBlock } from './ImageBlock'`

### Quality Checks

- [ ] TypeScript: `pnpm exec tsc --noEmit`
- [ ] Linting: `pnpm lint`
- [ ] Build check: `pnpm build` (optional at this stage)

### Commit

```bash
git add src/lib/cloudflare-image-loader.ts \
        src/components/richtext/nodes/ImageBlock.tsx \
        src/components/richtext/nodes/index.ts

git commit -m "$(cat <<'EOF'
✨ feat(ImageBlock): add component for Lexical upload nodes

- Create ImageBlock component with next/image integration
- Add cloudflare-image-loader for Cloudflare optimization
- Support captions via figcaption element
- Include responsive sizing with proper aspect ratio
- Handle missing URL gracefully with console warning

Part of Phase 4: Image Rendering & Advanced Styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: ArticleHero Component

### Pre-Implementation

- [ ] Review ArticleHeader component for patterns
- [ ] Check Payload Article schema for featuredImage field
- [ ] Understand blur placeholder strategy

### Files to Modify

#### `src/components/articles/types.ts`

- [ ] Added `CoverImage` interface
  - [ ] url: string
  - [ ] alt: string
  - [ ] width: number
  - [ ] height: number
  - [ ] blurDataURL?: string
- [ ] Updated `ArticleData.coverImage` to use `CoverImage | null`

### Files to Create

#### `src/components/articles/ArticleHero.tsx`

- [ ] Props interface defined (`ArticleHeroProps`)
- [ ] Props include: image (CoverImage), title (string)
- [ ] Imports `Image` from `next/image`
- [ ] Uses `fill` prop for responsive fill
- [ ] Uses `priority` prop for LCP
- [ ] Uses `sizes="100vw"` for full width
- [ ] Uses `object-cover` for proper scaling
- [ ] Supports blur placeholder when `blurDataURL` exists
- [ ] Has negative margins to break out of container
- [ ] Uses aspect ratio via CSS class
- [ ] Responsive aspect ratios (mobile/desktop)
- [ ] Proper bottom margin (mb-8)
- [ ] Overflow hidden for rounded corners

### Files to Modify

#### `src/components/articles/index.ts`

- [ ] Added `export { ArticleHero } from './ArticleHero'`

### Quality Checks

- [ ] TypeScript: `pnpm exec tsc --noEmit`
- [ ] Linting: `pnpm lint`

### Commit

```bash
git add src/components/articles/types.ts \
        src/components/articles/ArticleHero.tsx \
        src/components/articles/index.ts

git commit -m "$(cat <<'EOF'
✨ feat(ArticleHero): add full-width featured image component

- Create ArticleHero component for featured images
- Add CoverImage type to article types
- Use priority loading for LCP optimization
- Support blur placeholder for smooth loading
- Implement responsive aspect ratios

Part of Phase 4: Image Rendering & Advanced Styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Serializer Integration

### Pre-Implementation

- [ ] Verify ImageBlock exports correctly
- [ ] Verify ArticleHero exports correctly
- [ ] Understand Payload Media population

### Files to Modify

#### `src/components/richtext/serialize.tsx`

- [ ] Added import: `import { ImageBlock } from './nodes/ImageBlock'`
- [ ] Added import for `UploadNode` type
- [ ] Updated `case 'upload'` to return `<ImageBlock node={...} />`
- [ ] Removed placeholder div

#### `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

- [ ] Added import: `import { ArticleHero } from '@/components/articles'`
- [ ] Added import for `Media` type from `@/payload-types`
- [ ] Created `isPopulatedMedia` type guard function
- [ ] Updated `mapPayloadToArticleData` to extract `coverImage`:
  - [ ] Checks `isPopulatedMedia(article.featuredImage)`
  - [ ] Maps url, alt, width, height, blurDataURL
  - [ ] Returns null if not populated
- [ ] Updated JSX to render `ArticleHero` when `coverImage` exists
- [ ] Hero rendered before ArticleHeader
- [ ] Hero outside max-width container

### Quality Checks

- [ ] TypeScript: `pnpm exec tsc --noEmit`
- [ ] Linting: `pnpm lint`
- [ ] Build: `pnpm build`
- [ ] Manual test with article that has featuredImage

### Commit

```bash
git add src/components/richtext/serialize.tsx \
        src/app/[locale]/(frontend)/articles/[slug]/page.tsx

git commit -m "$(cat <<'EOF'
🔧 feat(serialize): integrate ImageBlock and ArticleHero

- Replace upload placeholder with ImageBlock component
- Add ArticleHero to article page for featured images
- Extract coverImage from Payload article data
- Add isPopulatedMedia type guard

Part of Phase 4: Image Rendering & Advanced Styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: Typography & Styling Polish

### Pre-Implementation

- [ ] Review UX/UI Spec Section 7.2 (Typography)
- [ ] Review existing globals.css structure
- [ ] Check Tailwind typography plugin availability

### Files to Modify

#### `src/app/globals.css`

- [ ] Added `.article-prose` class
- [ ] Defined `--prose-width: 65ch`
- [ ] Defined `--rhythm: 1.5rem`
- [ ] Added `> *` selector for max-width
- [ ] Added `> figure, > .full-width` exception
- [ ] Styled headings:
  - [ ] margin-top: calc(var(--rhythm) * 2)
  - [ ] margin-bottom: var(--rhythm)
  - [ ] First child has margin-top: 0
- [ ] Styled paragraphs:
  - [ ] margin-bottom: var(--rhythm)
  - [ ] line-height: 1.75
- [ ] Styled lists:
  - [ ] margin-bottom: var(--rhythm)
  - [ ] padding-left: 1.5rem
  - [ ] li margin-bottom: calc(var(--rhythm) * 0.5)
- [ ] Styled blockquotes:
  - [ ] margin: calc(var(--rhythm) * 1.5) 0
  - [ ] padding: var(--rhythm)
  - [ ] border-left with accent color
  - [ ] background with muted color
  - [ ] border-radius for rounded right corners
- [ ] Styled pre (code blocks):
  - [ ] margin: calc(var(--rhythm) * 1.5) 0
- [ ] Styled figure (images):
  - [ ] margin: calc(var(--rhythm) * 2) 0
- [ ] Added `html { scroll-behavior: smooth }`
- [ ] Added focus-visible styles for links

#### `src/components/richtext/RichText.tsx`

- [ ] Added `className` prop to interface
- [ ] Imported `cn` utility (or use clsx/classnames)
- [ ] Updated wrapper div to use `cn('article-prose', className)`

#### `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

- [ ] Updated container classes for proper padding
- [ ] Restructured JSX:
  - [ ] Hero outside max-width wrapper (full width)
  - [ ] Content inside max-width wrapper
- [ ] Verified spacing consistency

### Quality Checks

- [ ] TypeScript: `pnpm exec tsc --noEmit`
- [ ] Linting: `pnpm lint`
- [ ] Build: `pnpm build`
- [ ] Visual inspection:
  - [ ] Reading width comfortable (~65 characters)
  - [ ] Vertical spacing consistent
  - [ ] Headings properly spaced
  - [ ] Lists properly indented
  - [ ] Blockquotes styled correctly
  - [ ] Images full-width within prose
  - [ ] Code blocks properly spaced
- [ ] Responsive check:
  - [ ] Mobile: Single column, good padding
  - [ ] Tablet: Centered, readable width
  - [ ] Desktop: Centered, max 700px content

### Commit

```bash
git add src/app/globals.css \
        src/components/richtext/RichText.tsx \
        src/app/[locale]/(frontend)/articles/[slug]/page.tsx

git commit -m "$(cat <<'EOF'
💄 style(article): polish typography and vertical rhythm

- Add .article-prose styles for optimal reading
- Implement 65ch max-width for comfortable reading
- Define consistent vertical rhythm (1.5rem base)
- Style headings, lists, blockquotes, and code blocks
- Update RichText to apply prose class
- Restructure article page for proper widths

Part of Phase 4: Image Rendering & Advanced Styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Final Phase Checklist

After all 4 commits:

### Build & Lint

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes

### Functional Testing

- [ ] Images render in article content
- [ ] Featured image shows as hero
- [ ] Captions display correctly
- [ ] Alt text present for accessibility
- [ ] Images are responsive

### Visual Testing

- [ ] Reading width is comfortable
- [ ] Vertical rhythm is consistent
- [ ] Images don't cause layout shift
- [ ] Mobile layout looks good
- [ ] Desktop layout looks good

### Performance

- [ ] CLS < 0.1 (check with Lighthouse)
- [ ] LCP < 2.5s (hero image loads fast)
- [ ] Images lazy load below fold

### Next Steps

1. Complete [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. Update PHASES_PLAN.md status to COMPLETED
3. Proceed to Phase 5 (SEO & Tests)

---

**Checklist Created**: 2025-12-10
**Last Updated**: 2025-12-10
