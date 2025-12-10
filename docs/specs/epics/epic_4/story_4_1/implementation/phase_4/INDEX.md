# Phase 4 - Image Rendering & Advanced Styling

**Story**: 4.1 - Rendu Article & MDX
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 4 of 5
**Status**: READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy (4 commits) |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklists |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Dependencies and configuration |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation |

---

## Phase Overview

### Objective

Implement image rendering for Lexical upload nodes with Next.js Image optimization and Cloudflare loader, plus finalize the typographic styling for optimal article readability.

### User Value

Readers will experience:
- Crisp, optimized images that load fast on any device
- Featured hero images at full width for visual impact
- Proper captions and alt text for accessibility
- Comfortable reading width (~65ch) for long-form content
- Harmonious vertical rhythm and spacing throughout the article

### Scope

**In Scope**:
- `ImageBlock` component for Lexical upload nodes
- Integration with `next/image` and Cloudflare Images loader
- Caption and alt text rendering
- `ArticleHero` component for featured images
- Optimal reading width (max-width ~700px / ~65ch)
- Vertical rhythm and spacing improvements
- Responsive image handling (mobile/tablet/desktop)

**Out of Scope**:
- Image galleries/carousels
- Lightbox/zoom functionality
- Image editing or cropping in frontend
- Video embeds
- SEO metadata (Phase 5)

---

## Technical Approach

### Why next/image with Cloudflare?

| Criteria | next/image + CF | Native img | Third-party |
|----------|-----------------|------------|-------------|
| Automatic optimization | Yes (via loader) | No | Varies |
| Lazy loading | Built-in | Manual | Varies |
| CLS prevention | width/height required | Manual | Varies |
| WebP/AVIF conversion | Via CF Images | No | Yes |
| Edge caching | Native | No | Varies |

**Decision**: Use `next/image` with a custom Cloudflare Images loader for optimal performance on Workers runtime.

### Architecture

```
+-------------------------------------------------------------+
|                   Article Page (RSC)                         |
+-------------------------------------------------------------+
|                      ArticleHero                             |
|  +-------------------------------------------------------+  |
|  | Featured Image (full-width, next/image)               |  |
|  | - Priority loading (LCP)                              |  |
|  | - Blur placeholder from Payload                       |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
|                      RichText                                |
|  +-------------------------------------------------------+  |
|  |                    serialize.tsx                       |  |
|  |  +------------------------------------------------+   |  |
|  |  | case 'upload': <ImageBlock node={...} />       |   |  |
|  |  +------------------------------------------------+   |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
|                     ImageBlock.tsx                           |
|  +-------------------------------------------------------+  |
|  | - Extracts image data from upload node                |  |
|  | - Uses next/image with Cloudflare loader              |  |
|  | - Renders figure with figcaption                      |  |
|  | - Responsive sizing                                   |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

### Data Flow

```
1. Payload returns article with:
   - featuredImage: Media object (id, url, alt, width, height)
   - content: Lexical JSON with "upload" nodes

2. ArticleHero receives featuredImage
   - Renders full-width hero with priority loading
   - Uses next/image with fill or explicit dimensions

3. serialize.tsx routes "upload" nodes to ImageBlock
   - Extracts value.url, value.alt, value.width, value.height
   - Handles caption from fields if available

4. ImageBlock renders optimized image
   - Uses next/image with Cloudflare loader
   - Wraps in <figure> with optional <figcaption>
   - Responsive: mobile fullwidth, desktop centered
```

### Image Sizing Strategy

Based on UX/UI Spec recommendations:

| Context | Mobile (<768px) | Tablet (768-1024px) | Desktop (>=1024px) |
|---------|-----------------|---------------------|-------------------|
| Hero Image | 100vw | 100vw | max-width: 1200px |
| Inline Image | 100% container | 100% container | max-width: 700px |
| Content Width | 100% - padding | max-width: 700px | max-width: 700px (~65ch) |

---

## Commits Summary

| # | Commit | Files | Lines | Duration |
|---|--------|-------|-------|----------|
| 1 | ImageBlock Component | 3 | ~120 | 45-60 min |
| 2 | ArticleHero Component | 3 | ~100 | 30-45 min |
| 3 | Integrate & Update Serializer | 2 | ~80 | 30-45 min |
| 4 | Typography & Styling Polish | 3 | ~100 | 30-45 min |
| **Total** | | **11** | **~400** | **2.5-3 hours** |

---

## Dependencies

### Phase Dependencies

- **Phase 2** (Lexical Rendering): Must be complete
  - serialize.tsx exists and handles node routing
  - UploadNode type defined in types.ts
  - Current placeholder: `[Image placeholder - Phase 4]`

- **Phase 3** (Code Highlighting): Should be complete
  - Basic styling patterns established
  - Prose styles partially defined

### Package Dependencies

No new packages required. Uses existing:
- `next/image` (built-in Next.js)
- Cloudflare Images loader (may need verification)

### Existing Infrastructure

- `src/components/richtext/serialize.tsx` - Node router (to modify)
- `src/components/richtext/types.ts` - UploadNode type (already defined)
- `src/components/articles/ArticleHeader.tsx` - Header component (reference)
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` - Page (to modify)
- `src/app/globals.css` - Global styles (to enhance)
- `next.config.ts` - Image configuration (to verify)

