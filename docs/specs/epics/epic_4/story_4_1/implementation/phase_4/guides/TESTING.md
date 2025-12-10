# Phase 4 - Testing Guide

**Phase**: Image Rendering & Advanced Styling
**Purpose**: Testing strategy for image components and typography

---

## Testing Overview

### Test Types for This Phase

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit Tests | Vitest | Components, loader |
| Visual Tests | Manual + Screenshots | Typography, layout |
| Performance Tests | Lighthouse | CLS, LCP |
| Accessibility Tests | axe-core + Manual | WCAG 2.1 AA |

### Files to Test

| File | Test File | Priority |
|------|-----------|----------|
| `cloudflare-image-loader.ts` | `tests/unit/lib/cloudflare-loader.spec.ts` | High |
| `ImageBlock.tsx` | `tests/unit/components/richtext/image-block.spec.tsx` | High |
| `ArticleHero.tsx` | `tests/unit/components/articles/article-hero.spec.tsx` | Medium |
| `RichText.tsx` | Existing tests + className | Low |
| Typography CSS | Visual inspection | Medium |

---

## Unit Tests

### Cloudflare Loader Tests

```typescript
// tests/unit/lib/cloudflare-loader.spec.ts

import { describe, it, expect } from 'vitest'
import cloudflareLoader from '@/lib/cloudflare-image-loader'

describe('cloudflareLoader', () => {
  describe('Cloudflare Images URLs', () => {
    it('should add width and quality params to imagedelivery.net URLs', () => {
      const result = cloudflareLoader({
        src: 'https://imagedelivery.net/hash/image-id/public',
        width: 800,
        quality: 80,
      })

      expect(result).toContain('w=800')
      expect(result).toContain('q=80')
    })

    it('should use default quality if not specified', () => {
      const result = cloudflareLoader({
        src: 'https://imagedelivery.net/hash/image-id/public',
        width: 800,
      })

      expect(result).toContain('q=75')
    })
  })

  describe('R2 bucket URLs', () => {
    it('should return R2 URLs unchanged', () => {
      const src = 'https://bucket.r2.cloudflarestorage.com/image.jpg'
      const result = cloudflareLoader({
        src,
        width: 800,
      })

      expect(result).toBe(src)
    })
  })

  describe('Other URLs', () => {
    it('should return external URLs unchanged', () => {
      const src = 'https://example.com/image.jpg'
      const result = cloudflareLoader({
        src,
        width: 800,
      })

      expect(result).toBe(src)
    })

    it('should handle relative URLs', () => {
      const src = '/images/local.jpg'
      const result = cloudflareLoader({
        src,
        width: 800,
      })

      expect(result).toBe(src)
    })
  })
})
```

### ImageBlock Tests

```typescript
// tests/unit/components/richtext/image-block.spec.tsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageBlock } from '@/components/richtext/nodes/ImageBlock'
import type { UploadNode } from '@/components/richtext/types'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  ),
}))

describe('ImageBlock', () => {
  const validNode: UploadNode = {
    type: 'upload',
    version: 1,
    value: {
      id: 1,
      url: 'https://example.com/image.jpg',
      alt: 'Test image',
      width: 800,
      height: 600,
    },
    fields: {
      caption: 'A beautiful sunset',
    },
  }

  describe('Rendering', () => {
    it('should render an image with correct src and alt', () => {
      render(<ImageBlock node={validNode} />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
      expect(img).toHaveAttribute('alt', 'Test image')
    })

    it('should render caption in figcaption', () => {
      render(<ImageBlock node={validNode} />)

      expect(screen.getByText('A beautiful sunset')).toBeInTheDocument()
      expect(screen.getByRole('figure')).toBeInTheDocument()
    })

    it('should not render figcaption when caption is missing', () => {
      const nodeWithoutCaption: UploadNode = {
        ...validNode,
        fields: undefined,
      }

      render(<ImageBlock node={nodeWithoutCaption} />)

      expect(screen.queryByRole('figure')).toBeInTheDocument()
      expect(screen.queryByText('A beautiful sunset')).not.toBeInTheDocument()
    })

    it('should use figure element for semantic HTML', () => {
      render(<ImageBlock node={validNode} />)

      const figure = screen.getByRole('figure')
      expect(figure).toBeInTheDocument()
    })
  })

  describe('Null Safety', () => {
    it('should return null when URL is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const nodeWithoutUrl: UploadNode = {
        type: 'upload',
        version: 1,
        value: {
          id: 1,
        },
      }

      const { container } = render(<ImageBlock node={nodeWithoutUrl} />)

      expect(container).toBeEmptyDOMElement()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing image URL')
      )

      consoleSpy.mockRestore()
    })

    it('should handle missing value object', () => {
      const nodeWithoutValue = {
        type: 'upload',
        version: 1,
      } as UploadNode

      const { container } = render(<ImageBlock node={nodeWithoutValue} />)

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('Default Values', () => {
    it('should use default dimensions when not provided', () => {
      const nodeWithoutDimensions: UploadNode = {
        type: 'upload',
        version: 1,
        value: {
          id: 1,
          url: 'https://example.com/image.jpg',
        },
      }

      render(<ImageBlock node={nodeWithoutDimensions} />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('width', '800')
      expect(img).toHaveAttribute('height', '450')
    })

    it('should use empty string for missing alt', () => {
      const nodeWithoutAlt: UploadNode = {
        type: 'upload',
        version: 1,
        value: {
          id: 1,
          url: 'https://example.com/image.jpg',
          width: 800,
          height: 600,
        },
      }

      render(<ImageBlock node={nodeWithoutAlt} />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('alt', '')
    })
  })
})
```

