# Phase 4 - Environment Setup

**Phase**: Image Rendering & Advanced Styling
**Purpose**: Configure development environment for image optimization

---

## Prerequisites

### Completed Phases

- [x] Phase 1: Article Page Route & Basic Layout
- [x] Phase 2: Lexical Content Rendering
- [x] Phase 3: Code Block Syntax Highlighting

### Existing Infrastructure

Verify these files exist and are functional:

```bash
# Check richtext components exist
ls src/components/richtext/
# Expected: RichText.tsx, serialize.tsx, types.ts, nodes/

# Check article components exist
ls src/components/articles/
# Expected: ArticleHeader.tsx, ArticleFooter.tsx, types.ts, index.ts

# Check article page exists
ls src/app/[locale]/(frontend)/articles/[slug]/
# Expected: page.tsx, not-found.tsx
```

---

## Package Dependencies

### No New Packages Required

Phase 4 uses only existing dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.x | Image component built-in |
| `react` | 19.x | Component rendering |
| `tailwindcss` | 4.x | Styling |

### Verification

```bash
# Verify next is installed with Image component
pnpm list next

# Should show next@15.x.x
```

---

## Configuration Checks

### 1. Next.js Image Configuration

Check `next.config.ts` for image settings:

```bash
cat next.config.ts | grep -A 20 "images"
```

**Required Configuration**:

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
    ],
    // Optional: custom loader for Cloudflare
    // loader: 'custom',
    // loaderFile: './src/lib/cloudflare-image-loader.ts',
  },
  // ... other config
}

export default nextConfig
```

**If missing**, add the `images` configuration block.

### 2. Payload Media Collection

Verify Media collection returns proper fields:

```typescript
// Check src/collections/Media.ts or similar
// Should include: url, alt, width, height, mimeType
```

**Expected Payload Media Response**:

```json
{
  "id": 1,
  "filename": "hero-image.jpg",
  "url": "https://your-r2-bucket.r2.cloudflarestorage.com/hero-image.jpg",
  "alt": "Description of the image",
  "width": 1200,
  "height": 630,
  "mimeType": "image/jpeg",
  "filesize": 125000
}
```

### 3. Article Collection FeaturedImage Field

Verify Articles collection has `featuredImage` field:

```typescript
// In src/collections/Articles.ts
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  // Should be populated on fetch
}
```

---

## Development Server

### Start Development Server

```bash
# Standard development
pnpm dev

# Clean start (if issues)
pnpm devsafe
```

### Test Data Requirements

For testing images, you need:

1. **At least one article with a featured image**
2. **At least one article with inline images in content**

#### Seeding Test Data

```bash
# Run seed script if available
pnpm seed

# Or manually create via admin panel:
# 1. Go to http://localhost:3000/admin
# 2. Create/upload a Media item
# 3. Create an Article with the Media as featuredImage
# 4. Add an upload block in the article content
```

---

## File Structure Verification

### Before Starting

```
src/
├── app/
│   ├── [locale]/
│   │   └── (frontend)/
│   │       └── articles/
│   │           └── [slug]/
│   │               └── page.tsx       ✓ exists
│   └── globals.css                    ✓ exists
├── components/
│   ├── articles/
│   │   ├── ArticleHeader.tsx          ✓ exists
│   │   ├── ArticleFooter.tsx          ✓ exists
│   │   ├── types.ts                   ✓ exists
│   │   └── index.ts                   ✓ exists
│   └── richtext/
│       ├── RichText.tsx               ✓ exists
│       ├── serialize.tsx              ✓ exists
│       ├── types.ts                   ✓ exists (with UploadNode)
│       └── nodes/
│           └── index.ts               ✓ exists
└── lib/
    └── (cloudflare-image-loader.ts)   ? may need creation