---

## Risk Assessment

### Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cloudflare loader not configured | Low | Medium | Verify next.config.ts, add if missing |
| CLS from missing dimensions | Low | High | Always use Payload width/height |
| Large images slow LCP | Medium | Medium | Hero uses priority, lazy load inline |
| R2 URLs not in remotePatterns | Low | Medium | Add R2 bucket domain to config |

### Contingency Plans

1. **If Cloudflare loader fails**: Fall back to default Next.js loader
2. **If dimensions missing**: Use aspect-ratio CSS with default 16:9
3. **If images too large**: Implement srcset with multiple sizes

---

## Success Criteria

### Functional

- [ ] Upload nodes render as optimized images
- [ ] Alt text displays correctly (accessibility)
- [ ] Captions render below images when provided
- [ ] Featured image displays as full-width hero
- [ ] Images are responsive across breakpoints

### Non-Functional

- [ ] CLS < 0.1 (no layout shift from images)
- [ ] LCP < 2.5s with hero image
- [ ] Accessible (alt text, WCAG 2.1 AA compliant)
- [ ] Reading width optimal (~65ch / 700px)
- [ ] Consistent vertical rhythm

### Quality Gates

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint + Biome pass
- [ ] Build succeeds
- [ ] Manual visual inspection across breakpoints

---

## File Structure

After implementation:

```
src/components/
+-- richtext/
|   +-- nodes/
|   |   +-- ImageBlock.tsx      (new)
|   |   +-- CodeBlock.tsx
|   |   +-- Heading.tsx
|   |   +-- Paragraph.tsx
|   |   +-- List.tsx
|   |   +-- Quote.tsx
|   |   +-- Link.tsx
|   |   +-- index.ts            (modified)
|   +-- serialize.tsx           (modified)
|   +-- types.ts
|   +-- RichText.tsx
|   +-- index.ts
+-- articles/
|   +-- ArticleHero.tsx         (new)
|   +-- ArticleHeader.tsx
|   +-- ArticleFooter.tsx
|   +-- index.ts                (modified)
|   +-- types.ts                (modified - add coverImage)

src/app/
+-- [locale]/
|   +-- (frontend)/
|       +-- articles/
|           +-- [slug]/
|               +-- page.tsx    (modified - add ArticleHero)
+-- globals.css                 (modified - prose styles)

src/lib/
+-- cloudflare-image-loader.ts  (new or verify existing)

tests/unit/components/richtext/
+-- image-block.spec.tsx        (new)
```

---

## Cloudflare Images Configuration

### next.config.ts Setup

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.r2.cloudflarestorage.com',
    },
    {
      protocol: 'https',
      hostname: 'imagedelivery.net', // Cloudflare Images CDN
    },
  ],
  loader: 'custom',
  loaderFile: './src/lib/cloudflare-image-loader.ts',
}
```

### Cloudflare Loader Implementation

```typescript
// src/lib/cloudflare-image-loader.ts
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`]
  if (quality) params.push(`quality=${quality}`)

  // If already a Cloudflare Images URL
  if (src.includes('imagedelivery.net')) {
    return `${src}?${params.join('&')}`
  }

  // For R2 or other sources, use Cloudflare Image Resizing
  // Requires Cloudflare Image Resizing enabled on your zone
  return `${src}?${params.join('&')}`
}
```

---

## References

### Documentation

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Overall story planning
- [Story 4.1 Spec](../../story_4.1.md) - Story requirements
- [UX/UI Spec](../../../../UX_UI_Spec.md) - Design requirements (Section 6.2, 7.2)

### External

- [Next.js Image Component](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cloudflare Images](https://developers.cloudflare.com/images/)
- [Cloudflare Image Resizing](https://developers.cloudflare.com/images/image-resizing/)
- [Payload Media Collection](https://payloadcms.com/docs/upload/overview)

### Related Code

- Phase 2 serializer: `src/components/richtext/serialize.tsx`
- Design System: `src/app/globals.css`
- Tailwind typography: Consider `@tailwindcss/typography` plugin

---

## Getting Started

1. **Read** [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for configuration
2. **Follow** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) commit by commit
3. **Check** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) before each commit
4. **Review** with [guides/REVIEW.md](./guides/REVIEW.md)
5. **Test** following [guides/TESTING.md](./guides/TESTING.md)
6. **Validate** using [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Phase Created**: 2025-12-10
**Last Updated**: 2025-12-10
**Generated by**: phase-doc-generator skill