### ArticleHero Tests

```typescript
// tests/unit/components/articles/article-hero.spec.tsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleHero } from '@/components/articles/ArticleHero'
import type { CoverImage } from '@/components/articles/types'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, priority, placeholder, ...props }: {
    src: string
    alt: string
    priority?: boolean
    placeholder?: string
  }) => (
    <img
      src={src}
      alt={alt}
      data-testid="next-image"
      data-priority={priority}
      data-placeholder={placeholder}
      {...props}
    />
  ),
}))

describe('ArticleHero', () => {
  const coverImage: CoverImage = {
    url: 'https://example.com/hero.jpg',
    alt: 'Hero image description',
    width: 1200,
    height: 630,
  }

  describe('Rendering', () => {
    it('should render image with correct src', () => {
      render(<ArticleHero image={coverImage} title="Test Article" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('src', 'https://example.com/hero.jpg')
    })

    it('should use image alt text', () => {
      render(<ArticleHero image={coverImage} title="Test Article" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('alt', 'Hero image description')
    })

    it('should use title as fallback alt when image alt is empty', () => {
      const imageWithoutAlt = { ...coverImage, alt: '' }

      render(<ArticleHero image={imageWithoutAlt} title="Test Article" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('alt', expect.stringContaining('Test Article'))
    })
  })

  describe('Performance', () => {
    it('should use priority loading', () => {
      render(<ArticleHero image={coverImage} title="Test Article" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('data-priority', 'true')
    })
  })

  describe('Blur Placeholder', () => {
    it('should use blur placeholder when blurDataURL is provided', () => {
      const imageWithBlur: CoverImage = {
        ...coverImage,
        blurDataURL: 'data:image/jpeg;base64,...',
      }

      render(<ArticleHero image={imageWithBlur} title="Test Article" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('data-placeholder', 'blur')
    })

    it('should use empty placeholder when blurDataURL is missing', () => {
      render(<ArticleHero image={coverImage} title="Test Article" />)

      const img = screen.getByTestId('next-image')
      expect(img).toHaveAttribute('data-placeholder', 'empty')
    })
  })
})
```

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/lib/cloudflare-loader.spec.ts

# Run with coverage
pnpm test:unit --coverage

# Watch mode during development
pnpm test:unit --watch
```

---

## Integration Tests

### Serializer Integration

```typescript
// tests/unit/components/richtext/serialize-images.spec.tsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { serializeLexical } from '@/components/richtext/serialize'
import type { LexicalContent } from '@/components/richtext/types'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="next-image" />,
}))

describe('serializeLexical - Upload Nodes', () => {
  it('should render upload nodes as ImageBlock', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'upload',
            version: 1,
            value: {
              id: 1,
              url: 'https://example.com/image.jpg',
              alt: 'Test image',
              width: 800,
              height: 600,
            },
          },
        ],
      },
    }

    render(<>{serializeLexical(content)}</>)

    expect(screen.getByTestId('next-image')).toBeInTheDocument()
    expect(screen.getByRole('figure')).toBeInTheDocument()
  })

  it('should handle mixed content with images', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', version: 1, text: 'Before image', format: 0 }],
          },
          {
            type: 'upload',
            version: 1,
            value: {
              id: 1,
              url: 'https://example.com/image.jpg',
              alt: 'Test image',
              width: 800,
              height: 600,
            },
          },
          {
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', version: 1, text: 'After image', format: 0 }],
          },
        ],
      },
    }

    render(<>{serializeLexical(content)}</>)

    expect(screen.getByText('Before image')).toBeInTheDocument()
    expect(screen.getByTestId('next-image')).toBeInTheDocument()
    expect(screen.getByText('After image')).toBeInTheDocument()
  })
})
```

---

## Visual Testing

### Manual Visual Checklist

#### Article Page with Hero

1. Navigate to an article with a featured image
2. Check:
   - [ ] Hero image displays full-width
   - [ ] Hero loads immediately (no lazy load)
   - [ ] Aspect ratio looks good on current viewport
   - [ ] No horizontal scrollbar

#### Inline Images

1. Navigate to an article with inline images
2. Check:
   - [ ] Images render within content
   - [ ] Captions display correctly
   - [ ] Images are centered
   - [ ] Images have rounded corners
   - [ ] Spacing above and below is consistent

#### Typography

1. Navigate to an article with rich content
2. Check:
   - [ ] Reading width is comfortable (~65 characters per line)
   - [ ] Headings have proper hierarchy (size decreases h1 > h2 > h3)
   - [ ] Paragraph spacing is consistent
   - [ ] Lists are properly indented
   - [ ] Blockquotes are visually distinct
   - [ ] Code blocks have proper spacing

### Screenshot Comparison

Take screenshots at key breakpoints for regression testing:

```bash
# Mobile (375px)
# Tablet (768px)
# Desktop (1280px)
```

Store in `tests/screenshots/` for future comparison.

---

## Performance Testing

### Lighthouse Metrics

Target metrics for article page:

| Metric | Target | Check |
|--------|--------|-------|
| LCP | < 2.5s | Hero image loads fast |
| CLS | < 0.1 | No layout shift from images |
| FID | < 100ms | N/A for static content |
| Performance Score | > 90 | Overall |

### Running Lighthouse

```bash
# Using Lighthouse CLI
npx lighthouse http://localhost:3000/fr/articles/[slug] \
  --only-categories=performance \
  --output=json \
  --output-path=./lighthouse-report.json