```

### After Phase 4

```
src/
├── app/
│   ├── [locale]/
│   │   └── (frontend)/
│   │       └── articles/
│   │           └── [slug]/
│   │               └── page.tsx       ✓ modified
│   └── globals.css                    ✓ modified
├── components/
│   ├── articles/
│   │   ├── ArticleHero.tsx            ★ new
│   │   ├── ArticleHeader.tsx
│   │   ├── ArticleFooter.tsx
│   │   ├── types.ts                   ✓ modified
│   │   └── index.ts                   ✓ modified
│   └── richtext/
│       ├── RichText.tsx               ✓ modified
│       ├── serialize.tsx              ✓ modified
│       ├── types.ts
│       └── nodes/
│           ├── ImageBlock.tsx         ★ new
│           └── index.ts               ✓ modified
└── lib/
    └── cloudflare-image-loader.ts     ★ new (or verified)
```

---

## TypeScript Configuration

### Verify Path Aliases

Check `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

### Verify Strict Mode

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## Environment Variables

### Required Variables

No new environment variables needed for Phase 4.

### Existing Variables (verify)

```bash
# Check .env or .env.local
cat .env | grep -E "PAYLOAD|CLOUDFLARE"
```

Expected:
- `PAYLOAD_SECRET` - For Payload CMS
- `CLOUDFLARE_ACCOUNT_ID` - For Cloudflare services (if using CF Images)

---

## Cloudflare Images Setup (Optional)

If using Cloudflare Images for optimization:

### 1. Enable Cloudflare Images

In Cloudflare Dashboard:
1. Go to Images
2. Enable Cloudflare Images
3. Note your Account Hash (for `imagedelivery.net` URLs)

### 2. Enable Image Resizing (Alternative)

In Cloudflare Dashboard:
1. Go to Speed > Optimization
2. Enable Image Resizing
3. Images served via your domain will be auto-optimized

### 3. R2 Bucket Configuration

Verify R2 bucket is configured in `wrangler.jsonc`:

```jsonc
{
  "r2_buckets": [
    {
      "binding": "R2_BUCKET",
      "bucket_name": "your-bucket-name"
    }
  ]
}
```

---

## IDE Setup

### VS Code Extensions (Recommended)

- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **ES7+ React/Redux/React-Native snippets**: Component snippets
- **Image preview**: Preview images in editor

### Settings

```json
// .vscode/settings.json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

---

## Pre-Flight Checklist

Before starting implementation:

- [ ] Development server runs without errors
- [ ] Article page loads with existing content
- [ ] Images display in Payload admin panel
- [ ] At least one article has a featured image
- [ ] `next.config.ts` has image configuration
- [ ] TypeScript compiles without errors
- [ ] No pending changes from previous phases

### Quick Verification Commands

```bash
# 1. Check TypeScript
pnpm exec tsc --noEmit

# 2. Check linting
pnpm lint

# 3. Build test
pnpm build

# 4. Start dev server
pnpm dev
```

---

## Troubleshooting

### Images Not Loading

1. **Check remotePatterns in next.config.ts**
   - Must include R2 bucket domain
   - Must include imagedelivery.net if using CF Images

2. **Check CORS on R2 bucket**
   - May need CORS configuration for development

3. **Check Payload populate**
   - Ensure `depth: 1` or higher when fetching articles
   - Featured image must be populated, not just ID

### Next.js Image Errors

1. **"Invalid src prop"**
   - URL must match remotePatterns
   - Add missing domain to config

2. **"Image with src has no width or height"**
   - Always provide width/height props
   - Use fill prop for responsive images

3. **"Hostname not configured"**
   - Add hostname to remotePatterns array

### Build Errors

1. **Type errors with UploadNode**
   - Ensure types.ts has UploadNode definition
   - Check value interface includes all used fields

2. **Module not found**
   - Check export in index.ts files
   - Verify import paths are correct

---

## Quick Reference

### Key Files to Reference

| File | Purpose |
|------|---------|
| `src/components/richtext/types.ts` | UploadNode type definition |
| `src/components/articles/types.ts` | ArticleData type |
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Current page implementation |
| `src/components/richtext/serialize.tsx` | Current serializer |
| `next.config.ts` | Image configuration |

### Key Documentation

| Doc | Location |
|-----|----------|
| Next.js Image | https://nextjs.org/docs/app/building-your-application/optimizing/images |
| Cloudflare Images | https://developers.cloudflare.com/images/ |
| Tailwind Typography | https://tailwindcss.com/docs/plugins#typography |

---

**Environment Setup Created**: 2025-12-10
**Last Updated**: 2025-12-10