# Or use Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Run audit with "Performance" checked
```

### CLS Investigation

If CLS > 0.1:

1. Open DevTools > Performance
2. Check "Web Vitals" checkbox
3. Reload page and look for CLS events
4. Identify elements causing shift
5. Ensure images have explicit dimensions

---

## Accessibility Testing

### Automated Testing (axe-core)

```typescript
// Add to E2E tests (Phase 5)
import { injectAxe, checkA11y } from 'axe-playwright'

test('article page is accessible', async ({ page }) => {
  await page.goto('/fr/articles/test-article')
  await injectAxe(page)
  await checkA11y(page)
})
```

### Manual A11y Checklist

#### Images

- [ ] All images have alt text
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] Complex images have detailed descriptions
- [ ] Figcaption provides additional context

#### Focus States

- [ ] Focus visible on all interactive elements
- [ ] Focus order is logical (top to bottom)
- [ ] Skip link available (if applicable)

#### Color Contrast

- [ ] Text contrast ratio >= 4.5:1
- [ ] Caption text contrast ratio >= 4.5:1
- [ ] Focus indicator contrast >= 3:1

### Screen Reader Testing

Test with:
- VoiceOver (macOS): `CMD + F5`
- NVDA (Windows): Free download
- ChromeVox (Chrome extension)

Check:
- [ ] Images announced with alt text
- [ ] Figure/figcaption relationship announced
- [ ] Heading hierarchy makes sense
- [ ] Content reads in logical order

---

## Responsive Testing

### Breakpoints to Test

| Breakpoint | Width | Device |
|------------|-------|--------|
| Mobile | 375px | iPhone SE |
| Mobile L | 425px | iPhone XR |
| Tablet | 768px | iPad |
| Laptop | 1024px | Small laptop |
| Desktop | 1280px | Standard |
| Wide | 1440px | Large monitor |

### Testing Method

```bash
# Using Chrome DevTools
# 1. Open DevTools (F12)
# 2. Toggle device toolbar (Ctrl+Shift+M)
# 3. Select device or enter custom width
```

### Responsive Checklist

#### Hero Image

- [ ] Mobile: Full width, appropriate height
- [ ] Tablet: Full width, appropriate height
- [ ] Desktop: Max width or full width, appropriate height

#### Inline Images

- [ ] Mobile: Full container width
- [ ] Tablet: Centered, max-width
- [ ] Desktop: Centered, max-width (~700px)

#### Content Width

- [ ] Mobile: Full width with padding
- [ ] Tablet: Centered, max-width
- [ ] Desktop: Centered, ~65ch (~700px)

---

## Test Data Requirements

### Required Test Articles

1. **Article with Hero Image**
   - Has `featuredImage` populated
   - Used for hero component testing

2. **Article with Inline Images**
   - Has `upload` nodes in content
   - Various image sizes
   - Some with captions, some without

3. **Article with All Content Types**
   - Paragraphs, headings, lists
   - Blockquotes, code blocks
   - Inline images
   - Used for typography testing

### Seeding Test Data

```bash
# Run seed script
pnpm seed

# Or create manually in admin:
# 1. Upload media files
# 2. Create articles with images
```

---

## Test Summary

### Test Coverage Targets

| Area | Coverage |
|------|----------|
| Cloudflare Loader | 100% |
| ImageBlock | > 90% |
| ArticleHero | > 80% |
| Serializer (upload) | > 90% |

### Test Commands

```bash
# All unit tests
pnpm test:unit

# With coverage report
pnpm test:unit --coverage

# Specific files
pnpm test:unit tests/unit/components/richtext/image-block.spec.tsx

# Watch mode
pnpm test:unit --watch
```

### Pre-Commit Test Checklist

- [ ] Unit tests pass: `pnpm test:unit`
- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`

---

**Testing Guide Created**: 2025-12-10
**Last Updated**: 2025-12-10
